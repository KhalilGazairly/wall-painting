import { Brush, Palette, Check, MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { trackCTAClick } from '@/lib/analytics';

const SERVICES = [
  {
    icon: Brush,
    title: 'دهانات وديكورات حوائط',
    description: 'دهانات داخلية وخارجية بأعلى جودة وأحدث التقنيات، مع تشطيبات ديكورية احترافية تدوم طويلاً.',
    features: ['دهانات داخلية وخارجية', 'تشطيبات ديكورية متنوعة', 'ألوان عصرية ومتدرجة', 'ضمان الجودة والمتانة'],
  },
  {
    icon: Palette,
    title: 'لوحات وجداريات فنية',
    description: 'تصميم وتنفيذ جداريات ولوحات فنية مخصصة تناسب ذوقك وتميز مساحتك بلمسة فنية فريدة.',
    features: ['جداريات حائطية مخصصة', 'لوحات كانفس فنية', 'تصاميم حسب الطلب', 'ألوان زاهية تدوم'],
  },
];

export function Services() {
  const { whatsappLink } = useSettings();

  return (
    <section id="services" className="section-padding bg-charcoal-50">
      <div className="container-custom">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700">
            خدماتنا
          </span>
          <h2 className="mt-4 text-3xl font-bold text-charcoal-900 sm:text-4xl">
            خدمات احترافية بأعلى المعايير
          </h2>
          <p className="mt-4 text-lg text-charcoal-500">
            نقدم باقة متكاملة من خدمات الدهانات والأعمال الفنية لتحويل مساحاتك إلى تحف فنية
          </p>
        </div>

        {/* Service cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-charcoal-100 transition-all duration-500 hover:shadow-2xl hover:ring-gold-200 lg:p-10"
              >
                {/* Decorative gradient */}
                <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gold-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-charcoal-900">{service.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-charcoal-500">{service.description}</p>

                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-charcoal-700">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-50">
                          <Check className="h-4 w-4 text-green-600" />
                        </span>
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappLink(`مرحباً، أرغب في الاستفسار عن خدمة: ${service.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTAClick(`whatsapp_service_${service.title}`)}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-charcoal-800 hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    استفسر عن هذه الخدمة
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
