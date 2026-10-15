import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar, type AdminPage } from '@/components/admin/AdminSidebar';
import { GalleryManagement } from '@/components/admin/GalleryManagement';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminQrCode } from '@/components/admin/AdminQrCode';

export function AdminDashboard() {
  const [activePage, setActivePage] = useState<AdminPage>('gallery');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitles: Record<AdminPage, string> = {
    gallery: 'إدارة المعرض',
    analytics: 'الإحصائيات والزوار',
    qrcode: 'رمز QR للبطاقات',
    settings: 'إعدادات التواصل',
  };

  return (
    <div className="min-h-screen bg-charcoal-50">
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-charcoal-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-100 text-charcoal-700 transition-colors hover:bg-charcoal-200"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-charcoal-900">{pageTitles[activePage]}</h1>
      </header>

      <main className="min-h-screen lg:mr-72">
        {activePage === 'gallery' && <GalleryManagement />}
        {activePage === 'analytics' && <AdminAnalytics />}
        {activePage === 'qrcode' && <AdminQrCode />}
        {activePage === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}
