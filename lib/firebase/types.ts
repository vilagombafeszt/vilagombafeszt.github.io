export interface ItemDistribution {
  name: string;
  value: number;
}

export interface TimelineDataPoint {
  time: string;
  sales: number;
  count: number;
}

export interface Stats {
  totalOrders: number;
  totalOrderCount: number;
  totalRevenue: number;
  mostOrdered: string;
  itemDistribution: ItemDistribution[];
  timelineData: TimelineDataPoint[];
}

export interface TicketCapacities {
  friday: number;
  saturday: number;
  sunday: number;
}

export type HybridOrderData = {
  orderList?: string[];
  orderCount?: number;
  totalPrice?: number;
  orders?: Record<string, { items: string[]; total: number; timestamp?: number }>;
};
