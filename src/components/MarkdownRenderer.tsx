import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Anpassung der Überschriften-Stile
          h1: ({ children }) => (
            <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-cyto-400' : 'text-cyto-600'}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-2xl font-bold mt-8 mb-4 ${isDarkMode ? 'text-dark-100' : 'text-gray-900'}`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-xl font-semibold mt-6 mb-3 ${isDarkMode ? 'text-dark-200' : 'text-gray-800'}`}>
              {children}
            </h3>
          ),
          // Anpassung der Link-Stile
          a: ({ children, href }) => (
            <a 
              href={href} 
              className={`text-cyto-400 hover:text-cyto-300 transition-colors duration-300`}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Anpassung der Listen-Stile
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 my-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 my-4">
              {children}
            </ol>
          ),
          // Anpassung der Absatz-Stile
          p: ({ children }) => (
            <p className={`my-4 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
              {children}
            </p>
          ),
          // Anpassung der Blockquote-Stile
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 border-cyto-400 pl-4 my-4 ${isDarkMode ? 'text-dark-300' : 'text-gray-600'}`}>
              {children}
            </blockquote>
          ),
          // Anpassung der Tabellen-Stile
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className={`min-w-full border ${isDarkMode ? 'border-dark-700' : 'border-gray-200'}`}>
                {children}
              </table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 