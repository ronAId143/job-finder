const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

async function fetchNetflixJobs() {
  const jobs = [];
  try {
    const res = await axios.get('https://jobs.netflix.com/search?q=ai');
    const $ = cheerio.load(res.data);
    $('a[data-testid="job-link"]').each((_, el) => {
      const title = $(el).find('h3').text();
      const link = 'https://jobs.netflix.com' + $(el).attr('href');
      const location = $(el).find('p').first().text();
      jobs.push({
        title: title.trim(),
        company: 'Netflix',
        description: `Location: ${location}`,
        link,
        score: 'TBD',
        primary: '',
        secondary: ''
      });
    });
  } catch (err) {
    console.error('Netflix job scrape failed:', err.message);
  }
  return jobs;
}

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Example: convert buffer to text and match if contains 'AI'
  const resumeText = req.files.resume.data.toString('utf8').toLowerCase();

  let results = [];
  const netflixJobs = await fetchNetflixJobs();

  results = netflixJobs.filter(job =>
    resumeText.includes('ai') || resumeText.includes('machine learning')
  );

  return res.json({ extracted: JSON.stringify({ jobs: results.slice(0, 5) }) });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});