'use client';

import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
// 预先导入常用语言支持
import 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';
// 不需要在这里引入，会在各页面中引入

interface CodeBlockProps {
  code: string;
  language?: string;
  startingLineNumber?: number;
  fileName?: string;
  showLineNumbers?: boolean;
}

/**
 * GitHub风格的代码展示组件
 * 支持语法高亮、行号、文件名等功能
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  startingLineNumber = 1,
  fileName,
  showLineNumbers = true,
}) => {
  const [highlighted, setHighlighted] = useState<string>('');
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    try {
      // 在下一个渲染周期处理DOM
      setTimeout(() => {
        if (preRef.current) {
          const preElement = preRef.current;
          // 清除pre元素内容
          preElement.innerHTML = '';
          
          // 分割代码行
          const codeLines = code.split('\n');
          
          // 为每一行创建元素
          codeLines.forEach((line, index) => {
            const lineNumber = startingLineNumber + index;
            const lineElement = document.createElement('div');
            lineElement.className = 'code-line';
            
            // 创建行号元素
            if (showLineNumbers) {
              const lineNumberElement = document.createElement('span');
              lineNumberElement.className = 'line-number';
              lineNumberElement.textContent = lineNumber.toString();
              lineElement.appendChild(lineNumberElement);
            }
            
            // 创建代码内容元素
            const codeContentElement = document.createElement('span');
            codeContentElement.className = 'code-content';
            
            // 获取此行的高亮HTML
            let lineHighlighted;
            if (line.trim() === '') {
              lineHighlighted = '&nbsp;'; // 空行处理
            } else {
              try {
                // 尝试使用指定语言高亮
                lineHighlighted = hljs.highlight(line, { language }).value;
              } catch (error) {
                // 如果指定语言失败，尝试自动检测
                lineHighlighted = hljs.highlightAuto(line).value;
              }
            }
            
            codeContentElement.innerHTML = lineHighlighted;
            lineElement.appendChild(codeContentElement);
            
            preElement.appendChild(lineElement);
          });
        }
      }, 0);
    } catch (error) {
      console.error('Highlighting error:', error);
      // 错误处理 - 保留原始代码
    }
  }, [code, language, startingLineNumber, showLineNumbers]);

  return (
    <div className="rounded-md overflow-hidden mb-4">
      {fileName && (
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 font-mono">
          {fileName}
        </div>
      )}
      <pre ref={preRef} className="text-sm">
        {/* 内容将通过useEffect动态填充 */}
        {code}
      </pre>
    </div>
  );
};

export default CodeBlock; 