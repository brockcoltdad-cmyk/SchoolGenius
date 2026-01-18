# ANIMATION SPECS
## SchoolGenius Visual Effects & Animation Reference
## Created: 2026-01-16

---

# OVERVIEW

SchoolGenius uses **Framer Motion** for all animations. This document defines the exact specs for every animation in the system.

**Animation Component Location:** `components/animations/`
**Visual Component Location:** `components/lesson/visuals/`

---

# CORE ANIMATION COMPONENTS

## 1. PARTICLE SYSTEM

**File:** `components/animations/ParticleSystem.tsx`

### Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `x` | number | required | X position (pixels) |
| `y` | number | required | Y position (pixels) |
| `count` | number | 20 | Number of particles |
| `spread` | number | 100 | Spread distance |
| `duration` | number | 1500 | Total animation time (ms) |
| `onComplete` | function | - | Callback when done |

### Animation Specs
| Property | Value |
|----------|-------|
| Shapes | circle, star, square, triangle (random) |
| Size | 4-12px (random) |
| Velocity | 2-5 (random multiplier) |
| Colors | `#3b82f6` (blue), `#8b5cf6` (purple), `#ec4899` (pink), `#f59e0b` (orange), `#10b981` (green) |
| Direction | 360° radial burst from center |
| Easing | `easeOut` |

### Keyframes
```
Initial:  x, y at origin, opacity: 1, scale: 1
Animate:  x + (velocity * spread), y + (velocity * spread), opacity: 0, scale: 0
```

### Usage
```typescript
import { triggerParticles } from '@/components/animations/ParticleSystem';

// Trigger burst at click position
triggerParticles(event.clientX, event.clientY, 30);
```

---

## 2. CONFETTI

**File:** `components/animations/Confetti.tsx`

### Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `active` | boolean | required | Triggers animation |
| `onComplete` | function | - | Callback when done |

### Animation Specs
| Property | Value |
|----------|-------|
| Particle Count | 50 |
| Duration | 2-3 seconds (random per particle) |
| Total Visible Time | 3000ms |
| Colors | `#22c55e` (green), `#3b82f6` (blue), `#f59e0b` (orange), `#ec4899` (pink), `#8b5cf6` (purple), `#ef4444` (red) |
| Size | 5-15px (random) |
| Shape | circle (50%) or square with 2px radius (50%) |
| Easing | `[0.25, 0.46, 0.45, 0.94]` (custom bezier) |

### Keyframes
```
Initial:
  x: 50vw (center)
  y: 50vh (center)
  rotate: 0
  opacity: 1
  scale: 1

Animate:
  x: 50vw + random(-50vw to +50vw)
  y: 120vh (falls off screen)
  rotate: rotation * 3 (up to 1080°)
  opacity: 0
  scale: 0.5
```

### Usage
```tsx
<Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
```

---

## 3. FLOATING XP

**File:** `components/animations/FloatingXP.tsx`

### Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `amount` | number | required | Number to display |
| `x` | number | required | X position (pixels) |
| `y` | number | required | Y position (pixels) |
| `variant` | string | 'xp' | Animation style |
| `onComplete` | function | - | Callback when done |

### Variants
| Variant | Color Gradient | Icon | Prefix | Suffix |
|---------|---------------|------|--------|--------|
| `xp` | blue-400 → blue-600 | Zap | + | XP |
| `coins` | yellow-400 → yellow-600 | Sparkles | + | coins |
| `stars` | purple-400 → purple-600 | Star | + | star emoji |
| `achievement` | green-400 → green-600 | Trophy | (none) | Achievement! |
| `combo` | orange-400 → red-600 | Target | (none) | x COMBO! |

### Animation Specs
| Property | Value |
|----------|-------|
| Duration | 2000ms |
| Y Travel | -100px (floats upward) |
| Easing | `[0.34, 1.56, 0.64, 1]` (springy bezier) |

### Keyframes
```
opacity: [0, 1, 1, 0]        // Fade in, hold, fade out
scale:   [0.5, 1.2, 1, 0.8]  // Bounce in, settle, shrink out
y:       0 → -100px          // Float upward
```

### Glow Effect
```
scale: [1, 1.5, 2]
duration: 2000ms
blur: xl
opacity: 50%
```

### Usage
```typescript
import { triggerXPGain } from '@/components/animations/FloatingXP';

// Trigger floating +10 XP at position
triggerXPGain(10, event.clientX, event.clientY, 'xp');

// Trigger coin animation
triggerXPGain(5, x, y, 'coins');
```

---

## 4. GIGI CHARACTER

**File:** `components/animations/GigiCharacter.tsx`

### Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Character size |
| `showGreeting` | boolean | false | Show greeting bubble |
| `showName` | boolean | true | Show character name |
| `className` | string | '' | Additional CSS classes |

### Size Classes
| Size | Tailwind Class |
|------|---------------|
| sm | text-4xl |
| md | text-6xl |
| lg | text-8xl |
| xl | text-9xl |

### 5 Idle Animations

#### Bounce
```javascript
keyframes: { y: [0, -20, 0] }
duration: 2s
repeat: Infinity
ease: easeInOut
```

#### Float
```javascript
keyframes: { y: [0, -15, 0] }
duration: 3s
repeat: Infinity
ease: easeInOut
```

#### Pulse
```javascript
keyframes: { scale: [1, 1.1, 1] }
duration: 2s
repeat: Infinity
ease: easeInOut
```

#### Sway
```javascript
keyframes: { rotate: [-5, 5, -5] }  // degrees
duration: 3s
repeat: Infinity
ease: easeInOut
```

#### Spin
```javascript
keyframes: { rotate: [0, 360] }
duration: 4s
repeat: Infinity
ease: linear
```

### Theme Entry Animation
```javascript
initial: { scale: 0, rotate: -180, opacity: 0 }
animate: { scale: 1, rotate: 0, opacity: 1 }
exit:    { scale: 0, rotate: 180, opacity: 0 }
transition: { type: 'spring', damping: 15 }
```

### Click-to-Spin Interaction
```javascript
animate: { rotate: 360 }
duration: 1s
ease: easeInOut
```

### Background Glow
```javascript
keyframes: {
  scale: [1, 1.2, 1]
  opacity: [0.3, 0.5, 0.3]
}
duration: 3s
repeat: Infinity
ease: easeInOut
blur: 2xl (blur-2xl)
```

### Theme Animation Assignments
| Theme | Idle Animation | Background Effect |
|-------|---------------|-------------------|
| dinosaur | bounce | volcano emoji |
| space | float | stars |
| unicorn | float | sparkles |
| fairy | float | sparkles |
| wwe | bounce | pyro |
| slime | bounce | bubbles |
| pirate | sway | - |
| shark | sway | - |
| mermaid | sway | - |
| robot | pulse | - |
| ninja | pulse | - |
| anime | pulse | - |
| hero | float | - |
| princess | float | - |
| cube | spin | - |
| candy | spin | - |

---

# LESSON VISUAL ANIMATIONS

## 5. EQUATION STEPS VISUAL

**File:** `components/lesson/visuals/EquationStepsVisual.tsx`

### Data Format
```typescript
interface EquationStepsVisualData {
  steps: string[];  // Array of equation steps
}
```

### Animation Specs
| Property | Value |
|----------|-------|
| Step Delay | 800ms between each step |
| Transition Duration | 700ms |
| Slide Direction | translateX: -8px → 0 |
| Opacity | 0 → 1 |
| Border Animation | transparent → indigo-500 |

### Keyframes (per step)
```css
/* Hidden state */
opacity: 0;
transform: translateX(-8px);
border-color: transparent;

/* Visible state */
opacity: 1;
transform: translateX(0);
border-color: indigo-500;
transition: all 700ms;
```

### Completion Animation
```
Element: "Solution Complete!" badge
Animation: animate-bounce (Tailwind)
Trigger: When all steps visible
```

---

## 6. NUMBER LINE VISUAL

**File:** `components/lesson/visuals/NumberLineVisual.tsx`

### Data Format
```typescript
interface NumberLineVisualData {
  min: number;           // Left end of number line
  max: number;           // Right end of number line
  start: number;         // Starting position
  hops: Hop[];           // Array of movements
  character?: string;    // Emoji character (default: frog)
  show_result?: boolean; // Show answer at end
}

interface Hop {
  direction: 'right' | 'left';
  amount: number;
}
```

### Animation Specs
| Property | Value |
|----------|-------|
| Hop Interval | 1200ms between hops |
| Character | Default: frog emoji |
| Hop Height | -30px (jumps up) |
| Hop Duration | 400ms |

### Character Movement
```javascript
animate: { left: `${position}%` }
transition: {
  type: 'spring',
  stiffness: 100,
  damping: 15
}
```

### Jump Animation (during hop)
```javascript
keyframes: { y: [0, -30, 0] }
duration: 400ms
```

### Arc Drawing (SVG path)
```javascript
// Right hop
d: "M 0 40 Q 50 0 100 40"

// Left hop
d: "M 100 40 Q 50 0 0 40"

initial: { pathLength: 0 }
animate: { pathLength: 1 }
duration: 400ms
stroke: #22c55e (green-500)
strokeWidth: 3
```

### Result Reveal
```javascript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
```

---

## 7. VISUAL LESSON PLAYER

**File:** `components/lesson/VisualLessonPlayer.tsx`

### Props
```typescript
interface VisualLessonPlayerProps {
  lessonTitle: string;
  lessonSubtitle?: string;
  steps: VisualStep[];
  onComplete?: () => void;
  autoPlay?: boolean;        // default: true
  showSubtitles?: boolean;   // default: true
  theme?: {
    primaryColor?: string;   // default: 'blue'
    secondaryColor?: string; // default: 'purple'
  };
}
```

### Step Format
```typescript
interface VisualStep {
  step: number;
  visual: {
    type: string;  // Visual component type
    data: any;     // Visual-specific data
  };
  voice_text: string;    // Subtitle/narration text
  audio_url?: string;    // TTS audio file
  duration?: number;     // Fallback duration (default: 3000ms)
}
```

### Animation Specs
| Property | Value |
|----------|-------|
| Step Transition Delay | 500ms |
| Default Step Duration | 3000ms (if no audio) |

### Step Transition
```javascript
// Enter
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.3 }

// Exit
exit: { opacity: 0, scale: 1.05 }
transition: { duration: 0.3 }
```

### Progress Bar
```javascript
initial: { width: 0 }
animate: { width: `${progress}%` }
transition: { duration: 0.3 }
```

### Step Dots
```css
/* Current step */
background: blue-500;
transform: scale(1.25);

/* Completed step */
background: green-400;

/* Future step */
background: gray-300;

transition: all 300ms;
```

### 21 Supported Visual Types
```typescript
const VISUAL_COMPONENTS = {
  // Reading (5)
  letter: LetterVisual,
  phonics: PhonicsVisual,
  word_building: WordBuildingVisual,
  sight_word: SightWordVisual,
  syllable: SyllableVisual,

  // Math (9)
  counting_objects: CountingObjectsVisual,
  number_line: NumberLineVisual,
  place_value: PlaceValueVisual,
  array: ArrayVisual,
  fraction: FractionVisual,
  bar_model: BarModelVisual,
  balance_scale: BalanceScaleVisual,
  equation_steps: EquationStepsVisual,
  graph: GraphVisual,

  // Spelling (1)
  spelling_rule: SpellingRuleVisual,

  // Writing (1)
  sentence_builder: SentenceBuilderVisual,

  // Typing (1)
  keyboard: KeyboardVisual,

  // Coding (5)
  code_block: CodeBlockVisual,
  variable_box: VariableBoxVisual,
  loop_animation: LoopAnimationVisual,
  conditional: ConditionalVisual,
  output: OutputVisual,
};
```

---

# TIER1/TIER2 VISUAL SPECS

## Format in Database

### tier1 Step Structure
```json
{
  "teach": "Use the finger trick. Fold finger 7. Count before and after.",
  "steps": [
    {
      "step": 1,
      "visual": {
        "type": "hands",
        "data": { "fold_finger": 7 }
      },
      "voice_text": "Fold finger 7. Count 6 before, 3 after. 63!",
      "duration": 4000
    }
  ]
}
```

### tier2 Step Structure (Simpler)
```json
{
  "teach": "9 x 7 = 63. Just like 9 x 3 = 27, add 36 more.",
  "steps": [
    {
      "step": 1,
      "visual": {
        "type": "hands",
        "data": {
          "fold_finger": 5,
          "labels": true,
          "arrows": true,
          "simplified": true
        }
      },
      "voice_text": "The answer is 45.",
      "duration": 4000
    }
  ]
}
```

### Key Differences
| Property | tier1 | tier2 |
|----------|-------|-------|
| Text Length | Max 25 words | Max 20 words |
| Voice Length | Max 20 words | Max 15 words |
| Visual Detail | Standard | Simplified |
| Extra Aids | No | labels, arrows, highlights |
| Complexity | Full explanation | Bare essentials |

---

# ADDITIONAL ANIMATION COMPONENTS

## Quick Reference

| Component | File | Purpose |
|-----------|------|---------|
| `AgeCelebration` | AgeCelebration.tsx | Age-appropriate celebration modal |
| `CoinBurst` | CoinBurst.tsx | Coins exploding from point |
| `CelebrationOverlay` | CelebrationOverlay.tsx | Full-screen celebration effect |
| `ThemeSwitchEffect` | ThemeSwitchEffect.tsx | Transition between themes |
| `PulseGlow` | PulseGlow.tsx | Glowing pulse wrapper |
| `FloatingCoins` | FloatingCoins.tsx | Coins floating upward |
| `SuccessRipple` | SuccessRipple.tsx | Ripple effect on success |
| `AnimatedCounter` | AnimatedCounter.tsx | Number counting up/down |
| `MagicPageTransition` | MagicPageTransition.tsx | Page transition wrapper |
| `DisneyHeader` | DisneyHeader.tsx | Animated header component |
| `ThemeLoader` | ThemeLoader.tsx | Theme loading spinner |
| `PremiumLoader` | PremiumLoader.tsx | Premium loading animation |
| `ShimmerEffect` | ShimmerEffect.tsx | Loading shimmer overlay |
| `PageTransition` | PageTransition.tsx | Basic page transitions |
| `AdvancedPageTransition` | AdvancedPageTransition.tsx | Complex page transitions |
| `GigiExpressions` | GigiExpressions.tsx | Gigi facial expressions |
| `MagneticCursor` | MagneticCursor.tsx | Cursor attraction effect |
| `LoadingAnimation` | LoadingAnimation.tsx | Generic loading spinner |

---

# TIMING REFERENCE

## Duration Summary

| Animation | Duration | Notes |
|-----------|----------|-------|
| Confetti | 3000ms | Full animation |
| Particle System | 1500ms | Default |
| Floating XP | 2000ms | Float + fade |
| Gigi Bounce | 2000ms | Loop |
| Gigi Float | 3000ms | Loop |
| Gigi Pulse | 2000ms | Loop |
| Gigi Sway | 3000ms | Loop |
| Gigi Spin | 4000ms | Loop |
| Gigi Click Spin | 1000ms | One-shot |
| Theme Entry | spring | ~500ms |
| Equation Step Reveal | 800ms | Between steps |
| Equation Step Transition | 700ms | Slide in |
| Number Line Hop | 1200ms | Between hops |
| Number Line Jump | 400ms | Up and down |
| Visual Step Default | 3000ms | If no audio |
| Visual Step Transition | 300ms | Fade/scale |
| Progress Bar | 300ms | Width change |
| Step Dot | 300ms | Color/scale |

---

# EASING REFERENCE

## Common Easing Functions Used

| Name | Value | Use Case |
|------|-------|----------|
| easeOut | `easeOut` | Particles dispersing |
| easeInOut | `easeInOut` | Gigi idle animations |
| linear | `linear` | Gigi spin |
| spring | `{ type: 'spring', damping: 15 }` | Theme entry |
| confetti | `[0.25, 0.46, 0.45, 0.94]` | Confetti fall |
| bounce | `[0.34, 1.56, 0.64, 1]` | Floating XP |

---

# USAGE EXAMPLES

## Trigger Celebration on Correct Answer
```typescript
import { triggerParticles } from '@/components/animations/ParticleSystem';
import { triggerXPGain } from '@/components/animations/FloatingXP';

function handleCorrectAnswer(event: MouseEvent) {
  const x = event.clientX;
  const y = event.clientY;

  // Burst particles
  triggerParticles(x, y, 30);

  // Show floating coins
  triggerXPGain(5, x, y, 'coins');
}
```

## Show Confetti on Quiz Pass
```tsx
import Confetti from '@/components/animations/Confetti';

function QuizComplete({ passed }: { passed: boolean }) {
  const [showConfetti, setShowConfetti] = useState(passed);

  return (
    <>
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <div>You {passed ? 'passed' : 'need more practice'}!</div>
    </>
  );
}
```

## Display Gigi with Theme Animation
```tsx
import GigiCharacter from '@/components/animations/GigiCharacter';

function Dashboard() {
  return (
    <GigiCharacter
      size="lg"
      showGreeting={true}
      showName={true}
    />
  );
}
```

## Play Visual Lesson
```tsx
import VisualLessonPlayer from '@/components/lesson/VisualLessonPlayer';

const steps = [
  {
    step: 1,
    visual: { type: 'number_line', data: { min: 0, max: 10, start: 3, hops: [{ direction: 'right', amount: 4 }] } },
    voice_text: 'Start at 3 and hop 4 to the right.',
    duration: 4000
  },
  {
    step: 2,
    visual: { type: 'equation_steps', data: { steps: ['3 + 4', '= 7'] } },
    voice_text: '3 plus 4 equals 7!',
    duration: 3000
  }
];

<VisualLessonPlayer
  lessonTitle="Adding Numbers"
  steps={steps}
  onComplete={() => console.log('Lesson complete!')}
/>
```

---

# END OF ANIMATION SPECS
## Created: 2026-01-16
## For: SchoolGenius Development Reference
