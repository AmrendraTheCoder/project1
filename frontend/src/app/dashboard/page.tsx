import Navbar from "@/components/base/Navbar";
import AddRumor from "@/rumors/AddRumor";
import { RumourType } from "@/types";
import React from "react";
import { RumoursFetch } from "../fetch/rumourFetch";
import { Session } from "inspector/promises";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import RumorCard from "@/components/Rumors/RumorCard";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const rumour: Array<RumourType> | [] = await RumoursFetch(
    session?.user?.token!
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard content */}
          {rumour.length > 0 &&
            rumour.map((items, index) => (
              <RumorCard rumour={items} key={index} token={ session?.user?.token!} />
            ))}
        </div>
      </main>
    </div>
  );
}
