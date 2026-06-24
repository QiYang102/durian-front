import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDurianProducts } from '@ttm/api';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/durian/products')({
  component: DurianProducts,
});

function DurianProducts() {
  const { data: products, isLoading } = useDurianProducts();
  const navigate = useNavigate();
  const [animations, setAnimations] = useState<{ id: number; x: number; y: number }[]>([]);

  const addToCart = (product: any, e: React.MouseEvent<HTMLButtonElement>) => {
    const existingStr = localStorage.getItem('durian_cart');
    const cart = existingStr ? JSON.parse(existingStr) : [];
    const existingItem = cart.find((i: any) => i.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('durian_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('durian_cart_updated'));
    toast.success(`${product.name} added to cart!`);

    // Capture click location for floating animation
    const x = e.clientX;
    const y = e.clientY;
    const newAnim = { id: Date.now(), x, y };
    setAnimations((prev) => [...prev, newAnim]);
    setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== newAnim.id));
    }, 800);
  };

  return (
    <DurianLayout>
      <div className="max-w-5xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fresh Durians</h1>
          <Button onClick={() => navigate({ to: '/durian/cart' })} variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            View Cart
          </Button>
        </div>
        
        {isLoading ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400">Loading fresh durians...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products?.map((p: any) => (
              <Card key={p.id} className="overflow-hidden flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Leaf className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{p.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{p.weight}</p>
                  <p className="text-slate-950 dark:text-white font-extrabold text-xl mt-2">RM {p.price}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2">{p.description}</p>
                </CardContent>
                <CardFooter className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <Button className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold transition-all" onClick={(e) => addToCart(p, e)}>
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {animations.map((anim) => (
        <span
          key={anim.id}
          className="fixed text-yellow-500 font-black text-2xl z-50 pointer-events-none animate-float-up"
          style={{ left: `${anim.x - 12}px`, top: `${anim.y - 20}px` }}
        >
          +1
        </span>
      ))}
    </DurianLayout>
  );
}
