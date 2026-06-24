import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useDurianBanners,
  useCreateDurianBanner,
  useUploadDurianBannerImage,
  useDeleteDurianBanner
} from '@ttm/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ClassicLayout } from '@/components/ui/ClassicLayout';
import { toast } from 'sonner';
import { Trash2, Plus, X } from 'lucide-react';

export const Route = createFileRoute('/admin/banners')({
  component: AdminBanners,
});

function AdminBanners() {
  const { data: banners, isLoading } = useDurianBanners();
  const createBanner = useCreateDurianBanner();
  const uploadBannerImage = useUploadDurianBannerImage();
  const deleteBanner = useDeleteDurianBanner();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (!imageFile) {
      toast.error("Please select a banner image file.");
      return;
    }

    try {
      const payload = {
        title: title || null,
        subtitle: subtitle || null,
        link_url: linkUrl || null,
        is_active: true
      };

      const res = await createBanner.mutateAsync(payload);
      const bannerId = res.home_banner?.id;

      if (bannerId && imageFile) {
        await uploadBannerImage.mutateAsync({
          bannerId,
          file: imageFile
        });
      }

      toast.success("Banner added successfully!");
      setTitle('');
      setSubtitle('');
      setLinkUrl('');
      setImageFile(null);
      setIsAdding(false);
    } catch (err: any) {
      toast.error("Failed to add banner: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner.mutateAsync(id);
      toast.success("Banner deleted successfully!");
    } catch (err: any) {
      toast.error("Failed to delete banner: " + err.message);
    }
  };

  const content = (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Text variant="body" className="text-slate-500 dark:text-slate-400">
          Manage promotional banners displayed at the top of the storefront homepage.
        </Text>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold transition-all shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Banner
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <CardTitle>Add New Home Banner</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Banner Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Musang King Season"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Banner Subtitle (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Flat RM15 shipping nationwide"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Banner Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Link URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /durian/products"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold px-6 shadow-sm">
                Add Banner
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
            <div className="p-10 text-center text-slate-500">Loading banners...</div>
          ) : !banners || banners.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No banners uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {banners.map((b) => (
                <div key={b.hashid} className="group relative border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900/50">
                  <div className="h-40 relative bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {b.image ? (
                      <img src={b.image} alt={b.title || "Banner"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-400">No Image</div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(b.id)} className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h4 className="font-bold text-slate-950 dark:text-white text-base">{b.title || "Untitled Banner"}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{b.subtitle || "No subtitle"}</p>
                    {b.link_url && (
                      <div className="text-xs text-slate-400 mt-2 font-mono truncate">
                        Link: <span className="underline">{b.link_url}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return <ClassicLayout title="Homepage Banners" content={content} />;
}
