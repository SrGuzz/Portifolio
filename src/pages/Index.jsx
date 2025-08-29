import Home from "../components/Home";
import About from "../components/About";
import Footer from "../components/Footer";
import { Contact } from "../components/Contact";
import Api from "../components/Api";
import Resume from "../components/ProfessionalResume";
import Nav from "../components/NavTeste";

function Index() {
  return (
    <div className="font-ubuntu">
      <Nav />
      <Home />
      <About />
      <Resume />
      <Contact />
      <Api />
      <Footer />
    </div>
  );
}

export default Index;
