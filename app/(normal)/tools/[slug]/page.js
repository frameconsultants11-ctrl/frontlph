// e.g. app/courses/[slug]/page.js   and   app/courses/[slug]/[subSlug]/page.js
import ListingPage, { listingMetadata } from "@/component/ListingPage";

export const generateMetadata = ({ params }) => listingMetadata("tools", params);
export default function Page({ params }) {
  return <ListingPage type="tools" params={params} />;
}