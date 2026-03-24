"use client";

import {
  Order,
  Customer,
  Rack,
  OrderStatus,
  StatusLog,
  OrderItem,
  ServiceType,
  ClothingType,
  DominantColor,
} from "./types";

const STORAGE_KEYS = {
  TENANT_ID: "ql_tenant_id",
  CUSTOMERS: "ql_customers",
  ORDERS: "ql_orders",
  RACKS: "ql_racks",
};

function getTenantId(): string {
  if (typeof window === "undefined") return "default";
  
  let tenantId = localStorage.getItem(STORAGE_KEYS.TENANT_ID);
  if (!tenantId) {
    tenantId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.TENANT_ID, tenantId);
  }
  return tenantId;
}

function getStorageKey(base: string): string {
  return `${base}_${getTenantId()}`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateStr = `${yy}${mm}${dd}`;
  
  const orders = getOrders();
  const todayOrders = orders.filter((o) => o.orderNumber.startsWith(`QL-${dateStr}`));
  const seq = String(todayOrders.length + 1).padStart(3, "0");
  
  return `QL-${dateStr}-${seq}`;
}

export function getCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(getStorageKey(STORAGE_KEYS.CUSTOMERS));
  return data ? JSON.parse(data) : [];
}

export function saveCustomer(customer: Customer): void {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem(getStorageKey(STORAGE_KEYS.CUSTOMERS), JSON.stringify(customers));
}

export function searchCustomers(query: string): Customer[] {
  const customers = getCustomers();
  const lowerQuery = query.toLowerCase();
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.whatsapp.includes(query)
  );
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(getStorageKey(STORAGE_KEYS.ORDERS));
  return data ? JSON.parse(data) : [];
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.push(order);
  }
  localStorage.setItem(getStorageKey(STORAGE_KEYS.ORDERS), JSON.stringify(orders));
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Order | null {
  const orders = getOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex < 0) return null;

  const order = orders[orderIndex];
  const statusLog: StatusLog = {
    id: crypto.randomUUID(),
    orderId,
    status: newStatus,
    timestamp: new Date().toISOString(),
    notes,
  };

  order.status = newStatus;
  order.statusLogs.push(statusLog);
  order.updatedAt = new Date().toISOString();

  orders[orderIndex] = order;
  localStorage.setItem(getStorageKey(STORAGE_KEYS.ORDERS), JSON.stringify(orders));
  
  return order;
}

export function createOrder(data: {
  customerName: string;
  customerWhatsapp: string;
  serviceType: ServiceType;
  items: Array<{
    clothingType: ClothingType;
    quantity: number;
    color: DominantColor;
    notes?: string;
  }>;
  totalWeight: number;
  notes?: string;
}): Order {
  const customerId = crypto.randomUUID();
  const orderId = crypto.randomUUID();
  
  const customer: Customer = {
    id: customerId,
    name: data.customerName,
    whatsapp: data.customerWhatsapp,
    createdAt: new Date().toISOString(),
  };
  saveCustomer(customer);

  const now = new Date().toISOString();
  const order: Order = {
    id: orderId,
    orderNumber: generateOrderNumber(),
    customerId,
    customerName: data.customerName,
    customerWhatsapp: data.customerWhatsapp,
    serviceType: data.serviceType,
    items: data.items.map((item) => ({
      id: crypto.randomUUID(),
      clothingType: item.clothingType,
      quantity: item.quantity,
      color: item.color,
      notes: item.notes,
    })),
    totalWeight: data.totalWeight,
    totalPcs: data.items.reduce((sum, item) => sum + item.quantity, 0),
    status: OrderStatus.TIMBANG_MASUK,
    statusLogs: [
      {
        id: crypto.randomUUID(),
        orderId,
        status: OrderStatus.TIMBANG_MASUK,
        timestamp: now,
      },
    ],
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };

  saveOrder(order);
  return order;
}

export function getRacks(): Rack[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(getStorageKey(STORAGE_KEYS.RACKS));
  if (data) return JSON.parse(data);
  
  const defaultRacks: Rack[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      defaultRacks.push({
        id: crypto.randomUUID(),
        row,
        col,
        isEmpty: true,
      });
    }
  }
  saveRacks(defaultRacks);
  return defaultRacks;
}

export function saveRacks(racks: Rack[]): void {
  localStorage.setItem(getStorageKey(STORAGE_KEYS.RACKS), JSON.stringify(racks));
}

export function getRackById(id: string): Rack | undefined {
  return getRacks().find((r) => r.id === id);
}

export function assignOrderToRack(orderId: string, rackId: string): Rack | null {
  const racks = getRacks();
  const rackIndex = racks.findIndex((r) => r.id === rackId);
  if (rackIndex < 0) return null;

  const prevRackIndex = racks.findIndex((r) => r.orderId === orderId);
  if (prevRackIndex >= 0) {
    racks[prevRackIndex] = { ...racks[prevRackIndex], isEmpty: true, orderId: undefined };
  }

  racks[rackIndex] = { ...racks[rackIndex], isEmpty: false, orderId };
  saveRacks(racks);
  
  return racks[rackIndex];
}

export function releaseRack(rackId: string): Rack | null {
  const racks = getRacks();
  const rackIndex = racks.findIndex((r) => r.id === rackId);
  if (rackIndex < 0) return null;

  racks[rackIndex] = { ...racks[rackIndex], isEmpty: true, orderId: undefined };
  saveRacks(racks);
  
  return racks[rackIndex];
}

export function getOrderStats(): { totalOrders: number; totalKg: number; pending: number } {
  const orders = getOrders();
  const today = new Date().toISOString().split("T")[0];
  
  return {
    totalOrders: orders.length,
    totalKg: orders.reduce((sum, o) => sum + o.totalWeight, 0),
    pending: orders.filter(
      (o) => o.status !== OrderStatus.SELESAI && o.createdAt.startsWith(today)
    ).length,
  };
}
