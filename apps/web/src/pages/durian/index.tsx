import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DurianLayout } from '@/components/durian/DurianLayout';

export const Route = createFileRoute('/durian/')({
  component: DurianHome,
});

function DurianHome() {
  return (
    <DurianLayout>
      <div className="w-full max-w-5xl">
        <div className="bg-yellow-400 text-yellow-900 rounded-xl p-10 mb-8 text-center shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to Durian Is Ok!</h1>
          <p className="text-xl">The best fresh Musang King in town.</p>
          <div className="mt-8">
            <Link to="/durian/products">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Premium Quality</h2>
              <p>We source directly from the farm.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">Fast Delivery</h2>
              <p>Delivered fresh to your doorstep.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DurianLayout>
  );
}
