'use client';

import React, { useEffect, useState } from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * 错误提示弹窗组件
 * 用于展示操作失败的友好提示，提供详细错误信息和解决方案
 * @param message 错误信息内容
 * @param onClose 关闭弹窗的回调函数
 * @param isOpen 控制弹窗是否显示
 */
const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // 监听isOpen状态变化，控制弹窗的显示和淡出效果
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      if (isVisible) {
        setIsClosing(true);
        // 添加延迟，确保动画完成后才真正隐藏弹窗
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 300); // 与CSS动画时长匹配
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, isVisible]);

  // 处理关闭弹窗
  const handleClose = () => {
    setIsClosing(true);
    // 添加延迟，确保动画完成后才触发onClose回调
    setTimeout(() => {
      onClose();
      setIsVisible(false);
    }, 300);
  };

  // 如果弹窗不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* 弹窗内容 */}
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* 顶部图标和标题 */}
        <div className="px-6 pt-6 pb-2 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">操作失败</h3>
        </div>
        
        {/* 错误消息内容 */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
          
          {/* 可能的解决方案提示 */}
          <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              您可以尝试以下解决方案：
            </p>
            <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 list-disc list-inside">
              <li>检查您的网络连接是否稳定</li>
              <li>确认您有足够的权限进行此操作</li>
              <li>稍后再试或联系平台支持团队</li>
            </ul>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            关闭
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 