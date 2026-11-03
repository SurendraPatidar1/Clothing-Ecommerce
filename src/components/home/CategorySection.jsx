import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import SafeImage from '@/components/ui/SafeImage';
import { CATEGORIES } from '@/config/site';
import { fadeUp, stagger } from '@/animations/variants';

export default function CategorySection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Collections" title="Shop By Category" subtitle="Essentials crafted for every occasion." />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
        >
          {CATEGORIES.map((c) => (
            <motion.div key={c.slug} variants={fadeUp}>
              <Link to={`/shop?category=${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-gray-100">
                <SafeImage
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent transition-opacity duration-500 group-hover:from-primary" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-xl font-semibold sm:text-2xl">{c.name}</h3>
                  <span className="mt-2 inline-block translate-y-2 text-xs font-semibold uppercase tracking-widest text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
