"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function JobFinderApp() {
  const [resumeText, setResumeText] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const exampleJobs = [
    {
      title: "Product Manager - AI Tools",
      company: "OpenAI",
      link: "https://openai.com/careers/product-manager",
      matchScore: 87,
      contact: {
        name: "Jane Doe",
        title: "Director of Product",
        linkedin: "https://linkedin.com/in/janedoe"
      }
    },
    {
      title: "UX Designer",
      company: "Google",
      link: "https://careers.google.com/jobs/ux-designer",
      matchScore: 75,
      contact: {
        name: "Mark Lee",
        title: "UX Lead",
        linkedin: "https://linkedin.com/in/marklee"
      }
    }
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 AI Job Finder</h1>
      <p className="mb-2 text-gray-600">Paste your resume text below. We'll match it with current job postings and show you who to contact.</p>
      <Input
        placeholder="Paste your resume here..."
        className="mb-4"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <Button onClick={findJobs} disabled={loading}>
        {loading ? "Searching..." : "Find Jobs"}
      </Button>

      <div className="mt-6">
        {jobResults.map((job, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{job.title} @ {job.company}</h2>
              <p className="text-sm text-gray-500">Match Score: {job.matchScore}%</p>
              <a
                href={job.link}
                className="text-blue-600 underline text-sm"
                target="_blank"
              >
                View Job Posting
              </a>
              <div className="mt-2">
                <p className="font-medium">Contact: {job.contact.name} – {job.contact.title}</p>
                <a
                  href={job.contact.linkedin}
                  className="text-blue-500 text-sm underline"
                  target="_blank"
                >
                  LinkedIn Profile
                </a>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600">Cold Email Template</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
{getEmailTemplate(job.contact.name, job.contact.title, job.company, job.title)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
