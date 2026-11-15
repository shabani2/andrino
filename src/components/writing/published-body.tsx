import type { ReactNode } from "react";

function inlineLinks(value: string): ReactNode[] {
  return value.split(/(https?:\/\/[^\s)]+)/g).map((part, index) =>
    /^https?:\/\//.test(part)
      ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
      : part);
}

export function PublishedBody({ body }: { body: string }) {
  return <div className="prose post-body">
    {body.split(/\n\s*\n/).filter(Boolean).map((block, index) => {
      if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
      const source = block.match(/^([^\n]+?):\s*(https?:\/\/\S+)$/);
      if (source) return <p key={index}><a href={source[2]} target="_blank" rel="noopener noreferrer">{source[1]}</a></p>;
      if (/^https?:\/\/\S+$/.test(block)) {
        return <p key={index}><a href={block} target="_blank" rel="noopener noreferrer">{new URL(block).hostname}</a></p>;
      }
      return <p key={index}>{inlineLinks(block)}</p>;
    })}
  </div>;
}
