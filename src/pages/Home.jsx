import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import YouTubeSection from '@/components/home/YouTubeSection';
import StoreLocation from '@/components/home/StoreLocation';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <WhyChooseUs />
      <YouTubeSection />
      <StoreLocation />
      <ContactSection />
    </>
  );
}
