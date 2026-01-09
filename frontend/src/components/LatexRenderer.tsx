import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useMemo } from 'react';

interface LatexRendererProps {
  content: string;
  block?: boolean;
}

export const LatexRenderer = ({ content, block = false }: LatexRendererProps) => {
  const renderedContent = useMemo(() => {
    // Check if content contains LaTeX delimiters
    const hasLatex = content.includes('$');
    
    if (!hasLatex) {
      return content;
    }

    // Parse mixed content with LaTeX
    const parts = content.split(/(\$[^$]+\$)/g);
    
    const htmlParts = parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        try {
          const html = katex.renderToString(latex, {
            throwOnError: false,
            displayMode: block,
          });
          return html;
        } catch (error) {
          console.error('LaTeX parsing error:', error);
          return `<span class="text-destructive">${part}</span>`;
        }
      }
      return part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });
    
    return htmlParts.join('');
  }, [content, block]);

  const hasLatex = content.includes('$');

  if (!hasLatex) {
    return <span>{content}</span>;
  }

  return (
    <span 
      className="latex-content"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};
