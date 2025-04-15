// app/page.tsx
import React from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
}

// This async function fetches job listings from your API endpoint.
// We're setting cache: 'no-store' to always get the latest data.
// In production, you may adjust caching as needed.
async function getJobs() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/jobs`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch jobs');
  }

  const { jobs } = await res.json();
  return jobs;
}

export default async function HomePage() {
  let jobs: Job[] = [];
  try {
    jobs = await getJobs();
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Job Board</h1>
          <p className="mt-2 text-lg text-gray-600">Find the perfect job for you</p>
        </header>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500">No jobs available at the moment.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
              >
                <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                <p className="mt-1 text-gray-600">{job.company}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {job.location} • {job.job_type}
                </p>
                <p className="mt-4 text-gray-700">{job.description}</p>
                <p className="mt-4 text-xs text-gray-400">
                  Posted on: {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
