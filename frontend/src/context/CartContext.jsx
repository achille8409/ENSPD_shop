import React, { createContext, useContext, useState, useEffect } from 'react';
import { activityLogger, ACTIVITY_TYPES } from '../services/activityLogger';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('enspd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('enspd_cart', JSON.stringify(cart));
  }, [cart]);

  const getCurrentUser = () => {
    try {
      const saved = localStorage.getItem('enspd_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    // Activity tracking: who added what to cart
    // Activity tracking: who added what to cart
    activityLogger.logEvent(
      ACTIVITY_TYPES.CART_ADD,
      user?.name || 'Étudiant Connecté',
      user?.email || 'Non renseigné',
      user?.phone || 'Non renseigné',
      `A ajouté ${quantity}x "${product.name}" (${(product.price * quantity).toLocaleString('fr-FR')} FCFA) à son panier`,
      {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        category: product.categoryName || product.category
      }
    );
    showToast(`"${product.name}" a été ajouté au panier !`);
    showToast(`"${product.name}" a été ajouté au panier !`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    if (item) {
      const user = getCurrentUser();
      activityLogger.logEvent(
        ACTIVITY_TYPES.CART_REMOVE,
        user?.name || 'Étudiant Connecté',
        user?.email || 'Non renseigné',
        user?.phone || 'Non renseigné',
        `A retiré "${item.name}" du panier`,
        { productId, productName: item.name }
      );
      showToast(`"${item.name}" a été retiré du panier`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ENSPD2026' || clean === 'POLYTECH') {
      setDiscountPercent(10);
      setPromoCode(clean);
      showToast('Code promo activé ! 10% de réduction appliquée.');
      return { success: true, message: '10% de réduction appliquée !' };
    } else if (clean === 'CAMPUS50') {
      setDiscountPercent(15);
      setPromoCode(clean);
      showToast('Code promo VIP activé ! 15% de réduction appliquée.');
      return { success: true, message: '15% de réduction appliquée !' };
    } else {
      showToast('Code promo invalide ou expiré', 'error');
      return { success: false, message: 'Code promo invalide.' };
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = Math.max(0, subtotal - discountAmount);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      promoCode,
      discountPercent,
      discountAmount,
      applyPromo,
      subtotal,
      totalAmount,
      totalItemsCount,
      toastMessage,
      showToast
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
