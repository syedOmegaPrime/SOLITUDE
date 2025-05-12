"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardDescription as it's not used
import { Loader2, Lock, CreditCard, ShoppingBag, Smartphone } from "lucide-react";
import { useState } from "react";
// Removed Image import as logos are removed

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  postalCode: z.string().min(4, { message: "Postal code is required." }),
  paymentMethod: z.enum(["bkash", "nagad", "card"], {
    required_error: "You need to select a payment method.",
  }),
  bkashNumber: z.string().optional(),
  nagadNumber: z.string().optional(),
  // Card fields are omitted for brevity as they are currently disabled/mocked
});

export default function CheckoutForm() {
  const router = useRouter();
  const { getCartTotal, clearCart, cartItems } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "bkash",
      bkashNumber: "",
      nagadNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Checkout submitted:", values);
    console.log("Order Items:", cartItems);
    console.log("Order Total:", getCartTotal());

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    clearCart();
    toast({
      title: "Order Placed Successfully!",
      description: `Thank you for your purchase. Your payment with ${values.paymentMethod} is being processed. Your assets will be available shortly.`,
    });
    router.push("/profile?tab=orders");
  }
  
  const totalAmount = getCartTotal();
  const selectedPaymentMethod = form.watch("paymentMethod");

  if (cartItems.length === 0 && !isLoading) {
     router.push("/marketplace");
     return null;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8 bg-card shadow-xl rounded-lg border">
            <h2 className="text-2xl font-semibold text-primary mb-6">Shipping & Billing Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Aarav Rahman" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="yourname@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl><Input placeholder="e.g., House 123, Road 4, Block B" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input placeholder="e.g., Dhaka" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl><Input placeholder="e.g., 1207" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg font-medium">Payment Method</FormLabel>
                  <FormDescription>Select your preferred payment method. Payments via bKash and Nagad are simulated for this demo.</FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 pt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-secondary/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
                        <FormControl><RadioGroupItem value="bkash" /></FormControl>
                        <Smartphone className="mr-2 h-6 w-6 text-muted-foreground" />
                        <FormLabel className="font-normal cursor-pointer flex-grow">bKash</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-secondary/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
                        <FormControl><RadioGroupItem value="nagad" /></FormControl>
                        <Smartphone className="mr-2 h-6 w-6 text-muted-foreground" />
                        <FormLabel className="font-normal cursor-pointer flex-grow">Nagad</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-secondary/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
                        <FormControl><RadioGroupItem value="card" /></FormControl>
                        <CreditCard className="mr-2 h-6 w-6 text-muted-foreground" />
                        <FormLabel className="font-normal cursor-pointer flex-grow">Credit/Debit Card (Mock)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedPaymentMethod === "bkash" && (
                <Card className="bg-secondary/30 p-4">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2">
                       <Smartphone className="h-7 w-7 text-primary" />
                       <CardTitle className="text-base">Pay with bKash</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3 mt-2">
                        <p className="text-sm text-muted-foreground">
                            To complete your payment:
                        </p>
                        <ol className="list-decimal list-inside text-sm space-y-1">
                            <li>Go to your bKash App or dial *247#.</li>
                            <li>Choose "Send Money".</li>
                            <li>Enter our bKash merchant number: <span className="font-semibold text-primary">01XXX-XXXXXX</span> (Illustrative).</li>
                            <li>Enter the amount: <span className="font-semibold text-primary">৳{totalAmount.toFixed(2)}</span>.</li>
                            <li>Enter your order ID as reference: <span className="font-semibold text-primary">SOLITUDE-XXXX</span> (Illustrative).</li>
                            <li>Confirm the transaction with your bKash PIN.</li>
                        </ol>
                        <FormField
                            control={form.control}
                            name="bkashNumber"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Your bKash Account Number (for verification - optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., 01712345678" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <p className="text-xs text-muted-foreground">After clicking "Place Order", your order will be confirmed once payment is verified (simulated instantly for this demo).</p>
                    </CardContent>
                </Card>
            )}

            {selectedPaymentMethod === "nagad" && (
                 <Card className="bg-secondary/30 p-4">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2">
                        <Smartphone className="h-7 w-7 text-primary" />
                        <CardTitle className="text-base">Pay with Nagad</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3 mt-2">
                        <p className="text-sm text-muted-foreground">
                            To complete your payment:
                        </p>
                         <ol className="list-decimal list-inside text-sm space-y-1">
                            <li>Go to your Nagad App or dial *167#.</li>
                            <li>Choose "Send Money".</li>
                            <li>Enter our Nagad merchant number: <span className="font-semibold text-primary">01XXX-XXXXXX</span> (Illustrative).</li>
                            <li>Enter the amount: <span className="font-semibold text-primary">৳{totalAmount.toFixed(2)}</span>.</li>
                            <li>Enter your order ID as reference: <span className="font-semibold text-primary">SOLITUDE-YYYY</span> (Illustrative).</li>
                            <li>Confirm the transaction with your Nagad PIN.</li>
                        </ol>
                         <FormField
                            control={form.control}
                            name="nagadNumber"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Your Nagad Account Number (for verification - optional)</FormLabel>
                                <FormControl><Input placeholder="e.g., 01812345678" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <p className="text-xs text-muted-foreground">After clicking "Place Order", your order will be confirmed once payment is verified (simulated instantly for this demo).</p>
                    </CardContent>
                </Card>
            )}
            
            {selectedPaymentMethod === "card" && (
                 <Card className="bg-secondary/30 p-4">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2">
                        <CreditCard className="h-7 w-7 text-primary" />
                        <CardTitle className="text-base">Card Details (Mock)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3 mt-2">
                        <Input placeholder="Card Number (e.g. 1234 5678 9012 3456)" disabled/>
                        <div className="flex gap-3">
                            <Input placeholder="MM/YY" disabled/>
                            <Input placeholder="CVC" disabled/>
                        </div>
                         <p className="text-xs text-muted-foreground">Card payments are for demonstration purposes only and are not processed.</p>
                    </CardContent>
                </Card>
            )}


            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || totalAmount === 0}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Lock className="mr-2 h-5 w-5" />
              )}
              {selectedPaymentMethod === "card" ? `Pay ৳${totalAmount.toFixed(2)} Securely` : `Place Order & Pay with ${selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}`}
            </Button>
          </form>
        </Form>
      </div>
      <aside className="md:col-span-1">
        <Card className="sticky top-24 shadow-xl border">
            <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5"/> Your Order
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {cartItems.map(item => (
                    <div key={item.asset.id} className="flex justify-between items-center text-sm border-b pb-2">
                        <div>
                            <p className="font-medium text-foreground">{item.asset.name} (x{item.quantity})</p>
                            <p className="text-xs text-muted-foreground">{item.asset.category}</p>
                        </div>
                        <p className="text-foreground">৳{(item.asset.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <div className="flex justify-between font-semibold text-lg pt-3">
                    <p>Total Amount:</p>
                    <p className="text-primary">৳{totalAmount.toFixed(2)}</p>
                </div>
            </CardContent>
        </Card>
      </aside>
    </div>
  );
}
