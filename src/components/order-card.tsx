"use client";

import { Order, STATUS_LABELS, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<OrderStatus, { bg: string; border: string; badge: string; dot: string }> = {
  [OrderStatus.TIMBANG_MASUK]: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  [OrderStatus.CUCI]: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
  [OrderStatus.SETRIKA]: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  [OrderStatus.PACKING]: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
  [OrderStatus.SELESAI]: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800", dot: "bg-green-500" },
};

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  showStatusButton?: boolean;
  nextStatus?: OrderStatus;
}

export function OrderCard({
  order,
  onStatusChange,
  showStatusButton = true,
  nextStatus,
}: OrderCardProps) {
  const colors = statusColors[order.status];

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}j ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border-2 p-3 shadow-sm",
        colors.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", colors.dot)} />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{order.customerName}</p>
            <p className="text-xs font-mono text-gray-500">
              {order.orderNumber}
            </p>
          </div>
        </div>
        <Badge className={cn("text-xs shrink-0", colors.badge)}>
          {STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">
          {order.totalWeight} kg · {order.totalPcs} pcs
        </span>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs">{getRelativeTime(order.createdAt)}</span>
        </div>
      </div>

      {showStatusButton && nextStatus && onStatusChange && (
        <button
          onClick={() => onStatusChange(order.id, nextStatus)}
          className={cn(
            "w-full mt-3 py-2.5 text-sm font-semibold rounded-md transition-colors",
            "bg-gray-900 text-white hover:bg-gray-800",
            "touch-target-md flex items-center justify-center gap-1"
          )}
        >
          Pindah ke {STATUS_LABELS[nextStatus]} →
        </button>
      )}
    </div>
  );
}
