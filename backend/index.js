const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const resumeText = req.files.resume.data.toString('utf8');

  // Simulate job matching
  const jobs = [
    {
      title: 'AI Product Manager',
      company: 'Netflix',
      score: '92%',
      description: 'Manage AI-powered features for content personalization.',
      primary: 'hiring@netflix.com',
      secondary: 'ai-lead@netflix.com',
      link: 'https://jobs.netflix.com/ai-product-manager'
    },
    {
      title: 'Technical Artist',
      company: 'Disney Animation',
      score: '88%',
      description: 'Bridge tech and creative teams for animated features.',
      primary: 'careers@disney.com',
      secondary: '',
      link: 'https://jobs.disneycareers.com/technical-artist'
    }
  ];

  const result = { jobs };

  return res.json({ extracted: JSON.stringify(result) });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});