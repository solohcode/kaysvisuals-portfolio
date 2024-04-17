import {
  About,
  Contact,
  Experience,
  // Feedbacks,
  Hero,
  Resume,
  Navbar,
  Footer,
  Tech,
  Works,
  Education,
  StarsCanvas,
} from "../../components";

function HomePage() {
  return (
    <div className="bg-primary relative z-0">
      <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Resume />
      <Works />
      {/* <Feedbacks /> */}
      <Education />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
      <Footer />
    </div>
  )
}

export default HomePage