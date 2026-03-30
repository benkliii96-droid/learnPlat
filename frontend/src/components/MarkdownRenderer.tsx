import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

// Простой компонент для подсветки кода
function CodeBlock({ children, className }: { children: string; className?: string }) {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');
  
  if (!match) {
    // Inline код без языка
    return (
      <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  const language = match[1];
  
  // Базовая подсветка для JS/JSX
  let highlighted = code;
  if (language === 'javascript' || language === 'js' || language === 'jsx') {
    highlighted = code
      .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="string">$&</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|typeof|instanceof)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="boolean">$1</span>');
  }

  return (
    <div className="relative my-4 group">
      <div className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-300 bg-gray-700 rounded-tr-lg rounded-bl-lg">
        {language}
      </div>
      <pre className="bg-[#1e1e1e] text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono code-block" style={{ margin: 0 }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !className;

          if (isInline) {
            return (
              <code
                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <CodeBlock className={className}>
              {String(children)}
            </CodeBlock>
          );
        },
        h1: ({ children }) => <h1 className="mt-6 mb-4 text-2xl font-bold text-gray-900">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-5 mb-3 text-xl font-bold text-gray-900">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-4 mb-2 text-lg font-bold text-gray-900">{children}</h3>,
        p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
        ul: ({ children }) => <ul className="mb-4 text-gray-700 list-disc list-inside">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 text-gray-700 list-decimal list-inside">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        a: ({ children, href }) => <a href={href} className="text-blue-600 hover:underline">{children}</a>,
        blockquote: ({ children }) => <blockquote className="pl-4 my-4 italic text-gray-600 border-l-4 border-gray-300">{children}</blockquote>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
