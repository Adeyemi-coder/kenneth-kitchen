import React from 'react';
import OrderCard from '../Orders/OrderCard';
import { resolveOrderStatus } from '../../utils/normalizeUtils';

export default function OrdersView({ 
  orders = [], 
  onTrack, 
  onReorder,
  onDeleteOrder, 
  onBrowseKitchens
}) {
  const safeOrders = Array.isArray(orders) 
    ? orders.filter(order => order && Object.keys(order).length > 0) 
    : [];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full p-4 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-[26px] text-[#111618] m-0">Your orders</h1>
          <p className="text-sm text-[#4B555D] mt-1 m-0">
            {safeOrders.length} {safeOrders.length === 1 ? 'order' : 'orders'} total
          </p>
        </div>
        {onBrowseKitchens && (
          <button
            type="button"
            onClick={onBrowseKitchens}
            className="h-10 px-4 rounded-lg border border-border-visible bg-white text-[14px] font-semibold text-text-primary cursor-pointer hover:bg-gray-50 active:scale-[0.97]"
          >
            Browse kitchens
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {safeOrders.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-border-visible flex flex-col items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-canvas text-text-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4z" />
                <path d="M4 6h16" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <p className="text-[15px] font-medium text-text-primary m-0">You haven't placed any orders yet.</p>
          </div>
        ) : (
          safeOrders.map((order, idx) => {
            return (
              <OrderCard
                key={order.orderId || order.id || `order-${idx}`}
                order={order}
                onTrack={onTrack ? () => onTrack(order) : undefined}
                onReorder={onReorder ? () => onReorder(order) : undefined}
                onDelete={onDeleteOrder ? () => onDeleteOrder(order) : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}