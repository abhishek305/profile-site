interface MarkdownPageProps {
  content: string;
}

const MarkdownPage = ({ content }: MarkdownPageProps) => {
  return <div className="md-content max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default MarkdownPage;
