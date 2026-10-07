import { useState } from 'react';
import { AdminSidebar, type AdminPage } from '@/components/admin/AdminSidebar';
import { GalleryManagement } from '@/components/admin/GalleryManagement';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminQrCode } from '@/components/admin/AdminQrCode';

export function AdminDashboard() {
  const [activePage, setActivePage] = useState<AdminPage>('gallery');

  return (
    <div className="min-h-screen bg-charcoal-50">
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="mr-72 min-h-screen">
        {activePage === 'gallery' && <GalleryManagement />}
        {activePage === 'analytics' && <AdminAnalytics />}
        {activePage === 'qrcode' && <AdminQrCode />}
        {activePage === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}
