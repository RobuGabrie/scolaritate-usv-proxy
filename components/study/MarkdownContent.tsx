import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders owner-authored markdown server-side. Raw HTML in the source is
// escaped by react-markdown (no rehype-raw) — keep it that way.
export function MarkdownContent({ children }: { children: string }) {
  return (
    <div className="text-[14px] leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-xl font-bold tracking-tight mt-8 mb-3 first:mt-0" {...props} />,
          h2: (props) => <h2 className="text-lg font-semibold tracking-tight mt-7 mb-2.5 first:mt-0" {...props} />,
          h3: (props) => <h3 className="text-[15px] font-semibold mt-6 mb-2 first:mt-0" {...props} />,
          p: (props) => <p className="mb-3.5 text-foreground/90" {...props} />,
          a: (props) => (
            <a className="text-primary underline underline-offset-2 hover:opacity-80" target="_blank" rel="noreferrer" {...props} />
          ),
          ul: (props) => <ul className="list-disc pl-5 mb-3.5 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal pl-5 mb-3.5 space-y-1" {...props} />,
          li: (props) => <li className="text-foreground/90" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-2 border-border pl-3.5 my-3.5 text-muted-foreground italic" {...props} />
          ),
          code: (props) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-[12.5px] font-mono" {...props} />
          ),
          pre: (props) => (
            <pre className="rounded-lg bg-muted p-3.5 mb-3.5 overflow-x-auto text-[12.5px] [&>code]:bg-transparent [&>code]:p-0" {...props} />
          ),
          table: (props) => (
            <div className="overflow-x-auto mb-3.5">
              <table className="w-full text-[13px] border-collapse" {...props} />
            </div>
          ),
          th: (props) => (
            <th className="border border-border bg-muted/50 px-2.5 py-1.5 text-left font-semibold" {...props} />
          ),
          td: (props) => <td className="border border-border px-2.5 py-1.5" {...props} />,
          hr: (props) => <hr className="border-border my-6" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
