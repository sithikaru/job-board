// app/page.tsx
import React from 'react';
import JobListWithFilter from '../app/components/JobListWithFilter';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
}

// app/page.tsx
async function getJobs() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://job-board-git-main-zijja3dgmailcoms-projects.vercel.app';
  const res = await fetch(`${baseUrl}/api/jobs`, {
    // forces dynamic rendering
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
    <main className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Job Board</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find the perfect job for you
          </p>
        </header>

        {/* Job Listings with Filtering */}
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500">
            No jobs available at the moment.
          </div>
        ) : (
          <JobListWithFilter jobs={jobs} />
        )}
      </div>
    </main>
  );
}
