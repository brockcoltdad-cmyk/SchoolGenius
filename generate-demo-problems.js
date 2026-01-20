const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// 28 missing rule_ids for demo_problems
const missingRuleIds = [
  'SPELLING-R-GENERAL-G7',
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

// Demo problem templates - 3 problems per rule_id
const demoTemplates = {
  'SPELLING-R-GENERAL-G0': {
    subject: 'spelling', grade: 0, standard: 'AZCCRS.RF.K.2',
    problems: [
      { problem: "What sound does 'cat' start with?", answer: "/k/", walkthrough: { steps: [
        { step: 1, action: "Gigi says the word slowly", voice_text: "Listen: c-a-t. What's the first sound?" },
        { step: 2, action: "Gigi emphasizes the first sound", voice_text: "C-c-cat. It starts with /k/!" },
        { step: 3, action: "Gigi celebrates", voice_text: "That's right! Cat starts with /k/!" }
      ]}},
      { problem: "What sound does 'dog' start with?", answer: "/d/", walkthrough: { steps: [
        { step: 1, action: "Gigi says the word", voice_text: "Listen: d-o-g. What's first?" },
        { step: 2, action: "Gigi emphasizes", voice_text: "D-d-dog. The first sound is /d/!" },
        { step: 3, action: "Gigi confirms", voice_text: "Great! Dog starts with /d/!" }
      ]}},
      { problem: "What sound does 'sun' start with?", answer: "/s/", walkthrough: { steps: [
        { step: 1, action: "Gigi presents the word", voice_text: "Listen: s-u-n." },
        { step: 2, action: "Gigi sounds it out", voice_text: "S-s-sun. First sound is /s/!" },
        { step: 3, action: "Gigi confirms", voice_text: "Sun starts with /s/!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G1': {
    subject: 'spelling', grade: 1, standard: 'AZCCRS.RF.1.2',
    problems: [
      { problem: "What vowel sound do you hear in 'cat'?", answer: "short a", walkthrough: { steps: [
        { step: 1, action: "Gigi says the word", voice_text: "Listen: cat. What vowel do you hear?" },
        { step: 2, action: "Gigi stretches the sound", voice_text: "C-aaa-t. That's a short A sound!" },
        { step: 3, action: "Gigi confirms", voice_text: "Short A says /a/ like in cat!" }
      ]}},
      { problem: "What vowel sound do you hear in 'bed'?", answer: "short e", walkthrough: { steps: [
        { step: 1, action: "Gigi says the word", voice_text: "Listen: bed. Find the vowel!" },
        { step: 2, action: "Gigi stretches", voice_text: "B-eee-d. That's short E!" },
        { step: 3, action: "Gigi confirms", voice_text: "Short E says /e/ like in bed!" }
      ]}},
      { problem: "Spell the word with short i: s_t", answer: "sit", walkthrough: { steps: [
        { step: 1, action: "Gigi looks at the blank", voice_text: "We need a short i sound." },
        { step: 2, action: "Gigi adds the vowel", voice_text: "S-i-t. The i makes /i/!" },
        { step: 3, action: "Gigi confirms", voice_text: "Sit! S-I-T!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G2': {
    subject: 'spelling', grade: 2, standard: 'AZCCRS.RF.2.3',
    problems: [
      { problem: "What makes the 'a' in 'cake' say its name?", answer: "silent e", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the word", voice_text: "Look at cake: c-a-k-e" },
        { step: 2, action: "Gigi points to the e", voice_text: "The E at the end is silent but makes the A say its name!" },
        { step: 3, action: "Gigi confirms", voice_text: "Silent E makes the vowel long!" }
      ]}},
      { problem: "What two letters make the long a sound in 'rain'?", answer: "ai", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the word", voice_text: "Rain has a long A sound." },
        { step: 2, action: "Gigi highlights", voice_text: "A-I together make the long A: ai!" },
        { step: 3, action: "Gigi confirms", voice_text: "When two vowels go walking, the first does the talking!" }
      ]}},
      { problem: "Spell the word: A fruit that is yellow (b_n_n_)", answer: "banana", walkthrough: { steps: [
        { step: 1, action: "Gigi thinks", voice_text: "A yellow fruit... banana!" },
        { step: 2, action: "Gigi spells it", voice_text: "B-A-N-A-N-A. Three A's!" },
        { step: 3, action: "Gigi confirms", voice_text: "Banana! B-A-N-A-N-A!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G3': {
    subject: 'spelling', grade: 3, standard: 'AZCCRS.L.3.2',
    problems: [
      { problem: "Spell a word with the '-ight' pattern meaning not dark", answer: "light", walkthrough: { steps: [
        { step: 1, action: "Gigi thinks", voice_text: "Not dark... that's light!" },
        { step: 2, action: "Gigi spells", voice_text: "L-I-G-H-T. The -ight pattern!" },
        { step: 3, action: "Gigi confirms", voice_text: "Light! L-I-G-H-T!" }
      ]}},
      { problem: "Complete: ac____n (something you do)", answer: "action", walkthrough: { steps: [
        { step: 1, action: "Gigi looks at the word", voice_text: "Ac...tion. Something you do!" },
        { step: 2, action: "Gigi fills in", voice_text: "A-C-T-I-O-N. The -tion ending!" },
        { step: 3, action: "Gigi confirms", voice_text: "Action! A-C-T-I-O-N!" }
      ]}},
      { problem: "Which spelling is correct: nite or night?", answer: "night", walkthrough: { steps: [
        { step: 1, action: "Gigi compares", voice_text: "Nite or night? Let's think..." },
        { step: 2, action: "Gigi explains", voice_text: "The -ight pattern is correct!" },
        { step: 3, action: "Gigi confirms", voice_text: "Night! N-I-G-H-T!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G4': {
    subject: 'spelling', grade: 4, standard: 'AZCCRS.L.4.2',
    problems: [
      { problem: "Add the prefix 'un-' to 'happy'. What's the new word?", answer: "unhappy", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the prefix", voice_text: "Un- means not." },
        { step: 2, action: "Gigi combines", voice_text: "Un + happy = unhappy!" },
        { step: 3, action: "Gigi confirms", voice_text: "Unhappy means not happy!" }
      ]}},
      { problem: "Add '-ful' to 'help'. Spell the new word.", answer: "helpful", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the suffix", voice_text: "-ful means full of." },
        { step: 2, action: "Gigi combines", voice_text: "Help + ful = helpful!" },
        { step: 3, action: "Gigi confirms", voice_text: "Helpful! H-E-L-P-F-U-L!" }
      ]}},
      { problem: "Add '-ness' to 'happy'. What happens to the y?", answer: "happiness (y becomes i)", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the rule", voice_text: "When adding -ness to words ending in y..." },
        { step: 2, action: "Gigi demonstrates", voice_text: "Y changes to I! Happi + ness!" },
        { step: 3, action: "Gigi confirms", voice_text: "Happiness! H-A-P-P-I-N-E-S-S!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G5': {
    subject: 'spelling', grade: 5, standard: 'AZCCRS.L.5.4',
    problems: [
      { problem: "The root 'port' means 'carry'. What does 'transport' mean?", answer: "carry across", walkthrough: { steps: [
        { step: 1, action: "Gigi breaks down the word", voice_text: "Trans means across, port means carry." },
        { step: 2, action: "Gigi combines meanings", voice_text: "Transport = carry across!" },
        { step: 3, action: "Gigi confirms", voice_text: "We transport goods - carry them across!" }
      ]}},
      { problem: "Spell the word meaning 'to write by oneself' (auto + graph)", answer: "autograph", walkthrough: { steps: [
        { step: 1, action: "Gigi explains roots", voice_text: "Auto means self, graph means write." },
        { step: 2, action: "Gigi combines", voice_text: "Auto + graph = autograph!" },
        { step: 3, action: "Gigi confirms", voice_text: "A-U-T-O-G-R-A-P-H!" }
      ]}},
      { problem: "What does 'portable' mean if 'port' means carry?", answer: "able to be carried", walkthrough: { steps: [
        { step: 1, action: "Gigi analyzes", voice_text: "Port = carry, -able = able to be" },
        { step: 2, action: "Gigi combines", voice_text: "Portable = able to be carried!" },
        { step: 3, action: "Gigi confirms", voice_text: "A portable radio can be carried!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G6': {
    subject: 'spelling', grade: 6, standard: 'AZCCRS.L.6.4',
    problems: [
      { problem: "This French word for a dance keeps its French spelling: b_ll_t", answer: "ballet", walkthrough: { steps: [
        { step: 1, action: "Gigi explains origin", voice_text: "Ballet comes from French!" },
        { step: 2, action: "Gigi spells", voice_text: "B-A-L-L-E-T. The French -et ending!" },
        { step: 3, action: "Gigi confirms", voice_text: "Ballet! French spelling preserved!" }
      ]}},
      { problem: "Spell the Spanish word for a violent windstorm: t_rn_d_", answer: "tornado", walkthrough: { steps: [
        { step: 1, action: "Gigi explains", voice_text: "Tornado is from Spanish!" },
        { step: 2, action: "Gigi spells", voice_text: "T-O-R-N-A-D-O. Ends in O like Spanish words!" },
        { step: 3, action: "Gigi confirms", voice_text: "Tornado! T-O-R-N-A-D-O!" }
      ]}},
      { problem: "This Greek-origin word means 'study of the mind': psych_l_gy", answer: "psychology", walkthrough: { steps: [
        { step: 1, action: "Gigi explains", voice_text: "Psychology comes from Greek psyche (mind)!" },
        { step: 2, action: "Gigi notes the silent p", voice_text: "The P is silent! P-S-Y-C-H-O-L-O-G-Y!" },
        { step: 3, action: "Gigi confirms", voice_text: "Psychology! Silent P from Greek!" }
      ]}}
    ]
  },
  'SPELLING-R-GENERAL-G7': {
    subject: 'spelling', grade: 7, standard: 'AZCCRS.L.7.4',
    problems: [
      { problem: "Spell the scientific word for an educated guess: hyp_th_s_s", answer: "hypothesis", walkthrough: { steps: [
        { step: 1, action: "Gigi breaks it down", voice_text: "Hypo means under, thesis means placing." },
        { step: 2, action: "Gigi spells", voice_text: "H-Y-P-O-T-H-E-S-I-S!" },
        { step: 3, action: "Gigi confirms", voice_text: "Hypothesis! A scientific prediction!" }
      ]}},
      { problem: "Spell the math word for a step-by-step procedure: alg_r_thm", answer: "algorithm", walkthrough: { steps: [
        { step: 1, action: "Gigi explains origin", voice_text: "Named after mathematician al-Khwarizmi!" },
        { step: 2, action: "Gigi spells", voice_text: "A-L-G-O-R-I-T-H-M!" },
        { step: 3, action: "Gigi confirms", voice_text: "Algorithm! A-L-G-O-R-I-T-H-M!" }
      ]}},
      { problem: "Spell: the distance around a circle: c_rc_mf_r_nce", answer: "circumference", walkthrough: { steps: [
        { step: 1, action: "Gigi breaks it down", voice_text: "Circum means around, ference means carry." },
        { step: 2, action: "Gigi spells", voice_text: "C-I-R-C-U-M-F-E-R-E-N-C-E!" },
        { step: 3, action: "Gigi confirms", voice_text: "Circumference! Around the circle!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G0': {
    subject: 'coding', grade: 0, standard: 'ISTE.1c',
    problems: [
      { problem: "What command makes the robot go forward?", answer: "move forward", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the robot", voice_text: "Our robot needs a command!" },
        { step: 2, action: "Gigi gives the command", voice_text: "Move forward! Watch it go!" },
        { step: 3, action: "Gigi confirms", voice_text: "Move forward makes it go!" }
      ]}},
      { problem: "What command makes the robot turn?", answer: "turn left or turn right", walkthrough: { steps: [
        { step: 1, action: "Gigi shows options", voice_text: "Which way should it turn?" },
        { step: 2, action: "Gigi demonstrates", voice_text: "Turn left! Or turn right!" },
        { step: 3, action: "Gigi confirms", voice_text: "Turn commands change direction!" }
      ]}},
      { problem: "Give a command to make the robot jump", answer: "jump", walkthrough: { steps: [
        { step: 1, action: "Gigi thinks", voice_text: "We want the robot to jump..." },
        { step: 2, action: "Gigi gives command", voice_text: "Jump! Up it goes!" },
        { step: 3, action: "Gigi confirms", voice_text: "Commands tell robots what to do!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G1': {
    subject: 'coding', grade: 1, standard: 'ISTE.1c',
    problems: [
      { problem: "Put in order: walk, pick up, put down", answer: "pick up, walk, put down", walkthrough: { steps: [
        { step: 1, action: "Gigi thinks about order", voice_text: "What should happen first?" },
        { step: 2, action: "Gigi arranges", voice_text: "First pick up, then walk, then put down!" },
        { step: 3, action: "Gigi confirms", voice_text: "Order matters in coding!" }
      ]}},
      { problem: "What happens if you walk before picking up?", answer: "You can't carry the item", walkthrough: { steps: [
        { step: 1, action: "Gigi demonstrates wrong order", voice_text: "If we walk first..." },
        { step: 2, action: "Gigi shows problem", voice_text: "We leave the item behind!" },
        { step: 3, action: "Gigi explains", voice_text: "Order changes the result!" }
      ]}},
      { problem: "What word describes commands in order?", answer: "sequence", walkthrough: { steps: [
        { step: 1, action: "Gigi introduces term", voice_text: "Commands in order are called..." },
        { step: 2, action: "Gigi reveals", voice_text: "A sequence! First, next, then!" },
        { step: 3, action: "Gigi confirms", voice_text: "Sequences are ordered commands!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G2': {
    subject: 'coding', grade: 2, standard: 'ISTE.1c',
    problems: [
      { problem: "How do you make the robot move forward 4 times using a loop?", answer: "repeat 4 times: move forward", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the long way", voice_text: "Move, move, move, move... that's a lot!" },
        { step: 2, action: "Gigi shows the loop", voice_text: "Repeat 4 times: move forward!" },
        { step: 3, action: "Gigi confirms", voice_text: "Loops repeat commands!" }
      ]}},
      { problem: "What does 'repeat 3 times: jump' do?", answer: "Makes the robot jump 3 times", walkthrough: { steps: [
        { step: 1, action: "Gigi reads the code", voice_text: "Repeat 3 times: jump..." },
        { step: 2, action: "Gigi demonstrates", voice_text: "Jump! Jump! Jump! Three times!" },
        { step: 3, action: "Gigi confirms", voice_text: "The loop ran jump 3 times!" }
      ]}},
      { problem: "Why are loops useful?", answer: "They save time and reduce code", walkthrough: { steps: [
        { step: 1, action: "Gigi compares", voice_text: "Without loops: write the same thing many times." },
        { step: 2, action: "Gigi shows benefit", voice_text: "With loops: write once, run many times!" },
        { step: 3, action: "Gigi confirms", voice_text: "Loops are a coder's shortcut!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G3': {
    subject: 'coding', grade: 3, standard: 'ISTE.1c',
    problems: [
      { problem: "Complete: IF it's raining THEN ___", answer: "take an umbrella (or similar)", walkthrough: { steps: [
        { step: 1, action: "Gigi sets up condition", voice_text: "IF it's raining is the condition..." },
        { step: 2, action: "Gigi adds action", voice_text: "THEN we should take an umbrella!" },
        { step: 3, action: "Gigi confirms", voice_text: "IF-THEN makes decisions!" }
      ]}},
      { problem: "What does IF score > 10 THEN win check?", answer: "If the score is greater than 10", walkthrough: { steps: [
        { step: 1, action: "Gigi reads the condition", voice_text: "Score > 10 means score greater than 10." },
        { step: 2, action: "Gigi explains", voice_text: "If true, the player wins!" },
        { step: 3, action: "Gigi confirms", voice_text: "Conditionals check and decide!" }
      ]}},
      { problem: "What is ELSE used for?", answer: "What happens when the condition is false", walkthrough: { steps: [
        { step: 1, action: "Gigi explains IF", voice_text: "IF handles when true..." },
        { step: 2, action: "Gigi explains ELSE", voice_text: "ELSE handles when false!" },
        { step: 3, action: "Gigi confirms", voice_text: "IF this THEN that ELSE other!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G4': {
    subject: 'coding', grade: 4, standard: 'ISTE.1c',
    problems: [
      { problem: "Create a variable called score and set it to 0", answer: "score = 0", walkthrough: { steps: [
        { step: 1, action: "Gigi explains variables", voice_text: "Variables store data with a name." },
        { step: 2, action: "Gigi creates variable", voice_text: "score = 0. Now score holds 0!" },
        { step: 3, action: "Gigi confirms", voice_text: "Score is our variable!" }
      ]}},
      { problem: "If score = 10, what does score = score + 5 make score?", answer: "15", walkthrough: { steps: [
        { step: 1, action: "Gigi shows starting value", voice_text: "Score starts at 10." },
        { step: 2, action: "Gigi calculates", voice_text: "10 + 5 = 15. Score is now 15!" },
        { step: 3, action: "Gigi confirms", voice_text: "Variables can change!" }
      ]}},
      { problem: "What type of data is 'Alex'?", answer: "text (or string)", walkthrough: { steps: [
        { step: 1, action: "Gigi examines", voice_text: "'Alex' has letters, it's text!" },
        { step: 2, action: "Gigi explains", voice_text: "Text is also called a string." },
        { step: 3, action: "Gigi confirms", voice_text: "Strings store text data!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G5': {
    subject: 'coding', grade: 5, standard: 'ISTE.1c',
    problems: [
      { problem: "What does function greet() { print('Hello!') } define?", answer: "A function called greet that prints Hello!", walkthrough: { steps: [
        { step: 1, action: "Gigi reads the code", voice_text: "function greet() defines a function named greet." },
        { step: 2, action: "Gigi shows what it does", voice_text: "Inside, it prints Hello!" },
        { step: 3, action: "Gigi confirms", voice_text: "Functions group code together!" }
      ]}},
      { problem: "How do you run a function called greet?", answer: "greet()", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the syntax", voice_text: "To call a function, use its name..." },
        { step: 2, action: "Gigi demonstrates", voice_text: "greet() - name plus parentheses!" },
        { step: 3, action: "Gigi confirms", voice_text: "greet() calls the function!" }
      ]}},
      { problem: "What is a parameter in function add(a, b)?", answer: "a and b are inputs the function receives", walkthrough: { steps: [
        { step: 1, action: "Gigi shows parameters", voice_text: "a and b are in the parentheses." },
        { step: 2, action: "Gigi explains", voice_text: "They're inputs! You pass values in!" },
        { step: 3, action: "Gigi confirms", voice_text: "Parameters let functions use different values!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G6': {
    subject: 'coding', grade: 6, standard: 'ISTE.1c',
    problems: [
      { problem: "What should you do when you see an error message?", answer: "Read it carefully for clues", walkthrough: { steps: [
        { step: 1, action: "Gigi shows an error", voice_text: "SyntaxError: unexpected token" },
        { step: 2, action: "Gigi explains", voice_text: "This tells us there's a syntax problem!" },
        { step: 3, action: "Gigi confirms", voice_text: "Error messages are clues!" }
      ]}},
      { problem: "What is debugging?", answer: "Finding and fixing errors in code", walkthrough: { steps: [
        { step: 1, action: "Gigi defines", voice_text: "Bugs are errors in code." },
        { step: 2, action: "Gigi explains", voice_text: "Debugging is finding and fixing them!" },
        { step: 3, action: "Gigi confirms", voice_text: "Debug = de-bug, remove the bug!" }
      ]}},
      { problem: "What's the best way to fix multiple bugs?", answer: "One at a time", walkthrough: { steps: [
        { step: 1, action: "Gigi gives advice", voice_text: "Don't try to fix everything at once!" },
        { step: 2, action: "Gigi explains", voice_text: "Fix one bug, test, then move to the next." },
        { step: 3, action: "Gigi confirms", voice_text: "One at a time keeps things manageable!" }
      ]}}
    ]
  },
  'CODING-R-GENERAL-G7': {
    subject: 'coding', grade: 7, standard: 'ISTE.1c',
    problems: [
      { problem: "What is an algorithm?", answer: "A step-by-step procedure to solve a problem", walkthrough: { steps: [
        { step: 1, action: "Gigi defines", voice_text: "An algorithm is like a recipe." },
        { step: 2, action: "Gigi elaborates", voice_text: "Precise steps in a specific order!" },
        { step: 3, action: "Gigi confirms", voice_text: "Algorithms solve problems step by step!" }
      ]}},
      { problem: "Why is efficiency important in algorithms?", answer: "Some methods are faster than others", walkthrough: { steps: [
        { step: 1, action: "Gigi compares", voice_text: "Checking every item is slow..." },
        { step: 2, action: "Gigi shows better way", voice_text: "Binary search is much faster!" },
        { step: 3, action: "Gigi confirms", voice_text: "Efficient algorithms save time!" }
      ]}},
      { problem: "What should you do before coding an algorithm?", answer: "Plan and think about the approach", walkthrough: { steps: [
        { step: 1, action: "Gigi advises", voice_text: "Don't just start coding!" },
        { step: 2, action: "Gigi explains", voice_text: "Plan your approach first!" },
        { step: 3, action: "Gigi confirms", voice_text: "Think, plan, then code!" }
      ]}}
    ]
  },
  'MATH-R-GENERAL-G1': {
    subject: 'math', grade: 1, standard: 'AZCCRS.1.OA.6',
    problems: [
      { problem: "5 + 3 = ?", answer: "8", walkthrough: { steps: [
        { step: 1, action: "Gigi shows counters", voice_text: "Let's add! 5 counters plus 3 more." },
        { step: 2, action: "Gigi counts", voice_text: "1, 2, 3, 4, 5... 6, 7, 8!" },
        { step: 3, action: "Gigi confirms", voice_text: "5 + 3 = 8!" }
      ]}},
      { problem: "8 - 3 = ?", answer: "5", walkthrough: { steps: [
        { step: 1, action: "Gigi shows counters", voice_text: "Start with 8, take away 3." },
        { step: 2, action: "Gigi removes", voice_text: "Remove 3... count what's left!" },
        { step: 3, action: "Gigi confirms", voice_text: "8 - 3 = 5!" }
      ]}},
      { problem: "What fact family uses 5, 3, and 8?", answer: "5+3=8, 3+5=8, 8-3=5, 8-5=3", walkthrough: { steps: [
        { step: 1, action: "Gigi explains", voice_text: "A fact family uses the same numbers." },
        { step: 2, action: "Gigi lists", voice_text: "5+3=8, 3+5=8, 8-3=5, 8-5=3!" },
        { step: 3, action: "Gigi confirms", voice_text: "Four facts, one family!" }
      ]}}
    ]
  },
  'MATH-R-PLACEVALUE-G0': {
    subject: 'math', grade: 0, standard: 'AZCCRS.K.CC.3',
    problems: [
      { problem: "Count the stars: ★★★★★", answer: "5", walkthrough: { steps: [
        { step: 1, action: "Gigi points to each star", voice_text: "Let's count! Point to each one." },
        { step: 2, action: "Gigi counts", voice_text: "1, 2, 3, 4, 5!" },
        { step: 3, action: "Gigi confirms", voice_text: "There are 5 stars!" }
      ]}},
      { problem: "What number comes after 10?", answer: "11", walkthrough: { steps: [
        { step: 1, action: "Gigi counts", voice_text: "10... what comes next?" },
        { step: 2, action: "Gigi reveals", voice_text: "11! It's ten and one more!" },
        { step: 3, action: "Gigi confirms", voice_text: "10, 11! Eleven comes after ten!" }
      ]}},
      { problem: "How many fingers do you have?", answer: "10", walkthrough: { steps: [
        { step: 1, action: "Gigi holds up hands", voice_text: "Let's count your fingers!" },
        { step: 2, action: "Gigi counts", voice_text: "1, 2, 3, 4, 5... 6, 7, 8, 9, 10!" },
        { step: 3, action: "Gigi confirms", voice_text: "You have 10 fingers!" }
      ]}}
    ]
  },
  'MATH-R-PLACEVALUE-G1': {
    subject: 'math', grade: 1, standard: 'AZCCRS.1.NBT.2',
    problems: [
      { problem: "In 34, how many tens?", answer: "3", walkthrough: { steps: [
        { step: 1, action: "Gigi points to tens place", voice_text: "The 3 is in the tens place." },
        { step: 2, action: "Gigi explains", voice_text: "3 means 3 tens, which is 30!" },
        { step: 3, action: "Gigi confirms", voice_text: "34 has 3 tens!" }
      ]}},
      { problem: "In 56, how many ones?", answer: "6", walkthrough: { steps: [
        { step: 1, action: "Gigi points to ones place", voice_text: "The 6 is in the ones place." },
        { step: 2, action: "Gigi explains", voice_text: "6 means 6 ones!" },
        { step: 3, action: "Gigi confirms", voice_text: "56 has 6 ones!" }
      ]}},
      { problem: "30 + 4 = ?", answer: "34", walkthrough: { steps: [
        { step: 1, action: "Gigi shows place value", voice_text: "30 is 3 tens, 4 is 4 ones." },
        { step: 2, action: "Gigi combines", voice_text: "Put them together: 34!" },
        { step: 3, action: "Gigi confirms", voice_text: "3 tens and 4 ones is 34!" }
      ]}}
    ]
  },
  'MATH-R-COMPARE-G1': {
    subject: 'math', grade: 1, standard: 'AZCCRS.1.NBT.3',
    problems: [
      { problem: "Which is greater: 45 or 32?", answer: "45", walkthrough: { steps: [
        { step: 1, action: "Gigi compares tens", voice_text: "45 has 4 tens, 32 has 3 tens." },
        { step: 2, action: "Gigi decides", voice_text: "4 tens > 3 tens, so 45 is greater!" },
        { step: 3, action: "Gigi confirms", voice_text: "45 > 32!" }
      ]}},
      { problem: "Compare: 48 ○ 45", answer: "48 > 45", walkthrough: { steps: [
        { step: 1, action: "Gigi compares tens", voice_text: "Both have 4 tens. Check ones!" },
        { step: 2, action: "Gigi compares ones", voice_text: "8 > 5, so 48 > 45!" },
        { step: 3, action: "Gigi confirms", voice_text: "48 is greater than 45!" }
      ]}},
      { problem: "What symbol goes here: 50 ○ 50", answer: "=", walkthrough: { steps: [
        { step: 1, action: "Gigi looks at both", voice_text: "50 and 50... are they the same?" },
        { step: 2, action: "Gigi compares", voice_text: "Same tens, same ones. They're equal!" },
        { step: 3, action: "Gigi confirms", voice_text: "50 = 50!" }
      ]}}
    ]
  },
  'READING-R-FLUENCY-G3': {
    subject: 'reading', grade: 3, standard: 'AZCCRS.RF.3.4',
    problems: [
      { problem: "How should you read: Is it raining?", answer: "With voice going up at the end", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the question mark", voice_text: "See the question mark?" },
        { step: 2, action: "Gigi demonstrates", voice_text: "Is it raining? Voice goes UP!" },
        { step: 3, action: "Gigi confirms", voice_text: "Questions end with voice up!" }
      ]}},
      { problem: "How should you read: Watch out!", answer: "With excitement", walkthrough: { steps: [
        { step: 1, action: "Gigi shows exclamation", voice_text: "See the exclamation point?" },
        { step: 2, action: "Gigi demonstrates", voice_text: "Watch out! Say it with energy!" },
        { step: 3, action: "Gigi confirms", voice_text: "Exclamations are exciting!" }
      ]}},
      { problem: "What does a period tell you to do?", answer: "Pause", walkthrough: { steps: [
        { step: 1, action: "Gigi shows a period", voice_text: "A period ends a sentence." },
        { step: 2, action: "Gigi demonstrates", voice_text: "It's time to stop. [pause] Then continue." },
        { step: 3, action: "Gigi confirms", voice_text: "Periods mean pause!" }
      ]}}
    ]
  },
  'READING-R-FLUENCY-G4': {
    subject: 'reading', grade: 4, standard: 'AZCCRS.RF.4.4',
    problems: [
      { problem: "What pace should you read at?", answer: "Natural talking speed", walkthrough: { steps: [
        { step: 1, action: "Gigi explains", voice_text: "Not too fast, not too slow." },
        { step: 2, action: "Gigi demonstrates", voice_text: "Read like you're talking to a friend!" },
        { step: 3, action: "Gigi confirms", voice_text: "Natural pace = smooth reading!" }
      ]}},
      { problem: "How should you read: 'The big dog ran quickly'?", answer: "In phrases: 'The big dog' / 'ran quickly'", walkthrough: { steps: [
        { step: 1, action: "Gigi shows wrong way", voice_text: "Not: The... big... dog... ran..." },
        { step: 2, action: "Gigi shows right way", voice_text: "The big dog [pause] ran quickly!" },
        { step: 3, action: "Gigi confirms", voice_text: "Read in phrases, not word by word!" }
      ]}},
      { problem: "How can you improve reading fluency?", answer: "Practice by re-reading passages", walkthrough: { steps: [
        { step: 1, action: "Gigi gives advice", voice_text: "Want to read smoother?" },
        { step: 2, action: "Gigi explains", voice_text: "Re-read the same passage! It gets easier!" },
        { step: 3, action: "Gigi confirms", voice_text: "Practice makes fluent!" }
      ]}}
    ]
  },
  'READING-R-EVIDENCE-G3': {
    subject: 'reading', grade: 3, standard: 'AZCCRS.RL.3.1',
    problems: [
      { problem: "Where should you look to answer a reading question?", answer: "Back in the text", walkthrough: { steps: [
        { step: 1, action: "Gigi advises", voice_text: "Don't just guess!" },
        { step: 2, action: "Gigi shows technique", voice_text: "Go back to the text and find the answer!" },
        { step: 3, action: "Gigi confirms", voice_text: "The text has the proof!" }
      ]}},
      { problem: "What phrase can you use to show text evidence?", answer: "The text says... or According to the passage...", walkthrough: { steps: [
        { step: 1, action: "Gigi gives examples", voice_text: "Start with: The text says..." },
        { step: 2, action: "Gigi adds more", voice_text: "Or: According to the passage..." },
        { step: 3, action: "Gigi confirms", voice_text: "These show you found evidence!" }
      ]}},
      { problem: "If asked 'Why did the character feel sad?', what should you find?", answer: "Words from the text that show why", walkthrough: { steps: [
        { step: 1, action: "Gigi reads the question", voice_text: "Why did the character feel sad?" },
        { step: 2, action: "Gigi explains", voice_text: "Find the exact words that tell us why!" },
        { step: 3, action: "Gigi confirms", voice_text: "Quote the text as evidence!" }
      ]}}
    ]
  },
  'READING-R-SEQUENCE-G0': {
    subject: 'reading', grade: 0, standard: 'AZCCRS.RL.K.2',
    problems: [
      { problem: "What are the three parts of a story?", answer: "Beginning, middle, end", walkthrough: { steps: [
        { step: 1, action: "Gigi explains", voice_text: "Every story has three parts!" },
        { step: 2, action: "Gigi lists", voice_text: "Beginning, middle, and end!" },
        { step: 3, action: "Gigi confirms", voice_text: "Three parts tell the whole story!" }
      ]}},
      { problem: "Which comes first: next, last, or first?", answer: "first", walkthrough: { steps: [
        { step: 1, action: "Gigi lines them up", voice_text: "Let's put these in order." },
        { step: 2, action: "Gigi orders", voice_text: "First, next, last!" },
        { step: 3, action: "Gigi confirms", voice_text: "First comes first!" }
      ]}},
      { problem: "Put in order: Then the bear slept. First the bear woke up. Last the bear ate.", answer: "First the bear woke up, Then the bear slept [should be ate], Last...", walkthrough: { steps: [
        { step: 1, action: "Gigi finds 'First'", voice_text: "First the bear woke up." },
        { step: 2, action: "Gigi continues", voice_text: "Then/next comes the middle action." },
        { step: 3, action: "Gigi finishes", voice_text: "Last comes at the end!" }
      ]}}
    ]
  },
  'READING-R-PHONICS-G1': {
    subject: 'reading', grade: 1, standard: 'AZCCRS.RF.1.3',
    problems: [
      { problem: "What blend do you hear at the start of 'stop'?", answer: "st", walkthrough: { steps: [
        { step: 1, action: "Gigi says the word", voice_text: "Listen: st-op." },
        { step: 2, action: "Gigi isolates blend", voice_text: "S and T together make /st/!" },
        { step: 3, action: "Gigi confirms", voice_text: "The blend is ST!" }
      ]}},
      { problem: "What blend starts 'frog'?", answer: "fr", walkthrough: { steps: [
        { step: 1, action: "Gigi says the word", voice_text: "Listen: fr-og." },
        { step: 2, action: "Gigi isolates", voice_text: "F and R together make /fr/!" },
        { step: 3, action: "Gigi confirms", voice_text: "The blend is FR!" }
      ]}},
      { problem: "Which word starts with a blend: cat or clap?", answer: "clap", walkthrough: { steps: [
        { step: 1, action: "Gigi checks cat", voice_text: "Cat starts with just /k/." },
        { step: 2, action: "Gigi checks clap", voice_text: "Clap starts with /cl/!" },
        { step: 3, action: "Gigi confirms", voice_text: "Clap has the CL blend!" }
      ]}}
    ]
  },
  'READING-R-SIGHT-G0': {
    subject: 'reading', grade: 0, standard: 'AZCCRS.RF.K.3',
    problems: [
      { problem: "Read this word: the", answer: "the", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the word", voice_text: "This is 'the' - you'll see it everywhere!" },
        { step: 2, action: "Gigi reads", voice_text: "The. Just know it by sight!" },
        { step: 3, action: "Gigi confirms", voice_text: "The! A super important sight word!" }
      ]}},
      { problem: "Read this word: and", answer: "and", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the word", voice_text: "This is 'and' - it connects things!" },
        { step: 2, action: "Gigi reads", voice_text: "And. You and me!" },
        { step: 3, action: "Gigi confirms", voice_text: "And! Learn it by heart!" }
      ]}},
      { problem: "Read this word: said", answer: "said", walkthrough: { steps: [
        { step: 1, action: "Gigi shows the word", voice_text: "This is 'said' - it's tricky!" },
        { step: 2, action: "Gigi explains", voice_text: "It looks like 'say-d' but sounds like 'sed'!" },
        { step: 3, action: "Gigi confirms", voice_text: "Said! Remember: 'sed'!" }
      ]}}
    ]
  },
  'WRITE-R-GENERAL-G0': {
    subject: 'writing', grade: 0, standard: 'AZCCRS.L.K.1',
    problems: [
      { problem: "Which fingers hold the pencil?", answer: "Thumb, pointer, and middle finger", walkthrough: { steps: [
        { step: 1, action: "Gigi shows grip", voice_text: "Let's hold the pencil right!" },
        { step: 2, action: "Gigi demonstrates", voice_text: "Thumb and pointer pinch, middle supports!" },
        { step: 3, action: "Gigi confirms", voice_text: "That's the tripod grip!" }
      ]}},
      { problem: "What is the tripod grip?", answer: "Holding pencil with three fingers", walkthrough: { steps: [
        { step: 1, action: "Gigi explains", voice_text: "Tripod means three!" },
        { step: 2, action: "Gigi shows", voice_text: "Three fingers hold the pencil!" },
        { step: 3, action: "Gigi confirms", voice_text: "Tripod grip = 3 fingers!" }
      ]}},
      { problem: "Where does your middle finger go?", answer: "Under the pencil for support", walkthrough: { steps: [
        { step: 1, action: "Gigi positions finger", voice_text: "Thumb and pointer on top..." },
        { step: 2, action: "Gigi adds middle finger", voice_text: "Middle finger underneath to support!" },
        { step: 3, action: "Gigi confirms", voice_text: "Middle finger is the support!" }
      ]}}
    ]
  },
  'WRITE-R-GENERAL-G2': {
    subject: 'writing', grade: 2, standard: 'AZCCRS.L.2.1',
    problems: [
      { problem: "What is the subject of: The cat sleeps.", answer: "The cat", walkthrough: { steps: [
        { step: 1, action: "Gigi asks", voice_text: "Who or what is the sentence about?" },
        { step: 2, action: "Gigi identifies", voice_text: "The cat! The cat is the subject!" },
        { step: 3, action: "Gigi confirms", voice_text: "Subject = who or what!" }
      ]}},
      { problem: "What is the predicate of: The dog runs.", answer: "runs", walkthrough: { steps: [
        { step: 1, action: "Gigi asks", voice_text: "What does the dog do?" },
        { step: 2, action: "Gigi identifies", voice_text: "Runs! That's the predicate!" },
        { step: 3, action: "Gigi confirms", voice_text: "Predicate = what the subject does!" }
      ]}},
      { problem: "Is this a complete sentence: Runs fast.", answer: "No, it's missing a subject", walkthrough: { steps: [
        { step: 1, action: "Gigi checks for subject", voice_text: "Who runs fast? It doesn't say!" },
        { step: 2, action: "Gigi explains", voice_text: "There's no subject! Not complete!" },
        { step: 3, action: "Gigi fixes", voice_text: "The dog runs fast. Now it's complete!" }
      ]}}
    ]
  }
};

async function generateDemoProblems() {
  console.log('Generating demo_problems for ' + missingRuleIds.length + ' missing rule_ids...\n');

  const allProblems = [];
  let counter = 1;

  for (const ruleId of missingRuleIds) {
    const template = demoTemplates[ruleId];

    if (template) {
      for (let i = 0; i < template.problems.length; i++) {
        const prob = template.problems[i];
        allProblems.push({
          demo_id: 'DEMO-' + ruleId + '-' + String(counter).padStart(3, '0'),
          rule_id: ruleId,
          subject: template.subject,
          grade: template.grade,
          standard: template.standard,
          problem: prob.problem,
          answer: prob.answer,
          walkthrough: prob.walkthrough
        });
        counter++;
      }
      console.log('Generated 3 problems for: ' + ruleId);
    } else {
      console.log('No template for: ' + ruleId);
    }
  }

  console.log('\nInserting ' + allProblems.length + ' demo problems...');

  // Insert in batches
  const batchSize = 20;
  let inserted = 0;

  for (let i = 0; i < allProblems.length; i += batchSize) {
    const batch = allProblems.slice(i, i + batchSize);
    const { error } = await supabase.from('demo_problems').insert(batch);

    if (error) {
      console.log('Error inserting batch:', error.message);
    } else {
      inserted += batch.length;
      console.log('Inserted batch: ' + inserted + '/' + allProblems.length);
    }
  }

  console.log('\nDone! Inserted ' + inserted + ' demo_problems');

  // Verify new count
  const { count } = await supabase.from('demo_problems').select('*', { count: 'exact', head: true });
  console.log('New total demo_problems: ' + count);
}

generateDemoProblems();
