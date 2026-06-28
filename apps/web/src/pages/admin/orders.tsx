import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import {
  CheckCircle,
  XCircle,
  Eye,
  X,
  Loader2,
  Plus,
  Upload,
  Edit,
} from "lucide-react";
import {
  useDurianAdminOrders,
  useUpdateOrderStatus,
  useUpdateDurianOrder,
  useCreateDurianOrder,
  useUploadDurianReceipt,
  useDurianProducts,
  useSystemSettings,
  useValidatePromoCode,
  type DurianOrder,
  type DurianProduct,
  type PromoCode,
} from "@ttm/api/modules/durian";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/components/ui/Loading";
import { useGlobalLoading } from "@/components/GlobalLoadingContext";
import { toast } from "sonner";

function Orders() {
  const { data: orders, isLoading } = useDurianAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateDurianOrder();
  const createOrder = useCreateDurianOrder();
  const uploadReceipt = useUploadDurianReceipt();
  const { data: products } = useDurianProducts();
  const { data: settings } = useSystemSettings();
  const validatePromo = useValidatePromoCode();
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useGlobalLoading();
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [editingOrder, setEditingOrder] = useState<DurianOrder | null>(null);
  const [editForm, setEditForm] = useState({
    customer_name: "",
    mobile_number: "",
    delivery_address: "",
    delivery_date: "",
    status: "",
  });

  const handleEditClick = (order: DurianOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrder(order);
    setEditForm({
      customer_name: order.customer_name || "",
      mobile_number: order.mobile_number || "",
      delivery_address: order.delivery_address || "",
      delivery_date: order.delivery_date || "",
      status: order.status || "",
    });
  };

  const submitEdit = async () => {
    if (!editingOrder) return;
    showLoading("Saving order...");
    try {
      await updateOrder.mutateAsync({
        orderId: editingOrder.id,
        data: editForm,
      });
      toast.success("Order updated successfully");
      setEditingOrder(null);
    } catch (err) {
      toast.error("Failed to update order");
    } finally {
      hideLoading();
    }
  };

  const deliveryDatesSetting = settings?.find((s) => s.key === 'delivery_dates');
  const allowedDates = deliveryDatesSetting?.value
    ? deliveryDatesSetting.value.split(',').map((d) => d.trim()).filter(Boolean)
    : [];
    
  const selfCollectSetting = settings?.find((s) => s.key === 'self_collect_places');
  const allowedPlaces = selfCollectSetting?.value
    ? selfCollectSetting.value.split(',').map((p) => p.trim()).filter(Boolean)
    : [];

  const shippingSetting = settings?.find((s) => s.key === 'shipping_fee');
  const defaultShippingFee = shippingSetting ? parseFloat(shippingSetting.value) : 10.00;

  // Upload Order modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'collect'>('delivery');
  const [collectPlace, setCollectPlace] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [uploadForm, setUploadForm] = useState({
    mobile_number: "",
    delivery_address: "",
    delivery_date: "",
    shipping_fee: "10",
  });

  useEffect(() => {
    if (shippingSetting) {
      setUploadForm(prev => ({ ...prev, shipping_fee: shippingSetting.value }));
    }
  }, [shippingSetting]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<
    { product: DurianProduct; quantity: number }[]
  >([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const product = products?.find(
      (p) => p.id.toString() === selectedProductId
    );
    if (!product) return;
    // If already added, increase quantity
    const existing = orderItems.find((item) => item.product.id === product.id);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, { product, quantity: selectedQuantity }]);
    }
    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderItems(orderItems.filter((item) => item.product.id !== productId));
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setReceiptFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const resetUploadModal = () => {
    setUploadForm({ mobile_number: "", delivery_address: "", delivery_date: "", shipping_fee: defaultShippingFee.toString() });
    setOrderItems([]);
    setSelectedProductId("");
    setSelectedQuantity(1);
    setReceiptFile(null);
    setReceiptPreview(null);
    setDeliveryMethod('delivery');
    setCollectPlace('');
    setPromoCodeInput('');
    setAppliedPromo(null);
    setShowUploadModal(false);
  };

  const handleCreateOrder = async () => {
    const address = deliveryMethod === 'collect' ? `Self Collect: ${collectPlace}` : uploadForm.delivery_address;
    if (!uploadForm.mobile_number || !address || !uploadForm.delivery_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (deliveryMethod === 'collect' && !collectPlace) {
      toast.error("Please select a pickup location");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    setIsCreatingOrder(true);
    showLoading("Creating order...");
    try {
      const subtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
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
          orderItems.forEach((item) => {
            if (item.quantity >= 2) {
              const freeQty = Math.floor(item.quantity / 2);
              discountAmount += parseFloat(item.product.price) * freeQty;
            }
          });
        }
      }

      const rawShipping = parseFloat(uploadForm.shipping_fee) || 0;
      const shippingCharge = (isFreeShipping || deliveryMethod === 'collect') ? 0 : rawShipping;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharge);
      
      const orderData = {
        mobile_number: uploadForm.mobile_number,
        delivery_address: address,
        delivery_date: uploadForm.delivery_date,
        items_data: orderItems.map((item) => ({
          product: item.product.hashid,
          quantity: item.quantity,
          unit_price: parseFloat(item.product.price),
          total_price: parseFloat(item.product.price) * item.quantity,
        })),
        subtotal: subtotal,
        shipping_fee: shippingCharge,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        promo_code: appliedPromo ? appliedPromo.id : null,
      };
      const newOrder = await createOrder.mutateAsync(orderData);
      if (receiptFile && newOrder?.id) {
        await uploadReceipt.mutateAsync({ orderId: newOrder.id, file: receiptFile });
      }
      queryClient.invalidateQueries({ queryKey: ["durianAdminOrders"] });
      toast.success("Order created successfully!");
      resetUploadModal();
    } catch {
      toast.error("Failed to create order");
    } finally {
      hideLoading();
      setIsCreatingOrder(false);
    }
  };

  const filteredOrders = (orders ?? []).filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const handleUpdateStatus = (orderId: number, status: string, orderHashid: string) => {
    showLoading("Updating order status...");
    updateStatus.mutate(
      { orderId, status },
      {
        onSuccess: () => {
          hideLoading();
          toast.success(`Order ${orderHashid} marked as ${status}`);
        },
        onError: () => {
          hideLoading();
          toast.error("Failed to update order status");
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-slate-100 text-slate-800",
      paid: "bg-yellow-100 text-yellow-800",
      success_paid: "bg-green-100 text-green-800",
      delivered: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    const labelMap: Record<string, string> = {
      pending: "Pending",
      paid: "Paid",
      success_paid: "Success Paid",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {labelMap[status] || status}
      </span>
    );
  };

  const statusFilters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Success Paid", value: "success_paid" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const currentSubtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  let currentDiscountAmount = 0;
  let currentIsFreeShipping = false;

  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      currentDiscountAmount = currentSubtotal * (parseFloat(appliedPromo.discount_value) / 100);
    } else if (appliedPromo.discount_type === 'fixed') {
      currentDiscountAmount = parseFloat(appliedPromo.discount_value);
    } else if (appliedPromo.discount_type === 'free_shipping') {
      currentIsFreeShipping = true;
    } else if (appliedPromo.discount_type === 'bogo') {
      orderItems.forEach((item) => {
        if (item.quantity >= 2) {
          const freeQty = Math.floor(item.quantity / 2);
          currentDiscountAmount += parseFloat(item.product.price) * freeQty;
        }
      });
    }
  }

  const currentRawShipping = parseFloat(uploadForm.shipping_fee) || 0;
  const currentShippingCharge = (currentIsFreeShipping || deliveryMethod === 'collect') ? 0 : currentRawShipping;
  const currentFinalTotal = Math.max(0, currentSubtotal - currentDiscountAmount + currentShippingCharge);

  const ordersContent = (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap items-center">
        {statusFilters.map((f) => (
          <Button
            key={f.value}
            variant={filterStatus === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(f.value)}
          >
            {f.label}
            {f.value !== "all" && orders && (
              <span className="ml-1.5 bg-white/20 rounded-full px-1.5 text-xs">
                {orders.filter((o) => o.status === f.value).length}
              </span>
            )}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="ml-auto"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload Order
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <Loading
              showText
              text="Loading orders..."
              size="lg"
              className="items-center justify-center py-8"
            />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Phone
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Items
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Delivery Date
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Address
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Receipt
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.hashid}>
                      <tr
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <td className="py-3 px-2 font-mono text-xs">
                          {order.hashid}
                        </td>
                        <td className="py-3 px-2">{order.customer_name || '-'}</td>
                        <td className="py-3 px-2">{order.mobile_number}</td>
                        <td className="py-3 px-2 max-w-[200px] truncate" title={order.items?.map(i => `${(i.product?.name || i.product_name)} x ${i.quantity}`).join(', ')}>
                          {order.items?.map(i => `${(i.product?.name || i.product_name)} x ${i.quantity}`).join(', ')}
                        </td>
                        <td className="py-3 px-2">{order.delivery_date}</td>
                        <td className="py-3 px-2 max-w-[200px] truncate">
                          {order.delivery_address}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          RM {order.total_amount}
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-2">
                          {order.payment_receipt ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingReceipt(order.payment_receipt);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No receipt
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1 flex-wrap items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                              onClick={(e) => handleEditClick(order, e)}
                            >
                              <Edit className="h-4 w-4 mr-1" />Edit
                            </Button>
                            {order.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(order.id, "cancelled", order.hashid);
                                }}
                                disabled={updateStatus.isPending}
                              >
                                {updateStatus.isPending ? (
                                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Cancelling...</>
                                ) : (
                                  <><XCircle className="h-4 w-4 mr-1" />Cancel</>
                                )}
                              </Button>
                            )}
                            {order.status === "paid" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-green-600 hover:text-green-800 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(
                                      order.id,
                                      "success_paid",
                                      order.hashid
                                    );
                                  }}
                                  disabled={updateStatus.isPending}
                                >
                                  {updateStatus.isPending ? (
                                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Approving...</>
                                  ) : (
                                    <><CheckCircle className="h-4 w-4 mr-1" />Approve Receipt</>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(
                                      order.id,
                                      "cancelled",
                                      order.hashid
                                    );
                                  }}
                                  disabled={updateStatus.isPending}
                                >
                                  {updateStatus.isPending ? (
                                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Cancelling...</>
                                  ) : (
                                    <><XCircle className="h-4 w-4 mr-1" />Reject</>
                                  )}
                                </Button>
                              </>
                            )}
                            {order.status === "success_paid" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(
                                      order.id,
                                      "delivered",
                                      order.hashid
                                    );
                                  }}
                                  disabled={updateStatus.isPending}
                                >
                                  {updateStatus.isPending ? (
                                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Delivering...</>
                                  ) : (
                                    <><CheckCircle className="h-4 w-4 mr-1" />Ship / Deliver</>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(
                                      order.id,
                                      "cancelled",
                                      order.hashid
                                    );
                                  }}
                                  disabled={updateStatus.isPending}
                                >
                                  {updateStatus.isPending ? (
                                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Cancelling...</>
                                  ) : (
                                    <><XCircle className="h-4 w-4 mr-1" />Cancel</>
                                  )}
                                </Button>
                              </>
                            )}
                            {(order.status === "delivered" ||
                              order.status === "cancelled") && (
                              <span className="text-xs text-muted-foreground py-1">
                                --
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <td colSpan={9} className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col gap-2 max-w-2xl mx-auto">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="font-semibold text-slate-700 mb-1">Customer Info</h4>
                                  <p className="text-sm"><span className="text-slate-500">Name:</span> {order.customer_name || 'N/A'}</p>
                                  <p className="text-sm"><span className="text-slate-500">Phone:</span> {order.mobile_number}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-700 mb-1">Delivery Info</h4>
                                  <p className="text-sm"><span className="text-slate-500">Date:</span> {order.delivery_date}</p>
                                  <p className="text-sm"><span className="text-slate-500">Address:</span> {order.delivery_address}</p>
                                </div>
                              </div>
                              
                              <h4 className="font-semibold mb-2 text-slate-700">Order Items</h4>
                              {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700 last:border-0">
                                  <span className="text-sm">{(item.product?.name || item.product_name)} <span className="text-slate-500 ml-1">x {item.quantity}</span></span>
                                  <span className="text-sm font-medium">RM {item.total_price}</span>
                                </div>
                              ))}
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between text-sm py-0.5">
                                  <span className="text-slate-500">Subtotal</span>
                                  <span>RM {order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm py-0.5">
                                  <span className="text-slate-500">Shipping Fee</span>
                                  <span>{parseFloat(order.shipping_fee) === 0 ? 'Free' : `RM ${order.shipping_fee}`}</span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                  <div className="flex justify-between text-sm py-0.5">
                                    <span className="text-emerald-600">Discount</span>
                                    <span className="text-emerald-600">- RM {order.discount_amount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-semibold mt-1 text-base">
                                  <span>Total</span>
                                  <span className="text-yellow-600">RM {order.total_amount}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Viewer Modal */}
      {viewingReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setViewingReceipt(null)}
        >
          <div
            className="relative max-w-2xl max-h-[80vh] bg-white rounded-lg shadow-xl overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => setViewingReceipt(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Text variant="h3" className="mb-3">
              Payment Receipt
            </Text>
            <img
              src={viewingReceipt}
              alt="Payment Receipt"
              className="max-w-full rounded-md"
            />
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setEditingOrder(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <Text variant="h3" className="mb-4">
                Edit Order {editingOrder.hashid}
              </Text>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editForm.customer_name}
                    onChange={(e) => setEditForm({...editForm, customer_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editForm.mobile_number}
                    onChange={(e) => setEditForm({...editForm, mobile_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editForm.delivery_date}
                    onChange={(e) => setEditForm({...editForm, delivery_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    value={editForm.delivery_address}
                    onChange={(e) => setEditForm({...editForm, delivery_address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="success_paid">Success Paid</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setEditingOrder(null)}>
                  Cancel
                </Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold" onClick={submitEdit} disabled={updateOrder.isPending}>
                  {updateOrder.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Order Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => resetUploadModal()}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-lg shadow-xl overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => resetUploadModal()}
            >
              <X className="h-4 w-4" />
            </Button>
            <Text variant="h3" className="mb-4">
              Upload Order
            </Text>

            <div className="flex flex-col gap-4">
              {/* Mobile Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                  placeholder="e.g. 60123456789"
                  value={uploadForm.mobile_number}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, mobile_number: e.target.value })
                  }
                />
              </div>

              {/* Delivery Method */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Delivery Method</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg p-3 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="adminDeliveryMethod" 
                      checked={deliveryMethod === 'delivery'} 
                      onChange={() => setDeliveryMethod('delivery')}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm">Home Delivery</span>
                  </label>
                  <label className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg p-3 cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="adminDeliveryMethod" 
                      checked={deliveryMethod === 'collect'} 
                      onChange={() => setDeliveryMethod('collect')}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm">Self Collect</span>
                  </label>
                </div>
              </div>

              {/* Delivery Address or Collect Place */}
              {deliveryMethod === 'delivery' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Delivery Address</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    placeholder="Full delivery address"
                    value={uploadForm.delivery_address}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, delivery_address: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Pickup Location</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    value={collectPlace}
                    onChange={(e) => setCollectPlace(e.target.value)}
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
                </div>
              )}

              {/* Delivery Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Delivery Date</label>
                {allowedDates.length > 0 ? (
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    value={uploadForm.delivery_date}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, delivery_date: e.target.value })
                    }
                  >
                    <option value="">-- Choose Date --</option>
                    {allowedDates.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    value={uploadForm.delivery_date}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, delivery_date: e.target.value })
                    }
                  />
                )}
              </div>

              {/* Shipping Fee */}
              {deliveryMethod === 'delivery' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Shipping Fee (RM)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    value={uploadForm.shipping_fee}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, shipping_fee: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Promo Code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex h-10 flex-1 rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    placeholder="Enter code..."
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  />
                  <Button
                    type="button"
                    onClick={async () => {
                      if (!promoCodeInput) return;
                      try {
                        const res = await validatePromo.mutateAsync(promoCodeInput);
                        setAppliedPromo(res);
                        toast.success(`Promo code "${res.name}" applied!`);
                      } catch {
                        toast.error("Invalid or expired code");
                        setAppliedPromo(null);
                      }
                    }}
                    disabled={validatePromo.isPending}
                    className="h-10"
                  >
                    {validatePromo.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
                {appliedPromo && (
                  <span className="text-sm text-green-600 font-medium mt-1">Applied: {appliedPromo.name}</span>
                )}
              </div>

              {/* Product Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Products</label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 flex-1 rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value="">Select product...</option>
                    {products?.map((p) => (
                      <option key={p.id} value={p.id.toString()}>
                        {p.name} - RM {p.price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    className="flex h-10 w-20 rounded-md border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                    value={selectedQuantity}
                    onChange={(e) =>
                      setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-10"
                    onClick={handleAddProduct}
                    disabled={!selectedProductId}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {/* Added products list */}
                {orderItems.length > 0 && (
                  <div className="mt-2 border rounded-md divide-y">
                    {orderItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <span>
                          {item.product.name} × {item.quantity}
                          <span className="text-muted-foreground ml-2">
                            RM {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveProduct(item.product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold bg-slate-50">
                      <span>Subtotal</span>
                      <span>RM {currentSubtotal.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50">
                        <span>Discount ({appliedPromo.name} - {
                          appliedPromo.discount_type === 'percentage' ? `${parseFloat(appliedPromo.discount_value)}% Off` :
                          appliedPromo.discount_type === 'fixed' ? `RM ${parseFloat(appliedPromo.discount_value)} Off` :
                          appliedPromo.discount_type === 'free_shipping' ? `Free Shipping` :
                          appliedPromo.discount_type === 'bogo' ? `Buy 1 Free 1` : ''
                        })</span>
                        <span>- RM {currentDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold bg-slate-50">
                      <span>Shipping Fee</span>
                      <span>{currentShippingCharge === 0 ? "Free" : `RM ${currentShippingCharge.toFixed(2)}`}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-sm font-bold bg-slate-100 border-t">
                      <span>Total Amount</span>
                      <span>RM {currentFinalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Receipt Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Receipt Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                  onChange={handleReceiptFileChange}
                />
                {receiptPreview && (
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="mt-2 max-h-40 rounded-md object-contain border"
                  />
                )}
              </div>

              {/* Submit Button */}
              <Button
                className="w-full mt-2"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Creating Order...</>
                ) : (
                  <><Upload className="h-4 w-4 mr-1" />Create Order</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return <ClassicLayout title="Order Management" content={ordersContent} />;
}

export const Route = createFileRoute("/admin/orders")({
  component: Orders,
});
