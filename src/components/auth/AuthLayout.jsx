import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';

const SIDE_IMAGE = 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <section className="grid min-h-[80vh] md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary md:block">
        <SafeImage src={SIDE_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary p-12 text-white">
          <h2 className="text-4xl font-bold">Choubey Ji Mens Wear</h2>
          <p className="mt-2 text-accent">Premium Men&apos;s Fashion</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </section>
  );
}
