export type SampleGalleryItem = {
  slug: string;
  title: { en: string; zh: string; es?: string };
  blurb: { en: string; zh: string; es?: string };
};

export { WC_GALLERY as SAMPLE_GALLERY } from './wyw-my-sweetie-gallery';
