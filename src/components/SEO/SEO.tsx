import { Helmet } from "react-helmet-async";
import { profile } from "@/constants/profile";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogImage?: string;
}

const SEO = ({
  title = `${profile.name} — ${profile.title}, ${profile.focus}`,
  description = profile.summary,
  keywords = "Abhishek Ezhava, Senior Software Engineer, Model Context Protocol, MCP, MCP server, agent tooling, React, Next.js, TypeScript, Node.js, NestJS, Developer Experience, Contentstack, Portfolio",
  author = profile.name,
  ogImage = "https://placehold.co/1200x630/1a1a2e/61afef?text=Abhishek+Ezhava",
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={window.location.href} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};

export default SEO;
