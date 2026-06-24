import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import {
  CheckCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import { useDurianAdminOrders, useUpdateOrderStatus, type DurianOrder } from "@ttm/api/modules/durian";
import { Loading } from "@/components/ui/Loading";
import { toast } from "sonner";

function Orders() {
  const { data: orders, isLoading } = useDurianAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = (orders ?? []).filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const handleUpdateStatus = (orderId: number, status: string, orderHashid: string) => {
    updateStatus.mutate(
      { orderId, status },
      {
        onSuccess: () => {
          toast.success(`Order ${orderHashid} marked as ${status}`);
        },
        onError: () => {
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

  const ordersContent = (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
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
                      Phone
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
                    <tr
                      key={order.hashid}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2 font-mono text-xs">
                        {order.hashid}
                      </td>
                      <td className="py-3 px-2">{order.mobile_number}</td>
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
                            onClick={() =>
                              setViewingReceipt(order.payment_receipt)
                            }
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
                        <div className="flex gap-1">
                          {order.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() =>
                                handleUpdateStatus(order.id, "cancelled", order.hashid)
                              }
                              disabled={updateStatus.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                          {order.status === "paid" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-green-600 hover:text-green-800 hover:bg-green-50"
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    "success_paid",
                                    order.hashid
                                  )
                                }
                                disabled={updateStatus.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve Receipt
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    "cancelled",
                                    order.hashid
                                  )
                                }
                                disabled={updateStatus.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {order.status === "success_paid" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    "delivered",
                                    order.hashid
                                  )
                                }
                                disabled={updateStatus.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Ship / Deliver
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    "cancelled",
                                    order.hashid
                                  )
                                }
                                disabled={updateStatus.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
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
    </div>
  );

  return <ClassicLayout title="Order Management" content={ordersContent} />;
}

export const Route = createFileRoute("/admin/orders")({
  component: Orders,
});
