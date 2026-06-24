import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  useDurianProducts,
  useDurianCategories,
  useCreateDurianProduct,
  useUpdateDurianProduct,
  useDeleteDurianProduct,
  useUploadDurianProductImage,
  DurianProduct
} from '@ttm/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ClassicLayout } from '@/components/ui/ClassicLayout';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const Route = createFileRoute('/admin/products')({
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products, isLoading: productsLoading } = useDurianProducts();
  const { data: categories, isLoading: categoriesLoading } = useDurianCategories();

  const createProduct = useCreateDurianProduct();
  const updateProduct = useUpdateDurianProduct();
  const deleteProduct = useDeleteDurianProduct();
  const uploadProductImage = useUploadDurianProductImage();

  const [editingProduct, setEditingProduct] = useState<Partial<DurianProduct> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [categoryHashid, setCategoryHashid] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const startEdit = (product: DurianProduct) => {
    setEditingProduct(product);
    setIsNew(false);
    setName(product.name);
    setCategoryHashid(product.category?.id?.toString() || '');
    setPrice(product.price);
    setWeight(product.weight);
    setImage(product.image || '');
    setImageFile(null);
    setDescription(product.description || '');
    setIsFeatured(product.is_featured);
    setIsBestSeller(product.is_best_seller);
  };

  const startCreate = () => {
    setEditingProduct({});
    setIsNew(true);
    setName('');
    setCategoryHashid(categories && categories.length > 0 ? categories[0].id.toString() : '');
    setPrice('');
    setWeight('');
    setImage('');
    setImageFile(null);
    setDescription('');
    setIsFeatured(false);
    setIsBestSeller(false);
  };

  const handleSave = async () => {
    if (!name || !price || !weight || !categoryHashid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      name,
      category: parseInt(categoryHashid),
      price: parseFloat(price),
      weight,
      description,
      is_featured: isFeatured,
      is_best_seller: isBestSeller
    };

    try {
      let savedProductId: number | null = null;
      if (isNew) {
        const res = await createProduct.mutateAsync(payload);
        savedProductId = res.product?.id || null;
      } else {
        await updateProduct.mutateAsync({
          id: editingProduct!.id!,
          data: payload
        });
        savedProductId = editingProduct!.id! || null;
      }

      if (imageFile && savedProductId) {
        await uploadProductImage.mutateAsync({
          productId: savedProductId,
          file: imageFile
        });
      }

      toast.success("Product saved successfully!");
      setEditingProduct(null);
      setImageFile(null);
    } catch (err: any) {
      toast.error("Failed to save product: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted!");
    } catch (err: any) {
      toast.error("Failed to delete product: " + err.message);
    }
  };

  const isLoading = productsLoading || categoriesLoading;

  const content = (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Text variant="body" className="text-slate-500 dark:text-slate-400">
          Manage product catalog, image URLs, prices, and descriptions.
        </Text>
        {!editingProduct && (
          <Button onClick={startCreate} className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold transition-all shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        )}
      </div>

      {editingProduct && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <CardTitle>{isNew ? "Add New Product" : `Edit Product: ${editingProduct.name}`}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category *</label>
              <select
                value={categoryHashid}
                onChange={(e) => setCategoryHashid(e.target.value)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price (RM) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Weight *</label>
              <input
                type="text"
                placeholder="e.g. 400g, 1kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="bg-background flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100 cursor-pointer"
              />
              {image && (
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>Current Image:</span>
                  <a href={image} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">View Image</a>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background flex w-full rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Feature this product on homepage</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="isBestSeller" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mark as Best Seller on homepage</label>
              </div>
            </div>

            <div className="flex gap-4 md:col-span-2 mt-4">
              <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold px-6 shadow-sm">
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingProduct(null)} className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center text-slate-500">Loading products...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Weight</th>
                    <th className="py-4 px-6">Featured</th>
                    <th className="py-4 px-6">Best Seller</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products?.map((p) => (
                    <tr key={p.hashid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-slate-900 dark:text-slate-100">
                      <td className="py-4 px-6">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-md text-xs text-slate-400">None</div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold">{p.name}</td>
                      <td className="py-4 px-6 text-slate-500">{p.category?.name || 'Unassigned'}</td>
                      <td className="py-4 px-6 font-semibold">RM {p.price}</td>
                      <td className="py-4 px-6">{p.weight}</td>
                      <td className="py-4 px-6">
                        {p.is_featured ? (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 text-xs font-semibold rounded-full">Yes</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {p.is_best_seller ? (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400 text-xs font-semibold rounded-full">Best Seller</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">No</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8 text-slate-500 hover:text-slate-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-8 w-8 text-red-500 hover:text-red-700">
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

  return <ClassicLayout title="Product Management" content={content} />;
}
