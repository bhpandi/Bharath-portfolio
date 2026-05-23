import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/portfolio-store";

export const revalidate = 0;

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main>
      <Navbar />
      <Hero data={data} />
      <div className="section-divider" />
      <About data={data} />
      <div className="section-divider" />
      <Experience data={data} />
      <div className="section-divider" />
      <Skills data={data} />
      <div className="section-divider" />
      <Awards data={data} />
      <div className="section-divider" />
      <Contact data={data} />
      <Footer />
    </main>
  );
}
