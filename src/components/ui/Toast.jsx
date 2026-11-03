import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ message }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-primary px-6 py-3 text-sm text-white shadow-2xl"
            role="status"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
