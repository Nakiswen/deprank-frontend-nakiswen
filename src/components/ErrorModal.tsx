'use client';

import React, { useEffect, useState } from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * Error Notification Modal Component
 * Used to display friendly notifications for failed operations, providing detailed error information and solutions
 * @param message Error message content
 * @param onClose Callback function to close the modal
 * @param isOpen Controls whether the modal is displayed
 */
const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Monitor changes in isOpen state, control the display and fade-out effect of the modal
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      if (isVisible) {
        setIsClosing(true);
        // Add delay to ensure the animation completes before actually hiding the modal
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 300); // Match the CSS animation duration
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, isVisible]);

  // Handle closing the modal
  const handleClose = () => {
    setIsClosing(true);
    // Add delay to ensure the animation completes before triggering the onClose callback
    setTimeout(() => {
      onClose();
      setIsVisible(false);
    }, 300);
  };

  // If the modal is not visible, don't render any content
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal content */}
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Top icon and title */}
        <div className="px-6 pt-6 pb-2 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Operation Failed</h3>
        </div>
        
        {/* Error message content */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
          
          {/* Possible solutions */}
          <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can try the following solutions:
            </p>
            <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 list-disc list-inside">
              <li>Check if your network connection is stable</li>
              <li>Ensure you have sufficient permissions for this operation</li>
              <li>Try again later or contact platform support</li>
            </ul>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 