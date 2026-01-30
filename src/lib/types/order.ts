import { OrderStatus, OrderPaymentStatus } from "../enums/order.enum";
import { Product } from "./product";

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: string;
  orderId?: string;
}

export interface Order {
  _id: string;
  memberId: string;
  orderStatus: OrderStatus;
  orderPaymentStatus: OrderPaymentStatus;
  orderShippingAddress: Record<string, any>;
  orderTotal: number;
  orderDelivery: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // from aggregations
  orderItems?: OrderItem[];
  productData?: Product[];
}

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  itemQuantity: number;
  itemPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
  orderPaymentStatus?: OrderPaymentStatus;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus?: OrderStatus;
  orderPaymentStatus?: OrderPaymentStatus;
}
