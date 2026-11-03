import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { whatsappLink } from '@/utils/helpers';

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={whatsappLink('Hello, I would like to know more about your collection.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </motion.a>
  );
}
