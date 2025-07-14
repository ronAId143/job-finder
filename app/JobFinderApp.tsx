
'use client';

import { useState } from 'react';

export default function JobFinderApp() {
  const [resumeText, setResumeText] = useState('');
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const exampleJobs = [
    {
      title: 'Product Manager - AI Tools',
      company: 'OpenAI',
      link: 'https://openai.com/careers/product-manager',
      matchScore: 87,
      contact: {
        name: 'Jane Doe',
        title: 'Director of Product',
        linkedin: 'https://linkedin.com/in/janedoe',
      },
    },
    {
      title: 'UX Designer',
      company: 'Google',
      link: 'https://careers.google.com/jobs/ux-designer',
      matchScore: 75,
      contact: {
        name: 'Mark Lee',
        title: 'UX Lead',
        linkedin: 'https://linkedin.com/in/marklee',
      },
    },
  ];

  const findJobs = () => {
    setLoading(true);
    setTimeout(() => {
      setJobResults(exampleJobs);
      setLoading(false);
    }, 1500);
  };

  const getEmailTemplate = (name, title, company, jobTitle) => {
    return `Subject: Interest in ${jobTitle} at ${company}

Hi ${name},

I recently came across the ${jobTitle} opening at ${company} and felt it aligned perfectly with my background in design and technology. I'm passionate about solving real-world problems and would love to learn more about your team's work.

Would you be open to a quick chat, or could you point me to the right contact?

Warm regards,
[Your Name]
[Your LinkedIn Profile]
[Phone Number]`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>🔍 AI Job Finder</h1>
      <p style={{ marginBottom: '8px', color: '#555' }}>Paste your resume text below. We'll match it with current job postings and show you who to contact.</p>
      <textarea
        placeholder='Paste your resume here...'
        rows={6}
        style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <button onClick={findJobs} disabled={loading} style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px' }}>
        {loading ? 'Searching...' : 'Find Jobs'}
      </button>

      <div style={{ marginTop: '32px' }}>
        {jobResults.map((job, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{job.title} @ {job.company}</h2>
            <p style={{ fontSize: '14px', color: '#777' }}>Match Score: {job.matchScore}%</p>
            <a href={job.link} target='_blank' rel='noreferrer' style={{ color: '#0066cc', fontSize: '14px' }}>View Job Posting</a>
            <div style={{ marginTop: '8px' }}>
              <p><strong>Contact:</strong> {job.contact.name} – {job.contact.title}</p>
              <a href={job.contact.linkedin} target='_blank' rel='noreferrer' style={{ color: '#0066cc', fontSize: '14px' }}>LinkedIn Profile</a>
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '14px', color: '#444' }}>Cold Email Template</summary>
                <pre style={{ background: '#f9f9f9', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{getEmailTemplate(job.contact.name, job.contact.title, job.company, job.title)}
                </pre>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
