import { NextRequest, NextResponse } from 'next/server'

const GROK_API_KEY = process.env.GROK_API_KEY || ''

const BLOCKED_INPUTS = [
  'sex', 'nude', 'porn', 'drug', 'kill', 'murder', 'nazi', 'hitler',
  'terrorist', 'suicide', 'racist', 'fuck', 'shit', 'blood', 'gore',
  'stripper', 'hooker', 'cocaine', 'heroin', 'meth'
]

const BLOCKED_OUTPUTS = [
  'gun', 'rifle', 'pistol', 'shoot', 'bullet', 'ammunition', 'ammo',
  'kill', 'murder', 'death', 'dead', 'blood', 'gore', 'stab', 'knife',
  'drug', 'cocaine', 'weed', 'alcohol', 'beer', 'wine', 'drunk',
  'sexy', 'nude', 'naked', 'kiss', 'romance', 'dating',
  'hell', 'damn', 'ass', 'crap'
]

function isSafeInput(input: string): boolean {
  const lower = input.toLowerCase()
  return !BLOCKED_INPUTS.some(term => lower.includes(term))
}

function sanitizeOutput(obj: any): any {
  const str = JSON.stringify(obj).toLowerCase()

  for (const term of BLOCKED_OUTPUTS) {
    if (str.includes(term)) {
      const jsonStr = JSON.stringify(obj)
      return JSON.parse(
        jsonStr
          .replace(/gun|rifle|pistol/gi, 'blaster')
          .replace(/shoot|shot/gi, 'zap')
          .replace(/bullet/gi, 'energy')
          .replace(/kill|murder/gi, 'defeat')
          .replace(/death|dead/gi, 'fallen')
          .replace(/blood/gi, 'energy')
          .replace(/stab|knife/gi, 'strike')
          .replace(/drug|cocaine|weed|heroin|meth/gi, 'potion')
          .replace(/alcohol|beer|wine|drunk/gi, 'juice')
          .replace(/sexy|nude|naked/gi, 'cool')
          .replace(/hell/gi, 'heck')
          .replace(/damn/gi, 'darn')
      )
    }
  }
  return obj
}

export async function POST(req: NextRequest) {
  try {
    const { category, characterName, studentId } = await req.json()

    if (!isSafeInput(characterName)) {
      return NextResponse.json({ error: 'Please try a different name!' }, { status: 400 })
    }

    const prompt = `You are a theme designer for SchoolGenius, a children's educational app for ages 5-12.

A child wants a custom theme inspired by: "${characterName}" (Category: ${category})

RESEARCH "${characterName}" and create a UNIQUE, COPYRIGHT-FREE, CHILD-SAFE theme.

CRITICAL SAFETY RULES - NEVER INCLUDE:
- NO guns, weapons, knives, swords that hurt people
- NO blood, gore, death, killing, murder
- NO drugs, alcohol, smoking
- NO romantic content, kissing, dating
- NO scary horror content
- NO bad words or adult language
- If the character uses guns (like Punisher, Deadpool), replace with ENERGY BLASTERS or GADGETS
- If the character is violent, focus on their HEROIC/PROTECTIVE side only
- Keep everything appropriate for a 6 year old

RULES:
- Create a GENERIC safe name (NOT "${characterName}")
- Use colors that MATCH the original (colors aren't copyrightable)
- NO trademarked names, logos, or exact symbols
- Make it feel like the character WITHOUT copying
- Keep it FUN and POSITIVE

Return ONLY valid JSON (no markdown, no explanation):

{
  "safe_name": "Generic name inspired by character",
  "description": "One fun sentence for kids",
  "icon_emoji": "One emoji",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background_start": "#hex",
    "background_end": "#hex"
  },
  "currency": {
    "name_singular": "Themed coin name",
    "name_plural": "Themed coins name",
    "symbol": "emoji"
  },
  "voice_lines": {
    "correct": "Exciting kid-friendly phrase",
    "wrong": "Encouraging kid-friendly phrase",
    "battle_won": "Victory phrase (NOT Victory Royale)"
  },
  "button_style": {
    "clip_path": "CSS clip-path for unique button shape",
    "border_radius": "CSS border-radius"
  },
  "vibe": "2-3 positive words",
  "lesson_world": {
    "background": "What lesson background looks like",
    "correct_effect": "Fun visual effect on correct answer",
    "wrong_effect": "Gentle visual effect on wrong answer"
  }
}`

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROK_API_KEY
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    })

    if (!response.ok) {
      throw new Error('Grok API failed')
    }

    const data = await response.json()
    const grokText = data.choices[0]?.message?.content || ''

    const jsonMatch = grokText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse response')
    }

    let skinSpecs = JSON.parse(jsonMatch[0])
    skinSpecs = sanitizeOutput(skinSpecs)

    const completeSkin = {
      ...skinSpecs,
      skin_id: 'custom-' + skinSpecs.safe_name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
      inspired_by: characterName,
      category: category,
      is_custom: true,
      price: 2000,
      rarity: 'legendary',
      created_at: new Date().toISOString(),
      student_id: studentId
    }

    return NextResponse.json({ success: true, skin: completeSkin })

  } catch (error) {
    console.error('Custom skin error:', error)
    return NextResponse.json({ error: 'Failed to create skin. Try again!' }, { status: 500 })
  }
}
