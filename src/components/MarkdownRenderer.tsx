import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into blocks by double newlines or line groups
  const lines = content.split('\n');

  const renderFormattedInlineText = (text: string): React.ReactNode[] => {
    // Helper to parse inline markdown (bold, italic, code, links, strikethrough)
    const elements: React.ReactNode[] = [];
    const remaining = text;
    let keyIndex = 0;

    // Pattern for inline elements:
    // 1. Link: [label](url)
    // 2. Bold: **text** or __text__
    // 3. Italic: *text* or _text_
    // 4. Strikethrough: ~~text~~
    // 5. Code: `code`
    const regex = /(\[.*?\]\(.*?\))|(\*\*.*?\*\*|__.*?__)|(\*.*?\*|_.*?_)|(~~.*?~~)|(`.*?`)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Push preceding normal text
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }

      const matchText = match[0];

      if (match[1]) {
        // Link [label](url)
        const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(matchText);
        if (linkMatch) {
          const label = linkMatch[1];
          const url = linkMatch[2];
          elements.push(
            <a
              key={`link-${keyIndex++}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ba68] hover:text-[#009b56] font-semibold underline transition-colors"
            >
              {label}
            </a>
          );
        } else {
          elements.push(matchText);
        }
      } else if (match[2]) {
        // Bold **text**
        const inner = matchText.slice(2, -2);
        elements.push(
          <strong key={`bold-${keyIndex++}`} className="font-extrabold text-slate-900">
            {renderFormattedInlineText(inner)}
          </strong>
        );
      } else if (match[3]) {
        // Italic *text*
        const inner = matchText.slice(1, -1);
        elements.push(
          <em key={`italic-${keyIndex++}`} className="italic text-slate-800 font-medium">
            {renderFormattedInlineText(inner)}
          </em>
        );
      } else if (match[4]) {
        // Strikethrough ~~text~~
        const inner = matchText.slice(2, -2);
        elements.push(
          <del key={`strike-${keyIndex++}`} className="line-through text-slate-500">
            {inner}
          </del>
        );
      } else if (match[5]) {
        // Code `code`
        const inner = matchText.slice(1, -1);
        elements.push(
          <code key={`code-${keyIndex++}`} className="bg-slate-100 text-emerald-800 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200">
            {inner}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements;
  };

  const renderedBlocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushListBuffer = (index: number) => {
    if (listBuffer.length > 0) {
      renderedBlocks.push(
        <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 my-2 text-slate-800 pl-1">
          {listBuffer.map((item, itemIdx) => (
            <li key={itemIdx} className="leading-relaxed">
              {renderFormattedInlineText(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // List item check (- item or * item)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    } else {
      flushListBuffer(index);
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      renderedBlocks.push(
        <h3 key={`h3-${index}`} className="font-display font-bold text-base text-slate-900 mt-4 mb-1 tracking-wide">
          {renderFormattedInlineText(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      renderedBlocks.push(
        <h2 key={`h2-${index}`} className="font-display font-extrabold text-lg md:text-xl text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-1.5 tracking-wide flex items-center gap-2">
          {renderFormattedInlineText(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      renderedBlocks.push(
        <h1 key={`h1-${index}`} className="font-display font-black text-xl md:text-2xl text-slate-900 mt-6 mb-2 tracking-wide border-b-2 border-[#00ba68] pb-1">
          {renderFormattedInlineText(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      renderedBlocks.push(
        <blockquote key={`quote-${index}`} className="border-l-4 border-[#00ba68] pl-3 py-1.5 my-2.5 bg-emerald-50/70 rounded-r-lg text-slate-800 italic text-sm">
          {renderFormattedInlineText(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (trimmed === '') {
      renderedBlocks.push(<div key={`empty-${index}`} className="h-2" />);
      return;
    }

    // Normal paragraph line
    renderedBlocks.push(
      <p key={`p-${index}`} className="leading-relaxed my-1">
        {renderFormattedInlineText(line)}
      </p>
    );
  });

  flushListBuffer(lines.length);

  return (
    <div className={`space-y-1 text-slate-800 text-sm font-sans ${className}`}>
      {renderedBlocks}
    </div>
  );
};
