'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';

/**
 * 项目历史记录页面
 * 展示用户访问过的GitHub仓库列表
 */
export default function RepoHistoryPage() {
  const router = useRouter();
  const [repoHistory, setRepoHistory] = useState<Array<{
    icon: string;
    title: string;
    code: string;
    desc: string;
    action: string;
    url: string;
    lastVisited: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从localStorage加载仓库历史
  useEffect(() => {
    try {
      // 检查用户是否已登录
      const authStatus = localStorage.getItem('authStatus');
      if (authStatus !== 'logged-in') {
        // 未登录则重定向到首页
        router.push('/');
        return;
      }

      // 加载搜索历史
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        
        // 添加访问时间
        const historyWithTimestamp = parsedHistory.map((item: any) => ({
          ...item,
          lastVisited: new Date().toISOString().split('T')[0] // 简化处理，实际应用中应存储真实访问时间
        }));
        
        setRepoHistory(historyWithTimestamp);
      }
    } catch (error) {
      console.error('Failed to load repo history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="z-10 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              项目历史记录
            </h1>
            <p className="text-gray-600">您访问过的GitHub仓库列表</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : repoHistory.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">暂无历史记录</h3>
            <p className="mt-1 text-gray-500">您还没有访问过任何GitHub仓库</p>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                返回首页
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-100 bg-gray-50/80">
              <div className="col-span-6 font-semibold text-gray-900">仓库名称</div>
              <div className="col-span-4 font-semibold text-gray-900">描述</div>
              <div className="col-span-2 font-semibold text-gray-900">最后访问</div>
            </div>
            <div className="divide-y divide-gray-100">
              {repoHistory.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-primary/10 transition">
                  <div className="col-span-6 flex items-center">
                    <img src={item.icon} alt="icon" className="w-6 h-6 mr-3 rounded-full bg-gray-100 object-contain" />
                    <Link href={item.url} className="text-primary hover:text-secondary font-medium">
                      {item.title}
                    </Link>
                  </div>
                  <div className="col-span-4 text-gray-600 truncate">{item.desc}</div>
                  <div className="col-span-2 text-gray-600">{item.lastVisited}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 