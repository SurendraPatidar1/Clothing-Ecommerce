import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/variants';

export default function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={delay}
    >
      {children}
    </Component>
  );
}
