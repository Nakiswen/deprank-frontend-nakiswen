'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Background from '@/components/Background';
import { getDependencyList } from '@/lib/api';
import auth from '@/lib/auth';

interface DependencyPageProps {
  params: {
    org: string;
    repo: string;
  };
}

interface Dependency {
  name: string;
  contributor: string;
  contributionPercentage: number;
  lastUpdated: string;
}

/**
 * 依赖列表页
 * 展示特定GitHub仓库的依赖包列表
 */
export default function DependencyListPage({ params }: DependencyPageProps) {
  const { org, repo } = params;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWorkflowStarted, setIsWorkflowStarted] = useState(false);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从API获取依赖数据
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setIsLoading(true);
        const result = await getDependencyList(org, repo);
        if (result.success) {
          setDependencies(result.data.list);
          setError(null);
        } else {
          setError(result.message || '获取依赖数据失败');
          setDependencies([]);
        }
      } catch (err) {
        setError('获取依赖数据失败');
        console.error('Failed to fetch dependencies:', err);
        setDependencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencies();
  }, [org, repo]);

  // 检查用户是否已登录和工作流是否已启动
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 检查Better Auth登录状态
        const session = await auth.getSession();
        setIsLoggedIn(!!session);
        
        // 检查工作流状态
        const workflowStatus = localStorage.getItem(`workflow_${org}_${repo}`);
        setIsWorkflowStarted(workflowStatus === 'started');
      } catch (error) {
        console.error('Failed to check status:', error);
      }
    };
    
    checkAuthStatus();
  }, [org, repo]);

  // 处理启动工作流
  const handleStartWorkflow = async () => {
    try {
      if (!isLoggedIn) {
        // 使用Better Auth进行GitHub授权登录
        // 传递当前页面路径以便授权后重定向回来
        await auth.login('github', `/${org}/${repo}`);
        return;
      }
      
      // 如果已登录，则跳转到多签钱包页面
      window.location.href = `/${org}/${repo}/wallet`;
    } catch (error) {
      console.error('Failed to start workflow:', error);
    }
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="w-full max-w-4xl mx-auto">
        {/* 仓库信息卡片 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {org}/{repo}
            </h1>
            <p className="text-gray-600">依赖包列表</p>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input 
              type="text" 
              placeholder="搜索依赖名称或贡献者" 
              className="w-full pl-12 pr-24 py-5 rounded-2xl bg-white/90 shadow-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent text-lg text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 bg-gray-100 rounded-lg px-2 py-1 text-xs font-mono shadow-sm border border-gray-200 select-none">
              <span className="hidden sm:inline">⌘</span>K
            </span>
          </div>
        </div>

        {/* 列表卡片 */}
        <div className="relative bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-100 bg-gray-50/80">
            <div className="col-span-4 font-semibold text-gray-900">依赖名称</div>
            <div className="col-span-3 font-semibold text-gray-900">贡献者</div>
            <div className="col-span-2 font-semibold text-gray-900">贡献度</div>
            <div className="col-span-3 font-semibold text-gray-900">最后更新</div>
          </div>
          
          {/* 加载状态 */}
          {isLoading && (
            <div className="px-8 py-10 text-center text-gray-500">
              <div className="inline-block animate-spin mr-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              正在加载依赖数据...
            </div>
          )}
          
          {/* 错误信息 */}
          {!isLoading && error && (
            <div className="px-8 py-10 text-center text-red-500">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          
          {/* 数据项 */}
          {!isLoading && !error && dependencies.length === 0 && (
            <div className="px-8 py-10 text-center text-gray-500">
              没有找到依赖数据
            </div>
          )}
          
          {!isLoading && !error && dependencies.length > 0 && (
            <div className="divide-y divide-gray-100">
              {dependencies.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-primary/10 transition">
                  <div className="col-span-4">
                    <Link href={`/${org}/${repo}/${item.name}`} className="text-primary hover:text-secondary font-medium">
                      {item.name}
                    </Link>
                  </div>
                  <div className="col-span-3 text-gray-600">{item.contributor}</div>
                  <div className="col-span-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${item.contributionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-span-3 text-gray-600">{item.lastUpdated}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分页 - 仅在有足够数据时显示 */}
        {!isLoading && !error && dependencies.length > 20 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">上一页</button>
              <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow">1</button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">2</button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">3</button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">下一页</button>
            </nav>
          </div>
        )}
        
        {/* 启动工作流按钮 - 只有在未启动工作流时显示 */}
        {!isWorkflowStarted && (
          <div className="fixed bottom-10 left-0 right-0 flex justify-center">
            <button 
              onClick={handleStartWorkflow}
              className="px-8 py-4 bg-white/80 backdrop-blur-lg text-primary border border-primary/30 rounded-full font-bold shadow-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              启动工作流
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 