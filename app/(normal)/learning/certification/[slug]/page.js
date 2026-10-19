
import { auth } from "@/lib/auth";
import CourseDetailPage,  { generateCourseMetadata } from "../../course/[slug]/CourseDetailPage";


export async function generateMetadata(props) {
  const { slug } = await props.params;
  console.log(slug)
  return generateCourseMetadata(props, 'certifications');
}

export default async function Page(props) {
  const { slug } = await props.params;
  const session = await auth()
  
  return  <CourseDetailPage session={session} type='certifications' {...props} />;
}