import ListingPage, { listingMetadata } from "@/component/ListingPage";

export async function generateMetadata({ params }) {
  return listingMetadata("tools", params);
}

export default function Page({ params }) {
  return <ListingPage type="tools" params={params} />;
}