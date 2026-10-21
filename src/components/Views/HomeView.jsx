import React, { useMemo } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import UnderlineTabs from '../UnderlineTabs/UnderlineTabs';
import { vendorKey } from '../../utils/normalizeUtils';
import { greetingFor, lagosHour, mealFor } from '../../utils/timeUtils';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

const SORTS = [
  { id: 'fastest', label: 'Fastest' },
  { id: 'rating', label: 'Top rated' },
  { id: 'distance', label: 'Nearest' },
];

/**
 * Home tab view. Greeting, search, meal section, order-again, all kitchens.
 */
export default function HomeView({
  firstName,
  selectedArea,
  cityVendors,
  cityDishes,
  dishesPerVendor,
  categoryTabs,
  favorites,
  orderHistory = [],
  onOpenSearch,
  onOpenVendor,
  onToggleFavorite,
  onReorder,
  onOpenLocation,
  onOpenOrders, // Added to navigate to the full orders page
}) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('fastest');
  const [openOnly, setOpenOnly] = React.useState(false);

  const hour = lagosHour();
  const meal = mealFor(hour);
  const greeting = greetingFor(hour);

  const openCount = cityVendors.filter((v) => v.isOpen).length;

  // Meal-matched vendors (top by matched-dish ratio).
  const mealVendors = useMemo(() => {
    const score = new Map();
    cityDishes.forEach((d) => {
      if (meal.categories.includes(d.category)) {
        score.set(d.vendorId, (score.get(d.vendorId) ?? 0) + 1);
      }
    });
    return cityVendors
      .filter((v) => v.isOpen && score.has(v.id))
      .map((v) => {
        const matched = score.get(v.id) ?? 0;
        const total = dishesPerVendor.get(v.id) ?? 1;
        return { vendor: v, ratio: matched / total };
      })
      .sort((a, b) => b.ratio - a.ratio || a.vendor.etaMin - b.vendor.etaMin)
      .map((x) => x.vendor)
      .slice(0, 6);
  }, [cityVendors, cityDishes, meal, dishesPerVendor]);

  // Filtered + sorted vendor list.
  const processedVendors = useMemo(() => {
    let list = [...cityVendors];
    if (selectedCategory !== 'All') {
      const ids = new Set(
        cityDishes
          .filter((d) => d.category === selectedCategory)
          .map((d) => d.vendorId)
      );
      list = list.filter((v) => ids.has(v.id));
    }
    if (openOnly) list = list.filter((v) => v.isOpen);
    return list.sort((a, b) => {
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return a.etaMin - b.etaMin;
    });
  }, [cityVendors, cityDishes, selectedCategory, sortBy, openOnly]);

  // Only show the 3 most recent orders on the homepage
  const recentOrders = orderHistory.slice(0, 3);

  return (
    <>
      <section className="flex flex-col gap-1">
        <h1 className="font-heading text-[26px] font-extrabold leading-8 md:text-[32px] md:leading-10">
          {greeting}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-[15px] text-text-secondary">
          {openCount === 0
            ? `No kitchens are open near ${selectedArea} right now`
            : `${openCount} ${
                openCount === 1 ? 'kitchen is' : 'kitchens are'
              } open near ${selectedArea}`}
        </p>
      </section>

      <button
        type="button"
        onClick={onOpenSearch}
        className="flex h-12 w-full items-center gap-3 rounded-lg border border-border-visible bg-white px-4 text-left text-[15px] text-text-secondary active:scale-[0.99] md:max-w-md hover:border-primary-base/30 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search dishes and kitchens
      </button>

      {mealVendors.length > 1 && (
        <section aria-labelledby="meal-title" className="animate-fade-in flex flex-col gap-3">
          <h2 id="meal-title" className="font-heading text-xl font-bold">
            {meal.title}
          </h2>
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {mealVendors.map((v, i) => (
              <li
                key={vendorKey(v, i)}
                className={`w-[280px] shrink-0 snap-start md:w-auto ${
                  i >= 3 ? 'md:hidden' : ''
                }`}
              >
                <VendorCard
                  vendor={v}
                  variant="feature"
                  index={i}
                  onClick={onOpenVendor}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(v.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* REVAMPED: Order again section limited to 3 items */}
      {recentOrders.length > 0 && (
        <section aria-labelledby="again-title" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 id="again-title" className="font-heading text-xl font-bold">
              Order again
            </h2>
            {orderHistory.length > 3 && (
              <button
                type="button"
                onClick={onOpenOrders}
                className="text-[14px] font-semibold text-primary-base hover:underline underline-offset-2"
              >
                See all ({orderHistory.length})
              </button>
            )}
          </div>
          
          <div className="overflow-hidden rounded-xl border border-border-visible bg-white divide-y divide-border-visible shadow-sm">
            {recentOrders.map((item, i) => (
              <div
                key={`again-${item.orderId ?? `${item.vendorId ?? 'x'}-${i}`}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-bg-canvas/50 transition-colors"
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg bg-[#ECEAE6] object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[15px] font-semibold text-text-primary">
                    {item.dishesSummary || 'Order items'}
                  </p>
                  {item.vendorName && (
                    <p className="text-[13px] text-text-secondary mt-0.5">{item.vendorName}</p>
                  )}
                  {typeof (item.totalNaira ?? item.total) === 'number' && (
                    <p className="text-[14px] font-bold tabular-nums text-text-primary mt-1">
                      ₦{naira.format(item.totalNaira ?? item.total)}
                    </p>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => onReorder(item)}
                  className="h-10 shrink-0 rounded-lg border border-border-visible bg-white px-5 text-[14px] font-semibold text-text-primary shadow-sm hover:bg-bg-canvas active:scale-[0.97] transition-all"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="all-title" className="flex flex-col gap-2 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-6 mb-1">
          <h2 id="all-title" className="font-heading text-xl font-bold">
            All kitchens
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenOnly((v) => !v)}
              aria-pressed={openOnly}
              className={`h-10 rounded-lg border px-3 text-[13px] font-medium transition-colors ${
                openOnly
                  ? 'border-primary-base bg-primary-base/10 text-primary-base'
                  : 'border-border-visible bg-white text-text-secondary'
              }`}
            >
              Open now
            </button>
            <UnderlineTabs
              bordered={false}
              ariaLabel="Sort kitchens"
              tabs={SORTS}
              activeId={sortBy}
              onSelect={setSortBy}
            />
          </div>
        </div>

        <UnderlineTabs
          ariaLabel="Food categories"
          tabs={categoryTabs}
          activeId={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {processedVendors.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3 mt-2">
            {processedVendors.map((v, i) => (
              <li key={vendorKey(v, i)}>
                <VendorCard
                  vendor={v}
                  variant="row"
                  index={i}
                  onClick={onOpenVendor}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(v.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-1 py-10">
            <p className="font-heading text-base font-bold">
              {cityVendors.length === 0
                ? `No kitchens deliver to ${selectedArea} yet`
                : openOnly
                ? 'No kitchens are open here right now'
                : `No kitchens carry ${selectedCategory} here`}
            </p>
            <button
              type="button"
              onClick={() => {
                if (openOnly) return setOpenOnly(false);
                if (cityVendors.length === 0) return onOpenLocation();
                setSelectedCategory('All');
              }}
              className="h-12 text-[15px] font-medium text-secondary-olive underline underline-offset-2"
            >
              {openOnly
                ? 'Show closed kitchens too'
                : cityVendors.length === 0
                ? 'Change area'
                : 'Show all kitchens'}
            </button>
          </div>
        )}
      </section>
    </>
  );
}