"use client";

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ShoppingCart } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { getItemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/checkout');
      } else if (getItemCount() === 0) {
        router.push('/marketplace'); // Redirect if cart is empty
      }
    }
  }, [user, authLoading, getItemCount, router]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
         </div>
         <div className="md:col-span-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
         </div>
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <Info className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must be logged in to proceed to checkout.
          </AlertDescription>
          <Button asChild className="mt-4">
            <Link href="/login?redirect=/checkout">Login</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  if (getItemCount() === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Alert className="max-w-md text-center">
          <ShoppingCart className="h-4 w-4" />
          <AlertTitle>Your Cart is Empty</AlertTitle>
          <AlertDescription>
            Please add items to your cart before proceeding to checkout.
          </AlertDescription>
          <Button asChild className="mt-4">
            <Link href="/marketplace">Go to Marketplace</Link>
          </Button>
        </Alert>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Checkout</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Complete your purchase by providing the necessary details.
        </p>
      </header>
      <CheckoutForm />
    </div>
  );
}
