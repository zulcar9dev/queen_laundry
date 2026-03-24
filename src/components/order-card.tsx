"use client";

import { Order, STATUS_LABELS, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.TIMBANG_MASUK]: "bg-blue-100 text-blue-700 border-blue-200",
  [OrderStatus.CUCI]: "bg-cyan-100 text-cyan-700 border-cyan-200",
  [OrderStatus.SETRIKA]: "bg-orange-100 text-orange-700 border-orange-200",
  [OrderStatus.PACKING]: "bg-purple-100 text-purple-700 border-purple-200",
  [OrderStatus.SELESAI]: "bg-green-100 text-green-700 border-green-200",
};

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  showStatusButton?: boolean;
  nextStatus?: OrderStatus;
  onCardClick?: (order: Order) => void;
}

export function OrderCard({
  order,
  onStatusChange,
  showStatusButton = true,
  nextStatus,
  onCardClick,
}: OrderCardProps) {
  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-ambient border-none overflow-hidden hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
      onClick={() => onCardClick?.(order)}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-[#171c1f] leading-tight">{order.customerName}</p>
              <p className="text-[10px] font-mono text-muted-foreground font-bold mt-0.5 uppercase tracking-tighter">
                {order.orderNumber}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full border-none font-black text-[9px] uppercase tracking-widest", statusColors[order.status])}>
            {STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#171c1f]">
              {order.totalWeight} <span className="text-muted-foreground font-medium">kg</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
               {order.totalPcs} Pcs
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground bg-gray-50 px-2 py-1 rounded-lg">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{getRelativeTime(order.createdAt)}</span>
          </div>
        </div>

        {showStatusButton && nextStatus && onStatusChange && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, nextStatus);
            }}
            className="w-full mt-2 h-12 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-[#171c1f]"
          >
            Move to {STATUS_LABELS[nextStatus]} <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}
