"use client";

import { useCallback, useState, useEffect } from "react";
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
import { getAgents, getAgent, updateAgentSoul, updateAgentMemory, type Agent } from "@/lib/api";

// Custom node component for agents
function AgentNode({ data }: { data: any }) {
  const levelColors: Record<string, string> = {
    L1: "bg-gray-300",
    L2: "bg-blue-400",
    L3: "bg-green-400",
    L4: "bg-purple-400",
  };

  // Clean up markdown formatting
  const emoji = data.emoji?.replace(/\*\*/g, '').trim() || '🤖';
  const level = data.level?.replace(/\*\*/g, '').trim() || 'L1';
  
  return (
    <div
      className={`px-4 py-3 bg-white border-2 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
        data.selected ? "border-green-500" : "border-gray-200"
      }`}
      style={{ minWidth: 140 }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg">{emoji}</span>
        <span className={`px-2 py-0.5 rounded text-xs text-white ${levelColors[level] || 'bg-gray-400'}`}>
          {level}
        </span>
      </div>
      
      <div className="font-medium text-sm">{data.name}</div>
      <div className="text-xs text-gray-500 italic">{data.role?.replace(/\*\*/g, '').trim()}</div>
      
      <div className="mt-2 text-xs text-gray-400 truncate max-w-[120px]">
        {data.model?.replace(/\*\*/g, '').split('(')[0].trim()}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

// Calculate positions in a tree layout
function buildNodesAndEdges(agents: Agent[]): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [
    // Human at top
    {
      id: "hazar",
      type: "agent",
      position: { x: 400, y: 0 },
      data: { name: "Hazar", role: "Human", emoji: "👤", level: "—", model: "—" },
    },
    // CEO Agent
    {
      id: "john",
      type: "agent",
      position: { x: 400, y: 120 },
      data: { name: "John", role: "CEO Agent", emoji: "🏛️", level: "L4", model: "Opus 4.5" },
    },
  ];
  
  // Position agents in rows
  const row1 = agents.filter(a => ['dev', 'infra', 'research', 'writer', 'designer'].includes(a.id));
  const row2 = agents.filter(a => ['finance', 'qa', 'social', 'accounts'].includes(a.id));
  
  row1.forEach((agent, i) => {
    nodes.push({
      id: agent.id,
      type: "agent",
      position: { x: 100 + i * 150, y: 280 },
      data: {
        name: agent.name,
        role: agent.role,
        emoji: agent.emoji,
        level: agent.level,
        model: agent.model,
      },
    });
  });
  
  row2.forEach((agent, i) => {
    nodes.push({
      id: agent.id,
      type: "agent",
      position: { x: 175 + i * 150, y: 420 },
      data: {
        name: agent.name,
        role: agent.role,
        emoji: agent.emoji,
        level: agent.level,
        model: agent.model,
      },
    });
  });
  
  const edges: Edge[] = [
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
  
  return { nodes, edges };
}

export default function AgentMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentDetail, setAgentDetail] = useState<{ soul: string; memory: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'soul' | 'memory'>('soul');

  // Load agents on mount
  useEffect(() => {
    getAgents().then(agents => {
      const { nodes, edges } = buildNodesAndEdges(agents);
      setNodes(nodes);
      setEdges(edges);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load agents:', err);
      setLoading(false);
    });
  }, [setNodes, setEdges]);

  // Load agent detail when selected
  useEffect(() => {
    if (selectedAgent && selectedAgent !== 'hazar' && selectedAgent !== 'john') {
      getAgent(selectedAgent).then(detail => {
        setAgentDetail({
          soul: detail.soul || '',
          memory: detail.memory || ''
        });
      });
    } else {
      setAgentDetail(null);
    }
  }, [selectedAgent]);

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedAgent(node.id);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, selected: n.id === node.id },
      }))
    );
  }, [setNodes]);

  const handleSave = async () => {
    if (!selectedAgent || !agentDetail) return;
    setSaving(true);
    try {
      if (activeTab === 'soul') {
        await updateAgentSoul(selectedAgent, agentDetail.soul);
      } else {
        await updateAgentMemory(selectedAgent, agentDetail.memory);
      }
    } catch (err) {
      console.error('Failed to save:', err);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        Loading agents...
      </div>
    );
  }

  const selectedNode = nodes.find(n => n.id === selectedAgent);

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

      {selectedNode && selectedAgent !== 'hazar' && (
        <div className="w-96 border border-gray-200 rounded-lg p-6 bg-white flex flex-col h-[600px]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedNode.data.emoji?.replace(/\*\*/g, '')}</span>
            <div>
              <div className="font-medium text-lg">{selectedNode.data.name}</div>
              <div className="text-sm text-gray-500">{selectedNode.data.role?.replace(/\*\*/g, '')}</div>
            </div>
            <span className="ml-auto px-2 py-1 bg-gray-100 rounded text-xs">
              {selectedNode.data.level?.replace(/\*\*/g, '')}
            </span>
          </div>

          {selectedAgent === 'john' ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              CEO Agent — That's me!
            </div>
          ) : agentDetail ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('soul')}
                  className={`px-4 py-2 text-sm ${activeTab === 'soul' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                >
                  SOUL.md
                </button>
                <button
                  onClick={() => setActiveTab('memory')}
                  className={`px-4 py-2 text-sm ${activeTab === 'memory' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
                >
                  MEMORY.md
                </button>
              </div>

              {/* Editor */}
              <textarea
                className="flex-1 w-full border border-gray-200 rounded px-3 py-2 text-sm font-mono resize-none"
                value={activeTab === 'soul' ? agentDetail.soul : agentDetail.memory}
                onChange={(e) => setAgentDetail({
                  ...agentDetail,
                  [activeTab]: e.target.value
                })}
              />

              <button 
                onClick={handleSave}
                disabled={saving}
                className="mt-4 w-full bg-black text-white py-2 rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Push to Git'}
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Loading...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
