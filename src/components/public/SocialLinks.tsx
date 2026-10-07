import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

// Custom TikTok and Snapchat icons since lucide doesn't have them
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  );
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.149-1.139.391-1.333.84-.09.225-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.044.179-.089.36-.164.54-.075.27-.27.404-.614.404h-.03c-.149 0-.359-.044-.614-.104-.404-.09-.838-.164-1.393-.164-.33 0-.674.029-1.018.074-.674.104-1.243.494-1.917.945-.958.688-2.012 1.453-3.625 1.453-.06 0-.119-.015-.18-.015h-.149c-1.613 0-2.668-.765-3.625-1.453-.675-.45-1.243-.84-1.918-.945a7.093 7.093 0 0 0-1.018-.074c-.584 0-1.048.105-1.393.18-.24.055-.434.09-.584.09-.42 0-.57-.24-.614-.42-.06-.179-.104-.359-.164-.538-.06-.21-.12-.494-.164-.57-1.918-.284-2.95-.704-3.205-1.287a.718.718 0 0 1-.045-.225c-.015-.24.165-.465.42-.509 3.265-.54 4.731-3.879 4.791-4.014l.015-.03c.18-.345.225-.644.12-.869-.195-.434-.884-.675-1.333-.809-.121-.029-.24-.075-.346-.119-1.107-.435-1.257-.93-1.198-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.389.075.42.194.789.299 1.104.299.234 0 .378-.06.449-.104l-.041-.479c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
    </svg>
  );
}

type IconComponent = React.FC<{ className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  instagram_url: Instagram as IconComponent,
  facebook_url: Facebook as IconComponent,
  tiktok_url: TikTokIcon,
  snapchat_url: SnapchatIcon,
  x_url: Twitter as IconComponent,
  youtube_url: Youtube as IconComponent,
};

const HOVER_COLORS: Record<string, string> = {
  instagram_url: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500',
  facebook_url: 'hover:bg-blue-600',
  tiktok_url: 'hover:bg-black',
  snapchat_url: 'hover:bg-yellow-400',
  x_url: 'hover:bg-black',
  youtube_url: 'hover:bg-red-600',
};

interface SocialLinksProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
}

export function SocialLinks({ variant = 'dark', size = 'md' }: SocialLinksProps) {
  const { settings } = useSettings();

  const links: { key: string; url: string; label: string }[] = [];
  (Object.keys(ICON_MAP) as string[]).forEach((key) => {
    if (!settings) return;
    const url = settings[key as keyof typeof settings] as string | null;
    if (url && url.trim()) {
      links.push({ key, url: url.trim(), label: key.replace('_url', '') });
    }
  });

  if (links.length === 0) return null;

  const sizeClasses = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const baseBg =
    variant === 'dark'
      ? 'bg-white/10 text-white/70'
      : 'bg-charcoal-100 text-charcoal-500';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const Icon = ICON_MAP[link.key];
        return (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick(`social_${link.key}`)}
            className={`flex ${sizeClasses} items-center justify-center rounded-xl ${baseBg} transition-all duration-300 hover:scale-110 hover:text-white ${HOVER_COLORS[link.key]}`}
            aria-label={link.label}
          >
            <Icon className={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
