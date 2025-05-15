'use client';

import React, { useEffect, useRef } from 'react';
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
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    try {
      if (preRef.current) {
        const preElement = preRef.current;
        preElement.innerHTML = '';
        
        // 创建代码容器
        const codeContainer = document.createElement('code');
        codeContainer.className = 'block w-full';
        preElement.appendChild(codeContainer);
        
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
              lineHighlighted = hljs.highlight(line, { language }).value;
            } catch (error) {
              lineHighlighted = hljs.highlightAuto(line).value;
            }
          }
          
          codeContentElement.innerHTML = lineHighlighted;
          lineElement.appendChild(codeContentElement);
          
          codeContainer.appendChild(lineElement);
        });
      }
    } catch (error) {
      console.error('代码高亮处理错误:', error);
      // 发生错误时显示原始代码
      if (preRef.current) {
        preRef.current.textContent = code;
      }
    }
  }, [code, language, startingLineNumber, showLineNumbers]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {fileName && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 text-sm text-gray-600 font-mono">
          {fileName}
        </div>
      )}
      <pre ref={preRef} className="relative overflow-x-auto text-sm bg-gray-50">
        {code}
      </pre>
    </div>
  );
};

export default CodeBlock; 