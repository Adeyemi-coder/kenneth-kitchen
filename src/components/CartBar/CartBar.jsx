import React from 'react';
import { useCart } from '../../context/CartContext';



export default function CartBar({ onOpen }) {
  const { totalCount, cartItems, totalPrice, subtotal } = useCart();
  if (!totalCount) return null;

  const total =
    totalPrice ??
    subtotal ??
    (Array.isArray(cartItems)
      ? cartItems.reduce((sum, i) => sum + (i.unitPrice ?? i.price ?? 0) * (i.quantity ?? 1), 0)
      : null);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="animate-sheet-up fixed inset-x-4 bottom-[calc(4rem+env(safe-area-inset-bottom,0px)+0.75rem)] z-30 flex h-14 items-center justify-between rounded-xl bg-primary-base px-4 text-white active:scale-[0.98] active:bg-primary-pressed md:hidden"
    >
      <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-white px-2 text-[13px] font-bold tabular-nums text-primary-base">
        {totalCount}
      </span>
      <span className="font-heading text-base font-bold">View cart</span>
      <span className="font-body text-base font-bold tabular-nums">
        {total != null ? `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(total)}` : ''}
      </span>
    </button>
  );
}