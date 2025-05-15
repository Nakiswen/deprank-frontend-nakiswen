'use client';

import { useState, useEffect } from 'react';
import auth from '@/lib/auth';

/**
 * GitHub登录按钮组件
 * 使用Better Auth实现GitHub OAuth授权登录
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

  // 检查用户是否已登录及更新用户信息
  const checkAuthStatus = async () => {
    try {
      const session = await auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.login);
        setDisplayName(session.name);
        setAvatarUrl(session.avatar);
        console.log("用户会话信息:", session); // 添加日志方便调试
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
  
  // 初始加载及登录状态变化时检查
  useEffect(() => {
    checkAuthStatus();
    
    // 注册storage事件监听器，以便在其他组件修改登录状态时更新
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 处理登录 - 使用Better Auth的GitHub登录
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      // 使用Better Auth进行GitHub登录
      await auth.login('github');
      
      // 注意: 这里不需要做其他处理
      // auth.login会重定向到GitHub，登录成功后会返回到callback页面
    } catch (error) {
      console.error('Login redirection failed:', error);
      alert('登录失败，请重试');
      setIsLoading(false);
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await auth.logout();
      setIsLoggedIn(false);
      setUserName('');
      setDisplayName('');
      setAvatarUrl('');
      // 触发storage事件，通知其他组件登录状态已更改
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
            alt={`${displayName || userName}的头像`} 
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
          退出
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
          登录中...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          使用 GitHub 登录
        </>
      )}
    </button>
  );
} 