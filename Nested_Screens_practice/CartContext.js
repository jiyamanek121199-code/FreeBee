import React, { createContext, useState } from 'react';
import { StatusBar } from 'react-native';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [offer_price, SetOffer_price] = useState(0);
  const [activeOrder, setActiveOrder] = useState(null);

  const addToCart = item => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, Quantiy: cartItem.Quantiy + 1 }
            : cartItem,
        );
      } else {
        return [...prevCart, { ...item, Quantiy: 1 }];
      }
    });
  };

  const removeFromCart = id => {
    setCartItems(prevCart =>
      prevCart
        .map(cartItem =>
          cartItem.id === id
            ? { ...cartItem, Quantiy: cartItem.Quantiy - 1 }
            : cartItem,
        )
        .filter(cartItem => cartItem.Quantiy > 0),
    );
  };

  const placeOrder = orderDetails => {
    const order = {
      id: Date.now().toString(),
      items: [...cartItems],
      total: orderDetails?.total || 0,
      placedAt: new Date().toISOString(),
      estimatedDelivery: orderDetails?.estimatedMinutes || 30,
      status: 'preparing',
    };
    setActiveOrder(order);
    setCartItems([]);
    SetOffer_price(0);
    return order;
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        SetOffer_price,
        offer_price,
        activeOrder,
        placeOrder,
        clearActiveOrder,
      }}
    >
      <StatusBar barStyle="white-content" backgroundColor="#FFFFFF" />
      {children}
    </CartContext.Provider>
  );
};
