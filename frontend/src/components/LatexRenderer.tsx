import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface LatexRendererProps {
  content: string;
}

function normalizeMathDelimiters(input: string) {
  return input
    // display math
    .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, math) => `\n\n$$\n${math}\n$$\n\n`)
    // inline math
    .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, math) => `$${math}$`);
}


export const LatexRenderer = ({ content }: LatexRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {normalizeMathDelimiters(content)}
    </ReactMarkdown>
  );
};
