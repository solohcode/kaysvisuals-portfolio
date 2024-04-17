import {
  About,
  Contact,
  Education,
  Experience,
  // Feedbacks,
  Hero,
  Resume,
  Navbar,
  Footer,
  Tech,
  Works,
  StarsCanvas,
} from "../../components";

function AdminPage() {
  return (
    <div className="bg-primary relative z-0">
      <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <Navbar editable />
        <Hero editable />
      </div>
      <About editable />
      <Experience editable />
      <Tech editable />
      <Resume editable />
      <Works editable />
      {/* <Feedbacks editable /> */}
      <Education editable />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
      <Footer editable />
    </div>
  )
}

export default AdminPage