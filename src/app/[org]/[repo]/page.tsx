"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Background from "@/components/Background";
import { getDependencyList } from "@/lib/api";
import { useSession, signIn } from "next-auth/react";

interface DependencyPageProps {
  params: {
    org: string;
    repo: string;
  };
}

interface Contributor {
  username: string;
  avatarUrl: string;
}

interface Dependency {
  name: string;
  contributors: Contributor[];
  contributionPercentage: number;
  lastUpdated: string;
}

/**
 * Dependency List Page
 * Displays a list of dependency packages for a specific GitHub repository
 */
export default function DependencyListPage({ params }: DependencyPageProps) {
  const { org, repo } = params;
  const { data: session, status } = useSession();
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCreatedWallet, setHasCreatedWallet] = useState(false);

  // Check if user is logged in
  const isLoggedIn = status === 'authenticated' && !!session;

  // Function to generate GitHub avatar URL
  const getGithubAvatarUrl = (username: string) => {
    // Use more reliable GitHub avatar URL format
    return `https://avatars.githubusercontent.com/${encodeURIComponent(
      username
    )}`;
  };

  // Default avatar URL - using Next.js built-in icon or project's existing image
  const defaultAvatarUrl = "/vercel.svg";

  // Get dependency data from API
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setIsLoading(true);
        const result = await getDependencyList(org, repo);
        if (result.success) {
          // Process data returned from API, ensure contributors is in array format
          const processedData = result.data.list.map((item: any) => {
            // If contributors from API is not in array format, convert it to array format
            let contributors: Contributor[] = [];

            // Simulate multiple contributor data (for demo purposes only)
            if (item.contributor) {
              // Main contributor
              contributors.push({
                username: item.contributor,
                avatarUrl: getGithubAvatarUrl(item.contributor),
              });

              // For demonstration effect, add some randomly generated contributors
              const randomContributors = [
                "octocat",
                "torvalds",
                "gaearon",
                "yyx990803",
                "sindresorhus",
                "tj",
                "defunkt",
                "mojombo",
                "pjhyett",
                "wycats",
              ];

              // Randomly select 2-6 additional contributors
              const count = Math.floor(Math.random() * 5) + 2;
              for (let i = 0; i < count; i++) {
                const randomIndex = Math.floor(
                  Math.random() * randomContributors.length
                );
                const username = randomContributors[randomIndex];

                // Ensure no duplicates
                if (!contributors.some((c) => c.username === username)) {
                  contributors.push({
                    username,
                    avatarUrl: getGithubAvatarUrl(username),
                  });
                }
              }
            } else if (Array.isArray(item.contributors)) {
              contributors = item.contributors.map((c: any) => ({
                username: typeof c === "string" ? c : c.username || "unknown",
                avatarUrl: getGithubAvatarUrl(
                  typeof c === "string" ? c : c.username || "unknown"
                ),
              }));
            } else {
              // Default case, create an anonymous contributor with default avatar
              contributors = [
                {
                  username: "Anonymous Contributor",
                  avatarUrl: defaultAvatarUrl,
                },
              ];
            }

            return {
              ...item,
              contributors,
            };
          });

          setDependencies(processedData);
          setIsProjectOwner(result.data.isProjectOwner); // Set project owner view flag
          setError(null);
        } else {
          setError(result.message || "Failed to get dependency data");
          setDependencies([]);
        }
      } catch (err) {
        setError("Failed to get dependency data");
        console.error("Failed to fetch dependencies:", err);
        setDependencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencies();
  }, [org, repo]);

  // Check if user has created a wallet
  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        // Check if multisig wallet has been created
        try {
          // First try to get status from sessionStorage
          const workflowStatus = sessionStorage.getItem(`workflow_${org}_${repo}`);
          setHasCreatedWallet(workflowStatus === 'started');
          
          // In production environment, this should call API to get workflow status saved on server
          // Example: const result = await getWorkflowStatus(org, repo);
          // setHasCreatedWallet(result.data.status === 'started');
        } catch (e) {
          console.error('Failed to check wallet status:', e);
          setHasCreatedWallet(false);
        }
      } catch (error) {
        console.error('Failed to check wallet status:', error);
      }
    };
    
    checkWalletStatus();
  }, [org, repo]);

  // Handle starting workflow
  const handleStartWorkflow = async () => {
    try {
      if (!isLoggedIn) {
        // Use NextAuth for GitHub authorization login
        // Pass current page path for redirection after authorization
        setIsLoading(true);
        const result = await signIn('github', { 
          callbackUrl: `/${org}/${repo}`,
          redirect: false // Set to false first to check result
        });
        
        if (result?.error) {
          console.error('Login failed:', result.error);
          // Show error message, but can still continue
          alert(`Login failed: ${result.error}. Please refresh the page and try again.`);
        } else if (result?.url) {
          // Manually redirect to returned URL
          window.location.href = result.url;
        }
        return;
      }
      
      // If already logged in, jump to multisig wallet page
      window.location.href = `/${org}/${repo}/wallet`;
    } catch (error) {
      console.error('Workflow start failed:', error);
      setIsLoading(false);
      // Show error to user
      alert('Operation failed, please try again later');
    }
  };

  // Render contributor avatars
  const renderContributors = (contributors: Contributor[]) => {
    // Limit to displaying maximum 5 contributor avatars
    const displayContributors = contributors.slice(0, 5);
    const remainingCount =
      contributors.length - 5 > 0 ? contributors.length - 5 : 0;

    return (
      <div className="flex -space-x-2 relative">
        {displayContributors.map((contributor, index) => {
          // Use first letter as backup display
          const initial = contributor.username.charAt(0).toUpperCase();

          return (
            <div
              key={index}
              className="relative z-10 rounded-full border-2 border-white hover:z-20 transition-transform hover:scale-110"
              style={{ zIndex: 10 - index }}
              title={contributor.username}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 relative flex items-center justify-center">
                {/* Always display first letter as backup */}
                <span className="text-xs font-medium text-gray-500">
                  {initial}
                </span>

                {/* Use regular img tag instead of Next.js Image component to avoid configuration issues */}
                <img
                  src={contributor.avatarUrl}
                  alt={contributor.username}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Hide image when loading fails, display first letter in background
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div
            className="relative z-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 border-2 border-white"
            title={`${remainingCount} more contributors`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Repository information card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {org}/{repo}
            </h1>
            <p className="text-gray-600">Dependency List</p>
          </div>

          {/* If user has created wallet, show workflow status indicator */}
          {hasCreatedWallet && (
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Workflow in progress
              </span>
            </div>
          )}
        </div>

        {/* List card */}
        <div className="relative bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-100 bg-gray-50/80">
            <div className="col-span-4 font-semibold text-gray-900">
              Dependency Name
            </div>
            <div className="col-span-3 font-semibold text-gray-900">Contributor</div>
            <div className="col-span-2 font-semibold text-gray-900">Contribution</div>
            <div className="col-span-3 font-semibold text-gray-900">
              Last Updated
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="px-8 py-10 text-center text-gray-500">
              <div className="inline-block animate-spin mr-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              Loading dependency data...
            </div>
          )}

          {/* Error message */}
          {!isLoading && error && (
            <div className="px-8 py-10 text-center text-red-500">
              <svg
                className="w-6 h-6 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Data items */}
          {!isLoading && !error && dependencies.length === 0 && (
            <div className="px-8 py-10 text-center text-gray-500">
              No dependency data found
            </div>
          )}

          {!isLoading && !error && dependencies.length > 0 && (
            <div className="divide-y divide-gray-100">
              {dependencies.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-primary/10 transition items-center"
                >
                  <div className="col-span-4">
                    <Link
                      href={
                        isProjectOwner
                          ? `/${org}/${repo}/workflow/${item.name}`
                          : `/${org}/${repo}/${item.name}`
                      }
                      className="text-primary hover:text-secondary font-medium"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="col-span-3">
                    {renderContributors(item.contributors)}
                  </div>
                  <div className="col-span-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${item.contributionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-span-3 text-gray-600">
                    {item.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination - only shown when there's enough data */}
        {!isLoading && !error && dependencies.length > 20 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">
                Previous
              </button>
              <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow">
                1
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">
                2
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">
                3
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Start workflow button - only shown when not project owner and not created wallet */}
        {!isProjectOwner && !hasCreatedWallet && (
          <div className="fixed z-10 bottom-10 left-0 right-0 flex justify-center">
            <button
              onClick={handleStartWorkflow}
              className="px-8 py-4 bg-white/80 backdrop-blur-lg text-primary border border-primary/30 rounded-full font-bold shadow-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Donate
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
