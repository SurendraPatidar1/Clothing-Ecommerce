import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-black',
  accent: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  light: 'bg-white text-primary hover:bg-accent hover:text-white',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1ebe57]',
};

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const motionProps = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } };

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...motionProps} {...props}>
        {children}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...motionProps} {...props}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button className={classes} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
}
