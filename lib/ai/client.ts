import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Use Claude 3 Haiku (cheaper, faster, should definitely work)
export const AI_MODEL = 'claude-3-haiku-20240307'
