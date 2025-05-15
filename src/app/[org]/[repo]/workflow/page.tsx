'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Background from '@/components/Background';

interface WorkflowPageProps {
  params: {
    org: string;
    repo: string;
  };
}

/**
 * 工作流步骤详情页面
 * 展示工作流各个步骤的完成情况
 */
export default function WorkflowPage({ params }: WorkflowPageProps) {
  const { org, repo } = params;
  const [currentStep, setCurrentStep] = useState(1);
  
  // 工作流步骤数据
  const workflowSteps = [
    {
      id: 1,
      title: '创建多签钱包',
      description: '创建用于管理项目贡献和分配资金的多签钱包',
      link: `/${org}/${repo}/wallet`,
    },
    {
      id: 2,
      title: '向多签钱包注资',
      description: '向多签钱包转入资金，用于支付贡献奖励',
      link: `/${org}/${repo}/wallet`,
    },
    {
      id: 3,
      title: '审核依赖关系',
      description: '审核项目的依赖关系和贡献度',
      link: `/${org}/${repo}`,
    },
    {
      id: 4,
      title: '分配贡献奖励',
      description: '根据贡献度分配奖励给依赖方',
      link: `/${org}/${repo}`,
    },
    {
      id: 5,
      title: '完成工作流',
      description: '工作流程全部完成',
      link: `/${org}/${repo}`,
    }
  ];

  // 检查工作流进度
  useEffect(() => {
    try {
      // 这里将来需要从API获取工作流进度
      // 现在暂时使用localStorage模拟
      const workflowStatus = localStorage.getItem(`workflow_${org}_${repo}`);
      if (workflowStatus === 'started') {
        setCurrentStep(2); // 假设已完成第一步
      }
    } catch (error) {
      console.error('Failed to check workflow status:', error);
    }
  }, [org, repo]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              工作流进度
            </h1>
            <p className="text-gray-600">{org}/{repo} 项目</p>
          </div>
        </div>

        {/* 工作流进度条 */}
        <div className="relative mb-12">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
          <div className="flex justify-between relative z-10">
            {workflowSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.id < currentStep 
                      ? 'bg-green-500 text-white' 
                      : step.id === currentStep 
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.id < currentStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center w-32">
                  <p className={`font-medium ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 当前步骤详情卡片 */}
        <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/80">
            <h2 className="text-xl font-bold text-gray-900">
              当前步骤: {workflowSteps[currentStep - 1].title}
            </h2>
          </div>
          <div className="p-8">
            <p className="text-gray-700 mb-6">
              {workflowSteps[currentStep - 1].description}
            </p>
            
            <div className="flex justify-end">
              <Link 
                href={workflowSteps[currentStep - 1].link}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:bg-primary/90 transition-colors duration-200"
              >
                继续此步骤
              </Link>
            </div>
          </div>
        </div>

        {/* 所有步骤列表 */}
        <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/80">
            <h2 className="text-xl font-bold text-gray-900">
              所有步骤
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {workflowSteps.map((step) => (
              <div key={step.id} className="flex items-center px-8 py-5">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                    step.id < currentStep 
                      ? 'bg-green-500 text-white' 
                      : step.id === currentStep 
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.id < currentStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    step.id <= currentStep ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {step.id <= currentStep && (
                  <Link 
                    href={step.link}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    查看
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 