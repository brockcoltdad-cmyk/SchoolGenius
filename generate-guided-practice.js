const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Missing rule_ids that need guided practice
const missingRuleIds = [
  'MATH-R-GENERAL-G2', 'MATH-R-GENERAL-G4', 'MATH-R-GENERAL-G0', 'READING-R-GENERAL-G2',
  'MATH-R-GENERAL-G6', 'MATH-R-GENERAL-G1', 'MATH-R-MULT-G3', 'WRITING-R-GENERAL-G2',
  'READING-R-GENERAL-G3', 'MATH-R-COUNT-G0', 'READING-R-GENERAL-G4', 'SPELLING-R-GENERAL-G3',
  'SPELLING-R-GENERAL-G2', 'WRITING-R-GENERAL-G0', 'MATH-R-COMPARE-G0', 'READING-R-GENERAL-G5',
  'MATH-R-GENERAL-G3', 'READING-R-PHONICS-G0', 'SPELLING-R-GENERAL-G1', 'SPELLING-R-GENERAL-G4',
  'WRITING-R-GENERAL-G1', 'SPELLING-R-GENERAL-G5', 'READING-R-GENERAL-G6', 'WRITING-R-SENTENCE-G0',
  'MATH-R-DEC-G4', 'WRITING-R-PARA-G2', 'CODING-R-GENERAL-G3', 'READING-R-GENERAL-G7',
  'SPELLING-R-GENERAL-G0', 'SPELLING-R-GENERAL-G6', 'WRITING-R-GENERAL-G3', 'READING-R-SIGHT-G0',
  'WRITING-R-GENERAL-G4', 'WRITING-R-GENERAL-G5', 'CODING-R-GENERAL-G1', 'CODING-R-GENERAL-G2',
  'CODING-R-GENERAL-G4', 'CODING-R-GENERAL-G5', 'CODING-R-GENERAL-G6', 'READING-R-EVIDENCE-G3',
  'WRITE-R-GENERAL-G2', 'WRITING-R-GENERAL-G6', 'MATH-R-PERCENT-G6', 'MATH-R-RATIO-G6',
  'CODING-R-GENERAL-G0', 'CODING-R-GENERAL-G7', 'READING-R-FLUENCY-G3', 'SPELLING-R-GENERAL-G7',
  'WRITE-R-GENERAL-G0', 'WRITING-R-GENERAL-G7', 'READING-R-SEQUENCE-G0', 'MATH-R-DIV-G3',
  'MATH-R-PATTERN-G0', 'READING-R-FLUENCY-G4', 'WRITING-R-SENTENCE-G1', 'READING-R-FLUENCY-G5',
  'TYPING-R-NUMROW-G3', 'TYPING-R-SPEED-G4', 'TYPING-R-FINDLETTERS-G0', 'TYPING-R-SPACEBAR-G0',
  'TYPING-R-HOMEROW-G1', 'TYPING-R-LEFTHAND-G1', 'TYPING-R-TOPROW-G2', 'TYPING-R-BOTTOMROW-G2',
  'TYPING-R-ENTER-G0', 'TYPING-R-RIGHTHAND-G1', 'TYPING-R-SHIFT-G2', 'TYPING-R-ACCURACY-G5',
  'MATH-R-COMPARE-G1', 'MATH-R-PLACEVALUE-G0', 'SPELLING-R-SIGHT-G2', 'MATH-R-PLACEVALUE-G1',
  'MATH-R-FRAC-G0', 'MATH-R-FRAC-G1', 'WRITE-R-Capital'
];

function parseRuleId(ruleId) {
  const parts = ruleId.split('-');
  const subject = parts[0];
  const skill = parts[2];
  const grade = parts[3] || 'G0';
  const gradeNum = parseInt(grade.replace('G', '')) || 0;
  return { subject, skill, grade, gradeNum };
}

function generateProblems(ruleId) {
  const { subject, skill, grade, gradeNum } = parseRuleId(ruleId);
  const problems = [];

  // Generate 5 problems per rule_id
  const templates = getTemplates(subject, skill, gradeNum);

  for (let i = 0; i < 5; i++) {
    const template = templates[i % templates.length];
    problems.push({
      guided_id: `${ruleId}-GP-${String(i + 1).padStart(3, '0')}`,
      rule_id: ruleId,
      subject: subject,
      grade: gradeNum,
      standard: `${subject}.${gradeNum}.${skill}`,
      problem: template.problem,
      answer: template.answer,
      hints: JSON.stringify(template.hints),
      solution: template.solution,
      encouragement: template.encouragement
    });
  }

  return problems;
}

function getTemplates(subject, skill, grade) {
  // MATH templates
  if (subject === 'MATH') {
    if (skill === 'GENERAL' && grade === 0) {
      return [
        { problem: 'Count the apples: 🍎🍎🍎🍎🍎', answer: '5', hints: ['Point to each apple', 'Say one number for each', 'Start with 1'], solution: 'Count each apple: 1, 2, 3, 4, 5. There are 5 apples!', encouragement: 'Great counting! You did it!' },
        { problem: 'What number comes after 3?', answer: '4', hints: ['Count: 1, 2, 3...', 'What comes next?'], solution: '1, 2, 3, 4 - The number after 3 is 4!', encouragement: 'You know your numbers!' },
        { problem: 'Count the stars: ⭐⭐⭐', answer: '3', hints: ['Touch each star', 'Count out loud'], solution: 'Count: 1, 2, 3. There are 3 stars!', encouragement: 'Excellent counting!' },
        { problem: 'How many fingers on one hand?', answer: '5', hints: ['Hold up your hand', 'Count each finger'], solution: 'Count your fingers: 1, 2, 3, 4, 5. Five fingers!', encouragement: 'You are a counting star!' },
        { problem: 'What number comes before 5?', answer: '4', hints: ['Count up to 5', 'Stop one before'], solution: '1, 2, 3, 4, 5 - The number before 5 is 4!', encouragement: 'Perfect!' }
      ];
    }
    if (skill === 'GENERAL' && grade === 1) {
      return [
        { problem: '7 + 5 = ?', answer: '12', hints: ['Start at 7', 'Count up 5 more'], solution: 'Start at 7, count: 8, 9, 10, 11, 12. The answer is 12!', encouragement: 'Great addition!' },
        { problem: '14 - 6 = ?', answer: '8', hints: ['Start at 14', 'Count back 6'], solution: '14, 13, 12, 11, 10, 9, 8. The answer is 8!', encouragement: 'You got it!' },
        { problem: '9 + 8 = ?', answer: '17', hints: ['Make a ten first', '9 + 1 = 10, then add 7 more'], solution: '9 + 8 = 9 + 1 + 7 = 10 + 7 = 17', encouragement: 'Awesome work!' },
        { problem: '15 - 7 = ?', answer: '8', hints: ['Use subtraction', 'Count back from 15'], solution: '15 - 7 = 8. Count back 7 from 15.', encouragement: 'Subtraction superstar!' },
        { problem: '6 + 6 = ?', answer: '12', hints: ['This is a double!', '6 + 6 is like two 6s'], solution: '6 + 6 = 12. Doubles are easy to remember!', encouragement: 'Doubles are your friend!' }
      ];
    }
    if (skill === 'GENERAL' && grade === 2) {
      return [
        { problem: '24 + 38 = ?', answer: '62', hints: ['Add ones first: 4+8', 'Then add tens: 20+30', 'Combine the results'], solution: '4+8=12, 20+30=50, 50+12=62', encouragement: 'Two-digit addition master!' },
        { problem: '73 - 45 = ?', answer: '28', hints: ['Subtract ones: 13-5', 'Borrow from tens', 'Subtract tens: 6-4'], solution: 'Regroup: 73 = 60+13. 13-5=8, 60-40=20. Answer: 28', encouragement: 'Great regrouping!' },
        { problem: '56 + 27 = ?', answer: '83', hints: ['6+7=13, carry the 1', '5+2+1=8'], solution: '6+7=13, write 3 carry 1. 5+2+1=8. Answer: 83', encouragement: 'You nailed it!' },
        { problem: '81 - 34 = ?', answer: '47', hints: ['Need to borrow', '11-4=7', '7-3=4'], solution: '81-34: Borrow to get 11-4=7, 7-3=4. Answer: 47', encouragement: 'Subtraction champion!' },
        { problem: '45 + 45 = ?', answer: '90', hints: ['Double 45', '40+40=80, 5+5=10'], solution: '45+45 = 40+40+5+5 = 80+10 = 90', encouragement: 'Perfect doubling!' }
      ];
    }
    if (skill === 'GENERAL' && grade === 3) {
      return [
        { problem: '7 × 8 = ?', answer: '56', hints: ['Think: 7 groups of 8', 'Or 8 groups of 7'], solution: '7 × 8 = 56. Skip count by 7: 7,14,21,28,35,42,49,56', encouragement: 'Multiplication master!' },
        { problem: '63 ÷ 9 = ?', answer: '7', hints: ['What times 9 = 63?', 'Think multiplication'], solution: '9 × 7 = 63, so 63 ÷ 9 = 7', encouragement: 'Division superstar!' },
        { problem: '6 × 9 = ?', answer: '54', hints: ['6 groups of 9', 'Or 9 groups of 6'], solution: '6 × 9 = 54. Remember: 6×9=54!', encouragement: 'Great work!' },
        { problem: '48 ÷ 6 = ?', answer: '8', hints: ['6 × ? = 48', 'Skip count by 6'], solution: '6 × 8 = 48, so 48 ÷ 6 = 8', encouragement: 'You got it!' },
        { problem: '8 × 7 = ?', answer: '56', hints: ['8 sevens', 'Same as 7 × 8'], solution: '8 × 7 = 56', encouragement: 'Fantastic!' }
      ];
    }
    if (skill === 'GENERAL' && grade === 4) {
      return [
        { problem: '234 × 6 = ?', answer: '1404', hints: ['Multiply each digit', '6×4, 6×30, 6×200', 'Add the products'], solution: '6×4=24, 6×30=180, 6×200=1200. Total: 1404', encouragement: 'Multi-digit multiplication pro!' },
        { problem: '756 ÷ 4 = ?', answer: '189', hints: ['Divide step by step', 'How many 4s in 7?', 'Bring down next digit'], solution: '7÷4=1r3, 35÷4=8r3, 36÷4=9. Answer: 189', encouragement: 'Long division champion!' },
        { problem: '428 × 5 = ?', answer: '2140', hints: ['5×8, 5×20, 5×400', 'Add them up'], solution: '5×8=40, 5×20=100, 5×400=2000. Total: 2140', encouragement: 'Excellent multiplication!' },
        { problem: '945 ÷ 5 = ?', answer: '189', hints: ['Divide each part', '9÷5, 14÷5, 45÷5'], solution: '945÷5 = 189', encouragement: 'Great division!' },
        { problem: '362 × 4 = ?', answer: '1448', hints: ['4×2, 4×60, 4×300', 'Add products'], solution: '4×2=8, 4×60=240, 4×300=1200. Total: 1448', encouragement: 'You are amazing!' }
      ];
    }
    if (skill === 'GENERAL' && grade === 6) {
      return [
        { problem: 'Solve: 3x + 7 = 22', answer: 'x = 5', hints: ['Subtract 7 from both sides', 'Then divide by 3'], solution: '3x + 7 = 22 → 3x = 15 → x = 5', encouragement: 'Algebra star!' },
        { problem: 'What is 25% of 80?', answer: '20', hints: ['25% = 1/4', 'Divide 80 by 4'], solution: '25% of 80 = 0.25 × 80 = 20', encouragement: 'Percent pro!' },
        { problem: 'Simplify: 2/3 + 1/4', answer: '11/12', hints: ['Find common denominator', 'LCD of 3 and 4 is 12'], solution: '2/3 = 8/12, 1/4 = 3/12. 8/12 + 3/12 = 11/12', encouragement: 'Fraction master!' },
        { problem: 'Solve: 5x - 3 = 17', answer: 'x = 4', hints: ['Add 3 to both sides', 'Divide by 5'], solution: '5x - 3 = 17 → 5x = 20 → x = 4', encouragement: 'Great solving!' },
        { problem: 'What is 15% of 60?', answer: '9', hints: ['15% = 0.15', 'Multiply 60 × 0.15'], solution: '15% of 60 = 0.15 × 60 = 9', encouragement: 'Perfect!' }
      ];
    }
    if (skill === 'COUNT') {
      return [
        { problem: 'Count: 🔵🔵🔵🔵🔵🔵', answer: '6', hints: ['Touch each circle', 'Say one number each'], solution: 'Count: 1,2,3,4,5,6. There are 6!', encouragement: 'Great counting!' },
        { problem: 'Count backwards from 10', answer: '10,9,8,7,6,5,4,3,2,1', hints: ['Start at 10', 'Say each number going down'], solution: '10,9,8,7,6,5,4,3,2,1,0!', encouragement: 'Countdown complete!' },
        { problem: 'What comes after 7?', answer: '8', hints: ['Count: 6, 7...'], solution: '7, 8 - Eight comes after seven!', encouragement: 'You know it!' },
        { problem: 'Count by 2s to 10', answer: '2,4,6,8,10', hints: ['Skip one number each time'], solution: '2, 4, 6, 8, 10!', encouragement: 'Skip counting star!' },
        { problem: 'How many: 🌟🌟🌟🌟', answer: '4', hints: ['Count each star'], solution: '1, 2, 3, 4 stars!', encouragement: 'Perfect!' }
      ];
    }
    if (skill === 'COMPARE') {
      return [
        { problem: 'Which is greater: 7 or 4?', answer: '7', hints: ['Count up from 4', '7 is farther up'], solution: '7 > 4 because 7 is greater than 4', encouragement: 'Correct comparison!' },
        { problem: '12 ○ 15 (>, <, or =)', answer: '<', hints: ['Which is bigger?', '15 is more than 12'], solution: '12 < 15 (12 is less than 15)', encouragement: 'You got it!' },
        { problem: 'Put in order: 8, 3, 6', answer: '3, 6, 8', hints: ['Find the smallest first', 'Then middle, then biggest'], solution: 'Smallest to largest: 3, 6, 8', encouragement: 'Great ordering!' },
        { problem: '9 ○ 9 (>, <, or =)', answer: '=', hints: ['Are they the same?'], solution: '9 = 9 (they are equal)', encouragement: 'Equal means same!' },
        { problem: 'Which is less: 14 or 11?', answer: '11', hints: ['Which is smaller?'], solution: '11 < 14', encouragement: 'Perfect comparison!' }
      ];
    }
    if (skill === 'MULT') {
      return [
        { problem: '6 × 7 = ?', answer: '42', hints: ['6 groups of 7', 'Skip count by 6'], solution: '6 × 7 = 42', encouragement: 'Multiplication master!' },
        { problem: '8 × 9 = ?', answer: '72', hints: ['8 nines', 'Or 9 eights'], solution: '8 × 9 = 72', encouragement: 'Great work!' },
        { problem: '7 × 7 = ?', answer: '49', hints: ['7 squared!', 'A square number'], solution: '7 × 7 = 49', encouragement: 'Perfect square!' },
        { problem: '4 × 12 = ?', answer: '48', hints: ['4 × 10 = 40', '4 × 2 = 8', 'Add them'], solution: '4 × 12 = 4 × 10 + 4 × 2 = 40 + 8 = 48', encouragement: 'You broke it down!' },
        { problem: '9 × 6 = ?', answer: '54', hints: ['9 sixes', 'Think 10×6 - 6'], solution: '9 × 6 = 54', encouragement: 'Fantastic!' }
      ];
    }
    if (skill === 'DIV') {
      return [
        { problem: '36 ÷ 6 = ?', answer: '6', hints: ['How many 6s in 36?', 'Think: 6 × ? = 36'], solution: '36 ÷ 6 = 6 because 6 × 6 = 36', encouragement: 'Division done!' },
        { problem: '45 ÷ 9 = ?', answer: '5', hints: ['9 × ? = 45'], solution: '45 ÷ 9 = 5', encouragement: 'Great work!' },
        { problem: '56 ÷ 7 = ?', answer: '8', hints: ['7 × ? = 56'], solution: '56 ÷ 7 = 8', encouragement: 'You got it!' },
        { problem: '72 ÷ 8 = ?', answer: '9', hints: ['8 × ? = 72'], solution: '72 ÷ 8 = 9', encouragement: 'Excellent!' },
        { problem: '42 ÷ 6 = ?', answer: '7', hints: ['6 × ? = 42'], solution: '42 ÷ 6 = 7', encouragement: 'Division master!' }
      ];
    }
    if (skill === 'DEC') {
      return [
        { problem: '3.5 + 2.7 = ?', answer: '6.2', hints: ['Line up decimals', 'Add like whole numbers'], solution: '3.5 + 2.7 = 6.2', encouragement: 'Decimal addition!' },
        { problem: '8.4 - 3.6 = ?', answer: '4.8', hints: ['Line up decimals', 'Subtract carefully'], solution: '8.4 - 3.6 = 4.8', encouragement: 'Great subtraction!' },
        { problem: '2.5 × 4 = ?', answer: '10', hints: ['25 × 4 = 100', 'Move decimal one place'], solution: '2.5 × 4 = 10', encouragement: 'Perfect!' },
        { problem: '6.3 + 1.8 = ?', answer: '8.1', hints: ['3 + 8 = 11, carry 1'], solution: '6.3 + 1.8 = 8.1', encouragement: 'You got it!' },
        { problem: '9.2 - 4.5 = ?', answer: '4.7', hints: ['Borrow if needed'], solution: '9.2 - 4.5 = 4.7', encouragement: 'Decimal star!' }
      ];
    }
    if (skill === 'PERCENT') {
      return [
        { problem: 'What is 50% of 80?', answer: '40', hints: ['50% = half', '80 ÷ 2 = ?'], solution: '50% of 80 = 40', encouragement: 'Half is easy!' },
        { problem: 'What is 10% of 250?', answer: '25', hints: ['Move decimal one left'], solution: '10% of 250 = 25', encouragement: 'Quick percent!' },
        { problem: 'What is 20% of 45?', answer: '9', hints: ['20% = 1/5', '45 ÷ 5 = 9'], solution: '20% of 45 = 9', encouragement: 'Great work!' },
        { problem: 'What is 75% of 40?', answer: '30', hints: ['75% = 3/4', 'Find 1/4, multiply by 3'], solution: '40 ÷ 4 = 10, 10 × 3 = 30', encouragement: 'You got it!' },
        { problem: 'What is 25% of 120?', answer: '30', hints: ['25% = 1/4'], solution: '120 ÷ 4 = 30', encouragement: 'Quarter perfect!' }
      ];
    }
    if (skill === 'RATIO') {
      return [
        { problem: 'Simplify: 12:8', answer: '3:2', hints: ['Find GCF', 'Divide both by 4'], solution: '12÷4 : 8÷4 = 3:2', encouragement: 'Ratio simplified!' },
        { problem: 'If 3:5 = 9:x, find x', answer: '15', hints: ['Cross multiply', '3x = 45'], solution: '3 × x = 5 × 9, x = 45 ÷ 3 = 15', encouragement: 'Proportion pro!' },
        { problem: 'Simplify: 20:15', answer: '4:3', hints: ['GCF is 5'], solution: '20÷5 : 15÷5 = 4:3', encouragement: 'Well done!' },
        { problem: 'If 2:3 = 8:x, find x', answer: '12', hints: ['2 × 4 = 8, so 3 × 4 = ?'], solution: 'x = 12', encouragement: 'Pattern found!' },
        { problem: 'Simplify: 6:9', answer: '2:3', hints: ['GCF is 3'], solution: '6÷3 : 9÷3 = 2:3', encouragement: 'Great simplifying!' }
      ];
    }
    if (skill === 'PATTERN') {
      return [
        { problem: 'What comes next: 2, 4, 6, 8, ?', answer: '10', hints: ['Adding 2 each time'], solution: 'Pattern: +2. Next is 10', encouragement: 'Pattern found!' },
        { problem: 'What comes next: 🔴🔵🔴🔵🔴?', answer: '🔵', hints: ['Red, blue, red, blue...'], solution: 'The pattern alternates. Next is blue!', encouragement: 'You see the pattern!' },
        { problem: 'Complete: 5, 10, 15, 20, ?', answer: '25', hints: ['Counting by 5s'], solution: 'Pattern: +5. Next is 25', encouragement: 'Skip counting!' },
        { problem: 'What comes next: 1, 2, 4, 8, ?', answer: '16', hints: ['Doubling each time'], solution: 'Pattern: ×2. Next is 16', encouragement: 'Doubling pattern!' },
        { problem: 'Complete: ⭐⭐🌙⭐⭐🌙⭐⭐?', answer: '🌙', hints: ['Two stars then one moon'], solution: 'Pattern: star, star, moon. Next is moon!', encouragement: 'Perfect!' }
      ];
    }
    if (skill === 'PLACEVALUE') {
      return [
        { problem: 'What is the value of 5 in 358?', answer: '50', hints: ['5 is in the tens place'], solution: '5 is in the tens place = 50', encouragement: 'Place value pro!' },
        { problem: 'Write 400 + 30 + 7 as one number', answer: '437', hints: ['Combine the values'], solution: '400 + 30 + 7 = 437', encouragement: 'Expanded form!' },
        { problem: 'What is the value of 2 in 825?', answer: '20', hints: ['2 is in the tens place'], solution: '2 × 10 = 20', encouragement: 'You got it!' },
        { problem: 'Round 47 to the nearest ten', answer: '50', hints: ['Is 47 closer to 40 or 50?'], solution: '47 rounds up to 50', encouragement: 'Great rounding!' },
        { problem: 'What digit is in the hundreds place of 962?', answer: '9', hints: ['Hundreds is the third place'], solution: 'In 962, 9 is in hundreds place', encouragement: 'Perfect!' }
      ];
    }
    if (skill === 'FRAC') {
      return [
        { problem: 'Color 1/2 of this circle: ⚪', answer: 'Half colored', hints: ['Divide into 2 equal parts', 'Color 1 part'], solution: 'Half means 1 out of 2 equal parts', encouragement: 'You understand halves!' },
        { problem: 'What fraction is shaded? ⬛⬜⬜⬜', answer: '1/4', hints: ['Count all boxes', 'Count shaded boxes'], solution: '1 shaded out of 4 = 1/4', encouragement: 'Fractions are fun!' },
        { problem: 'Which is bigger: 1/2 or 1/4?', answer: '1/2', hints: ['Smaller bottom = bigger pieces'], solution: '1/2 > 1/4 (half is bigger than quarter)', encouragement: 'Great comparing!' },
        { problem: 'What is 1/2 of 8?', answer: '4', hints: ['Divide 8 by 2'], solution: '8 ÷ 2 = 4', encouragement: 'Half of 8!' },
        { problem: 'Add: 1/4 + 1/4', answer: '2/4 or 1/2', hints: ['Same denominators - add tops'], solution: '1/4 + 1/4 = 2/4 = 1/2', encouragement: 'Adding fractions!' }
      ];
    }
  }

  // READING templates
  if (subject === 'READING') {
    if (skill === 'GENERAL') {
      const gradeTemplates = {
        2: [
          { problem: 'Read: "The cat sat on the mat." What did the cat do?', answer: 'Sat on the mat', hints: ['Find the action word', 'What did the cat do?'], solution: 'The cat SAT on the mat.', encouragement: 'Great reading!' },
          { problem: 'What is the main idea of a story?', answer: 'What the story is mostly about', hints: ['Think big picture', 'Not small details'], solution: 'Main idea = what the whole story is about', encouragement: 'You understand!' },
          { problem: 'Read: "Tom was happy. He got a new bike." Why was Tom happy?', answer: 'He got a new bike', hints: ['Look for the reason', 'What happened?'], solution: 'Tom was happy BECAUSE he got a new bike', encouragement: 'Great connection!' },
          { problem: 'What is a character in a story?', answer: 'A person or animal in the story', hints: ['Who is the story about?'], solution: 'Characters are who the story is about', encouragement: 'You know characters!' },
          { problem: 'What happens at the end of a story?', answer: 'The conclusion/ending', hints: ['How does it finish?'], solution: 'The end tells how the story finishes', encouragement: 'Story structure!' }
        ],
        3: [
          { problem: 'What is the setting of a story?', answer: 'Where and when it takes place', hints: ['Where does it happen?', 'When does it happen?'], solution: 'Setting = place + time', encouragement: 'You got it!' },
          { problem: 'What is a summary?', answer: 'A short retelling of main events', hints: ['Not every detail', 'Just the important parts'], solution: 'Summary = short version with main points', encouragement: 'Summarizing!' },
          { problem: 'What is the problem in a story?', answer: 'What the character needs to solve', hints: ['What goes wrong?', 'What challenge?'], solution: 'Problem = the conflict or challenge', encouragement: 'Story problems!' },
          { problem: 'What does "predict" mean in reading?', answer: 'Guess what will happen next', hints: ['Use clues', 'Think ahead'], solution: 'Predict = make educated guess about what happens next', encouragement: 'Great predicting!' },
          { problem: 'How do you find the main idea?', answer: 'Ask: What is this mostly about?', hints: ['Look at the title', 'Find repeated ideas'], solution: 'Main idea appears throughout the text', encouragement: 'Main idea master!' }
        ],
        4: [
          { problem: 'What is a theme in a story?', answer: 'The lesson or message', hints: ['What did characters learn?', 'What is the moral?'], solution: 'Theme = the underlying message or lesson', encouragement: 'Finding themes!' },
          { problem: 'What is point of view?', answer: 'Who is telling the story', hints: ['Is it "I" or "he/she"?'], solution: 'Point of view = the narrator perspective', encouragement: 'You understand POV!' },
          { problem: 'What is an inference?', answer: 'A conclusion from clues', hints: ['Use evidence', 'Read between lines'], solution: 'Inference = conclusion based on evidence', encouragement: 'Great inferring!' },
          { problem: 'What makes a good summary?', answer: 'Main events in order, no opinions', hints: ['Just facts', 'Key events only'], solution: 'Good summary = main events, in order, objective', encouragement: 'Summary skills!' },
          { problem: 'Compare means...', answer: 'Find similarities', hints: ['What is the same?'], solution: 'Compare = find what is alike', encouragement: 'Comparing!' }
        ],
        5: [
          { problem: 'What is the author purpose?', answer: 'Why the author wrote it', hints: ['To inform, persuade, or entertain?'], solution: 'Author purpose = reason for writing', encouragement: 'Author purpose pro!' },
          { problem: 'What is text structure?', answer: 'How the text is organized', hints: ['Sequence, compare, cause/effect?'], solution: 'Text structure = organization pattern', encouragement: 'You see structure!' },
          { problem: 'How do you identify cause and effect?', answer: 'Find what happened and why', hints: ['Why did it happen?', 'What resulted?'], solution: 'Cause = why, Effect = what happened', encouragement: 'Cause and effect!' },
          { problem: 'What is a reliable source?', answer: 'Trustworthy information', hints: ['Check the author', 'Is it factual?'], solution: 'Reliable = accurate, verified, trustworthy', encouragement: 'Source checking!' },
          { problem: 'Contrast means...', answer: 'Find differences', hints: ['What is different?'], solution: 'Contrast = find what is different', encouragement: 'Contrasting!' }
        ],
        6: [
          { problem: 'What is a claim in an argument?', answer: 'The main point the author makes', hints: ['What are they arguing?'], solution: 'Claim = the author\'s position or argument', encouragement: 'Identifying claims!' },
          { problem: 'What is evidence?', answer: 'Facts that support a claim', hints: ['Proof', 'Examples'], solution: 'Evidence = facts, data, examples that prove a point', encouragement: 'Evidence finder!' },
          { problem: 'What is bias?', answer: 'One-sided point of view', hints: ['Only one perspective', 'Not balanced'], solution: 'Bias = unfair favor toward one side', encouragement: 'Spotting bias!' },
          { problem: 'What is a counterargument?', answer: 'The opposing view', hints: ['What would someone disagree with?'], solution: 'Counterargument = the other side of the debate', encouragement: 'Critical thinking!' },
          { problem: 'What makes evidence strong?', answer: 'Facts, data, expert opinions', hints: ['Not just opinions', 'Verifiable'], solution: 'Strong evidence = factual, verifiable, relevant', encouragement: 'Evidence expert!' }
        ],
        7: [
          { problem: 'What is symbolism?', answer: 'When something represents something else', hints: ['Deeper meaning', 'Hidden message'], solution: 'Symbolism = objects/events that represent bigger ideas', encouragement: 'Finding symbols!' },
          { problem: 'What is foreshadowing?', answer: 'Hints about what will happen later', hints: ['Clues about the future', 'Early warnings'], solution: 'Foreshadowing = clues that predict future events', encouragement: 'You see foreshadowing!' },
          { problem: 'What is irony?', answer: 'When reality differs from expectation', hints: ['Unexpected twist', 'Opposite of expected'], solution: 'Irony = contrast between expected and actual', encouragement: 'Understanding irony!' },
          { problem: 'How does an author develop theme?', answer: 'Through characters, events, and symbols', hints: ['Character changes', 'Repeated ideas'], solution: 'Theme develops through story elements', encouragement: 'Theme analysis!' },
          { problem: 'What is a motif?', answer: 'A repeated element in a story', hints: ['Pattern', 'Recurring idea'], solution: 'Motif = recurring image, idea, or symbol', encouragement: 'Motif master!' }
        ]
      };
      return gradeTemplates[grade] || gradeTemplates[3];
    }
    if (skill === 'PHONICS') {
      return [
        { problem: 'What sound does "sh" make?', answer: '/sh/', hints: ['As in "ship"', 'Put s and h together'], solution: 'sh makes the /sh/ sound like in ship, shell, show', encouragement: 'Digraph master!' },
        { problem: 'Sound out: c-a-t', answer: 'cat', hints: ['Say each sound', 'Blend them together'], solution: '/c/ /a/ /t/ blended = cat', encouragement: 'Great blending!' },
        { problem: 'What sound does "ch" make?', answer: '/ch/', hints: ['As in "chin"'], solution: 'ch makes /ch/ like in chip, cheese, chat', encouragement: 'You know your sounds!' },
        { problem: 'What is the beginning sound in "ball"?', answer: '/b/', hints: ['Listen to the first sound'], solution: 'Ball starts with /b/', encouragement: 'Beginning sounds!' },
        { problem: 'What sound does "th" make?', answer: '/th/', hints: ['Tongue between teeth', 'As in "the"'], solution: 'th makes /th/ like in this, that, with', encouragement: 'Tricky digraph!' }
      ];
    }
    if (skill === 'SIGHT') {
      return [
        { problem: 'Read this word: the', answer: 'the', hints: ['You see this word a lot', 'Just know it!'], solution: '"the" is a sight word - memorize it!', encouragement: 'You know it!' },
        { problem: 'Read this word: said', answer: 'said', hints: ['Looks like say-id but sounds different'], solution: '"said" sounds like "sed"', encouragement: 'Tricky word mastered!' },
        { problem: 'Read this word: was', answer: 'was', hints: ['Sounds like "wuz"'], solution: '"was" is pronounced "wuz"', encouragement: 'Sight word star!' },
        { problem: 'Read this word: they', answer: 'they', hints: ['Sounds like "thay"'], solution: '"they" rhymes with "day"', encouragement: 'Great reading!' },
        { problem: 'Read this word: come', answer: 'come', hints: ['Sounds like "kum"'], solution: '"come" has a short u sound', encouragement: 'You got it!' }
      ];
    }
    if (skill === 'FLUENCY') {
      return [
        { problem: 'What makes reading fluent?', answer: 'Smooth, accurate, expressive', hints: ['Not choppy', 'With feeling'], solution: 'Fluency = smooth + accurate + expression', encouragement: 'Fluency facts!' },
        { problem: 'What should you do at a period?', answer: 'Pause and stop', hints: ['End of sentence'], solution: 'Period = full stop, take a breath', encouragement: 'Punctuation pause!' },
        { problem: 'How do you read a question?', answer: 'Voice goes up at the end', hints: ['Sound curious'], solution: 'Questions end with rising voice', encouragement: 'Expression!' },
        { problem: 'What does an exclamation mark mean for reading?', answer: 'Read with excitement/strong feeling', hints: ['More energy!'], solution: 'Exclamation = read with emphasis!', encouragement: 'Exciting reading!' },
        { problem: 'What should you do if you stumble on a word?', answer: 'Sound it out, then reread smoothly', hints: ['Try again', 'Keep going'], solution: 'Sound it out, then read the sentence again smoothly', encouragement: 'Keep practicing!' }
      ];
    }
    if (skill === 'EVIDENCE') {
      return [
        { problem: 'Where do you find text evidence?', answer: 'In the text/passage', hints: ['Look back', 'Find the exact words'], solution: 'Evidence comes directly from what you read', encouragement: 'In the text!' },
        { problem: 'How do you cite evidence?', answer: 'Quote or paraphrase from the text', hints: ['Use the author words', 'Or restate them'], solution: 'Cite by quoting or paraphrasing', encouragement: 'Citing correctly!' },
        { problem: 'What makes strong text evidence?', answer: 'Directly supports your answer', hints: ['Relevant', 'Clear connection'], solution: 'Strong evidence clearly proves your point', encouragement: 'Strong evidence!' },
        { problem: 'Should you just copy the whole paragraph?', answer: 'No, select relevant parts only', hints: ['Be specific', 'Key sentences only'], solution: 'Select only the sentences that prove your point', encouragement: 'Selective citing!' },
        { problem: 'How do you introduce a quote?', answer: 'According to the text... / The author states...', hints: ['Signal words'], solution: 'Use phrases like "According to..." or "The text says..."', encouragement: 'Quote introduction!' }
      ];
    }
    if (skill === 'SEQUENCE') {
      return [
        { problem: 'What are sequence words?', answer: 'First, next, then, finally', hints: ['Order words', 'Time words'], solution: 'Sequence words show order: first, next, then, last', encouragement: 'Order words!' },
        { problem: 'Put in order: got dressed, woke up, ate breakfast', answer: 'woke up, got dressed, ate breakfast', hints: ['What happens first in the morning?'], solution: '1. Woke up 2. Got dressed 3. Ate breakfast', encouragement: 'Correct sequence!' },
        { problem: 'What word signals the last event?', answer: 'Finally, lastly, at the end', hints: ['Ending words'], solution: 'Finally, lastly, in the end = last event', encouragement: 'Ending signals!' },
        { problem: 'What does "before" tell you?', answer: 'Something happened earlier', hints: ['Earlier in time'], solution: 'Before = happened first/earlier', encouragement: 'Time order!' },
        { problem: 'What does "after" tell you?', answer: 'Something happened later', hints: ['Later in time'], solution: 'After = happened next/later', encouragement: 'Sequencing!' }
      ];
    }
  }

  // WRITING templates
  if (subject === 'WRITING' || subject === 'WRITE') {
    return [
      { problem: 'What does a sentence need?', answer: 'Capital, subject, verb, end punctuation', hints: ['Start with capital', 'End with . ? or !'], solution: 'Complete sentence = capital + subject + verb + punctuation', encouragement: 'Sentence basics!' },
      { problem: 'Fix: the dog ran fast', answer: 'The dog ran fast.', hints: ['Capital T', 'Add period'], solution: 'The dog ran fast.', encouragement: 'Fixed it!' },
      { problem: 'What is a topic sentence?', answer: 'The main idea of a paragraph', hints: ['Usually first', 'Tells what paragraph is about'], solution: 'Topic sentence = main idea of the paragraph', encouragement: 'Topic sentences!' },
      { problem: 'What comes after the topic sentence?', answer: 'Supporting details', hints: ['Facts', 'Examples'], solution: 'Details support and explain the topic sentence', encouragement: 'Paragraph structure!' },
      { problem: 'How do you end a paragraph?', answer: 'With a closing sentence', hints: ['Wrap it up', 'Restate the main idea'], solution: 'Closing sentence wraps up the paragraph', encouragement: 'Complete paragraph!' }
    ];
  }

  // SPELLING templates
  if (subject === 'SPELLING') {
    return [
      { problem: 'Spell the word: /k/-/a/-/t/', answer: 'cat', hints: ['Write each sound', 'c-a-t'], solution: 'cat = c + a + t', encouragement: 'Great spelling!' },
      { problem: 'Which is correct: freind or friend?', answer: 'friend', hints: ['i before e except after c', 'But friend is exception!'], solution: 'friend - just memorize this one!', encouragement: 'Tricky word!' },
      { problem: 'Add -ing to run', answer: 'running', hints: ['Short vowel + consonant', 'Double the last letter'], solution: 'run + n + ing = running', encouragement: 'Doubling rule!' },
      { problem: 'Add -ed to hope', answer: 'hoped', hints: ['Silent e at end', 'Drop the e'], solution: 'hope - e + ed = hoped', encouragement: 'Drop the e!' },
      { problem: 'Spell the word for the number after 7', answer: 'eight', hints: ['Sounds like "ate"', 'Has "ght"'], solution: 'eight = e-i-g-h-t', encouragement: 'Number spelling!' }
    ];
  }

  // TYPING templates
  if (subject === 'TYPING') {
    return [
      { problem: 'What are the home row keys?', answer: 'ASDF JKL;', hints: ['Where fingers rest', 'Middle row'], solution: 'Home row: A S D F for left hand, J K L ; for right', encouragement: 'Home row!' },
      { problem: 'Which fingers type F and J?', answer: 'Index fingers', hints: ['Feel the bumps'], solution: 'Index (pointer) fingers rest on F and J', encouragement: 'Index finger keys!' },
      { problem: 'What should you do after typing a key?', answer: 'Return to home row', hints: ['Go back', 'Rest position'], solution: 'Always return fingers to home row position', encouragement: 'Good habit!' },
      { problem: 'Which hand types the spacebar?', answer: 'Either thumb', hints: ['Bottom of keyboard', 'Use thumbs'], solution: 'Use your thumb (either hand) for spacebar', encouragement: 'Thumbs for space!' },
      { problem: 'Should you look at the keyboard?', answer: 'No, look at the screen', hints: ['Trust your fingers', 'Build muscle memory'], solution: 'Keep eyes on screen, not keyboard', encouragement: 'Touch typing!' }
    ];
  }

  // CODING templates
  if (subject === 'CODING') {
    return [
      { problem: 'What is a sequence in coding?', answer: 'Steps in order', hints: ['First, then, next', 'Order matters'], solution: 'Sequence = commands that run in order', encouragement: 'Sequences!' },
      { problem: 'What is a loop?', answer: 'Code that repeats', hints: ['Do something multiple times'], solution: 'Loop = repeat code a certain number of times', encouragement: 'Loops!' },
      { problem: 'What is a bug?', answer: 'An error in code', hints: ['Something wrong', 'Needs fixing'], solution: 'Bug = mistake in the code', encouragement: 'Bug hunter!' },
      { problem: 'What does "debug" mean?', answer: 'Find and fix errors', hints: ['Hunt for bugs', 'Fix them'], solution: 'Debug = find and fix code errors', encouragement: 'Debugging!' },
      { problem: 'What is a variable?', answer: 'A container for data', hints: ['Stores information', 'Has a name'], solution: 'Variable = named container that stores a value', encouragement: 'Variables!' }
    ];
  }

  // Default templates
  return [
    { problem: `Practice ${skill} at grade ${grade}`, answer: 'Practice answer', hints: ['Hint 1', 'Hint 2'], solution: 'Solution explanation', encouragement: 'Keep practicing!' },
    { problem: `${skill} exercise 2`, answer: 'Answer 2', hints: ['Think carefully'], solution: 'Solution 2', encouragement: 'Great effort!' },
    { problem: `${skill} exercise 3`, answer: 'Answer 3', hints: ['You can do it'], solution: 'Solution 3', encouragement: 'Well done!' },
    { problem: `${skill} exercise 4`, answer: 'Answer 4', hints: ['Almost there'], solution: 'Solution 4', encouragement: 'Excellent!' },
    { problem: `${skill} exercise 5`, answer: 'Answer 5', hints: ['Keep going'], solution: 'Solution 5', encouragement: 'Amazing!' }
  ];
}

async function insertGuidedPractice() {
  let inserted = 0;
  let errors = [];

  console.log('Generating guided practice for ' + missingRuleIds.length + ' rule_ids...\n');

  for (const ruleId of missingRuleIds) {
    const problems = generateProblems(ruleId);

    for (const problem of problems) {
      const { error } = await supabase.from('guided_practice').insert(problem);

      if (error) {
        errors.push({ ruleId, error: error.message });
      } else {
        inserted++;
      }
    }

    process.stdout.write(`\rInserted: ${inserted} problems (${missingRuleIds.indexOf(ruleId) + 1}/${missingRuleIds.length} rule_ids)`);
  }

  console.log(`\n\nDone! Inserted ${inserted} guided practice problems.`);

  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.slice(0, 5).forEach(e => console.log(`  - ${e.ruleId}: ${e.error}`));
  }

  // Show new coverage
  const { count } = await supabase.from('guided_practice').select('*', { count: 'exact', head: true });
  console.log(`\nTotal guided_practice entries: ${count}`);
}

insertGuidedPractice();
