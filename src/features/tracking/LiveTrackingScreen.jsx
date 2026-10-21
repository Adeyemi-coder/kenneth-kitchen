import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { getCallRiderLink, getWhatsAppRiderLink } from './trackingService';

// Fix default leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default coordinates centered on Tanke / University of Ilorin Road, Ilorin
const DEFAULT_CENTER = [8.4966, 4.6730];

const STAGES = [
  { id: 'confirmed', label: 'Order confirmed', desc: 'Kitchen received your order' },
  { id: 'preparing', label: 'Kitchen preparing', desc: 'Amala, soups and proteins are on the fire' },
  { id: 'on_the_way', label: 'Rider on the way', desc: 'Emeka is heading to your location' },
  { id: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!' },
];

export default function LiveTracking({
  isOpen,
  onClose,
  order = {},
  onOpenHandover
}) {
  const [currentStageIndex, setCurrentStageIndex] = useState(2); // Default to 'on_the_way'
  const [showMap, setShowMap] = useState(true); // Collapsible map option per spec

  const rider = {
    name: 'Emeka',
    vehicle: 'Bajaj motorbike',
    plate: 'ABC 123 XY',
    phone: '08039876543',
  };

  const deliveryPin = order.deliveryPin || '4827';
  const mapCenter = order.coordinates || DEFAULT_CENTER;

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Order Tracking"
      className="fixed inset-0 z-[9995] flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-[540px] max-h-[92vh] bg-white rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#243628] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h2 className="font-heading font-extrabold text-lg m-0">Order {order.orderId || '#4821'}</h2>
            <span className="text-xs text-[#C9D3CB]">{order.vendorName || 'Kenneth Kitchen Vendor'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-white/20 border-none"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          
          {/* Collapsible Real Map Area (SCR-Z Spec: 240dp map container) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B555D]">Live Delivery Map</span>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-xs font-medium text-[#CF3A0E] underline bg-transparent border-none cursor-pointer"
              >
                {showMap ? 'Collapse map' : 'Show map'}
              </button>
            </div>

            {showMap && (
              <div className="w-full h-[220px] rounded-xl overflow-hidden border border-[#CBD1D6] relative z-0">
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ width: '100%', height: '100%' }}
                  dragging={false}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={mapCenter} />
                </MapContainer>
              </div>
            )}
          </div>

          {/* ETA Banner & Handover simulator */}
          <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#CBD1D6] flex justify-between items-center">
            <div>
              <span className="text-xs text-[#4B555D] block">Estimated Arrival</span>
              <span className="font-heading font-extrabold text-xl text-[#111618]">
                {order.etaRange || '15–25 min'}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenHandover}
              className="text-xs font-bold text-white bg-[#CF3A0E] px-3 py-2 rounded-lg cursor-pointer border-none hover:bg-[#A82E0B]"
            >
              Simulate Arrival
            </button>
          </div>

          {/* Static Grayscale-Safe Stage Tracker */}
          <div className="flex flex-col gap-4 pl-2 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#838D94]">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isActive = idx === currentStageIndex;
              const isPending = idx > currentStageIndex;

              return (
                <div key={stage.id} className="flex items-start gap-4 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    isCompleted ? 'bg-[#0B6A37] border-[#0B6A37] text-white text-xs' :
                    isActive ? 'bg-white border-[#243628] ring-4 ring-[#243628]/10' :
                    'bg-white border-[#838D94]'
                  }`}>
                    {isCompleted ? '✓' : isActive ? <span className="w-2.5 h-2.5 rounded-full bg-[#243628]" /> : null}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-heading font-bold text-sm ${isPending ? 'text-[#838D94]' : 'text-[#111618]'}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs text-[#4B555D]">{stage.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rider Info Card & Communication Buttons */}
          <div className="border border-[#CBD1D6] rounded-xl p-4 flex flex-col gap-3 bg-[#FAFAFA]">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-[#4B555D]">Your Rider</span>
                <h4 className="font-heading font-bold text-base text-[#111618] m-0">{rider.name}</h4>
              </div>
              <span className="text-xs font-medium text-[#4B555D] bg-white px-2.5 py-1 rounded border border-[#CBD1D6]">
                {rider.vehicle} · {rider.plate}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={getCallRiderLink(rider.phone)}
                className="h-12 rounded-xl border border-[#243628] text-[#243628] font-heading font-bold text-sm flex items-center justify-center gap-2 no-underline hover:bg-[#243628]/5"
              >
                Call rider
              </a>
              <a
                href={getWhatsAppRiderLink(rider.phone, order.orderId, order.deliveryArea)}
                target="_blank"
                rel="noreferrer"
                className="h-12 rounded-xl border border-[#243628] text-[#243628] font-heading font-bold text-sm flex items-center justify-center gap-2 no-underline hover:bg-[#243628]/5"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Delivery PIN Box */}
          <div className="p-4 bg-[#FFF5F5] border border-[#FEB2B2] rounded-xl flex flex-col items-center text-center gap-1">
            <span className="text-xs font-bold text-[#9B2C2C] uppercase tracking-wider">Your Delivery PIN</span>
            <span className="font-heading font-extrabold text-3xl tracking-widest text-[#111618] tabular-nums">
              {deliveryPin}
            </span>
            <p className="text-xs text-[#4B555D] m-0">Give this PIN to the rider only when you receive your food.</p>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}