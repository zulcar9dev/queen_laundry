"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useOrders, useCustomers } from "@/hooks/useStore";
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
  const customers = useCustomers();

  const [step, setStep] = useState<Step>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [suggestions, setSuggestions] = useState<typeof customers>([]);
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

  const selectSuggestion = (customer: typeof customers[0]) => {
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-600">Order Tersimpan!</h2>
            <p className="text-lg mt-2">No. Order: <span className="font-mono font-bold">{newOrderNumber}</span></p>
          </div>
          <Button size="lg" onClick={() => router.push("/")} className="w-full max-w-xs">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-semibold">Order Baru</h1>
          <div className="w-10" />
        </div>
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= s ? "bg-primary text-primary-foreground" : "bg-gray-200"
                  )}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={cn("flex-1 h-1", step > s ? "bg-primary" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Pelanggan</span>
            <span>Layanan</span>
            <span>Review</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="name">Nama Pelanggan</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masukkan nama"
                  className="mt-1"
                />
                {showSuggestions && (
                  <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {suggestions.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => selectSuggestion(c)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span>{c.name}</span>
                        <span className="text-sm text-muted-foreground">{c.whatsapp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="whatsapp">No. WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detail Layanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Jenis Layanan</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setServiceType(key as ServiceType)}
                      className={cn(
                        "p-3 rounded-lg border text-sm font-medium transition-colors touch-target-md",
                        serviceType === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Berat (Kg)
                </Label>
                <div className="flex items-center gap-3 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWeight(Math.max(0.1, weight - 0.5))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="text-center text-lg font-semibold w-24"
                    step="0.1"
                    min="0.1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWeight(weight + 0.5)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-muted-foreground">kg</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Item Pakaian</Label>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" /> Tambah
                  </Button>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Item {index + 1}</span>
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={item.clothingType}
                          onChange={(e) =>
                            updateItem(index, "clothingType", e.target.value as ClothingType)
                          }
                          className="border rounded-md px-2 py-2 text-sm"
                        >
                          {Object.entries(CLOTHING_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1 border rounded-md px-2">
                          <button
                            onClick={() =>
                              updateItem(index, "quantity", Math.max(1, item.quantity - 1))
                            }
                            className="p-1"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex-1 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(index, "quantity", item.quantity + 1)}
                            className="p-1"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <select
                          value={item.color}
                          onChange={(e) =>
                            updateItem(index, "color", e.target.value as DominantColor)
                          }
                          className="border rounded-md px-2 py-2 text-sm"
                        >
                          {Object.entries(COLOR_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Catatan (opsional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan khusus..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Pelanggan</span>
                  <p className="font-medium">{customerName}</p>
                  <p className="text-muted-foreground">{customerWhatsapp}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Layanan</span>
                  <p className="font-medium">{SERVICE_LABELS[serviceType]}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Berat</span>
                  <p className="font-medium">{weight} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Item</span>
                  <p className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                  </p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Item:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {items.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {CLOTHING_LABELS[item.clothingType]} {item.quantity}x
                    </Badge>
                  ))}
                </div>
              </div>
              {notes && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Catatan:</span>
                  <p>{notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-lg mx-auto p-4 flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
              Lanjut <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()} className="flex-1">
              <Check className="h-4 w-4 mr-1" /> SIMPAN ORDER
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
