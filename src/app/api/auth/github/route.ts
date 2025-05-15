import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub OAuth授权API路由
 * 重定向到GitHub OAuth授权页面
 */

// GitHub OAuth配置
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'your-github-client-id';

export async function GET(request: NextRequest) {
  try {
    // 获取重定向URL参数
    const { searchParams } = new URL(request.url);
    const redirectPath = searchParams.get('redirect') || '/';
    
    // 将重定向路径存储在Cookie中，以便授权后重定向回原页面
    const redirectUrl = `${request.nextUrl.origin}/oauth/callback`;
    
    // 构建GitHub OAuth授权URL
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user,repo&state=${encodeURIComponent(redirectPath)}`;
    
    // 重定向到GitHub授权页面
    return NextResponse.redirect(githubAuthUrl);
  } catch (error) {
    console.error('GitHub auth redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to redirect to GitHub authorization' },
      { status: 500 }
    );
  }
} 