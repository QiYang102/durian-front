import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { ClassicLayout } from "@/components/ui/ClassicLayout";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Package,
} from "lucide-react";
import { useDurianDashboardStats, useDurianAdminOrders } from "@ttm/api/modules/durian";
import { Loading } from "@/components/ui/Loading";

function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDurianDashboardStats();
  const { data: orders, isLoading: ordersLoading } = useDurianAdminOrders();

  const isLoading = statsLoading || ordersLoading;

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `RM ${(stats?.total_revenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders ?? 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Paid (Awaiting Review)",
      value: stats?.paid_orders ?? 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Delivered",
      value: stats?.delivered_orders ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Cancelled",
      value: stats?.cancelled_orders ?? 0,
      icon: Package,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const recentOrders = (orders ?? []).slice(0, 10);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const dashboardContent = (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <Text variant="h2" className="mb-4">
            Recent Orders
          </Text>
          {isLoading ? (
            <Loading showText text="Loading orders..." size="lg" className="items-center justify-center py-8" />
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-40" />
              <p>No orders yet</p>
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
                      Date
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
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.hashid}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-2 font-mono text-xs">
                        {order.hashid}
                      </td>
                      <td className="py-3 px-2">{order.mobile_number}</td>
                      <td className="py-3 px-2">{order.delivery_date}</td>
                      <td className="py-3 px-2 font-medium">
                        RM {order.total_amount}
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-2">
                        {order.payment_receipt ? (
                          <span className="text-green-600 text-xs font-medium">Uploaded</span>
                        ) : (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
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

  return <ClassicLayout title="Sales Dashboard" content={dashboardContent} />;
}

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});
