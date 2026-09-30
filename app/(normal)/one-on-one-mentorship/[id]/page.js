import MentorBook from "@/component/MentorBook";
import MentorProfileDetails from "@/component/MentorData";
import MentorshipHero from "@/component/MentorshipHero";
import MobileBookingBar from "@/component/MobileBookingBar";
import { getTrainerById } from "@/lib/data/trainers";

export default async function Page({params}) {
   const { id } = await params;

  const trainer = await getTrainerById(id);

  if (!trainer) {
    notFound();
  }

  return (
    <>
      <MentorshipHero trainer={trainer} />

      <div
        className="
          w-full
          max-w-[1400px]
          mx-auto
          flex
          flex-col
          lg:flex-row
          gap-8
          lg:gap-12
          px-4
          sm:px-6
          lg:px-0
        "
      >
        {/* Left Content */}
        <div className="w-full lg:w-4/6 min-w-0">
          <MentorProfileDetails trainer={trainer}  />
        </div>

        {/* Right Booking Card */}
        <div
          className="
            w-full
            lg:w-1/4
            min-w-0
            lg:self-start
            lg:sticky
            lg:top-28
            h-fit
          "
        >
          <MentorBook trainer={trainer}  />
        </div>
      </div>

      <MobileBookingBar  />
    </>
  );
}