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
import { Search, Archive, User, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.TIMBANG_MASUK:
      return "bg-blue-500";
    case OrderStatus.CUCI:
      return "bg-yellow-500";
    case OrderStatus.SETRIKA:
      return "bg-purple-500";
    case OrderStatus.PACKING:
      return "bg-orange-500";
    case OrderStatus.SELESAI:
      return "bg-green-500";
    default:
      return "bg-gray-500";
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

  const gridCols = Math.ceil(Math.sqrt(racks.length));
  const rows = Math.ceil(racks.length / gridCols);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Manajemen Rak
          </h1>
        </div>
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              <p className="text-xs text-muted-foreground">Terisi</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.empty}</p>
              <p className="text-xs text-muted-foreground">Kosong</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pelanggan..."
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {Array.from({ length: rows * gridCols }).map((_, index) => {
            const rack = filteredRacks[index];
            if (!rack) return <div key={index} />;

            const order = getRackOrder(rack);
            const isEmpty = rack.isEmpty;
            const isHighlighted = searchQuery && order;

            return (
              <button
                key={rack.id}
                onClick={() => !isEmpty && setSelectedRack(rack)}
                className={cn(
                  "aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all touch-target-md",
                  isEmpty
                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                    : "border-gray-200 bg-white shadow-sm",
                  isHighlighted && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <span className="text-lg font-bold">
                  {String.fromCharCode(65 + rack.row)}
                  {rack.col + 1}
                </span>
                {!isEmpty && order && (
                  <div
                    className={cn("w-3 h-3 rounded-full mt-1", getStatusColor(order.status))}
                  />
                )}
                {isEmpty && (
                  <span className="text-xs text-green-600 mt-1">Kosong</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedRack} onOpenChange={() => setSelectedRack(null)}>
        <DialogContent>
          {selectedRack && (() => {
            const order = getRackOrder(selectedRack);
            if (!order) return null;

            return (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Rak {String.fromCharCode(65 + selectedRack.row)}
                    {selectedRack.col + 1}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getStatusColor(order.status)
                      )}
                    />
                    <Badge variant="secondary">
                      {STATUS_LABELS[order.status]}
                    </Badge>
                    <span className="font-mono text-sm ml-auto">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.totalWeight} kg · {order.totalPcs} pcs
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRack(null)}
                  >
                    Tutup
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleMarkTaken}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Tandai Diambil
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
