import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogImage?: string;
}

const SEO = ({ title = "Abhishek Ezhava - Portfolio", description = "Senior Software Engineer with 6 years of experience building scalable web applications, SDKs, and developer tools using React, TypeScript, and Node.js.", keywords = "Abhishek Ezhava, Senior Software Engineer, React, TypeScript, Node.js, Full Stack Developer, Software Engineer, Portfolio, IDE Theme", author = "Abhishek Ezhava", ogImage = "https://placehold.co/1200x630/718096/E2E8F0?text=Abhishek+Ezhava" }: SEOProps) => {
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
