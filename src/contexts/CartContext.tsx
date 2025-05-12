"use client";

import type { Asset, CartItem } from '@/types';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (asset: Asset, quantity?: number) => void;
  removeFromCart: (assetId: string) => void;
  updateQuantity: (assetId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (asset: Asset, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.asset.id === asset.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.asset.id === asset.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { asset, quantity }];
    });
    toast({
      title: "Added to cart",
      description: `${asset.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (assetId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.asset.id !== assetId));
     toast({
      title: "Removed from cart",
      description: `Item has been removed from your cart.`,
      variant: "destructive"
    });
  };

  const updateQuantity = (assetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(assetId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.asset.id === assetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.asset.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
