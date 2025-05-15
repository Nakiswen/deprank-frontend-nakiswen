'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Background from '@/components/Background';
import LoginButton from '@/components/LoginButton';

/**
 * 首页组件
 * 包含主要搜索功能和介绍文案
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 控制淡入淡出
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState<Array<{
    icon: string;
    title: string;
    code: string;
    desc: string;
    action: string;
    url: string;
  }>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 默认搜索数据
  const defaultSearchData = [
    {
      icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      title: "facebook/react",
      code: "React",
      desc: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      action: "OPEN",
      url: "/facebook/react",
    },
    {
      icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      title: "microsoft/vscode",
      code: "VS Code",
      desc: "Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.",
      action: "OPEN",
      url: "/microsoft/vscode",
    },
    {
      icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      title: "vuejs/vue",
      code: "Vue",
      desc: "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
      action: "OPEN",
      url: "/vuejs/vue",
    },
    {
      icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
      title: "tensorflow/tensorflow",
      code: "TensorFlow",
      desc: "An Open Source Machine Learning Framework for Everyone",
      action: "OPEN",
      url: "/tensorflow/tensorflow",
    },
  ];

  // 从localStorage加载搜索历史
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // 控制下拉框淡入淡出效果
  useEffect(() => {
    if (showDropdown) {
      setIsDropdownVisible(true);
    } else {
      // 先应用淡出效果，然后隐藏元素
      const timer = setTimeout(() => {
        setIsDropdownVisible(false);
      }, 300); // 300ms与CSS过渡时间匹配
      return () => clearTimeout(timer);
    }
  }, [showDropdown]);

  // 保存搜索历史到localStorage
  const saveToHistory = (item: any) => {
    try {
      // 检查是否已存在相同项
      const exists = searchHistory.some(historyItem => historyItem.title === item.title);
      
      if (!exists) {
        const newHistory = [item, ...searchHistory].slice(0, 10); // 限制历史记录数量
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // 获取当前展示的搜索数据
  const currentSearchData = searchHistory.length > 0 ? searchHistory : defaultSearchData;

  // 处理键盘导航
  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    
    if (e.key === 'ArrowDown') {
      setSelectedIndex(Math.min(selectedIndex + 1, currentSearchData.length - 1));
      e.preventDefault();
    }
    if (e.key === 'ArrowUp') {
      setSelectedIndex(Math.max(selectedIndex - 1, 0));
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      const selectedItem = currentSearchData[selectedIndex];
      saveToHistory(selectedItem);
      window.location.href = selectedItem.url;
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // 处理选择搜索结果
  const handleSelectSearchItem = (item: any) => {
    saveToHistory(item);
    window.location.href = item.url;
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-32">
      <Background />
      <div className="w-full z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-tight text-gray-900 mb-3 tracking-tight max-w-3xl mx-auto">
          Open Source Contribution & Allocation Audit System
        </h2>
        <p className="text-[clamp(1.1rem,2.5vw,1.4rem)] text-gray-500 mb-10 font-normal">
          Track dependencies and contributions between software projects,
          enabling transparent and efficient open source collaboration
        </p>
        
        {/* 搜索框 */}
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full max-w-xl">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleSearchKey}
              className="w-full pl-12 pr-24 py-5 rounded-2xl bg-white/90 shadow-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent text-lg text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none"
              placeholder="Search by github repo url ..."
              aria-label="Search by github repo url"
              autoComplete="off"
            />
            
            {/* 搜索图标 */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            
            {/* 键盘快捷键提示 */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 bg-gray-100 rounded-lg px-2 py-1 text-xs font-mono shadow-sm border border-gray-200 select-none">
              <span className="hidden sm:inline">⌘</span>K
            </span>
            
            {/* 搜索下拉框 - 添加淡入淡出效果 */}
            {isDropdownVisible && (
              <div 
                ref={dropdownRef}
                className={`absolute left-0 top-[110%] w-full rounded-2xl bg-white/95 shadow-2xl border border-gray-100 mt-2 z-30 overflow-hidden transition-opacity duration-300 ${
                  showDropdown ? 'opacity-100' : 'opacity-0'
                }`}
                style={{backdropFilter: 'blur(8px)'}}
              >
                <div className="max-h-72 overflow-y-auto">
                  {currentSearchData.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition bg-white/0 hover:bg-primary/10 ${
                        idx === selectedIndex ? 'bg-primary/10' : ''
                      } group`}
                      onClick={() => handleSelectSearchItem(item)}
                      onMouseOver={() => setSelectedIndex(idx)}
                    >
                      <img src={item.icon} alt="icon" className="w-7 h-7 rounded-md bg-gray-100 object-contain" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-base text-left">{item.title}</div>
                        <div className="text-xs text-gray-400 flex gap-2 items-center">
                          <span className="truncate">{item.desc}</span>
                        </div>
                      </div>
                      {item.action && (
                        <span className="text-primary text-xs font-bold ml-2">
                          {item.action}
                          <svg className="inline-block" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 键盘导航帮助 */}
                <div className="flex items-center justify-between px-6 py-2 bg-gray-50 text-xs text-gray-400 border-t border-gray-100 select-none">
                  <div>
                    <span className="inline-block px-1 py-0.5 bg-gray-200 rounded mr-1">↑</span>
                    <span className="inline-block px-1 py-0.5 bg-gray-200 rounded mr-1">↓</span>
                    To Navigate
                    <span className="inline-block px-1 py-0.5 bg-gray-200 rounded mx-1">↵</span>
                    To Select
                  </div>
                  <div>
                    <span className="inline-block px-1 py-0.5 bg-gray-200 rounded mr-1">esc</span>
                    Exit Search
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 搜索统计 */}
          <div className="mt-4 text-gray-400 text-sm select-none">
            <svg className="inline-block mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            50,031 searches and counting ...
          </div>
        </div>
      </div>
    </main>
  );
}
