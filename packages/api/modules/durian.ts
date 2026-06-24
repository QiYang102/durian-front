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
  image: string;
  category: {
    hashid: string;
    name: string;
  };
}

export interface DurianOrder {
  hashid: string;
  mobile_number: string;
  delivery_date: string;
  delivery_address: string;
  total_amount: string;
  status: string;
}

// Hooks
export const useDurianProducts = () => {
  return useQuery({
    queryKey: ['durianProducts'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/products');
      return res.data.products as DurianProduct[];
    },
  });
};

export const useDurianOrders = () => {
  return useQuery({
    queryKey: ['durianOrders'],
    queryFn: async () => {
      const res = await axiosClient.get('/durian/orders');
      return res.data.orders as DurianOrder[];
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
      queryClient.invalidateQueries({ queryKey: ['durian_orders'] });
    },
  });
};

export const useUploadDurianReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderHashid, file }: { orderHashid: string; file: File }) => {
      const formData = new FormData();
      formData.append('receipt', file);
      const res = await axiosClient.post(`/durian/orders/${orderHashid}/upload_receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durian_orders'] });
    },
  });
};
