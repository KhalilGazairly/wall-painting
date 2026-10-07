import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { WhatsAppButton } from '@/components/public/WhatsAppButton';
import { CallButton } from '@/components/public/CallButton';
import { Gallery } from '@/components/public/Gallery';
import { trackPageView } from '@/lib/analytics';

export function GalleryPage() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        {/* Page hero */}
        <div className="bg-charcoal-950 relative overflow-hidden py-16 lg:py-20">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="container-custom relative px-4 text-center lg:px-8">
            <span className="inline-block rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-semibold text-gold-300">
              معرض الأعمال
            </span>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              جميع أعمالنا في مكان واحد
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
              استعرض مجموعة كاملة من أعمالنا في الدهانات والأعمال الفنية والجداريات
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
            >
              <ArrowRight className="h-4 w-4" />
              العودة إلى الرئيسية
            </Link>
          </div>
        </div>

        {/* Full gallery */}
        <Gallery />
      </main>
      <Footer />
      <WhatsAppButton />
      <CallButton />
    </div>
  );
}
