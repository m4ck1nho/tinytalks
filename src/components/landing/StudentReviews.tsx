import Image from 'next/image'
import { Star } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: "Екатерина Ш.",
    rating: 5,
    comment: "My daughter has been studying with Evgenia for several months now, and I can see significant progress in her English skills. The lessons are engaging and fun, and my daughter always looks forward to them!",
    location: "Parent",
    image: "/parent1.jpg"
  },
  {
    id: 2,
    name: "Мария Л.",
    rating: 5,
    comment: "Evgenia's teaching methods are innovative and effective. My son has improved his pronunciation and vocabulary significantly. The interactive approach makes learning enjoyable!",
    location: "Parent",
    image: "/parent2.jpg"
  },
  {
    id: 3,
    name: "Julia K.",
    rating: 5,
    comment: "The personalized approach to learning has made a huge difference for my child. Evgenia understands each student's needs and adapts her teaching style accordingly.",
    location: "Parent",
    image: "/parent3.jpg"
  },
  {
    id: 4,
    name: "Екатерина С.",
    rating: 5,
    comment: "I wanted to thank you again for the trial lesson. My daughter really enjoyed the lesson and she asked herself: when will there be another lesson?",
    location: "Parent",
    image: "/parent4.jpg"
  },
  {
    id: 5,
    name: "Мария К.",
    rating: 5,
    comment: "I want to thank Evgenia again for the lesson with my son, time flew by unnoticed, but it was very interesting and exciting. We will definitely continue and recommend to others.",
    location: "Parent",
    image: "/parent5.jpg"
  },
  {
    id: 6,
    name: "Иван Ш.",
    rating: 5,
    comment: "Thank you for the trial lesson, very professional approach to the child, I really liked it) we will continue studying further)",
    location: "Parent",
    image: "/parent6.jpg"
  }
]

export function StudentReviews() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-tinytalks-blue">What Our Parents Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from parents who have seen their children thrive with TinyTalks.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-tinytalks-orange text-tinytalks-orange" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 mb-4">
                "{review.comment}"
              </blockquote>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-tinytalks-orange">
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-tinytalks-orange text-tinytalks-orange" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">4.9/5</span>
            <span className="text-gray-500">from 200+ students</span>
          </div>
        </div>
      </div>
    </section>
  )
}
