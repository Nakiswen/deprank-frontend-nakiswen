'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';
import SuccessAnimation from '@/components/SuccessAnimation';
import ErrorModal from '@/components/ErrorModal';
import '@/styles/highlight.css'; // 修正为全局样式路径

interface ClaimPageProps {
  params: {
    org: string;
    repo: string;
    dependency: string;
  };
}

/**
 * 依赖方领水页面
 * 允许依赖方输入钱包地址领取贡献奖励
 */
export default function ClaimPage({ params }: ClaimPageProps) {
  const { org, repo, dependency } = params;
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 添加状态用于处理成功和错误弹窗
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 检查用户是否已登录
  useEffect(() => {
    try {
      // 这里将来需要替换为 Better Auth 的登录状态检查
      const authStatus = localStorage.getItem('authStatus');
      setIsLoggedIn(authStatus === 'logged-in');
    } catch (error) {
      console.error('Failed to check login status:', error);
    }
  }, []);

  // 验证钱包地址格式
  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // 处理登录
  const handleLogin = async () => {
    try {
      // 这里将来需要替换为 Better Auth 的登录逻辑
      localStorage.setItem('authStatus', 'logged-in');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to login:', error);
      // 显示登录失败弹窗
      setErrorMessage('登录失败，请稍后重试或联系支持团队');
      setErrorModalOpen(true);
    }
  };

  // 处理领取贡献
  const handleClaim = async () => {
    // 检查是否已登录
    if (!isLoggedIn) {
      setError('请先登录GitHub账户');
      return;
    }

    // 验证钱包地址
    if (!walletAddress) {
      setError('请输入钱包地址');
      return;
    }

    if (!isValidEthereumAddress(walletAddress)) {
      setError('请输入有效的以太坊钱包地址');
      return;
    }

    setError('');
    setIsClaiming(true);

    try {
      // 模拟API请求 - 这里可能会失败
      const response = await mockClaimAPI(walletAddress);
      
      if (response.success) {
        // 显示成功庆祝动画
        setShowSuccess(true);
        
        // 延迟跳转，让用户能看到成功动画
        setTimeout(() => {
      router.push(`/${org}/${repo}/${dependency}`);
        }, 3000);
      } else {
        // 显示失败弹窗
        setErrorMessage(response.message || '领取失败，请稍后重试');
        setErrorModalOpen(true);
        setIsClaiming(false);
      }
    } catch (error) {
      console.error('Failed to claim contribution:', error);
      // 显示错误弹窗
      setErrorMessage('网络请求失败，请检查您的网络连接并重试');
      setErrorModalOpen(true);
      setIsClaiming(false);
    }
  };

  // 模拟API请求的函数 - 实际项目中应替换为真实API调用
  const mockClaimAPI = async (address: string): Promise<{success: boolean, message?: string}> => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟成功或失败情况（随机）- 实际项目中应替换为真实API调用
    const isSuccess = Math.random() > 0.3; // 70%成功率
    
    if (isSuccess) {
      return { success: true };
    } else {
      // 返回不同类型的错误信息
      const errorMessages = [
        '您已经领取过该依赖的奖励',
        '验证您的贡献身份失败，请确认您是该依赖的贡献者',
        '当前项目奖励池已耗尽，请联系项目方'
      ];
      return { 
        success: false, 
        message: errorMessages[Math.floor(Math.random() * errorMessages.length)]
      };
    }
  };

  // 关闭错误弹窗
  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />
      
      {/* 成功动画 */}
      {showSuccess && <SuccessAnimation />}
      
      {/* 错误弹窗 */}
      <ErrorModal 
        isOpen={errorModalOpen}
        message={errorMessage}
        onClose={handleCloseErrorModal}
      />
      
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/80">
          <h1 className="text-2xl font-bold text-gray-900">领取贡献奖励</h1>
          <p className="text-gray-600 mt-1">
            {org}/{repo} 项目中的 {dependency} 依赖
          </p>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              作为 {dependency} 的贡献者，您可以领取该项目的贡献奖励。请输入您的钱包地址以领取奖励。
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    为防止滥用，领取前需要通过GitHub账户验证您的身份。请确保您已登录。
                  </p>
                </div>
              </div>
            </div>
            
            {!isLoggedIn && (
              <div className="mb-6">
                <button
                  onClick={handleLogin}
                  className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  使用GitHub账户登录
                </button>
              </div>
            )}
            
            <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700 mb-2">
              钱包地址
            </label>
            <input
              type="text"
              id="wallet-address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="输入以太坊钱包地址 (0x...)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none"
              disabled={showSuccess} // 成功后禁用输入
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleClaim}
              disabled={isClaiming || showSuccess || !isLoggedIn}
              className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-200 ${
                isClaiming || showSuccess || !isLoggedIn
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
              }`}
            >
              {isClaiming ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  领取中...
                </span>
              ) : showSuccess ? '领取成功' : '领取贡献奖励'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 