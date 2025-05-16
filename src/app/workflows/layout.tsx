'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Workflows Layout Component
 * Contains breadcrumb navigation
 */
export default function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Generate breadcrumb items based on path
  const getBreadcrumbItems = () => {
    const pathParts = pathname.split('/').filter(Boolean);
    const items = [
      { label: 'Workflows', href: '/workflows' },
    ];

    // Remove 'workflows' prefix, process remaining path
    const relevantParts = pathParts.slice(1); // Remove 'workflows'
    
    if (relevantParts.length >= 2) {
      // Process organization and repository, merge them into one breadcrumb
      const [org, repo] = relevantParts;
      
      // Merge org and repo into one breadcrumb item
      items.push({
        label: `${org}/${repo}`,
        href: `/workflows/${org}/${repo}`,
      });
      
      // If includes 'steps'
      if (relevantParts[2] === 'steps') {
        items.push({
          label: 'steps',
          href: `/workflows/${org}/${repo}/steps`,
        });
      }
    }

    return items;
  };

  return (
    <div className="min-h-screen">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Workflows</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb navigation */}
      <nav className="relative border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 h-12 pl-4 ml-4">
            {getBreadcrumbItems().map((item, index, array) => (
              <React.Fragment key={item.href}>
                {index > 0 && (
                  <svg
                    className="h-5 w-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                <Link
                  href={item.href}
                  className={`text-sm font-medium ${
                    index === array.length - 1
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {children}
        </div>
      </div>
    </div>
  );
} 