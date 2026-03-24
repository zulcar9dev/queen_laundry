"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, CLOTHING_LABELS, STATUS_LABELS, COLOR_LABELS, OrderStatus } from "@/lib/types";
import { 
  X, 
  User, 
  Phone, 
  Package, 
  Scale, 
  Clock, 
  FileText, 
  Printer, 
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Using the correct Dialog components from shadcn/ui
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface OrderPreviewModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderPreviewModal({ order, open, onOpenChange }: OrderPreviewModalProps) {
  if (!order) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.TIMBANG_MASUK: return "bg-blue-100 text-blue-700";
      case OrderStatus.CUCI: return "bg-cyan-100 text-cyan-700";
      case OrderStatus.SETRIKA: return "bg-orange-100 text-orange-700";
      case OrderStatus.PACKING: return "bg-purple-100 text-purple-700";
      case OrderStatus.SELESAI: return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-[#f6fafe]">
        <div className="relative">
          {/* Top Header Section */}
          <div className="bg-white px-8 pt-10 pb-6 rounded-b-[2.5rem] shadow-sm relative z-10">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute top-6 right-6 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shadow-sm border border-blue-100">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#171c1f] leading-none mb-1">{order.customerName}</h3>
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">{order.orderNumber}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className={cn("px-3 py-1 rounded-full border-none font-black text-[10px] uppercase tracking-widest", getStatusColor(order.status))}>
                {STATUS_LABELS[order.status]}
              </Badge>
              <a 
                href={`https://wa.me/${order.customerWhatsapp.replace(/\D/g, '')}`} 
                target="_blank" 
                className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 active:scale-95 transition-transform"
              >
                <Phone className="h-3 w-3" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Body content */}
          <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-2xl shadow-ambient border border-white/50 space-y-1">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Scale className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Weight</span>
                </div>
                <p className="text-xl font-black">{order.totalWeight} <span className="text-sm text-muted-foreground">kg</span></p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-ambient border border-white/50 space-y-1">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimation</span>
                </div>
                <p className="text-sm font-bold">Today, 18:00</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-black uppercase tracking-widest text-[#171c1f]">Laundry Items</h4>
              </div>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 flex items-center justify-between group shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#171c1f] group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#171c1f] leading-none mb-1">{CLOTHING_LABELS[item.clothingType]}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase">{COLOR_LABELS[item.color]}</p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-primary">×{item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            {order.notes && (
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Special Instruction</p>
                <p className="text-sm font-medium text-amber-900/80 italic">"{order.notes}"</p>
              </div>
            )}
            
            {/* Status Timeline */}
            <div className="pt-4 border-t border-gray-100">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order History</p>
                  <CheckCircle2 className={cn("h-4 w-4", order.status === OrderStatus.SELESAI ? "text-green-500" : "text-gray-300")} />
               </div>
               <div className="flex gap-2">
                  {[
                    OrderStatus.TIMBANG_MASUK,
                    OrderStatus.CUCI,
                    OrderStatus.SETRIKA,
                    OrderStatus.PACKING,
                    OrderStatus.SELESAI
                  ].map((status, idx) => {
                    const statusOrder = [
                      OrderStatus.TIMBANG_MASUK,
                      OrderStatus.CUCI,
                      OrderStatus.SETRIKA,
                      OrderStatus.PACKING,
                      OrderStatus.SELESAI
                    ];
                    const currentIndex = statusOrder.indexOf(order.status);
                    const isActive = idx <= currentIndex;
                    
                    return (
                      <div key={status} className={cn(
                        "flex-1 h-1.5 rounded-full transition-all duration-500",
                        isActive ? "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-gray-200"
                      )} />
                    );
                  })}
               </div>
               <div className="flex justify-between mt-2">
                  <p className="text-[8px] font-bold text-primary uppercase tracking-tighter">Masuk</p>
                  <p className={cn("text-[8px] font-bold uppercase tracking-tighter", order.status === OrderStatus.SELESAI ? "text-primary" : "text-muted-foreground")}>Selesai</p>
               </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-white border-t border-gray-50 flex gap-3 z-10">
            <Button 
              variant="outline" 
              className="flex-1 h-14 rounded-2xl border-gray-100 font-bold active:scale-95 transition-all text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button 
              className="flex-1 h-14 rounded-2xl bg-[#171c1f] hover:bg-[#252b2f] text-white font-bold shadow-xl active:scale-95 transition-all gap-2"
            >
              <Printer className="h-5 w-5" /> Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
