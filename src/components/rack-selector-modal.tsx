"use client";

import { useState } from "react";
import { useRacks, useOrders } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rack, OrderStatus, STATUS_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface RackSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSelect: (rackId: string) => void;
}

export function RackSelectorModal({
  open,
  onOpenChange,
  orderId,
  onSelect,
}: RackSelectorModalProps) {
  const { racks } = useRacks();
  const { orders } = useOrders();

  const getRackOrder = (rack: Rack) => {
    if (!rack.orderId) return null;
    return orders.find((o) => o.id === rack.orderId);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Rak</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2 p-4">
          {racks.map((rack) => {
            const order = getRackOrder(rack);
            const isEmpty = rack.isEmpty;
            const isSelected = false;

            return (
              <button
                key={rack.id}
                onClick={() => isEmpty && onSelect(rack.id)}
                disabled={!isEmpty}
                className={cn(
                  "aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-1 transition-all",
                  isEmpty
                    ? "border-green-300 bg-green-50 hover:border-green-500 hover:bg-green-100 cursor-pointer"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60",
                  isSelected && "border-primary ring-2 ring-primary"
                )}
              >
                <span className="text-lg font-bold">
                  {String.fromCharCode(65 + rack.row)}
                  {rack.col + 1}
                </span>
                {!isEmpty && order && (
                  <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: getStatusColor(order.status).replace("bg-", "") === "gray-500" ? "#9ca3af" : undefined }} />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-300" />
            <span>Kosong</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-200" />
            <span>Terisi</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
