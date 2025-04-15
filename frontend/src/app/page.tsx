// app/page.jsx (Server Component)
import React from "react";
import HeroSection from "@/components/base/HeroSection";
import SessionInfoBox from "@/components/common/SessionInfoBox";

import { getServerSession } from "next-auth";
import {
  authOptions,
  CustomSession,
} from "@/app/api/auth/[...nextauth]/options";

export default async function HomePage() {
const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">

      {session && <SessionInfoBox session={session} />}
      <HeroSection />
    </div>
  );
}
