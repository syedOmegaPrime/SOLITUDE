"use client";

import Link from 'next/link';
import { LogIn, UserPlus, LogOut, UserCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AuthButtons = () => {
  const { user, logout, loading } = useAuth();
  const { getItemCount } = useCart();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Link href="/cart" passHref>
        <Button variant="ghost" size="icon" aria-label="Shopping Cart">
          <ShoppingCart className="h-5 w-5" />
          {getItemCount() > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {getItemCount()}
            </span>
          )}
        </Button>
      </Link>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name || user.email} data-ai-hint="user avatar" />
                <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/upload">
                <UserPlus className="mr-2 h-4 w-4" /> {/* Using UserPlus as placeholder for upload icon */}
                Upload Asset
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link href="/login" passHref>
            <Button variant="ghost">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
