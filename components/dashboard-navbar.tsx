"use client"

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeButton } from "./theme-button";

interface DashboardNavbarProps {
  userEmail: string;
  userName?: string;
  userAvatarUrl?: string;
}

export function DashboardNavbar({
  userEmail,
  userName = "User",
  userAvatarUrl,
}: DashboardNavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full bg-background px-4 py-3 shadow-sm border-b">
      <div className="flex items-center justify-between h-10 px-4">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Dashboard
        </Link>
        <div className="flex gap-5">
          <ThemeButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full flex items-center justify-center p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatarUrl} alt={userName} />
                  <AvatarFallback>
                    {userName ? userName.charAt(0).toUpperCase() : "DU"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Pengaturan Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Bantuan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}