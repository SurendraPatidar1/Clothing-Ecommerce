import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Icon from '@/components/ui/Icon';
import { fadeUp, stagger } from '@/animations/variants';

const FEATURES = [
  { icon: 'truck', title: 'All India Shipping', text: 'Fast and reliable delivery to every corner of India.' },
  { icon: 'badge', title: 'Premium Quality', text: 'Carefully sourced fabrics with impeccable finishing.' },
  { icon: 'tag', title: 'Affordable Pricing', text: 'Luxury look and feel without the luxury price tag.' },
  { icon: 'sparkles', title: 'Latest Collections', text: 'Fresh styles updated every season, on trend.' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-primary py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Our Promise" title="Why Choose Us" light />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group border border-white/10 p-8 text-center transition-colors duration-300 hover:border-accent"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name={f.icon} className="h-7 w-7" />
              </div>
              <h3 className="font-sans text-base font-semibold uppercase tracking-wider text-white">{f.title}</h3>
              <p className="mt-3 text-sm text-gray-400">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
