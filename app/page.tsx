import HeroSection from "@/components/home/hero-section";
import Feed from "@/components/home/feed";
import GuaranteeSection from "@/components/home/guarantee";
import FeaturedProducts from "@/components/home/featured-products";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-6 m-10 pb-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <HeroSection />
      <GuaranteeSection />
      <Feed />
      <FeaturedProducts />
    </div>
  );
}
