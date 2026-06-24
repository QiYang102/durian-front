import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { useDurianOrders } from '@ttm/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSession } from '@ttm/context/contexts/session';
import { useEffect } from 'react';

export const Route = createFileRoute('/durian/profile')({
  component: DurianProfile,
});

function DurianProfile() {
  const { data: orders, isLoading } = useDurianOrders();
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate({ to: '/durian/login', replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <DurianLayout>
      <div className="max-w-4xl mx-auto w-full p-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {isLoading ? (
          <p className="text-slate-500">Loading your orders...</p>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.hashid} className="overflow-hidden border-yellow-200">
                <CardHeader className="bg-yellow-50/50 py-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Order #{order.hashid}</CardTitle>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium capitalize">
                      {order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Delivery Date</p>
                      <p className="font-medium">{order.delivery_date}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500 mb-1">Delivery Address</p>
                      <p className="font-medium">{order.delivery_address}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Total</p>
                      <p className="font-medium text-lg text-yellow-700">RM {order.total_amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl">
            <p className="text-slate-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </DurianLayout>
  );
}
