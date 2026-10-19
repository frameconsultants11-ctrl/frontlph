// e.g. app/courses/[slug]/page.js   and   app/courses/[slug]/[subSlug]/page.js
import ListingPage, { listingMetadata } from "@/component/ListingPage";

export const generateMetadata = ({ params }) => listingMetadata("topics", params);
export default function Page({ params }) {
  return <ListingPage type="topics" params={params} />;
}