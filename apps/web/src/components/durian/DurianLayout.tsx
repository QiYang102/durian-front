import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { useSession } from '@ttm/context/contexts/session';
import { ShoppingCart, Menu } from 'lucide-react';
import DuriNowLogo from '@/assets/DurianNow_Logo.png';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export function DurianLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useSession();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const existingStr = localStorage.getItem('durian_cart');
      if (existingStr) {
        try {
          const cart = JSON.parse(existingStr);
          if (Array.isArray(cart)) {
            const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
            setCartCount(count);
            return;
          }
        } catch (e) {
          console.error('Error parsing cart from localStorage', e);
        }
      }
      setCartCount(0);
    };

    updateCount();
    window.addEventListener('durian_cart_updated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('durian_cart_updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans dark:bg-slate-950">
      <header className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 w-full h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/durian/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
              <img src={DuriNowLogo} alt="DuriNow" className="h-12 object-contain" />
            </Link>
            <nav className="hidden md:flex gap-6 font-medium">
              <Link
                to="/durian/products"
                activeProps={{ className: "text-yellow-600 dark:text-yellow-400 font-bold" }}
                inactiveProps={{ className: "text-slate-600 dark:text-slate-300" }}
                className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              >
                Products
              </Link>
              <Link
                to="/durian/about"
                activeProps={{ className: "text-yellow-600 dark:text-yellow-400 font-bold" }}
                inactiveProps={{ className: "text-slate-600 dark:text-slate-300" }}
                className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 relative px-2 sm:px-4" onClick={() => navigate({ to: '/durian/cart' })}>
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-yellow-500 text-slate-950 text-[10px] font-black rounded-full h-[18px] min-w-[18px] flex items-center justify-center border border-white dark:border-slate-900 px-1">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="ml-1 hidden sm:inline">Cart</span>
            </Button>
            
            {/* Desktop Auth / User Controls */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    activeProps={{ className: "text-yellow-600 dark:text-yellow-400 font-bold" }}
                    inactiveProps={{ className: "text-slate-600 dark:text-slate-300" }}
                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/durian/profile"
                  activeProps={{ className: "text-yellow-600 dark:text-yellow-400 font-bold" }}
                  inactiveProps={{ className: "text-slate-600 dark:text-slate-300" }}
                  className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
                >
                  {user.fullname || user.username || user.email}
                </Link>
                <Button variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="hidden md:flex bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900 border-none shadow-sm font-semibold" onClick={() => navigate({ to: '/durian/login' })}>
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-800 dark:text-slate-200 -ml-1">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white dark:bg-slate-950 flex flex-col pt-12">
                  <nav className="flex flex-col gap-6 font-medium text-lg">
                    <SheetClose asChild>
                      <Link to="/durian/products" className="hover:text-yellow-600 dark:hover:text-yellow-400">Products</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/durian/about" className="hover:text-yellow-600 dark:hover:text-yellow-400">About Us</Link>
                    </SheetClose>
                    
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
                    
                    {user ? (
                      <>
                        <div className="text-sm text-slate-500 mb-2 truncate px-1">
                          Hi, {user.fullname || user.username || user.email}
                        </div>
                        {user.role === 'admin' && (
                          <SheetClose asChild>
                            <Link to="/admin" className="hover:text-yellow-600 dark:hover:text-yellow-400 font-bold text-blue-600 dark:text-blue-400">Admin Panel</Link>
                          </SheetClose>
                        )}
                        <SheetClose asChild>
                          <Link to="/durian/profile" className="hover:text-yellow-600 dark:hover:text-yellow-400">
                            Profile / Orders
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="outline" className="w-full justify-center mt-4 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200" onClick={signOut}>
                            Sign Out
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      <SheetClose asChild>
                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 mt-4 py-6" onClick={() => navigate({ to: '/durian/login' })}>
                          Login
                        </Button>
                      </SheetClose>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 py-10 w-full">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 text-center mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/durian/products" className="hover:text-white transition-colors">Products</Link>
            <Link to="/durian/about" className="hover:text-white transition-colors">About Us</Link>
          </div>
          <p className="opacity-80 font-medium text-sm">&copy; {new Date().getFullYear()} <span className="text-white">DuriNow</span> — Good Durian, Good Mood!</p>
        </div>
      </footer>
    </div>
  );
}
