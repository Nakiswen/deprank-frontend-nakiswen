'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * GitHub Login Button Component
 * Implements GitHub OAuth login using NextAuth
 */
interface LoginButtonProps {
  className?: string;
  onSuccess?: () => void;
}

export default function LoginButton({ className = '', onSuccess }: LoginButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determine login status: authenticated = logged in, loading = loading, unauthenticated = not logged in
  const isLoggedIn = status === 'authenticated' && !!session;
  const isAuthenticating = status === 'loading';
  
  // Get user information
  const userName = session?.user?.username || session?.user?.name || '';
  const displayName = session?.user?.name || userName;
  const avatarUrl = session?.user?.image || '';

  // Reset error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle login - Use NextAuth for GitHub login
  const handleLogin = useCallback(async () => {
    try {
      // Prevent duplicate clicks
      if (isLoading || isAuthenticating) return;
      
      setIsLoading(true);
      setError(null);
      
      // Save current page path for redirection after login
      const returnUrl = pathname || '/';
      
      // Login using GitHub OAuth
      const result = await signIn('github', { 
        callbackUrl: returnUrl,
        redirect: true 
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      setError(typeof error === 'object' && error !== null && 'message' in error 
        ? (error as Error).message 
        : 'Login failed, please try again');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isAuthenticating, pathname, onSuccess]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      // Logout and redirect to homepage
      await signOut({ callbackUrl: '/' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed, please try again');
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  // If loading session information, show loading state
  if (isAuthenticating && !isLoading) {
    return (
      <button 
        disabled
        className={`bg-gray-300 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 ${className} cursor-not-allowed`}
      >
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Verifying...
      </button>
    );
  }

  // Logged in state
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        {/* User avatar */}
        {avatarUrl && (
          <img 
            src={avatarUrl} 
            alt={`${displayName || userName}'s avatar`} 
            className="w-8 h-8 rounded-full border border-gray-200"
          />
        )}
        
        {/* Username */}
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium text-sm">
            {displayName || userName}
          </span>
          {session?.user?.email && (
            <span className="text-gray-500 text-xs hidden sm:block">
              {session.user.email}
            </span>
          )}
        </div>
        
        {/* Logout button */}
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className={`bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg transition-all duration-200 text-sm ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Sign out'}
        </button>
      </div>
    );
  }

  // Not logged in state
  return (
    <div className="flex flex-col">
      <button 
        onClick={handleLogin}
        disabled={isLoading}
        className={`bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub Login
          </>
        )}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs mt-1">
          {error}
        </div>
      )}
    </div>
  );
} 