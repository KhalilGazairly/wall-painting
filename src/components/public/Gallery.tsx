import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { GalleryItem } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import { GalleryLightbox } from './GalleryLightbox';
import { ImageIcon, VideoIcon, X, Loader2 } from 'lucide-react';

type FilterCategory = 'all' | 'wall_paint' | 'artwork' | 'video';

const FILTER_TABS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'wall_paint', label: 'دهانات حوائط' },
  { key: 'artwork', label: 'أعمال فنية' },
  { key: 'video', label: 'فيديوهات' },
];

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data as GalleryItem[]);
    }
    setLoading(false);
  };

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    if (activeFilter === 'video') return items.filter((i) => i.media_type === 'video');
    return items.filter((i) => i.category === activeFilter);
  }, [items, activeFilter]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: 'next' | 'prev') => {
      setLightboxIndex((prev) => {
        if (prev === null) return prev;
        const max = filteredItems.length - 1;
        if (direction === 'next') return prev >= max ? 0 : prev + 1;
        return prev <= 0 ? max : prev - 1;
      });
    },
    [filteredItems.length],
  );

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700">
            معرض الأعمال
          </span>
          <h2 className="mt-4 text-3xl font-bold text-charcoal-900 sm:text-4xl">
            أعمالنا السابقة
          </h2>
          <p className="mt-4 text-lg text-charcoal-500">
            استعرض مجموعة من أحدث أعمالنا في الدهانات والأعمال الفنية
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeFilter === tab.key
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                  : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl shimmer-bg" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-charcoal-50 py-20 text-center">
            <ImageIcon className="h-12 w-12 text-charcoal-300" />
            <p className="mt-4 text-lg font-medium text-charcoal-400">
              لا توجد أعمال في هذا القسم حالياً
            </p>
            <p className="mt-1 text-sm text-charcoal-300">
              تابعنا قريباً لأعمال جديدة
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal-100 shadow-md transition-all duration-500 hover:shadow-2xl hover:ring-2 hover:ring-gold-400"
              >
                {item.media_type === 'video' ? (
                  <>
                    <video
                      src={item.media_url}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <VideoIcon className="h-6 w-6 text-charcoal-800" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Info */}
                <div className="absolute bottom-0 right-0 left-0 p-5 text-right opacity-0 transition-all duration-500 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                  <span className="inline-block rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-white">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-white/70 line-clamp-2">{item.description}</p>
                  )}
                </div>

                {/* Type badge */}
                <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-charcoal-700 backdrop-blur-sm">
                  {item.media_type === 'video' ? 'فيديو' : 'صورة'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <GalleryLightbox
          item={filteredItems[lightboxIndex]}
          onClose={closeLightbox}
          onNext={() => navigateLightbox('next')}
          onPrev={() => navigateLightbox('prev')}
          hasNext={filteredItems.length > 1}
        />
      )}
    </section>
  );
}
