
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function scrapeJobsWithPuppeteer(url, company, selector) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector(selector, { timeout: 10000 });
    const jobs = await page.evaluate((selector, company) => {
      const elements = Array.from(document.querySelectorAll(selector));
      return elements.slice(0, 10).map(el => ({
        title: el.innerText.trim(),
        company: company,
        description: `${el.innerText.trim()} role at ${company}`,
        link: el.href || '',
        primary: '',
        secondary: ''
      }));
    }, selector, company);
    await browser.close();
    return jobs;
  } catch (err) {
    console.error(`${company} Puppeteer scrape error:`, err.message);
    await browser.close();
    return [];
  }
}

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const resumeText = req.files.resume.data.toString('utf8');

  const jobSources = [
    { company: 'Disney', url: 'https://jobs.disneycareers.com/search-jobs', selector: '.job-title a' },
    { company: 'Warner Bros', url: 'https://careers.wbd.com/global/en/search-results', selector: 'a.job-title-link' },
    { company: 'Universal', url: 'https://www.nbcunicareers.com/search-results', selector: 'a.job-title' },
    { company: 'Apple', url: 'https://jobs.apple.com/en-us/search', selector: 'div.table-row a' }
  ];

  let allJobs = [];
  for (const source of jobSources) {
    const jobs = await scrapeJobsWithPuppeteer(source.url, source.company, source.selector);
    allJobs.push(...jobs);
  }

  const matches = [];
  for (const job of allJobs) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a job-matching AI. Rate the match between a resume and a job description from 0 to 100. Respond only with the number.'
          },
          {
            role: 'user',
            content: `Resume:
${resumeText}

Job Description:
${job.description}`
          }
        ]
      });

      const score = parseInt(response.choices[0].message.content.trim());
      if (score >= 25) {
        job.score = score + '%';
        matches.push(job);
      }
    } catch (err) {
      console.error('OpenAI match failed:', err.message);
    }
  }

  return res.json({ extracted: JSON.stringify({ jobs: matches }) });
});

app.listen(port, () => {
  console.log(`Puppeteer-based backend running on port ${port}`);
});
