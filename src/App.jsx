import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import Education from './pages/Education'
import Nutrition from './pages/Nutrition'
import Impact from './pages/Impact'
import Recipes from './pages/Recipes'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Education />
      <Nutrition />
      <Impact />
      <Recipes />
      <Footer />
    </>
  )
}