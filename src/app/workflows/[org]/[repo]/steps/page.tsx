'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDependencyDetails } from '@/lib/api';
import '@/styles/highlight.css'; // Corrected to global style path
import CodeBlock from '@/components/CodeBlock';

interface StepPageProps {
  params: {
    dependency: string;
  };
}

/**
 * Workflow Steps Detail Page
 * Displays the processing flow in a horizontal pipeline
 */
export default function WorkflowStepsPage() {
  const params = useParams();
  const { org, repo } = params as { org: string; repo: string };
  const [dependencyData, setDependencyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Horizontal workflow step definitions - based on blockchain flow chart
  const workflowSteps = [
    {
      id: 1,
      title: 'Generate Credentials',
      description: 'Generate contribution credentials for project dependencies',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Inquiry',
      description: 'Make inquiries using information from contribution credentials',
      status: 'in_progress'
    },
    {
      id: 3,
      title: 'Acknowledgment',
      description: 'Generate acknowledgment documents for dependency relationships',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Transaction Record',
      description: 'Record dependency contribution transaction information',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Claim Record',
      description: 'Record contribution reward claim information',
      status: 'pending'
    },
    {
      id: 6,
      title: 'Notarization',
      description: 'Complete blockchain notarization of dependency contributions',
      status: 'pending'
    }
  ];

  // Get dependency details
  useEffect(() => {
    const fetchDependencyDetails = async () => {
      try {
        setIsLoading(true);
        // Since the API only accepts one parameter, we combine org and repo into an identifier
        const dependencyId = `${org}/${repo}`;
        const result = await getDependencyDetails(dependencyId);
        if (result.success) {
          setDependencyData(result.data);
          setError(null);
        } else {
          setError(result.message || 'Failed to fetch dependency details');
        }
      } catch (error) {
        console.error('Failed to fetch dependency details:', error);
        setError('Failed to fetch dependency details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencyDetails();
  }, [org, repo]);

  // Render step status icon
  const renderStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Blockchain Process Title */}
      <div className="relative bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Workflow Steps</h2>
        
        {/* Horizontal Steps Display */}
        <div className="relative mt-8 mb-4">          
          {/* Steps List - Horizontal Layout */}
          <div className="flex items-center justify-center relative z-10">
            {workflowSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Element */}
                <div className="flex flex-col items-center">
                  {renderStepIcon(step.status)}
                  <div className="text-center mt-3">
                    <h3 className={`text-base font-medium ${
                      step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`mt-1 text-xs max-w-[120px] ${
                      step.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Add arrows between steps */}
                {index < workflowSteps.length - 1 && (
                  <div className="flex-shrink-0 mx-2">
                    <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        

      </div>

      {/* Dependency Details */}
      {isLoading ? (
        <div className="relative bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : error ? (
        <div className="relativebg-white shadow-sm rounded-lg p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : dependencyData && (
        <div className="relative bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Dependency Details</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Contributor</p>
                <p className="mt-1 text-gray-900">{dependencyData.contributor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contribution</p>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${dependencyData.contributionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-gray-900">{dependencyData.contributionPercentage}%</span>
                </div>
              </div>
            </div>


            {dependencyData.codeSnippet && (
              <CodeBlock
                code={dependencyData.codeSnippet}
                language="typescript"
                startingLineNumber={1}
                fileName={`node_modules/${dependencyData.name}/example.tsx`}
                showLineNumbers={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 