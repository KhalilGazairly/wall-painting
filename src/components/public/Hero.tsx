import { MessageCircle, ChevronDown } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

export function Hero() {
  const { whatsappLink } = useSettings();

  const scrollToGallery = () => {
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8092437/pexels-photo-8092437.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="ديكور داخلي فاخر"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-charcoal-950/80 via-charcoal-950/60 to-charcoal-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-charcoal-950/30" />
      </div>

      {/* Decorative gold lines */}
      <div className="absolute top-1/4 right-0 h-px w-1/3 bg-gradient-to-l from-gold-500/60 to-transparent" />
      <div className="absolute bottom-1/4 left-0 h-px w-1/3 bg-gradient-to-r from-gold-500/60 to-transparent" />

      {/* Content */}
      <div className="container-custom relative z-10 px-4 text-center lg:px-8">
        <div className="animate-fade-in-down">
          <span className="inline-block rounded-full border border-gold-500/40 bg-gold-500/10 px-5 py-2 text-sm font-medium text-gold-300 backdrop-blur-sm">
           الفرسان للدهانات 
          </span>
        </div>

        <h1 className="animate-fade-in-up mt-6 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          تحويل جدرانك إلى
          <br></br>
          <span className="block bg-gradient-to-l from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
            تحف فنية وألوان تدوم
          </span>
          <br></br>
        </h1>

        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl" style={{ animationDelay: '0.15s' }}>
          نقدم خدمات احترافية في دهانات وديكورات الحوائط الداخلية والخارجية،
          وتصميم لوحات وجداريات فنية مخصصة تضيف لمسة جمالية فريدة لمساحاتك.
        </p>

        <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.3s' }}>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('whatsapp_hero')}
            className="btn-primary text-base"
          >
            <MessageCircle className="h-5 w-5" />
            احجز خدمتك الآن
          </a>
          <button onClick={scrollToGallery} className="btn-outline text-base border-white/30 text-white hover:bg-white/10 hover:border-white">
            شاهد معرض الأعمال
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 transition-colors hover:text-gold-300"
        aria-label="انتقل للأسفل"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
}
