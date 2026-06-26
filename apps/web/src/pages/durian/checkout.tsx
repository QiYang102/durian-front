import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useCreateDurianOrder, useUploadDurianReceipt, useSystemSettings, useValidatePromoCode, PromoCode, useCancelDurianOrder } from '@ttm/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DurianLayout } from '@/components/durian/DurianLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from '@ttm/context/contexts/session';
import { toast } from 'sonner';
import { useGlobalLoading } from '@/components/GlobalLoadingContext';
import { Loader2 } from 'lucide-react';
import TnGQRCode from '@/assets/tng.jpeg';

export const Route = createFileRoute('/durian/checkout')({
  component: DurianCheckout,
});

function DurianCheckout() {
  const { user } = useSession();
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'collect'>('delivery');

  const form = useForm({
    defaultValues: {
      mobile: '',
      address: '',
      collectPlace: '',
      date: '',
      promo: ''
    }
  });

  useEffect(() => {
    if (user?.mobile_number) {
      form.setValue('mobile', user.mobile_number);
    }
  }, [user, form]);
  
  const createOrder = useCreateDurianOrder();
  const uploadReceipt = useUploadDurianReceipt();
  const validatePromo = useValidatePromoCode();
  const cancelOrder = useCancelDurianOrder();
  const { data: settings } = useSystemSettings();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useGlobalLoading();
  
  const [orderId, setOrderId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (orderId) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [orderId]);

  const handleCancel = async () => {
    if (!orderId) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      showLoading();
      await cancelOrder.mutateAsync(orderId);
      toast.success("Order cancelled successfully.");
      setOrderId(null);
    } catch (e: any) {
      toast.error("Failed to cancel order: " + JSON.stringify(e.response?.data || e.message));
    } finally {
      hideLoading();
    }
  };

  const cartStr = localStorage.getItem('durian_cart');
  const cart = cartStr ? JSON.parse(cartStr) : [];
  const subtotal = cart.reduce((acc: any, item: any) => acc + (parseFloat(item.price) * item.quantity), 0);

  const deliveryDatesSetting = settings?.find((s) => s.key === 'delivery_dates');
  const allowedDates = deliveryDatesSetting?.value
    ? deliveryDatesSetting.value.split(',').map((d) => d.trim()).filter(Boolean)
    : [];

  const selfCollectSetting = settings?.find((s) => s.key === 'self_collect_places');
  const allowedPlaces = selfCollectSetting?.value
    ? selfCollectSetting.value.split(',').map((p) => p.trim()).filter(Boolean)
    : [];

  // Get shipping fee from configurations
  const shippingSetting = settings?.find((s) => s.key === 'shipping_fee');
  const shippingFee = shippingSetting ? parseFloat(shippingSetting.value) : 10.00;

  // Calculate discounts based on promo type
  let discountAmount = 0;
  let isFreeShipping = false;

  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      discountAmount = subtotal * (parseFloat(appliedPromo.discount_value) / 100);
    } else if (appliedPromo.discount_type === 'fixed') {
      discountAmount = parseFloat(appliedPromo.discount_value);
    } else if (appliedPromo.discount_type === 'free_shipping') {
      isFreeShipping = true;
    } else if (appliedPromo.discount_type === 'bogo') {
      // Buy 1 Free 1 logic: Cheapest or general item BOGO
      // If quantity of an item is >= 2, deduct unit_price * floor(qty/2)
      cart.forEach((item: any) => {
        if (item.quantity >= 2) {
          const freeQty = Math.floor(item.quantity / 2);
          discountAmount += parseFloat(item.price) * freeQty;
        }
      });
    }
  }

  const shippingCharge = (isFreeShipping || deliveryMethod === 'collect') ? 0 : shippingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  const handleApplyPromo = async () => {
    const code = form.getValues('promo');
    if (!code) {
      toast.error("Please enter a promo code first.");
      return;
    }
    try {
      const res = await validatePromo.mutateAsync(code);
      setAppliedPromo(res);
      toast.success(`Promo code "${res.name}" applied successfully!`);
    } catch (err: any) {
      toast.error("Invalid or expired promo code.");
      setAppliedPromo(null);
    }
  };

  const handleSubmit = async (values: any) => {
    const address = deliveryMethod === 'collect'
      ? `Self Collect: ${values.collectPlace}`
      : values.address;

    const data: any = {
      mobile_number: values.mobile,
      delivery_address: address,
      delivery_date: values.date,
      items_data: cart.map((i: any) => ({
        product: i.hashid || i.id,
        quantity: i.quantity,
        unit_price: parseFloat(i.price).toFixed(2),
        total_price: (parseFloat(i.price) * i.quantity).toFixed(2)
      })),
      subtotal: subtotal.toFixed(2),
      shipping_fee: shippingCharge.toFixed(2),
      discount_amount: discountAmount.toFixed(2),
      total_amount: finalTotal.toFixed(2),
      promo_code: appliedPromo ? appliedPromo.id : null,
    };

    try {
      showLoading('Placing order...');
      const res = await createOrder.mutateAsync(data);
      setOrderId(res.id);
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Error creating order: " + JSON.stringify(err.response?.data || err.message));
    } finally {
      hideLoading();
    }
  };

  const handleUpload = async () => {
    if (!file || !orderId) return;
    try {
      showLoading('Uploading receipt...');
      await uploadReceipt.mutateAsync({ orderId, file });
      toast.success("Receipt uploaded! Thank you for your payment.");
      localStorage.removeItem('durian_cart');
      window.dispatchEvent(new Event('durian_cart_updated'));
      navigate({ to: '/durian/profile' });
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Error uploading receipt: " + JSON.stringify(err.response?.data || err.message));
    } finally {
      hideLoading();
    }
  };

  if (orderId) {
    return (
      <DurianLayout>
        <div className="max-w-xl mx-auto w-full p-10 text-center bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl">
          <h2 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight">Scan to Pay</h2>
          <div className="w-80 h-96 mx-auto overflow-hidden rounded-lg mb-6 border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white p-2">
            <img src={TnGQRCode} alt="Touch 'n Go QR Code" className="w-full h-full object-contain" />
          </div>
          <p className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-white">Total: <span className="text-yellow-600 dark:text-yellow-400">RM {finalTotal.toFixed(2)}</span></p>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="mb-6 block mx-auto text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer" 
          />
          <Button onClick={handleUpload} disabled={uploadReceipt.isPending} className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold py-6 text-lg transition-all shadow-md mb-4">
            {uploadReceipt.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
            ) : (
              <>Upload Receipt</>
            )}
          </Button>
          <Button onClick={handleCancel} disabled={cancelOrder.isPending} variant="outline" className="w-full py-6 text-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
            {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
          </Button>
        </div>
      </DurianLayout>
    );
  }

  return (
    <DurianLayout>
      <div className="max-w-2xl mx-auto w-full p-10 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mt-4">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-slate-900 dark:text-white tracking-tight">Checkout</h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Input 
              id="mobile" 
              control={form.control} 
              label="Mobile Number" 
              rules={{ required: "Mobile number is required" }} 
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Method</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      checked={deliveryMethod === 'delivery'} 
                      onChange={() => setDeliveryMethod('delivery')}
                      className="text-yellow-500 focus:ring-yellow-500 h-4 w-4"
                    />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Home Delivery</span>
                  </div>
                  <span className="text-xs text-slate-500">RM {shippingFee.toFixed(2)}</span>
                </label>
                <label className="flex-1 flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      checked={deliveryMethod === 'collect'} 
                      onChange={() => setDeliveryMethod('collect')}
                      className="text-yellow-500 focus:ring-yellow-500 h-4 w-4"
                    />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Self Collect</span>
                  </div>
                  <span className="text-xs text-slate-500">Free</span>
                </label>
              </div>
            </div>

            {deliveryMethod === 'delivery' ? (
              <Input 
                id="address" 
                control={form.control} 
                label="Delivery Address" 
                rules={{ required: "Delivery address is required" }} 
              />
            ) : (
              <div className="flex flex-col gap-1.5 w-full text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pickup Location</label>
                <select
                  {...form.register('collectPlace', { required: "Please select a pickup location" })}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="">-- Choose Pickup Place --</option>
                  {allowedPlaces.length > 0 ? (
                    allowedPlaces.map((place) => (
                      <option key={place} value={place}>{place}</option>
                    ))
                  ) : (
                    <option value="Main Farm Orchard">Main Farm Orchard (Default)</option>
                  )}
                </select>
                {form.formState.errors.collectPlace && (
                  <span className="text-sm text-red-600 font-medium">{form.formState.errors.collectPlace.message?.toString()}</span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5 w-full text-left">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {deliveryMethod === 'collect' ? "Collection Date" : "Delivery Date"}
              </label>
              {allowedDates.length > 0 ? (
                <select
                  {...form.register('date', { required: "Date selection is required" })}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="">-- Choose Date --</option>
                  {allowedDates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  {...form.register('date', { required: "Date selection is required" })}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                />
              )}
              {form.formState.errors.date && (
                <span className="text-sm text-red-600 font-medium">{form.formState.errors.date.message?.toString()}</span>
              )}
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input id="promo" control={form.control} label="Promo Code" />
              </div>
              <Button 
                type="button" 
                onClick={handleApplyPromo}
                disabled={validatePromo.isPending}
                className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 h-10 px-6 font-bold transition-all shadow-sm rounded-md"
              >
                {validatePromo.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Applying...</>
                ) : (
                  <>Apply</>
                )}
              </Button>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-slate-900 dark:text-white mb-2">
                  <span>{item.name} <span className="text-slate-500 text-xs ml-1">x {item.quantity}</span></span>
                  <span>RM {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">RM {subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount ({appliedPromo.name} - {
                    appliedPromo.discount_type === 'percentage' ? `${parseFloat(appliedPromo.discount_value)}% Off` :
                    appliedPromo.discount_type === 'fixed' ? `RM ${parseFloat(appliedPromo.discount_value)} Off` :
                    appliedPromo.discount_type === 'free_shipping' ? `Free Shipping` :
                    appliedPromo.discount_type === 'bogo' ? `Buy 1 Free 1` : ''
                  })</span>
                  <span>- RM {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shippingCharge === 0 ? "Free Shipping" : `RM ${shippingCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span>RM {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" disabled={createOrder.isPending} className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-yellow-500 dark:hover:text-slate-950 font-bold py-6 text-lg transition-all shadow-md mt-6">
              {createOrder.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Placing Order...</>
              ) : (
                <>Proceed to Payment</>
              )}
            </Button>
          </form>
        </FormProvider>
      </div>
    </DurianLayout>
  );
}
