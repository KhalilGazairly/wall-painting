import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useSettings } from '@/contexts/SettingsContext';
import { Download, Printer, QrCode, Loader2, Palette } from 'lucide-react';

export function AdminQrCode() {
  const { siteName } = useSettings();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState('#423d36');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(400);
  const [customUrl, setCustomUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const autoUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://example.com/';
  const siteUrl = useCustomUrl && customUrl.trim() ? customUrl.trim() : autoUrl;

  useEffect(() => {
    generateQR();
  }, [color, bgColor, size, siteUrl]);

  const generateQR = async () => {
    setLoading(true);
    try {
      const dataUrl = await QRCode.toDataURL(siteUrl, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = dataUrl;
        }
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${siteName.replace(/\s+/g, '-')}-qr-code.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <title>بطاقة QR - ${siteName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Cairo', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f6f5f4;
          }
          .card {
            width: 350px;
            background: #fff;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            padding: 40px 30px;
            text-align: center;
          }
          .card-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .card-icon {
            width: 40px;
            height: 40px;
            background: #e09a2e;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card-icon span {
            font-size: 22px;
          }
          .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #423d36;
          }
          .card-subtitle {
            font-size: 12px;
            color: #c87d22;
            margin-top: 2px;
          }
          .qr-container {
            margin: 20px 0;
            padding: 16px;
            border: 2px solid #e9e7e4;
            border-radius: 16px;
            display: inline-block;
          }
          .qr-container img {
            width: 250px;
            height: 250px;
            display: block;
          }
          .card-footer {
            margin-top: 16px;
            font-size: 13px;
            color: #736a5e;
            line-height: 1.6;
          }
          .card-url {
            margin-top: 8px;
            font-size: 11px;
            color: #b3aca2;
            direction: ltr;
            word-break: break-all;
          }
          @media print {
            body { background: #fff; }
            .card { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="card-header">
            <div class="card-icon">
              <span>🎨</span>
            </div>
            <div style="text-align: right;">
              <div class="card-title">${siteName}</div>
              <div class="card-subtitle">دهانات وأعمال فنية</div>
            </div>
          </div>
          <div class="qr-container">
            <img src="${qrDataUrl}" alt="QR Code" />
          </div>
          <div class="card-footer">
            امسح الرمز للانتقال إلى موقعنا
          </div>
          <div class="card-url">${siteUrl}</div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const colorPresets = [
    { name: 'تقصير فحمي', dark: '#423d36', light: '#ffffff' },
    { name: 'ذهبي', dark: '#c87d22', light: '#ffffff' },
    { name: 'أسود كلاسيكي', dark: '#000000', light: '#ffffff' },
    { name: 'أبيض على أسود', dark: '#ffffff', light: '#1a1a1a' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900">رمز QR للموقع</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          أنشئ رمز QR يحتوي على رابط موقعك لطباعته على البطاقات والمنشورات
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Preview */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 lg:p-8">
          <div className="mb-4 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-charcoal-400" />
            <h3 className="font-bold text-charcoal-900">معاينة الرمز</h3>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-2xl border-2 border-charcoal-100 bg-white p-4">
              {loading ? (
                <div className="flex h-48 w-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-charcoal-300" />
                </div>
              ) : (
                <img src={qrDataUrl} alt="QR Code" className="h-48 w-48" />
              )}
            </div>

            {/* Business card preview */}
            <div className="w-full max-w-xs rounded-2xl border border-charcoal-100 bg-gradient-to-b from-charcoal-50 to-white p-5 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500">
                  <Palette className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-charcoal-900 text-sm">{siteName}</span>
              </div>
              <p className="mt-1 text-xs text-gold-600">دهانات وأعمال فنية</p>
              <p className="mt-3 text-xs text-charcoal-400">امسح الرمز للانتقال إلى موقعنا</p>
            </div>

            {/* Action buttons */}
            <div className="flex w-full gap-3">
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-600 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                تحميل الصورة
              </button>
              <button
                onClick={handlePrint}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-charcoal-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-charcoal-800 disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                طباعة بطاقة
              </button>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 lg:p-8">
          <h3 className="mb-6 font-bold text-charcoal-900">تخصيص الرمز</h3>

          {/* Color presets */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-charcoal-700">أنماط جاهزة</label>
            <div className="grid grid-cols-2 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setColor(preset.dark);
                    setBgColor(preset.light);
                  }}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                    color === preset.dark && bgColor === preset.light
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-charcoal-200 hover:border-charcoal-300'
                  }`}
                >
                  <div className="flex h-8 w-8 overflow-hidden rounded-lg ring-1 ring-charcoal-200">
                    <div className="h-full w-1/2" style={{ backgroundColor: preset.dark }} />
                    <div className="h-full w-1/2" style={{ backgroundColor: preset.light }} />
                  </div>
                  <span className="text-xs font-medium text-charcoal-700">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom colors */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">لون النقاط</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-charcoal-200"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 rounded-lg border border-charcoal-200 px-3 py-2 text-xs text-charcoal-700"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal-700">لون الخلفية</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-charcoal-200"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 rounded-lg border border-charcoal-200 px-3 py-2 text-xs text-charcoal-700"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-charcoal-700">
              حجم الصورة: {size}px
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-gold-500"
            />
          </div>

          {/* URL customization */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-charcoal-700">رابط الموقع المرمز</label>
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 text-sm text-charcoal-600 cursor-pointer">
                <input
                  type="radio"
                  checked={!useCustomUrl}
                  onChange={() => setUseCustomUrl(false)}
                  className="accent-gold-500"
                />
                رابط تلقائي
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal-600 cursor-pointer">
                <input
                  type="radio"
                  checked={useCustomUrl}
                  onChange={() => setUseCustomUrl(true)}
                  className="accent-gold-500"
                />
                رابط مخصص
              </label>
            </div>
            {useCustomUrl ? (
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-800 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                placeholder="https://my-site.com"
                dir="ltr"
              />
            ) : null}
            <p className="mt-2 text-xs text-charcoal-400">
              {useCustomUrl
                ? 'أدخل الرابط النهائي للموقع بعد النشر ليتوافق مع الرقم على البطاقات'
                : 'يستخدم الرابط الحالي تلقائياً. بعد النشر يمكنك التبديل إلى رابط مخصص.'}
            </p>
          </div>

          {/* URL info */}
          <div className="rounded-2xl bg-charcoal-50 p-4">
            <p className="text-sm font-medium text-charcoal-600">الرابط الحالي المرمز:</p>
            <p className="mt-1 break-all text-xs text-charcoal-400" dir="ltr">{siteUrl}</p>
          </div>
        </div>
      </div>

      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={size} height={size} />
    </div>
  );
}
