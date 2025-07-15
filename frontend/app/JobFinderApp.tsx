'use client';

import React, { useState } from 'react';

const JobFinderApp = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);
    setError(null);
    setSubmitted(true);

    try {
      const res = await fetch('https://job-finder-backend-dnmj.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.extracted) {
        const parsed = JSON.parse(data.extracted);
        if (parsed.jobs && parsed.jobs.length > 0) {
          setJobs(parsed.jobs);
        } else {
          setError('No matching jobs found.');
        }
      } else {
        setError(data.error || 'Failed to process resume.');
      }
    } catch (err) {
      setError('Upload failed or backend not responding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '2rem'
      }}>
        <h2>Upload Your Resume</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Submit
        </button>
        {loading && <p>Processing...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div>
        {!loading && submitted && jobs.length === 0 && !error && (
          <p>No job matches found yet.</p>
        )}
        {jobs.map((job, index) => (
          <div key={index} style={{
            background: 'white', marginBottom: '1rem', padding: '1rem',
            borderRadius: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {job.title} @ {job.company}
            </div>
            <div style={{ fontWeight: 'bold', color: 'green' }}>Match Score: {job.score}</div>
            <p>{job.description}</p>
            <p><strong>Primary Contact:</strong> {job.primary}</p>
            <p><strong>Secondary Contact:</strong> {job.secondary || 'N/A'}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer">View Job</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFinderApp;
