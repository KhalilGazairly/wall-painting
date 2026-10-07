import { MessageCircle, MapPin, Phone, Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SocialLinks } from '@/components/public/SocialLinks';
import { trackCTAClick } from '@/lib/analytics';

export function Contact() {
  const { whatsappLink, phoneNumbers, callLink } = useSettings();

  return (
    <section id="contact" className="section-padding bg-charcoal-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="container-custom relative">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-semibold text-gold-300">
            تواصل معنا
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            جاهز لتحويل جدرانك إلى تحفة فنية
          </h2>
          <p className="mt-4 text-lg text-white/60">
            تواصل معنا عبر الهاتف أو واتساب لحجز خدمتك أو الاستفسار عن أي تفاصيل
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* WhatsApp + Call CTA cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {/* WhatsApp CTA */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-green-600 to-green-500 p-8 text-center shadow-2xl shadow-green-500/20 lg:p-10">
              <h3 className="text-xl font-bold text-white sm:text-2xl">احجز عبر واتساب</h3>
              <p className="mt-3 text-white/80 text-sm">
                اضغط على الزر أدناه وسيتم تحويلك مباشرة إلى واتساب برسالة جاهزة
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTAClick('whatsapp_contact')}
                className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-base font-bold text-green-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <MessageCircle className="h-5 w-5" />
                مراسلة عبر واتساب
              </a>
            </div>

            {/* Direct call CTA */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-gold-600 to-gold-500 p-8 text-center shadow-2xl shadow-gold-500/20 lg:p-10">
              <h3 className="text-xl font-bold text-white sm:text-2xl">اتصل مباشرة</h3>
              <p className="mt-3 text-white/80 text-sm">
                اضغط على أي رقم للاتصال المباشر بفريقنا
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                {phoneNumbers.map((phone) => (
                  <a
                    key={phone}
                    href={callLink(phone)}
                    onClick={() => trackCTAClick(`call_${phone}`)}
                    className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 text-base font-bold text-gold-700 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    dir="ltr"
                  >
                    <Phone className="h-5 w-5" />
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact info cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Phone numbers card */}
            <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                <Phone className="h-6 w-6 text-gold-300" />
              </div>
              <h4 className="font-bold text-white">أرقام الهاتف</h4>
              {phoneNumbers.map((phone) => (
                <a
                  key={phone}
                  href={callLink(phone)}
                  onClick={() => trackCTAClick(`call_card_${phone}`)}
                  className="text-sm text-white/60 transition-colors hover:text-gold-300"
                  dir="ltr"
                >
                  {phone}
                </a>
              ))}
            </div>

            {/* Working hours card */}
            <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                <Clock className="h-6 w-6 text-gold-300" />
              </div>
              <h4 className="font-bold text-white">أوقات العمل</h4>
              <p className="text-sm text-white/60">السبت - الخميس: 8 صباحاً - 8 مساءً</p>
            </div>

            {/* Service area card */}
            <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                <MapPin className="h-6 w-6 text-gold-300" />
              </div>
              <h4 className="font-bold text-white">منطقة الخدمة</h4>
              <p className="text-sm text-white/60">نخدم جميع المناطق والمدن</p>
            </div>
          </div>

          {/* Social media links */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-white/60">تابعنا على وسائل التواصل الاجتماعي</p>
            <SocialLinks variant="dark" size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}
