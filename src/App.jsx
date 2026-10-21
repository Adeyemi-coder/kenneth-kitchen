import React, { useCallback, useMemo, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import CartBar from './components/CartBar/CartBar';
import SignIn, { getSession, signOut as clearSession } from './components/SignIn/SignIn';
import SearchPanel from './components/SearchPanel/SearchPanel';
import VendorView from './components/VendorView/VendorView';
import LocationModal from './components/LocationModal/LocationModal';
import CartDrawer from './components/CartDrawer/CartDrawer';
import CheckoutModal from './components/CheckoutModal/CheckoutModal';
import OrderTracker from './components/OrderTracker/OrderTracker'; // <-- ADDED THIS IMPORT

import HomeView from './components/Views/HomeView';
import OrdersView from './components/Views/OrdersView';
import AccountView from './components/Views/AccountView';

import { useUserOrders } from './hooks/useUserOrders';
import { useUserPrefs } from './hooks/useUserPrefs';

import { getNormalizedVendors } from './utils/normalizeUtils';
import { MOCK_CATEGORIES, MOCK_DISHES } from './features/discovery/vendorData';

// Module-level constant — computed once, not per render.
const VENDORS = getNormalizedVendors();

function KitchenApp() {
  const { addItem } = useCart();

  const [user, setUser] = useState(() => getSession());
  const [activeTab, setActiveTab] = useState('home');
  const [vendorId, setVendorId] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Domain hooks — own persistence + per-user isolation.
  const prefs = useUserPrefs(user?.email);
  // ADDED deleteOrder to the destructuring
  const { orders: orderHistory, appendOrder, deleteOrder, totalSpent } = useUserOrders(user?.email);

  // ---- derived data (read-only, memoized) --------------------------------
  const cityVendors = useMemo(
    () =>
      VENDORS.filter(
        (v) => v.city?.toLowerCase() === prefs.city.toLowerCase()
      ),
    [prefs.city]
  );

  const cityDishes = useMemo(() => {
    const ids = new Set(cityVendors.map((v) => v.id));
    return MOCK_DISHES.filter((d) => ids.has(d.vendorId));
  }, [cityVendors]);

  const dishesPerVendor = useMemo(() => {
    const map = new Map();
    MOCK_DISHES.forEach((d) => {
      map.set(d.vendorId, (map.get(d.vendorId) ?? 0) + 1);
    });
    return map;
  }, []);

  const categoryTabs = useMemo(() => {
    const tabs = [{ id: 'All', label: 'All', count: cityVendors.length }];
    MOCK_CATEGORIES.filter((c) => c !== 'All').forEach((cat) => {
      const count = new Set(
        cityDishes.filter((d) => d.category === cat).map((d) => d.vendorId)
      ).size;
      if (count > 0) tabs.push({ id: cat, label: cat, count });
    });
    return tabs;
  }, [cityVendors, cityDishes]);

  const favoriteVendors = useMemo(
    () => VENDORS.filter((v) => prefs.favorites.includes(v.id)),
    [prefs.favorites]
  );

  const selectedVendor = useMemo(() => {
    const v = VENDORS.find((x) => x.id === vendorId);
    if (!v) return null;
    return {
      ...v,
      menu: MOCK_DISHES.filter((d) => d.vendorId === v.id).map((d) => ({
        ...d,
        section: d.category,
      })),
    };
  }, [vendorId]);

  // ---- actions ----------------------------------------------------------
  const openVendor = useCallback((v) => {
    if (!v?.id) return;
    setVendorId(v.id);
    setActiveTab('home');
    setIsSearchOpen(false);
  }, []);

  const handleTabChange = useCallback((tab) => {
    if (tab === 'search') {
      setIsSearchOpen(true);
      return;
    }
    setActiveTab(tab);
    if (tab === 'home') {
      setVendorId(null);
      setActiveOrder(null); // Clear active order if they go to home
    }
  }, []);

  const handleSignIn = useCallback((u) => setUser(u), []);

  const handleSignOut = useCallback(() => {
    clearSession();
    setUser(null);
    setActiveTab('home');
    setVendorId(null);
    setActiveOrder(null);
    prefs.reset();
  }, [prefs]);

  const reorder = useCallback(
    (order) => {
      if (!order) return;
      const lines =
        Array.isArray(order.items) && order.items.length > 0
          ? order.items
          : [
              {
                dishId: order.dishId,
                vendorId: order.vendorId,
                vendorName: order.vendorName,
                name: order.dishesSummary,
                unitPrice: order.totalNaira ?? order.total,
                quantity: 1,
              },
            ];

      let added = 0;
      for (const line of lines) {
        const dish = line.dishId
          ? MOCK_DISHES.find((d) => d.id === line.dishId)
          : MOCK_DISHES.find(
              (d) => d.vendorId === line.vendorId && d.name === line.name
            );
        if (!dish) continue;

        addItem({
          dishId: dish.id,
          name: dish.name,
          unitPrice: line.unitPrice ?? dish.price,
          price: line.unitPrice ?? dish.price,
          quantity: line.quantity ?? 1,
          selectedModifiers: line.selectedModifiers ?? {},
          vendorId: line.vendorId ?? dish.vendorId,
          vendorName: line.vendorName ?? '',
          imageUrl: dish.imageUrl,
        });
        added++;
      }

      if (added === 0 && order.vendorId) {
        setVendorId(order.vendorId);
        setActiveTab('home');
        return;
      }
      setIsCartOpen(true);
    },
    [addItem]
  );

  // ---- auth gate --------------------------------------------------------
  if (!user) {
    return <SignIn onDone={handleSignIn} />;
  }

  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-bg-canvas text-text-primary antialiased">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentArea={prefs.area}
        currentCity={prefs.city}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col gap-8 px-4 pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] pt-20 sm:px-6 md:pb-16">
        
        {activeTab === 'orders' ? (
          // RENDER TRACKER IF ACTIVE ORDER EXISTS, OTHERWISE RENDER THE LIST
          activeOrder ? (
            <OrderTracker
              order={activeOrder}
              onReturnHome={() => {
                setActiveOrder(null);
                setActiveTab('home');
                setVendorId(null);
              }}
            />
          ) : (
            <OrdersView
              orders={orderHistory} // <-- Fixed prop
              onTrack={(order) => setActiveOrder(order)} // <-- Triggers the tracker
              onDeleteOrder={deleteOrder} // <-- Wired up the delete function
              handleReorder={reorder} // <-- Fixed prop
              onBrowseKitchens={() => setActiveTab('home')} // <-- Fixed prop
            />
          )
        ) : activeTab === 'account' ? (
          <AccountView
            user={user}
            orderHistory={orderHistory}
            totalSpent={totalSpent}
            favorites={prefs.favorites}
            favoriteVendors={favoriteVendors}
            cityVendors={cityVendors}
            selectedCity={prefs.city}
            selectedArea={prefs.area}
            notificationsOn={prefs.notificationsOn}
            onToggleNotifications={() => prefs.setNotificationsOn((v) => !v)}
            onOpenLocation={() => setIsLocationOpen(true)}
            onOpenOrders={() => setActiveTab('orders')}
            onSignOut={handleSignOut}
            onBrowse={() => setActiveTab('home')}
            onOpenVendor={openVendor}
            onToggleFavorite={prefs.toggleFavorite}
          />
        ) : selectedVendor ? (
          <VendorView vendor={selectedVendor} onBack={() => setVendorId(null)} />
        ) : (
          <HomeView
            firstName={firstName}
            selectedArea={prefs.area}
            cityVendors={cityVendors}
            cityDishes={cityDishes}
            dishesPerVendor={dishesPerVendor}
            categoryTabs={categoryTabs}
            favorites={prefs.favorites}
            orderHistory={orderHistory}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenVendor={openVendor}
            onToggleFavorite={prefs.toggleFavorite}
            onReorder={reorder}
            onOpenLocation={() => setIsLocationOpen(true)}
          />
        )}
      </main>

      {activeTab === 'home' && <CartBar onOpen={() => setIsCartOpen(true)} />}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        dishes={cityDishes}
        vendors={cityVendors}
        onPick={openVendor}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentLocation={`${prefs.area}, ${prefs.city}`}
        onSelectLocation={(loc) => {
          const [areaPart, cityPart] = loc.split('·')[0].split(',');
          if (areaPart?.trim()) prefs.setArea(areaPart.trim());
          if (cityPart?.trim()) prefs.setCity(cityPart.trim());
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        deliveryArea={`${prefs.area}, ${prefs.city}`}
        etaRange={selectedVendor?.etaRange}
        onOrderSuccess={(order) => {
          appendOrder(order);
          setActiveOrder(order);
          setActiveTab('orders');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <KitchenApp />
    </CartProvider>
  );
}