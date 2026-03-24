"use client";

import { useOrders, useStats } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Scale, Clock, Plus, ChevronRight, LayoutDashboard, History, Settings, User } from "lucide-react";
import Link from "next/link";
import { STATUS_LABELS, OrderStatus, Order } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { OrderPreviewModal } from "@/components/order-preview-modal";

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.TIMBANG_MASUK]: "bg-blue-100 text-blue-700 border-blue-200",
  [OrderStatus.CUCI]: "bg-cyan-100 text-cyan-700 border-cyan-200",
  [OrderStatus.SETRIKA]: "bg-orange-100 text-orange-700 border-orange-200",
  [OrderStatus.PACKING]: "bg-purple-100 text-purple-700 border-purple-200",
  [OrderStatus.SELESAI]: "bg-green-100 text-green-700 border-green-200",
};

export default function Dashboard() {
  const { orders } = useOrders();
  const stats = useStats();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsPreviewOpen(true);
  };

  const statCards = [
    { label: "Total Order", value: stats.totalOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Kg", value: stats.totalKg.toFixed(1), icon: Scale, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f6fafe] pb-24">
      {/* Header with Azure Linen aesthetic */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold font-manrope tracking-tight text-[#171c1f]">
              Queen <span className="text-primary italic">Laundry</span>
            </h1>
            <p className="text-muted-foreground font-medium">Dashboard Kasir</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-white shadow-ambient flex items-center justify-center border border-white/50">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-none shadow-ambient overflow-hidden rounded-2xl">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={cn("p-2 rounded-xl mb-3", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-xl font-bold font-manrope">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Button - Touch First */}
        <Link href="/order" className="block group">
          <Button 
            size="touch-lg" 
            className="w-full text-lg font-bold gap-3 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-blue-600"
          >
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            Create New Order
          </Button>
        </Link>

        {/* Recent Orders Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold font-manrope text-[#171c1f]">Recent Orders</h2>
            <Link href="/status" className="text-primary text-sm font-bold flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200 bg-transparent shadow-none">
                <CardContent className="p-8 text-center">
                  <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No orders yet today</p>
                </CardContent>
              </Card>
            ) : (
              recentOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="border-none shadow-ambient rounded-2xl overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99] transition-transform cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#171c1f] leading-tight">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1 font-medium">{order.orderNumber}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full border-none font-bold text-[10px] uppercase tracking-wider", statusColors[order.status])}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                      <p className="text-xs font-bold text-[#171c1f]">
                        {order.totalWeight} <span className="text-muted-foreground font-medium">kg</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>

      <OrderPreviewModal 
        order={selectedOrder}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
