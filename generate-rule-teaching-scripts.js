const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// 29 missing rule_ids
const missingRuleIds = [
  'SPELLING-R-GENERAL-G7',
  'WRITING-R-GENERAL-G7',
  'CODING-R-GENERAL-G4',
  'CODING-R-GENERAL-G1',
  'CODING-R-GENERAL-G2',
  'CODING-R-GENERAL-G3',
  'CODING-R-GENERAL-G6',
  'MATH-R-GENERAL-G1',
  'READING-R-FLUENCY-G4',
  'READING-R-EVIDENCE-G3',
  'MATH-R-PLACEVALUE-G0',
  'READING-R-FLUENCY-G3',
  'CODING-R-GENERAL-G5',
  'READING-R-SEQUENCE-G0',
  'READING-R-PHONICS-G1',
  'SPELLING-R-GENERAL-G1',
  'READING-R-SIGHT-G0',
  'SPELLING-R-GENERAL-G3',
  'MATH-R-COMPARE-G1',
  'MATH-R-PLACEVALUE-G1',
  'SPELLING-R-GENERAL-G0',
  'SPELLING-R-GENERAL-G2',
  'SPELLING-R-GENERAL-G4',
  'SPELLING-R-GENERAL-G5',
  'SPELLING-R-GENERAL-G6',
  'WRITE-R-GENERAL-G0',
  'WRITE-R-GENERAL-G2',
  'CODING-R-GENERAL-G0',
  'CODING-R-GENERAL-G7'
];

// Rule templates by subject and type
const ruleTemplates = {
  'SPELLING-R-GENERAL-G0': {
    rule_name: 'Beginning Sounds',
    subject: 'spelling',
    grade: 0,
    standard: 'AZCCRS.RF.K.2',
    teaching_script: {
      intro: "Let's learn about beginning sounds! Every word starts with a special sound.",
      steps: [
        { step: 1, text: "Listen to the first sound in a word. 'Cat' starts with /k/!", visual: { type: "phonics", data: { word: "cat", highlight: "c" }}, duration: 4000, voice_text: "Cat starts with the /k/ sound. Can you hear it?" },
        { step: 2, text: "The first letter makes the beginning sound.", visual: { type: "phonics", data: { word: "dog", highlight: "d" }}, duration: 4000, voice_text: "Dog starts with /d/. Say it with me!" },
        { step: 3, text: "Now you try! What sound does 'sun' start with?", visual: { type: "phonics", data: { word: "sun", highlight: "s" }}, duration: 3000, voice_text: "That's right! Sun starts with /s/!" }
      ]
    },
    rule_card: { title: "First Sound Fun!", rule_text: "Every word starts with a beginning sound. Listen carefully to hear it!", examples: ["Cat = /k/", "Dog = /d/", "Sun = /s/"], memory_tip: "The FIRST letter makes the FIRST sound!" }
  },
  'SPELLING-R-GENERAL-G1': {
    rule_name: 'Short Vowel Sounds',
    subject: 'spelling',
    grade: 1,
    standard: 'AZCCRS.RF.1.2',
    teaching_script: {
      intro: "Today we learn about short vowels! A, E, I, O, U make special short sounds.",
      steps: [
        { step: 1, text: "Short 'a' sounds like /a/ in 'cat'.", visual: { type: "phonics", data: { word: "cat", highlight: "a" }}, duration: 4000, voice_text: "Listen: cat. The 'a' makes a short sound." },
        { step: 2, text: "Short 'e' sounds like /e/ in 'bed'.", visual: { type: "phonics", data: { word: "bed", highlight: "e" }}, duration: 4000, voice_text: "Bed has a short 'e' sound in the middle." },
        { step: 3, text: "Practice with more words like 'sit', 'hot', and 'bus'.", visual: { type: "word_list", data: { words: ["sit", "hot", "bus"] }}, duration: 4000, voice_text: "These all have short vowel sounds!" }
      ]
    },
    rule_card: { title: "Short Vowel Power!", rule_text: "Short vowels make quick sounds: a in cat, e in bed, i in sit, o in hot, u in bus.", examples: ["cat /a/", "bed /e/", "sit /i/"], memory_tip: "Short vowels are quick and snappy!" }
  },
  'SPELLING-R-GENERAL-G2': {
    rule_name: 'Long Vowel Patterns',
    subject: 'spelling',
    grade: 2,
    standard: 'AZCCRS.RF.2.3',
    teaching_script: {
      intro: "Long vowels say their name! Let's learn the magic patterns.",
      steps: [
        { step: 1, text: "Silent E makes vowels say their name: 'cake' has a long 'a'.", visual: { type: "phonics", data: { word: "cake", highlight: "a_e" }}, duration: 4000, voice_text: "The silent E makes the A say its name: cake!" },
        { step: 2, text: "Two vowels together: 'rain' has a long 'a' from 'ai'.", visual: { type: "phonics", data: { word: "rain", highlight: "ai" }}, duration: 4000, voice_text: "When two vowels go walking, the first does the talking!" },
        { step: 3, text: "Practice finding long vowels in words.", visual: { type: "word_list", data: { words: ["time", "boat", "feet"] }}, duration: 4000, voice_text: "Time, boat, feet - all have long vowels!" }
      ]
    },
    rule_card: { title: "Long Vowel Magic!", rule_text: "Long vowels say their name. Silent E and vowel teams make them long.", examples: ["cake (a_e)", "rain (ai)", "boat (oa)"], memory_tip: "When E is silent, vowels get loud!" }
  },
  'SPELLING-R-GENERAL-G3': {
    rule_name: 'Common Spelling Patterns',
    subject: 'spelling',
    grade: 3,
    standard: 'AZCCRS.L.3.2',
    teaching_script: {
      intro: "Let's master common spelling patterns that appear in many words!",
      steps: [
        { step: 1, text: "The 'ight' pattern: light, night, right, bright.", visual: { type: "pattern", data: { pattern: "ight", words: ["light", "night", "right"] }}, duration: 4000, voice_text: "I-G-H-T makes the /ite/ sound. Light, night, right!" },
        { step: 2, text: "The 'tion' ending: nation, action, station.", visual: { type: "pattern", data: { pattern: "tion", words: ["nation", "action"] }}, duration: 4000, voice_text: "T-I-O-N makes the /shun/ sound at the end." },
        { step: 3, text: "Look for patterns in new words to spell them correctly.", visual: { type: "word_list", data: { words: ["might", "motion", "fraction"] }}, duration: 4000, voice_text: "Find the pattern and you can spell it!" }
      ]
    },
    rule_card: { title: "Pattern Power!", rule_text: "Many words share spelling patterns. Learn the pattern, spell many words!", examples: ["-ight: light, night", "-tion: action, nation"], memory_tip: "Same pattern = same spelling!" }
  },
  'SPELLING-R-GENERAL-G4': {
    rule_name: 'Prefixes and Suffixes',
    subject: 'spelling',
    grade: 4,
    standard: 'AZCCRS.L.4.2',
    teaching_script: {
      intro: "Prefixes and suffixes are word parts that change meaning and spelling!",
      steps: [
        { step: 1, text: "Prefixes go at the beginning: un- means 'not'. Unhappy = not happy.", visual: { type: "word_parts", data: { prefix: "un", root: "happy" }}, duration: 4000, voice_text: "Un-happy. The prefix 'un' means not." },
        { step: 2, text: "Suffixes go at the end: -ful means 'full of'. Helpful = full of help.", visual: { type: "word_parts", data: { root: "help", suffix: "ful" }}, duration: 4000, voice_text: "Help-ful. The suffix 'ful' means full of." },
        { step: 3, text: "Watch for spelling changes: happy + ness = happiness (y changes to i).", visual: { type: "word_parts", data: { root: "happy", suffix: "ness", result: "happiness" }}, duration: 4000, voice_text: "Sometimes the root word changes spelling!" }
      ]
    },
    rule_card: { title: "Word Building!", rule_text: "Prefixes (beginning) and suffixes (ending) change word meaning. Watch for spelling changes!", examples: ["un+happy = unhappy", "help+ful = helpful"], memory_tip: "Pre = before, Suf = after!" }
  },
  'SPELLING-R-GENERAL-G5': {
    rule_name: 'Greek and Latin Roots',
    subject: 'spelling',
    grade: 5,
    standard: 'AZCCRS.L.5.4',
    teaching_script: {
      intro: "Many English words come from Greek and Latin roots. Learn them to spell better!",
      steps: [
        { step: 1, text: "Latin root 'port' means 'carry': transport, portable, import.", visual: { type: "roots", data: { root: "port", meaning: "carry", words: ["transport", "portable"] }}, duration: 4000, voice_text: "Port means carry. Transport means carry across!" },
        { step: 2, text: "Greek root 'graph' means 'write': autograph, paragraph, biography.", visual: { type: "roots", data: { root: "graph", meaning: "write", words: ["autograph", "paragraph"] }}, duration: 4000, voice_text: "Graph means write. An autograph is self-writing!" },
        { step: 3, text: "Knowing roots helps spell and understand new words.", visual: { type: "word_list", data: { words: ["telephone", "geography", "export"] }}, duration: 4000, voice_text: "See the roots? Now you can figure out new words!" }
      ]
    },
    rule_card: { title: "Root Word Power!", rule_text: "Greek and Latin roots are building blocks for many words. Learn the root, unlock many words!", examples: ["port (carry): transport", "graph (write): paragraph"], memory_tip: "Old roots = new word knowledge!" }
  },
  'SPELLING-R-GENERAL-G6': {
    rule_name: 'Advanced Word Origins',
    subject: 'spelling',
    grade: 6,
    standard: 'AZCCRS.L.6.4',
    teaching_script: {
      intro: "Understanding word origins helps with spelling and vocabulary!",
      steps: [
        { step: 1, text: "French origins: ballet, café, bouquet keep French spellings.", visual: { type: "etymology", data: { origin: "French", words: ["ballet", "café", "bouquet"] }}, duration: 4000, voice_text: "These French words keep their special spellings." },
        { step: 2, text: "Spanish origins: mosquito, tornado, plaza follow Spanish patterns.", visual: { type: "etymology", data: { origin: "Spanish", words: ["mosquito", "tornado"] }}, duration: 4000, voice_text: "Spanish words often end in 'o' or 'a'." },
        { step: 3, text: "Knowing origins helps predict spelling patterns.", visual: { type: "word_list", data: { words: ["psychology", "technique", "fiesta"] }}, duration: 4000, voice_text: "Word origin is a clue to spelling!" }
      ]
    },
    rule_card: { title: "Word Origins Matter!", rule_text: "Words from different languages follow different spelling rules. Learn the origin!", examples: ["French: -et, -é (ballet, café)", "Spanish: -o, -a (tornado)"], memory_tip: "Where it's from = how it's spelled!" }
  },
  'SPELLING-R-GENERAL-G7': {
    rule_name: 'Academic Vocabulary Spelling',
    subject: 'spelling',
    grade: 7,
    standard: 'AZCCRS.L.7.4',
    teaching_script: {
      intro: "Academic vocabulary requires precise spelling. Let's master these important words!",
      steps: [
        { step: 1, text: "Science words: hypothesis, phenomenon, chromosome.", visual: { type: "academic", data: { field: "science", words: ["hypothesis", "phenomenon"] }}, duration: 4000, voice_text: "Scientific terms often come from Greek. Hypothesis means 'under-placing'." },
        { step: 2, text: "Math words: algorithm, coefficient, circumference.", visual: { type: "academic", data: { field: "math", words: ["algorithm", "coefficient"] }}, duration: 4000, voice_text: "Math terms are precise. Algorithm comes from a mathematician's name!" },
        { step: 3, text: "Break big words into parts to spell them correctly.", visual: { type: "word_parts", data: { word: "circumference", parts: ["circum", "fer", "ence"] }}, duration: 4000, voice_text: "Circum-fer-ence: around-carry-state of being!" }
      ]
    },
    rule_card: { title: "Academic Precision!", rule_text: "Academic words require exact spelling. Break them into parts and learn their origins.", examples: ["hypo+thesis = hypothesis", "circum+ference = circumference"], memory_tip: "Big words = small parts!" }
  },
  'WRITING-R-GENERAL-G7': {
    rule_name: 'Advanced Essay Structure',
    subject: 'writing',
    grade: 7,
    standard: 'AZCCRS.W.7.1',
    teaching_script: {
      intro: "Advanced essays need clear structure: thesis, evidence, and strong conclusions!",
      steps: [
        { step: 1, text: "Your thesis statement is your main argument. It guides the whole essay.", visual: { type: "writing", data: { element: "thesis", example: "Social media impacts teen communication in both positive and negative ways." }}, duration: 4000, voice_text: "A strong thesis tells readers exactly what you'll prove." },
        { step: 2, text: "Each body paragraph needs a topic sentence and supporting evidence.", visual: { type: "writing", data: { element: "paragraph", structure: ["topic", "evidence", "analysis"] }}, duration: 4000, voice_text: "Topic sentence, then evidence, then your analysis of that evidence." },
        { step: 3, text: "Conclusions should restate your thesis and extend your thinking.", visual: { type: "writing", data: { element: "conclusion", parts: ["restate", "summarize", "extend"] }}, duration: 4000, voice_text: "Don't just repeat - extend your thinking in the conclusion!" }
      ]
    },
    rule_card: { title: "Essay Excellence!", rule_text: "Strong essays have clear thesis, supporting paragraphs with evidence, and meaningful conclusions.", examples: ["Thesis: Clear argument", "Body: Evidence + analysis", "Conclusion: Extend thinking"], memory_tip: "Tell them what you'll say, say it, then say what it means!" }
  },
  'CODING-R-GENERAL-G0': {
    rule_name: 'Introduction to Commands',
    subject: 'coding',
    grade: 0,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Computers follow instructions called commands! Let's learn how to give them.",
      steps: [
        { step: 1, text: "A command tells the computer what to do. Like 'move forward'!", visual: { type: "code", data: { command: "move forward" }}, duration: 4000, voice_text: "Commands are instructions. Move forward tells the robot to go!" },
        { step: 2, text: "Commands must be clear and specific. Computers do exactly what you say!", visual: { type: "code", data: { command: "turn right" }}, duration: 4000, voice_text: "Be specific! Turn right tells exactly which way to go." },
        { step: 3, text: "Let's practice giving commands to move a character.", visual: { type: "interactive", data: { activity: "command_practice" }}, duration: 4000, voice_text: "Your turn! Give commands to move the robot!" }
      ]
    },
    rule_card: { title: "Command Time!", rule_text: "Commands tell computers what to do. Be clear and specific!", examples: ["move forward", "turn left", "jump"], memory_tip: "Say exactly what you want!" }
  },
  'CODING-R-GENERAL-G1': {
    rule_name: 'Sequences and Order',
    subject: 'coding',
    grade: 1,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "In coding, order matters! Commands happen in sequence, one after another.",
      steps: [
        { step: 1, text: "A sequence is commands in order. First this, then that!", visual: { type: "code", data: { sequence: ["pick up", "walk", "put down"] }}, duration: 4000, voice_text: "First pick up, then walk, then put down. Order matters!" },
        { step: 2, text: "If you change the order, you get different results.", visual: { type: "code", data: { sequence: ["walk", "pick up", "put down"] }}, duration: 4000, voice_text: "If we walk first, we can't pick up the item!" },
        { step: 3, text: "Plan your sequence before coding. What comes first?", visual: { type: "planning", data: { steps: ["think", "plan", "code"] }}, duration: 4000, voice_text: "Think about what should happen first, second, third!" }
      ]
    },
    rule_card: { title: "Order Matters!", rule_text: "Sequences are commands in order. Change the order, change the result!", examples: ["1. Pick up 2. Walk 3. Drop", "NOT: Walk, Pick up, Drop"], memory_tip: "First things first!" }
  },
  'CODING-R-GENERAL-G2': {
    rule_name: 'Loops and Repetition',
    subject: 'coding',
    grade: 2,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Loops repeat commands! Instead of writing the same thing many times, use a loop.",
      steps: [
        { step: 1, text: "Without a loop: move, move, move, move. That's a lot of typing!", visual: { type: "code", data: { commands: ["move", "move", "move", "move"] }}, duration: 4000, voice_text: "Move, move, move, move. We had to type it four times!" },
        { step: 2, text: "With a loop: repeat 4 times: move. Much easier!", visual: { type: "code", data: { loop: "repeat 4 times: move" }}, duration: 4000, voice_text: "Repeat 4 times: move. One line does the same thing!" },
        { step: 3, text: "Loops save time and make code cleaner.", visual: { type: "comparison", data: { before: 4, after: 1 }}, duration: 4000, voice_text: "Loops are a coder's superpower!" }
      ]
    },
    rule_card: { title: "Loop Power!", rule_text: "Loops repeat commands. Instead of writing the same thing many times, loop it!", examples: ["repeat 3 times: jump", "repeat 10 times: beep"], memory_tip: "Don't repeat yourself - loop it!" }
  },
  'CODING-R-GENERAL-G3': {
    rule_name: 'Conditionals and Decisions',
    subject: 'coding',
    grade: 3,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Conditionals let code make decisions! IF something is true, THEN do something.",
      steps: [
        { step: 1, text: "IF it's raining, THEN take an umbrella. That's a conditional!", visual: { type: "code", data: { condition: "if raining then umbrella" }}, duration: 4000, voice_text: "If-then statements check conditions and make decisions." },
        { step: 2, text: "In code: IF score > 10 THEN say 'You win!'", visual: { type: "code", data: { code: "if score > 10 then say('You win!')" }}, duration: 4000, voice_text: "If score is greater than 10, then say You win!" },
        { step: 3, text: "Add ELSE for what happens when the condition is false.", visual: { type: "code", data: { code: "if score > 10 then win else try_again" }}, duration: 4000, voice_text: "Else handles what happens when the condition is NOT true." }
      ]
    },
    rule_card: { title: "Decision Time!", rule_text: "Conditionals use IF-THEN-ELSE to make decisions based on conditions.", examples: ["IF hungry THEN eat", "IF score>10 THEN win ELSE try again"], memory_tip: "IF this, THEN that, ELSE other!" }
  },
  'CODING-R-GENERAL-G4': {
    rule_name: 'Variables and Data',
    subject: 'coding',
    grade: 4,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Variables store information! They're like labeled boxes that hold data.",
      steps: [
        { step: 1, text: "A variable has a name and a value. score = 0 creates a variable.", visual: { type: "code", data: { variable: "score = 0" }}, duration: 4000, voice_text: "Score equals zero. Now we have a variable called score!" },
        { step: 2, text: "You can change variable values. score = score + 10 adds points!", visual: { type: "code", data: { variable: "score = score + 10" }}, duration: 4000, voice_text: "Score equals score plus 10. Now score is 10!" },
        { step: 3, text: "Variables remember values so your program can use them later.", visual: { type: "code", data: { example: "name = 'Alex'; print(name)" }}, duration: 4000, voice_text: "Store it once, use it many times!" }
      ]
    },
    rule_card: { title: "Variable Power!", rule_text: "Variables store data with a name and value. You can read and change them.", examples: ["score = 100", "name = 'Alex'", "lives = lives - 1"], memory_tip: "Variables are labeled boxes for data!" }
  },
  'CODING-R-GENERAL-G5': {
    rule_name: 'Functions and Reusable Code',
    subject: 'coding',
    grade: 5,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Functions are reusable blocks of code! Write once, use many times.",
      steps: [
        { step: 1, text: "A function groups commands together with a name.", visual: { type: "code", data: { function: "function greet() { print('Hello!') }" }}, duration: 4000, voice_text: "This function is called greet. It prints Hello!" },
        { step: 2, text: "Call a function by its name: greet() runs all the code inside.", visual: { type: "code", data: { call: "greet()" }}, duration: 4000, voice_text: "Just type greet with parentheses to run it!" },
        { step: 3, text: "Functions can take inputs called parameters.", visual: { type: "code", data: { function: "function greet(name) { print('Hello ' + name) }" }}, duration: 4000, voice_text: "Now greet takes a name and uses it!" }
      ]
    },
    rule_card: { title: "Function Magic!", rule_text: "Functions group code together. Define once, call many times!", examples: ["function jump() { ... }", "function add(a, b) { return a+b }"], memory_tip: "Name it, define it, call it!" }
  },
  'CODING-R-GENERAL-G6': {
    rule_name: 'Debugging and Problem Solving',
    subject: 'coding',
    grade: 6,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Bugs are errors in code. Debugging is finding and fixing them!",
      steps: [
        { step: 1, text: "Read error messages carefully. They tell you what went wrong.", visual: { type: "code", data: { error: "SyntaxError: unexpected token" }}, duration: 4000, voice_text: "Error messages are clues! This says there's a syntax problem." },
        { step: 2, text: "Check your code line by line. Where does it break?", visual: { type: "debugging", data: { technique: "line-by-line" }}, duration: 4000, voice_text: "Go step by step and find where things go wrong." },
        { step: 3, text: "Test small pieces. Fix one bug at a time.", visual: { type: "debugging", data: { technique: "isolate" }}, duration: 4000, voice_text: "Break big problems into small ones. Fix one at a time!" }
      ]
    },
    rule_card: { title: "Debug Like a Pro!", rule_text: "Read errors, check line by line, test small pieces, fix one bug at a time.", examples: ["Read the error message", "Check each line", "Test and fix one thing"], memory_tip: "Bugs are puzzles to solve!" }
  },
  'CODING-R-GENERAL-G7': {
    rule_name: 'Algorithms and Efficiency',
    subject: 'coding',
    grade: 7,
    standard: 'ISTE.1c',
    teaching_script: {
      intro: "Algorithms are step-by-step solutions. Good algorithms are efficient!",
      steps: [
        { step: 1, text: "An algorithm is a precise set of steps to solve a problem.", visual: { type: "algorithm", data: { name: "search", steps: ["look at first", "compare", "move to next"] }}, duration: 4000, voice_text: "An algorithm is like a recipe - precise steps in order." },
        { step: 2, text: "Efficiency matters. Some algorithms are faster than others.", visual: { type: "comparison", data: { slow: "check all", fast: "binary search" }}, duration: 4000, voice_text: "Checking every item is slow. Binary search is much faster!" },
        { step: 3, text: "Think about the best approach before coding.", visual: { type: "planning", data: { steps: ["understand", "plan", "optimize"] }}, duration: 4000, voice_text: "Plan your algorithm first. Then code it efficiently!" }
      ]
    },
    rule_card: { title: "Algorithm Thinking!", rule_text: "Algorithms are precise steps. Good ones are efficient and solve problems well.", examples: ["Sorting algorithms", "Search algorithms", "Pathfinding"], memory_tip: "Right steps + right order = good algorithm!" }
  },
  'MATH-R-GENERAL-G1': {
    rule_name: 'Addition and Subtraction Facts',
    subject: 'math',
    grade: 1,
    standard: 'AZCCRS.1.OA.6',
    teaching_script: {
      intro: "Let's master addition and subtraction facts to 20!",
      steps: [
        { step: 1, text: "Addition means putting groups together. 5 + 3 = 8", visual: { type: "math", data: { operation: "5 + 3 = 8", visual: "counters" }}, duration: 4000, voice_text: "5 plus 3 equals 8. We put the groups together!" },
        { step: 2, text: "Subtraction means taking away. 8 - 3 = 5", visual: { type: "math", data: { operation: "8 - 3 = 5", visual: "counters" }}, duration: 4000, voice_text: "8 minus 3 equals 5. We take 3 away from 8!" },
        { step: 3, text: "Addition and subtraction are related. They're fact families!", visual: { type: "math", data: { family: ["5+3=8", "3+5=8", "8-3=5", "8-5=3"] }}, duration: 4000, voice_text: "These facts are a family! They use the same numbers." }
      ]
    },
    rule_card: { title: "Fact Power!", rule_text: "Addition puts groups together. Subtraction takes away. They're related!", examples: ["5 + 3 = 8", "8 - 3 = 5"], memory_tip: "Plus puts together, minus takes away!" }
  },
  'MATH-R-PLACEVALUE-G0': {
    rule_name: 'Understanding Numbers 0-20',
    subject: 'math',
    grade: 0,
    standard: 'AZCCRS.K.CC.3',
    teaching_script: {
      intro: "Let's learn about numbers from 0 to 20!",
      steps: [
        { step: 1, text: "Numbers tell us how many. Count the objects!", visual: { type: "counting", data: { objects: "stars", count: 5 }}, duration: 4000, voice_text: "Let's count! 1, 2, 3, 4, 5. There are 5 stars!" },
        { step: 2, text: "After 10, we use teen numbers: 11, 12, 13...", visual: { type: "number_line", data: { range: [10, 20] }}, duration: 4000, voice_text: "After ten come the teen numbers. 11 is ten and one!" },
        { step: 3, text: "Practice counting objects up to 20.", visual: { type: "counting", data: { objects: "blocks", count: 15 }}, duration: 4000, voice_text: "Count with me! How many blocks are there?" }
      ]
    },
    rule_card: { title: "Counting Fun!", rule_text: "Numbers tell us how many. Count carefully from 0 to 20!", examples: ["5 stars", "10 fingers", "15 blocks"], memory_tip: "Point and count - one number for each thing!" }
  },
  'MATH-R-PLACEVALUE-G1': {
    rule_name: 'Tens and Ones',
    subject: 'math',
    grade: 1,
    standard: 'AZCCRS.1.NBT.2',
    teaching_script: {
      intro: "Numbers have places! Tens are on the left, ones are on the right.",
      steps: [
        { step: 1, text: "In 34, the 3 is in the tens place. It means 30!", visual: { type: "place_value", data: { number: 34, tens: 3, ones: 4 }}, duration: 4000, voice_text: "The 3 in 34 means 3 tens, which is 30!" },
        { step: 2, text: "The 4 is in the ones place. It means just 4.", visual: { type: "place_value", data: { number: 34, highlight: "ones" }}, duration: 4000, voice_text: "The 4 means 4 ones. So 34 is 30 + 4!" },
        { step: 3, text: "34 = 30 + 4 = 3 tens + 4 ones", visual: { type: "expanded", data: { number: 34, expanded: "30 + 4" }}, duration: 4000, voice_text: "We can break numbers into tens and ones!" }
      ]
    },
    rule_card: { title: "Place Value Power!", rule_text: "Tens are on the left, ones are on the right. 34 = 3 tens + 4 ones.", examples: ["34 = 30 + 4", "56 = 50 + 6"], memory_tip: "Tens are groups of 10, ones are leftovers!" }
  },
  'MATH-R-COMPARE-G1': {
    rule_name: 'Comparing Two-Digit Numbers',
    subject: 'math',
    grade: 1,
    standard: 'AZCCRS.1.NBT.3',
    teaching_script: {
      intro: "Let's compare two-digit numbers! Which is bigger?",
      steps: [
        { step: 1, text: "Compare tens first. More tens = bigger number.", visual: { type: "comparison", data: { numbers: [45, 32], compare: "tens" }}, duration: 4000, voice_text: "45 has 4 tens, 32 has 3 tens. 45 is bigger!" },
        { step: 2, text: "If tens are equal, compare ones.", visual: { type: "comparison", data: { numbers: [45, 48], compare: "ones" }}, duration: 4000, voice_text: "Both have 4 tens. 48 has more ones, so 48 is bigger!" },
        { step: 3, text: "Use symbols: > means greater, < means less, = means equal.", visual: { type: "symbols", data: { example: "45 > 32" }}, duration: 4000, voice_text: "45 is greater than 32. The alligator eats the bigger number!" }
      ]
    },
    rule_card: { title: "Compare Numbers!", rule_text: "Compare tens first, then ones. Use > (greater), < (less), = (equal).", examples: ["45 > 32", "28 < 35", "50 = 50"], memory_tip: "The alligator always eats the bigger number!" }
  },
  'READING-R-FLUENCY-G3': {
    rule_name: 'Reading with Expression',
    subject: 'reading',
    grade: 3,
    standard: 'AZCCRS.RF.3.4',
    teaching_script: {
      intro: "Good readers use expression! Let's make reading sound like talking.",
      steps: [
        { step: 1, text: "Punctuation tells you how to read. Periods = pause. Questions = voice up.", visual: { type: "text", data: { sentence: "Is it raining?", mark: "?" }}, duration: 4000, voice_text: "See the question mark? Your voice goes UP at the end!" },
        { step: 2, text: "Exclamation points mean excitement! Read with energy!", visual: { type: "text", data: { sentence: "Watch out!", mark: "!" }}, duration: 4000, voice_text: "Watch out! Say it with excitement!" },
        { step: 3, text: "Practice reading like you're telling a story to a friend.", visual: { type: "reading", data: { tip: "Read like talking" }}, duration: 4000, voice_text: "Read like you're sharing a story. Make it interesting!" }
      ]
    },
    rule_card: { title: "Express Yourself!", rule_text: "Use punctuation to guide expression. Periods pause, questions go up, exclamations are excited!", examples: ["Stop. (pause)", "Really? (voice up)", "Wow! (excited)"], memory_tip: "Punctuation is your voice guide!" }
  },
  'READING-R-FLUENCY-G4': {
    rule_name: 'Reading Rate and Pacing',
    subject: 'reading',
    grade: 4,
    standard: 'AZCCRS.RF.4.4',
    teaching_script: {
      intro: "Fluent readers read at a good pace - not too fast, not too slow!",
      steps: [
        { step: 1, text: "Read at a natural talking speed. Not robot-slow, not rushing.", visual: { type: "pacing", data: { speeds: ["too slow", "just right", "too fast"] }}, duration: 4000, voice_text: "Read like you're having a conversation - natural and smooth." },
        { step: 2, text: "Group words into phrases. Don't read word... by... word.", visual: { type: "text", data: { phrases: ["The big dog", "ran quickly", "to the park"] }}, duration: 4000, voice_text: "Read in phrases: The big dog... ran quickly... to the park." },
        { step: 3, text: "Practice makes perfect! Re-read passages to build speed.", visual: { type: "practice", data: { tip: "repeated reading" }}, duration: 4000, voice_text: "The more you read, the smoother it gets!" }
      ]
    },
    rule_card: { title: "Pace Yourself!", rule_text: "Read at a natural pace. Group words into phrases. Practice builds fluency!", examples: ["Read in phrases", "Natural speed", "Re-read to improve"], memory_tip: "Smooth and steady wins the reading race!" }
  },
  'READING-R-EVIDENCE-G3': {
    rule_name: 'Finding Text Evidence',
    subject: 'reading',
    grade: 3,
    standard: 'AZCCRS.RL.3.1',
    teaching_script: {
      intro: "Good readers find evidence in the text to support their answers!",
      steps: [
        { step: 1, text: "When answering questions, look back at the text.", visual: { type: "reading", data: { action: "look back" }}, duration: 4000, voice_text: "Don't just guess! Go back and find the answer in the text." },
        { step: 2, text: "Find the exact words or sentences that prove your answer.", visual: { type: "text", data: { highlight: "evidence" }}, duration: 4000, voice_text: "Find the specific words that support your answer." },
        { step: 3, text: "Use phrases like 'The text says...' or 'According to the passage...'", visual: { type: "sentence_starters", data: { starters: ["The text says...", "According to..."] }}, duration: 4000, voice_text: "Start with 'The text says' to show your evidence!" }
      ]
    },
    rule_card: { title: "Prove It!", rule_text: "Find evidence in the text to support your answers. Quote or paraphrase!", examples: ["The text says...", "According to the passage...", "On page 5, it states..."], memory_tip: "Don't guess - find the proof!" }
  },
  'READING-R-SEQUENCE-G0': {
    rule_name: 'Story Order',
    subject: 'reading',
    grade: 0,
    standard: 'AZCCRS.RL.K.2',
    teaching_script: {
      intro: "Stories happen in order! First, next, then, last.",
      steps: [
        { step: 1, text: "Stories have a beginning, middle, and end.", visual: { type: "sequence", data: { parts: ["beginning", "middle", "end"] }}, duration: 4000, voice_text: "Every story has a beginning, a middle, and an end!" },
        { step: 2, text: "Use words like first, next, then, last to tell the order.", visual: { type: "words", data: { sequence: ["first", "next", "then", "last"] }}, duration: 4000, voice_text: "First... next... then... last. These words show order!" },
        { step: 3, text: "Practice putting story events in order.", visual: { type: "activity", data: { action: "sequence_cards" }}, duration: 4000, voice_text: "What happened first? What happened next? What happened last?" }
      ]
    },
    rule_card: { title: "Story Order!", rule_text: "Stories have a beginning, middle, and end. First, next, then, last!", examples: ["First, the bear woke up", "Next, he looked for food", "Last, he went back to sleep"], memory_tip: "First, next, last - that's the story blast!" }
  },
  'READING-R-PHONICS-G1': {
    rule_name: 'Consonant Blends',
    subject: 'reading',
    grade: 1,
    standard: 'AZCCRS.RF.1.3',
    teaching_script: {
      intro: "Consonant blends are two consonants together. You hear both sounds!",
      steps: [
        { step: 1, text: "Blends at the start: bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, sk, sl, sm, sn, sp, st, sw, tr", visual: { type: "phonics", data: { blends: ["bl", "br", "cl", "cr", "dr"] }}, duration: 4000, voice_text: "Blends mix two sounds together. Bl, br, cl, cr, dr!" },
        { step: 2, text: "In 'stop', you hear both /s/ and /t/ at the beginning.", visual: { type: "phonics", data: { word: "stop", blend: "st" }}, duration: 4000, voice_text: "S-t-op. You hear both the s and the t!" },
        { step: 3, text: "Practice: What blend do you hear in 'frog'?", visual: { type: "phonics", data: { word: "frog", blend: "fr" }}, duration: 4000, voice_text: "Fr-og. The blend is fr!" }
      ]
    },
    rule_card: { title: "Blend It!", rule_text: "Consonant blends are two consonants together. You hear both sounds!", examples: ["st-op", "fr-og", "cl-ap"], memory_tip: "Blends blend - you hear both sounds!" }
  },
  'READING-R-SIGHT-G0': {
    rule_name: 'High-Frequency Words',
    subject: 'reading',
    grade: 0,
    standard: 'AZCCRS.RF.K.3',
    teaching_script: {
      intro: "Sight words are words you see a lot! Learn them by heart.",
      steps: [
        { step: 1, text: "Some words appear everywhere: the, a, I, and, is, to, you, it, in, said", visual: { type: "sight_words", data: { words: ["the", "a", "I", "and", "is"] }}, duration: 4000, voice_text: "These words are everywhere! The, a, I, and, is." },
        { step: 2, text: "Learn to read them fast, without sounding out.", visual: { type: "flashcard", data: { word: "the" }}, duration: 4000, voice_text: "See it, say it! The. Just know it!" },
        { step: 3, text: "Practice reading sight words quickly.", visual: { type: "practice", data: { activity: "sight_word_flash" }}, duration: 4000, voice_text: "The faster you know them, the better you read!" }
      ]
    },
    rule_card: { title: "Sight Word Power!", rule_text: "Sight words appear everywhere. Learn them by heart for faster reading!", examples: ["the", "and", "is", "said", "you"], memory_tip: "See it, say it, know it!" }
  },
  'WRITE-R-GENERAL-G0': {
    rule_name: 'Holding a Pencil',
    subject: 'writing',
    grade: 0,
    standard: 'AZCCRS.L.K.1',
    teaching_script: {
      intro: "Let's learn how to hold a pencil the right way!",
      steps: [
        { step: 1, text: "Pinch the pencil between your thumb and pointer finger.", visual: { type: "handwriting", data: { grip: "tripod" }}, duration: 4000, voice_text: "Pinch the pencil with your thumb and pointer finger!" },
        { step: 2, text: "Rest the pencil on your middle finger for support.", visual: { type: "handwriting", data: { grip: "tripod", highlight: "middle" }}, duration: 4000, voice_text: "Your middle finger helps hold it steady." },
        { step: 3, text: "This is called the tripod grip. Practice it!", visual: { type: "handwriting", data: { grip: "tripod", practice: true }}, duration: 4000, voice_text: "The tripod grip! Three fingers working together!" }
      ]
    },
    rule_card: { title: "Grip It Right!", rule_text: "Use the tripod grip: thumb and pointer pinch, middle finger supports.", examples: ["Pinch with thumb and pointer", "Rest on middle finger"], memory_tip: "Pinch, rest, write!" }
  },
  'WRITE-R-GENERAL-G2': {
    rule_name: 'Writing Complete Sentences',
    subject: 'writing',
    grade: 2,
    standard: 'AZCCRS.L.2.1',
    teaching_script: {
      intro: "Complete sentences have a subject and a predicate. Let's learn!",
      steps: [
        { step: 1, text: "Every sentence needs a subject - who or what the sentence is about.", visual: { type: "grammar", data: { sentence: "The cat sleeps.", subject: "The cat" }}, duration: 4000, voice_text: "The cat is the subject. Who sleeps? The cat!" },
        { step: 2, text: "Every sentence needs a predicate - what the subject does.", visual: { type: "grammar", data: { sentence: "The cat sleeps.", predicate: "sleeps" }}, duration: 4000, voice_text: "Sleeps is the predicate. What does the cat do? Sleeps!" },
        { step: 3, text: "Put them together: subject + predicate = complete sentence!", visual: { type: "grammar", data: { formula: "subject + predicate = sentence" }}, duration: 4000, voice_text: "Subject plus predicate equals a complete sentence!" }
      ]
    },
    rule_card: { title: "Complete Sentences!", rule_text: "Every sentence needs a subject (who/what) and a predicate (does what).", examples: ["The dog runs.", "She sings.", "Birds fly."], memory_tip: "Who does what? That's a sentence!" }
  }
};

async function generateTeachingScripts() {
  console.log('Generating rule_teaching_scripts for ' + missingRuleIds.length + ' missing rule_ids...\n');

  const scripts = [];

  for (const ruleId of missingRuleIds) {
    const template = ruleTemplates[ruleId];

    if (template) {
      const totalDuration = template.teaching_script.steps.reduce((sum, step) => sum + step.duration, 0);

      scripts.push({
        rule_id: ruleId,
        rule_name: template.rule_name,
        subject: template.subject,
        grade: template.grade,
        standard: template.standard,
        teaching_script: template.teaching_script,
        rule_card: template.rule_card,
        total_duration: totalDuration
      });
      console.log('Generated: ' + ruleId + ' - ' + template.rule_name);
    } else {
      console.log('No template for: ' + ruleId);
    }
  }

  console.log('\nInserting ' + scripts.length + ' teaching scripts...');

  // Insert in batches
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < scripts.length; i += batchSize) {
    const batch = scripts.slice(i, i + batchSize);
    const { error } = await supabase.from('rule_teaching_scripts').insert(batch);

    if (error) {
      console.log('Error inserting batch:', error.message);
    } else {
      inserted += batch.length;
      console.log('Inserted batch: ' + inserted + '/' + scripts.length);
    }
  }

  console.log('\nDone! Inserted ' + inserted + ' rule_teaching_scripts');

  // Verify new count
  const { count } = await supabase.from('rule_teaching_scripts').select('*', { count: 'exact', head: true });
  console.log('New total rule_teaching_scripts: ' + count);
}

generateTeachingScripts();
