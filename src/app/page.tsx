import { HeroSection } from '@/components/landing/HeroSection'
import { AboutSection } from '@/components/landing/AboutSection'
import { CourseIntro } from '@/components/landing/CourseIntro'
import { StudentReviews } from '@/components/landing/StudentReviews'
import { LatestBlogPosts } from '@/components/landing/LatestBlogPosts'
import { ContactForm } from '@/components/landing/ContactForm'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <CourseIntro />
      <StudentReviews />
      <LatestBlogPosts />
      <ContactForm />
    </div>
  )
}
