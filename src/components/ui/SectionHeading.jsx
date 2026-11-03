import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, subtitle, light = false, align = 'center' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <Reveal className={`mb-12 max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-accent">{eyebrow}</p>
      )}
      <h2 className={`text-3xl font-semibold sm:text-4xl ${light ? 'text-white' : 'text-primary'}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-sm sm:text-base ${light ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>}
    </Reveal>
  );
}
