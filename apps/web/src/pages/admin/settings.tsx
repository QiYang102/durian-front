import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useSystemSettings, useUpdateSystemSetting } from '@ttm/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ClassicLayout } from '@/components/ui/ClassicLayout';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
});

function AdminSettings() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();

  const shippingSetting = settings?.find((s) => s.key === 'shipping_fee');
  const deliveryDatesSetting = settings?.find((s) => s.key === 'delivery_dates');
  const selfCollectSetting = settings?.find((s) => s.key === 'self_collect_places');

  const [shippingFee, setShippingFee] = useState('');
  const [deliveryDates, setDeliveryDates] = useState('');
  const [selfCollectPlaces, setSelfCollectPlaces] = useState('');

  useEffect(() => {
    if (shippingSetting) setShippingFee(shippingSetting.value);
    if (deliveryDatesSetting) setDeliveryDates(deliveryDatesSetting.value);
    if (selfCollectSetting) setSelfCollectPlaces(selfCollectSetting.value);
  }, [shippingSetting, deliveryDatesSetting, selfCollectSetting]);

  const handleSave = async () => {
    try {
      if (shippingSetting) {
        await updateSetting.mutateAsync({
          id: shippingSetting.id || shippingSetting.hashid,
          value: shippingFee,
        });
      }
      if (deliveryDatesSetting) {
        await updateSetting.mutateAsync({
          id: deliveryDatesSetting.id || deliveryDatesSetting.hashid,
          value: deliveryDates,
        });
      }
      if (selfCollectSetting) {
        await updateSetting.mutateAsync({
          id: selfCollectSetting.id || selfCollectSetting.hashid,
          value: selfCollectPlaces,
        });
      }
      toast.success("Settings updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update settings: " + err.message);
    }
  };

  const content = (
    <div className="max-w-xl">
      {isLoading ? (
        <Text>Loading settings...</Text>
      ) : (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>System Configurations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Global Shipping Fee (RM)
              </label>
              <input
                type="number"
                step="0.01"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="placeholder:text-muted-foreground bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Allowed Delivery Dates (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 2026-06-25, 2026-06-26, 2026-06-27"
                value={deliveryDates}
                onChange={(e) => setDeliveryDates(e.target.value)}
                className="placeholder:text-muted-foreground bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs text-slate-500">Format: YYYY-MM-DD (separated by commas). Leaving empty allows selecting any date.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Self Collect Places (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. SS2 Outlet, Cheras Hub, Farm A"
                value={selfCollectPlaces}
                onChange={(e) => setSelfCollectPlaces(e.target.value)}
                className="placeholder:text-muted-foreground bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs text-slate-500">Format: place names separated by commas.</span>
            </div>

            <Button
              onClick={handleSave}
              className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold transition-all shadow-md mt-4"
            >
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return <ClassicLayout title="Global Settings" content={content} />;
}
