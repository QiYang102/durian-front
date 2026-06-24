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
    setCart([]);
  };

  return (
    <DurianLayout>
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-lg text-slate-500 mb-4">Your cart is empty.</p>
            <Button onClick={() => navigate({ to: '/durian/products' })}>Go Shop Durians</Button>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b py-4">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-slate-500">RM {item.price} x {item.quantity}</p>
                  </div>
                  <div className="font-bold">
                    RM {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center py-6 text-xl font-bold">
                <span>Total</span>
                <span>RM {total.toFixed(2)}</span>
              </div>

              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1" onClick={clearCart}>Clear Cart</Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => navigate({ to: '/durian/checkout' })}>
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
