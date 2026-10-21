import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Explicit named export of the Context instance
export const CartContext = createContext(null);

// Explicit named export for CartProvider
export function CartProvider({ children }) {
  // 1. Initialize from localStorage (so it survives reloads)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Save to localStorage whenever the cart changes
  useEffect(() => {
    try {
      localStorage.setItem('kk_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore errors (e.g., Safari private mode, storage full)
    }
  }, [cartItems]);

  const addItem = (item) => {
    if (!item) return;

    const unitPrice = Number.isFinite(item.unitPrice)
      ? item.unitPrice
      : Number.isFinite(item.price)
      ? item.price
      : 0;

    const normalizedItem = {
      ...item,
      unitPrice,
      price: unitPrice,
      selectedModifiers: item.selectedModifiers || item.modifiers || {},
      modifiers: item.selectedModifiers || item.modifiers || {}
    };

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.dishId === normalizedItem.dishId &&
          JSON.stringify(i.selectedModifiers) === JSON.stringify(normalizedItem.selectedModifiers)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (normalizedItem.quantity || 1)
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          ...normalizedItem,
          id: normalizedItem.id || `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          cartItemId: normalizedItem.cartItemId || `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          quantity: normalizedItem.quantity || 1
        }
      ];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId && item.cartItemId !== itemId);
      }
      return prevItems.map((item) =>
        item.id === itemId || item.cartItemId === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId && item.cartItemId !== itemId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('kk_cart'); // Explicitly wipe it on successful checkout
    } catch {
      // Ignore
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number.isFinite(item.unitPrice)
        ? item.unitPrice
        : Number.isFinite(item.price)
        ? item.price
        : 0;
      return acc + price * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addItem,
    addToCart: addItem,
    updateQuantity,
    updateItemQuantity: updateQuantity,
    removeItem,
    removeItemFromCart: removeItem,
    clearCart,
    subtotal,
    totalCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      addItem: () => {},
      addToCart: () => {},
      updateQuantity: () => {},
      updateItemQuantity: () => {},
      removeItem: () => {},
      removeItemFromCart: () => {},
      clearCart: () => {},
      subtotal: 0,
      totalCount: 0
    };
  }
  return context;
}

// Default export as an extra safety measure
export default CartContext;