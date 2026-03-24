"use client";

import { useRacks, useOrders } from "@/hooks/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rack, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-black text-[#171c1f] uppercase tracking-tight">Select Storage Rack</DialogTitle>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Assign order to a storage slot</p>
        </DialogHeader>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 py-2">
          {racks.map((rack) => {
            const order = getRackOrder(rack);
            const isEmpty = rack.isEmpty;

            return (
              <button
                key={rack.id}
                onClick={() => isEmpty && onSelect(rack.id)}
                disabled={!isEmpty}
                className={cn(
                  "aspect-square rounded-2xl border-none flex flex-col items-center justify-center p-2 transition-all active:scale-90",
                  isEmpty
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer shadow-sm"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                )}
              >
                <span className="text-lg font-black uppercase">
                  {String.fromCharCode(65 + rack.row)}
                  {rack.col + 1}
                </span>
                {!isEmpty && order && (
                  <div 
                    className={cn("w-2 h-2 rounded-full mt-1.5 shadow-sm", getStatusColor(order.status))} 
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
           <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#171c1f]">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Occupied</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
