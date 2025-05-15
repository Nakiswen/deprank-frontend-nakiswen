'use client';

import React, { useState, useEffect } from 'react';
import Background from '@/components/Background';
import { getDependencyDetails } from '@/lib/api';
import '@/styles/highlight.css';

interface DependencyDetailProps {
  params: {
    name: string;
  };
}

interface DependencyDetailData {
  contributor: string;
  contributionPercentage: number;
  lastUpdated: string;
  description: string;
  version: string;
  dependencies: string[];
  codeSnippet: string;
}

/**
 * 依赖详情页组件
 * 显示特定依赖包的详细信息
 */
export default function DependencyDetailPage({ params }: DependencyDetailProps) {
  const { name } = params;
  const [dependencyData, setDependencyData] = useState<DependencyDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取依赖详情数据
  useEffect(() => {
    const fetchDependencyDetails = async () => {
      try {
        setIsLoading(true);
        const result = await getDependencyDetails(name);
        if (result.success) {
          setDependencyData(result.data);
          setError(null);
        } else {
          setError(result.message || '获取依赖详情失败');
          setDependencyData(null);
        }
      } catch (err) {
        setError('获取依赖详情失败');
        console.error('Failed to fetch dependency details:', err);
        setDependencyData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencyDetails();
  }, [name]);

  // 处理代码行编号
  const renderCodeWithLineNumbers = (code: string) => {
    if (!code) return null;
    
    const lines = code.split('\n');
    return (
      <pre className="overflow-auto">
        <code>
          {lines.map((line, index) => (
            <div key={index} className="code-line">
              <span className="line-number">{index + 1}</span>
              <span className="code-content">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    );
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="w-full max-w-4xl mx-auto">
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* 错误信息 */}
        {!isLoading && error && (
          <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-10 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">出错了</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* 依赖详情内容 */}
        {!isLoading && !error && dependencyData && (
          <>
            {/* 头部信息卡片 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {name}
                    <span className="ml-2 text-sm font-normal text-gray-500 align-middle bg-gray-100 px-2 py-1 rounded">
                      v{dependencyData.version}
                    </span>
                  </h1>
                  <p className="text-gray-600 mb-4">{dependencyData.description}</p>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">贡献者: <span className="text-primary">{dependencyData.contributor}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">最后更新: {dependencyData.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eeeeee"
                          strokeWidth="4"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#4d7c0f"
                          strokeWidth="4"
                          strokeDasharray={`${dependencyData.contributionPercentage}, 100`}
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-gray-800">
                        {dependencyData.contributionPercentage}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">贡献度</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 依赖列表卡片 */}
            {dependencyData.dependencies.length > 0 && (
              <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">依赖列表</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dependencyData.dependencies.map((dep, index) => (
                    <div key={index} className="bg-gray-50 px-4 py-3 rounded-lg">
                      <span className="font-mono text-sm">{dep}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 代码示例卡片 */}
            <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">代码示例</h2>
              {renderCodeWithLineNumbers(dependencyData.codeSnippet)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
