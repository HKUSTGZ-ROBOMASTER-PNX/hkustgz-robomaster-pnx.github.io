import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { JoinUs } from "@/components/JoinUs";
import { Media } from "@/components/Media";
import { Robots } from "@/components/Robots";
import { Technology } from "@/components/Technology";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-pnx-ink text-white">
      <Hero />
      <About />
      <Robots />
      <Gallery />
      <Technology />
      <Media />
      <JoinUs />
      <Footer />
    </main>
  );
}
