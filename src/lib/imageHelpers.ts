import { CATEGORY_IMAGES } from './constants';

export const getCategoryImage = (slug: string | null | undefined, dbUrl: string | null | undefined) => {
    if (!slug) return CATEGORY_IMAGES['oturma-grubu'];
    if (dbUrl) return dbUrl;
    return CATEGORY_IMAGES[slug] || CATEGORY_IMAGES[slug.toLowerCase()] || CATEGORY_IMAGES['oturma-grubu'];
};
