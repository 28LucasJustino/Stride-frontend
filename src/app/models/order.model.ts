export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface CheckoutItem {
  productId: string;
  quantity: number;
  shoeSize?: number;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  imageUrl: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  lowStockProducts: number;
}

