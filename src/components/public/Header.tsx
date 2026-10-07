import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Palette, MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

const NAV_LINKS = [
  { href: '#home', label: 'الرئيسية', route: false },
  { href: '#services', label: 'الخدمات', route: false },
  { href: '/gallery', label: 'معرض الأعمال', route: true },
  { href: '#about', label: 'عنا', route: false },
  { href: '#contact', label: 'تواصل معنا', route: false },
];

export function Header() {
  const { siteName, whatsappLink } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal-950/95 backdrop-blur-lg shadow-2xl shadow-black/20'
          : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 shadow-lg shadow-gold-500/30">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white leading-tight">{siteName}</h2>
            <p className="text-xs text-gold-300">دهانات وأعمال فنية</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) =>
            link.route ? (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-gold-300"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-gold-300"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:bg-green-600 hover:shadow-xl hover:-translate-y-0.5 sm:inline-flex"
            onClick={() => trackCTAClick('whatsapp_header')}
          >
            <MessageCircle className="h-4 w-4" />
            احجز خدمتك عبر واتساب
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 lg:hidden"
            aria-label="القائمة"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-charcoal-950/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          isOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) =>
            link.route ? (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-right text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-gold-300"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-lg px-4 py-3 text-right text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-gold-300"
              >
                {link.label}
              </button>
            ),
          )}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('whatsapp_header_mobile')}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            احجز خدمتك عبر واتساب
          </a>
        </nav>
      </div>
    </header>
  );
}
