import React from 'react';

const nairaFormatter = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

export default function OrderSummary({ cartItems, deliveryFee = 0, serviceFee = 0, subtotal = 0 }) {
  if (!cartItems || cartItems.length === 0) return null;
  const grandTotal = subtotal + deliveryFee + serviceFee;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 rounded-xl border border-border-visible bg-white p-4">
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-4 text-[14px]">
            <span className="text-text-primary"><span className="font-semibold tabular-nums">{item.quantity}×</span> {item.name}</span>
            <span className="font-medium tabular-nums shrink-0 text-text-primary">₦{nairaFormatter.format((item.unitPrice ?? item.price) * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-bg-canvas/50 p-4 text-[13px]">
        <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span className="tabular-nums">₦{nairaFormatter.format(subtotal)}</span></div>
        <div className="flex justify-between text-text-secondary"><span>Delivery fee</span><span className="tabular-nums">₦{nairaFormatter.format(deliveryFee)}</span></div>
        <div className="flex justify-between text-text-secondary"><span>Service fee</span><span className="tabular-nums">₦{nairaFormatter.format(serviceFee)}</span></div>
        <div className="mt-1 flex justify-between border-t border-border-visible pt-2 text-[15px] font-bold text-text-primary"><span>Total</span><span className="tabular-nums">₦{nairaFormatter.format(grandTotal)}</span></div>
      </div>
    </div>
  );
}
