import { type ComponentProps, memo, type ReactNode } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import { BundledLanguage } from "shiki";
//import { useSmoothText } from "@convex-dev/agent/react";

type ResponseProps = ComponentProps<typeof Streamdown>;

const RESPONSE_PROSE_CLASSES = `
  [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
  [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:tracking-tight
  [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:tracking-tight
  [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:tracking-tight
  [&_h4]:text-xs [&_h4]:font-medium [&_h4]:mt-3 [&_h4]:tracking-tight
  [&_p]:my-2 [&_p]:text-foreground/90
  [&_ul]:my-2 [&_ul]:space-y-1
  [&_ol]:my-2 [&_ol]:space-y-1
  [&_li]:text-xs
  [&_code]:text-xs [&_code]:font-mono [&_code]:text-foreground [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
  [&_pre]:text-xs [&_pre]:font-mono [&_pre]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md
  [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:text-muted-foreground
  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
  [&_table]:w-full [&_table]:my-2 [&_table]:border-collapse [&_table]:text-[12px]
  [&_th]:text-[12px] [&_th]:font-semibold [&_th]:text-left [&_th]:border [&_th]:p-2
  [&_td]:text-[12px] [&_td]:border [&_td]:p-2
  [&_strong]:font-semibold
  [&_em]:italic
  [&_button]:text-xs [&_button]:h-7 [&_button]:px-2 [&_button]:text-muted-foreground
  [&_pre_button]:absolute [&_pre_button]:top-2 [&_pre_button]:right-2
`;

type StreamdownCodeBlockProps = {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
};

const StreamdownCodeBlock = ({
  children,
  className,
  inline,
}: StreamdownCodeBlockProps) => {
  // For inline code, render as a simple code element
  if (inline) {
    return <code className={className}>{children}</code>;
  }

  // Extract code content from children
  const code =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.join("")
        : String(children ?? "");

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const languageMatch = className?.match(/language-(\w+)/);
  const language = (languageMatch?.[1] ?? "text") as BundledLanguage;

  return (
    <CodeBlock code={code} language={language} showLineNumbers={false}>
      <CodeBlockCopyButton />
    </CodeBlock>
  );
};

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn("size-full", RESPONSE_PROSE_CLASSES, className)}
      components={{
        code: StreamdownCodeBlock,
        ...props.components,
      }}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = "Response";

/**
 * Component that wraps Response with smooth text streaming
 */
export function SmoothResponse({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  /*
  const [visibleText] = useSmoothText(text, {
    startStreaming: isStreaming,
  });
  */

  return <Response isAnimating={isStreaming}>{text}</Response>;
}
