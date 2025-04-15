"use client";
import React, { useState, useEffect } from "react";
import UserAvatar from "../common/UserAvatar";
import LogoutModal from "../auth/LogoutModel";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddRumor from "@/rumors/AddRumor";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";

function NavbarClient({ session }: { session: CustomSession | null }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuButton = document.getElementById("menu-button");
      const menuContent = document.getElementById("menu-content");

      if (
        menuOpen &&
        menuButton &&
        menuContent &&
        !menuButton.contains(event.target as Node) &&
        !menuContent.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <LogoutModal open={open} setOpen={setOpen} />

      {/* Menu button fixed at top right */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          id="menu-button"
          variant="outline"
          size="icon"
          className={`rounded-full p-3 transition-all duration-300 bg-transparent backdrop-blur-md border border-slate-700 hover:bg-slate-800/50 shadow-lg ${
            menuOpen ? "ring-2 ring-purple-500" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Dropdown menu that appears when button is clicked */}
        {menuOpen && (
          <div
            id="menu-content"
            className="absolute top-16 right-0 w-64 py-3 bg-transparent backdrop-blur-md border border-slate-700 rounded-xl shadow-lg shadow-purple-500/20 overflow-hidden"
          >
            {/* User info section */}
            {session?.user && (
              <div className="px-4 py-3 border-b border-slate-700">
                <div className="flex items-center space-x-3 mb-2">
                  <UserAvatar
                    name={session?.user?.name?.substring(0, 2) || "??"}
                  />
                  <div>
                    <p className="font-medium text-white">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add Rumor button centered */}
            {session?.user && (
              <div className="flex justify-center px-3 py-4">
                <AddRumor user={session.user} />
              </div>
            )}

            {/* Logout button */}
            <div className="px-3 pb-2">
              <button
                onClick={() => {
                  setOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-800/50 transition-colors"
              >
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NavbarClient;
