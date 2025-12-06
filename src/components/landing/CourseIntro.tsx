import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Users, User, MapPin } from 'lucide-react'

export function CourseIntro() {
  const courses = [
    {
      id: 'group',
      title: 'Group Classes',
      description: 'Practice speaking English in online meetings with students of your level',
      features: [
        'Small groups',
        'Regular meetings', 
        'Interactive activities',
        'Speaking practice'
      ],
      price: '1,250 ₽',
      duration: 'per lesson',
      icon: Users,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'private',
      title: 'Private Class',
      description: 'One-on-one lessons with personalized attention and flexible scheduling',
      features: [
        'Personalized curriculum',
        'Flexible schedule',
        'Individual attention', 
        'Progress tracking'
      ],
      price: '2,500 ₽',
      duration: 'per lesson',
      icon: User,
      color: 'bg-orange-50 border-orange-200',
      image: '/privatelesson.jpg'
    },
    {
      id: 'adventure',
      title: 'English through Adventure',
      description: 'Intensive summer program with fun activities and rapid progress',
      features: [
        'Fun activities',
        'Rapid progress',
        'Interactive learning',
        'Summer materials'
      ],
      price: '1,250 ₽',
      duration: 'per episode (Total: 10,000 ₽)',
      icon: MapPin,
      color: 'bg-green-50 border-green-200'
    }
  ]

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-tinytalks-blue">Our Courses</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course) => (
            <div key={course.id} className={`rounded-2xl border-2 ${course.color} p-8 transition-transform hover:scale-105`}>
              {course.image && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="text-center mb-6">
                {!course.image && (
                  <div className="w-16 h-16 mx-auto bg-tinytalks-orange/20 rounded-full flex items-center justify-center mb-4">
                    <course.icon className="w-8 h-8 text-tinytalks-orange" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-tinytalks-blue mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-tinytalks-orange"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-tinytalks-blue">{course.price}</div>
                <div className="text-sm text-gray-600">{course.duration}</div>
              </div>

              <Button className="w-full bg-tinytalks-orange hover:bg-tinytalks-orange/90 text-white">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
