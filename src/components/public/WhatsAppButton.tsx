import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

export function WhatsAppButton() {
  const { whatsappLink } = useSettings();

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCTAClick('whatsapp_floating')}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-110 hover:bg-green-600"
      aria-label="تواصل عبر واتساب"
    >
      {/* Pulse ring */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-40" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
