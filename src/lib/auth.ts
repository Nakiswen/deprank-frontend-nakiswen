/**
 * Better Auth 集成
 * 
 * 这个文件包含了 Better Auth 的配置和集成代码
 * 参考文档: https://www.better-auth.com/
 */

// GitHub OAuth配置
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23liKEumnmgfaqWaFx';
const GITHUB_REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/oauth/callback` : '';
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=user,repo`;

interface AuthOptions {
  database: any;
  emailAndPassword: {
    enabled: boolean;
  };
  plugins: any[];
}

interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  } | null;
  isAuthenticated: boolean;
  login: (provider: string, redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  getSession: () => Promise<any>;
}

// Better Auth 集成
export const betterAuth = (options: AuthOptions): AuthResult => {
  // 检查本地存储中的登录状态
  const checkAuthStatus = (): boolean => {
    try {
      return localStorage.getItem('authStatus') === 'logged-in';
    } catch (error) {
      console.error('Failed to check auth status:', error);
      return false;
    }
  };
  
  // 实现GitHub登录
  const login = async (provider: string, redirectPath: string = '/'): Promise<void> => {
    console.log(`Logging in with provider: ${provider}`);
    
    // 实现GitHub OAuth流程
    if (provider === 'github') {
      // 将当前路径存储在state参数中，以便授权后重定向回来
      const state = encodeURIComponent(redirectPath);
      const authUrl = `${GITHUB_OAUTH_URL}&state=${state}`;
      
      // 重定向到GitHub授权页面
      window.location.href = authUrl;
    }
  };
  
  // 登出功能
  const logout = async (): Promise<void> => {
    localStorage.removeItem('authStatus');
    localStorage.removeItem('userName');
    localStorage.removeItem('userDisplayName');
    localStorage.removeItem('githubToken');
    localStorage.removeItem('userAvatar');
  };
  
  // 获取会话信息
  const getSession = async (): Promise<any> => {
    const isAuthenticated = checkAuthStatus();
    if (!isAuthenticated) {
      return null;
    }
    
    try {
      // 从localStorage获取用户信息
      const userName = localStorage.getItem('userName');
      const displayName = localStorage.getItem('userDisplayName');
      const avatar = localStorage.getItem('userAvatar');
      const token = localStorage.getItem('githubToken');
      
      if (!userName) return null;
      
      return {
        id: userName,
        login: userName,
        name: displayName || userName,
        avatar: avatar || '',
        token: token
      };
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  };
  
  // 获取当前用户
  const getCurrentUser = (): any => {
    try {
      const isAuthenticated = checkAuthStatus();
      if (!isAuthenticated) return null;
      
      const userName = localStorage.getItem('userName');
      const displayName = localStorage.getItem('userDisplayName');
      const avatar = localStorage.getItem('userAvatar');
      
      if (!userName) return null;
      
      return {
        id: userName,
        email: `${userName}@github.com`, // 注意: GitHub OAuth不一定会返回邮箱
        name: displayName || userName,
        avatar: avatar || ''
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  };
  
  return {
    user: getCurrentUser(),
    isAuthenticated: checkAuthStatus(),
    login,
    logout,
    getSession
  };
};

// Better Auth 的插件
export const organization = () => ({
  name: 'organization',
  setup: () => {}
});

export const twoFactor = () => ({
  name: 'twoFactor',
  setup: () => {}
});

// 创建 auth 实例
export const auth = betterAuth({
  database: {
    connectionString: 'mock-database-connection'
  },
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    organization(),
    twoFactor()
  ]
});

// 导出 auth 实例
export default auth; 