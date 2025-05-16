'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Authentication Context Provider
 * Wraps the entire application to provide session information
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 