import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsLang from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import prismStyle from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';

SyntaxHighlighter.registerLanguage('javascript', jsLang);
SyntaxHighlighter.registerLanguage('js', jsLang);
SyntaxHighlighter.registerLanguage('html', jsLang);
SyntaxHighlighter.registerLanguage('css', jsLang);
SyntaxHighlighter.registerLanguage('php', jsLang);

interface Props {
  content: string;
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
                className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <SyntaxHighlighter
              style={prismStyle}
              language={match ? match[1] : 'text'}
              PreTag="div"
              className="rounded-lg my-4"
              customStyle={{ 
                borderRadius: '0.5rem',
                background: '#282c34',
                padding: '1rem',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
