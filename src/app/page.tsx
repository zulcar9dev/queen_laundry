"use client";

import { useOrders, useStats } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Scale, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { STATUS_LABELS, OrderStatus } from "@/lib/types";

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.TIMBANG_MASUK]: "bg-blue-100 text-blue-800",
  [OrderStatus.CUCI]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.SETRIKA]: "bg-purple-100 text-purple-800",
  [OrderStatus.PACKING]: "bg-orange-100 text-orange-800",
  [OrderStatus.SELESAI]: "bg-green-100 text-green-800",
};

export default function Dashboard() {
  const { orders } = useOrders();
  const stats = useStats();

  const statCards = [
    { label: "Total Order", value: stats.totalOrders, icon: Package, color: "text-blue-600" },
    { label: "Total Kg", value: stats.totalKg.toFixed(1), icon: Scale, color: "text-green-600" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <header className="text-center py-4">
        <h1 className="text-2xl font-bold text-primary">Queen Laundry</h1>
        <p className="text-sm text-muted-foreground">Sistem Manajemen Laundry</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="p-3">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Link href="/order" className="block">
        <Button size="touch-lg" className="w-full text-lg font-semibold gap-2">
          <Plus className="h-5 w-5" />
          Order Baru
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada order masuk
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColors[order.status]}>
                      {STATUS_LABELS[order.status]}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.totalWeight} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
