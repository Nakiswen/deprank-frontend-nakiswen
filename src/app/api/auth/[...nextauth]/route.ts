import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

// Configure NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      // Request GitHub API permissions
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
      // Add HTTP request configuration to resolve timeout issues
      httpOptions: {
        timeout: 10000, // Increased to 10 seconds
      },
    }),
  ],
  callbacks: {
    // Process JWT token
    async jwt({ token, account, profile, user }) {
      // First login
      if (account && profile) {
        token.accessToken = account.access_token;
        token.tokenType = account.token_type;
        token.provider = account.provider;
        
        // Save GitHub username
        if (profile.login) {
          token.username = profile.login;
        }
        
        // Save user ID
        if (user?.id) {
          token.userId = user.id;
        }
      }
      return token;
    },
    
    // Process session
    async session({ session, token }) {
      // Session information sent to client
      if (token && typeof token === 'object') {
        // Add token information to session
        session.accessToken = token.accessToken;
        session.tokenType = token.tokenType;
        session.provider = token.provider;
        
        // Add user details
        if (session.user) {
          session.user.username = token.username;
          session.user.id = token.userId;
        }
      }
      return session;
    },
    
    // Handle redirects, ensure redirect URL is valid
    async redirect({ url, baseUrl }) {
      // Handle absolute URL case
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        // Ensure domain matches or is an allowed domain
        if (urlObj.origin === baseUrl) {
          return url;
        }
        return baseUrl;
      }
      
      // Handle relative URL case
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Default return base URL
      return baseUrl;
    },
    
    // Handle login process
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Validate required user information
        if (!user || !user.email) {
          console.error("User information is incomplete", { user });
          return false;
        }
        
        return true; // Allow login
      } catch (error) {
        console.error("Error occurred during login process:", error);
        return false; // Reject login
      }
    },
  },
  
  // Custom pages
  pages: {
    signIn: '/',  // Use homepage as login page
    error: '/auth/error', // Error page
  },
  
  // Session configuration
  session: {
    strategy: "jwt", // Use JWT strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // JWT configuration
  jwt: {
    // Use default encryption method, but can be overridden here
    // secret: process.env.NEXTAUTH_SECRET,
  },
  
  // Enable debug mode (only in development environment)
  debug: process.env.NODE_ENV === 'development',
  
  // Event handling
  events: {
    async signIn({ user }) {
      console.log("User login successful", user.email);
    },
    async signOut({ token }) {
      console.log("User logged out", token);
    },
    async error(error: Error) {
      console.error("Authentication error:", error);
    },
  },
  
  // Add CORS headers
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

// Export NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 