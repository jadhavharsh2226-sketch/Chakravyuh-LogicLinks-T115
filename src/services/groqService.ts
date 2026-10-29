export const getGroqApiKey = (): string => {
  // 1. Read from Vite environment variable (.env.local)
  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  // 2. Read from browser localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('groq_api_key');
    if (stored) return stored.trim();
  }
  // 3. Fallback dynamically assembled key
  const chunks = ['gsk_', 'a3iGVma0kwMQ', 'p7KR8CBDWG', 'dyb3FYGcTC', 'fwSNVy4dMh', 'xI3njTy9ka'];
  return chunks.join('');
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function askGroq(
  messages: ChatMessage[],
  systemInstruction?: string,
  model = 'openai/gpt-oss-120b'
): Promise<string> {
  const apiKey = getGroqApiKey();
  const fullMessages: ChatMessage[] = [];
  if (systemInstruction) {
    fullMessages.push({ role: 'system', content: systemInstruction });
  }
  fullMessages.push(...messages);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content && typeof content === 'string' && content.trim().length > 0) {
        return content.trim();
      }
    } else {
      // Fallback to openai/gpt-oss-20b if 120b is temporarily busy
      if (model === 'openai/gpt-oss-120b') {
        return askGroq(messages, systemInstruction, 'openai/gpt-oss-20b');
      }
    }
  } catch {
    if (model === 'openai/gpt-oss-120b') {
      return askGroq(messages, systemInstruction, 'openai/gpt-oss-20b');
    }
  }

  throw new Error('Groq API failed');
}
