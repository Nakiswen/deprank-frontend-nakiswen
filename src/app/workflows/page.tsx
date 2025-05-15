'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import auth from '@/lib/auth';

/**
 * My Workflow page component
 * Shows all repositories under the current GitHub account in a list view
 */
export default function MyWorkflowPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [repositories, setRepositories] = useState<Array<{
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    status: 'not_started' | 'in_progress' | 'completed';
    updated_at: string;
  }>>([]);
  
  // Add state for active filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');

  // Check if user is logged in and update user information
  const checkAuthStatus = async () => {
    try {
      const session = await auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.login);
        fetchUserRepositories(session.login);
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setError('Please login with your GitHub account first');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to get session info:', error);
      setError('Failed to get user information, please login again');
      setIsLoading(false);
    }
  };

  // Get user repository list
  const fetchUserRepositories = async (username: string) => {
    try {
      setIsLoading(true);
      // This should call your API to get the repository list and their processing status
      // The following is mock data, which should be replaced with real API calls in production
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockRepositories = [
        {
          id: 1,
          name: 'react',
          full_name: `workflows/${username}/react`,
          html_url: `https://github.com/${username}/react`,
          status: 'in_progress' as const,
          updated_at: '2023-10-15T10:20:30Z'
        },
        {
          id: 2,
          name: 'project-beta',
          full_name: `workflows/${username}/project-beta`,
          html_url: `https://github.com/${username}/project-beta`,
          status: 'not_started' as const,
          updated_at: '2023-09-18T14:25:45Z'
        },
        {
          id: 3,
          name: 'project-omega',
          full_name: `workflows/${username}/project-omega`,
          html_url: `https://github.com/${username}/project-omega`,
          status: 'completed' as const,
          updated_at: '2023-11-05T09:15:20Z'
        },
        {
          id: 4,
          name: 'project-delta',
          full_name: `workflows/${username}/project-delta`,
          html_url: `https://github.com/${username}/project-delta`,
          status: 'in_progress' as const,
          updated_at: '2023-12-01T14:30:45Z'
        },
        {
          id: 5,
          name: 'project-gamma',
          full_name: `workflows/${username}/project-gamma`,
          html_url: `https://github.com/${username}/project-gamma`,
          status: 'not_started' as const,
          updated_at: '2023-11-22T09:45:30Z'
        },
      ];
      
      setRepositories(mockRepositories);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to get repository list:', error);
      setError('Could not fetch repository list, please try again later');
      setIsLoading(false);
    }
  };
  
  // Filter repositories based on active filter
  const filteredRepositories = useMemo(() => {
    if (activeFilter === 'all') {
      return repositories;
    }
    
    return repositories.filter(repo => repo.status === activeFilter);
  }, [repositories, activeFilter]);
  
  // Get counts for each status
  const statusCounts = useMemo(() => {
    const counts = {
      all: repositories.length,
      not_started: 0,
      in_progress: 0,
      completed: 0
    };
    
    repositories.forEach(repo => {
      counts[repo.status]++;
    });
    
    return counts;
  }, [repositories]);
  
  // Check login status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Render repository status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'not_started':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Not Started
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Handle repository click
  const handleRepoClick = (fullName: string) => {
    // Navigate to repository details page
    router.push(`/${fullName}`);
  };

  if (!isLoggedIn && !isLoading) {
    return (
      <div className="relative min-h-screen pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 2h2M9 10h2"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login with your GitHub account to view your workflows</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
          <p className="text-gray-600">
            Manage your GitHub repositories and their processing status
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Status filter tabs - now with actual filtering functionality */}
            <div className="flex flex-wrap justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All Repositories
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-opacity-20 bg-white">
                    {statusCounts.all}
                  </span>
                </button>
                
                <button 
                  onClick={() => setActiveFilter('not_started')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeFilter === 'not_started' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Not Started
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-opacity-20 bg-white">
                    {statusCounts.not_started}
                  </span>
                </button>
                
                <button 
                  onClick={() => setActiveFilter('in_progress')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeFilter === 'in_progress' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  In Progress
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-opacity-20 bg-white">
                    {statusCounts.in_progress}
                  </span>
                </button>
                
                <button 
                  onClick={() => setActiveFilter('completed')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeFilter === 'completed' 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Completed
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-opacity-20 bg-white">
                    {statusCounts.completed}
                  </span>
                </button>
              </div>
              
              {/* Add new button to navigate to home for analyzing new repository */}
              <button
                onClick={() => router.push('/')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Analyze New Repo
              </button>
            </div>

            {/* Repository list - now displays filtered results */}
            {filteredRepositories.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">
                        REPOSITORY
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                        STATUS
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                        UPDATED
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRepositories.map(repo => (
                      <tr 
                        key={repo.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap w-5/12">
                          <div className="font-medium text-gray-900">{repo.name}</div>
                          <div className="text-sm text-gray-500">{repo.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap w-2/12">
                          {renderStatusBadge(repo.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-3/12">
                          {formatDate(repo.updated_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-2/12">
                          <button 
                            onClick={() => handleRepoClick(repo.full_name)}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {activeFilter === 'all' 
                    ? 'No Repositories Found' 
                    : `No ${activeFilter.replace('_', ' ')} Repositories`}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeFilter === 'all' 
                    ? 'There are no repositories under your GitHub account yet'
                    : `You don't have any repositories with "${activeFilter.replace('_', ' ')}" status`}
                </p>
                {activeFilter !== 'all' && (
                  <button 
                    onClick={() => setActiveFilter('all')} 
                    className="mt-4 text-primary hover:underline"
                  >
                    View all repositories
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 