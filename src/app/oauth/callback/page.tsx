'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Background from '@/components/Background';

/**
 * GitHub OAuth Callback Processing Page
 * Handles callback after GitHub authorization, retrieves session information and redirects
 */
export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    // Get state parameter for redirection
    const state = searchParams.get('state');
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    let redirectPath = state ? decodeURIComponent(state) : '/';
    
    // If there's an error parameter in the URL, process it immediately
    if (errorParam) {
      setError(`Authorization failed: ${errorParam}`);
      setIsLoading(false);
      return;
    }
    
    // If no authorization code is found, show error
    if (!code) {
      setError('Authorization failed: No authorization code found');
      setIsLoading(false);
      return;
    }
    
    const handleCallback = async () => {
      try {
        // Check session status
        if (status === 'loading') {
          // Wait for the session to finish loading
          return;
        }
        
        if (status === 'unauthenticated') {
          // If still unauthenticated after multiple attempts, may need to restart login flow
          if (retryCount < maxRetries) {
            // Increase retry count
            setRetryCount(prev => prev + 1);
            // Try to trigger GitHub login again
            await signIn('github', { redirect: false });
            return;
          } else {
            setError('Authorization failed, unable to get user information. Please try logging in again.');
            setIsLoading(false);
            return;
          }
        }
        
        if (status === 'authenticated' && session) {
          // Login successful, handle redirection
          console.log('Login successful, preparing to redirect to:', redirectPath);
          
          // Extract basic path parameters
          // Format should be /{org}/{repo} or /{org}/{repo}/other/path
          const pathParts = redirectPath.split('/').filter(Boolean);
          
          if (pathParts.length >= 2) {
            const [org, repo] = pathParts;
            // Redirect to wallet creation page
            router.push(`/${org}/${repo}/wallet`);
          } else {
            // If path doesn't match expected format, return to homepage
            router.push('/');
          }
        }
      } catch (err) {
        console.error('Authorization callback processing failed:', err);
        setError(err instanceof Error ? err.message : 'An error occurred during authorization processing. Please try again.');
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, session, status, retryCount]);

  // Handle manual retry
  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('github', { callbackUrl: '/', redirect: true });
    } catch (err) {
      setError('Retry failed, please return to the homepage and login again');
      setIsLoading(false);
    }
  };

  // If session status is loaded but not authenticated, or there's an error, show error message
  if ((status !== 'loading' && status === 'unauthenticated' && retryCount >= maxRetries) || error) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <Background />
        <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6 max-w-md w-full">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Authorization Failed</h1>
            <p className="text-gray-600 mb-4">{error || 'Login failed, please try again'}</p>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Try Login Again
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show loading state
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />
      <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6 max-w-md w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Processing GitHub Authorization</h1>
          <p className="text-gray-600">Please wait, processing your GitHub authorization...</p>
          
          {retryCount > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Attempt {retryCount}/{maxRetries} in progress...
            </p>
          )}
        </div>
      </div>
    </main>
  );
} 