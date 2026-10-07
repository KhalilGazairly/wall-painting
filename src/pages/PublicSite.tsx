import { useEffect } from 'react';
import { Header } from '@/components/public/Header';
import { Hero } from '@/components/public/Hero';
import { Services } from '@/components/public/Services';
import { Gallery } from '@/components/public/Gallery';
import { About } from '@/components/public/About';
import { Contact } from '@/components/public/Contact';
import { Footer } from '@/components/public/Footer';
import { WhatsAppButton } from '@/components/public/WhatsAppButton';
import { CallButton } from '@/components/public/CallButton';
import { trackPageView } from '@/lib/analytics';

export function PublicSite() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <CallButton />
    </div>
  );
}
