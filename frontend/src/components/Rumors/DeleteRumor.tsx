// components/auth/LogoutModal.tsx (fixed name from Model to Modal)
"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
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
import { toast } from "sonner";
import axios from "axios";
import { RUMOUR_URL } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/CommonActions";

function DeleteRumor({
  open,
  setOpen,
  id,
  token,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
  token: string;
    }) {
    const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
      console.log("Logging out...");
      try {
          setLoading(true)
          const { data } = await axios.delete(`${RUMOUR_URL}/${id}`, {
              headers: {
                  Authorization: token
              }
          })

          if (data?.message) {
              setLoading(false)
              clearCache("dashboard")
              toast.success(data.message)
          }
        } catch (error) {
          setLoading(false)
          toast.error("Something went Wrong! Please try again.")
        
      }

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
            Are you sure you want to logout from your rumour from your this list
            permanenantly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete} disabled={loading}
          >
            {loading? "Processing..." : "Yes, Delete this rumour"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteRumor;
