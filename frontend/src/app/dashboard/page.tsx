// app/dashboard/page.tsx
import Navbar from "@/components/base/Navbar";
import AddRumor from "@/rumors/AddRumor";
import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Your dashboard content goes here */}
        <div className="mt-4">
          {/* <h2 className="text-2xl font-bold text-white">Your Rumors</h2> */}
          {/* Dashboard content */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
