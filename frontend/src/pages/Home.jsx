import { Navbar, Footer } from '../components/layout';
import {
  Hero,
  WhyVegan,
  Impact,
  Nutrition,
  Meals,
  Myths,
  Challenge,
  Blog,
  Testimonials,
} from '../components/sections';

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
