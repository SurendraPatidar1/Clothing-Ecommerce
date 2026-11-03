import { Link } from 'react-router-dom';
import { SITE, CATEGORIES } from '@/config/site';
import { whatsappLink } from '@/utils/helpers';

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-white">
            Choubey Ji<span className="text-accent">.</span>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-accent">Mens Wear</p>
          <p className="mt-4 text-sm leading-relaxed">{SITE.tagline}. Curated styles for the modern man.</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-accent">Login</Link></li>
            <li><Link to="/signup" className="hover:text-accent">Signup</Link></li>
            <li><Link to="/orders" className="hover:text-accent">Order History</Link></li>
            <li><Link to="/cart" className="hover:text-accent">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Visit Us</h4>
          <address className="space-y-1 text-sm not-italic">
            <p>{SITE.address.line1}</p>
            <p>{SITE.address.line2}</p>
            <p>{SITE.address.city}</p>
            <p className="pt-2 text-accent">{SITE.shipping}</p>
            <p className="pt-2">
              <a href={`tel:${SITE.phone}`} className="hover:text-accent">Call: {SITE.phone}</a>
            </p>
            <p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                WhatsApp: {SITE.phone}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
