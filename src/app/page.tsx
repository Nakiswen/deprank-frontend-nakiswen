'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';
import { defaultSearchData } from '@/utils/const';

/**
 * Home page component
 * Contains main search functionality and introductory content
 */
export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Controls fade in/out
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  // Load search history from localStorage
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

  // Control dropdown fade in/out effect
  useEffect(() => {
    if (showDropdown) {
      setIsDropdownVisible(true);
    } else {
      // Apply fade-out effect first, then hide the element
      const timer = setTimeout(() => {
        setIsDropdownVisible(false);
      }, 300); // 300ms matches the CSS transition time
      return () => clearTimeout(timer);
    }
  }, [showDropdown]);

  // Save search history to localStorage
  const saveToHistory = (item: any) => {
    try {
      // Check if the same item already exists
      const exists = searchHistory.some(historyItem => historyItem.title === item.title);
      
      if (!exists) {
        const newHistory = [item, ...searchHistory].slice(0, 10); // Limit history records
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // Get current search data to display
  const currentSearchData = searchHistory.length > 0 ? searchHistory : defaultSearchData;

  // Handle keyboard navigation
  const handleSearchKey = (e: React.KeyboardEvent) => {
    console.log("🚀 ~ saveToHistory ~ saveToHistory:", selectedIndex)
    // Handle direction key navigation
    if (e.key === 'ArrowDown' && showDropdown) {
      setSelectedIndex(Math.min(selectedIndex + 1, currentSearchData.length - 1));
      e.preventDefault();
      return;
    }
    
    if (e.key === 'ArrowUp' && showDropdown) {
      setSelectedIndex(Math.max(selectedIndex - 1, 0));
      e.preventDefault();
      return;
    }
    
    // Handle Escape key
    if (e.key === 'Escape') {
      setShowDropdown(false);
      return;
    }
    
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Check if input field has content
      if (searchQuery.trim()) {
        // Check if user selected a search result with up/down keys
        if (showDropdown && selectedIndex >= 0 && selectedIndex < currentSearchData.length) {
          // User selected an item from search results
      const selectedItem = currentSearchData[selectedIndex];
      saveToHistory(selectedItem);
          router.push(selectedItem.url);
        } else {
          // User didn't select a search result, process input directly
          handleCustomSearch(searchQuery);
        }
      }
    }
  };

  // Handle custom search input
  const handleCustomSearch = (query: string) => {
    // Extract organization and repository names from GitHub repository URL
    let org, repo;
    
    // Remove prefix symbols (like @)
    if (query.startsWith('@')) {
      query = query.substring(1);
    }
    
    // Handle GitHub URL format
    if (query.includes('github.com')) {
      try {
        const url = new URL(query);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          org = pathParts[0];
          repo = pathParts[1];
        }
      } catch (error) {
        // If URL parsing fails, try to extract from string
        const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = query.match(githubRegex);
        if (match && match.length >= 3) {
          org = match[1];
          repo = match[2];
    }
      }
    } else {
      // Handle org/repo format input
      const parts = query.split('/').filter(Boolean);
      if (parts.length >= 2) {
        org = parts[0];
        repo = parts[1];
      }
    }
    
    // If organization and repository names are successfully extracted, build URL and navigate
    if (org && repo) {
      // Add to search history
      const historyItem = {
        icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
        title: `${org}/${repo}`,
        code: repo,
        desc: `GitHub repository: ${org}/${repo}`,
        action: "OPEN",
        url: `/${org}/${repo}`,
      };
      saveToHistory(historyItem);
      
      // Navigate to corresponding page
      router.push(`/${org}/${repo}`);
    } else {
      // Unable to parse input, can add a prompt
      console.warn('Unable to parse GitHub repository address:', query);
      // Error prompt UI can be added here
    }
  };

  // Handle search result selection
  const handleSelectSearchItem = (item: any) => {
    saveToHistory(item);
    router.push(item.url);
  };

  // Close dropdown when clicking outside
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

  // Handle keyboard shortcuts
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
    <main className="homepage-container relative z-10">
      <Background />
      <div className="homepage-content w-full z-10 max-w-3xl mx-auto text-center px-4 py-4">
        <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight text-gray-900 mb-2 tracking-tight max-w-3xl mx-auto">
          Open Source Contribution & Allocation Audit System
        </h2>
        <p className="text-[clamp(0.9rem,1.8vw,1.1rem)] text-gray-500 mb-6 font-normal">
          Track dependencies and contributions between software projects,
          enabling transparent and efficient open source collaboration
        </p>
        
        {/* Search box */}
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full max-w-xl">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleSearchKey}
              className="w-full pl-12 pr-24 py-3 rounded-2xl bg-white/90 shadow-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent text-lg text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none"
              placeholder="Search by github repo url ..."
              aria-label="Search by github repo url"
              autoComplete="off"
            />
            
            {/* Search icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            
            {/* Keyboard shortcut hint */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 bg-gray-100 rounded-lg px-2 py-1 text-xs font-mono shadow-sm border border-gray-200 select-none">
              <span className="hidden sm:inline">⌘</span>K
            </span>
            
            {/* Search dropdown - with slide in/out animation effect */}
            {isDropdownVisible && (
              <div 
                ref={dropdownRef}
                className={`absolute left-0 top-[110%] w-full rounded-2xl bg-white/95 shadow-2xl border border-gray-100 mt-2 z-30 overflow-hidden ${
                  showDropdown ? 'animate-slideInDown' : 'animate-slideOutUp'
                }`}
                style={{backdropFilter: 'blur(8px)'}}
              >
                <div className="max-h-60 overflow-y-auto">
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
                
                {/* Keyboard navigation help */}
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
          
          {/* Search statistics */}
          <div className="mt-2 text-gray-400 text-sm select-none">
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
