"use client";

import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
// Pre-import common language support
import "highlight.js/lib/common";
import "highlight.js/styles/github.css";
// No need to import here, will be imported in individual pages

interface CodeBlockProps {
  code: string;
  language?: string;
  startingLineNumber?: number;
  fileName?: string;
  showLineNumbers?: boolean;
}

/**
 * GitHub-style code display component
 * Supports syntax highlighting, line numbers, filenames and other features
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
  startingLineNumber = 1,
  fileName,
  showLineNumbers = true,
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    try {
      if (preRef.current) {
        const preElement = preRef.current;
        preElement.innerHTML = "";

        // Create code container
        const codeContainer = document.createElement("code");
        codeContainer.className = "block w-full";
        preElement.appendChild(codeContainer);

        // Split code into lines
        const codeLines = code.split("\n");

        // Create elements for each line
        codeLines.forEach((line, index) => {
          const lineNumber = startingLineNumber + index;
          const lineElement = document.createElement("div");
          lineElement.className = "code-line";

          // Create line number element
          if (showLineNumbers) {
            const lineNumberElement = document.createElement("span");
            lineNumberElement.className = "line-number";
            lineNumberElement.textContent = lineNumber.toString();
            lineElement.appendChild(lineNumberElement);
          }

          // Create code content element
          const codeContentElement = document.createElement("span");
          codeContentElement.className = "code-content";

          // Get highlighted HTML for this line
          let lineHighlighted;
          if (line.trim() === "") {
            lineHighlighted = "&nbsp;"; // Handle empty lines
          } else {
            try {
              lineHighlighted = hljs.highlight(line, { language }).value;
            } catch (error) {
              lineHighlighted = hljs.highlightAuto(line).value;
              console.log("🚀 ~ codeLines.forEach ~ error:", error);
            }
          }

          codeContentElement.innerHTML = lineHighlighted;
          lineElement.appendChild(codeContentElement);

          codeContainer.appendChild(lineElement);
        });
      }
    } catch (error) {
      console.error("Code highlighting error:", error);
      // Show original code when error occurs
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
