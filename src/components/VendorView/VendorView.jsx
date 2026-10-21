import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import DishModal from '../DishModal/DishModal';
import { formatNaira } from '../../core/utils/currencyFormatter';
import { formatEtaRange } from '../../core/utils/etaFormatter';
import { MOCK_DISHES } from '../../features/discovery/vendorData';
import VendorInfoModal from '../VendorInfoModal/VendorInfoModal';

// Builds "Area, landmark" without repeating the area or the city.
// "Tanke Junction" + "Behind Total Filling Station, Tanke Junction"  ->  "Tanke Junction, Behind Total Filling Station"
function placeLine(area, landmark, city) {
  const same = (a, b) => a.toLowerCase() === b.toLowerCase();
  const skip = (seg) =>
    (city && same(seg, city)) ||
    (area && (same(seg, area) || area.toLowerCase().includes(seg.toLowerCase())));
  const parts = (landmark ?? '').split(',').map((s) => s.trim()).filter((s) => s && !skip(s));
  const startsWithArea = area && parts.some((p) => p.toLowerCase().startsWith(area.toLowerCase()));
  return [startsWithArea ? null : area, ...parts].filter(Boolean).join(', ');
}

export default function VendorView({ vendor, onBack }) {
  const { addItem, totalCount, subtotal } = useCart();
  const [activeDish, setActiveDish] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Hero tilt. Only the refs that are really attached to elements remain.
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroRafRef = useRef(0);
  const heroStartRef = useRef(0);
  const heroTargetRef = useRef({ yaw: 0, pitch: 0 });
  const heroCurrentRef = useRef({ yaw: 0, pitch: 0 });

  const sectionRefs = useRef({});

  const menu = useMemo(() => {
    if (!vendor) return [];
    return vendor.menu?.length ? vendor.menu : MOCK_DISHES.filter((d) => d.vendorId === vendor.id);
  }, [vendor]);

  const sections = useMemo(() => {
    const map = {};
    menu.forEach((dish) => {
      const sec = dish.section || dish.category || 'Menu';
      (map[sec] ||= []).push(dish);
    });
    return Object.entries(map);
  }, [menu]);

  // Declared after `menu` on purpose: the dependency array below reads it.
  const handleAdd = useCallback(
    (line) =>
      addItem({
        ...line,
        vendorId: vendor?.id,
        vendorName: vendor?.name,
        vendorArea: vendor?.area,
        deliveryFee: vendor?.deliveryFee ?? 0,
        etaRange: vendor?.etaRange ?? null,
        imageUrl: menu.find((d) => d.id === line.dishId)?.imageUrl ?? line.imageUrl ?? vendor?.imageUrl,
      }),
    [addItem, vendor, menu]
  );

  // Open every kitchen from the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [vendor?.id]);

  // Show the kitchen name in the tab bar once the hero has scrolled away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: the browser tells us when a section is under the sticky bars.
  useEffect(() => {
    if (sections.length === 0) return undefined;
    setActiveSection((cur) => cur || sections[0][0]);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.dataset.section)),
      { rootMargin: '-120px 0px -65% 0px' }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Same tilt and idle sway as before. Removed: the layers that were never attached to any element.
  const tick = useCallback(() => {
    const t = (performance.now() - heroStartRef.current) / 1000;
    const target = heroTargetRef.current;
    const cur = heroCurrentRef.current;
    const k = 0.16;
    const idlePitch = Math.sin(t * 0.9) * 1.8;

    cur.yaw += (target.yaw - cur.yaw) * k;
    cur.pitch += (target.pitch + idlePitch - cur.pitch) * k;

    const img = heroImageRef.current;
    if (img) {
      img.style.transform = `translate3d(${cur.yaw * 0.6}px, ${-cur.pitch * 0.6}px, 0) scale(1.06)`;
    }
    heroRafRef.current = requestAnimationFrame(tick);
  }, []);

  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroTargetRef.current = { yaw: x * 34, pitch: -y * 14 };
  };

  const onHeroLeave = () => {
    heroTargetRef.current = { yaw: 0, pitch: 0 };
  };

  // Respect "reduce motion": no animation loop at all for those users.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    heroStartRef.current = performance.now();
    heroRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(heroRafRef.current);
  }, [tick]);

  if (!vendor) return null;

  const canOrder = vendor.isOpen !== false;
  const hasRating = typeof vendor.rating === 'number' && vendor.reviewsCount > 0;
  const eta = vendor.etaRange ?? formatEtaRange(vendor.etaMin, vendor.etaMax);
  const address = placeLine(vendor.area, vendor.landmark, vendor.city);

  // Minimum order only exists when the kitchen has one. Nothing is invented.
  const hasMinOrder = typeof vendor.minOrder === 'number' && vendor.minOrder > 0;
  const belowMin = hasMinOrder && totalCount > 0 && subtotal < vendor.minOrder;

  return (
    <div className="w-full bg-[#FAFAFA] flex flex-col min-h-screen text-[#111618] selection:bg-[#CF3A0E] selection:text-white">
      {/* Sticky category tabs */}
      <div className="sticky top-14 z-30 -mx-4 sm:-mx-6 bg-white border-b border-[#CBD1D6] h-12 flex items-center px-4 sm:px-6">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="font-body text-[13px] font-bold text-[#4B555D] hover:text-[#111618] bg-transparent border-none cursor-pointer shrink-0 flex items-center gap-1 h-12 pr-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            {/* hidden on phones so an invisible name never squeezes the tabs */}
            <span
              aria-hidden={!scrolled}
              className={`hidden sm:block max-w-[220px] font-heading font-extrabold text-[15px] text-[#111618] truncate transition-all duration-200 ${
                scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
              }`}
            >
              {vendor.name}
            </span>
          </div>

          <nav className="min-w-0 flex items-center gap-6 overflow-x-auto no-scrollbar" aria-label="Menu sections">
            {sections.map(([sec]) => {
              const isActive = activeSection === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => sectionRefs.current[sec]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative flex h-12 shrink-0 items-center whitespace-nowrap font-body text-sm font-medium transition-colors bg-transparent border-none cursor-pointer ${
                    isActive ? 'text-[#111618] font-bold' : 'text-[#4B555D] hover:text-[#111618]'
                  }`}
                >
                  {sec}
                  {isActive && <span className="absolute bottom-0 inset-x-0 h-[3px] bg-[#CF3A0E]" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex w-full flex-col gap-10 pt-6 sm:gap-16">
        {/* Restaurant hero */}
        <section className="relative bg-gradient-to-br from-[#2A3D2E] via-[#243628] to-[#1A2A1F] text-white rounded-2xl p-6 sm:p-12 flex flex-col md:flex-row items-stretch justify-between gap-8 shadow-2xl overflow-hidden">
          <div className="relative flex-1 flex flex-col justify-between gap-6 min-w-0 z-10">
            <div className="flex flex-col gap-3">
              <h1 className="font-heading font-extrabold text-[32px] sm:text-[46px] leading-[38px] sm:leading-[52px] tracking-[-0.02em] text-white m-0">
                {vendor.name}
              </h1>

              {/* Always shown, open or closed */}
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white pt-1">
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md">
                  {hasRating ? `★ ${vendor.rating.toFixed(1)} (${vendor.reviewsCount})` : 'New'}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-[#C9D3CB]">Delivery: {eta}</span>
                <span className="text-white/40">•</span>
                <span className={vendor.deliveryFee === 0 ? 'text-[#4ade80]' : 'text-[#C9D3CB]'}>
                  {vendor.deliveryFee === 0 ? 'Free Delivery' : `${formatNaira(vendor.deliveryFee)} Delivery`}
                </span>
              </div>

              <div className="flex flex-col items-start gap-1.5 pt-1">
                <p className="font-body text-sm text-[#C9D3CB] m-0">{address}</p>
                <button
                  type="button"
                  onClick={() => setIsInfoModalOpen(true)}
                  className="font-body text-[13px] font-bold text-[#FF8A5C] hover:underline bg-transparent border-none cursor-pointer text-left p-0 flex items-center gap-1 min-h-12"
                >
                  View hours, hygiene &amp; reviews
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {hasMinOrder && (
                <div className={`text-[13px] font-semibold ${belowMin ? 'text-[#FF8A5C]' : 'text-[#8FA096]'}`}>
                  Minimum order: {formatNaira(vendor.minOrder)}
                  {belowMin && `. Add ${formatNaira(vendor.minOrder - subtotal)} more.`}
                </div>
              )}
            </div>

            {!canOrder && (
              <div className="flex items-center gap-2 text-[#FF8A5C] font-body text-sm bg-black/20 p-3 rounded-lg w-fit">
                <span>{vendor.closedLabel ?? (vendor.opensAt ? `Closed, opens ${vendor.opensAt}` : 'Closed')}</span>
              </div>
            )}
          </div>

          {/* Hero image */}
          {vendor.imageUrl ? (
            <div className="relative w-full md:w-[360px] aspect-[4/5] shrink-0 z-10 [perspective:900px]">
              <div
                ref={heroRef}
                onMouseMove={onHeroMove}
                onMouseLeave={onHeroLeave}
                className="relative w-full h-full rounded-2xl overflow-hidden border border-white/25 bg-[#243628]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div ref={heroImageRef} className="absolute inset-0 will-change-transform">
                  <img
                    src={vendor.imageUrl}
                    alt=""
                    width={360}
                    height={450}
                    loading="eager"
                    draggable={false}
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Menu sections */}
        <div className="flex flex-col gap-16">
          {sections.map(([secName, items]) => (
            <section
              key={secName}
              ref={(el) => (sectionRefs.current[secName] = el)}
              data-section={secName}
              className="flex flex-col gap-6 scroll-mt-28"
            >
              <div className="flex items-baseline justify-between border-b-2 border-[#111618] pb-3">
                <h2 className="font-heading font-extrabold text-[26px] leading-[32px] text-[#111618] m-0">{secName}</h2>
                <span className="font-body text-[13px] text-[#4B555D]">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 items-stretch">
                {items.map((dish) => (
                  <MenuRow key={dish.id} dish={dish} onOpen={() => setActiveDish(dish)} />
                ))}
              </div>
            </section>
          ))}

          {sections.length === 0 && (
            <p className="py-6 font-body text-[15px] text-[#4B555D]">This kitchen has not added its menu yet.</p>
          )}
        </div>
      </div>

      <DishModal
        dish={activeDish}
        isOpen={Boolean(activeDish)}
        onClose={() => setActiveDish(null)}
        onAddToCart={handleAdd}
        orderingDisabled={!canOrder}
        disabledLabel={vendor.closedLabel ?? 'Kitchen is closed'}
      />

      <VendorInfoModal vendor={vendor} isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}

// The dish name is a real button. Its ::after stretches over the whole row, so mouse, touch and keyboard all work
// without nesting interactive elements.
function MenuRow({ dish, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(dish.imageUrl) && !imgFailed;

  return (
    <div className="group relative flex h-full items-start justify-between gap-4 border-b border-[#CBD1D6] py-4">
      <div className="flex h-full min-w-0 flex-1 flex-col justify-between pr-2">
        <div className="flex flex-col gap-1">
          <h3 className="m-0 font-heading text-[17px] font-bold leading-[24px] text-[#111618]">
            <button
              type="button"
              onClick={onOpen}
              className="text-left after:absolute after:inset-0 after:content-[''] group-hover:text-[#CF3A0E] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[#CF3A0E]"
            >
              {dish.name}
            </button>
          </h3>
          {dish.description && (
            <p className="m-0 line-clamp-2 font-body text-[14px] leading-[20px] text-[#4B555D]">{dish.description}</p>
          )}
        </div>
        <span className="mt-3 font-heading text-[17px] font-extrabold leading-[24px] tabular-nums text-[#111618]">
          {formatNaira(dish.price)}
        </span>
      </div>

      {showPhoto && (
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#CBD1D6] bg-[#ECEAE6] sm:h-28 sm:w-28">
          <img
            src={dish.imageUrl}
            alt=""
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}
    </div>
  );
}