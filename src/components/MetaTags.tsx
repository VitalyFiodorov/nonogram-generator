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
    // Find the initial favicon link
    const initialFavicon = document.querySelector("link[rel='icon']");
    if (initialFavicon) {
      // Update the href of the existing favicon link
      initialFavicon.setAttribute('href', favicon);
      // Update the type based on the file
      if (favicon.endsWith('.svg')) {
        initialFavicon.setAttribute('type', 'image/svg+xml');
      } else if (favicon.startsWith('data:')) {
        const mimeType = favicon.split(';')[0].split(':')[1];
        initialFavicon.setAttribute('type', mimeType);
      } else {
        initialFavicon.setAttribute('type', 'image/x-icon');
      }
    }
  }, [favicon]);

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