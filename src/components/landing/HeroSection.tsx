import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tinytalks-blue to-blue-600 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-blue-900/10"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
                Learn English with
                <span className="text-tinytalks-orange block">Joy & Confidence</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                Where children discover language through play, stories, and meaningful conversations
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
              <div className="text-center md:text-left">
                <div className="text-lg font-semibold text-white">Interactive Online Classes</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-semibold text-white">Child-Centered Approach</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-lg font-semibold text-white">Certified English Teachers</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-tinytalks-orange hover:bg-tinytalks-orange/90 text-white">
                <Link href="#courses" className="flex items-center">
                  Start Your Child's Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-tinytalks-blue">
                Explore Our Courses
              </Button>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src="/founder3.jpg"
                alt="Child learning English with TinyTalks"
                width={600}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-tinytalks-blue font-medium">Child learning English</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
