import ListingPage, { listingMetadata } from "@/component/ListingPage";

export async function generateMetadata({ params }) {
  return listingMetadata("certifications", params);
}

export default function Page({ params }) {
  return <ListingPage type="certifications" params={params} />;
}