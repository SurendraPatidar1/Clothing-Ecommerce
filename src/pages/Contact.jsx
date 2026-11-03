import PageHeader from '@/components/layout/PageHeader';
import StoreLocation from '@/components/home/StoreLocation';
import ContactSection from '@/components/home/ContactSection';
import { SITE } from '@/config/site';

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact Us" subtitle={`We'd love to help you. ${SITE.shipping}.`} />
      <ContactSection />
      <StoreLocation />
    </>
  );
}
