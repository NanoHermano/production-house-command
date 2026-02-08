"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node component for agents
function AgentNode({ data }: { data: any }) {
  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    idle: "bg-gray-300",
    offline: "bg-red-300",
  };

  return (
    <div
      className={`px-4 py-3 bg-white border-2 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
        data.selected ? "border-green-500" : "border-gray-200"
      }`}
      style={{ minWidth: 140 }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg">{data.emoji}</span>
        <span className={`w-2 h-2 rounded-full ${statusColors[data.status]}`} />
      </div>
      
      <div className="font-medium text-sm">{data.name}</div>
      <div className="text-xs text-gray-500 italic">{data.role}</div>
      
      <div className="mt-2 text-xs text-gray-400">
        {data.model}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

const initialNodes: Node[] = [
  {
    id: "hazar",
    type: "agent",
    position: { x: 400, y: 0 },
    data: { name: "Hazar", role: "Human", emoji: "👤", status: "online", model: "—" },
  },
  {
    id: "john",
    type: "agent",
    position: { x: 400, y: 120 },
    data: { name: "John", role: "CEO Agent", emoji: "🏛️", status: "online", model: "Opus 4.5" },
  },
  {
    id: "dev",
    type: "agent",
    position: { x: 100, y: 280 },
    data: { name: "Dev", role: "Engineering", emoji: "🛠️", status: "online", model: "Sonnet 4" },
  },
  {
    id: "infra",
    type: "agent",
    position: { x: 250, y: 280 },
    data: { name: "Infra", role: "DevOps", emoji: "🔧", status: "idle", model: "Sonnet 4" },
  },
  {
    id: "research",
    type: "agent",
    position: { x: 400, y: 280 },
    data: { name: "Research", role: "Analysis", emoji: "🔬", status: "idle", model: "Sonnet 4" },
  },
  {
    id: "writer",
    type: "agent",
    position: { x: 550, y: 280 },
    data: { name: "Writer", role: "Content", emoji: "✍️", status: "idle", model: "Sonnet 4" },
  },
  {
    id: "designer",
    type: "agent",
    position: { x: 700, y: 280 },
    data: { name: "Designer", role: "Visuals", emoji: "🎨", status: "idle", model: "Sonnet 4" },
  },
  {
    id: "finance",
    type: "agent",
    position: { x: 175, y: 420 },
    data: { name: "Finance", role: "Budget", emoji: "💵", status: "online", model: "Haiku 3.5" },
  },
  {
    id: "qa",
    type: "agent",
    position: { x: 325, y: 420 },
    data: { name: "QA", role: "Testing", emoji: "🧪", status: "idle", model: "Haiku 3.5" },
  },
  {
    id: "social",
    type: "agent",
    position: { x: 475, y: 420 },
    data: { name: "Social", role: "Growth", emoji: "📣", status: "offline", model: "Sonnet 4" },
  },
  {
    id: "accounts",
    type: "agent",
    position: { x: 625, y: 420 },
    data: { name: "Accounts", role: "Identity", emoji: "🔐", status: "offline", model: "Haiku 3.5" },
  },
];

const initialEdges: Edge[] = [
  { id: "e-hazar-john", source: "hazar", target: "john", animated: true },
  { id: "e-john-dev", source: "john", target: "dev" },
  { id: "e-john-infra", source: "john", target: "infra" },
  { id: "e-john-research", source: "john", target: "research" },
  { id: "e-john-writer", source: "john", target: "writer" },
  { id: "e-john-designer", source: "john", target: "designer" },
  { id: "e-dev-finance", source: "dev", target: "finance" },
  { id: "e-dev-qa", source: "dev", target: "qa" },
  { id: "e-writer-social", source: "writer", target: "social" },
  { id: "e-infra-accounts", source: "infra", target: "accounts" },
];

export default function AgentMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedAgent, setSelectedAgent] = useState<Node | null>(null);

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedAgent(node);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, selected: n.id === node.id },
      }))
    );
  }, [setNodes]);

  return (
    <div className="flex gap-6">
      <div className="flex-1 h-[600px] border border-gray-200 rounded-lg bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#e5e5e5" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {selectedAgent && (
        <div className="w-80 border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedAgent.data.emoji}</span>
            <div>
              <div className="font-medium text-lg">{selectedAgent.data.name}</div>
              <div className="text-sm text-gray-500">{selectedAgent.data.role}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                Model
              </label>
              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm">
                <option>Opus 4.5</option>
                <option>Sonnet 4</option>
                <option>Haiku 3.5</option>
                <option>Local (Ollama)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                Status
              </label>
              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm">
                <option>Online</option>
                <option>Idle</option>
                <option>Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                Personality (SOUL.md)
              </label>
              <textarea
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-24 resize-none"
                placeholder="Agent personality and instructions..."
              />
            </div>

            <button className="w-full bg-black text-white py-2 rounded text-sm hover:bg-gray-800 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
