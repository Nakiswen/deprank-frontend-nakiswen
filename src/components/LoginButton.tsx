'use client';

import { useState, useEffect } from 'react';
import auth from '@/lib/auth';

/**
 * GitHub login button component
 * Implements GitHub OAuth login using Better Auth
 */
interface LoginButtonProps {
  className?: string;
  onSuccess?: () => void;
}

export default function LoginButton({ className = '', onSuccess }: LoginButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in and update user information
    const checkAuthStatus = async () => {
      try {
        const session = await auth.getSession();
        if (session) {
          setIsLoggedIn(true);
          setUserName(session.login);
          setDisplayName(session.name);
          setAvatarUrl(session.avatar);
        console.log("User session info:", session); // Add log for debugging
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setDisplayName('');
        setAvatarUrl('');
        }
      } catch (error) {
        console.error('Failed to check login status:', error);
      }
    };
    
  // Check on initial load and when login status changes
  useEffect(() => {
    checkAuthStatus();
    
    // Register storage event listener to update when login status is changed in other components
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle login - using Better Auth for GitHub login
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Use Better Auth for GitHub login
      await auth.login('github');
      
      // Note: No additional handling needed here
      // auth.login will redirect to GitHub, and return to the callback page after successful login
    } catch (error) {
      console.error('Login redirection failed:', error);
      alert('Login failed, please try again');
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.logout();
      setIsLoggedIn(false);
      setUserName('');
      setDisplayName('');
      setAvatarUrl('');
      // Trigger storage event to notify other components that login status has changed
      window.dispatchEvent(new Event('storage'));
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        {avatarUrl && (
          <img 
            src={avatarUrl} 
            alt={`${displayName || userName}'s avatar`} 
            className="w-8 h-8 rounded-full border border-gray-200"
          />
        )}
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium text-sm">
            {displayName || userName}
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className={`bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg transition-all duration-200 text-sm ${className}`}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
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
          Login with GitHub
        </>
      )}
    </button>
  );
} 