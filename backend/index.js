const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const resumeText = req.files.resume.data.toString('utf8');

  const prompt = \`
Resume:
\${resumeText}

Based on this resume, suggest 3 mock job listings in JSON format with fields: title, company, score, description, primary, secondary, link.
\`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    res.json({ extracted: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process resume', details: err.message });
  }
});

app.listen(port, () => {
  console.log(\`Backend running on port \${port}\`);
});