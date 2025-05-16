import React from 'react';

/**
 * Background component, provides the visual foundation for the website
 * Includes background image, grid and gradient effects
 */
export default function Background() {
  return (
    <>
      {/* Background image */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src="/assets/bg.webp"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid background overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(180, 190, 180, 0.045),
            rgba(180, 190, 180, 0.045) 1px,
            transparent 1px,
            transparent 40px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(180, 190, 180, 0.045),
            rgba(180, 190, 180, 0.045) 1px,
            transparent 1px,
            transparent 40px
          )`,
          mixBlendMode: 'lighten',
        }}
      ></div>

      {/* Soft radial gradient */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none"
        style={{
          background: `radial-gradient(
            ellipse 60% 40% at 60% 20%,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.2) 60%,
            transparent 100%
          )`,
        }}
      ></div>
    </>
  );
} 