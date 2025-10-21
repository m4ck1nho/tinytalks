'use client';

import { useEffect } from 'react';
import { initGA, logPageView } from '@/lib/analytics';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Pricing from '@/components/public/Pricing';
import Reviews from '@/components/public/Reviews';
import BlogPreview from '@/components/public/BlogPreview';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';

export default function Home() {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Pricing />
      <Reviews />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  );
}
