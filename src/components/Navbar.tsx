'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginButton from './LoginButton';
import auth from '@/lib/auth';

/**
 * 顶部导航栏组件
 * 包含Logo和导航链接
 */
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // 检查用户是否已登录
  const checkAuthStatus = async () => {
    try {
      const session = await auth.getSession();
      setIsLoggedIn(!!session);
      setUser(session);
      console.log("Navbar中的用户会话:", session); // 方便调试
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };
  
  useEffect(() => {
    checkAuthStatus();
    
    // 监听登录状态变化
    const handleStorageChange = () => {
      console.log("Navbar检测到存储变化，更新状态"); // 方便调试
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 shadow-md backdrop-blur-xl border-b border-gray-200 bg-white/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="block select-none" style={{width:200, height:40}}>
            <svg viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="26" fontFamily="Montserrat, Orbitron, Arial, sans-serif" fontSize="26" fontWeight="bold" letterSpacing="2" fill="#111">
                DEPRANK
              </text>
              {/* 字体风格：E的中横线缩短，A无横杠，K锐角 */}
              <rect x="22" y="16" width="7" height="2.5" fill="#fff"/>
              <rect x="48" y="13" width="10" height="2.5" fill="#fff"/>
              <rect x="85" y="18" width="10" height="2.5" fill="#fff"/>
            </svg>
          </Link>
          
          {/* 导航链接 */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <Link 
                href="/repo-history" 
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-gray-100"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                项目历史
              </Link>
            )}
            
            {/* 登录按钮 */}
            <LoginButton 
              onSuccess={() => {
                // 登录成功后更新导航栏状态
                checkAuthStatus();
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
} 