import { Link } from 'react-router-dom';
import { Palette, MessageCircle, ArrowUp } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SocialLinks } from '@/components/public/SocialLinks';
import { trackCTAClick } from '@/lib/analytics';

const FOOTER_LINKS = [
  { href: '#home', label: 'الرئيسية', route: false },
  { href: '#services', label: 'الخدمات', route: false },
  { href: '/gallery', label: 'معرض الأعمال', route: true },
  { href: '#about', label: 'عن الفني', route: false },
  { href: '#contact', label: 'تواصل معنا', route: false },
];

export function Footer() {
  const { siteName, whatsappLink } = useSettings();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal-950 border-t border-white/10">
      <div className="container-custom px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">{siteName}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              خدمات احترافية في دهانات وديكورات الحوائط والأعمال الفنية المخصصة.
              تحويل جدرانك إلى تحف فنية وألوان تدوم.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:text-center">
            <h4 className="font-bold text-white">روابط سريعة</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  {link.route ? (
                    <Link
                      to={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-white/50 transition-colors hover:text-gold-300"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp */}
          <div className="md:text-left">
            <h4 className="font-bold text-white">تواصل معنا</h4>
            <p className="mt-4 text-sm text-white/50">
              احجز خدمتك أو استفسر عن أي تفاصيل عبر واتساب مباشرة
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('whatsapp_footer')}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-600"
            >
              <MessageCircle className="h-4 w-4" />
              مراسلة عبر واتساب
            </a>

            {/* Social media links */}
            <div className="mt-5">
              <SocialLinks variant="dark" size="sm" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة.
          </p>
          <a
            href="/admin"
            className="text-xs text-white/30 transition-colors hover:text-gold-300"
          >
            لوحة التحكم
          </a>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal-800 text-white shadow-lg transition-all duration-300 hover:bg-charcoal-700 hover:-translate-y-1"
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
