import { useCallback, useEffect, useState } from 'react';

const getOrdersKey = (email) => `kk_orders_${(email ?? 'guest').toLowerCase()}`;

const readLocalOrders = (email) => {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(getOrdersKey(email));
    if (raw) return JSON.parse(raw);
    
    // If there is no data, return an empty array. No more mock data!
    return [];
  } catch {
    return [];
  }
};

const writeLocalOrders = (email, orders) => {
  if (!email) return;
  try {
    localStorage.setItem(getOrdersKey(email), JSON.stringify(orders));
  } catch {
    /* private mode */
  }
};

export function useUserOrders(userEmail) {
  const [orders, setOrders] = useState(() => readLocalOrders(userEmail));

  useEffect(() => {
    setOrders(readLocalOrders(userEmail));
  }, [userEmail]);

  const appendOrder = useCallback((order) => {
    if (!order) return;
    setOrders((prev) => {
      const next = [order, ...prev];
      writeLocalOrders(userEmail, next);
      return next;
    });
  }, [userEmail]);

  const deleteOrder = useCallback((orderToDelete) => {
    if (!orderToDelete) return;
    setOrders((prev) => {
      const next = prev.filter((o) => 
        (o.orderId || o.id) !== (orderToDelete.orderId || orderToDelete.id)
      );
      writeLocalOrders(userEmail, next);
      return next;
    });
  }, [userEmail]);

  const totalSpent = orders.reduce((sum, o) => {
    const amount = o?.totalNaira ?? o?.total;
    return sum + (typeof amount === 'number' ? amount : 0);
  }, 0);

  return { orders, appendOrder, deleteOrder, totalSpent };
}