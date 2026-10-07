import { Palette, LogOut, Image as ImageIcon, Settings, Home, BarChart3, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

export type AdminPage = 'gallery' | 'settings' | 'analytics' | 'qrcode';

interface AdminSidebarProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
}

export function AdminSidebar({ activePage, onNavigate }: AdminSidebarProps) {
  const { signOut } = useAuth();
  const { siteName } = useSettings();

  const navItems: { key: AdminPage; label: string; icon: typeof ImageIcon }[] = [
    { key: 'gallery', label: 'إدارة المعرض', icon: ImageIcon },
    { key: 'analytics', label: 'الإحصائيات والزوار', icon: BarChart3 },
    { key: 'qrcode', label: 'رمز QR للبطاقات', icon: QrCode },
    { key: 'settings', label: 'إعدادات التواصل', icon: Settings },
  ];

  return (
    <aside className="fixed right-0 top-0 z-30 flex h-full w-72 flex-col border-l border-white/10 bg-charcoal-950">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 shadow-lg shadow-gold-500/30">
          <Palette className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-white leading-tight">{siteName}</h2>
          <p className="text-xs text-gold-300">لوحة التحكم</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
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
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
