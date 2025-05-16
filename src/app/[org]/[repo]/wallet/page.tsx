'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';
import { useSession } from 'next-auth/react';
import { createMultisigWallet } from '@/lib/api';

interface WalletPageProps {
  params: {
    org: string;
    repo: string;
  };
}

/**
 * Multisig Wallet Creation Page
 * Guide users to create and bind multisig wallets
 */
export default function WalletPage({ params }: WalletPageProps) {
  const { org, repo } = params;
  const router = useRouter();
  const { status } = useSession();
  const [walletAddress, setWalletAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // In-site signature wallet address (example)
  const signatureWalletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
  // Workflow step information
  const workflowSteps = [
    { id: 1, title: 'Create Multisig Wallet', status: 'in_progress' },
    { id: 2, title: 'Analyze Project Dependencies', status: 'pending' },
    { id: 3, title: 'Allocate Funds Based on Contributions', status: 'pending' },
    { id: 4, title: 'Contributors Claim Rewards', status: 'pending' }
  ];

  // Check if user is logged in
  useEffect(() => {
    // If session status is loaded and not authenticated, redirect to homepage
    if (status !== 'loading' && status !== 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Validate wallet address format
  const isValidWalletAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle binding multisig wallet
  const handleBindWallet = async () => {
    // Validate wallet address
    if (!walletAddress) {
      setError('Please enter a multisig wallet address');
      return;
    }

    if (!isValidWalletAddress(walletAddress)) {
      setError('Please enter a valid wallet address');
      return;
    }

    setError('');
    setIsCreating(true);

    try {
      // Call API to create multisig wallet
      const result = await createMultisigWallet(org, repo, walletAddress);
      console.log(result);
      // Save workflow status
      try {
        // Use sessionStorage to store workflow status
        sessionStorage.setItem(`workflow_${org}_${repo}`, 'started');
      } catch (error) {
        console.error('Failed to save workflow status:', error);
        // Continue the process without interrupting user experience
      }
      
      // Return to dependency list page
      router.push(`/${org}/${repo}`);
    } catch (error) {
      console.error('Failed to bind wallet:', error);
      setError('Failed to bind multisig wallet, please try again');
    } finally {
      setIsCreating(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8 space-x-2">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-primary text-white' 
                  : currentStep > step 
                    ? 'bg-gray-200 text-gray-600' 
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div className="w-16 h-1 bg-gray-200">
                <div 
                  className={`h-full bg-primary transition-all ${
                    currentStep > step ? 'w-full' : 'w-0'
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Render step title
  const renderStepTitle = () => {
    const titles = [
      "Let's Get Started", 
      "Understand Project Workflow", 
      "Enter Multisig Wallet Address"
    ];
    
    return titles[currentStep - 1];
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h1 className="text-4xl font-bold text-center mb-4">{renderStepTitle()}</h1>
            <p className="text-center text-gray-600 mb-10">
              Create a multisig wallet for distributing contribution rewards, making open source contributions more valuable.
            </p>
            
            <div className="mb-10">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Role of Multisig Wallet</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li>Manage project developer contribution records</li>
                  <li>Provide transparent, secure reward mechanisms for contributors</li>
                  <li>Ensure fair and transparent fund allocation</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={goToNextStep}
              className="w-full py-3 rounded-lg font-bold text-white transition-all bg-primary hover:bg-primary/90"
            >
              Create Multisig Wallet
            </button>
          </>
        );
      
      case 2:
        return (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">{renderStepTitle()}</h1>
            <p className="text-center text-gray-600 mb-8">
              We want you to understand the purpose of creating a multisig wallet and the project workflow
            </p>
            
            <div className="mb-8">
              <div className="relative pl-8 border-l-2 border-primary">
                {workflowSteps.map((step) => (
                  <div key={step.id} className="mb-8 relative">
                    <div className={`absolute left-[-17px] w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'in_progress' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.id}
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-lg font-semibold ${
                        step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important Note:</strong> You need to add the in-site signature wallet address as one of the multisig members. In-site wallet address: <span className="font-mono">{signatureWalletAddress}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={goToPreviousStep}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={goToNextStep}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                I Agree
              </button>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">{renderStepTitle()}</h1>
            <p className="text-center text-gray-600 mb-8">
              This multisig wallet address will only be used for this project workflow. Please enter your multisig wallet address created on other platforms.
            </p>
            
            <div className="mb-8">
              <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700 mb-2">
                Multisig Wallet Address
              </label>
              <input
                type="text"
                id="wallet-address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter multisig wallet address (0x...)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Please Note:</strong> This wallet address will be used to receive funds and distribute contribution rewards. Please ensure that the in-site signature wallet address has been added as one of the multisig members.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={goToPreviousStep}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleBindWallet}
                disabled={isCreating || !walletAddress}
                className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-200 ${
                  isCreating || !walletAddress
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Bind'}
              </button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />
      
      <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 overflow-hidden p-8">
        {renderStepIndicator()}
        {renderStepContent()}
      </div>
    </main>
  );
} 