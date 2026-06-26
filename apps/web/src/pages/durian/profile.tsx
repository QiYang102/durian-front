import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { useDurianOrders, useUploadDurianReceipt } from '@ttm/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSession } from '@ttm/context/contexts/session';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/durian/profile')({
  component: DurianProfile,
});

function DurianProfile() {
  const { data: orders, isLoading } = useDurianOrders();
  const { user } = useSession();
  const navigate = useNavigate();
  const uploadReceipt = useUploadDurianReceipt();

  const [selectedFiles, setSelectedFiles] = useState<{ [orderId: string]: File }>({});

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (user === null) {
      navigate({ to: '/durian/login', replace: true });
    }
  }, [user, navigate]);

  const handleFileChange = (orderId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [orderId]: file }));
    }
  };

  const handleUploadReceipt = async (orderId: number) => {
    const file = selectedFiles[orderId];
    if (!file) {
      toast.error("Please select a receipt image file first.");
      return;
    }
    try {
      await uploadReceipt.mutateAsync({ orderId, file });
      toast.success("Receipt uploaded successfully!");
      setSelectedFiles((prev) => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    }
  };

  if (!user) return null;

  return (
    <DurianLayout>
      <div className="max-w-4xl mx-auto w-full p-4 py-8">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white tracking-tight">My Orders</h1>
        
        {isLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading your orders...</p>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.hashid} className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <CardHeader 
                  className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg text-slate-900 dark:text-white font-bold">Order #{order.hashid}</CardTitle>
                      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">(Click to view details)</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
                      order.status === 'success_paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/55 dark:text-green-200' 
                        : order.status === 'paid'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/55 dark:text-yellow-200'
                        : order.status === 'delivered'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/55 dark:text-blue-200'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/55 dark:text-red-200'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {order.status === 'success_paid' 
                        ? 'Success Paid' 
                        : order.status === 'paid'
                        ? 'Paid' 
                        : order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-1">Delivery Date</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{order.delivery_date}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500 dark:text-slate-400 mb-1">Delivery Address</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{order.delivery_address}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 mb-1">Total</p>
                      <p className="font-extrabold text-lg text-slate-950 dark:text-white">RM {order.total_amount}</p>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Order Details</h4>
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                            <span>{(item.product?.name || item.product_name)} <span className="text-slate-500 text-xs ml-1">x {item.quantity}</span></span>
                            <span className="font-medium">RM {item.total_price}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Subtotal</span>
                          <span>RM {order.subtotal}</span>
                        </div>
                        {parseFloat(order.discount_amount) > 0 && (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                            <span>Discount</span>
                            <span>- RM {order.discount_amount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Shipping Fee</span>
                          <span>{parseFloat(order.shipping_fee) === 0 ? 'Free' : `RM ${order.shipping_fee}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 text-base">
                          <span>Total</span>
                          <span>RM {order.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-left w-full sm:w-auto">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Upload Payment Receipt</p>
                        <input 
                          type="file" 
                          onChange={(e) => handleFileChange(order.id, e)}
                          className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
                        />
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleUploadReceipt(order.id)}
                        className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold transition-all w-full sm:w-auto px-4"
                      >
                        Submit Receipt
                      </Button>
                    </div>
                  )}

                  {order.status === 'paid' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-left w-full">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Payment Receipt Submitted</p>
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-500">Awaiting admin verification...</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-lg">You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </DurianLayout>
  );
}
