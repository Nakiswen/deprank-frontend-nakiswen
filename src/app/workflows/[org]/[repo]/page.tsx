'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDependencyList } from '@/lib/api';
import '@/styles/highlight.css';

interface DependencyPageProps {
  params: {
    org: string;
    repo: string;
  };
}

interface Dependency {
  name: string;
  org: string;
  repo: string;
  contributor: string;
  contributionPercentage: number;
  lastUpdated: string;
  status: 'completed' | 'in_progress' | 'pending';
}

/**
 * 项目方视角的依赖列表页
 * 显示所有需要处理的依赖包
 */
export default function DependenciesPage({ params }: DependencyPageProps) {
  const { org, repo } = params;
  const router = useRouter();
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有依赖列表数据
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setIsLoading(true);
        // 这里应该调用获取项目方所有依赖的API
        const result = await getDependencyList(org, repo); // 空参数表示获取所有依赖
        console.log("🚀 ~ fetchDependencies ~ result:", result)
        if (result.success) {
          setDependencies(result.data.list);
          setError(null);
        } else {
          setError(result.message || '获取依赖数据失败');
        }
      } catch (err) {
        setError('获取依赖数据失败');
        console.error('Failed to fetch dependencies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencies();
  }, []);

  // 渲染状态标签
  const renderStatusBadge = (status: 'completed' | 'in_progress' | 'pending') => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      completed: { color: 'bg-green-100 text-green-800', text: '已完成' },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: '进行中' },
      pending: { color: 'bg-gray-100 text-gray-800', text: '待处理' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="relative bg-white shadow-sm rounded-lg">
      {/* 表格头部 */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="col-span-3">依赖名称</div>
        <div className="col-span-2">所属仓库</div>
        <div className="col-span-2">贡献者</div>
        <div className="col-span-2">贡献度</div>
        <div className="col-span-2">状态</div>
        <div className="col-span-1">操作</div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="px-6 py-10 text-center text-gray-500">
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
        <div className="px-6 py-10 text-center text-red-500">
          <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* 数据列表 */}
      {!isLoading && !error && dependencies.length > 0 && (
        <div className="divide-y divide-gray-200">
          {dependencies.map((item, index) => (
            <div key={index} className="relative grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
              <div className="col-span-3">
                <Link 
                  href={`/workflows/${org}/${repo}/steps`}
                  className="text-primary hover:text-secondary font-medium"
                >
                  {item.name}
                </Link>
              </div>
              <div className="col-span-2 text-gray-600">
                <Link 
                  href={`https://github.com/${item.org}/${item.repo}`}
                  target="_blank"
                  className="hover:text-primary"
                >
                  {item.org}/{item.repo}
                </Link>
              </div>
              <div className="col-span-2 text-gray-600">{item.contributor}</div>
              <div className="col-span-2">
                <div className="flex items-center">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${item.contributionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{item.contributionPercentage}%</span>
                </div>
              </div>
              <div className="col-span-2">
                {renderStatusBadge(item.status)}
              </div>
              <div className="col-span-1">
                <button 
                  className="text-primary hover:text-secondary"
                  onClick={() => router.push(`/workflows/${org}/${repo}/steps`)}
                >
                  详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && dependencies.length === 0 && (
        <div className="px-6 py-10 text-center text-gray-500">
          暂无依赖数据
        </div>
      )}
    </div>
  );
} 