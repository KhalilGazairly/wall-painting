import { useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

interface GalleryLightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
}

export function GalleryLightbox({ item, onClose, onNext, onPrev, hasNext }: GalleryLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNext(); // RTL: left = next
      if (e.key === 'ArrowRight') onPrev(); // RTL: right = prev
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110"
        aria-label="إغلاق"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation */}
      {hasNext && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 sm:right-8"
            aria-label="السابق"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 sm:left-8"
            aria-label="التالي"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className="relative flex max-h-[90vh] max-w-5xl flex-col items-center px-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === 'video' ? (
          <video
            src={item.media_url}
            controls
            autoPlay
            className="max-h-[75vh] w-auto rounded-2xl shadow-2xl"
          />
        ) : (
          <img
            src={item.media_url}
            alt={item.title}
            className="max-h-[75vh] w-auto rounded-2xl shadow-2xl object-contain"
          />
        )}

        {/* Info */}
        <div className="mt-5 text-center">
          <span className="inline-block rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-white">
            {CATEGORY_LABELS[item.category]}
          </span>
          <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
          {item.description && (
            <p className="mt-2 text-sm text-white/60 max-w-2xl">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
