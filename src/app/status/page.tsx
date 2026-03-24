"use client";

import { useState, useMemo } from "react";
import { useOrders } from "@/hooks/useStore";
import { OrderCard } from "@/components/order-card";
import { RackSelectorModal } from "@/components/rack-selector-modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, STATUS_LABELS } from "@/lib/types";
import { Search, ListFilter, LayoutDashboard, History } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRacks } from "@/hooks/useStore";
import { OrderPreviewModal } from "@/components/order-preview-modal";
import { Order } from "@/lib/types";

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
      return "bg-blue-50 text-blue-700";
    case OrderStatus.CUCI:
      return "bg-cyan-50 text-cyan-700";
    case OrderStatus.SETRIKA:
      return "bg-orange-50 text-orange-700";
    case OrderStatus.PACKING:
      return "bg-purple-50 text-purple-700";
    case OrderStatus.SELESAI:
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

const getStatusDot = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.TIMBANG_MASUK:
      return "bg-blue-400";
    case OrderStatus.CUCI:
      return "bg-cyan-400";
    case OrderStatus.SETRIKA:
      return "bg-orange-400";
    case OrderStatus.PACKING:
      return "bg-purple-400";
    case OrderStatus.SELESAI:
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

type FilterType = "all" | "today" | "search";

export default function StatusPage() {
  const { orders, updateStatus } = useOrders();
  const { assignToRack } = useRacks();

  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rackModalOpen, setRackModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

  const handleCardClick = (order: Order) => {
    setPreviewOrder(order);
    setIsPreviewOpen(true);
  };

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

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#171c1f] uppercase tracking-tight">Tracking Board</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Live order workflow manager</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-[#f1f5f9] p-1 rounded-xl">
             {(["all", "today"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    filter === f ? "bg-white text-[#171c1f] shadow-sm" : "text-muted-foreground hover:text-[#171c1f]"
                  )}
                >
                  {f === "all" ? "All Orders" : "Today"}
                </button>
              ))}
          </div>
        </div>
      </header>

      {/* Search & Mobile Filters */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 md:hidden">
         <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilter("search");
                }}
                placeholder="Search orders..."
                className="pl-9 h-12 bg-[#f8fafc] border-none rounded-xl text-sm font-medium"
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center bg-[#f8fafc] rounded-xl text-muted-foreground">
              <ListFilter className="h-5 w-5" />
            </button>
          </div>
      </div>

      {/* Board Content */}
      <main className="px-6 py-8 overflow-x-auto">
        <div className="flex gap-6 min-w-max md:min-w-full">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="w-80 flex flex-col gap-4">
              {/* Column Header */}
              <div className={cn("p-4 rounded-2xl flex items-center justify-between shadow-sm border border-white/50", getStatusColor(status))}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm animate-pulse", getStatusDot(status))} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{STATUS_LABELS[status]}</span>
                </div>
                <Badge variant="outline" className="border-none bg-white/50 text-[#171c1f] font-black text-[10px]">
                  {ordersByStatus[status].length}
                </Badge>
              </div>

              {/* Column Content */}
              <div className="space-y-4">
                {ordersByStatus[status].map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    nextStatus={getNextStatus(status)}
                    onStatusChange={handleStatusChange}
                    onCardClick={handleCardClick}
                  />
                ))}
                
                {ordersByStatus[status].length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl border-2 border-dashed border-gray-200 bg-white/30">
                    <History className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">No orders here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <RackSelectorModal
        open={rackModalOpen}
        onOpenChange={setRackModalOpen}
        orderId={selectedOrderId || ""}
        onSelect={handleRackSelect}
      />

      <OrderPreviewModal 
        order={previewOrder}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}
