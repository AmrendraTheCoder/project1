// app/page.jsx (Server Component)
import React from "react";
import HeroSection from "@/components/base/HeroSection";

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">

      {/* {session && <SessionInfoBox session={session} />} */}
      <HeroSection />
    </div>
  );
}
