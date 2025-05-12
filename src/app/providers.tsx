"use client";

import React, { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { AssetProvider } from '@/contexts/AssetContext';
import { ForumProvider } from '@/contexts/ForumContext'; // Import ForumProvider
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AssetProvider>
          <ForumProvider> {/* Add ForumProvider here */}
            <TooltipProvider>
             {children}
            </TooltipProvider>
          </ForumProvider>
        </AssetProvider>
      </CartProvider>
    </AuthProvider>
  );
}
