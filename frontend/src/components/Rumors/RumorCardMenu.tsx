"use client";
import { RumourType } from "@/types";
import React, { Suspense, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, EllipsisVertical, Trash } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import DeleteRumor from "./DeleteRumor";
import Env from "@/lib/env";
const EditRumour = dynamic(() => import("./EditRumour"));

export default function RumorCardMenu({
  rumour,
  token,
}: {
  rumour: RumourType;
  token: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${Env.APP_URL}/rumour/${rumour.id}`)
    toast.success("Link Copied Successfully!")
  }

  const copyRumorLink = () => {
    // This would be the URL of the rumor detail page
    const url = `${window.location.origin}/rumors/${rumour.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <>
      {open && (
        <Suspense
          fallback={
            <div className="p-4 bg-slate-800 rounded-lg">Loading editor...</div>
          }
        >
          <EditRumour
            open={open}
            setOpen={setOpen}
            rumour={rumour}
            token={token}
          />
        </Suspense>
      )}
      {deleteOpen && (
        <Suspense
          fallback={
            <div className="p-4 bg-slate-800 rounded-lg">Loading...</div>
          }
        >
          <DeleteRumor
            open={deleteOpen}
            setOpen={setDeleteOpen}
            id={rumour.id}
            token={token}
          />
        </Suspense>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
          <EllipsisVertical className="h-5 w-5 text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-slate-800 border-slate-700 text-slate-200"
        >
          <DropdownMenuItem
            className="flex items-center gap-2 hover:bg-slate-700 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 hover:bg-slate-700 cursor-pointer"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
