'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ArrowLeft, Trophy, Star, CheckCircle, XCircle, Play,
  Lightbulb, ChevronRight, Code, Blocks, SkipForward,
  RefreshCw, Terminal, Puzzle, Rocket
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCodingLesson } from '@/hooks/useCodingLesson';

/**
 * CODING LESSON PLAYER
 *
 * Following MASTER-RULES-CHECKLIST:
 * - Rules First: Explain concept before coding
 * - Age Appropriate:
 *   - K-2: Visual blocks (Scratch Jr style - drag & drop)
 *   - 3-5: Block puzzles with more complexity
 *   - 6-8: Intro Python (fill-in-the-blank + run)
 *   - 9-12: Real Python with functions
 * - 6-Level Hints when stuck
 * - Run code and see output
 * - Theme feedback (uses kid's theme)
 */

// ============================================================
// TYPES
// ============================================================

type CodingMode = 'blocks' | 'python';
type LessonPhase = 'rules' | 'demo' | 'guided' | 'practice' | 'complete';

interface CodeBlock {
  id: string;
  type: 'action' | 'loop' | 'conditional' | 'variable' | 'output';
  text: string;
  color: string;
  icon: string;
}

interface BlockChallenge {
  instruction: string;
  availableBlocks: CodeBlock[];
  correctSequence: string[]; // IDs in correct order
  hints: string[];
  output: string;
}

interface PythonChallenge {
  concept: string;
  instruction: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  testCases?: { input: string; expected: string }[];
}

interface CodingLesson {
  id: string;
  grade: number;
  topic: string;
  mode: CodingMode;
  rule: string;
  ruleExplanation: string;
  demoCode: string;
  demoOutput: string;
  challenges: (BlockChallenge | PythonChallenge)[];
}

interface CodingLessonPlayerProps {
  childId: string;
  grade: number;
  lessonId?: string;
  theme?: string;
  onComplete?: (score: number, total: number) => void;
  onBack?: () => void;
}

// ============================================================
// LESSON CONTENT BY GRADE
// ============================================================

const CODING_LESSONS: Record<number, CodingLesson[]> = {
  // Kindergarten - K - Simple sequences with blocks
  0: [
    {
      id: 'k-sequences-1',
      grade: 0,
      topic: 'Making Things Move',
      mode: 'blocks',
      rule: 'Steps in Order',
      ruleExplanation: 'A program is like a recipe! We tell the computer what to do, step by step. First this, then that! The computer follows our instructions in ORDER.',
      demoCode: '1. Move Right\n2. Jump\n3. Wave',
      demoOutput: '🐱 walks right → jumps → waves!',
      challenges: [
        {
          instruction: 'Make the cat walk to the fish! Put the blocks in order.',
          availableBlocks: [
            { id: 'move', type: 'action', text: 'Move Right', color: 'bg-blue-500', icon: '➡️' },
            { id: 'pick', type: 'action', text: 'Pick Up Fish', color: 'bg-green-500', icon: '🐟' },
          ],
          correctSequence: ['move', 'pick'],
          hints: ['First, the cat needs to move!', 'After moving, pick up the fish'],
          output: '🐱 walks right → picks up 🐟!'
        },
        {
          instruction: 'Make the cat jump over the rock and say meow!',
          availableBlocks: [
            { id: 'jump', type: 'action', text: 'Jump Up', color: 'bg-purple-500', icon: '⬆️' },
            { id: 'meow', type: 'output', text: 'Say Meow', color: 'bg-pink-500', icon: '😺' },
          ],
          correctSequence: ['jump', 'meow'],
          hints: ['The cat needs to jump first!', 'After jumping, make it say meow'],
          output: '🐱 jumps → says "Meow!"'
        }
      ] as BlockChallenge[]
    }
  ],

  // Grade 1 - More complex sequences
  1: [
    {
      id: 'g1-sequences-1',
      grade: 1,
      topic: 'Following Steps',
      mode: 'blocks',
      rule: 'Order Matters',
      ruleExplanation: 'Programs run step by step, from top to bottom. If we put steps in the wrong order, things go wrong! Imagine putting on socks AFTER shoes - silly!',
      demoCode: '1. Wake Up\n2. Brush Teeth\n3. Eat Breakfast',
      demoOutput: '😊 wakes up → brushes teeth → eats breakfast!',
      challenges: [
        {
          instruction: 'Help the robot get the star! Move right twice, then grab the star.',
          availableBlocks: [
            { id: 'move1', type: 'action', text: 'Move Right', color: 'bg-blue-500', icon: '➡️' },
            { id: 'move2', type: 'action', text: 'Move Right', color: 'bg-blue-500', icon: '➡️' },
            { id: 'grab', type: 'action', text: 'Grab Star', color: 'bg-yellow-500', icon: '⭐' },
          ],
          correctSequence: ['move1', 'move2', 'grab'],
          hints: ['Start by moving right', 'Move right again', 'Now grab the star!'],
          output: '🤖 moves → moves → grabs ⭐!'
        }
      ] as BlockChallenge[]
    }
  ],

  // Grade 2 - Introducing loops
  2: [
    {
      id: 'g2-loops-1',
      grade: 2,
      topic: 'Loops - Repeat Actions',
      mode: 'blocks',
      rule: 'Repeat Blocks Save Time',
      ruleExplanation: 'A LOOP lets us repeat things without writing them over and over! Instead of "Jump, Jump, Jump", we can say "Repeat 3 times: Jump". Much easier!',
      demoCode: 'Repeat 3 times:\n  → Jump',
      demoOutput: '🐸 jumps 3 times!',
      challenges: [
        {
          instruction: 'Make the frog hop 3 times using a loop!',
          availableBlocks: [
            { id: 'loop3', type: 'loop', text: 'Repeat 3 times', color: 'bg-orange-500', icon: '🔄' },
            { id: 'hop', type: 'action', text: 'Hop', color: 'bg-green-500', icon: '🦘' },
          ],
          correctSequence: ['loop3', 'hop'],
          hints: ['First set up the loop', 'Put the hop inside the loop'],
          output: '🐸 hops → hops → hops!'
        }
      ] as BlockChallenge[]
    }
  ],

  // Grade 3 - Conditionals (if/then)
  3: [
    {
      id: 'g3-conditionals-1',
      grade: 3,
      topic: 'If This, Then That',
      mode: 'blocks',
      rule: 'Making Decisions',
      ruleExplanation: 'Programs can make CHOICES! We use IF to check something, THEN do an action. "IF it\'s raining, THEN take an umbrella." The computer decides what to do!',
      demoCode: 'IF touching water:\n  → Say "Splash!"',
      demoOutput: '🚶 touches water → says "Splash!"',
      challenges: [
        {
          instruction: 'Make the character take an umbrella IF it\'s raining!',
          availableBlocks: [
            { id: 'if-rain', type: 'conditional', text: 'IF Raining', color: 'bg-indigo-500', icon: '🌧️' },
            { id: 'umbrella', type: 'action', text: 'Take Umbrella', color: 'bg-cyan-500', icon: '☂️' },
          ],
          correctSequence: ['if-rain', 'umbrella'],
          hints: ['Check the condition first', 'Then do the action'],
          output: '🌧️ is raining → takes ☂️!'
        }
      ] as BlockChallenge[]
    }
  ],

  // Grade 4-5 - Variables with blocks
  4: [
    {
      id: 'g4-variables-1',
      grade: 4,
      topic: 'Variables - Storing Information',
      mode: 'blocks',
      rule: 'Variables Are Boxes',
      ruleExplanation: 'A VARIABLE is like a labeled box that stores information. We can put a number, word, or anything inside! "score = 10" means the box called "score" holds 10.',
      demoCode: 'Set score to 0\nAdd 5 to score\nShow score',
      demoOutput: 'Score: 5',
      challenges: [
        {
          instruction: 'Set the score to 10, then show it!',
          availableBlocks: [
            { id: 'set-score', type: 'variable', text: 'Set score = 10', color: 'bg-red-500', icon: '📦' },
            { id: 'show', type: 'output', text: 'Show score', color: 'bg-yellow-500', icon: '📺' },
          ],
          correctSequence: ['set-score', 'show'],
          hints: ['First set the score', 'Then display it'],
          output: 'Score: 10'
        }
      ] as BlockChallenge[]
    }
  ],

  // Grade 5 - Transition to Python (still visual)
  5: [
    {
      id: 'g5-python-intro-1',
      grade: 5,
      topic: 'Your First Python Code',
      mode: 'blocks',
      rule: 'Writing Real Code',
      ruleExplanation: 'Python is a real programming language! Instead of dragging blocks, we TYPE our instructions. print("Hello") tells the computer to show "Hello" on screen.',
      demoCode: 'print("Hello World!")',
      demoOutput: 'Hello World!',
      challenges: [
        {
          instruction: 'Arrange the code blocks to print your name!',
          availableBlocks: [
            { id: 'print', type: 'output', text: 'print(', color: 'bg-blue-500', icon: '📝' },
            { id: 'name', type: 'variable', text: '"Alex"', color: 'bg-green-500', icon: '👤' },
            { id: 'close', type: 'output', text: ')', color: 'bg-blue-500', icon: '✓' },
          ],
          correctSequence: ['print', 'name', 'close'],
          hints: ['Start with print(', 'Add your name in quotes', 'Close with )'],
          output: 'Alex'
        }
      ] as BlockChallenge[]
    }
  ],

  // Grade 6 - Real Python intro
  6: [
    {
      id: 'g6-python-basics-1',
      grade: 6,
      topic: 'Python Variables',
      mode: 'python',
      rule: 'Storing Data in Variables',
      ruleExplanation: 'In Python, we create variables with the = sign. The variable name goes on the left, the value goes on the right. name = "Alex" stores "Alex" in a box called name.',
      demoCode: 'name = "Coder"\nprint("Hello, " + name)',
      demoOutput: 'Hello, Coder',
      challenges: [
        {
          concept: 'Variables',
          instruction: 'Create a variable called age and set it to your age. Then print it!',
          starterCode: '# Create a variable called age\nage = ___\n\n# Print the age\nprint(age)',
          solution: 'age = 12\nprint(age)',
          expectedOutput: '12',
          hints: [
            'Replace ___ with a number',
            'age = 12 would store 12 in age',
            'Numbers don\'t need quotes'
          ]
        }
      ] as PythonChallenge[]
    }
  ],

  // Grade 7 - Python loops
  7: [
    {
      id: 'g7-python-loops-1',
      grade: 7,
      topic: 'Python Loops',
      mode: 'python',
      rule: 'Repeating with For Loops',
      ruleExplanation: 'A for loop repeats code a specific number of times. "for i in range(5):" runs the indented code 5 times. i counts from 0 to 4.',
      demoCode: 'for i in range(3):\n    print("Hello!")',
      demoOutput: 'Hello!\nHello!\nHello!',
      challenges: [
        {
          concept: 'For Loops',
          instruction: 'Write a loop that prints "Go!" 5 times.',
          starterCode: '# Write a for loop\nfor i in range(___):\n    print("Go!")',
          solution: 'for i in range(5):\n    print("Go!")',
          expectedOutput: 'Go!\nGo!\nGo!\nGo!\nGo!',
          hints: [
            'range(5) means 5 times',
            'Replace ___ with the number of times',
            'The code inside the loop will repeat'
          ]
        }
      ] as PythonChallenge[]
    }
  ],

  // Grade 8 - Functions
  8: [
    {
      id: 'g8-python-functions-1',
      grade: 8,
      topic: 'Python Functions',
      mode: 'python',
      rule: 'Creating Reusable Code',
      ruleExplanation: 'A function is a named block of code you can use over and over. We define it with "def function_name():" and call it with "function_name()". Like a recipe you can follow anytime!',
      demoCode: 'def greet():\n    print("Hello!")\n\ngreet()\ngreet()',
      demoOutput: 'Hello!\nHello!',
      challenges: [
        {
          concept: 'Functions',
          instruction: 'Complete the function that says "Welcome!" then call it.',
          starterCode: '# Define the function\ndef welcome():\n    print("___")\n\n# Call the function\nwelcome()',
          solution: 'def welcome():\n    print("Welcome!")\n\nwelcome()',
          expectedOutput: 'Welcome!',
          hints: [
            'Put the message inside the quotes',
            'The function prints something',
            'welcome() calls the function'
          ]
        }
      ] as PythonChallenge[]
    }
  ],

  // Grade 9-12 - Advanced Python
  9: [
    {
      id: 'g9-python-advanced-1',
      grade: 9,
      topic: 'Lists and Data',
      mode: 'python',
      rule: 'Working with Collections',
      ruleExplanation: 'A list stores multiple values in one variable. We use square brackets: numbers = [1, 2, 3]. We can loop through lists to process each item.',
      demoCode: 'scores = [90, 85, 95]\nfor score in scores:\n    print(score)',
      demoOutput: '90\n85\n95',
      challenges: [
        {
          concept: 'Lists',
          instruction: 'Create a list of 3 colors and print each one.',
          starterCode: '# Create a list of colors\ncolors = [___]\n\n# Print each color\nfor color in colors:\n    print(color)',
          solution: 'colors = ["red", "blue", "green"]\nfor color in colors:\n    print(color)',
          expectedOutput: 'red\nblue\ngreen',
          hints: [
            'List items are separated by commas',
            'Strings need quotes: "red", "blue"',
            'Put three colors inside the brackets'
          ]
        }
      ] as PythonChallenge[]
    }
  ]
};

// Copy lessons for grades 10-12 (same advanced content)
CODING_LESSONS[10] = CODING_LESSONS[9];
CODING_LESSONS[11] = CODING_LESSONS[9];
CODING_LESSONS[12] = CODING_LESSONS[9];

// ============================================================
// BLOCK EDITOR COMPONENT (K-5)
// ============================================================

interface BlockEditorProps {
  challenge: BlockChallenge;
  onComplete: (success: boolean) => void;
  onHint: () => void;
  theme: string;
}

function BlockEditor({ challenge, onComplete, onHint, theme }: BlockEditorProps) {
  const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>(challenge.availableBlocks);
  const [sequence, setSequence] = useState<CodeBlock[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reset when challenge changes
  useEffect(() => {
    setAvailableBlocks([...challenge.availableBlocks]);
    setSequence([]);
    setShowOutput(false);
    setIsCorrect(null);
  }, [challenge]);

  const addBlock = (block: CodeBlock) => {
    setSequence([...sequence, block]);
    setAvailableBlocks(availableBlocks.filter(b => b.id !== block.id));
  };

  const removeBlock = (block: CodeBlock) => {
    setSequence(sequence.filter(b => b.id !== block.id));
    setAvailableBlocks([...availableBlocks, block]);
  };

  const runCode = () => {
    setShowOutput(true);
    const sequenceIds = sequence.map(b => b.id);
    const correct = JSON.stringify(sequenceIds) === JSON.stringify(challenge.correctSequence);
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => onComplete(true), 1500);
    }
  };

  const reset = () => {
    setAvailableBlocks([...challenge.availableBlocks]);
    setSequence([]);
    setShowOutput(false);
    setIsCorrect(null);
  };

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-2 text-lg font-bold text-blue-700 dark:text-blue-300">
          <Puzzle className="w-6 h-6" />
          {challenge.instruction}
        </div>
      </div>

      {/* Available Blocks */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
          Drag blocks to build your code:
        </p>
        <div className="flex flex-wrap gap-3">
          {availableBlocks.map((block) => (
            <motion.button
              key={block.id}
              onClick={() => addBlock(block)}
              className={`${block.color} text-white px-4 py-3 rounded-xl font-bold
                shadow-lg hover:scale-105 transition-transform flex items-center gap-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{block.icon}</span>
              {block.text}
            </motion.button>
          ))}
          {availableBlocks.length === 0 && (
            <p className="text-gray-400 italic">All blocks used!</p>
          )}
        </div>
      </div>

      {/* Code Sequence */}
      <div className="bg-gray-900 p-4 rounded-xl min-h-[120px]">
        <p className="text-gray-400 text-sm mb-3">Your Code:</p>
        <div className="space-y-2">
          {sequence.length === 0 ? (
            <p className="text-gray-500 italic">Click blocks above to add them here...</p>
          ) : (
            sequence.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${block.color} text-white px-4 py-2 rounded-lg font-medium
                  flex items-center justify-between`}
              >
                <span className="flex items-center gap-2">
                  <span className="bg-black/20 px-2 py-0.5 rounded text-sm">{index + 1}</span>
                  <span className="text-lg">{block.icon}</span>
                  {block.text}
                </span>
                <button
                  onClick={() => removeBlock(block)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Output */}
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${
              isCorrect
                ? 'bg-green-50 border-green-500 dark:bg-green-900/30'
                : 'bg-red-50 border-red-500 dark:bg-red-900/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5" />
              <span className="font-bold">Output:</span>
            </div>
            <p className="text-lg">{isCorrect ? challenge.output : 'Hmm, that doesn\'t look right. Try again!'}</p>
            {isCorrect && (
              <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">Perfect! Great coding!</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button
          onClick={runCode}
          disabled={sequence.length === 0}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400
            text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-6 h-6" />
          Run Code!
        </motion.button>
        <motion.button
          onClick={reset}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
            px-4 py-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={onHint}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-4 rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Lightbulb className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}

// ============================================================
// PYTHON EDITOR COMPONENT (6-12)
// ============================================================

interface PythonEditorProps {
  challenge: PythonChallenge;
  onComplete: (success: boolean) => void;
  onHint: () => void;
  theme: string;
}

function PythonEditor({ challenge, onComplete, onHint, theme }: PythonEditorProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Reset when challenge changes
  useEffect(() => {
    setCode(challenge.starterCode);
    setOutput(null);
    setIsCorrect(null);
  }, [challenge]);

  // Simple Python execution (simulated for safety)
  const runCode = () => {
    setIsRunning(true);

    // Simulate running Python code
    setTimeout(() => {
      // Check if code is close enough to solution
      const normalizedCode = code.replace(/\s+/g, ' ').trim().toLowerCase();
      const normalizedSolution = challenge.solution.replace(/\s+/g, ' ').trim().toLowerCase();

      // Very basic check - in production would use actual Python sandbox
      const isMatch =
        normalizedCode.includes(challenge.expectedOutput.toLowerCase()) ||
        // Check for key elements
        challenge.solution.split('\n').every(line => {
          const keyPart = line.replace(/[^a-z0-9]/gi, '');
          return keyPart.length < 3 || normalizedCode.includes(keyPart.toLowerCase());
        });

      setIsCorrect(isMatch);
      setOutput(isMatch ? challenge.expectedOutput : 'Error: Check your code and try again!');
      setIsRunning(false);

      if (isMatch) {
        setTimeout(() => onComplete(true), 1500);
      }
    }, 1000);
  };

  const showSolution = () => {
    setCode(challenge.solution);
  };

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-2 text-lg font-bold text-purple-700 dark:text-purple-300">
          <Code className="w-6 h-6" />
          {challenge.instruction}
        </div>
      </div>

      {/* Code Editor */}
      <div className="rounded-xl overflow-hidden border-2 border-gray-700">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-sm ml-2">main.py</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-gray-900 text-green-400 font-mono p-4 min-h-[200px]
            focus:outline-none resize-none text-lg"
          spellCheck={false}
        />
      </div>

      {/* Output */}
      <AnimatePresence>
        {output !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl overflow-hidden border-2 ${
              isCorrect
                ? 'border-green-500'
                : 'border-red-500'
            }`}
          >
            <div className={`px-4 py-2 flex items-center gap-2 ${
              isCorrect ? 'bg-green-600' : 'bg-red-600'
            } text-white`}>
              <Terminal className="w-5 h-5" />
              <span className="font-bold">Output</span>
            </div>
            <div className="bg-black p-4">
              <pre className="text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
            {isCorrect && (
              <div className="bg-green-100 dark:bg-green-900/30 p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700 dark:text-green-400">
                  Excellent coding! Your code works!
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button
          onClick={runCode}
          disabled={isRunning}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400
            text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Run Code
            </>
          )}
        </motion.button>
        <motion.button
          onClick={onHint}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-4 rounded-xl
            flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Lightbulb className="w-6 h-6" />
          Hint
        </motion.button>
        <motion.button
          onClick={showSolution}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl
            flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Code className="w-6 h-6" />
          Show Answer
        </motion.button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN LESSON PLAYER COMPONENT
// ============================================================

export default function CodingLessonPlayer({
  childId,
  grade,
  lessonId,
  theme = 'default',
  onComplete,
  onBack
}: CodingLessonPlayerProps) {
  const supabase = createClient();

  // NEW: Fetch lessons from database (with fallback to hardcoded)
  const { lessons: dbLessons, loading: dbLoading, error: dbError } = useCodingLesson(grade);

  // Lesson state
  const [lesson, setLesson] = useState<CodingLesson | null>(null);
  const [phase, setPhase] = useState<LessonPhase>('rules');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load lesson - prefer database, fallback to hardcoded
  useEffect(() => {
    if (dbLoading) return;

    // Try database lessons first
    if (dbLessons && dbLessons.length > 0) {
      const selectedLesson = lessonId
        ? dbLessons.find(l => l.id === lessonId) || dbLessons[0]
        : dbLessons[0];
      console.log(`✅ Using DATABASE coding: ${selectedLesson.topic} (grade ${grade})`);
      setLesson(selectedLesson);
      setIsLoading(false);
    } else {
      // Fallback to hardcoded CODING_LESSONS
      const gradeLessons = CODING_LESSONS[grade] || CODING_LESSONS[5];
      const selectedLesson = lessonId
        ? gradeLessons.find(l => l.id === lessonId) || gradeLessons[0]
        : gradeLessons[0];
      console.log(`⚠️ Using HARDCODED coding: ${selectedLesson.topic} (grade ${grade})`);
      if (dbError) console.log(`   DB Error: ${dbError}`);
      setLesson(selectedLesson);
      setIsLoading(false);
    }
  }, [grade, lessonId, dbLessons, dbLoading, dbError]);

  // Get current challenge
  const getCurrentChallenge = useCallback(() => {
    if (!lesson) return null;
    return lesson.challenges[currentChallenge];
  }, [lesson, currentChallenge]);

  // Get hint for current challenge
  const getCurrentHints = useCallback(() => {
    const challenge = getCurrentChallenge();
    if (!challenge) return [];
    return challenge.hints;
  }, [getCurrentChallenge]);

  // Handle challenge completion
  const handleChallengeComplete = (success: boolean) => {
    if (success) {
      setScore(score + 1);
    }

    // Move to next challenge or complete
    if (lesson && currentChallenge < lesson.challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setHintLevel(0);
      setShowHint(false);
    } else {
      // Lesson complete
      handleLessonComplete();
    }
  };

  // Handle hint request
  const handleHintRequest = () => {
    const hints = getCurrentHints();
    if (hintLevel < hints.length) {
      setShowHint(true);
      setHintLevel(Math.min(hintLevel + 1, hints.length));
    }
  };

  // Handle lesson completion
  const handleLessonComplete = async () => {
    setPhase('complete');

    // Save progress
    try {
      await supabase
        .from('learning_progress')
        .upsert({
          child_id: childId,
          subject: 'coding',
          skill_id: lesson?.id || 'unknown',
          score: score,
          total: lesson?.challenges.length || 0,
          completed_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving progress:', error);
    }

    if (onComplete) {
      onComplete(score, lesson?.challenges.length || 0);
    }
  };

  // Skip rules (for repeat lessons)
  const skipRules = () => {
    setPhase('demo');
  };

  // Continue from demo to practice
  const startPractice = () => {
    setPhase('practice');
  };

  // Render loading state
  if (isLoading || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900">
        <div className="text-center text-white">
          <Rocket className="w-16 h-16 mx-auto mb-4 animate-bounce" />
          <p className="text-xl">Loading Coding Adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            <span className="font-bold">{lesson.topic}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-600/30 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{score}/{lesson.challenges.length}</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{
            width: phase === 'complete'
              ? '100%'
              : `${(currentChallenge / lesson.challenges.length) * 100}%`
          }}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Phase: Rules */}
          {phase === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500
                  rounded-2xl flex items-center justify-center mb-4">
                  {lesson.mode === 'blocks' ? (
                    <Blocks className="w-10 h-10 text-white" />
                  ) : (
                    <Code className="w-10 h-10 text-white" />
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{lesson.rule}</h1>
                <p className="text-gray-400">Let's learn this concept!</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50
                p-6 rounded-2xl border border-purple-500/30">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  The Rule:
                </h2>
                <p className="text-lg leading-relaxed">{lesson.ruleExplanation}</p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={() => setPhase('demo')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500
                    py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronRight className="w-6 h-6" />
                  Let's See It!
                </motion.button>
                <motion.button
                  onClick={skipRules}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-xl
                    flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SkipForward className="w-5 h-5" />
                  Skip
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Phase: Demo */}
          {phase === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Watch How It Works!</h1>
                <p className="text-gray-400">I'll show you an example</p>
              </div>

              {/* Demo Code Display */}
              <div className="rounded-2xl overflow-hidden border-2 border-purple-500/30">
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-400 text-sm ml-2">example.py</span>
                </div>
                <pre className="bg-gray-900 p-4 text-green-400 font-mono text-lg">
                  {lesson.demoCode}
                </pre>
              </div>

              {/* Demo Output */}
              <div className="bg-black rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Terminal className="w-5 h-5" />
                  <span>Output:</span>
                </div>
                <p className="text-xl font-mono text-white">{lesson.demoOutput}</p>
              </div>

              <motion.button
                onClick={startPractice}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500
                  py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Rocket className="w-6 h-6" />
                Now You Try!
              </motion.button>
            </motion.div>
          )}

          {/* Phase: Practice */}
          {phase === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Challenge counter */}
              <div className="text-center mb-6">
                <span className="text-gray-400">
                  Challenge {currentChallenge + 1} of {lesson.challenges.length}
                </span>
              </div>

              {/* Render appropriate editor */}
              {lesson.mode === 'blocks' ? (
                <BlockEditor
                  challenge={getCurrentChallenge() as BlockChallenge}
                  onComplete={handleChallengeComplete}
                  onHint={handleHintRequest}
                  theme={theme}
                />
              ) : (
                <PythonEditor
                  challenge={getCurrentChallenge() as PythonChallenge}
                  onComplete={handleChallengeComplete}
                  onHint={handleHintRequest}
                  theme={theme}
                />
              )}

              {/* Hint Display */}
              <AnimatePresence>
                {showHint && hintLevel > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 bg-yellow-900/30 border border-yellow-500/50
                      p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-bold">Hint {hintLevel}:</span>
                    </div>
                    <p className="text-yellow-100">
                      {getCurrentHints()[hintLevel - 1]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Phase: Complete */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500
                  rounded-full flex items-center justify-center mb-6">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold mb-4">
                {score === lesson.challenges.length ? 'Perfect Score!' : 'Lesson Complete!'}
              </h1>

              <div className="text-6xl font-bold text-transparent bg-clip-text
                bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                {score}/{lesson.challenges.length}
              </div>

              <p className="text-gray-400 mb-8">
                {score === lesson.challenges.length
                  ? "Amazing coding skills! You're a natural!"
                  : "Great effort! Keep practicing!"}
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={onBack}
                  className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-xl
                    font-bold text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Lessons
                </motion.button>
                <motion.button
                  onClick={() => {
                    setPhase('rules');
                    setCurrentChallenge(0);
                    setScore(0);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500
                    px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
