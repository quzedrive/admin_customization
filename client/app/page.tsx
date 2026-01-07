import Hero from "@/components/Hero";
import Collection from "@/components/Collection";
import Category from "@/components/Category";
import ChennaiPromoSection from "@/components/ChennaiPromoSection";
import HostPromoSection from "@/components/HostPromoSection";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <main className="font-inter">
      <Hero />
      <Collection />
      <Category />
      <ChennaiPromoSection />
      <HostPromoSection />
      <Faq />
    </main>
  );
}
