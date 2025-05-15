/**
 * API服务
 * 负责处理与后端API的交互
 */

// 模拟API请求延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API响应接口定义
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// 依赖列表响应数据
interface DependencyListData {
  list: Array<{
    name: string;
    org: string;
    repo: string;
    contributor: string;
    contributionPercentage: number;
    lastUpdated: string;
    status: 'completed' | 'in_progress' | 'pending'; // 添加工作流状态
  }>;
  isProjectOwner: boolean; // 添加项目方视角标志
}

// 依赖详情响应数据
interface DependencyDetailsData {
  name: string;
  contributor: string;
  contributionPercentage: number;
  lastUpdated: string;
  codeSnippet?: string;
  workflowSteps: Array<{
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
  }>;
}

/**
 * 获取依赖列表
 * @param org - GitHub组织名
 * @param repo - 仓库名
 * @returns Promise<ApiResponse<DependencyListData>>
 */
export async function getDependencyList(org: string, repo: string): Promise<ApiResponse<DependencyListData>> {
  try {
    // const response = await fetch(`/api/dependencies/${org}/${repo}`);
    const response = await fetch('/mocks/api/web/dependency-list.json');
    const data = await response.json();
    console.log("🚀 ~ getDependencyList ~ data:", data)
    return {
      success: true,
      data,
      message: 'Successfully fetched dependency list'
    };
  } catch (error) {
    console.error('Failed to fetch dependency list:', error);
    throw error;
  }
}

/**
 * 获取仓库详情
 * @param org 组织名称
 * @param repo 仓库名称
 */
export async function getRepoDetails(org: string, repo: string) {
  try {
    // 模拟API请求延迟
    await delay(300);
    
    // 从mock文件获取数据
    const response = await fetch('/mocks/api/web/repo-details.json');
    const allRepos = await response.json();
    
    // 获取特定仓库数据
    const repoKey = `${org}/${repo}`;
    const repoData = allRepos[repoKey];
    
    if (!repoData) {
      throw new Error('Repository not found');
    }
    
    return {
      success: true,
      data: repoData,
      message: 'Successfully fetched repository details'
    };
  } catch (error) {
    console.error('Failed to fetch repository details:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to fetch repository details'
    };
  }
}

/**
 * 获取依赖详情
 * @param dependency 依赖名称
 */
export async function getDependencyDetails(dependency: string) {
  try {
    // 模拟API请求延迟
    await delay(400);
    
    // 从mock文件获取数据
    const response = await fetch('/mocks/api/web/dependency-details.json');
    const allDependencies = await response.json();
    
    // 获取特定依赖数据
    const dependencyData = allDependencies[dependency];
    
    if (!dependencyData) {
      throw new Error('Dependency not found');
    }
    
    return {
      success: true,
      data: dependencyData,
      message: 'Successfully fetched dependency details'
    };
  } catch (error) {
    console.error('Failed to fetch dependency details:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to fetch dependency details'
    };
  }
}

/**
 * 获取工作流状态
 * @param org 组织名称
 * @param repo 仓库名称
 */
export async function getWorkflowStatus(org: string, repo: string) {
  try {
    // 模拟API请求延迟
    await delay(200);
    
    // 从mock文件获取数据
    const response = await fetch('/mocks/api/web/repo-details.json');
    const allRepos = await response.json();
    
    // 获取特定仓库数据
    const repoKey = `${org}/${repo}`;
    const repoData = allRepos[repoKey];
    
    if (!repoData) {
      throw new Error('Repository not found');
    }
    
    return {
      success: true,
      data: { status: repoData.workflow_status },
      message: 'Successfully fetched workflow status'
    };
  } catch (error) {
    console.error('Failed to fetch workflow status:', error);
    return {
      success: false,
      data: { status: 'unknown' },
      message: 'Failed to fetch workflow status'
    };
  }
}

/**
 * 更新工作流状态
 * @param org 组织名称
 * @param repo 仓库名称
 * @param status 工作流状态
 */
export async function updateWorkflowStatus(org: string, repo: string, status: string) {
  try {
    // 模拟API请求延迟
    await delay(300);
    
    // 实际项目中这里会发送POST请求到后端API
    // 这里只模拟成功响应
    return {
      success: true,
      data: { status },
      message: 'Successfully updated workflow status'
    };
  } catch (error) {
    console.error('Failed to update workflow status:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to update workflow status'
    };
  }
}

/**
 * 创建多签钱包
 * @param org 组织名称
 * @param repo 仓库名称
 * @param walletAddress 钱包地址
 */
export async function createMultisigWallet(org: string, repo: string, walletAddress: string) {
  try {
    // 模拟API请求延迟
    await delay(1500);
    
    // 实际项目中这里会发送POST请求到后端API
    // 这里只模拟成功响应
    return {
      success: true,
      data: {
        wallet_address: walletAddress,
        created_at: new Date().toISOString()
      },
      message: 'Successfully created multisig wallet'
    };
  } catch (error) {
    console.error('Failed to create multisig wallet:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to create multisig wallet'
    };
  }
} 