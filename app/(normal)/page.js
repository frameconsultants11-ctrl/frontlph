import CareerOutcomes from "@/component/CareerOutcomes";
import CertificationShowcase from "@/component/CertificationShowcase";
import FaqChat from "@/component/FAQChat";
import GlobalReach from "@/component/GlobalReach";
import Hero from "@/component/Hero";
import LearnPerHourFeatures from "@/component/LearnPerHourFeatures";
import LearnShowcase from "@/component/LearnShowcase";
import RunningLine from "@/component/RunningLine";
import CourseExplorer from "@/component/ToolsExplorer";
import ToolsShowcase from "@/component/ToolsShowcase";
import Testimonials from "@/component/utils/Testimonials";
import WhyChooseUs from "@/component/WhyChoose";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Hero/>
    <CourseExplorer />
    <WhyChooseUs/>
 <LearnShowcase
  type="topics"
  eyebrow="Topic learning"
  title="Find the Topic to Learn New Skills"
  subtitle="Find the best topics for your career and boost your skills 10x."
/>
<LearnPerHourFeatures />
<CertificationShowcase/>
<ToolsShowcase/>
<CareerOutcomes/>
<Testimonials/>
<GlobalReach/>
<FaqChat/>
    </>
  );
}
