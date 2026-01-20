const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Missing rule_ids that need explanations
const missingRuleIds = [
  'WRITING-R-GENERAL-G2',
  'MATH-R-PERCENT-G7',
  'MATH-R-COUNT-G0',
  'READING-R-GENERAL-G4',
  'MATH-R-COMPARE-G0',
  'READING-R-GENERAL-G5',
  'SPELLING-R-GENERAL-G1',
  'READING-R-PHONICS-G1',
  'READING-R-GENERAL-G6',
  'MATH-R-WORDPROB-G7',
  'TYPING-R-GENERAL-G2',
  'TYPING-R-GENERAL-G1',
  'WRITING-R-SENTENCE-G0',
  'WRITING-R-PARA-G2',
  'READING-R-GENERAL-G7',
  'SPELLING-R-GENERAL-G0',
  'WRITING-R-GENERAL-G3',
  'TYPING-R-GENERAL-G7',
  'READING-R-SIGHT-G0',
  'WRITING-R-GENERAL-G4',
  'WRITING-R-GENERAL-G5',
  'CODING-R-GENERAL-G1',
  'CODING-R-GENERAL-G2',
  'READING-R-EVIDENCE-G3',
  'WRITE-R-GENERAL-G2',
  'WRITING-R-GENERAL-G6',
  'TYPING-R-GENERAL-G0',
  'CODING-R-GENERAL-G0',
  'READING-R-FLUENCY-G3',
  'WRITE-R-GENERAL-G0',
  'WRITING-R-GENERAL-G7',
  'READING-R-SEQUENCE-G0',
  'MATH-R-DIV-G3',
  'MATH-R-PATTERN-G0',
  'WRITING-R-SENTENCE-G1',
  'READING-R-FLUENCY-G5',
  'TYPING-R-NUMROW-G3',
  'TYPING-R-SPEED-G4',
  'TYPING-R-FINDLETTERS-G0',
  'TYPING-R-SPACEBAR-G0',
  'TYPING-R-HOMEROW-G1',
  'TYPING-R-LEFTHAND-G1',
  'TYPING-R-TOPROW-G2',
  'TYPING-R-BOTTOMROW-G2',
  'TYPING-R-ENTER-G0',
  'TYPING-R-RIGHTHAND-G1',
  'TYPING-R-SHIFT-G2',
  'TYPING-R-ACCURACY-G5',
  'MATH-R-COMPARE-G1',
  'MATH-R-PLACEVALUE-G0',
  'SPELLING-R-SIGHT-G2',
  'MATH-R-PLACEVALUE-G1',
  'MATH-R-FRAC-G0',
  'MATH-R-FRAC-G1',
  'WRITE-R-Capital'
];

// Generate explanations based on rule_id
function generateExplanation(ruleId) {
  const parts = ruleId.split('-');
  const subject = parts[0];
  const skill = parts[2];
  const grade = parts[3] || 'G0';
  const gradeNum = parseInt(grade.replace('G', '')) || 0;

  const subjectCodeMap = {
    'MATH': 'MATH',
    'READING': 'READ',
    'WRITING': 'LANG',
    'WRITE': 'LANG',
    'SPELLING': 'SPELL',
    'TYPING': 'TYPE',
    'CODING': 'CODE'
  };

  const explanations = {
    // MATH
    'MATH-R-PERCENT-G7': {
      skill_name: 'Percentages',
      level_1: 'A percent means "per hundred." 50% means 50 out of 100. To find a percent of a number, convert to decimal and multiply.',
      level_2: 'Think of percent as parts of 100. 25% = 25/100 = 0.25. Multiply by the whole number to find the part.',
      level_3: 'Imagine 100 candies. 30% means you get 30 candies. For other amounts, multiply: 30% of 50 = 0.30 × 50 = 15.',
      visual_explanation: 'Draw a 10×10 grid (100 squares). Shade the percent amount. Count shaded squares.',
      step_by_step: 'Step 1: Convert percent to decimal (divide by 100). Step 2: Multiply decimal by the number. Step 3: Your answer is the percentage of that number.'
    },
    'MATH-R-COUNT-G0': {
      skill_name: 'Counting Numbers',
      level_1: 'Counting means saying numbers in order: 1, 2, 3, 4, 5... Each number is one more than before.',
      level_2: 'Point to each object as you count. Say one number for each thing you touch.',
      level_3: 'Count your fingers! Touch each one and say: 1, 2, 3, 4, 5. Now count the other hand!',
      visual_explanation: 'Show objects in a row. Point to each one while saying the number.',
      step_by_step: 'Step 1: Start at 1. Step 2: Point to each object. Step 3: Say the next number. Step 4: Keep going until done.'
    },
    'MATH-R-COMPARE-G0': {
      skill_name: 'Comparing Numbers',
      level_1: 'Comparing means finding which number is bigger or smaller. Use more than (>), less than (<), or equal (=).',
      level_2: 'Line up objects to compare. The longer line has more. The shorter line has less.',
      level_3: 'Who has more cookies? Count each pile. The pile with more cookies is greater!',
      visual_explanation: 'Draw two groups of dots. The group with more dots is the bigger number.',
      step_by_step: 'Step 1: Count the first group. Step 2: Count the second group. Step 3: The bigger count is greater (>).'
    },
    'MATH-R-COMPARE-G1': {
      skill_name: 'Comparing Two-Digit Numbers',
      level_1: 'To compare two-digit numbers, first look at the tens place. The bigger tens digit means a bigger number.',
      level_2: 'Compare tens first. If tens are equal, compare the ones. 45 > 43 because 5 > 3.',
      level_3: 'Think of 45 as 4 groups of ten plus 5 ones. Compare groups first, then leftovers.',
      visual_explanation: 'Draw tens as sticks and ones as dots. Compare sticks first, then dots.',
      step_by_step: 'Step 1: Compare tens digits. Step 2: If equal, compare ones digits. Step 3: Write >, <, or =.'
    },
    'MATH-R-WORDPROB-G7': {
      skill_name: 'Word Problems',
      level_1: 'Read the problem carefully. Identify what you know and what you need to find. Set up an equation and solve.',
      level_2: 'Underline important numbers and keywords. "Total" means add. "Difference" means subtract. "Each" often means multiply or divide.',
      level_3: 'Think of it as a story. What happened first? What changed? What do they want to know at the end?',
      visual_explanation: 'Draw a picture of the problem. Label known values. Mark the unknown with a question mark.',
      step_by_step: 'Step 1: Read twice. Step 2: List known facts. Step 3: Identify the question. Step 4: Choose operation. Step 5: Solve and check.'
    },
    'MATH-R-DIV-G3': {
      skill_name: 'Division Facts',
      level_1: 'Division means splitting into equal groups. 12 ÷ 3 = 4 means 12 things split into 3 groups gives 4 in each group.',
      level_2: 'Division is the opposite of multiplication. If 3 × 4 = 12, then 12 ÷ 3 = 4 and 12 ÷ 4 = 3.',
      level_3: 'Share 12 cookies among 3 friends equally. Each friend gets 12 ÷ 3 = 4 cookies!',
      visual_explanation: 'Draw 12 circles. Draw 3 boxes. Put equal circles in each box. Count per box.',
      step_by_step: 'Step 1: Start with the total. Step 2: Decide how many groups. Step 3: Share equally. Step 4: Count per group.'
    },
    'MATH-R-PATTERN-G0': {
      skill_name: 'Patterns',
      level_1: 'A pattern repeats in a special order. Find what repeats and predict what comes next.',
      level_2: 'Look for the part that keeps repeating. Say it out loud: red, blue, red, blue... next is red!',
      level_3: 'Clap the pattern! Clap-stomp-clap-stomp. What comes next? Clap!',
      visual_explanation: 'Circle the repeating part. Copy it to continue the pattern.',
      step_by_step: 'Step 1: Look at the sequence. Step 2: Find what repeats. Step 3: Continue the pattern.'
    },
    'MATH-R-PLACEVALUE-G0': {
      skill_name: 'Place Value Basics',
      level_1: 'Each digit in a number has a place. The ones place tells how many single items.',
      level_2: 'In 5, the 5 is in the ones place. It means 5 single things.',
      level_3: 'Count 5 blocks. Each block is 1. All together, we write 5 in the ones place.',
      visual_explanation: 'Show base-ten blocks. Single cubes are ones.',
      step_by_step: 'Step 1: Count the objects. Step 2: Write the number. Step 3: That number is in the ones place.'
    },
    'MATH-R-PLACEVALUE-G1': {
      skill_name: 'Tens and Ones',
      level_1: 'Two-digit numbers have tens and ones. In 34, the 3 means 3 tens (30) and the 4 means 4 ones.',
      level_2: 'Group by tens first. 34 = 3 groups of 10 + 4 extra = 30 + 4.',
      level_3: 'Bundle 10 sticks together. How many bundles? How many loose sticks? That is your number!',
      visual_explanation: 'Draw tens as long bars, ones as small squares. 34 = |||  ····',
      step_by_step: 'Step 1: Look at the left digit (tens). Step 2: Multiply by 10. Step 3: Add the right digit (ones).'
    },
    'MATH-R-FRAC-G0': {
      skill_name: 'Introduction to Fractions',
      level_1: 'A fraction shows parts of a whole. 1/2 means 1 part out of 2 equal parts.',
      level_2: 'Cut a pizza into 2 equal slices. Take 1 slice. You have 1/2 of the pizza.',
      level_3: 'Fold paper in half. Color one side. You colored 1/2!',
      visual_explanation: 'Draw a circle. Divide into equal parts. Shade the fraction amount.',
      step_by_step: 'Step 1: Count total equal parts (bottom number). Step 2: Count shaded parts (top number). Step 3: Write as top/bottom.'
    },
    'MATH-R-FRAC-G1': {
      skill_name: 'Fractions with Shapes',
      level_1: 'Fractions name equal parts. 1/4 means 1 out of 4 equal pieces. All pieces must be the same size.',
      level_2: 'A pie cut into 4 equal slices shows fourths. Each slice is 1/4.',
      level_3: 'Fold a square paper twice. Open it - you have 4 equal parts! Each is 1/4.',
      visual_explanation: 'Draw shapes divided into 2, 3, or 4 equal parts. Label each fraction.',
      step_by_step: 'Step 1: Check parts are equal. Step 2: Count total parts. Step 3: Count shaded parts. Step 4: Write the fraction.'
    },
    // READING
    'READING-R-GENERAL-G4': {
      skill_name: 'Reading Comprehension Grade 4',
      level_1: 'Good readers ask questions while reading. Who? What? Where? When? Why? How?',
      level_2: 'Stop after each paragraph. Ask yourself: What just happened? What might happen next?',
      level_3: 'Pretend you are telling a friend about the story. What are the most important parts?',
      visual_explanation: 'Use a story map: Beginning → Middle → End. Write key events in each box.',
      step_by_step: 'Step 1: Read the passage. Step 2: Identify main idea. Step 3: Find supporting details. Step 4: Summarize in your own words.'
    },
    'READING-R-GENERAL-G5': {
      skill_name: 'Reading Comprehension Grade 5',
      level_1: 'Analyze texts by looking at structure, author purpose, and how ideas connect.',
      level_2: 'Ask: Why did the author write this? To inform, persuade, or entertain?',
      level_3: 'Compare two articles on the same topic. How are they similar? Different?',
      visual_explanation: 'Create a Venn diagram to compare texts or characters.',
      step_by_step: 'Step 1: Read actively with questions. Step 2: Identify text structure. Step 3: Determine author purpose. Step 4: Make inferences.'
    },
    'READING-R-GENERAL-G6': {
      skill_name: 'Reading Comprehension Grade 6',
      level_1: 'Evaluate arguments and claims. Look for evidence that supports or weakens the author point.',
      level_2: 'Distinguish between facts (provable) and opinions (beliefs). Strong arguments use facts.',
      level_3: 'Play detective: What evidence does the author give? Is it convincing?',
      visual_explanation: 'Create a T-chart: Facts on one side, Opinions on the other.',
      step_by_step: 'Step 1: Identify the claim. Step 2: Find supporting evidence. Step 3: Evaluate if evidence is strong. Step 4: Form your own conclusion.'
    },
    'READING-R-GENERAL-G7': {
      skill_name: 'Reading Comprehension Grade 7',
      level_1: 'Analyze how authors develop themes and use literary devices like symbolism and foreshadowing.',
      level_2: 'Look for patterns and repeated ideas. These often reveal the theme or message.',
      level_3: 'What lesson does the main character learn? This often reveals the theme.',
      visual_explanation: 'Track recurring symbols or ideas on a chart as you read.',
      step_by_step: 'Step 1: Identify literary devices. Step 2: Analyze character development. Step 3: Determine theme. Step 4: Support with text evidence.'
    },
    'READING-R-PHONICS-G1': {
      skill_name: 'Phonics Grade 1',
      level_1: 'Phonics helps you sound out words. Each letter makes a sound. Blend sounds together to read.',
      level_2: 'Look at each letter, say its sound, then blend: c-a-t becomes cat!',
      level_3: 'Use your finger to point under each letter as you say its sound. Then say it fast!',
      visual_explanation: 'Draw sound boxes. Put one letter in each box. Say each sound, then blend.',
      step_by_step: 'Step 1: Look at the first letter. Step 2: Say its sound. Step 3: Move to next letter. Step 4: Blend all sounds together.'
    },
    'READING-R-SIGHT-G0': {
      skill_name: 'Sight Words',
      level_1: 'Sight words are words you know by looking - no sounding out needed. Like "the," "and," "is."',
      level_2: 'Practice reading these words fast. The more you see them, the faster you get!',
      level_3: 'Find sight words in your books. Circle them! How many can you find?',
      visual_explanation: 'Make flashcards. Practice until you can read each word in 1 second.',
      step_by_step: 'Step 1: Look at the word. Step 2: Say it out loud. Step 3: Practice until automatic.'
    },
    'READING-R-FLUENCY-G3': {
      skill_name: 'Reading Fluency Grade 3',
      level_1: 'Fluent reading is smooth, accurate, and uses expression. Read like you are talking!',
      level_2: 'Pay attention to punctuation. Pause at periods. Change voice for questions.',
      level_3: 'Practice reading aloud to a pet or stuffed animal. Make it sound like a story!',
      visual_explanation: 'Mark punctuation with symbols: / for pause, ↑ for question voice.',
      step_by_step: 'Step 1: Read at a steady pace. Step 2: Pause at punctuation. Step 3: Use expression. Step 4: Reread to improve.'
    },
    'READING-R-FLUENCY-G5': {
      skill_name: 'Reading Fluency Grade 5',
      level_1: 'Advanced fluency includes adjusting speed for different texts and reading with appropriate emphasis.',
      level_2: 'Slow down for difficult parts. Speed up for easy, exciting parts.',
      level_3: 'Record yourself reading. Listen back. Does it sound natural?',
      visual_explanation: 'Underline words to emphasize. Mark where to speed up or slow down.',
      step_by_step: 'Step 1: Preview the text. Step 2: Adjust pace for complexity. Step 3: Emphasize key words. Step 4: Self-monitor for errors.'
    },
    'READING-R-EVIDENCE-G3': {
      skill_name: 'Text Evidence',
      level_1: 'Text evidence means finding proof in the reading to support your answer.',
      level_2: 'When asked a question, look back at the text. Find the sentence that proves your answer.',
      level_3: 'Play detective! The answer is hiding in the text. Find the exact words that prove it.',
      visual_explanation: 'Highlight or underline the sentence that answers the question.',
      step_by_step: 'Step 1: Read the question. Step 2: Look back at the text. Step 3: Find proof. Step 4: Quote or paraphrase the evidence.'
    },
    'READING-R-SEQUENCE-G0': {
      skill_name: 'Sequencing Events',
      level_1: 'Sequence means the order things happen. First, next, then, last.',
      level_2: 'Look for clue words: first, then, after, finally. These tell you the order.',
      level_3: 'Think about your morning: First wake up, then eat breakfast, next brush teeth, finally go to school!',
      visual_explanation: 'Draw 4 boxes in a row. Put events in order from first to last.',
      step_by_step: 'Step 1: Find the first event. Step 2: Find what happens next. Step 3: Continue to the end. Step 4: Use order words.'
    },
    // WRITING
    'WRITING-R-GENERAL-G2': {
      skill_name: 'Writing Grade 2',
      level_1: 'Good writing has a beginning, middle, and end. Start with a topic sentence that tells your main idea.',
      level_2: 'Add details in the middle. End with a closing sentence.',
      level_3: 'Write like you are telling a friend a story. What happened first? Then what?',
      visual_explanation: 'Use a hamburger model: Top bun = intro, Meat = details, Bottom bun = conclusion.',
      step_by_step: 'Step 1: Write your topic sentence. Step 2: Add 2-3 detail sentences. Step 3: Write a closing sentence.'
    },
    'WRITING-R-GENERAL-G3': {
      skill_name: 'Writing Grade 3',
      level_1: 'Organize your writing with paragraphs. Each paragraph has one main idea with supporting details.',
      level_2: 'Start each paragraph with a topic sentence. Add facts or examples. End with a concluding thought.',
      level_3: 'Think of paragraphs as rooms in a house. Each room has a purpose!',
      visual_explanation: 'Use a graphic organizer with boxes for intro, body paragraphs, and conclusion.',
      step_by_step: 'Step 1: Plan with an outline. Step 2: Write intro paragraph. Step 3: Write body paragraphs. Step 4: Write conclusion.'
    },
    'WRITING-R-GENERAL-G4': {
      skill_name: 'Writing Grade 4',
      level_1: 'Use transition words to connect ideas: first, next, however, therefore, finally.',
      level_2: 'Vary your sentence structure. Mix short and long sentences for better flow.',
      level_3: 'Read your writing aloud. Does it flow smoothly? Add transitions where it feels choppy.',
      visual_explanation: 'Circle transition words in your writing. Add more if paragraphs feel disconnected.',
      step_by_step: 'Step 1: Draft your ideas. Step 2: Add transition words. Step 3: Vary sentences. Step 4: Revise and edit.'
    },
    'WRITING-R-GENERAL-G5': {
      skill_name: 'Writing Grade 5',
      level_1: 'Strong writing uses specific details and vivid language. Show, do not just tell.',
      level_2: 'Instead of "The dog was happy," write "The dog wagged its tail and jumped with excitement."',
      level_3: 'Use your senses! What did you see, hear, smell, feel, taste?',
      visual_explanation: 'Create a sensory chart. List details for each sense related to your topic.',
      step_by_step: 'Step 1: Write your draft. Step 2: Find vague words. Step 3: Replace with specific details. Step 4: Add sensory language.'
    },
    'WRITING-R-GENERAL-G6': {
      skill_name: 'Writing Grade 6',
      level_1: 'Develop your argument with claims, evidence, and reasoning. Explain WHY your evidence matters.',
      level_2: 'For each claim, provide at least two pieces of evidence. Then explain the connection.',
      level_3: 'Think: Claim → Evidence → Explain. Like a lawyer proving a case!',
      visual_explanation: 'Use CEE structure: Claim, Evidence, Explanation for each paragraph.',
      step_by_step: 'Step 1: State your claim. Step 2: Provide evidence. Step 3: Explain the connection. Step 4: Transition to next point.'
    },
    'WRITING-R-GENERAL-G7': {
      skill_name: 'Writing Grade 7',
      level_1: 'Advanced writing analyzes multiple perspectives and addresses counterarguments.',
      level_2: 'Acknowledge opposing views, then explain why your position is stronger.',
      level_3: 'Think: "Some people believe X, but actually Y because..."',
      visual_explanation: 'Create a pros/cons chart. Address both sides in your writing.',
      step_by_step: 'Step 1: Present your argument. Step 2: Acknowledge counterargument. Step 3: Refute with evidence. Step 4: Reinforce your position.'
    },
    'WRITING-R-SENTENCE-G0': {
      skill_name: 'Sentence Writing Basics',
      level_1: 'A sentence is a complete thought. It needs a subject (who/what) and a verb (action).',
      level_2: 'Every sentence starts with a capital letter and ends with punctuation (. ? !)',
      level_3: 'The cat sleeps. Who? The cat. What does it do? Sleeps. That is a sentence!',
      visual_explanation: 'Draw two boxes: WHO/WHAT + DOES WHAT. Fill in both to make a sentence.',
      step_by_step: 'Step 1: Think of a person/thing. Step 2: Think of an action. Step 3: Put them together. Step 4: Add capital and period.'
    },
    'WRITING-R-SENTENCE-G1': {
      skill_name: 'Sentence Writing Grade 1',
      level_1: 'Expand sentences by adding details: who, what, when, where, why.',
      level_2: 'Start with a simple sentence, then add more information. "The dog runs" → "The big dog runs fast."',
      level_3: 'Play the add-on game: "The cat sat." Where? "The cat sat on the mat." When? "The cat sat on the mat today."',
      visual_explanation: 'Use a sentence stretcher: Start simple, add adjectives, add where/when.',
      step_by_step: 'Step 1: Write a simple sentence. Step 2: Add describing words. Step 3: Add where or when. Step 4: Read the improved sentence.'
    },
    'WRITING-R-PARA-G2': {
      skill_name: 'Paragraph Writing',
      level_1: 'A paragraph is a group of sentences about one topic. Start with a topic sentence.',
      level_2: 'Add 3-4 sentences with details. End with a closing sentence that wraps it up.',
      level_3: 'Think of a paragraph like a sandwich: topic sentence (bread), details (filling), closing (bread).',
      visual_explanation: 'Draw a sandwich. Label top bread, fillings, bottom bread for paragraph parts.',
      step_by_step: 'Step 1: Write topic sentence. Step 2: Add detail sentences. Step 3: Write closing sentence. Step 4: Indent the first line.'
    },
    'WRITE-R-GENERAL-G0': {
      skill_name: 'Beginning Writing',
      level_1: 'Writing starts with letters and words. Practice writing your name and simple words.',
      level_2: 'Say the word slowly. Write the sounds you hear. Cat = c-a-t.',
      level_3: 'Draw a picture first, then write a word or sentence about it.',
      visual_explanation: 'Draw a picture box and a writing line below it.',
      step_by_step: 'Step 1: Think of what to write. Step 2: Say it slowly. Step 3: Write the sounds. Step 4: Draw a picture.'
    },
    'WRITE-R-GENERAL-G2': {
      skill_name: 'Writing Grade 2',
      level_1: 'Write complete sentences with capitals, punctuation, and proper spelling.',
      level_2: 'Use describing words to make your writing more interesting.',
      level_3: 'Read your writing to a friend. Does it make sense?',
      visual_explanation: 'Use a checklist: Capital? Punctuation? Makes sense? Neat handwriting?',
      step_by_step: 'Step 1: Write your sentence. Step 2: Check capital letter. Step 3: Check punctuation. Step 4: Check spelling.'
    },
    'WRITE-R-Capital': {
      skill_name: 'Capital Letters',
      level_1: 'Use capitals at the start of sentences and for names of people, places, and things.',
      level_2: 'Capitals are for special words: names (Tom), places (Texas), days (Monday).',
      level_3: 'Play I-Spy capitals: Find all the capital letters in a book page!',
      visual_explanation: 'Circle words that need capitals: sentence starts, names, places.',
      step_by_step: 'Step 1: Start of sentence = capital. Step 2: Names = capital. Step 3: Places = capital. Step 4: Check your writing.'
    },
    // SPELLING
    'SPELLING-R-GENERAL-G0': {
      skill_name: 'Beginning Spelling',
      level_1: 'Spell words by listening to the sounds. Say the word slowly and write each sound.',
      level_2: 'Stretch the word like a rubber band: c-a-t. Write what you hear.',
      level_3: 'Clap the sounds: "cat" = clap-clap-clap = 3 sounds = 3 letters!',
      visual_explanation: 'Draw sound boxes. Put one sound in each box.',
      step_by_step: 'Step 1: Say the word slowly. Step 2: Listen to each sound. Step 3: Write the letter for each sound.'
    },
    'SPELLING-R-GENERAL-G1': {
      skill_name: 'Spelling Grade 1',
      level_1: 'Learn spelling patterns. Words that rhyme often share the same ending: cat, hat, sat.',
      level_2: 'Word families help you spell: If you know "all," you can spell ball, call, fall, hall.',
      level_3: 'Make a word ladder: cat → hat → hot → hop. Change one letter at a time!',
      visual_explanation: 'Create word family houses. Put rhyming words in the same house.',
      step_by_step: 'Step 1: Identify the word family. Step 2: Say the word. Step 3: Write the pattern. Step 4: Add the beginning sound.'
    },
    'SPELLING-R-SIGHT-G2': {
      skill_name: 'Sight Word Spelling',
      level_1: 'Sight words often do not follow phonics rules. Memorize how they look.',
      level_2: 'Look at the word, cover it, write it, check it. Repeat until correct.',
      level_3: 'Rainbow write! Write the word in different colors to remember it.',
      visual_explanation: 'Trace the word shape. Notice tall letters, short letters, and tails.',
      step_by_step: 'Step 1: Look carefully at the word. Step 2: Cover and write from memory. Step 3: Check. Step 4: Repeat until perfect.'
    },
    // TYPING
    'TYPING-R-GENERAL-G0': {
      skill_name: 'Keyboard Introduction',
      level_1: 'Learn where the keys are on the keyboard. Your fingers have home positions.',
      level_2: 'Home row is ASDF for left hand, JKL; for right hand. Start there!',
      level_3: 'Find the bumps on F and J. Your pointer fingers rest there.',
      visual_explanation: 'Color-code a keyboard diagram by finger assignment.',
      step_by_step: 'Step 1: Find home row. Step 2: Place fingers on ASDF JKL;. Step 3: Look at the screen, not hands. Step 4: Practice!'
    },
    'TYPING-R-GENERAL-G1': {
      skill_name: 'Home Row Typing',
      level_1: 'Keep your fingers on home row. Each finger is responsible for specific keys.',
      level_2: 'Type without looking at your hands. Feel for the bumps on F and J.',
      level_3: 'Practice typing: asdf jkl; asdf jkl; over and over until automatic.',
      visual_explanation: 'Fingers diagram showing which finger types which key.',
      step_by_step: 'Step 1: Position on home row. Step 2: Type the key. Step 3: Return to home row. Step 4: Repeat.'
    },
    'TYPING-R-GENERAL-G2': {
      skill_name: 'Top and Bottom Row',
      level_1: 'Reach up for top row (QWERTY) and down for bottom row (ZXCV) then return to home row.',
      level_2: 'Your fingers should bounce back to home row after typing each key.',
      level_3: 'Practice words that use all rows: "the quick brown fox jumps."',
      visual_explanation: 'Draw arrows showing finger movement from home row to other rows.',
      step_by_step: 'Step 1: Start at home row. Step 2: Reach to the key. Step 3: Return to home row. Step 4: Continue.'
    },
    'TYPING-R-GENERAL-G7': {
      skill_name: 'Advanced Typing',
      level_1: 'Focus on accuracy first, then speed. Practice with proper technique daily.',
      level_2: 'Type full paragraphs and documents. Use all fingers correctly.',
      level_3: 'Time yourself: How many words per minute with no errors?',
      visual_explanation: 'Track WPM progress on a chart over time.',
      step_by_step: 'Step 1: Warm up with home row. Step 2: Type passages. Step 3: Check accuracy. Step 4: Gradually increase speed.'
    },
    'TYPING-R-FINDLETTERS-G0': {
      skill_name: 'Finding Letters',
      level_1: 'Learn where each letter is located on the keyboard. Start with home row.',
      level_2: 'Play letter hunt: Can you find the letter A? The letter B? Practice finding each one.',
      level_3: 'Sing the alphabet and point to each letter on the keyboard!',
      visual_explanation: 'Use a color-coded keyboard chart showing letter positions.',
      step_by_step: 'Step 1: Look at the keyboard. Step 2: Find the letter. Step 3: Press it. Step 4: Say the letter name.'
    },
    'TYPING-R-SPACEBAR-G0': {
      skill_name: 'Using the Spacebar',
      level_1: 'Use your thumb to press the spacebar. Add a space between each word.',
      level_2: 'After typing a word, press spacebar once. Then type the next word.',
      level_3: 'Practice: the[space]cat[space]sat. Feel the rhythm!',
      visual_explanation: 'Show thumb position on spacebar in diagram.',
      step_by_step: 'Step 1: Type a word. Step 2: Press spacebar with thumb. Step 3: Type next word. Step 4: Repeat.'
    },
    'TYPING-R-ENTER-G0': {
      skill_name: 'Using Enter Key',
      level_1: 'Press Enter to start a new line. Use your pinky finger on the right hand.',
      level_2: 'Enter creates a new line for a new paragraph or list item.',
      level_3: 'Practice making a list: apple[Enter]banana[Enter]cherry',
      visual_explanation: 'Show right pinky reaching to Enter key.',
      step_by_step: 'Step 1: Finish your line. Step 2: Press Enter with right pinky. Step 3: Continue typing on new line.'
    },
    'TYPING-R-HOMEROW-G1': {
      skill_name: 'Home Row Mastery',
      level_1: 'Master home row keys: A S D F and J K L ; before moving to other rows.',
      level_2: 'Practice typing home row words: sad, ask, all, fall, lass, salad.',
      level_3: 'Type home row letters with eyes closed. Trust your fingers!',
      visual_explanation: 'Highlight home row on keyboard diagram.',
      step_by_step: 'Step 1: Place fingers on home row. Step 2: Type only home row keys. Step 3: Practice words. Step 4: Build muscle memory.'
    },
    'TYPING-R-LEFTHAND-G1': {
      skill_name: 'Left Hand Typing',
      level_1: 'Left hand covers left side of keyboard: Q-A-Z, W-S-X, E-D-C, R-F-V, T-G-B.',
      level_2: 'Practice left-hand-only words: we, are, at, sat, was, date.',
      level_3: 'Type "stewardess" - it only uses left hand letters!',
      visual_explanation: 'Color left-hand keys one color on keyboard diagram.',
      step_by_step: 'Step 1: Place left hand on home row. Step 2: Practice reaching keys above and below. Step 3: Return to home position.'
    },
    'TYPING-R-RIGHTHAND-G1': {
      skill_name: 'Right Hand Typing',
      level_1: 'Right hand covers right side: Y-H-N, U-J-M, I-K-comma, O-L-period, P-semicolon.',
      level_2: 'Practice right-hand-only words: you, him, no, oil, only, mop.',
      level_3: 'Type "monopoly" - mostly right hand letters!',
      visual_explanation: 'Color right-hand keys one color on keyboard diagram.',
      step_by_step: 'Step 1: Place right hand on home row. Step 2: Practice reaching other keys. Step 3: Return to home position.'
    },
    'TYPING-R-TOPROW-G2': {
      skill_name: 'Top Row Typing',
      level_1: 'Top row has QWERTYUIOP. Reach up from home row, then return.',
      level_2: 'Practice: type, write, quote, your. Mix top row with other rows.',
      level_3: 'The top row has most vowels: E, U, I, O. You use it a lot!',
      visual_explanation: 'Show finger paths from home row to top row keys.',
      step_by_step: 'Step 1: Fingers on home row. Step 2: Reach up to top row key. Step 3: Return to home row. Step 4: Continue.'
    },
    'TYPING-R-BOTTOMROW-G2': {
      skill_name: 'Bottom Row Typing',
      level_1: 'Bottom row has ZXCVBNM. Reach down from home row, then return.',
      level_2: 'Practice words with bottom row: can, van, box, mix, zone.',
      level_3: 'Bottom row is harder - practice slowly, build accuracy first!',
      visual_explanation: 'Show finger paths from home row down to bottom row.',
      step_by_step: 'Step 1: Fingers on home row. Step 2: Reach down to bottom row key. Step 3: Return to home row. Step 4: Practice.'
    },
    'TYPING-R-SHIFT-G2': {
      skill_name: 'Using Shift Key',
      level_1: 'Hold Shift with opposite hand to make capital letters. Shift + a = A.',
      level_2: 'Left Shift for right-hand letters, Right Shift for left-hand letters.',
      level_3: 'Practice names: John, Mary, Texas. Use Shift for capitals!',
      visual_explanation: 'Diagram showing which shift key to use for each letter.',
      step_by_step: 'Step 1: Hold Shift with pinky. Step 2: Press letter with other hand. Step 3: Release both. Step 4: Continue.'
    },
    'TYPING-R-NUMROW-G3': {
      skill_name: 'Number Row Typing',
      level_1: 'Numbers are on the top row above letters. Each finger reaches up to its number.',
      level_2: 'Practice: 1234567890. Keep fingers on home row, reach up for numbers.',
      level_3: 'Type dates and phone numbers to practice: 555-123-4567.',
      visual_explanation: 'Show which finger types which number based on home position.',
      step_by_step: 'Step 1: Keep hands on home row. Step 2: Reach up to number. Step 3: Return to home row. Step 4: Practice sequences.'
    },
    'TYPING-R-SPEED-G4': {
      skill_name: 'Typing Speed',
      level_1: 'Build speed through consistent daily practice. Accuracy first, then speed.',
      level_2: 'Practice common words until they become automatic: the, and, is, you, that.',
      level_3: 'Set a timer for 1 minute. How many correct words can you type?',
      visual_explanation: 'Track Words Per Minute (WPM) on a progress chart.',
      step_by_step: 'Step 1: Type accurately at comfortable speed. Step 2: Gradually increase pace. Step 3: Track WPM. Step 4: Practice daily.'
    },
    'TYPING-R-ACCURACY-G5': {
      skill_name: 'Typing Accuracy',
      level_1: 'Accuracy means typing without errors. Slow down if you make too many mistakes.',
      level_2: 'Focus on hitting the right key every time. Speed comes after accuracy.',
      level_3: 'Challenge: Type a paragraph with zero errors. If you mess up, start over!',
      visual_explanation: 'Track error percentage. Aim for 95%+ accuracy.',
      step_by_step: 'Step 1: Type slowly and correctly. Step 2: Check for errors. Step 3: Retype problem words. Step 4: Gradually speed up.'
    },
    // CODING
    'CODING-R-GENERAL-G0': {
      skill_name: 'Introduction to Coding',
      level_1: 'Coding is giving step-by-step instructions to a computer. Computers follow instructions exactly.',
      level_2: 'Start with sequences: Put instructions in order. First this, then that.',
      level_3: 'Give directions to make a sandwich: 1. Get bread. 2. Add peanut butter. 3. Add jelly. 4. Close sandwich.',
      visual_explanation: 'Draw a flowchart showing steps in order with arrows.',
      step_by_step: 'Step 1: Think of the goal. Step 2: Break into small steps. Step 3: Put in order. Step 4: Test your instructions.'
    },
    'CODING-R-GENERAL-G1': {
      skill_name: 'Coding Basics Grade 1',
      level_1: 'Programs are lists of commands. The computer reads and follows them in order.',
      level_2: 'Learn basic commands: move forward, turn left, turn right, repeat.',
      level_3: 'Guide a robot through a maze using only: forward, left, right!',
      visual_explanation: 'Grid maze with arrows showing the path the code creates.',
      step_by_step: 'Step 1: See where you want to go. Step 2: Write commands. Step 3: Run the program. Step 4: Fix any bugs.'
    },
    'CODING-R-GENERAL-G2': {
      skill_name: 'Coding Basics Grade 2',
      level_1: 'Loops repeat actions. Instead of writing "forward" 5 times, say "repeat 5 times: forward."',
      level_2: 'Loops save time and make code shorter. Look for patterns that repeat.',
      level_3: 'Clap pattern: clap-clap-stomp. Repeat 4 times = loop 4: clap, clap, stomp.',
      visual_explanation: 'Show same action written out vs. using a loop (much shorter!).',
      step_by_step: 'Step 1: Find the repeating pattern. Step 2: Count repetitions. Step 3: Write the loop. Step 4: Test it.'
    }
  };

  // Return specific explanation or generate generic one
  if (explanations[ruleId]) {
    return {
      ...explanations[ruleId],
      subject_code: subjectCodeMap[subject] || subject,
      rule_id: ruleId
    };
  }

  // Generate generic explanation based on rule_id pattern
  const genericExplanation = {
    subject_code: subjectCodeMap[subject] || subject,
    rule_id: ruleId,
    skill_name: `${subject} ${skill} Grade ${gradeNum}`,
    level_1: `This skill teaches ${skill.toLowerCase()} concepts at grade ${gradeNum} level. Follow the steps and practice regularly.`,
    level_2: `Break down the problem into smaller parts. Practice each part before combining them.`,
    level_3: `Think about real-life examples. How would you use this skill in everyday situations?`,
    visual_explanation: `Use diagrams and pictures to understand the concept. Draw it out!`,
    step_by_step: `Step 1: Understand the goal. Step 2: Follow the rules. Step 3: Practice examples. Step 4: Check your work.`
  };

  return genericExplanation;
}

async function insertExplanations() {
  let inserted = 0;
  let errors = [];

  for (const ruleId of missingRuleIds) {
    const exp = generateExplanation(ruleId);

    const { error } = await supabase
      .from('explanation_library')
      .insert({
        subject_code: exp.subject_code,
        skill_name: exp.skill_name,
        rule_id: exp.rule_id,
        level_1: exp.level_1,
        level_2: exp.level_2,
        level_3: exp.level_3,
        visual_explanation: exp.visual_explanation,
        step_by_step: exp.step_by_step,
        generated_by: 'claude'
      });

    if (error) {
      errors.push({ ruleId, error: error.message });
    } else {
      inserted++;
      process.stdout.write(`\rInserted: ${inserted}/${missingRuleIds.length}`);
    }
  }

  console.log(`\n\nDone! Inserted ${inserted} new explanations.`);

  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.log(`  - ${e.ruleId}: ${e.error}`));
  }

  // Show new total
  const { count } = await supabase.from('explanation_library').select('*', { count: 'exact', head: true });
  console.log(`\nTotal explanations in library: ${count}`);
}

insertExplanations();
