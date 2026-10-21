import React from 'react';
import { orderDateLabel } from '../../utils/timeUtils';
import { resolveOrderStatus, statusClasses } from '../../utils/normalizeUtils';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

export default function OrderCard({ order, onReorder, onTrack }) {
  if (!order) return null;

  const status = resolveOrderStatus(order);
  const dateLabel = orderDateLabel(
    order.placedAt ?? order.createdAt ?? order.timestamp
  );
  const total = order.totalNaira ?? order.total;
  const hasTotal = typeof total === 'number';

  return (
    <article className="overflow-hidden rounded-xl border border-border-visible bg-white shadow-sm">
      <div className="flex items-center gap-4 p-4">
        {order.thumbnail && (
          <img
            src={order.thumbnail}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg bg-[#ECEAE6] object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {order.vendorName && (
              <p className="truncate text-[15px] font-bold text-text-primary">
                {order.vendorName}
              </p>
            )}
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${statusClasses(
                status
              )}`}
            >
              {status}
            </span>
          </div>
          {order.dishesSummary && (
            <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-text-secondary">
              {order.dishesSummary}
            </p>
          )}
          {(dateLabel || order.orderId) && (
            <p className="mt-1 text-[13px] text-text-secondary">
              {dateLabel}
              {dateLabel && order.orderId ? ' · ' : ''}
              {order.orderId ? `#${String(order.orderId).replace(/^#/, '')}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border-visible px-4 py-3 bg-[#F9FAFB]">
        {hasTotal ? (
          <p className="text-[15px] font-bold tabular-nums text-text-primary">
            ₦{naira.format(total)}
          </p>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          {/* Track Button */}
          {onTrack && (
            <button
              type="button"
              onClick={() => onTrack(order)}
              className="h-10 rounded-lg border border-border-visible bg-white px-4 text-[14px] font-semibold text-text-primary active:scale-[0.97] transition-transform"
            >
              Track Order
            </button>
          )}
          {/* Reorder Button */}
          {onReorder && (
            <button
              type="button"
              onClick={() => onReorder(order)}
              className="h-10 rounded-lg bg-primary-base px-4 text-[14px] font-semibold text-white active:scale-[0.97] transition-transform"
            >
              Reorder
            </button>
          )}
        </div>
      </div>
    </article>
  );
}