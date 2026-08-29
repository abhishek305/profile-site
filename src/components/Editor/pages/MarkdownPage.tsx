import type { ReactNode } from "react";

interface MarkdownPageProps {
  content: string;
  /** Rendered after the markdown body — used for the README's impact stats. */
  children?: ReactNode;
}

const MarkdownPage = ({ content, children }: MarkdownPageProps) => (
  <div className="md-content max-w-4xl mx-auto">
    <div dangerouslySetInnerHTML={{ __html: content }} />
    {children}
  </div>
);

export default MarkdownPage;
