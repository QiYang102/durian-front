import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../axios';

// Durian Types
export interface DurianProduct {
  id: number;
  hashid: string;
  name: string;
  description: string;
  price: string;
  weight: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_available: boolean;
  image: string;
  category: {
    id: number;
    hashid: string;
    name: string;
  };
}

export interface DurianCategory {
  id: number;
  hashid: string;
  name: string;
  description: string;
  image: string | null;
}

export interface DurianOrder {
  id: number;
  hashid: string;
  customer_name: string;
  mobile_number: string;
  delivery_date: string;
  delivery_address: string;
  total_amount: string;
  subtotal: string;
  shipping_fee: string;
  discount_amount: string;
  status: string;
  create_at: string;
  payment_receipt: string | null;
  items: {
    product_name?: string;
    product?: {
      name: string;
    };
    quantity: number;
    unit_price: string;
    total_price: string;
  }[];
}

export interface DurianDashboardStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  paid_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  today_orders: number;
  delivered_revenue: number;
  pending_revenue: number;
  chart_data: { date: string; orders: number; revenue: number }[];
}

export interface SystemSetting {
  id: number;
  hashid: string;
  key: string;
  value: string;
  name: string;
}

export interface PromoCode {
  id: number;
  hashid: string;
  name: string;
  discount_type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  discount_value: string;
  valid_from: string | null;
  valid_until: string | null;
  max_uses: number;
  current_uses: number;
}

// Customer-facing hooks
export const useDurianProducts = () => {
  return useQuery({
    queryKey: ['durianProducts'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/products');
      return res.data.products as DurianProduct[];
    },
  });
};

export const useDurianCategories = () => {
  return useQuery({
    queryKey: ['durianCategories'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/categories');
      return res.data.categories as DurianCategory[];
    },
  });
};

export const useDurianOrders = () => {
  return useQuery({
    queryKey: ['durianOrders'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/orders?include[]=items.*');
      const orders = res.data.orders || [];
      const orderItems = res.data.order_items || [];
      
      return orders.map((order: any) => ({
        ...order,
        items: (order.items || []).map((itemId: number) => 
          orderItems.find((i: any) => i.id === itemId)
        ).filter(Boolean)
      })) as DurianOrder[];
    },
  });
};

export const useCreateDurianOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosClient.post('/durian/orders', data);
      return res.data.order as DurianOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianOrders'] });
    },
  });
};

export const useUploadDurianReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, file }: { orderId: number; file: File }) => {
      const formData = new FormData();
      formData.append('receipt', file);
      const res = await axiosClient.post(`/durian/orders/${orderId}/upload_receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianOrders'] });
    },
  });
};

export const useCancelDurianOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await axiosClient.post(`/durian/orders/${orderId}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianOrders'] });
    },
  });
};

// Admin hooks
export const useDurianAdminOrders = () => {
  return useQuery({
    queryKey: ['durianAdminOrders'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/orders/admin_orders');
      return res.data.orders as DurianOrder[];
    },
  });
};

export const useDurianDashboardStats = () => {
  return useQuery({
    queryKey: ['durianDashboardStats'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/orders/admin_dashboard');
      return res.data as DurianDashboardStats;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const res = await axiosClient.post(`/durian/orders/${orderId}/update_status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianAdminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['durianDashboardStats'] });
    },
  });
};

export const useUpdateDurianOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: number; data: any }) => {
      const res = await axiosClient.patch(`/durian/orders/${orderId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianAdminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['durianDashboardStats'] });
    },
  });
};

// Product CRUD Mutations
export const useCreateDurianProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosClient.post('/durian/products', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianProducts'] });
    },
  });
};

export const useUpdateDurianProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axiosClient.patch(`/durian/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianProducts'] });
    },
  });
};

export const useDeleteDurianProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosClient.delete(`/durian/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianProducts'] });
    },
  });
};

export const useUploadDurianProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, file }: { productId: number; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axiosClient.post(`/durian/products/${productId}/upload_image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianProducts'] });
    },
  });
};

// PromoCode CRUD & Validation
export const useDurianPromoCodes = () => {
  return useQuery({
    queryKey: ['durianPromoCodes'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/promo-codes');
      return res.data.promo_codes as PromoCode[];
    },
  });
};

export const useValidatePromoCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await axiosClient.post('/durian/promo-codes/validate', { code });
      return res.data.promo_code as PromoCode;
    },
  });
};

export const useCreateDurianPromoCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosClient.post('/durian/promo-codes', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianPromoCodes'] });
    },
  });
};

export const useDeleteDurianPromoCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (hashid: string) => {
      const res = await axiosClient.delete(`/durian/promo-codes/${hashid}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianPromoCodes'] });
    },
  });
};

// SystemSetting CRUD
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/settings');
      return res.data.system_settings as SystemSetting[];
    },
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: number | string; value: string }) => {
      const res = await axiosClient.patch(`/durian/settings/${id}`, { value });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
  });
};

export interface HomeBanner {
  id: number;
  hashid: string;
  title: string | null;
  subtitle: string | null;
  image: string | null;
  link_url: string | null;
  is_active: boolean;
}

export const useDurianBanners = () => {
  return useQuery({
    queryKey: ['durianBanners'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/banners');
      return res.data.home_banners as HomeBanner[];
    },
  });
};

export const useCreateDurianBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosClient.post('/durian/banners', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianBanners'] });
    },
  });
};

export const useUploadDurianBannerImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bannerId, file }: { bannerId: number; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axiosClient.post(`/durian/banners/${bannerId}/upload_image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianBanners'] });
    },
  });
};

export const useDeleteDurianBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosClient.delete(`/durian/banners/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durianBanners'] });
    },
  });
};
