"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AgentMap from "@/components/AgentMap";
import Treasury from "@/components/Treasury";
import Projects from "@/components/Projects";
import Settings from "@/components/Settings";

export default function Home() {
  const [activeView, setActiveView] = useState<string>("agents");

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-normal">Production House</h1>
          <p className="text-gray-500 italic">Command Center</p>
        </header>

        {activeView === "agents" && <AgentMap />}
        {activeView === "treasury" && <Treasury />}
        {activeView === "projects" && <Projects />}
        {activeView === "settings" && <Settings />}
      </main>
    </div>
  );
}
