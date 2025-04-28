import { useEffect } from 'react';
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
  useEffect(() => {
    // Create a new link element
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = getFaviconType(favicon);
    
    // Add onload handler to remove old favicon only after new one is loaded
    link.onload = () => {
      // Remove all existing favicons
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      existingFavicons.forEach(favicon => favicon !== link && favicon.remove());
    };

    // Set href last to trigger load
    link.href = favicon + '?v=' + new Date().getTime();

    // Add the new favicon to head
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [favicon]);

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