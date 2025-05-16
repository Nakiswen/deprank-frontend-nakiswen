"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./LoginButton";
import { useSession } from "next-auth/react";

/**
 * Top navigation bar component
 * Contains Logo and navigation links
 */
export default function Navbar() {
  const { data: session } = useSession();

  // Check if user is logged in
  const isLoggedIn = !!session;

  return (
    <nav className="fixed top-0 left-0 w-full z-20 shadow-md backdrop-blur-xl border-b border-gray-200 bg-white/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center select-none">
            <div className="mr-2 w-10 h-10">
              <Image
                src="/assets/logo.svg"
                alt="DepRank Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
                style={{ marginTop: "0.2rem", transform: "scale(.85)" }}
              />
            </div>
            <div className="flex" style={{ width: 160, height: 40 }}>
              <svg
                viewBox="0 0 200 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="26"
                  fontFamily="Montserrat, Orbitron, Arial, sans-serif"
                  fontSize="26"
                  fontWeight="bold"
                  letterSpacing="2"
                  fill="#111"
                >
                  DEPRANK
                </text>
                {/* Font style: E with shortened middle line, A without crossbar, K with sharp angles */}
                <rect x="22" y="16" width="7" height="2.5" fill="#fff" />
                <rect x="48" y="13" width="10" height="2.5" fill="#fff" />
                <rect x="85" y="18" width="10" height="2.5" fill="#fff" />
              </svg>
            </div>
          </Link>

          {/* Navigation links and login button */}
          <div className="flex items-center space-x-4">
            {/* Workflows link - displayed when user is logged in */}
            {isLoggedIn && (
              <Link
                href="/workflows"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Workflows
              </Link>
            )}

            {/* GitHub Login Button */}
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
