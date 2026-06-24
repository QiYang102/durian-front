import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useDurianPromoCodes,
  useCreateDurianPromoCode,
  useDeleteDurianPromoCode,
  PromoCode
} from '@ttm/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ClassicLayout } from '@/components/ui/ClassicLayout';
import { toast } from 'sonner';
import { Trash2, Plus, X, Tag } from 'lucide-react';

export const Route = createFileRoute('/admin/promo-codes')({
  component: AdminPromoCodes,
});

function AdminPromoCodes() {
  const { data: promoCodes, isLoading } = useDurianPromoCodes();
  const createPromoCode = useCreateDurianPromoCode();
  const deletePromoCode = useDeleteDurianPromoCode();

  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [codeName, setCodeName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'bogo' | 'free_shipping'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('100');

  const handleSave = async () => {
    if (!codeName) {
      toast.error("Please enter a code name.");
      return;
    }

    const payload = {
      name: codeName, // Used as the promo code text (e.g. DURIAN10)
      discount_type: discountType,
      discount_value: (discountType === 'bogo' || discountType === 'free_shipping') ? 0 : parseFloat(discountValue || '0'),
      max_uses: parseInt(maxUses || '100', 10),
      current_uses: 0
    };

    try {
      await createPromoCode.mutateAsync(payload);
      toast.success("Promo code created successfully!");
      setIsAdding(false);
      setCodeName('');
      setDiscountValue('');
    } catch (err: any) {
      toast.error("Failed to create promo code: " + err.message);
    }
  };

  const handleDelete = async (hashid: string) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return;
    try {
      await deletePromoCode.mutateAsync(hashid);
      toast.success("Promo code deleted!");
    } catch (err: any) {
      toast.error("Failed to delete promo code: " + err.message);
    }
  };

  const content = (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Text variant="body" className="text-slate-500 dark:text-slate-400">
          Create and manage discount promo codes for percentage, fixed amount, Buy 1 Free 1, or Free Shipping offers.
        </Text>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold transition-all shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Promo Code
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <CardTitle>Create New Promo Code</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Code Name (Uppercase without spaces) *</label>
              <input
                type="text"
                placeholder="e.g. DURIAN10"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Offer Type *</label>
              <select
                value={discountType}
                onChange={(e: any) => setDiscountType(e.target.value)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Price Discount</option>
                <option value="bogo">Buy 1 Free 1 (BOGO)</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>

            {(discountType === 'percentage' || discountType === 'fixed') && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {discountType === 'percentage' ? "Discount Percent (%) *" : "Discount Amount (RM) *"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 10.00"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Max Usage Limit *</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex gap-4 md:col-span-2 mt-4">
              <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold px-6 shadow-sm">
                Create Code
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center text-slate-500">Loading promo codes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
                    <th className="py-4 px-6">Promo Code</th>
                    <th className="py-4 px-6">Discount Type</th>
                    <th className="py-4 px-6">Value / Benefit</th>
                    <th className="py-4 px-6">Usage Count</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {promoCodes?.map((promo) => (
                    <tr key={promo.hashid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-slate-900 dark:text-slate-100">
                      <td className="py-4 px-6 font-bold flex items-center gap-2">
                        <Tag className="w-4 h-4 text-yellow-500" />
                        <span>{promo.name}</span>
                      </td>
                      <td className="py-4 px-6 capitalize text-slate-600 dark:text-slate-400">{promo.discount_type.replace('_', ' ')}</td>
                      <td className="py-4 px-6 font-semibold">
                        {promo.discount_type === 'percentage' && `${promo.discount_value}% Off`}
                        {promo.discount_type === 'fixed' && `RM ${promo.discount_value} Off`}
                        {promo.discount_type === 'bogo' && "Buy 1 Free 1"}
                        {promo.discount_type === 'free_shipping' && "Free Shipping"}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {promo.current_uses} / {promo.max_uses}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.hashid)} className="h-8 w-8 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return <ClassicLayout title="Promo Codes Management" content={content} />;
}
