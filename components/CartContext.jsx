import { createContext, useEffect, useState, useRef } from "react";
export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== 'undefined' ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);
  const [stockLimits, setStockLimits] = useState({});
  const [mounted, setMounted] = useState(false);
  const stockLimitsRef = useRef({});
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      const saved = ls?.getItem('cart');
      if (saved) setCartProducts(JSON.parse(saved));
      isFirstRun.current = false;
      setMounted(true);
    } else {
      ls?.setItem("cart", JSON.stringify(cartProducts ?? []));
    }
  }, [cartProducts]);

  function registerStock(productId, quantity) {
    stockLimitsRef.current[productId] = quantity;
    setStockLimits(prev => ({ ...prev, [productId]: quantity }));
  }

  function addProduct(productId) {
    setCartProducts(prev => {
      const currentQty = prev.filter(id => id === productId).length;
      const maxQty = stockLimitsRef.current[productId];
      if (maxQty !== undefined && currentQty >= maxQty) return prev;
      return [...prev, productId];
    });
  }

  function removeProduct(productId) {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) return prev.filter((_, i) => i !== pos);
      return prev;
    });
  }

  function clearCart() {
    setCartProducts([]);
    ls?.setItem("cart", JSON.stringify([]));
  }

  function isAtStockLimit(productId) {
    const currentQty = cartProducts.filter(id => id === productId).length;
    const maxQty = stockLimitsRef.current[productId];
    return maxQty !== undefined && currentQty >= maxQty;
  }

  return (
    <CartContext.Provider value={{
      cartProducts, setCartProducts,
      addProduct, removeProduct, clearCart,
      registerStock, isAtStockLimit, stockLimits,
      mounted,
    }}>
      {children}
    </CartContext.Provider>
  );
}