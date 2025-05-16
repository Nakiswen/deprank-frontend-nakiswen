'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import Background from '@/components/Background';
import { getDependencyDetails } from '@/lib/api';
import '@/styles/highlight.css';
import { useSession } from 'next-auth/react';

interface DependencyDetailPageProps {
  params: {
    org: string;
    repo: string;
    dependency: string;
  };
}

// Dependency information interface definition
interface DependencyInfo {
  name: string;
  contributor: string;
  contributorName?: string;
  contributorAvatar?: string;
  contributionPercentage: number;
  lastUpdated: string;
  description: string;
  version: string;
  contributors?: Array<{
    username: string;
    name?: string;
    avatar?: string;
    contributionPercentage?: number;
  }>;
  codeSnippets: Array<{
    code: string;
    language: string;
    fileName: string;
  }>;
}

// Define contributor interface
interface Contributor {
  username: string;
  name?: string;
  avatar?: string;
  contributionPercentage?: number;
}

/**
 * Dependency Detail Page
 * Displays detailed information and code snippets for a specific dependency package
 */
export default function DependencyDetailPage({ params }: DependencyDetailPageProps) {
  const { org, repo, dependency } = params;
  const { data: session, status } = useSession();
  
  // State management
  const [dependencyInfo, setDependencyInfo] = useState<DependencyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContributor, setIsContributor] = useState(false);

  // Get dependency information and check user identity
  useEffect(() => {
    const fetchDependencyInfo = async () => {
      try {
        setIsLoading(true);
        
        const dependencyId = `${org}/${repo}`;
        // Use getDependencyDetails method from the api module to get dependency information
        const result = await getDependencyDetails(dependencyId);
        
        if (!result.success || !result.data) {
          throw new Error(result.message || 'Could not find this dependency information');
        }
        
        // Get dependency information
        const dependencyData = result.data;
        
        // Parse contributor's GitHub username (remove @ prefix)
        const contributorUsername = dependencyData.contributor.startsWith('@')
          ? dependencyData.contributor.substring(1)
          : dependencyData.contributor;
        
        // Process code snippet data, if it's a single code snippet, convert to array format
        let codeSnippets = [];
        if (dependencyData.codeSnippet) {
          codeSnippets = [{
            code: dependencyData.codeSnippet,
            language: 'typescript',
            fileName: `node_modules/${dependency}/example.tsx`
          }];
        } else if (Array.isArray(dependencyData.codeSnippets)) {
          codeSnippets = dependencyData.codeSnippets;
        }
        
        // Process contributor information
        let contributors: Contributor[] = [];
        if (dependencyData.contributors && Array.isArray(dependencyData.contributors)) {
          contributors = dependencyData.contributors.map((contributor: Contributor) => {
            const username = contributor.username?.startsWith('@') 
              ? contributor.username.substring(1) 
              : contributor.username;
            return {
              ...contributor,
              username,
              avatar: `https://github.com/${username}.png`
            };
          });
        } else {
          // Compatible with old data, convert single contributor to array
          contributors = [{
            username: contributorUsername,
            name: contributorUsername,
            avatar: `https://github.com/${contributorUsername}.png`,
            contributionPercentage: dependencyData.contributionPercentage
          }];
        }
        
        // Enrich dependency information
        const enrichedDependencyInfo = {
          ...dependencyData,
          contributorName: contributorUsername, // Contributor name without @ prefix
          contributorAvatar: `https://github.com/${contributorUsername}.png`, // GitHub avatar URL
          contributors, // Add processed contributors array
          codeSnippets // Ensure code snippets are in array format
        };
        
        setDependencyInfo(enrichedDependencyInfo);
        
        // Check if current user is a dependency contributor
        const isLoggedIn = status === 'authenticated' && !!session;
        
        if (isLoggedIn && session?.user?.username) {
          const userIsContributor = 
            session.user.username.toLowerCase() === contributorUsername.toLowerCase();
          setIsContributor(userIsContributor);
        }
        
      } catch (err) {
        console.error('Failed to get dependency information:', err);
        setError(err instanceof Error ? err.message : 'Error getting dependency information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDependencyInfo();
  }, [dependency, org, repo, session, status]);

  // Loading display
  if (isLoading) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
        <Background />
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading dependency information...</p>
        </div>
      </main>
    );
  }

  // Error display
  if (error || !dependencyInfo) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
        <Background />
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-lg w-full">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'Unable to get dependency information'}</p>
            <Link 
              href={`/${org}/${repo}`}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              Return to Project Page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="w-full max-w-4xl mx-auto">
        {/* Dependency information card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Link href={`/${org}/${repo}`} className="text-gray-500 hover:text-gray-700 transition-colors">
                  {org}/{repo}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {dependencyInfo.name}
                </h1>
              </div>
              <div className="text-gray-600 whitespace-nowrap">v{dependencyInfo.version}</div>
            </div>

            {dependencyInfo.description && (
              <p className="text-gray-700 mt-2">{dependencyInfo.description}</p>
            )}
          </div>
        </div>

        {/* Contribution information card */}
        <div className="bg-white/90 mb-8 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contribution Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Main Contributors
              </h3>
              <div className="space-y-3">
                {/* Display up to 5 contributors */}
                {dependencyInfo.contributors && dependencyInfo.contributors.slice(0, 5).map((contributor, index) => (
                  <div key={index} className="flex items-center">
                    <img
                      className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50"
                      src={contributor.avatar}
                      alt={`${contributor.username}'s avatar`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";
                      }}
                    />
                    <div className="ml-2">
                      <div className="text-gray-900 font-medium">@{contributor.username}</div>
                      {session && session.user?.username && session.user.username.toLowerCase() === contributor.username.toLowerCase() && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">This is you</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* When there are more than 5 contributors, show a view more button */}
                {dependencyInfo.contributors && dependencyInfo.contributors.length > 5 && (
                  <Link 
                    href={`https://github.com/${org}/${repo}/graphs/contributors`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-sm text-primary hover:text-primary-dark transition-colors"
                  >
                    <span>More contributors...</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Contribution Level
              </h3>
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${dependencyInfo.contributionPercentage}%` }}
                >
                </div>
              </div>
              <div className="mt-1 text-gray-900 text-sm">
                {dependencyInfo.contributionPercentage}% contributed by @{dependencyInfo.contributorName}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {isContributor ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      You are a contributor to this dependency package.
                      <Link
                        href={`/${org}/${repo}/${dependency}/claim`}
                        className="font-medium underline text-green-700 hover:text-green-600"
                      >
                        Click here to claim your rewards
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                You are not a contributor to this dependency package. If you believe this is an error, please contact us.
              </div>
            )}
          </div>
        </div>

        {/* Multiple code blocks display */}
        {dependencyInfo.codeSnippets && dependencyInfo.codeSnippets.length > 0 && (
          <div className="space-y-6 mb-8">
            {dependencyInfo.codeSnippets.map((snippet, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <CodeBlock
                  code={snippet.code}
                  language={snippet.language || 'typescript'}
                  startingLineNumber={1}
                  fileName={snippet.fileName || `code-example-${index + 1}.tsx`}
                  showLineNumbers={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 