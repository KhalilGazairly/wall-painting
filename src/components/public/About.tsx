import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

export function About() {
  const { whatsappLink } = useSettings();

  const stats = [
    { number: '+15', label: 'سنوات خبرة' },
    { number: '+500', label: 'مشروع منجز' },
    { number: '+300', label: 'عميل سعيد' },
    { number: '100%', label: 'جودة مضمونة' },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://i.postimg.cc/50YxL246/Whats-App-Image-2026-09-16-at-2-29-43-AM.jpg"
                alt="الفنان أثناء العمل"
                className="h-[500px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-charcoal-100 lg:-right-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500 shadow-lg shadow-gold-500/30">
                <span className="text-2xl font-bold text-white">+15</span>
              </div>
              <div>
                <p className="font-bold text-charcoal-900">سنوات من الخبرة</p>
                <p className="text-sm text-charcoal-500">في فن الدهانات والديكور</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700">
              عنا
            </span>
            <h2 className="mt-4 text-3xl font-bold text-charcoal-900 sm:text-4xl">
              فنان محترف بشغف للألوان والإبداع
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal-500">
              بخبرة تزيد عن 15 عاماً في مجال دهانات الحوائط والأعمال الفنية، أقدم خدمات
              احترافية تجمع بين الجودة العالية والذوق الرفيع. أؤمن بأن كل جدار يحمل قصة،
              وأن الألوان القوية لها القدرة على تحويل أي مساحة إلى تحفة فنية تدوم.
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal-400">
              أستخدم أجود أنواع الدهانات والمواد الفنية، وألتزم بالمواعيد والمعايير
              الاحترافية لضمان رضا العملاء وتحقيق نتائج تفوق التوقعات.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-charcoal-50 p-4 text-center">
                  <p className="text-2xl font-bold text-gold-600">{stat.number}</p>
                  <p className="mt-1 text-xs font-medium text-charcoal-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('whatsapp_about')}
              className="btn-primary mt-8"
            >
              <MessageCircle className="h-5 w-5" />
              تواصل معي مباشرة
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
