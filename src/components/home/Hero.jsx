import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { SITE } from '@/config/site';
import { fadeUp } from '@/animations/variants';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&q=80';

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary">
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/30" />

      <div className="container-x relative z-10 pt-20 text-white">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-accent"
        >
          New Season &middot; {SITE.shipping}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="max-w-3xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          {SITE.name}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="mt-6 text-lg font-light tracking-wide text-gray-200 sm:text-2xl"
        >
          {SITE.tagline}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button to="/shop" variant="accent" size="lg">
            Shop Now
          </Button>
          <Button href={`tel:${SITE.phone}`} variant="light" size="lg">
            Call {SITE.phone}
          </Button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 z-10 h-10 w-6 rounded-full border-2 border-white/50"
        style={{ x: '-50%' }}
      >
        <span className="mx-auto mt-2 block h-2 w-1 rounded-full bg-white" />
      </motion.div>
    </section>
  );
}
