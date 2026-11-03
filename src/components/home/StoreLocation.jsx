import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Icon from '@/components/ui/Icon';
import { SITE } from '@/config/site';

export default function StoreLocation({ mapUrl = SITE.mapEmbedUrl }) {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Visit Us" title="Store Location" />
        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          <Reveal className="flex flex-col justify-center bg-primary p-10 text-white">
            <Icon name="location" className="mb-6 h-10 w-10 text-accent" />
            <h3 className="text-2xl font-semibold">{SITE.name}</h3>
            <address className="mt-4 space-y-1 text-lg not-italic text-gray-300">
              <p>{SITE.address.line1}</p>
              <p>{SITE.address.line2}</p>
              <p>{SITE.address.city}</p>
            </address>
            <p className="mt-6 text-sm uppercase tracking-widest text-accent">{SITE.shipping}</p>
          </Reveal>
          <Reveal delay={0.2} className="min-h-[320px] overflow-hidden shadow-xl lg:col-span-2">
            <iframe
              src={mapUrl}
              title="Store location map"
              className="h-full min-h-[320px] w-full border-0 grayscale transition duration-500 hover:grayscale-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
