"use client";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: "agents", label: "Agent Swarm", icon: "◉" },
  { id: "treasury", label: "Treasury", icon: "◈" },
  { id: "projects", label: "Projects", icon: "◇" },
  { id: "settings", label: "Settings", icon: "◎" },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white min-h-screen p-6">
      <div className="mb-8">
        <div className="text-2xl mb-1">🏛️</div>
        <div className="text-sm font-medium">John</div>
        <div className="text-xs text-gray-500 italic">CEO Agent</div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-3 transition-colors ${
              activeView === item.id
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-xs">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="text-xs text-gray-400 border-t pt-4">
          <div>johnagent.bond</div>
          <div className="mt-1">System Online</div>
        </div>
      </div>
    </aside>
  );
}
