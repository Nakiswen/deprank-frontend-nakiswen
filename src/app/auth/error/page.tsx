'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Background from '@/components/Background';

/**
 * Authentication Error Page
 * Handles and displays errors that occur during authentication
 */
export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get error type and message
    const errorType = searchParams.get('error');
    
    // Set friendly error message based on error type
    if (errorType) {
      switch (errorType) {
        case 'Configuration':
          setError('Server configuration error, please contact the administrator');
          break;
        case 'AccessDenied':
          setError('Access denied, you may not have sufficient permissions');
          break;
        case 'Verification':
          setError('Verification link is invalid or has expired');
          break;
        case 'OAuthSignin':
          setError('An error occurred during OAuth signing process');
          break;
        case 'OAuthCallback':
          setError('Invalid data received from OAuth provider');
          break;
        case 'OAuthCreateAccount':
          setError('Unable to create OAuth account');
          break;
        case 'OAuthAccountNotLinked':
          setError('This email is associated with another account');
          break;
        case 'EmailCreateAccount':
          setError('Unable to create account');
          break;
        case 'Callback':
          setError('An error occurred during callback processing');
          break;
        case 'CredentialsSignin':
          setError('Invalid login credentials');
          break;
        default:
          setError('Unknown error occurred during authentication');
      }
    } else {
      setError('An unknown error occurred');
    }
  }, [searchParams]);
  
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 px-8 py-6 max-w-md w-full">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
            >
              Return to Previous Page
            </button>
            
            <Link href="/"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors w-full text-center"
            >
              Return to Homepage
            </Link>
            
            <button
              onClick={() => router.push('/?auth=signin')}
              className="px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 