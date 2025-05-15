'use client';

import React from 'react';
import Link from 'next/link';

/**
 * 贡献度分析页面
 * 展示依赖包和贡献者信息列表
 */
export default function AnalysisPage() {
  // 示例数据
  const dependencyData = [
    {
      name: 'react',
      contributor: '@facebook',
      contributionPercentage: 85,
      lastUpdated: '2024-03-15'
    },
    {
      name: 'vue',
      contributor: '@vuejs',
      contributionPercentage: 75,
      lastUpdated: '2024-03-14'
    }
  ];

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <div className="w-full max-w-4xl mx-auto">
        {/* 搜索框 */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input 
              type="text" 
              placeholder="Search dependency name or contributor" 
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
        <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-100 bg-gray-50/80">
            <div className="col-span-4 font-semibold text-gray-900">Dependency Name</div>
            <div className="col-span-3 font-semibold text-gray-900">Contributor</div>
            <div className="col-span-2 font-semibold text-gray-900">Contribution</div>
            <div className="col-span-3 font-semibold text-gray-900">Last Updated</div>
          </div>
          <div className="divide-y divide-gray-100">
            {/* 数据项 */}
            {dependencyData.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 px-8 py-5 hover:bg-primary/10 transition">
                <div className="col-span-4">
                  <Link href={`/dependency/${item.name}`} className="text-primary hover:text-secondary font-medium">
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
        </div>

        {/* 分页 */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">Previous</button>
            <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold shadow">1</button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">2</button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">3</button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-600 hover:bg-primary/10 transition">Next</button>
          </nav>
        </div>
      </div>
    </main>
  );
} 