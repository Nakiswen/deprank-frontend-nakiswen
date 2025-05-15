'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import Background from '@/components/Background';
import auth from '@/lib/auth';
import '../../../dependency/[name]/highlight.css'; // 修正引用路径

interface DependencyDetailPageProps {
  params: {
    org: string;
    repo: string;
    dependency: string;
  };
}

// 依赖信息接口定义
interface DependencyInfo {
  name: string;
  contributor: string;
  contributorName?: string;
  contributorAvatar?: string;
  contributionPercentage: number;
  lastUpdated: string;
  description: string;
  version: string;
  dependencies: string[];
  codeSnippet: string;
}

/**
 * 依赖详情页面
 * 展示特定依赖包的详细信息和代码片段
 */
export default function DependencyDetailPage({ params }: DependencyDetailPageProps) {
  const { org, repo, dependency } = params;
  
  // 状态管理
  const [dependencyInfo, setDependencyInfo] = useState<DependencyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContributor, setIsContributor] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 获取依赖信息和检查用户身份
  useEffect(() => {
    const fetchDependencyInfo = async () => {
      try {
        setIsLoading(true);
        
        // 从API获取依赖信息（这里使用模拟数据，实际项目中应调用真实API）
        const response = await fetch(`/mocks/api/web/dependency-details.json`);
        if (!response.ok) {
          throw new Error('无法获取依赖信息');
        }
        
        const data = await response.json();
        if (!data[dependency]) {
          throw new Error('找不到此依赖信息');
        }
        
        // 获取依赖信息
        const dependencyData = data[dependency];
        
        // 解析贡献者GitHub用户名（去掉@前缀）
        const contributorUsername = dependencyData.contributor.startsWith('@')
          ? dependencyData.contributor.substring(1)
          : dependencyData.contributor;
        
        // 丰富依赖信息
        const enrichedDependencyInfo = {
          ...dependencyData,
          contributorName: contributorUsername, // 贡献者名称，去除@前缀
          contributorAvatar: `https://github.com/${contributorUsername}.png`, // GitHub头像URL
        };
        
        setDependencyInfo(enrichedDependencyInfo);
        
        // 获取当前登录用户的GitHub信息
        const session = await auth.getSession();
        setCurrentUser(session);
        
        // 检查当前用户是否为依赖贡献者
        if (session && session.login) {
          const userIsContributor = 
            session.login.toLowerCase() === contributorUsername.toLowerCase();
          setIsContributor(userIsContributor);
        }
        
      } catch (err) {
        console.error('获取依赖信息失败:', err);
        setError(err instanceof Error ? err.message : '获取依赖信息时出错');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDependencyInfo();
  }, [dependency]);

  // 加载中显示
  if (isLoading) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
        <Background />
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">正在加载依赖信息...</p>
        </div>
      </main>
    );
  }

  // 错误显示
  if (error || !dependencyInfo) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
        <Background />
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-lg w-full">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
            <p className="text-gray-600 mb-4">{error || '无法获取依赖信息'}</p>
            <Link 
              href={`/${org}/${repo}`}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              返回项目页面
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="w-full max-w-4xl mx-auto">
        {/* 依赖信息卡片 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
          <div>
            <div className="flex items-center mb-1">
              <Link href={`/${org}/${repo}`} className="text-gray-500 hover:text-gray-700 transition-colors">
                {org}/{repo}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-gray-900">
                {dependencyInfo.name}
              </h1>
            </div>
            <p className="text-gray-600">v{dependencyInfo.version}</p>
            {dependencyInfo.description && (
              <p className="text-gray-700 mt-2">{dependencyInfo.description}</p>
            )}
          </div>
        </div>

        {/* 代码块 - 使用通用组件 */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <CodeBlock 
            code={dependencyInfo.codeSnippet} 
            language="typescript" 
            startingLineNumber={1} 
            fileName={`node_modules/${dependency}/example.tsx`} 
            showLineNumbers={true}
          />
        </div>

        {/* 贡献信息卡片 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            贡献信息
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                主要贡献者
              </h3>
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50"
                  src={dependencyInfo.contributorAvatar}
                  alt={`${dependencyInfo.contributorName}的头像`}
                  onError={(e) => {
                    // 头像加载失败时显示默认图像
                    (e.target as HTMLImageElement).src = "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";
                  }}
                />
                <div className="ml-2">
                  <div className="text-gray-900 font-medium">{dependencyInfo.contributor}</div>
                  {isContributor && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">这是您</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                贡献度
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${dependencyInfo.contributionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">贡献比例</span>
                <span className="text-xs font-medium text-gray-700">{dependencyInfo.contributionPercentage}%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                最后更新于 {dependencyInfo.lastUpdated}
              </div>
            </div>
          </div>
          
          {dependencyInfo.dependencies && dependencyInfo.dependencies.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                依赖关系
              </h3>
              <div className="flex flex-wrap gap-2">
                {dependencyInfo.dependencies.map((dep) => (
                  <span key={dep} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors duration-200">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 