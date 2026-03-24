"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOrders,
  getCustomers,
  getRacks,
  getOrderStats,
  createOrder as storeCreateOrder,
  updateOrderStatus,
  assignOrderToRack,
  releaseRack,
} from "@/lib/store";
import {
  Order,
  Customer,
  Rack,
  OrderStatus,
  ServiceType,
  ClothingType,
  DominantColor,
} from "@/lib/types";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const handleStorageChange = () => {
      const event = new CustomEvent("localStorageUpdated");
      window.dispatchEvent(event);
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleStorageChange);
    };
  }, []);

  const triggerUpdate = useCallback(() => {
    setStoredValue((prev) => ({ ...prev }));
  }, []);

  useEffect(() => {
    const handleUpdate = () => triggerUpdate();
    window.addEventListener("localStorageUpdated", handleUpdate);
    return () => window.removeEventListener("localStorageUpdated", handleUpdate);
  }, [triggerUpdate]);

  return [storedValue, triggerUpdate] as const;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = () => setOrders(getOrders());
    loadOrders();
    
    window.addEventListener("localStorageUpdated", loadOrders);
    return () => window.removeEventListener("localStorageUpdated", loadOrders);
  }, []);

  const createOrder = useCallback(
    (data: {
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
    }) => {
      const order = storeCreateOrder(data);
      window.dispatchEvent(new CustomEvent("localStorageUpdated"));
      return order;
    },
    []
  );

  const updateStatus = useCallback(
    (orderId: string, status: OrderStatus, notes?: string) => {
      const order = updateOrderStatus(orderId, status, notes);
      window.dispatchEvent(new CustomEvent("localStorageUpdated"));
      return order;
    },
    []
  );

  return { orders, createOrder, updateStatus };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = () => setCustomers(getCustomers());
    loadCustomers();
    
    window.addEventListener("localStorageUpdated", loadCustomers);
    return () => window.removeEventListener("localStorageUpdated", loadCustomers);
  }, []);

  return customers;
}

export function useRacks() {
  const [racks, setRacks] = useState<Rack[]>([]);

  useEffect(() => {
    const loadRacks = () => setRacks(getRacks());
    loadRacks();
    
    window.addEventListener("localStorageUpdated", loadRacks);
    return () => window.removeEventListener("localStorageUpdated", loadRacks);
  }, []);

  const assignToRack = useCallback((orderId: string, rackId: string) => {
    const rack = assignOrderToRack(orderId, rackId);
    window.dispatchEvent(new CustomEvent("localStorageUpdated"));
    return rack;
  }, []);

  const release = useCallback((rackId: string) => {
    const rack = releaseRack(rackId);
    window.dispatchEvent(new CustomEvent("localStorageUpdated"));
    return rack;
  }, []);

  return { racks, assignToRack, release };
}

export function useStats() {
  const [stats, setStats] = useState({ totalOrders: 0, totalKg: 0, pending: 0 });

  useEffect(() => {
    const loadStats = () => setStats(getOrderStats());
    loadStats();
    
    window.addEventListener("localStorageUpdated", loadStats);
    return () => window.removeEventListener("localStorageUpdated", loadStats);
  }, []);

  return stats;
}
