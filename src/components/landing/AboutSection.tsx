import Image from 'next/image'
import { BookOpen, Users, Home } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-tinytalks-blue">About Us</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Teacher Profile */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-tinytalks-orange mb-4">
                <Image
                  src="/founder1.jpg"
                  alt="Evgenia Penkova - Founder of TinyTalks"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-tinytalks-blue">Evgenia Penkova</h3>
              <p className="text-lg text-gray-600">Founder of TinyTalks</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4 p-6 bg-orange-50 rounded-xl">
              <div className="w-12 h-12 bg-tinytalks-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-tinytalks-orange" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-tinytalks-blue mb-2">Engaging Lessons</h4>
                <p className="text-gray-600">Each lesson is a small adventure</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-tinytalks-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-tinytalks-blue" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-tinytalks-blue mb-2">Speaking Practice</h4>
                <p className="text-gray-600">80% of class time we speak English</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-tinytalks-blue mb-2">Online Format</h4>
                <p className="text-gray-600">Classes take place at home, in a comfortable environment for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
