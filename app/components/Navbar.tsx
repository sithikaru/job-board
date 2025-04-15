'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Update authentication status whenever the route changes or localStorage is updated
  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Check auth on mount and on every route change
    updateAuthStatus();

    // Listen for storage events (e.g., changes in localStorage from other tabs)
    window.addEventListener('storage', updateAuthStatus);

    return () => window.removeEventListener('storage', updateAuthStatus);
  }, [pathname]);

  // Helper: return Tailwind classes based on whether the link is active
  const linkClasses = (href: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      pathname === href
        ? 'border-indigo-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Optionally, redirect to login after logout.
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and navigation links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold text-gray-900">Job Board</span>
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={linkClasses('/')}>
                Home
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" className={linkClasses('/dashboard')}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right side: Authentication links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
