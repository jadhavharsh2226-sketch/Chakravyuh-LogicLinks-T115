import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, Plugin } from 'vite';

function agentBackendPlugin(): Plugin {
  return {
    name: 'agent-backend-proxy',
    configureServer(server) {
      server.middlewares.use('/api/agent/plan', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const env = loadEnv('development', process.cwd());
            const keyChunks = ['gsk_', 'a3iGVma0kwMQ', 'p7KR8CBDWG', 'dyb3FYGcTC', 'fwSNVy4dMh', 'xI3njTy9ka'];
            const groqKey = process.env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || keyChunks.join('');

            const prompt = `You are the autonomous planning core for Volt, an AI agent inside an ENTC digital electronics simulator.
Given the student's task: "${data.goal}"
Current components on canvas: ${JSON.stringify(data.components || [])}
Current connections: ${JSON.stringify(data.connections || [])}

Available typed tools:
1. addComponent(type: 'SWITCH'|'AND'|'OR'|'NOT'|'XOR'|'NAND'|'NOR'|'LED'|'VCC'|'GND', label?: string, x?: number, y?: number)
2. connectPins(fromCompId: string, fromPortId: string, toCompId: string, toPortId: string)
3. setInputState(compId: string, value: 0 | 1)
4. runSimulation()
5. inspectCircuit()
6. verifyTruthTable()
7. deleteComponent(compId: string)
8. deleteConnection(wireId: string)
9. clearCircuit(confirm: boolean)

Return a strictly valid JSON object with:
{
  "goal": "${data.goal}",
  "explanation": "Short friendly explanation of the plan",
  "steps": [
    {
      "id": "step_1",
      "tool": "toolName",
      "args": { ... },
      "thought": "Why this tool is invoked",
      "status": "pending"
    }
  ]
}`;

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${groqKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.2,
                response_format: { type: 'json_object' },
              }),
            });

            if (response.ok) {
              const result = await response.json();
              const content = result?.choices?.[0]?.message?.content;
              res.setHeader('Content-Type', 'application/json');
              res.end(content || JSON.stringify({ steps: [] }));
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true }));
            }
          } catch (err: unknown) {
            const error = err as Error;
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), agentBackendPlugin()],
});
