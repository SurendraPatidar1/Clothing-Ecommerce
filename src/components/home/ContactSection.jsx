import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { SITE } from '@/config/site';
import { whatsappLink } from '@/utils/helpers';

export default function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-accent py-20 text-white">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-black/10" />
      <div className="container-x relative text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest2">Get In Touch</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Call or WhatsApp Us</h2>
          <p className="mt-4 text-2xl font-light tracking-wider sm:text-3xl">{SITE.phone}</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href={`tel:${SITE.phone}`} variant="primary" size="lg">
            <Icon name="phone" /> Call Now
          </Button>
          <Button href={whatsappLink('Hello, I would like to know more about your collection.')} variant="whatsapp" size="lg">
            <Icon name="whatsapp" /> WhatsApp
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
