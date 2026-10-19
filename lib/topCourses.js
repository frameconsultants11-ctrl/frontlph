import { getListingData } from "@/lib/learnListing";
export { slugify, categorySlug } from "@/lib/learnListing";

export const getTopCoursesData = async (slug, searchParams = {}) => {
  const data = await getListingData("courses", slug, searchParams);
  return { ...data, courses: data.items };
};