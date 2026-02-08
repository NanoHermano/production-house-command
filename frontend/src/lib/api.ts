const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Agent {
  id: string;
  name: string;
  level: string;
  model: string;
  emoji: string;
  role: string;
  hasSoul: boolean;
  hasMemory: boolean;
}

export interface AgentDetail {
  id: string;
  soul: string | null;
  memory: string | null;
}

export interface Treasury {
  wallet: string;
  balances: {
    [chain: string]: { eth: number; usd: number; error?: boolean };
  };
  total: number;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  hasContext: boolean;
  hasAccess: boolean;
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/api/agents`);
  return res.json();
}

export async function getAgent(id: string): Promise<AgentDetail> {
  const res = await fetch(`${API_BASE}/api/agents/${id}`);
  return res.json();
}

export async function updateAgentSoul(id: string, content: string) {
  const res = await fetch(`${API_BASE}/api/agents/${id}/soul`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  return res.json();
}

export async function updateAgentMemory(id: string, content: string) {
  const res = await fetch(`${API_BASE}/api/agents/${id}/memory`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  return res.json();
}

export async function createAgent(id: string, soul?: string, memory?: string) {
  const res = await fetch(`${API_BASE}/api/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, soul, memory })
  });
  return res.json();
}

// Treasury
export async function getTreasury(): Promise<Treasury> {
  const res = await fetch(`${API_BASE}/api/treasury`);
  return res.json();
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  return res.json();
}

export async function getProject(id: string) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  return res.json();
}

// System
export async function getStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  return res.json();
}

export async function triggerGitSync(message?: string) {
  const res = await fetch(`${API_BASE}/api/git/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return res.json();
}
