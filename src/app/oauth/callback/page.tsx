'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Background from '@/components/Background';

/**
 * GitHub OAuth授权回调处理页面
 * 处理GitHub授权后的回调，获取访问令牌和用户信息
 */
export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取授权码和state
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const redirectPath = state ? decodeURIComponent(state) : '/';
    
    if (!code) {
      setError('未获取到授权码');
      setIsLoading(false);
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // 与后端API交换访问令牌
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '令牌交换失败');
        }
        
        const data = await response.json();
        
        // 存储授权信息
        localStorage.setItem('authStatus', 'logged-in');
        localStorage.setItem('userName', data.user.login);
        localStorage.setItem('userDisplayName', data.user.name || data.user.login);
        localStorage.setItem('githubToken', data.access_token);
        localStorage.setItem('userAvatar', data.user.avatar_url);
        
        // 触发storage事件，通知其他组件登录状态已更改
        window.dispatchEvent(new Event('storage'));
        
        // 重定向回原始页面
        router.push(redirectPath);
      } catch (err) {
        console.error('Failed to exchange code for token:', err);
        setError(err instanceof Error ? err.message : '授权过程中出现错误，请重试');
        setIsLoading(false);
      }
    };

    exchangeCodeForToken();
  }, [searchParams, router]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />
      <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6 max-w-md w-full">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">GitHub授权处理中</h1>
            <p className="text-gray-600">请稍候，正在处理您的GitHub授权...</p>
          </div>
        ) : (
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 mb-2">授权失败</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              返回首页
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 