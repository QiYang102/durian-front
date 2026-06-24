import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDurianProducts } from '@ttm/api';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { Leaf } from 'lucide-react';

export const Route = createFileRoute('/durian/products')({
  component: DurianProducts,
});

function DurianProducts() {
  const { data: products, isLoading } = useDurianProducts();
  const navigate = useNavigate();

  const addToCart = (product: any) => {
    const existingStr = localStorage.getItem('durian_cart');
    const cart = existingStr ? JSON.parse(existingStr) : [];
    const existingItem = cart.find((i: any) => i.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('durian_cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  return (
    <DurianLayout>
      <div className="max-w-5xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Fresh Durians</h1>
          <Button onClick={() => navigate({ to: '/durian/cart' })} variant="outline">
            View Cart
          </Button>
        </div>
        
        {isLoading ? (
          <div className="p-10 text-center">Loading fresh durians...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products?.map((p: any) => (
              <Card key={p.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 bg-yellow-100 flex items-center justify-center shrink-0">
                  <Leaf className="w-16 h-16 text-yellow-600" />
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{p.weight}</p>
                  <p className="text-green-700 font-bold mt-2">RM {p.price}</p>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2">{p.description}</p>
                </CardContent>
                <CardFooter className="p-4 bg-slate-50 border-t shrink-0">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => addToCart(p)}>
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DurianLayout>
  );
}
