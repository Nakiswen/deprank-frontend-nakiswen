/**
 * API Service
 * Responsible for handling interactions with backend API
 */

// Simulate API request delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API response interface definition
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface Contributor {
  username: string;
  avatarUrl: string;
}

export interface DependencyListDataItem {
  name: string;
  org: string;
  repo: string;
  contributor: string;
  contributors: Contributor[];
  contributionPercentage: number;
  lastUpdated: string;
  status: "completed" | "in_progress" | "pending"; // Add workflow status
  codeSnippet?: string;
}

// Dependency list response data
export interface DependencyListData {
  list: Array<DependencyListDataItem>;
  isProjectOwner: boolean; // Add project owner perspective flag
}

// Claim status response data interface
interface ClaimStatusData {
  claimed: boolean;
  claimedBy?: string;
  claimedAt?: string;
  walletAddress?: string;
  lastChecked?: string;
}

// Claim reward response data interface
interface ClaimRewardData {
  transactionId: string;
  amount: string;
  wallet: string;
  dependency: string;
  claimedAt: string;
}

/**
 * Get dependency list
 * @param org - GitHub organization name
 * @param repo - Repository name
 * @returns Promise<ApiResponse<DependencyListData>>
 */
export async function getDependencyList(
  org: string,
  repo: string
): Promise<ApiResponse<DependencyListData>> {
  try {
    // const response = await fetch(`/api/dependencies/${org}/${repo}`);
    const response = await fetch("/mocks/api/web/dependency-list.json");
    const data = await response.json();
    console.log("🚀 ~ getDependencyList ~ data:", org, repo, data);
    return {
      success: true,
      data,
      message: "Successfully fetched dependency list",
    };
  } catch (error) {
    console.error("Failed to fetch dependency list:", error);
    throw error;
  }
}

/**
 * Get repository details
 * @param org Organization name
 * @param repo Repository name
 */
export async function getRepoDetails(org: string, repo: string) {
  try {
    // Simulate API request delay
    await delay(300);

    // Get data from mock file
    const response = await fetch("/mocks/api/web/repo-details.json");
    const allRepos = await response.json();

    // Get specific repository data
    const repoKey = `${org}/${repo}`;
    const repoData = allRepos[repoKey];

    if (!repoData) {
      throw new Error("Repository not found");
    }

    return {
      success: true,
      data: repoData,
      message: "Successfully fetched repository details",
    };
  } catch (error) {
    console.error("Failed to fetch repository details:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch repository details",
    };
  }
}

/**
 * Get dependency details
 * @param dependency Dependency name
 */
export async function getDependencyDetails(dependency: string) {
  try {
    // Simulate API request delay
    await delay(400);

    // Get data from mock file
    const response = await fetch("/mocks/api/web/dependency-details.json");
    const allDependencies = await response.json();

    // Get specific dependency data
    const dependencyData = allDependencies[dependency];

    if (!dependencyData) {
      throw new Error("Dependency not found");
    }

    return {
      success: true,
      data: dependencyData,
      message: "Successfully fetched dependency details",
    };
  } catch (error) {
    console.error("Failed to fetch dependency details:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch dependency details",
    };
  }
}

/**
 * Get workflow status
 * @param org Organization name
 * @param repo Repository name
 */
export async function getWorkflowStatus(org: string, repo: string) {
  try {
    // Simulate API request delay
    await delay(200);

    // Get data from mock file
    const response = await fetch("/mocks/api/web/repo-details.json");
    const allRepos = await response.json();

    // Get specific repository data
    const repoKey = `${org}/${repo}`;
    const repoData = allRepos[repoKey];

    if (!repoData) {
      throw new Error("Repository not found");
    }

    return {
      success: true,
      data: { status: repoData.workflow_status },
      message: "Successfully fetched workflow status",
    };
  } catch (error) {
    console.error("Failed to fetch workflow status:", error);
    return {
      success: false,
      data: { status: "unknown" },
      message: "Failed to fetch workflow status",
    };
  }
}

/**
 * Update workflow status
 * @param org Organization name
 * @param repo Repository name
 * @param status Workflow status
 */
export async function updateWorkflowStatus(
  org: string,
  repo: string,
  status: string
) {
  try {
    // Simulate API request delay
    await delay(300);

    // In actual project, this would send a POST request to backend API
    // Here we just simulate a successful response
    return {
      success: true,
      data: { status },
      message: "Successfully updated workflow status",
    };
  } catch (error) {
    console.error("Failed to update workflow status:", error);
    return {
      success: false,
      data: null,
      message: "Failed to update workflow status",
    };
  }
}

/**
 * Create multisig wallet
 * @param org Organization name
 * @param repo Repository name
 * @param walletAddress Wallet address
 */
export async function createMultisigWallet(
  org: string,
  repo: string,
  walletAddress: string
) {
  try {
    // Simulate API request delay
    await delay(1500);

    // In actual project, this would send a POST request to backend API
    // Here we just simulate a successful response
    return {
      success: true,
      data: {
        wallet_address: walletAddress,
        created_at: new Date().toISOString(),
      },
      message: "Successfully created multisig wallet",
    };
  } catch (error) {
    console.error("Failed to create multisig wallet:", error);
    return {
      success: false,
      data: null,
      message: "Failed to create multisig wallet",
    };
  }
}

/**
 * Check reward claim status
 * @param org Organization name
 * @param repo Repository name
 * @param dependency Dependency name
 * @returns Claim status response
 */
export async function checkClaimStatus(
  org: string,
  repo: string,
  dependency: string
): Promise<ApiResponse<ClaimStatusData>> {
  try {
    // Simulate API request delay
    await delay(500);

    // Get data from mock file
    const response = await fetch("/mocks/api/web/claim-status.json");
    const allClaimStatus = await response.json();

    // Build query key
    const claimKey = `${org}/${repo}/${dependency}`;

    // Get specific dependency claim status
    const claimStatus = allClaimStatus[claimKey] || {
      claimed: false,
      lastChecked: new Date().toISOString(),
    };

    return {
      success: true,
      data: claimStatus,
      message: "Successfully retrieved claim status",
    };
  } catch (error) {
    console.error("Failed to retrieve claim status:", error);
    return {
      success: false,
      data: { claimed: false },
      message: "Failed to retrieve claim status",
    };
  }
}

/**
 * Claim dependency contribution reward
 * @param org Organization name
 * @param repo Repository name
 * @param dependency Dependency name
 * @param walletAddress Wallet address
 * @returns Claim result response
 */
export async function claimReward(
  org: string,
  repo: string,
  dependency: string,
  walletAddress: string
): Promise<ApiResponse<ClaimRewardData>> {
  try {
    // Simulate API request delay - intentionally set longer to simulate blockchain operation
    await delay(2000);

    // Validate wallet address format
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    // Get data from mock file
    const response = await fetch("/mocks/api/web/claim-reward.json");
    const claimResult = await response.json();

    // Ensure wallet address in data matches request
    if (claimResult.data) {
      claimResult.data.wallet = walletAddress;
      claimResult.data.dependency = dependency;
      claimResult.data.claimedAt = new Date().toISOString();
    }

    return claimResult;
  } catch (error) {
    console.error("Failed to claim reward:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to claim reward, please try again later";

    return {
      success: false,
      data: null,
      message: errorMessage,
    } as unknown as ApiResponse<ClaimRewardData>;
  }
}
