import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'

// Blog posts from the original TinyTalks site
const blogPosts = [
  {
    id: 1,
    title: "Learning English through Games",
    excerpt: "Discover how interactive games can make learning English fun and effective for children.",
    author: "Evgenia Penkova",
    publishedAt: "2024-01-15",
    slug: "learning-english-through-games",
    thumbnail: "/blogcard1.jpg"
  },
  {
    id: 2, 
    title: "Building Confidence in Speaking",
    excerpt: "Learn effective techniques to help your child gain confidence in speaking English.",
    author: "Evgenia Penkova",
    publishedAt: "2024-01-12",
    slug: "building-confidence-speaking",
    thumbnail: "/blogcard2.png"
  },
  {
    id: 3,
    title: "The Importance of Phonics",
    excerpt: "Understanding why phonics is crucial for early English language development.",
    author: "Evgenia Penkova", 
    publishedAt: "2024-01-10",
    slug: "importance-of-phonics",
    thumbnail: "/blogcard3.webp"
  }
]

export function LatestBlogPosts() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-tinytalks-blue mb-4">Latest Articles</h2>
            <p className="text-xl text-gray-600">
              Educational content and tips for English language learning.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog" className="flex items-center">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-tinytalks-blue transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-tinytalks-orange text-sm font-medium">
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-tinytalks-blue to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of students who are already improving their English skills with TinyTalks.
            </p>
            <Button size="lg" className="bg-tinytalks-orange hover:bg-tinytalks-orange/90 text-white" asChild>
              <Link href="/auth/signup">
                Start Learning Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
