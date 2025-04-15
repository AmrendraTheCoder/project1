// components/auth/LogoutModal.tsx (fixed name from Model to Modal)
"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { sign } from "crypto";

function LogoutModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleLogout = () => {
    // Add your logout logic here
    signOut({
      callbackUrl: '/login',
      redirect: true
    })
    console.log("Logging out...");
    // For example: signOut() or router.push('/login')
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-slate-900 border border-slate-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl flex items-center gap-2 text-white">
            <LogOut className="h-5 w-5 text-red-400" />
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to logout from your account? You'll need to
            sign in again to access your rumors.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLogout}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutModal;
