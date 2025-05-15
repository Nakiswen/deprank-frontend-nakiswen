'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';

interface WalletPageProps {
  params: {
    org: string;
    repo: string;
  };
}

/**
 * 多签钱包创建页面
 * 允许用户输入钱包地址创建多签钱包
 */
export default function WalletPage({ params }: WalletPageProps) {
  const { org, repo } = params;
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // 验证钱包地址格式
  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // 处理创建多签钱包
  const handleCreateWallet = async () => {
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
    setIsCreating(true);

    try {
      // 模拟创建多签钱包的过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 标记工作流已启动
      localStorage.setItem(`workflow_${org}_${repo}`, 'started');
      
      // 返回依赖列表页
      router.push(`/${org}/${repo}`);
    } catch (error) {
      console.error('Failed to create wallet:', error);
      setError('创建多签钱包失败，请重试');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/80">
          <h1 className="text-2xl font-bold text-gray-900">创建多签钱包</h1>
          <p className="text-gray-600 mt-1">为项目 {org}/{repo} 创建多签钱包</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              请输入您的钱包地址以创建多签钱包。创建后，您需要向该钱包注资才能继续工作流程的下一步。
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    多签钱包将用于管理项目贡献和分配资金。请确保您有足够的资金用于注资。
                  </p>
                </div>
              </div>
            </div>
            
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
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCreateWallet}
              disabled={isCreating}
              className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-200 ${
                isCreating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isCreating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  创建中...
                </span>
              ) : '创建多签钱包'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 