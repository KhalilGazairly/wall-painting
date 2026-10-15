import { Palette, LogOut, Image as ImageIcon, Settings, Home, BarChart3, QrCode, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

export type AdminPage = 'gallery' | 'settings' | 'analytics' | 'qrcode';

interface AdminSidebarProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ activePage, onNavigate, isOpen, onClose }: AdminSidebarProps) {
  const { signOut } = useAuth();
  const { siteName } = useSettings();

  const navItems: { key: AdminPage; label: string; icon: typeof ImageIcon }[] = [
    { key: 'gallery', label: 'إدارة المعرض', icon: ImageIcon },
    { key: 'analytics', label: 'الإحصائيات والزوار', icon: BarChart3 },
    { key: 'qrcode', label: 'رمز QR للبطاقات', icon: QrCode },
    { key: 'settings', label: 'إعدادات التواصل', icon: Settings },
  ];

  const handleNavigate = (page: AdminPage) => {
    onNavigate(page);
    onClose();
  };

  const handleSignOut = () => {
    onClose();
    signOut();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar: hidden off-canvas on mobile, fixed visible on desktop */}
      <aside
        className={`fixed top-0 z-50 flex h-full w-72 flex-col overflow-y-auto border-l border-white/10 bg-charcoal-950 transition-all duration-300 ease-in-out lg:right-0 ${
          isOpen ? 'right-0' : '-right-72'
        }`}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 shadow-lg shadow-gold-500/30">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white leading-tight">{siteName}</h2>
              <p className="text-xs text-gold-300">لوحة التحكم</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="space-y-1 border-t border-white/10 px-4 py-4">
          <a
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
          >
            <Home className="h-5 w-5" />
            عرض الموقع
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
