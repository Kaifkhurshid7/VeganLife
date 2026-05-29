import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import WhyVegan from '../components/Sections/WhyVegan';
import Impact from '../components/Sections/Impact';
import Nutrition from '../components/Sections/Nutrition';
import Meals from '../components/Sections/Meals';
import Myths from '../components/Sections/Myths';
import Challenge from '../components/Sections/Challenge';
import Blog from '../components/Sections/Blog';
import Testimonials from '../components/Sections/Testimonials';
import Footer from '../components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyVegan />
      <Impact />
      <Nutrition />
      <Meals />
      <Myths />
      <Challenge />
      <Blog />
      <Testimonials />
      <Footer />
    </>
  );
}
