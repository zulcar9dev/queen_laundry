"use client";

import { useState, useMemo } from "react";
import { useOrders, useRacks } from "@/hooks/useStore";
import { OrderCard } from "@/components/order-card";
import { RackSelectorModal } from "@/components/rack-selector-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, STATUS_LABELS } from "@/lib/types";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_ORDER: OrderStatus[] = [
  OrderStatus.TIMBANG_MASUK,
  OrderStatus.CUCI,
  OrderStatus.SETRIKA,
  OrderStatus.PACKING,
  OrderStatus.SELESAI,
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.TIMBANG_MASUK:
      return "border-blue-300 bg-blue-100 text-blue-800";
    case OrderStatus.CUCI:
      return "border-yellow-300 bg-yellow-100 text-yellow-800";
    case OrderStatus.SETRIKA:
      return "border-purple-300 bg-purple-100 text-purple-800";
    case OrderStatus.PACKING:
      return "border-orange-300 bg-orange-100 text-orange-800";
    case OrderStatus.SELESAI:
      return "border-green-300 bg-green-100 text-green-800";
    default:
      return "border-gray-300 bg-gray-100 text-gray-800";
  }
};

type FilterType = "all" | "today" | "search";

export default function StatusPage() {
  const { orders, updateStatus } = useOrders();
  const { racks, assignToRack } = useRacks();

  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rackModalOpen, setRackModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter((o) => o.createdAt.startsWith(today));
    } else if (filter === "search" && searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(query) ||
          o.orderNumber.toLowerCase().includes(query)
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, filter, searchQuery]);

  const ordersByStatus = useMemo(() => {
    const grouped: Record<OrderStatus, typeof orders> = {
      [OrderStatus.TIMBANG_MASUK]: [],
      [OrderStatus.CUCI]: [],
      [OrderStatus.SETRIKA]: [],
      [OrderStatus.PACKING]: [],
      [OrderStatus.SELESAI]: [],
    };

    filteredOrders.forEach((order) => {
      grouped[order.status].push(order);
    });

    return grouped;
  }, [filteredOrders]);

  const getNextStatus = (current: OrderStatus): OrderStatus | undefined => {
    const currentIndex = STATUS_ORDER.indexOf(current);
    if (currentIndex < 0 || currentIndex >= STATUS_ORDER.length - 1) return undefined;
    return STATUS_ORDER[currentIndex + 1];
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === OrderStatus.PACKING) {
      setSelectedOrderId(orderId);
      setRackModalOpen(true);
    } else {
      updateStatus(orderId, newStatus);
    }
  };

  const handleRackSelect = (rackId: string) => {
    if (selectedOrderId) {
      updateStatus(selectedOrderId, OrderStatus.PACKING);
      assignToRack(selectedOrderId, rackId);
      setRackModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">Status Board</h1>
        </div>
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilter("search");
                }}
                placeholder="Cari order..."
                className="pl-9"
              />
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(["all", "today"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    filter === f ? "bg-white shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {f === "all" ? "Semua" : "Hari Ini"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {isMobile ? (
          <div className="space-y-6">
            {STATUS_ORDER.map((status) => (
              <div key={status} className={cn("rounded-xl p-3", getStatusColor(status).split(" ")[1])}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("w-3 h-3 rounded-full", getStatusColor(status).split(" ")[0])} />
                  <h2 className="font-bold text-gray-900">{STATUS_LABELS[status]}</h2>
                  <Badge variant="outline" className="ml-auto border-gray-400 text-gray-700 bg-white">
                    {ordersByStatus[status].length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {ordersByStatus[status].map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      nextStatus={getNextStatus(status)}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  {ordersByStatus[status].length === 0 && (
                    <p className="text-center text-gray-500 py-4 text-sm bg-white/50 rounded-lg">
                      Tidak ada order
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {STATUS_ORDER.map((status) => (
              <div key={status} className="space-y-3">
                <div className={cn("rounded-lg p-2", getStatusColor(status))}>
                  <div className="flex items-center justify-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(status).split(" ")[0])} />
                    <span className="font-bold text-sm">{STATUS_LABELS[status]}</span>
                    <Badge variant="outline" className="border-current bg-white/50 text-inherit">
                      {ordersByStatus[status].length}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {ordersByStatus[status].map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      nextStatus={getNextStatus(status)}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RackSelectorModal
        open={rackModalOpen}
        onOpenChange={setRackModalOpen}
        orderId={selectedOrderId || ""}
        onSelect={handleRackSelect}
      />
    </div>
  );
}
