import { StudentProfile } from '../types/student';
import { UNIVERSITY_SYLLABI } from './syllabusData';
import { ValidationReport } from '../engine/validator';
import { AgenticAction } from '../types/agentic';

const getOpenRouterApiKey = (): string => {
  // 1. Read from Vite environment variable (.env.local)
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  // 2. Read from browser localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('openrouter_api_key');
    if (stored) return stored.trim();
  }
  // 3. Fallback decoded development key
  try {
    return atob('c2stb3ItdjEtZmJiYTI1OGZhMmJlYTIwZDhiOTRmMmI3NDczYWJlZTQxN2RlMWYyODdiYmU5MDkzNmM4YmUxN2ZiMjg0Y2ZkNw==');
  } catch {
    return '';
  }
};

export interface VoltResponse {
  message: string;
  expression: 'happy' | 'excited' | 'thinking' | 'encouraging' | 'celebrating';
  quickTip?: string;
  action?: AgenticAction;
}

export class AIMentorService {
  /**
   * Intelligently parses user text for agentic cursor actions on the circuit canvas
   */
  public static detectAgenticAction(
    userQuestion: string,
    circuitContext?: {
      componentsCount: number;
      switchesState: Record<string, boolean>;
      activeGates: string[];
    }
  ): AgenticAction | undefined {
    const q = userQuestion.toLowerCase().trim();

    // 1. ADD COMPONENT
    if (q.includes('add') || q.includes('insert') || q.includes('place') || q.includes('put') || q.includes('give me')) {
      if (q.includes('xor')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'XOR',
          summary: 'Placing XOR Gate on canvas...',
        };
      }
      if (q.includes('and')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'AND',
          summary: 'Placing AND Gate on canvas...',
        };
      }
      if (q.includes('or')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'OR',
          summary: 'Placing OR Gate on canvas...',
        };
      }
      if (q.includes('not') || q.includes('inverter')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'NOT',
          summary: 'Placing NOT Gate (Inverter) on canvas...',
        };
      }
      if (q.includes('nand')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'NAND',
          summary: 'Placing NAND Gate on canvas...',
        };
      }
      if (q.includes('nor')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'NOR',
          summary: 'Placing NOR Gate on canvas...',
        };
      }
      if (q.includes('switch')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'SWITCH',
          summary: 'Placing Toggle Switch on canvas...',
        };
      }
      if (q.includes('bulb') || q.includes('led') || q.includes('light')) {
        return {
          id: `act_${Date.now()}`,
          type: 'ADD_COMPONENT',
          componentType: 'LED',
          summary: 'Placing Light Bulb on canvas...',
        };
      }
    }

    // 2. TOGGLE SWITCH
    if (
      q.includes('flip') ||
      q.includes('toggle') ||
      q.includes('turn on') ||
      q.includes('turn off') ||
      q.includes('switch a') ||
      q.includes('switch b')
    ) {
      const isSwitchB = q.includes('switch b') || q.includes('flip b') || q.includes(' b');
      return {
        id: `act_${Date.now()}`,
        type: 'TOGGLE_SWITCH',
        targetSwitchLabel: isSwitchB ? 'Switch B' : 'Switch A',
        summary: isSwitchB ? 'Flipping Switch B...' : 'Flipping Switch A...',
      };
    }

    // 3. FIX / REPAIR CIRCUIT
    if (
      q.includes('fix') ||
      q.includes('repair') ||
      q.includes('solve') ||
      q.includes('auto-fix') ||
      q.includes('help me fix') ||
      q.includes('correct my circuit')
    ) {
      return {
        id: `act_${Date.now()}`,
        type: 'FIX_CIRCUIT',
        summary: 'Diagnosing and automatically repairing circuit connection...',
      };
    }

    // 4. TEST / SIMULATE TRUTH TABLE
    if (
      q.includes('test') ||
      q.includes('simulate') ||
      q.includes('run truth table') ||
      q.includes('verify') ||
      q.includes('test the circuit') ||
      q.includes('check table')
    ) {
      return {
        id: `act_${Date.now()}`,
        type: 'TEST_TRUTH_TABLE',
        summary: 'Testing truth table vector sequence (0,0) → (0,1) → (1,1) → (1,0)...',
      };
    }

    // 5. RESET CANVAS
    if (q.includes('reset') || q.includes('clear canvas') || q.includes('start over')) {
      return {
        id: `act_${Date.now()}`,
        type: 'RESET_CANVAS',
        summary: 'Resetting canvas to initial lesson layout...',
      };
    }

    return undefined;
  }

  /**
   * Generates a Duolingo-style personalized tutoring response from Volt
   */
  public static async askVolt(
    userQuestion: string,
    profile: StudentProfile,
    validationReport: ValidationReport | null,
    circuitContext?: {
      componentsCount: number;
      switchesState: Record<string, boolean>;
      activeGates: string[];
    }
  ): Promise<VoltResponse> {
    const syllabus = UNIVERSITY_SYLLABI[profile.track] || UNIVERSITY_SYLLABI.BCA_YEAR_1;
    const detectedAction = this.detectAgenticAction(userQuestion, circuitContext);

    // System prompt tailored to student's exact academic track and syllabus
    const systemPrompt = `You are "Volt", the enthusiastic, cute, and ultra-encouraging chip mascot for Chakravyuh LogicLinks (Team T115) (in the fun, gamified style of Duolingo!).
You are also an AGENTIC AI assistant: when the student asks you to add gates, flip switches, fix circuits, or test truth tables, you confirm with excitement that your virtual cursor is taking action on their workbench!

STUDENT PROFILE:
- Track / Course: ${syllabus.courseName} - ${syllabus.yearName}
- Standard Reference Syllabus: ${syllabus.standardReference}
- Primary Student Goal: ${profile.goal}
- Current Level: Level ${profile.level} (${profile.levelTitle})

CURRENT CIRCUIT CONTEXT:
${circuitContext ? `- Components on Canvas: ${circuitContext.componentsCount}
- Active Gates: ${circuitContext.activeGates.join(', ') || 'None yet'}
- Switches: ${JSON.stringify(circuitContext.switchesState)}` : '- Free Canvas'}
- Passing All Vectors: ${validationReport?.isPassing ? 'YES' : 'NO'}
- Failing Rows: ${validationReport?.failingRows?.length ? validationReport.failingRows.map(r => `#${r+1}`).join(', ') : 'None'}
- Loose/Floating Pins: ${validationReport?.unconnectedPorts?.length ? validationReport.unconnectedPorts.map(p => p.componentLabel).join(', ') : 'None'}

RESPONSE GUIDELINES:
1. Speak in a warm, friendly, short, bite-sized Duolingo style with emojis (⚡, 💡, 🔥, 🚀).
2. Teach according to their exact year (e.g. for BCA 1st Year: reference exam viva questions, truth table tricks, "Break the line, change the sign").
3. Keep answers under 3-4 sentences so it is very fast and easy to read.
4. End with an encouraging cheer or action step.`;

    // Attempt OpenRouter API call
    try {
      const apiKey = getOpenRouterApiKey();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Chakravyuh-LogicLinks-T115',
        },
        body: JSON.stringify({
          model: 'openrouter/free', // 100% Free OpenRouter model with zero credit requirement
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuestion },
          ],
          temperature: 0.7,
          max_tokens: 220,
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const replyText = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning;
        if (replyText && typeof replyText === 'string' && replyText.trim().length > 0) {
          // Infer expression
          let expression: VoltResponse['expression'] = 'happy';
          if (replyText.includes('🎉') || replyText.includes('Awesome') || replyText.includes('Great job')) {
            expression = 'celebrating';
          } else if (replyText.includes('Oops') || replyText.includes('Check') || replyText.includes('careful')) {
            expression = 'encouraging';
          } else if (replyText.includes('Why') || replyText.includes('Let\'s think') || replyText.includes('Hint')) {
            expression = 'thinking';
          } else {
            expression = 'excited';
          }

          let finalMessage = replyText.trim();
          if (detectedAction) {
            finalMessage += `\n\n⚡ **Volt Taking Action:** Watch my cursor ${detectedAction.summary.toLowerCase()}`;
          }

          return {
            message: finalMessage,
            expression,
            quickTip: `Tip: Remember this logic rule for your ${syllabus.yearName} exams!`,
            action: detectedAction,
          };
        }
      }
    } catch (err) {
      console.warn('OpenRouter API call timed out or network error, using Volt smart engine fallback:', err);
    }

    // High quality instant fallback tailored to user's year & question
    const fallback = this.getSmartLocalFallback(userQuestion, profile, validationReport);
    if (detectedAction) {
      fallback.action = detectedAction;
      fallback.message += `\n\n⚡ **Volt Taking Action:** Watch my cursor ${detectedAction.summary.toLowerCase()}`;
      fallback.expression = 'excited';
    }
    return fallback;
  }

  /**
   * Guaranteed instant smart fallback if offline or API limit reached
   */
  private static getSmartLocalFallback(
    question: string,
    profile: StudentProfile,
    validationReport: ValidationReport | null
  ): VoltResponse {
    const q = question.toLowerCase();

    if (q.includes('bulb') || q.includes('light') || q.includes('turn on')) {
      if (validationReport?.unconnectedPorts && validationReport.unconnectedPorts.length > 0) {
        return {
          message: `Volt here! ⚡ I spotted ${validationReport.unconnectedPorts.length} loose pin(s) on your canvas! Gates need electricity flowing into BOTH input pins to wake up. Drag a wire from your switch to the gate! 🔌`,
          expression: 'encouraging',
          quickTip: 'In digital circuits, a floating wire is like an unplugged charger!',
        };
      }
      if (validationReport?.failingRows && validationReport.failingRows.length > 0) {
        return {
          message: `Almost there! 🔥 Your circuit works for some switch flips, but fails on row #${validationReport.failingRows[0] + 1}. Check if you're using the right gate for your ${profile.track === 'BCA_YEAR_1' ? 'BCA 1st Year' : 'college'} assignment!`,
          expression: 'thinking',
          quickTip: 'Click "View Truth Table" to inspect which 1/0 row is red.',
        };
      }
      return {
        message: 'Woohoo! 🚀 All your logic checks pass! If the bulb is dark right now, try clicking a switch to send a 1 (HIGH)!',
        expression: 'celebrating',
        quickTip: '1 = 5 Volts (Bulb ON), 0 = 0 Volts (Bulb OFF).',
      };
    }

    if (q.includes('and') || q.includes('or')) {
      return {
        message: 'Great question! 💡 Here is the golden rule for your exam:\n• AND Gate = Needs BOTH switches to be 1 to glow.\n• OR Gate = Needs EITHER switch to be 1 to glow.',
        expression: 'excited',
        quickTip: 'Exam Mnemonic: AND is strict (×), OR is generous (+)!',
      };
    }

    if (q.includes('xor')) {
      return {
        message: 'XOR stands for "Exclusive OR"! 🌟 It only gives a 1 when your inputs are DIFFERENT (0 and 1, or 1 and 0). If both are 1, it turns OFF! That is how staircase light switches work!',
        expression: 'excited',
        quickTip: 'Equation: Y = A ⊕ B = A·B̄ + Ā·B',
      };
    }

    return {
      message: `Volt is on duty! ⚡ You are studying for ${profile.track === 'BCA_YEAR_1' ? 'BCA 1st Year' : 'your degree'}. You have a ${profile.streakDays}-day streak going! Ask me about any gate, truth table, or circuit bug!`,
      expression: 'happy',
      quickTip: 'Keep learning 5 minutes a day to level up!',
    };
  }
}
