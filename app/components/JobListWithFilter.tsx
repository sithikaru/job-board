'use client';

import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
}

interface JobListWithFilterProps {
  jobs: Job[];
}

export default function JobListWithFilter({ jobs }: JobListWithFilterProps) {
  // States for job type filtering
  const [selectedType, setSelectedType] = useState<string>('');
  const [typeSearch, setTypeSearch] = useState<string>('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);

  // States for location filtering
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);

  // Dynamically create distinct options from job listings
  const jobTypeOptions = Array.from(new Set(jobs.map(job => job.job_type)));
  const locationOptions = Array.from(new Set(jobs.map(job => job.location)));

  // Filter options based on search input
  const filteredJobTypeOptions = jobTypeOptions.filter(type =>
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );
  const filteredLocationOptions = locationOptions.filter(loc =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Filtered jobs based on selected filters
  const filteredJobs = jobs.filter(job => {
    const matchesType = selectedType ? job.job_type === selectedType : true;
    const matchesLocation = selectedLocation ? job.location === selectedLocation : true;
    return matchesType && matchesLocation;
  });

  // Clear all filters and close dropdowns
  const handleClearFilters = () => {
    setSelectedType('');
    setTypeSearch('');
    setSelectedLocation('');
    setLocationSearch('');
    setIsTypeDropdownOpen(false);
    setIsLocationDropdownOpen(false);
  };

  return (
    <div>
      {/* Filters: Two separate searchable dropdowns + Clear Filters button */}
      <div className="mb-6 flex gap-4 items-center">
        {/* Job Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="w-64 px-4 py-2 border border-gray-300 rounded-md text-left bg-white text-gray-700 hover:bg-gray-100"
          >
            {selectedType || 'Filter by job type'}
          </button>
          {isTypeDropdownOpen && (
            <div className="absolute mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-md z-10">
              <input
                type="text"
                placeholder="Search job type"
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none text-gray-700"
              />
              <ul className="max-h-60 overflow-y-auto">
                {filteredJobTypeOptions.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-gray-500">No options found</li>
                ) : (
                  filteredJobTypeOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedType(option);
                        setIsTypeDropdownOpen(false);
                        setTypeSearch('');
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))
                )}
                {/* Clear filter option */}
                <li
                  onClick={() => {
                    setSelectedType('');
                    setIsTypeDropdownOpen(false);
                    setTypeSearch('');
                  }}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Clear filter
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="w-64 px-4 py-2 border border-gray-300 rounded-md text-left bg-white text-gray-700 hover:bg-gray-100"
          >
            {selectedLocation || 'Filter by location'}
          </button>
          {isLocationDropdownOpen && (
            <div className="absolute mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-md z-10">
              <input
                type="text"
                placeholder="Search location"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none text-gray-700"
              />
              <ul className="max-h-60 overflow-y-auto">
                {filteredLocationOptions.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-gray-500">No options found</li>
                ) : (
                  filteredLocationOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedLocation(option);
                        setIsLocationDropdownOpen(false);
                        setLocationSearch('');
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))
                )}
                {/* Clear filter option */}
                <li
                  onClick={() => {
                    setSelectedLocation('');
                    setIsLocationDropdownOpen(false);
                    setLocationSearch('');
                  }}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Clear filter
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Clear All Filters Button */}
        <button
          type="button"
          onClick={handleClearFilters}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Display Filtered Jobs */}
      {filteredJobs.length === 0 ? (
        <div className="text-center text-gray-500">No jobs match your filters.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
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
  );
}
