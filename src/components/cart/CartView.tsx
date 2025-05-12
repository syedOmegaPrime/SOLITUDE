"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CartView() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getItemCount } = useCart();

  if (getItemCount() === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h2 className="text-3xl font-semibold text-foreground">Your Cart is Empty</h2>
        <p className="mt-3 text-muted-foreground">
          Looks like you haven&apos;t added any assets to your cart yet.
        </p>
        <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90">
          <Link href="/marketplace">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Your Shopping Cart</h1>
            <Button variant="outline" onClick={clearCart} disabled={getItemCount() === 0} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
            </Button>
        </div>
        {cartItems.map(item => (
          <Card key={item.asset.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 shadow-md border">
            <div className="relative w-full sm:w-24 h-24 sm:h-auto sm:aspect-square rounded-md overflow-hidden shrink-0">
              <Image
                src={item.asset.imageUrl}
                alt={item.asset.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={`${item.asset.tags.slice(0,1).join(" ")} art`}
              />
            </div>
            <div className="flex-grow space-y-1">
              <Link href={`/marketplace/${item.asset.id}`} passHref>
                <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.asset.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">By {item.asset.uploaderName || "Unknown"}</p>
              <p className="text-md font-medium text-foreground">৳{item.asset.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 shrink-0 mt-2 sm:mt-0">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.asset.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.asset.id, parseInt(e.target.value) || 1)}
                  className="w-12 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                />
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.asset.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.asset.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <aside className="lg:col-span-1 sticky top-20">
        <Card className="shadow-xl border">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({getItemCount()} item{getItemCount() > 1 ? 's':''})</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (0%)</span> {/* Example Tax/VAT */}
              <span>৳0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold text-foreground">
              <span>Total</span>
              <span>৳{getCartTotal().toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-3">
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/marketplace">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}
