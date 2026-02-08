"use client";

const projects = [
  {
    id: 1,
    name: "Production House",
    description: "Command center & agent orchestration",
    status: "active",
  },
  {
    id: 2,
    name: "Project Scout",
    description: "Find trending repos to fork & improve",
    status: "queued",
  },
  {
    id: 3,
    name: "Agent Marketplace",
    description: "Sell AI agents as a service",
    status: "planned",
  },
];

export default function Projects() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-normal">Projects</h2>
        <button className="text-sm border border-gray-200 px-4 py-2 rounded hover:bg-gray-50">
          + New Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className={`w-2 h-2 rounded-full ${
                project.status === "active" ? "bg-green-500" :
                project.status === "queued" ? "bg-yellow-500" : "bg-gray-300"
              }`} />
              <div>
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-500">{project.description}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 uppercase">{project.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
