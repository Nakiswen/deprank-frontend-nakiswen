'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginButton from './LoginButton';
import auth from '@/lib/auth';

/**
 * Top navigation bar component
 * Contains Logo and navigation links
 */
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Check if user is logged in
  const checkAuthStatus = async () => {
    try {
      const session = await auth.getSession();
      setIsLoggedIn(!!session);
      setUser(session);
      console.log("User session in Navbar:", session); // For debugging
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };
    
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for login status changes
    const handleStorageChange = () => {
      console.log("Navbar detected storage change, updating state"); // For debugging
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current !== event.target &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 shadow-md backdrop-blur-xl border-b border-gray-200 bg-white/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center select-none">
            <div className="mr-2 w-10 h-10">
              <Image
                src="/assets/logo.svg"
                alt="DepRank Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
                style={{ marginTop: "0.2rem", transform: "scale(.85)" }}
              />
            </div>
            <div className="flex" style={{width:160, height:40}}>
              <svg viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="26" fontFamily="Montserrat, Orbitron, Arial, sans-serif" fontSize="26" fontWeight="bold" letterSpacing="2" fill="#111">
                  DEPRANK
                </text>
                {/* Font style: E with shortened middle line, A without crossbar, K with sharp angles */}
                <rect x="22" y="16" width="7" height="2.5" fill="#fff"/>
                <rect x="48" y="13" width="10" height="2.5" fill="#fff"/>
                <rect x="85" y="18" width="10" height="2.5" fill="#fff"/>
              </svg>
            </div>
          </Link>
          
          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
                {/* User menu button - positioned to the left of the username */}
                <div className="relative">
                  <button
                    ref={menuButtonRef}
                    onClick={() => setShowMenu(!showMenu)}
                    onMouseEnter={() => setShowMenu(true)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="User menu"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu - with mouse leave to close functionality */}
                  {showMenu && (
                    <div 
                      ref={menuRef}
                      onMouseLeave={() => setShowMenu(false)}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden origin-top-left z-30 animate-slideDown"
                    >
                      <div className="py-1">
                        <Link 
                          href="/workflows" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Workflows
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Login button */}
            <LoginButton 
              onSuccess={() => {
                // Update navbar state after successful login
                checkAuthStatus();
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
} 