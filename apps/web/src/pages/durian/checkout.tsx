import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useCreateDurianOrder, useUploadDurianReceipt } from '@ttm/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const Route = createFileRoute('/durian/checkout')({
  component: DurianCheckout,
});

function DurianCheckout() {
  const form = useForm({
    defaultValues: {
      mobile: '',
      address: '',
      date: '',
      promo: ''
    }
  });
  
  const createOrder = useCreateDurianOrder();
  const uploadReceipt = useUploadDurianReceipt();
  
  const [orderId, setOrderId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const cartStr = localStorage.getItem('durian_cart');
  const cart = cartStr ? JSON.parse(cartStr) : [];
  const total = cart.reduce((acc: any, item: any) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleSubmit = async (values: any) => {
    const data: any = {
      mobile_number: values.mobile,
      delivery_address: values.address,
      delivery_date: values.date,
      items_data: cart.map((i: any) => ({
        product: i.hashid || i.id,
        quantity: i.quantity,
        unit_price: parseFloat(i.price),
        total_price: parseFloat(i.price) * i.quantity
      })),
      subtotal: total,
      total_amount: total
    };
    // Send promo code only if valid and backend expects it. For now omit to prevent crash.
    try {
      const res = await createOrder.mutateAsync(data);
      setOrderId(res.hashid);
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleUpload = async () => {
    if (!file || !orderId) return;
    try {
      await uploadReceipt.mutateAsync({ orderHashid: orderId, file });
      toast.success("Receipt uploaded! Thank you.");
      localStorage.removeItem('durian_cart');
      window.location.href = '/durian';
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  if (orderId) {
    return (
      <DurianLayout>
        <div className="max-w-xl mx-auto w-full p-10 text-center bg-white shadow-sm border rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Scan to Pay</h2>
          <div className="w-64 h-64 bg-slate-200 mx-auto flex items-center justify-center mb-6">
            [QR Code Placeholder]
          </div>
          <p className="mb-4 text-xl font-bold">Total: RM {total.toFixed(2)}</p>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="mb-4 block mx-auto border p-2 rounded" 
          />
          <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700">Upload Receipt</Button>
        </div>
      </DurianLayout>
    );
  }

  return (
    <DurianLayout>
      <div className="max-w-2xl mx-auto w-full p-10 bg-white rounded-xl shadow-sm border mt-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Checkout</h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Input id="mobile" control={form.control} label="Mobile Number" />
            <Input id="address" control={form.control} label="Delivery Address" />
            <Input id="date" control={form.control} label="Delivery Date" type="date" />
            <Input id="promo" control={form.control} label="Promo Code" />
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-6 text-lg font-bold">Proceed to Payment</Button>
          </form>
        </FormProvider>
      </div>
    </DurianLayout>
  );
}
