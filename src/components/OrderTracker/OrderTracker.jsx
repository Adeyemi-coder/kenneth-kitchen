import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Required for the map to render correctly

// Fix default leaflet marker icon mapping in build tools
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default coordinates centered on Tanke / University of Ilorin Road, Ilorin
const DEFAULT_CENTER = [8.4966, 4.6730];

const nairaFormatter = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

const STAGES = [
  { id: 'placed', label: 'Order placed', timeText: 'Just now' },
  { id: 'accepted', label: 'Kitchen preparing', timeText: 'Accepted' },
  { id: 'on_the_way', label: 'Rider on the way', timeText: 'On bike' },
  { id: 'delivered', label: 'Delivered', timeText: 'Completed' }
];

export default function OrderTracker({ order, onReturnHome }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [etaRange, setEtaRange] = useState(order?.etaRange ?? '—');
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [riderPaidConfirmed, setRiderPaidConfirmed] = useState(false);

  const resolvedAddress =
    order?.deliveryArea ||
    order?.address ||
    order?.deliveryAddress ||
    order?.location ||
    '—';

  const deliveryPin = order?.pin ?? null;
  const rider = order?.rider ?? null;
  const mapCenter = order?.coordinates || DEFAULT_CENTER;

  const formattedTime = order?.timestamp
    ? new Date(order.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const whatsappUrl = rider?.phone
    ? `https://wa.me/${rider.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hello, this is my order ${order?.orderId || ''}. I am at ${resolvedAddress}.`
      )}`
    : null;

  const advanceToNextStage = () => {
    if (currentStageIndex === 0) {
      setCurrentStageIndex(1);
      setEtaRange('25–35 min');
    } else if (currentStageIndex === 1) {
      setCurrentStageIndex(2);
      setEtaRange('10–15 min');
    } else if (currentStageIndex === 2) {
      setShowHandoverModal(true);
    }
  };

  const handleConfirmHandover = () => {
    setShowHandoverModal(false);
    setCurrentStageIndex(3);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full pb-10">
      {import.meta.env.DEV && (
        <div className="p-3 bg-bg-canvas border border-dashed border-border-visible rounded-lg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-text-secondary">
              Dev: order state
            </span>
            <span className="text-[11px] font-body text-text-secondary">
              Current: <strong className="text-text-primary">{STAGES[currentStageIndex].label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentStageIndex(idx);
                  if (idx === 2) setShowHandoverModal(false);
                  if (idx === 3) setShowHandoverModal(false);
                }}
                className={`h-8 rounded font-heading font-bold text-xs border cursor-pointer transition-colors ${
                  currentStageIndex === idx
                    ? 'bg-[#243628] text-white border-[#243628]'
                    : 'bg-white text-text-primary border-border-visible hover:bg-gray-50'
                }`}
              >
                Stage {idx + 1}: {s.id}
              </button>
            ))}
          </div>

          {currentStageIndex < 2 && (
            <button
              type="button"
              onClick={advanceToNextStage}
              className="w-full mt-1 h-8 rounded bg-[#CF3A0E] text-white font-heading font-bold text-xs border-none cursor-pointer hover:bg-[#A82E0B]"
            >
              Advance to next stage →
            </button>
          )}
        </div>
      )}

      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-visible gap-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl text-text-primary m-0">
              Order {order?.orderId || ''}
            </h1>
            <span className="font-body text-xs text-text-secondary">
              Placed at {formattedTime}
              {etaRange && etaRange !== '—' ? ` · ETA: ${etaRange}` : ''}
            </span>
          </div>
          <p className="font-body text-sm text-text-secondary mt-1 m-0">
            Delivering to: <span className="font-medium text-text-primary">{resolvedAddress}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onReturnHome}
          className="self-start sm:self-auto font-heading font-bold text-xs text-[#243628] hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Back to home
        </button>
      </header>

      {/* Real Interactive Leaflet Map Integration */}
      <div className="relative w-full rounded-xl border border-border-visible overflow-hidden bg-[#ECEAE6]">
        {isMapCollapsed ? (
          <div className="p-4 flex items-center justify-between">
            <span className="font-body text-xs text-text-secondary">Map paused to save data.</span>
            <button
              type="button"
              onClick={() => setIsMapCollapsed(false)}
              className="font-heading font-bold text-xs text-[#243628] underline bg-transparent border-none p-0 cursor-pointer"
            >
              Show map
            </button>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col justify-between relative z-0">
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20 pointer-events-none">
              <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-md text-xs font-heading font-bold text-text-primary border border-border-visible shadow-sm pointer-events-auto">
                {etaRange && etaRange !== '—' ? `Arriving in ${etaRange}` : 'Delivery in progress'}
              </span>
              <button
                type="button"
                onClick={() => setIsMapCollapsed(true)}
                className="bg-white/95 backdrop-blur px-2.5 py-1 rounded text-xs font-body text-text-secondary border border-border-visible cursor-pointer shadow-sm pointer-events-auto hover:bg-gray-50"
              >
                Hide map
              </button>
            </div>

            <MapContainer
              center={mapCenter}
              zoom={15}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%', minHeight: '250px' }}
              dragging={true}
              zoomControl={false}
            >
              {/* Free OpenStreetMap tiles - no API key required */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter} />
            </MapContainer>

            {resolvedAddress !== '—' && (
              <div className="absolute bottom-3 left-3 z-20 text-[11px] font-body text-text-secondary truncate bg-white/95 backdrop-blur px-2.5 py-1 rounded-md border border-border-visible shadow-sm">
                Drop-off: {resolvedAddress}
              </div>
            )}
          </div>
        )}
      </div>

      <section className="p-4 sm:p-5 rounded-xl border border-border-visible bg-white flex flex-col gap-4">
        <h2 className="font-heading font-bold text-sm text-text-primary m-0">Live status</h2>

        <div className="flex flex-col gap-5 pl-1">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isActive = idx === currentStageIndex;

            return (
              <div key={stage.id} className="flex items-start gap-3 relative">
                {idx < STAGES.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-20px] w-[2px] bg-[#838D94]" />
                )}

                <div className="w-6 h-6 flex items-center justify-center shrink-0 z-10 bg-white">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#0B6A37] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#243628] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#243628]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#838D94] flex items-center justify-center text-[9px] text-[#838D94]">
                      ⏱
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center flex-1 min-w-0 pt-0.5">
                  <span className={`font-body text-sm ${isActive ? 'font-bold text-text-primary' : isCompleted ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {stage.label}
                  </span>
                  <span className="font-body text-xs text-text-secondary">
                    {isCompleted ? stage.timeText : isActive ? 'In progress' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {currentStageIndex >= 2 && rider && (
        <section className="p-4 rounded-xl border border-border-visible bg-white flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-bold text-sm text-text-primary m-0">{rider.name}</h3>
              {rider.vehicle && (
                <p className="font-body text-xs text-text-secondary m-0">{rider.vehicle}</p>
              )}
            </div>
            <span className="text-xs font-body font-bold text-[#0B6A37] bg-green-50 border border-green-200 px-2 py-0.5 rounded">
              Assigned rider
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {rider.phone && (
              <a
                href={`tel:${rider.phone}`}
                className="h-12 rounded-lg border border-[#243628] text-[#243628] font-heading font-bold text-xs flex items-center justify-center gap-1.5 no-underline hover:bg-gray-50 active:scale-98"
              >
                📞 Call rider
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-lg border border-[#243628] text-[#243628] font-heading font-bold text-xs flex items-center justify-center gap-1.5 no-underline hover:bg-gray-50 active:scale-98"
              >
                💬 WhatsApp rider
              </a>
            )}
          </div>
        </section>
      )}

      {deliveryPin && (
        <section className="p-4 rounded-xl border border-border-visible bg-white flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-sm text-text-primary block">Delivery PIN</span>
            <p className="font-body text-xs text-text-secondary m-0">
              Give to rider only after you receive and inspect your food.
            </p>
          </div>
          <div className="font-heading font-extrabold text-2xl tracking-widest text-text-primary tabular-nums border border-border-visible px-4 py-2 rounded-lg bg-bg-canvas">
            {deliveryPin}
          </div>
        </section>
      )}

      <section className="p-4 rounded-xl border border-border-visible bg-white flex flex-col gap-3">
        <h3 className="font-heading font-bold text-sm text-text-primary m-0">
          Items ordered ({order?.items?.length || 0})
        </h3>
        <div className="divide-y divide-border-visible">
          {(order?.items || []).map((item, i) => (
            <div key={i} className="py-2.5 flex justify-between items-center text-sm font-body">
              <span className="text-text-primary">
                {item.quantity}× {item.name}
              </span>
              <span className="font-bold tabular-nums text-text-primary">
                ₦{nairaFormatter.format((item.unitPrice || item.price || 0) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-border-visible flex justify-between items-center text-base font-bold text-text-primary">
          <span>Total paid ({String(order?.paymentMethod || 'PAID').toUpperCase()})</span>
          <span className="tabular-nums">
            ₦{nairaFormatter.format(order?.total ?? order?.totalNaira ?? 0)}
          </span>
        </div>
      </section>

      {showHandoverModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-border-visible p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-border-visible">
              <h3 className="font-heading font-bold text-base text-text-primary m-0">Rider is outside</h3>
              <span className="text-xs font-bold text-status-pending">Arrived</span>
            </div>

            <p className="font-body text-xs text-text-secondary leading-relaxed m-0">
              Your rider is waiting at the gate. Check your food before sharing your delivery PIN.
            </p>

            {deliveryPin && (
              <div className="p-3 bg-bg-canvas border border-border-visible rounded-lg flex justify-between items-center">
                <span className="font-body text-xs text-text-secondary">Delivery PIN:</span>
                <span className="font-heading font-extrabold text-xl tracking-widest text-text-primary tabular-nums">
                  {deliveryPin}
                </span>
              </div>
            )}

            {order?.paymentMethod === 'pod' && (
              <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={riderPaidConfirmed}
                  onChange={(e) => setRiderPaidConfirmed(e.target.checked)}
                  className="w-4 h-4 text-[#243628] rounded border-gray-300"
                />
                <span className="font-body text-xs text-text-primary">
                  I have paid ₦{nairaFormatter.format(order?.total ?? order?.totalNaira ?? 0)} to the rider.
                </span>
              </label>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmHandover}
                className="w-full h-12 rounded-lg bg-[#243628] text-white font-heading font-bold text-xs uppercase tracking-wider border-none cursor-pointer hover:bg-[#1a271d]"
              >
                Order received
              </button>
              <button
                type="button"
                onClick={() => setShowHandoverModal(false)}
                className="w-full py-2 bg-transparent border-none font-body text-xs text-status-error hover:underline cursor-pointer"
              >
                There is a problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}