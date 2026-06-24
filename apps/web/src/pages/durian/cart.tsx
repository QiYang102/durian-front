import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DurianLayout } from '@/components/durian/DurianLayout';

export const Route = createFileRoute('/durian/cart')({
  component: DurianCart,
});

function DurianCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const existingStr = localStorage.getItem('durian_cart');
    if (existingStr) setCart(JSON.parse(existingStr));
  }, []);

  const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const clearCart = () => {
    localStorage.removeItem('durian_cart');
    window.dispatchEvent(new Event('durian_cart_updated'));
    setCart([]);
  };

  return (
    <DurianLayout>
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 font-medium">Your cart is empty.</p>
            <Button onClick={() => navigate({ to: '/durian/products' })} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold px-8 py-3 rounded-full">
              Go Shop Durians
            </Button>
          </div>
        ) : (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 py-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">RM {item.price} x {item.quantity}</p>
                  </div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">
                    RM {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center py-6 text-xl font-extrabold text-slate-900 dark:text-white">
                <span>Total</span>
                <span>RM {total.toFixed(2)}</span>
              </div>

              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold shadow-md shadow-yellow-500/10 hover:shadow-yellow-500/20" onClick={() => navigate({ to: '/durian/checkout' })}>
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DurianLayout>
  );
}
