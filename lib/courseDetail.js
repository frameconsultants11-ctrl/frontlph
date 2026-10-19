import { getLearnDetail } from "@/lib/learnDetail";

export { cleanHtml, plainText } from "@/lib/learnDetail";

export const getCourseDetail = (slug, type = "courses") =>
  getLearnDetail(type, slug);