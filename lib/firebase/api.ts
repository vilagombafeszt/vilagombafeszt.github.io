import { ref, get, child, push, serverTimestamp, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { HybridOrderData, Stats } from './types';

export const EMPTY_STATS: Stats = {
  totalOrders: 0,
  totalOrderCount: 0,
  totalRevenue: 0,
  mostOrdered: 'N/A',
  itemDistribution: [],
  timelineData: [],
};

export function computeStats(data: Record<string, HybridOrderData>): Stats {
  let totalOrders = 0;
  let totalOrderCount = 0;
  let totalRevenue = 0;
  const itemCounts: Record<string, number> = {};
  const timelineMap: Record<string, { sales: number; count: number }> = {};

  for (const uid in data) {
    const userObject = data[uid];

    // 1. Process legacy schema (array-based)
    if (userObject.orderList && Array.isArray(userObject.orderList)) {
      totalOrders += userObject.orderList.length;
      totalOrderCount += userObject.orderCount || 1;
      totalRevenue += userObject.totalPrice || 0;

      userObject.orderList.forEach((item: string) => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    }

    // 2. Process new schema (push-based subcollection)
    if (userObject.orders && typeof userObject.orders === 'object') {
      Object.values(userObject.orders).forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          totalOrders += order.items.length;
          totalOrderCount += 1;
          totalRevenue += order.total || 0;

          order.items.forEach((item: string) => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
          });

          if (order.timestamp) {
            const date = new Date(order.timestamp);
            const hourStr = `${date.getHours().toString().padStart(2, '0')}:00`;
            if (!timelineMap[hourStr]) {
              timelineMap[hourStr] = { sales: 0, count: 0 };
            }
            timelineMap[hourStr].sales += order.total || 0;
            timelineMap[hourStr].count += 1;
          }
        }
      });
    }
  }

  const itemDistribution = Object.entries(itemCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const timelineData = Object.entries(timelineMap).map(([time, data]) => ({
    time,
    sales: data.sales,
    count: data.count,
  }));

  const mostOrdered =
    Object.keys(itemCounts).length > 0
      ? Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] > itemCounts[b] ? a : b))
      : 'N/A';

  return {
    totalOrders,
    totalOrderCount,
    totalRevenue,
    mostOrdered,
    itemDistribution,
    timelineData,
  };
}

export const fetchOrderStats = async (category: 'Ital' | 'Jegy'): Promise<Stats> => {
  if (!database) return EMPTY_STATS;
  const dbRef = ref(database);
  try {
    const snap = await get(child(dbRef, `Rendelések/${category}`));
    if (snap.exists()) {
      return computeStats(snap.val());
    }
  } catch (error) {
    console.error(`Error fetching ${category} stats:`, error);
  }
  return EMPTY_STATS;
};

export const saveOrder = async (
  category: 'Ital' | 'Jegy',
  uid: string,
  email: string | null,
  items: string[],
  prices: number[],
  total: number
): Promise<string | null> => {
  if (!database) return null;
  const ordersRef = ref(database, `Rendelések/${category}/${uid}/orders`);
  const newOrderRef = push(ordersRef, {
    email: email || 'ismeretlen',
    items,
    prices,
    total,
    timestamp: serverTimestamp(),
  });
  return newOrderRef.key;
};

export const undoOrder = async (
  category: 'Ital' | 'Jegy',
  uid: string,
  orderId: string
): Promise<void> => {
  if (!database) return;
  const orderRef = ref(database, `Rendelések/${category}/${uid}/orders/${orderId}`);
  await remove(orderRef);
};
