import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (user?.role !== 'admin') return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
    { href: '/admin/products', label: 'Produtos', icon: Package },
    { href: '/admin/suppliers', label: 'Fornecedores', icon: Users },
    { href: '/admin/customers', label: 'Clientes', icon: Users },
    { href: '/admin/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-black border-r border-white/10 hidden md:flex flex-col relative z-20" aria-label="Admin navigation">
      <div className="p-6 border-b border-white/10 mb-4">
        <h2 className="text-[#00FF00] font-bold tracking-[0.2em] uppercase text-lg text-center drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">Sisters Lab</h2>
        <p className="text-white/50 text-[10px] tracking-widest text-center mt-1 uppercase">Central de Comando</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'text-[#00FF00] bg-white/5' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.8)]" />
              )}
              
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-mono text-sm tracking-widest uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-white/30 hover:text-[#00FF00] transition-colors cursor-default">
          <span className="w-2 h-2 rounded-none bg-[#00FF00] animate-pulse shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
          <span className="text-[10px] font-mono tracking-widest uppercase">Sistema Online</span>
        </div>
      </div>
    </aside>
  );
}
