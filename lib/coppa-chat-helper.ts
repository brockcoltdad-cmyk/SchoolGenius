/**
 * COPPA-Compliant Chat Helper
 *
 * Handles age-based chat storage and filtering:
 * - Under 13 (K-7th grade): Session-only storage, PII filtering, no permanent history
 * - 13+ (8th-12th grade): Full chat with database storage, history, all features
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatConfig {
  canStoreHistory: boolean;      // Can save to database
  canUploadFiles: boolean;       // Can upload images/files
  filterPII: boolean;            // Filter personal info
  sessionOnly: boolean;          // Only use sessionStorage
  maxHistoryLength: number;      // Max messages to keep
  autoDeleteMinutes: number;     // Auto-clear after inactivity (0 = never)
}

/**
 * Determine if a child is under 13 based on grade level
 * K-7th grade = under 13 (COPPA applies)
 * 8th-12th grade = 13+ (full features)
 */
export function isUnder13(gradeLevel: string): boolean {
  const grade = gradeLevel.toUpperCase();

  // Kindergarten through 7th grade = under 13
  const under13Grades = ['K', '1', '2', '3', '4', '5', '6', '7'];

  return under13Grades.includes(grade);
}

/**
 * Get chat configuration based on age/grade
 */
export function getChatConfig(gradeLevel: string): ChatConfig {
  if (isUnder13(gradeLevel)) {
    // COPPA-compliant settings for under 13
    return {
      canStoreHistory: false,
      canUploadFiles: false,
      filterPII: true,
      sessionOnly: true,
      maxHistoryLength: 50,      // Keep last 50 messages in session
      autoDeleteMinutes: 30,     // Clear after 30 min inactivity
    };
  } else {
    // Full features for 13+
    return {
      canStoreHistory: true,
      canUploadFiles: true,
      filterPII: false,
      sessionOnly: false,
      maxHistoryLength: 500,     // Keep more history
      autoDeleteMinutes: 0,      // Don't auto-delete
    };
  }
}

/**
 * Filter PII (Personally Identifiable Information) from text
 * Used for under-13 chats to prevent storing personal data
 */
export function filterPII(text: string): string {
  let filtered = text;

  // Phone numbers (various formats)
  filtered = filtered.replace(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[phone removed]');

  // Email addresses
  filtered = filtered.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email removed]');

  // Social Security Numbers
  filtered = filtered.replace(/\d{3}[-.\s]?\d{2}[-.\s]?\d{4}/g, '[SSN removed]');

  // Street addresses (basic pattern)
  filtered = filtered.replace(/\d+\s+[\w\s]+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|court|ct|boulevard|blvd|circle|cir)\b/gi, '[address removed]');

  // ZIP codes (standalone 5-digit)
  filtered = filtered.replace(/\b\d{5}(-\d{4})?\b/g, '[zip removed]');

  // Common "my name is" patterns - don't remove, just note
  // We don't filter this as it would break normal conversation
  // Instead, the AI is instructed not to repeat or store names

  return filtered;
}

/**
 * Get session storage key for a child's chat
 */
export function getChatStorageKey(childId: string): string {
  return `gigi-chat-${childId}`;
}

/**
 * Save chat to session storage (COPPA-compliant for under 13)
 */
export function saveChatToSession(childId: string, messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;

  const key = getChatStorageKey(childId);
  sessionStorage.setItem(key, JSON.stringify(messages));
}

/**
 * Load chat from session storage
 */
export function loadChatFromSession(childId: string): ChatMessage[] {
  if (typeof window === 'undefined') return [];

  const key = getChatStorageKey(childId);
  const stored = sessionStorage.getItem(key);

  if (!stored) return [];

  try {
    return JSON.parse(stored) as ChatMessage[];
  } catch {
    return [];
  }
}

/**
 * Clear chat from session storage
 */
export function clearChatSession(childId: string): void {
  if (typeof window === 'undefined') return;

  const key = getChatStorageKey(childId);
  sessionStorage.removeItem(key);
}

/**
 * AI System prompt addition for COPPA compliance
 * Add this to your AI system prompt for under-13 users
 */
export const COPPA_SYSTEM_PROMPT = `
IMPORTANT CHILD SAFETY RULES:
- NEVER ask for personal information (real name, address, school name, phone number, email)
- If a child shares personal information, acknowledge briefly but do NOT repeat it back
- Do NOT store or reference any personal details shared in previous messages
- Keep all responses focused on educational content and the lesson at hand
- If asked about personal topics, gently redirect to learning
- Be encouraging and supportive but maintain appropriate boundaries
`;

/**
 * Get appropriate system prompt based on age
 */
export function getSystemPromptForAge(basePrompt: string, gradeLevel: string): string {
  if (isUnder13(gradeLevel)) {
    return basePrompt + '\n\n' + COPPA_SYSTEM_PROMPT;
  }
  return basePrompt;
}

/**
 * Hook-style helper for React components
 * Returns everything needed for age-appropriate chat
 */
export function useChatCompliance(gradeLevel: string, childId: string) {
  const config = getChatConfig(gradeLevel);

  return {
    config,
    isUnder13: isUnder13(gradeLevel),

    // Storage methods
    saveChat: (messages: ChatMessage[]) => {
      if (config.sessionOnly) {
        saveChatToSession(childId, messages);
      }
      // For 13+, caller handles database storage
    },

    loadChat: (): ChatMessage[] => {
      if (config.sessionOnly) {
        return loadChatFromSession(childId);
      }
      return []; // For 13+, caller loads from database
    },

    clearChat: () => clearChatSession(childId),

    // Message processing
    processMessage: (text: string): string => {
      if (config.filterPII) {
        return filterPII(text);
      }
      return text;
    },

    // System prompt
    getSystemPrompt: (basePrompt: string): string => {
      return getSystemPromptForAge(basePrompt, gradeLevel);
    },
  };
}

/**
 * React hook for auto-clearing chat after inactivity
 * Use this in your chat component for under-13 users
 */
export function createInactivityTimer(
  minutes: number,
  onTimeout: () => void
): { reset: () => void; clear: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const reset = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (minutes > 0) {
      timeoutId = setTimeout(onTimeout, minutes * 60 * 1000);
    }
  };

  const clear = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  return { reset, clear };
}
