import "next-auth";
import { DefaultSession } from "next-auth";

// 扩展 JWT 类型
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    tokenType?: string;
    provider?: string;
    username?: string;
    userId?: string;
  }
}

// 扩展 Session 类型
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    tokenType?: string;
    provider?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
  }

  interface Profile {
    login?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  }

  // 扩展事件回调类型
  interface EventCallbacks {
    error(error: Error): Promise<void>;
  }
}
