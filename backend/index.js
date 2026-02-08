import express from 'express';
import cors from 'cors';
import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';

const app = express();
const PORT = 3001;

// Config
const WORKSPACE = process.env.WORKSPACE || '/Users/hazar/.openclaw/workspace';
const AGENTS_DIR = join(WORKSPACE, 'agents');
const PROJECTS_DIR = join(WORKSPACE, 'projects');

app.use(cors());
app.use(express.json());

// Helper: Read markdown file
async function readMd(path) {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

// Helper: Write markdown file
async function writeMd(path, content) {
  await writeFile(path, content, 'utf-8');
}

// Helper: Auto-commit and push
async function gitSync(message) {
  try {
    const git = simpleGit(WORKSPACE);
    await git.add('.');
    await git.commit(message);
    await git.push();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ============ AGENTS API ============

// GET /api/agents - List all agents
app.get('/api/agents', async (req, res) => {
  try {
    const dirs = await readdir(AGENTS_DIR);
    const agents = await Promise.all(
      dirs.filter(d => !d.startsWith('.')).map(async (name) => {
        const soulPath = join(AGENTS_DIR, name, 'SOUL.md');
        const memoryPath = join(AGENTS_DIR, name, 'MEMORY.md');
        const soul = await readMd(soulPath);
        const memory = await readMd(memoryPath);
        
        // Extract metadata from SOUL.md
        const levelMatch = soul?.match(/Level:\s*(\w+)/i);
        const modelMatch = soul?.match(/Model:\s*([^\n]+)/i);
        const emojiMatch = soul?.match(/Emoji:\s*([^\n]+)/i);
        const roleMatch = soul?.match(/Role:\s*([^\n]+)/i);
        
        return {
          id: name,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          level: levelMatch?.[1] || 'L1',
          model: modelMatch?.[1]?.trim() || 'Sonnet',
          emoji: emojiMatch?.[1]?.trim() || '🤖',
          role: roleMatch?.[1]?.trim() || 'Agent',
          hasSoul: !!soul,
          hasMemory: !!memory && memory.length > 100
        };
      })
    );
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/agents/:id - Get single agent
app.get('/api/agents/:id', async (req, res) => {
  const { id } = req.params;
  const agentDir = join(AGENTS_DIR, id);
  
  if (!existsSync(agentDir)) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  const soul = await readMd(join(agentDir, 'SOUL.md'));
  const memory = await readMd(join(agentDir, 'MEMORY.md'));
  
  res.json({ id, soul, memory });
});

// PUT /api/agents/:id/soul - Update agent SOUL
app.put('/api/agents/:id/soul', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const soulPath = join(AGENTS_DIR, id, 'SOUL.md');
  
  try {
    await writeMd(soulPath, content);
    const gitResult = await gitSync(`Update ${id} SOUL.md via Command Center`);
    res.json({ success: true, git: gitResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/agents/:id/memory - Update agent MEMORY
app.put('/api/agents/:id/memory', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const memoryPath = join(AGENTS_DIR, id, 'MEMORY.md');
  
  try {
    await writeMd(memoryPath, content);
    const gitResult = await gitSync(`Update ${id} MEMORY.md via Command Center`);
    res.json({ success: true, git: gitResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agents - Create new agent
app.post('/api/agents', async (req, res) => {
  const { id, soul, memory } = req.body;
  const agentDir = join(AGENTS_DIR, id);
  
  try {
    await mkdir(agentDir, { recursive: true });
    await writeMd(join(agentDir, 'SOUL.md'), soul || `# SOUL.md — ${id}\n\n*Define this agent's identity*`);
    await writeMd(join(agentDir, 'MEMORY.md'), memory || '# MEMORY.md\n\n*Long-term memory*');
    const gitResult = await gitSync(`Create agent ${id} via Command Center`);
    res.json({ success: true, git: gitResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PROJECTS API ============

// GET /api/projects - List all projects
app.get('/api/projects', async (req, res) => {
  try {
    const dirs = await readdir(PROJECTS_DIR);
    const projects = await Promise.all(
      dirs.filter(d => !d.startsWith('.')).map(async (name) => {
        const contextPath = join(PROJECTS_DIR, name, 'CONTEXT.md');
        const accessPath = join(PROJECTS_DIR, name, 'ACCESS.md');
        const context = await readMd(contextPath);
        const access = await readMd(accessPath);
        
        // Extract status from CONTEXT.md
        const statusMatch = context?.match(/Status:\s*([^\n]+)/i);
        
        return {
          id: name,
          name: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          status: statusMatch?.[1]?.trim() || 'Active',
          hasContext: !!context,
          hasAccess: !!access
        };
      })
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const projectDir = join(PROJECTS_DIR, id);
  
  const context = await readMd(join(projectDir, 'CONTEXT.md'));
  const access = await readMd(join(projectDir, 'ACCESS.md'));
  
  res.json({ id, context, access });
});

// ============ TREASURY API ============

// GET /api/treasury - Get wallet balances (proxy to avoid CORS)
app.get('/api/treasury', async (req, res) => {
  const wallet = '0xFE8f6EB2E980F1C68E8286A5F602a737e02FA814';
  const chains = {
    base: 'https://mainnet.base.org',
    ethereum: 'https://eth.llamarpc.com',
  };
  
  const results = {};
  
  for (const [chain, rpc] of Object.entries(chains)) {
    try {
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [wallet, 'latest'],
          id: 1
        })
      });
      const data = await response.json();
      const wei = BigInt(data.result || '0');
      const eth = Number(wei) / 1e18;
      results[chain] = { eth, usd: eth * 2500 }; // Rough ETH price estimate
    } catch {
      results[chain] = { eth: 0, usd: 0, error: true };
    }
  }
  
  res.json({
    wallet,
    balances: results,
    total: Object.values(results).reduce((sum, b) => sum + b.usd, 0)
  });
});

// ============ SYSTEM API ============

// GET /api/status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    workspace: WORKSPACE,
    time: new Date().toISOString(),
    version: '0.1.0'
  });
});

// POST /api/git/sync - Manual sync trigger
app.post('/api/git/sync', async (req, res) => {
  const { message } = req.body;
  const result = await gitSync(message || 'Manual sync via Command Center');
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Command Center API running on http://localhost:${PORT}`);
  console.log(`📁 Workspace: ${WORKSPACE}`);
});
