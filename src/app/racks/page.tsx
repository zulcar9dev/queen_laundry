"use client";

import { useState, useMemo } from "react";
import { useOrders, useRacks } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Rack, OrderStatus, STATUS_LABELS } from "@/lib/types";
import { Search, Archive, User, Package, History, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const getStatusColor = (status: OrderStatus) => {
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

export default function RacksPage() {
  const { orders, updateStatus } = useOrders();
  const { racks, release } = useRacks();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);

  const getRackOrder = (rack: Rack) => {
    if (!rack.orderId) return null;
    return orders.find((o) => o.id === rack.orderId);
  };

  const filteredRacks = useMemo(() => {
    if (!searchQuery) return racks;

    const query = searchQuery.toLowerCase();
    return racks.filter((rack) => {
      const order = getRackOrder(rack);
      if (!order) return false;
      return (
        order.customerName.toLowerCase().includes(query) ||
        order.orderNumber.toLowerCase().includes(query)
      );
    });
  }, [racks, searchQuery, orders]);

  const stats = useMemo(() => {
    const occupied = racks.filter((r) => !r.isEmpty).length;
    return {
      total: racks.length,
      occupied,
      empty: racks.length - occupied,
    };
  }, [racks]);

  const handleMarkTaken = () => {
    if (selectedRack && selectedRack.orderId) {
      updateStatus(selectedRack.orderId, OrderStatus.SELESAI);
      release(selectedRack.id);
      setSelectedRack(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#171c1f] uppercase tracking-tight flex items-center gap-2">
              <Archive className="h-6 w-6" />
              Storage Management
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Track and manage rack availability</p>
          </div>
          
          <div className="flex bg-[#f1f5f9] p-1 rounded-xl md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center px-4 py-2 border-r border-gray-200">
               <span className="text-xl font-black text-[#171c1f] leading-none">{stats.total}</span>
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Total</span>
            </div>
            <div className="flex items-center px-4 py-2 border-r border-gray-200">
               <span className="text-xl font-black text-blue-600 leading-none">{stats.empty}</span>
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Free</span>
            </div>
            <div className="flex items-center px-4 py-2">
               <span className="text-xl font-black text-purple-600 leading-none">{stats.occupied}</span>
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Used</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-[#171c1f]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or order ID..."
            className="pl-12 h-14 bg-white border-none shadow-ambient rounded-2xl text-base font-medium transition-all focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Grid Content */}
      <main className="px-6 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {racks.map((rack) => {
            const order = getRackOrder(rack);
            const isEmpty = rack.isEmpty;
            const isHighlighted = searchQuery && order && (
              order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <button
                key={rack.id}
                onClick={() => !isEmpty && setSelectedRack(rack)}
                className={cn(
                  "aspect-square rounded-3xl border-none flex flex-col items-center justify-center p-2 transition-all active:scale-95 shadow-ambient",
                  isEmpty
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-[#171c1f] text-white shadow-lg",
                  isHighlighted && "ring-4 ring-blue-400 ring-offset-4 scale-105 z-10"
                )}
              >
                <span className="text-2xl font-black uppercase leading-none">
                  {String.fromCharCode(65 + rack.row)}
                  {rack.col + 1}
                </span>
                {!isEmpty && order && (
                  <div className={cn("w-2.5 h-2.5 rounded-full mt-2 shadow-sm animate-pulse", getStatusColor(order.status))} />
                )}
                {isEmpty && (
                  <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-50">Empty</span>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRack} onOpenChange={() => setSelectedRack(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
          {selectedRack && (() => {
            const order = getRackOrder(selectedRack);
            if (!order) return null;

            return (
              <>
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-14 w-14 rounded-2xl bg-[#171c1f] text-white flex items-center justify-center text-2xl font-black uppercase">
                       {String.fromCharCode(65 + selectedRack.row)}{selectedRack.col + 1}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-black text-[#171c1f] uppercase tracking-tight">Rack Details</DialogTitle>
                      <Badge variant="outline" className={cn("border-none px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mt-1", 
                        order.status === OrderStatus.PACKING ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700")}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="p-5 bg-[#f8fafc] rounded-3xl space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                          <User className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Customer</p>
                          <p className="font-bold text-lg text-[#171c1f] leading-tight">{order.customerName}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                          <Package className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order Summary</p>
                          <p className="font-bold text-[#171c1f] leading-tight">
                             {order.totalWeight} kg · {order.totalPcs} pcs
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="success"
                      onClick={handleMarkTaken}
                      className="h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 bg-green-600 hover:bg-green-700 transition-all"
                    >
                      Release & Mark Done
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedRack(null)}
                      className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
