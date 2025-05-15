import React from 'react';

/**
 * 页脚组件
 * 简洁的页脚设计
 */
export default function Footer() {
  return (
    <footer className="relative z-10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} DepRank. All rights reserved.
          </div>
          <div className="mt-4 sm:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 