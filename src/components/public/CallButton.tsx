import { Phone } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

export function CallButton() {
  const { phoneNumbers, callLink } = useSettings();

  if (phoneNumbers.length === 0) return null;
  const primaryPhone = phoneNumbers[0];

  return (
    <a
      href={callLink(primaryPhone)}
      onClick={() => trackCTAClick('call_floating')}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-white shadow-2xl shadow-gold-500/40 transition-all duration-300 hover:scale-110 hover:bg-gold-600"
      aria-label="اتصل مباشرة"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-40" />
      <Phone className="relative h-6 w-6" />
    </a>
  );
}
