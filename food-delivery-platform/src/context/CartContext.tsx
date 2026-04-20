import React, { createContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  restaurant_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { restaurant_id: number }) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { restaurant_id: number }) => {
    setItems((prevItems) => {
      // Check if from same restaurant, if not, could prompt clear cart (skipped for simplicity here)
      if (prevItems.length > 0 && prevItems[0].restaurant_id !== newItem.restaurant_id) {
         alert("You can only add items from one restaurant at a time. Please clear your cart first.");
         return prevItems;
      }

      const existing = prevItems.find((item) => item.id === newItem.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
