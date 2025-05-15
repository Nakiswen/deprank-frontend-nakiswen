'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

/**
 * 成功领取奖励庆祝动画组件
 * 使用canvas-confetti库实现烟花礼炮特效
 */
const SuccessAnimation: React.FC = () => {
  useEffect(() => {
    // 在组件挂载时触发动画
    triggerAnimation();
  }, []);

  // 触发庆祝动画函数
  const triggerAnimation = () => {
    // 定义烟花发射参数
    const duration = 3000; // 动画持续时间，单位毫秒
    const end = Date.now() + duration;
    
    // 创建彩色烟花效果
    const colors = ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#B388FF', '#EA80FC'];
    
    // 左侧烟花
    const leftConfetti = () => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        startVelocity: 30,
        gravity: 0.8,
        ticks: 300,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    };
    
    // 右侧烟花
    const rightConfetti = () => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        startVelocity: 30,
        gravity: 0.8,
        ticks: 300,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    };
    
    // 中间烟花
    const centerConfetti = () => {
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { x: 0.5, y: 0.6 },
        colors: colors,
        startVelocity: 40,
        gravity: 0.7,
        ticks: 300,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    };
    
    // 执行动画循环
    (function frame() {
      leftConfetti();
      rightConfetti();
      
      // 每500毫秒发射中间烟花
      if (Date.now() % 500 < 50) {
        centerConfetti();
      }
      
      // 如果动画时间未结束，继续动画
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // 组件不渲染可见内容，只负责触发动画效果
  return null;
};

export default SuccessAnimation; 