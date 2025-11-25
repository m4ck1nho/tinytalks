import type { Metadata } from 'next';

export const SITE_URL = 'https://www.tinytalks.pro';
export const SITE_NAME = 'TinyTalks';
export const DEFAULT_DESCRIPTION =
  'TinyTalks — онлайн-уроки английского для детей и взрослых. Асинхронное обучение + индивидуальные занятия без стресса.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const DEFAULT_TWITTER_IMAGE = `${SITE_URL}/images/twitter-card.jpg`;

const DEFAULT_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export const NOINDEX_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

type CreateMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  robots?: Metadata['robots'];
  keywords?: string[];
  type?: 'website' | 'article';
};

export const createPageMetadata = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  robots = DEFAULT_ROBOTS,
  keywords,
  type = 'website',
}: CreateMetadataOptions): Metadata => {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const imageAlt = `${SITE_NAME} – ${title}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || DEFAULT_TWITTER_IMAGE],
    },
    robots,
  };
};

