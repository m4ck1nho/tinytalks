import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const pricingPlans = [
  {
    name: "Starter",
    price: 99,
    currency: "USD",
    duration: "month",
    description: "Perfect for beginners taking their first steps in English",
    lessons: 8,
    duration_per_lesson: 60,
    features: [
      "8 lessons per month",
      "60 minutes per lesson", 
      "Basic homework assignments",
      "Progress tracking",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Professional", 
    price: 149,
    currency: "USD",
    duration: "month",
    description: "Ideal for serious learners aiming for B1 level",
    lessons: 12,
    duration_per_lesson: 60,
    features: [
      "12 lessons per month",
      "60 minutes per lesson",
      "Advanced homework assignments", 
      "Detailed progress tracking",
      "Priority scheduling",
      "1-on-1 feedback sessions",
      "Priority support"
    ],
    popular: true
  },
  {
    name: "Intensive",
    price: 199,
    currency: "USD", 
    duration: "month",
    description: "For accelerated learning and exam preparation",
    lessons: 16,
    duration_per_lesson: 60,
    features: [
      "16 lessons per month",
      "60 minutes per lesson",
      "Intensive homework assignments",
      "Advanced progress tracking",
      "Flexible scheduling",
      "Weekly 1-on-1 sessions",
      "Exam preparation materials",
      "24/7 priority support"
    ],
    popular: false
  }
]

export function PricingTable() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-tinytalks-blue">Choose Your Learning Path</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing plans designed to fit your learning goals and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.name} 
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'ring-2 ring-tinytalks-orange bg-gradient-to-br from-tinytalks-orange/5 to-transparent' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-tinytalks-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-tinytalks-blue mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-tinytalks-orange mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-tinytalks-orange hover:bg-tinytalks-orange/90 text-white' 
                    : 'bg-tinytalks-blue hover:bg-tinytalks-blue/90 text-white'
                }`}
                asChild
              >
                <Link href="/auth/signup">
                  Get Started
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom plan or have questions?</p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-semibold text-tinytalks-blue mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">Book classes that fit your schedule with our easy-to-use system.</p>
            </div>
            <div>
              <h3 className="font-semibold text-tinytalks-blue mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">Monitor your advancement with detailed progress reports and milestones.</p>
            </div>
            <div>
              <h3 className="font-semibold text-tinytalks-blue mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">Safe and secure payment processing with support for various currencies.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
