"use client";
import React, { useState } from "react";
import Link from "next/link";
import UserAvatar from "../common/UserAvatar";
import LogoutModal from "../auth/LogoutModel";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddRumor from "@/rumors/AddRumor";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";

function NormalNavbar({ session }: { session: CustomSession | null }) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <LogoutModal open={logoutModalOpen} setOpen={setLogoutModalOpen} />

      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and desktop nav links */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                  className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text"
                >
                  Rumors
                </Link>
              </div>

              {/* Desktop navigation links */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <UserAvatar
                      name={session?.user?.name?.substring(0, 2) || "??"}
                    />
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-white">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLogoutModalOpen(true)}
                    className="px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors text-sm"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-md transition"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <Button
                variant="outline"
                size="icon"
                className="rounded-md p-2 bg-transparent border border-slate-700 hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition"
              >
                Dashboard
              </Link>
              <Link
                href="/explore"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition"
              >
                Explore
              </Link>
              {session?.user && (
                <div className="py-2">
                  <AddRumor user={session.user} />
                </div>
              )}
            </div>

            {/* Mobile menu user section */}
            {session?.user ? (
              <div className="pt-4 pb-3 border-t border-slate-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <UserAvatar
                      name={session?.user?.name?.substring(0, 2) || "??"}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {session.user.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-5">
                  <button
                    onClick={() => {
                      setLogoutModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-md transition"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-slate-700 space-y-1 px-4">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-md transition text-center"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default NormalNavbar;
