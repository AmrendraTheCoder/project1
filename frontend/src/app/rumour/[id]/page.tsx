import React from "react";
import { getServerSession } from "next-auth";
import {
  authOptions,
  CustomSession,
} from "@/app/api/auth/[...nextauth]/options";
import NormalNavbar from "@/components/common/NormalNavbar";
import { RumourFetch } from "@/app/fetch/rumourFetch";
import { RumourType } from "@/types";
import AddRumourItems from "@/components/Rumors/AddRumourItems";
import ViewRumourItems from "@/components/Rumors/ViewRumourItems";
import Rumoring from "@/components/Rumors/Rumoring";

export default async function RumourItems({
  params,
}: {
  params: { id: string };
}) {
  const session: CustomSession | null = await getServerSession(authOptions);

  // Convert id to number if your fetch function expects a number
  const rumourId = parseInt(params.id, 10);
  const rumour: RumourType | null = await RumourFetch(rumourId);
  console.log("Data is here", rumour);

  return (
    <div className="min-h-screen bg-slate-950">
      <NormalNavbar session={session} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-lg shadow-lg p-6 mt-8">
          <header className="mb-6">
            <h1 className="text-2xl lg:text-4xl font-extrabold text-white mb-2">
              {rumour?.title || "Rumour Title"}
            </h1>
            <div className="flex items-center text-slate-400 text-sm">
              <span className="mx-2">•</span>
              <span>
                {rumour?.created_at
                  ? new Date(rumour.created_at).toLocaleDateString()
                  : "April 15, 2025"}
              </span>
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300 mb-4">
              {rumour?.description ||
                "This is where the rumour content would go."}
            </p>
            
          </div>
                {rumour && <Rumoring rumour={rumour!}/>}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Discussion</h2>
            <div className="text-slate-400 text-center py-8">
              Comments would appear here. Join the conversation.
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 text-center text-slate-500 text-sm">
        <div className="container mx-auto">
          © 2025 Rumors Platform • All rights reserved
        </div>
      </footer>
    </div>
  );
}
