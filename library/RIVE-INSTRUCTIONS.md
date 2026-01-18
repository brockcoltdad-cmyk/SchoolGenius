# RIVE INSTRUCTIONS
**Source:** SCHOOLGENIUS-MASTER-IMPLEMENTATION.md Section 10C
**Status:** NOT YET IMPLEMENTED

---

## WHAT IS RIVE

Rive is a professional animation tool used by:
- Duolingo (their learning animations)
- Google
- Microsoft
- Alibaba

**Benefits:**
- Buttery smooth 60fps vector animations
- Tiny file sizes (10-50KB per animation)
- Interactive state machines
- AI can create animations through MCP integration

---

## RIVE IS NOT

- SVG graphics
- Framer Motion
- CSS animations
- Lottie
- GIF/Video

**RIVE = `.riv` files created in Rive editor or via Rive MCP**

---

## PRICING

- **FREE** to create in editor
- **$9-14/month** to export and ship
- Get account at: https://rive.app

---

## SETUP INSTRUCTIONS

### Step 1: Install Rive Package
```bash
npm install @rive-app/react-canvas
```

### Step 2: Get Rive Account
1. Go to https://rive.app
2. Sign up (free to create)
3. Get API key from account settings
4. Upgrade to $9/month plan to export

### Step 3: Install Rive MCP Server
```bash
npm install @rive-app/mcp-server
```

### Step 4: Configure Claude to Control Rive
Create config file for MCP integration (Claude Code will set this up)

---

## AI INTEGRATION (99/1 Approach)

Rive has MCP (Model Context Protocol) integration that lets Claude control Rive to create animations automatically.

**MCP Tools Available:**
- `createStateMachine` - Build animation state machines
- `createShapes` - Generate vector shapes (circles, rectangles, paths)
- `createViewModels` - Set up data binding
- `layout` - Arrange objects

---

## PRIORITY ANIMATIONS TO CREATE WITH RIVE AI

| Priority | Animation | Subject | Description |
|----------|-----------|---------|-------------|
| 1 | Counting Objects | Math | Bouncy apples, stars, animals that appear/disappear |
| 2 | Fraction Pies | Math | Pies that animate slicing into pieces |
| 3 | Number Line Frog | Math | Character that hops along number line |
| 4 | Hand/Fingers | Math | Fingers that fold down for multiplication tricks |
| 5 | Keyboard Hands | Typing | Hands showing finger placement |
| 6 | Letter Formation | Reading | Letters that draw stroke-by-stroke |
| 7 | Word Building | Reading | Letters sliding together to form words |
| 8 | Gigi Character | All | Upgraded Gigi with smooth animations |

---

## IMPLEMENTATION ORDER

1. Get Rive account and API key
2. Install packages
3. Set up MCP integration
4. Claude AI creates animations through MCP
5. Export and integrate into SchoolGenius

---

## FILE STRUCTURE

```
/public/rive/
  counting-objects.riv
  fraction-pie.riv
  number-line.riv
  keyboard-hands.riv
  gigi-character.riv
  letter-formation.riv
  word-building.riv
  math-hands.riv
```

---

## REACT USAGE

```tsx
import { useRive } from '@rive-app/react-canvas';

function KeyboardHands({ targetKey }) {
  const { RiveComponent, rive } = useRive({
    src: '/rive/keyboard-hands.riv',
    stateMachines: 'KeyPress',
    autoplay: true,
  });

  // Trigger finger press for specific key
  useEffect(() => {
    if (rive && targetKey) {
      const inputs = rive.stateMachineInputs('KeyPress');
      const keyInput = inputs.find(i => i.name === 'targetKey');
      keyInput?.value = targetKey;
    }
  }, [rive, targetKey]);

  return <RiveComponent />;
}
```

---

## CURRENT STATUS

| Step | Status |
|------|--------|
| Package installed | YES |
| Rive account created | NO |
| MCP configured | NO |
| .riv files created | NO |
| Components using Rive | NO |

**BLOCKED:** Need Rive account and .riv files

---

## REMINDER

When I say "use Rive" I mean:
1. Open Rive editor (or use MCP)
2. Create animation
3. Export `.riv` file
4. Put in `/public/rive/`
5. Use `useRive` hook in React

NOT: Build SVG with Framer Motion and call it "Rive quality"
