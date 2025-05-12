
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, UserCircle, ShoppingBag, UploadCloud, Edit3, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for profile sections
const mockOrders = [
  { id: "order1", date: "2023-05-01", total: 45.0, items: 2, status: "Delivered" },
  { id: "order2", date: "2023-05-15", total: 18.0, items: 1, status: "Processing" },
];
const mockUploadedAssets = [
  { id: "asset1", name: "Traditional Alpana Art", status: "Approved", sales: 10, earnings: 120.0 },
  { id: "asset3", name: "Sundarbans Wildlife Pack", status: "Pending", sales: 0, earnings: 0.0 },
];

export default function ProfileContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        <div className="flex items-center space-x-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <Info className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You must be logged in to view your profile.</AlertDescription>
          <Button asChild className="mt-4">
            <Link href="/login?redirect=/profile">Login</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <header className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-card shadow-lg rounded-lg border">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage
            src={`https://avatar.vercel.sh/${user.email}.png`}
            alt={user.name || user.email}
            data-ai-hint="user profile large"
          />
          <AvatarFallback className="text-3xl">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-3xl font-bold text-primary">{user.name || "User Profile"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 mb-6">
          <TabsTrigger value="overview">
            <UserCircle className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            My Orders
          </TabsTrigger>
          <TabsTrigger value="uploads">
            <UploadCloud className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            My Uploads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>Summary of your account activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Welcome, {user.name || user.email}!</p>
              <p>
                This is your personal dashboard where you can manage your orders, uploaded assets,
                and account settings.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <Card className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{mockOrders.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Uploaded Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{mockUploadedAssets.length}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Track your recent purchases.</CardDescription>
            </CardHeader>
            <CardContent>
              {mockOrders.length > 0 ? (
                <ul className="space-y-4">
                  {mockOrders.map((order) => (
                    <li
                      key={order.id}
                      className="p-4 border rounded-md flex justify-between items-center hover:bg-secondary/50"
                    >
                      <div>
                        <p className="font-semibold">Order #{order.id.substring(5)}</p>
                        <p className="text-sm text-muted-foreground">
                          Date: {order.date} | Items: {order.items}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">৳{order.total.toFixed(2)}</p>
                        <p
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>My Uploaded Assets</CardTitle>
                <CardDescription>Manage your contributions to the marketplace.</CardDescription>
              </div>
              <Button asChild>
                <Link href="/upload">Upload New Asset</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {mockUploadedAssets.length > 0 ? (
                <ul className="space-y-4">
                  {mockUploadedAssets.map((asset) => (
                    <li
                      key={asset.id}
                      className="p-4 border rounded-md flex justify-between items-center hover:bg-secondary/50"
                    >
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Sales: {asset.sales} | Earnings: ৳{asset.earnings.toFixed(2)}
                        </p>
                      </div>
                      <p
                        className={`text-sm px-2 py-1 rounded-full ${
                          asset.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {asset.status}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">You haven&apos;t uploaded any assets yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}