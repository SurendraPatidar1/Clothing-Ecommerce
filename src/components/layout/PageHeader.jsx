export default function PageHeader({ title, subtitle }) {
  return (
    <section className="bg-gray-50 py-14 text-center">
      <div className="container-x">
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">{subtitle}</p>}
        <div className="mx-auto mt-5 h-0.5 w-12 bg-accent" />
      </div>
    </section>
  );
}
