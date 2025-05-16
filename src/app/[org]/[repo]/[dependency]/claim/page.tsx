"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Background from "@/components/Background";
import SuccessAnimation from "@/components/SuccessAnimation";
import ErrorModal from "@/components/ErrorModal";
import "@/styles/highlight.css"; // Corrected to global style path
import { useSession } from "next-auth/react";
import { checkClaimStatus, claimReward } from "@/lib/api";

interface Params {
  org: string;
  repo: string;
  dependency: string;
}

/**
 * Claim reward page
 * Allows contributors to enter wallet address to claim rewards
 */
export default function ClaimPage({ params }: { params: Params }) {
  const { org, repo, dependency } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [walletAddress, setWalletAddress] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Add states for success and error modals
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Add state to track if already claimed
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  // Add state to track checking claim status
  const [isCheckingClaimStatus, setIsCheckingClaimStatus] = useState(true);

  // Check user login status
  useEffect(() => {
    setIsLoggedIn(status === "authenticated" && !!session);
  }, [session, status]);

  // Check if already claimed
  useEffect(() => {
    const fetchClaimStatus = async () => {
      setIsCheckingClaimStatus(true);
      try {
        // Use encapsulated API method
        const result = await checkClaimStatus(org, repo, dependency);

        if (result.success && result.data.claimed) {
          setAlreadyClaimed(true);
        }
      } catch (error) {
        console.error("Failed to check claim status:", error);
        // Error handling: if cannot confirm whether claimed, allow attempting to claim
      } finally {
        setIsCheckingClaimStatus(false);
      }
    };

    fetchClaimStatus();
  }, [org, repo, dependency]);

  // Validate wallet address format
  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Handle claiming contribution
  const handleClaim = async () => {
    // Check if already claimed, if claimed, still allow attempting to claim (will show success page)
    if (alreadyClaimed) {
      setShowSuccess(true);
      return;
    }

    // Check if logged in
    if (!isLoggedIn) {
      setError("Please log in with your GitHub account first");
      return;
    }

    // Validate wallet address
    if (!walletAddress) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidEthereumAddress(walletAddress)) {
      setError("Please enter a valid Ethereum wallet address");
      return;
    }

    setError("");
    setIsClaiming(true);

    try {
      // Use encapsulated API method
      const result = await claimReward(org, repo, dependency, walletAddress);

      if (result.success) {
        // Show success celebration animation
        setAlreadyClaimed(true);
        setShowSuccess(true);
      } else {
        // Show failure modal
        setErrorMessage(
          result.message || "Failed to claim reward. Please try again later."
        );
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to claim contribution:", error);
      // Show error modal
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network request failed. Please check your connection and try again.";
      setErrorMessage(errorMessage);
      setErrorModalOpen(true);
    } finally {
      setIsClaiming(false);
    }
  };

  // Close error modal
  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  // Handle return button
  const handleReturnToDetail = () => {
    router.push(`/${org}/${repo}/${dependency}`);
  };

  // If checking claim status, show loading
  if (isCheckingClaimStatus) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <Background />
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-700">Checking claim status...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <Background />

      {/* Success animation */}
      {showSuccess && (
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden mt-8">
          <div className="p-8 text-center">
            <SuccessAnimation />
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Claim Successful
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully claimed rewards for {dependency}
            </p>
            <button
              onClick={handleReturnToDetail}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              Return to Dependency Details
            </button>
          </div>
        </div>
      )}

      {/* Error modal */}
      <ErrorModal
        isOpen={errorModalOpen}
        message={errorMessage}
        onClose={handleCloseErrorModal}
      />

      {/* Only show form if not successfully claimed */}
      {!showSuccess && (
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/80">
            <h1 className="text-2xl font-bold text-gray-900">
              Claim Contribution Rewards
            </h1>
            <p className="text-gray-600 mt-1">
              {org}/{repo} project&apos;s {dependency} dependency
            </p>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                As a contributor to {dependency}, you can claim rewards for your
                contribution. Please enter your wallet address to claim.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      To prevent abuse, you need to verify your identity with
                      GitHub before claiming. Please ensure you are logged in.
                    </p>

                    {!isLoggedIn && (
                      <div className="mt-2">
                        <div className="text-sm font-medium text-red-600">
                          You are not currently logged in. Please log in with
                          your GitHub account first.
                        </div>
                      </div>
                    )}

                    {isLoggedIn && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        Logged in with GitHub account:{" "}
                        {session?.user?.name || session?.user?.username}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <label
                htmlFor="wallet-address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Wallet Address
              </label>
              <input
                type="text"
                id="wallet-address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Ethereum wallet address (0x...)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none"
                disabled={isClaiming} // Disable input while claiming
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClaim}
                disabled={isClaiming || !isLoggedIn}
                className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-200 ${
                  isClaiming || !isLoggedIn
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:shadow-lg"
                }`}
              >
                {isClaiming ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Claiming...
                  </span>
                ) : !isLoggedIn ? (
                  "Please Log in with GitHub First"
                ) : (
                  "Claim Rewards"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
