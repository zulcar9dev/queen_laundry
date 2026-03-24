export enum ServiceType {
  CUCI = "CUCI",
  CUCI_SETRIKA = "CUCI_SETRIKA",
  SETRIKA = "SETRIKA",
  DRY_CLEAN = "DRY_CLEAN",
}

export enum OrderStatus {
  TIMBANG_MASUK = "TIMBANG_MASUK",
  CUCI = "CUCI",
  SETRIKA = "SETRIKA",
  PACKING = "PACKING",
  SELESAI = "SELESAI",
}

export enum ClothingType {
  KAOS = "KAOS",
  CELANA = "CELANA",
  DRESS = "DRESS",
  JAKET = "JAKET",
  SELIMUT = "SELIMUT",
  HANDUK = "HANDUK",
  LAINNYA = "LAINNYA",
}

export enum DominantColor {
  PUTIH = "PUTIH",
  HITAM = "HITAM",
  WARNA_GELAP = "WARNA_GELAP",
  WARNA_TERANG = "WARNA_TERANG",
  BERWARNA = "BERWARNA",
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  clothingType: ClothingType;
  quantity: number;
  notes?: string;
  color: DominantColor;
}

export interface StatusLog {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerWhatsapp: string;
  serviceType: ServiceType;
  items: OrderItem[];
  totalWeight: number;
  totalPcs: number;
  status: OrderStatus;
  statusLogs: StatusLog[];
  rackId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rack {
  id: string;
  row: number;
  col: number;
  orderId?: string;
  isEmpty: boolean;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.TIMBANG_MASUK]: "Timbang Masuk",
  [OrderStatus.CUCI]: "Cuci",
  [OrderStatus.SETRIKA]: "Setrika",
  [OrderStatus.PACKING]: "Packing",
  [OrderStatus.SELESAI]: "Selesai",
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  [ServiceType.CUCI]: "Cuci",
  [ServiceType.CUCI_SETRIKA]: "Cuci + Setrika",
  [ServiceType.SETRIKA]: "Setrika",
  [ServiceType.DRY_CLEAN]: "Dry Clean",
};

export const CLOTHING_LABELS: Record<ClothingType, string> = {
  [ClothingType.KAOS]: "Kaos",
  [ClothingType.CELANA]: "Celana",
  [ClothingType.DRESS]: "Dress",
  [ClothingType.JAKET]: "Jaket",
  [ClothingType.SELIMUT]: "Selimut",
  [ClothingType.HANDUK]: "Handuk",
  [ClothingType.LAINNYA]: "Lainnya",
};

export const COLOR_LABELS: Record<DominantColor, string> = {
  [DominantColor.PUTIH]: "Putih",
  [DominantColor.HITAM]: "Hitam",
  [DominantColor.WARNA_GELAP]: "Warna Gelap",
  [DominantColor.WARNA_TERANG]: "Warna Terang",
  [DominantColor.BERWARNA]: "Berwarna",
};
