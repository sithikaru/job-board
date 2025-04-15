'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: '',
    description: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Check for authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all jobs from the public endpoint
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle job creation
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/jobs/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create job');
        return;
      }
      // Clear form after creation
      setFormData({
        title: '',
        company: '',
        location: '',
        job_type: '',
        description: '',
      });
      // Refresh the job list
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Error creating job');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`/api/jobs/admin/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to delete job:', data.message);
        return;
      }
      // Refresh job list after deletion
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Job Card */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Create a New Job
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleCreateJob} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 
                           text-gray-900 placeholder-gray-500 
                           focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Ceylon Developers"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2
                           text-gray-900 placeholder-gray-500 
                           focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Colombo"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2
                           text-gray-900 placeholder-gray-500 
                           focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Job Type
              </label>
              <input
                type="text"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                placeholder="e.g. Full-time"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2
                           text-gray-900 placeholder-gray-500
                           focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief job details..."
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 
                           text-gray-900 placeholder-gray-500 
                           focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md 
                         hover:bg-indigo-700 focus:outline-none"
            >
              Create Job
            </button>
          </form>
        </section>

        {/* Existing Jobs Card */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Existing Jobs
          </h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600">No jobs available.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-md p-4 
                             flex justify-between items-start 
                             hover:shadow-sm transition"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.company} - {job.location}
                    </p>
                    <p className="text-sm text-gray-500 italic mb-2">
                      {job.job_type}
                    </p>
                    <p className="text-sm text-gray-700">{job.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="ml-4 py-1 px-3 bg-red-500 text-white 
                               rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
