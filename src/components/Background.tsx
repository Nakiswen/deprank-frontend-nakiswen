import React from 'react';

/**
 * 背景组件，提供网站的视觉底层
 * 包含背景图片、网格和渐变效果
 */
export default function Background() {
  return (
    <>
      {/* 背景图片 */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src="/assets/bg.webp"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* 网格背景叠加 */}
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

      {/* 柔光径向渐变 */}
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