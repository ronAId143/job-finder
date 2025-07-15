
const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function extractTextFromFile(file) {
  const ext = path.extname(file.name).toLowerCase();
  if (ext === '.pdf') {
    const data = await pdfParse(file.data);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer: file.data });
    return result.value;
  } else {
    throw new Error('Unsupported file format');
  }
}

app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resumeText = await extractTextFromFile(req.files.resume);

    const prompt = \`
Extract and summarize the following resume into a list of skills, job titles, and relevant keywords. Respond in JSON format with keys: "skills", "titles", "keywords".

\n\nResume:
\${resumeText}
\`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const result = response.data.choices[0].message.content;
    res.json({ extracted: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

app.get('/', (req, res) => {
  res.send('Job Finder Backend is running.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
