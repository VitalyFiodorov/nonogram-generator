import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  favicon: string;
}

const MetaTags = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterTitle,
  twitterDescription,
  favicon,
}: MetaTagsProps) => {
  // Determine favicon type based on data URL or file extension
  const getFaviconType = (faviconUrl: string) => {
    if (faviconUrl.startsWith('data:')) {
      const mimeType = faviconUrl.split(';')[0].split(':')[1];
      return mimeType;
    }
    const extension = faviconUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'svg':
        return 'image/svg+xml';
      case 'ico':
        return 'image/x-icon';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      default:
        return 'image/x-icon';
    }
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Favicon - remove existing and add new */}
      <link rel="icon" type={getFaviconType(favicon)} href={favicon} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
    </Helmet>
  );
};

export default MetaTags; 