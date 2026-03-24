"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ServiceType,
  ClothingType,
  DominantColor,
  SERVICE_LABELS,
  CLOTHING_LABELS,
  COLOR_LABELS,
} from "@/lib/types";
import { useOrders } from "@/hooks/useStore";
import { searchCustomers } from "@/lib/store";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Package,
  Scale,
  Plus,
  Minus,
  X,
  Search,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface OrderItemInput {
  clothingType: ClothingType;
  quantity: number;
  color: DominantColor;
  notes: string;
}

export default function OrderPage() {
  const router = useRouter();
  const { createOrder } = useOrders();

  const [step, setStep] = useState<Step>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.CUCI);
  const [weight, setWeight] = useState(1);
  const [items, setItems] = useState<OrderItemInput[]>([
    { clothingType: ClothingType.KAOS, quantity: 1, color: DominantColor.BERWARNA, notes: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [newOrderNumber, setNewOrderNumber] = useState("");

  useEffect(() => {
    if (customerName.length >= 2) {
      const results = searchCustomers(customerName).slice(0, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [customerName]);

  const selectSuggestion = (customer: any) => {
    setCustomerName(customer.name);
    setCustomerWhatsapp(customer.whatsapp);
    setShowSuggestions(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      { clothingType: ClothingType.KAOS, quantity: 1, color: DominantColor.BERWARNA, notes: "" },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItemInput, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const canProceed = () => {
    if (step === 1) return customerName.trim().length > 0 && customerWhatsapp.trim().length > 0;
    if (step === 2) return weight > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    const order = createOrder({
      customerName: customerName.trim(),
      customerWhatsapp: customerWhatsapp.trim(),
      serviceType,
      items: items.map((item) => ({
        clothingType: item.clothingType,
        quantity: item.quantity,
        color: item.color,
        notes: item.notes || undefined,
      })),
      totalWeight: weight,
      notes: notes || undefined,
    });

    setNewOrderNumber(order.orderNumber);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f6fafe] flex flex-col items-center justify-center p-6 pb-24">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-green-100 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-green-500 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold font-manrope text-[#171c1f]">Order Success!</h2>
            <p className="text-muted-foreground font-medium">Order has been saved to the tracking system.</p>
          </div>
          
          <Card className="border-none shadow-ambient rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order Number</p>
                <p className="text-2xl font-mono font-black text-primary">{newOrderNumber}</p>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Customer</p>
                  <p className="font-bold text-sm truncate">{customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Weight</p>
                  <p className="font-bold text-sm">{weight} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="touch-lg" 
            onClick={() => router.push("/")} 
            className="w-full text-lg font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fafe] pb-28">
      <header className="px-6 pt-8 pb-4 bg-[#f6fafe] sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => step === 1 ? router.back() : handleBack()} 
            className="h-10 w-10 rounded-xl bg-white shadow-ambient flex items-center justify-center border border-white/50 active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-[#171c1f]" />
          </button>
          <h1 className="text-2xl font-extrabold font-manrope tracking-tight text-[#171c1f]">
            Create <span className="text-primary italic">Order</span>
          </h1>
        </div>

        {/* Multi-step indicator */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex flex-col gap-2">
              <div className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                step >= s ? "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-gray-200"
              )} />
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-wider text-center",
                step === s ? "text-primary" : "text-muted-foreground/60"
              )}>
                {s === 1 ? "Customer" : s === 2 ? "Service" : "Review"}
              </p>
            </div>
          ))}
        </div>
      </header>

      <main className="px-5">
        <div className="max-w-md mx-auto space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <Card className="border-none shadow-ambient rounded-3xl overflow-hidden overflow-visible">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#171c1f]">Customer Identity</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Step 01</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#171c1f] mb-2 block">Customer Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Type name..."
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 font-bold text-[#171c1f] focus-visible:ring-primary/20 focus-visible:border-primary"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      
                      {showSuggestions && (
                        <Card className="absolute z-30 w-full mt-2 border-none shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                          <CardContent className="p-1">
                            {suggestions.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => selectSuggestion(c)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between rounded-xl transition-colors group"
                              >
                                <div>
                                  <p className="font-bold text-[#171c1f]">{c.name}</p>
                                  <p className="text-xs text-muted-foreground font-medium">{c.whatsapp}</p>
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                </div>
                              </button>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-widest text-[#171c1f] mb-2 block">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        value={customerWhatsapp}
                        onChange={(e) => setCustomerWhatsapp(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        type="tel"
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-[#171c1f] focus-visible:ring-primary/20 focus-visible:border-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <Card className="border-none shadow-ambient rounded-3xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#171c1f]">Laundry Service</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Step 02</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-widest text-[#171c1f] mb-3 block">Service Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => setServiceType(key as ServiceType)}
                            className={cn(
                              "h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98]",
                              serviceType === key
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-gray-50 bg-gray-50 text-muted-foreground"
                            )}
                          >
                            <span className="text-sm font-bold">{label}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                              {key === ServiceType.CUCI ? "Rp 7.000/kg" : "Unit Selection"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-bold uppercase tracking-widest text-[#171c1f] mb-3 block">Weight Calculation</Label>
                      <div className="h-20 rounded-2xl bg-gray-50/50 border border-gray-100 flex items-center justify-between px-2">
                        <button
                          onClick={() => setWeight(Math.max(0.1, weight - 0.5))}
                          className="h-16 w-16 rounded-xl bg-white shadow-ambient flex items-center justify-center text-red-500 active:scale-95 transition-transform border border-gray-100"
                        >
                          <Minus className="h-6 w-6" strokeWidth={3}/>
                        </button>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={weight}
                            step="0.1"
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                            className="w-20 text-center text-2xl font-black text-[#171c1f] bg-transparent border-none focus:ring-0 p-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-sm text-muted-foreground font-bold">kg</span>
                        </div>
                        <button
                          onClick={() => setWeight(weight + 0.5)}
                          className="h-16 w-16 rounded-xl bg-white shadow-ambient flex items-center justify-center text-primary active:scale-95 transition-transform border border-gray-100"
                        >
                          <Plus className="h-6 w-6" strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-[#171c1f]">Items Checklist</Label>
                        <button 
                          onClick={addItem}
                          className="text-[10px] font-bold uppercase tracking-widest text-primary bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 active:scale-90 transition-transform"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Item
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {items.map((item, index) => (
                          <div key={index} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3 relative group">
                            {items.length > 1 && (
                              <button
                                onClick={() => removeItem(index)}
                                className="absolute -top-2 -right-2 h-7 w-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                              >
                                <X className="h-4 w-4" strokeWidth={3} />
                              </button>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-black px-1">Type</p>
                                <div className="relative">
                                  <select
                                    value={item.clothingType}
                                    onChange={(e) => updateItem(index, "clothingType", e.target.value as ClothingType)}
                                    className="w-full h-10 px-4 bg-white rounded-xl border border-gray-100 shadow-sm font-bold text-sm text-[#171c1f] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none outline-none pr-10"
                                  >
                                    {Object.entries(CLOTHING_LABELS).map(([key, label]) => (
                                      <option key={key} value={key}>{label}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-black px-1">Quantity</p>
                                <div className="flex items-center gap-2 h-10 px-1">
                                  <button 
                                    onClick={() => updateItem(index, "quantity", Math.max(1, item.quantity - 1))} 
                                    className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#171c1f] active:scale-95 transition-transform"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <input 
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                                    className="w-10 text-center font-bold text-base bg-transparent border-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <button 
                                    onClick={() => updateItem(index, "quantity", item.quantity + 1)} 
                                    className="h-8 w-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center active:scale-95 transition-transform"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground uppercase font-black">Color Group</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(COLOR_LABELS).map(([key, label]) => (
                                  <button
                                    key={key}
                                    onClick={() => updateItem(index, "color", key as DominantColor)}
                                    className={cn(
                                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all",
                                      item.color === key 
                                        ? "bg-primary text-white" 
                                        : "bg-white text-muted-foreground border border-gray-200"
                                    )}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="pb-6">
                <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-[#171c1f] mb-2 block">Special Instruction (Optional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Example: Wash with cold water only..."
                  rows={2}
                  className="w-full rounded-2xl border-gray-100 bg-white shadow-ambient p-4 font-medium text-sm text-[#171c1f] focus:ring-primary focus:border-primary placeholder:text-muted-foreground/50 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <Card className="border-none shadow-ambient rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-blue-700 text-white">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/20">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Review Final</p>
                      <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Verification Step</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/50 uppercase font-black">Customer</p>
                          <p className="text-xl font-bold">{customerName}</p>
                          <p className="text-xs font-medium text-white/70">{customerWhatsapp}</p>
                        </div>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/50 uppercase font-black">Service</p>
                          <p className="font-bold">{SERVICE_LABELS[serviceType]}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] text-white/50 uppercase font-black">Weight</p>
                          <p className="text-xl font-black">{weight.toFixed(1)} kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 space-y-3 text-[#171c1f]">
                       <p className="text-[10px] text-muted-foreground uppercase font-black">Laundry Content</p>
                       <div className="flex flex-wrap gap-2">
                        {items.map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                             <Badge variant="secondary" className="bg-blue-50 text-primary border-none font-bold">
                              {CLOTHING_LABELS[item.clothingType]} ×{item.quantity}
                            </Badge>
                          </div>
                        ))}
                       </div>
                       {notes && (
                         <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                            <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Notes</p>
                            <p className="text-sm font-medium">{notes}</p>
                         </div>
                       )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700">Estimated Finished</p>
                  <p className="text-[10px] text-amber-600/70 font-bold uppercase tracking-widest mt-0.5">Tomorrow (24h Express)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 glassmorphism border-t border-white/20 px-5 pt-4 pb-16 z-30">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="h-14 w-20 rounded-2xl border-white/50 bg-white/30 backdrop-blur-md shadow-ambient active:scale-95 transition-all p-0"
            >
              <ChevronLeft className="h-6 w-6 text-[#171c1f]" />
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()} 
              className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-blue-600"
            >
              Continue <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!canProceed()} 
              className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all bg-gradient-to-r from-emerald-500 to-green-600 border-none"
            >
              <Check className="h-5 w-5 mr-2" strokeWidth={3} /> SAVE ORDER
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

