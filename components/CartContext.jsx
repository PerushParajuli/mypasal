import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  const [cartProducts, setCartProducts] = useState([]);
  // stockLimits: { [productId]: maxQuantity }
  const [stockLimits, setStockLimits] = useState({});

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts));
    } else {
      ls?.setItem("cart", JSON.stringify([]));
    }
  }, [cartProducts]);

  function registerStock(productId, quantity) {
    setStockLimits(prev => ({ ...prev, [productId]: quantity }));
  }

  function addProduct(productId) {
    setCartProducts(prev => {
      const currentQty = prev.filter(id => id === productId).length;
      const maxQty = stockLimits[productId];

      // If we have a stock limit and it's reached, don't add
      if (maxQty !== undefined && currentQty >= maxQty) {
        return prev;
      }

      return [...prev, productId];
    });
  }

  function removeProduct(productId) {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((_, index) => index !== pos);
      }
      return prev;
    });
  }

  function clearCart() {
    setCartProducts([]);
    ls?.setItem("cart", JSON.stringify([]));
  }

  function isAtStockLimit(productId) {
    const currentQty = cartProducts.filter(id => id === productId).length;
    const maxQty = stockLimits[productId];
    return maxQty !== undefined && currentQty >= maxQty;
  }

  return (
    <CartContext.Provider value={{
      cartProducts,
      setCartProducts,
      addProduct,
      removeProduct,
      clearCart,
      registerStock,
      isAtStockLimit,
      stockLimits,
    }}>
      {children}
    </CartContext.Provider>
  );
}
