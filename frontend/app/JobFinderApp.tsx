
'use client';

import { useState } from 'react';

export default function JobFinderApp() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setError('Please upload a PDF or DOCX resume.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await fetch('https://your-backend-url.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.extracted) {
        const parsed = JSON.parse(data.extracted);
        setKeywords(parsed);

        const sampleJobs = [
          {
            title: 'Content Producer',
            company: 'Netflix',
            link: 'https://jobs.netflix.com/creative',
            matchScore: 82,
          },
          {
            title: 'AI Production Assistant',
            company: 'Disney',
            link: 'https://jobs.disneycareers.com',
            matchScore: 78,
          },
          {
            title: 'Marketing Strategist',
            company: 'Universal',
            link: 'https://jobs.universalentertainment.com',
            matchScore: 75,
          }
        ];
        setJobResults(sampleJobs);
      } else {
        setError('Could not extract keywords from resume.');
      }
    } catch (err) {
      setError('Upload failed or backend not responding.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>📄 AI Resume Matcher</h1>
      <p>Upload your resume and we’ll analyze it using OpenAI to match you with jobs.</p>

      <input type='file' accept='.pdf,.doc,.docx' onChange={handleFileChange} style={{ marginTop: '16px' }} />
      <button onClick={handleUpload} style={{ marginTop: '16px', padding: '10px 20px', background: '#222', color: '#fff' }}>
        {loading ? 'Analyzing…' : 'Upload Resume'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

      {keywords && (
        <div style={{ marginTop: '24px' }}>
          <h3>Extracted Keywords</h3>
          <pre style={{ background: '#f4f4f4', padding: '12px' }}>{JSON.stringify(keywords, null, 2)}</pre>
        </div>
      )}

      {jobResults.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3>Matching Jobs</h3>
          {jobResults.map((job, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <h4>{job.title} @ {job.company}</h4>
              <p>Match Score: {job.matchScore}%</p>
              <a href={job.link} target='_blank' rel='noreferrer'>View Job</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
