import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { useSession } from '@ttm/context/contexts/session';
import { ShoppingCart, Leaf } from 'lucide-react';

export function DurianLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useSession();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-yellow-400 text-yellow-950 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 w-full h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/durian/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
              <Leaf className="w-6 h-6" /> Durian Is Ok!
            </Link>
            <nav className="hidden md:flex gap-4 font-medium">
              <Link to="/durian/products" className="hover:text-yellow-800 transition-colors">Products</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hover:bg-yellow-500/50 text-yellow-950 font-semibold flex items-center gap-2" onClick={() => navigate({ to: '/durian/cart' })}>
              <ShoppingCart className="w-5 h-5" /> Cart
            </Button>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/durian/profile" className="font-medium hover:text-yellow-600 transition-colors hidden sm:inline">
                  {user.fullname || user.username || user.email}
                </Link>
                <Button variant="outline" className="border-yellow-600 text-yellow-950 hover:bg-yellow-500" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white border-none shadow-sm" onClick={() => navigate({ to: '/durian/login' })}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 py-10 w-full">
        {children}
      </main>

      <footer className="bg-yellow-950 text-yellow-100 py-8 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="opacity-80 font-medium">© {new Date().getFullYear()} Durian Is Ok. Premium Musang King Direct from Farm.</p>
        </div>
      </footer>
    </div>
  );
}
