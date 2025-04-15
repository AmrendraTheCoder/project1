"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../common/UserAvatar";
import LogoutModal from "../auth/LogoutModel";
import { Bell, Menu, Search, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddRumor from "@/rumors/AddRumor";
import { getServerSession } from "next-auth";
import {
  authOptions,
  CustomSession,
} from "@/app/api/auth/[...nextauth]/options";

function Navbar({ session }: { session: CustomSession | null }) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <LogoutModal open={open} setOpen={setOpen} />
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text tracking-tight">
                  Rumors
                </h1>
              </div>
            </div>

            {/* Desktop navbar items */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search rumors..."
                  className="pl-10 w-64 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-pink-400 focus:border-pink-400"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-black transition-opacity hover:opacity-100 opacity-80"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <AddRumor user={session?.user!} />

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <UserAvatar name={"VAS"} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300"
                    onClick={() => setOpen(true)}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white transition-opacity hover:opacity-100 opacity-80"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white transition-opacity hover:opacity-100 opacity-80"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <UserAvatar name={"VAS"} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-red-400 hover:text-red-300"
                    onClick={() => setOpen(true)}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu, show/hide based on menu state */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-2 px-2">
              <Input
                type="text"
                placeholder="Search rumors..."
                className="w-full bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-pink-400 focus:border-pink-400 mb-2"
              />
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Rumor
              </Button>
              <div className="pt-4 pb-3 border-t border-slate-700">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800"
                >
                  Settings
                </Link>
                <button
                  onClick={() => setOpen(true)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-800"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
