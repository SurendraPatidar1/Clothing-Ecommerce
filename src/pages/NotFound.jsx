import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl">Page not found</h1>
      <Button to="/" className="mt-8">Back Home</Button>
    </section>
  );
}
