'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface SuccessAnimationProps {
  message?: string; // Optional success message parameter
}

/**
 * Success Reward Celebration Animation Component
 * Uses canvas-confetti library to implement fireworks special effects
 * 
 * @param {SuccessAnimationProps} props - Component properties
 * @param {string} [props.message] - Optional success message
 */
const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ message }) => {
  useEffect(() => {
    // Trigger animation when component mounts
    triggerAnimation();
  }, []);

  // Function to get random position
  const getRandomPosition = () => {
    // Generate random coordinates in the 0.2-0.8 range to avoid edges
    return {
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6
    };
  };

  // Track previous firework positions
  const lastPositions: Array<{x: number, y: number}> = [];
  
  // Get new position away from previous positions
  const getNewPosition = () => {
    // If no previous positions, simply return a random position
    if (lastPositions.length === 0) {
      const pos = getRandomPosition();
      lastPositions.push(pos);
      return pos;
    }
    
    // Try up to 10 times to get a position far enough from previous ones
    let attempts = 0;
    let newPos = getRandomPosition();
    
    while (attempts < 10) {
      let isFarEnough = true;
      
      // Check if position is far enough from the last 3 positions
      for (let i = 0; i < Math.min(3, lastPositions.length); i++) {
        const lastPos = lastPositions[lastPositions.length - 1 - i];
        const distance = Math.sqrt(
          Math.pow(newPos.x - lastPos.x, 2) + 
          Math.pow(newPos.y - lastPos.y, 2)
        );
        
        // If distance is too close, regenerate position
        if (distance < 0.3) {
          isFarEnough = false;
          break;
        }
      }
      
      if (isFarEnough) {
        break;
      }
      
      newPos = getRandomPosition();
      attempts++;
    }
    
    // Keep only the most recent 5 positions
    if (lastPositions.length >= 5) {
      lastPositions.shift();
    }
    lastPositions.push(newPos);
    
    return newPos;
  };

  // Function to trigger celebration animation
  const triggerAnimation = () => {
    // Define firework launch parameters
    const duration = 3000; // Animation duration in milliseconds
    const end = Date.now() + duration;
    
    // Create colorful firework effects
    const colors = ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#B388FF', '#EA80FC'];
    
    // Random position fireworks
    const randomConfetti = () => {
      const position = getNewPosition();
      
      confetti({
        particleCount: 50, // Reduced particle count
        angle: Math.random() * 360, // Random angle
        spread: 50 + Math.random() * 50, // Random spread range
        origin: position,
        colors: colors,
        startVelocity: 20 + Math.random() * 10,
        gravity: 0.8,
        ticks: 200, // Reduced ticks value
        shapes: ['circle', 'square'],
        scalar: 1,
      });
    };
    
    // Execute animation loop
    let frameCount = 0;
    (function frame() {
      frameCount++;
      
      // Launch fireworks at certain frame intervals to reduce simultaneous launches
      if (frameCount % 12 === 0) {
        randomConfetti();
      }
      
      // Continue animation if duration hasn't ended
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Component renders optional message
  return message ? (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <h2 className="text-3xl font-bold text-primary bg-white/90 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg">
        {message}
      </h2>
    </div>
  ) : null;
};

export default SuccessAnimation; 