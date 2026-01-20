'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, Star, Trophy, BookOpen,
  Play, Target, Clock, Award, Brain, Sparkles, GraduationCap, Calculator,
  BookA, PenTool, Volume2
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { trackTestResult } from '@/hooks/useTracking';

/**
 * PLACEMENT TEST
 *
 * Determines the appropriate starting grade level for each subject:
 * - Math (K-8)
 * - Reading (K-8)
 * - Spelling (K-8)
 * - Writing (K-8)
 *
 * Uses adaptive testing:
 * - Starts at estimated grade level
 * - If correct, tries harder question
 * - If wrong, tries easier question
 * - Finds the "just right" level where student gets ~70-80% correct
 */

interface PlacementQuestion {
  id: string;
  subject: string;
  gradeLevel: number; // 0=K, 1-8
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface SubjectResult {
  subject: string;
  questionsAnswered: number;
  correctAnswers: number;
  determinedGrade: number;
  confidence: 'high' | 'medium' | 'low';
}

type TestPhase = 'intro' | 'subject-select' | 'testing' | 'subject-complete' | 'all-complete';

// Grade level names
const GRADE_NAMES: Record<number, string> = {
  0: 'Kindergarten',
  1: '1st Grade',
  2: '2nd Grade',
  3: '3rd Grade',
  4: '4th Grade',
  5: '5th Grade',
  6: '6th Grade',
  7: '7th Grade',
  8: '8th Grade'
};

// Subject info
const SUBJECTS = [
  { id: 'MATH', name: 'Math', icon: Calculator, color: 'from-blue-500 to-cyan-500', emoji: '🔢' },
  { id: 'READING', name: 'Reading', icon: BookOpen, color: 'from-green-500 to-emerald-500', emoji: '📚' },
  { id: 'SPELLING', name: 'Spelling', icon: BookA, color: 'from-purple-500 to-pink-500', emoji: '✏️' },
  { id: 'WRITING', name: 'Writing', icon: PenTool, color: 'from-orange-500 to-yellow-500', emoji: '📝' }
];

// Comprehensive question bank by subject and grade
const PLACEMENT_QUESTIONS: Record<string, PlacementQuestion[]> = {
  MATH: [
    // Kindergarten (Grade 0)
    { id: 'math-k-1', subject: 'MATH', gradeLevel: 0, question: 'How many apples? 🍎🍎🍎', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'Count each apple: 1, 2, 3!' },
    { id: 'math-k-2', subject: 'MATH', gradeLevel: 0, question: 'What comes after 5?', options: ['4', '5', '6', '7'], correctAnswer: '6', explanation: 'After 5 comes 6!' },
    { id: 'math-k-3', subject: 'MATH', gradeLevel: 0, question: 'Which is more: 3 or 7?', options: ['3', '7', 'Same', 'None'], correctAnswer: '7', explanation: '7 is more than 3' },

    // 1st Grade
    { id: 'math-1-1', subject: 'MATH', gradeLevel: 1, question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correctAnswer: '8', explanation: '5 + 3 = 8' },
    { id: 'math-1-2', subject: 'MATH', gradeLevel: 1, question: 'What is 9 - 4?', options: ['3', '4', '5', '6'], correctAnswer: '5', explanation: '9 - 4 = 5' },
    { id: 'math-1-3', subject: 'MATH', gradeLevel: 1, question: 'Tom has 6 toys. He gets 2 more. How many now?', options: ['6', '7', '8', '9'], correctAnswer: '8', explanation: '6 + 2 = 8 toys' },

    // 2nd Grade
    { id: 'math-2-1', subject: 'MATH', gradeLevel: 2, question: 'What is 14 + 8?', options: ['20', '21', '22', '23'], correctAnswer: '22', explanation: '14 + 8 = 22' },
    { id: 'math-2-2', subject: 'MATH', gradeLevel: 2, question: 'What is 25 - 9?', options: ['14', '15', '16', '17'], correctAnswer: '16', explanation: '25 - 9 = 16' },
    { id: 'math-2-3', subject: 'MATH', gradeLevel: 2, question: '3 + 3 + 3 + 3 = ?', options: ['9', '10', '11', '12'], correctAnswer: '12', explanation: '3 + 3 + 3 + 3 = 12 (or 3 × 4)' },

    // 3rd Grade
    { id: 'math-3-1', subject: 'MATH', gradeLevel: 3, question: 'What is 7 × 6?', options: ['40', '41', '42', '43'], correctAnswer: '42', explanation: '7 × 6 = 42' },
    { id: 'math-3-2', subject: 'MATH', gradeLevel: 3, question: 'What is 56 ÷ 8?', options: ['6', '7', '8', '9'], correctAnswer: '7', explanation: '56 ÷ 8 = 7' },
    { id: 'math-3-3', subject: 'MATH', gradeLevel: 3, question: 'What fraction is shaded? ■■□□', options: ['1/4', '2/4', '3/4', '4/4'], correctAnswer: '2/4', explanation: '2 out of 4 squares = 2/4 or 1/2' },

    // 4th Grade
    { id: 'math-4-1', subject: 'MATH', gradeLevel: 4, question: 'What is 234 × 6?', options: ['1,204', '1,304', '1,404', '1,504'], correctAnswer: '1,404', explanation: '234 × 6 = 1,404' },
    { id: 'math-4-2', subject: 'MATH', gradeLevel: 4, question: 'Which is equivalent to 3/4?', options: ['6/8', '5/8', '4/8', '7/8'], correctAnswer: '6/8', explanation: '3/4 = 6/8 (multiply both by 2)' },
    { id: 'math-4-3', subject: 'MATH', gradeLevel: 4, question: 'What is 1,000 - 347?', options: ['643', '653', '663', '673'], correctAnswer: '653', explanation: '1,000 - 347 = 653' },

    // 5th Grade
    { id: 'math-5-1', subject: 'MATH', gradeLevel: 5, question: 'What is 3.5 + 2.75?', options: ['5.25', '6.00', '6.25', '6.50'], correctAnswer: '6.25', explanation: '3.5 + 2.75 = 6.25' },
    { id: 'math-5-2', subject: 'MATH', gradeLevel: 5, question: 'What is 2/3 + 1/6?', options: ['3/6', '4/6', '5/6', '6/6'], correctAnswer: '5/6', explanation: '2/3 = 4/6, so 4/6 + 1/6 = 5/6' },
    { id: 'math-5-3', subject: 'MATH', gradeLevel: 5, question: 'What is 15% of 80?', options: ['8', '10', '12', '15'], correctAnswer: '12', explanation: '15% of 80 = 0.15 × 80 = 12' },

    // 6th Grade
    { id: 'math-6-1', subject: 'MATH', gradeLevel: 6, question: 'What is -5 + 8?', options: ['-13', '-3', '3', '13'], correctAnswer: '3', explanation: '-5 + 8 = 3' },
    { id: 'math-6-2', subject: 'MATH', gradeLevel: 6, question: 'Solve: 3x = 18', options: ['x = 3', 'x = 5', 'x = 6', 'x = 9'], correctAnswer: 'x = 6', explanation: '3x = 18, so x = 18 ÷ 3 = 6' },
    { id: 'math-6-3', subject: 'MATH', gradeLevel: 6, question: 'What is the ratio 15:25 in simplest form?', options: ['3:5', '5:3', '1:2', '2:3'], correctAnswer: '3:5', explanation: '15:25 = 3:5 (divide both by 5)' },

    // 7th Grade
    { id: 'math-7-1', subject: 'MATH', gradeLevel: 7, question: 'What is -4 × -7?', options: ['-28', '-11', '11', '28'], correctAnswer: '28', explanation: 'Negative × Negative = Positive: -4 × -7 = 28' },
    { id: 'math-7-2', subject: 'MATH', gradeLevel: 7, question: 'Solve: 2x + 5 = 17', options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'], correctAnswer: 'x = 6', explanation: '2x + 5 = 17 → 2x = 12 → x = 6' },
    { id: 'math-7-3', subject: 'MATH', gradeLevel: 7, question: 'What is 25% as a decimal?', options: ['0.025', '0.25', '2.5', '25'], correctAnswer: '0.25', explanation: '25% = 25/100 = 0.25' },

    // 8th Grade
    { id: 'math-8-1', subject: 'MATH', gradeLevel: 8, question: 'What is √144?', options: ['11', '12', '13', '14'], correctAnswer: '12', explanation: '√144 = 12 because 12 × 12 = 144' },
    { id: 'math-8-2', subject: 'MATH', gradeLevel: 8, question: 'Simplify: 3² × 2³', options: ['36', '54', '72', '108'], correctAnswer: '72', explanation: '3² × 2³ = 9 × 8 = 72' },
    { id: 'math-8-3', subject: 'MATH', gradeLevel: 8, question: 'Solve: x² = 49', options: ['x = 7 only', 'x = -7 only', 'x = 7 or -7', 'x = 49'], correctAnswer: 'x = 7 or -7', explanation: 'x² = 49 means x = 7 or x = -7' },
  ],

  READING: [
    // Kindergarten
    { id: 'read-k-1', subject: 'READING', gradeLevel: 0, question: 'What letter does "cat" start with?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C', explanation: 'Cat starts with C!' },
    { id: 'read-k-2', subject: 'READING', gradeLevel: 0, question: 'Which word rhymes with "hat"?', options: ['dog', 'cat', 'pig', 'run'], correctAnswer: 'cat', explanation: 'Hat and cat both end in -at!' },
    { id: 'read-k-3', subject: 'READING', gradeLevel: 0, question: 'The dog is big. What is big?', options: ['The cat', 'The dog', 'The hat', 'The ball'], correctAnswer: 'The dog', explanation: 'The sentence says the dog is big' },

    // 1st Grade
    { id: 'read-1-1', subject: 'READING', gradeLevel: 1, question: '"Sam ran fast." What did Sam do?', options: ['Walked', 'Ran', 'Jumped', 'Sat'], correctAnswer: 'Ran', explanation: 'Sam ran fast - he was running!' },
    { id: 'read-1-2', subject: 'READING', gradeLevel: 1, question: 'Which word means the opposite of "hot"?', options: ['warm', 'cold', 'big', 'fast'], correctAnswer: 'cold', explanation: 'Cold is the opposite of hot' },
    { id: 'read-1-3', subject: 'READING', gradeLevel: 1, question: '"The sun is bright." What describes the sun?', options: ['Dark', 'Bright', 'Small', 'Wet'], correctAnswer: 'Bright', explanation: 'The word bright describes the sun' },

    // 2nd Grade
    { id: 'read-2-1', subject: 'READING', gradeLevel: 2, question: '"Lily was happy because she won." Why was Lily happy?', options: ['She was tired', 'She lost', 'She won', 'She ate'], correctAnswer: 'She won', explanation: 'Lily was happy because she won something!' },
    { id: 'read-2-2', subject: 'READING', gradeLevel: 2, question: 'What is the main idea of: "Birds fly. Fish swim. Dogs run."', options: ['Birds are best', 'Animals move in different ways', 'Fish are wet', 'Dogs are fast'], correctAnswer: 'Animals move in different ways', explanation: 'Each animal moves differently!' },
    { id: 'read-2-3', subject: 'READING', gradeLevel: 2, question: '"The sky turned dark and rain began to fall." What is the weather?', options: ['Sunny', 'Rainy', 'Snowy', 'Windy'], correctAnswer: 'Rainy', explanation: 'Rain falling means rainy weather' },

    // 3rd Grade
    { id: 'read-3-1', subject: 'READING', gradeLevel: 3, question: '"Maya practiced every day. She became the best swimmer." What does this show?', options: ['Maya is lucky', 'Practice helps you improve', 'Swimming is easy', 'Maya never tried'], correctAnswer: 'Practice helps you improve', explanation: 'Maya got better because she practiced!' },
    { id: 'read-3-2', subject: 'READING', gradeLevel: 3, question: 'What does "enormous" mean?', options: ['Tiny', 'Very big', 'Fast', 'Colorful'], correctAnswer: 'Very big', explanation: 'Enormous means very, very big' },
    { id: 'read-3-3', subject: 'READING', gradeLevel: 3, question: '"First, crack the egg. Next, mix it. Finally, cook it." This is what type of text?', options: ['A story', 'A poem', 'Instructions', 'A letter'], correctAnswer: 'Instructions', explanation: 'Step-by-step directions are instructions' },

    // 4th Grade
    { id: 'read-4-1', subject: 'READING', gradeLevel: 4, question: '"The ancient castle stood on the hill for centuries." What does "ancient" mean?', options: ['New', 'Very old', 'Small', 'Colorful'], correctAnswer: 'Very old', explanation: 'Ancient means very, very old' },
    { id: 'read-4-2', subject: 'READING', gradeLevel: 4, question: 'In a story, the problem that needs to be solved is called the:', options: ['Setting', 'Character', 'Conflict', 'Theme'], correctAnswer: 'Conflict', explanation: 'The conflict is the problem in a story' },
    { id: 'read-4-3', subject: 'READING', gradeLevel: 4, question: '"Her heart raced as she opened the door." How does the character feel?', options: ['Bored', 'Sleepy', 'Nervous/Excited', 'Angry'], correctAnswer: 'Nervous/Excited', explanation: 'A racing heart shows nervousness or excitement' },

    // 5th Grade
    { id: 'read-5-1', subject: 'READING', gradeLevel: 5, question: '"The author argues that recycling saves energy." This is an example of:', options: ['Fiction', 'Opinion/Argument', 'Poetry', 'Fantasy'], correctAnswer: 'Opinion/Argument', explanation: 'The author is making an argument' },
    { id: 'read-5-2', subject: 'READING', gradeLevel: 5, question: 'What is the purpose of a thesis statement?', options: ['To tell a joke', 'To state the main argument', 'To end an essay', 'To list sources'], correctAnswer: 'To state the main argument', explanation: 'A thesis states the main point' },
    { id: 'read-5-3', subject: 'READING', gradeLevel: 5, question: '"She was as quiet as a mouse." This is an example of:', options: ['Metaphor', 'Simile', 'Alliteration', 'Onomatopoeia'], correctAnswer: 'Simile', explanation: 'A simile uses "as" or "like" to compare' },

    // 6th Grade
    { id: 'read-6-1', subject: 'READING', gradeLevel: 6, question: 'What is "point of view" in a narrative?', options: ['The setting', 'Who tells the story', 'The ending', 'The title'], correctAnswer: 'Who tells the story', explanation: 'Point of view is the narrator\'s perspective' },
    { id: 'read-6-2', subject: 'READING', gradeLevel: 6, question: '"The news spread like wildfire." This metaphor means:', options: ['There was a fire', 'News spread very quickly', 'People were camping', 'It was hot outside'], correctAnswer: 'News spread very quickly', explanation: 'Wildfire spreads fast, so does the news' },
    { id: 'read-6-3', subject: 'READING', gradeLevel: 6, question: 'What is the difference between a primary and secondary source?', options: ['Length', 'Age', 'Firsthand vs. secondhand account', 'Color'], correctAnswer: 'Firsthand vs. secondhand account', explanation: 'Primary = original, Secondary = about the original' },

    // 7th Grade
    { id: 'read-7-1', subject: 'READING', gradeLevel: 7, question: 'What is "irony"?', options: ['Being mean', 'The opposite of what\'s expected', 'A type of poem', 'A happy ending'], correctAnswer: 'The opposite of what\'s expected', explanation: 'Irony is when the outcome is unexpected' },
    { id: 'read-7-2', subject: 'READING', gradeLevel: 7, question: 'In an argument essay, a counterargument is:', options: ['Your main point', 'An opposing view you address', 'The conclusion', 'A citation'], correctAnswer: 'An opposing view you address', explanation: 'Counterargument = the other side\'s view' },
    { id: 'read-7-3', subject: 'READING', gradeLevel: 7, question: 'What does "analyze" mean in reading?', options: ['Summarize quickly', 'Break down and examine closely', 'Read once', 'Skip over'], correctAnswer: 'Break down and examine closely', explanation: 'Analyze = examine in detail' },

    // 8th Grade
    { id: 'read-8-1', subject: 'READING', gradeLevel: 8, question: 'What is "inference"?', options: ['A direct quote', 'A conclusion based on evidence', 'The title', 'The ending'], correctAnswer: 'A conclusion based on evidence', explanation: 'Inference = reading between the lines' },
    { id: 'read-8-2', subject: 'READING', gradeLevel: 8, question: 'An author\'s "tone" refers to:', options: ['The volume', 'Their attitude toward the subject', 'The length', 'The font'], correctAnswer: 'Their attitude toward the subject', explanation: 'Tone = author\'s attitude (serious, humorous, etc.)' },
    { id: 'read-8-3', subject: 'READING', gradeLevel: 8, question: 'What is the purpose of textual evidence?', options: ['To make it longer', 'To support your claims', 'To confuse readers', 'To skip reading'], correctAnswer: 'To support your claims', explanation: 'Evidence from the text backs up your points' },
  ],

  SPELLING: [
    // Kindergarten
    { id: 'spell-k-1', subject: 'SPELLING', gradeLevel: 0, question: 'Which is spelled correctly?', options: ['cat', 'kat', 'catt', 'cht'], correctAnswer: 'cat', explanation: 'C-A-T spells cat!' },
    { id: 'spell-k-2', subject: 'SPELLING', gradeLevel: 0, question: 'Which is spelled correctly?', options: ['dogg', 'dag', 'dog', 'doog'], correctAnswer: 'dog', explanation: 'D-O-G spells dog!' },
    { id: 'spell-k-3', subject: 'SPELLING', gradeLevel: 0, question: 'Which is spelled correctly?', options: ['runn', 'run', 'rnn', 'ruhn'], correctAnswer: 'run', explanation: 'R-U-N spells run!' },

    // 1st Grade
    { id: 'spell-1-1', subject: 'SPELLING', gradeLevel: 1, question: 'Which is spelled correctly?', options: ['said', 'sed', 'sayd', 'siad'], correctAnswer: 'said', explanation: 'S-A-I-D is the correct spelling' },
    { id: 'spell-1-2', subject: 'SPELLING', gradeLevel: 1, question: 'Which is spelled correctly?', options: ['thay', 'thae', 'they', 'thy'], correctAnswer: 'they', explanation: 'T-H-E-Y is correct' },
    { id: 'spell-1-3', subject: 'SPELLING', gradeLevel: 1, question: 'Which is spelled correctly?', options: ['wuz', 'was', 'wass', 'waz'], correctAnswer: 'was', explanation: 'W-A-S is the correct spelling' },

    // 2nd Grade
    { id: 'spell-2-1', subject: 'SPELLING', gradeLevel: 2, question: 'Which is spelled correctly?', options: ['becuase', 'becaus', 'because', 'becose'], correctAnswer: 'because', explanation: 'B-E-C-A-U-S-E' },
    { id: 'spell-2-2', subject: 'SPELLING', gradeLevel: 2, question: 'Which is spelled correctly?', options: ['freind', 'friend', 'frend', 'frind'], correctAnswer: 'friend', explanation: 'F-R-I-E-N-D (i before e!)' },
    { id: 'spell-2-3', subject: 'SPELLING', gradeLevel: 2, question: 'Which is spelled correctly?', options: ['peple', 'poeple', 'people', 'pepel'], correctAnswer: 'people', explanation: 'P-E-O-P-L-E' },

    // 3rd Grade
    { id: 'spell-3-1', subject: 'SPELLING', gradeLevel: 3, question: 'Which is spelled correctly?', options: ['diffrent', 'different', 'diferent', 'differnt'], correctAnswer: 'different', explanation: 'D-I-F-F-E-R-E-N-T' },
    { id: 'spell-3-2', subject: 'SPELLING', gradeLevel: 3, question: 'Which is spelled correctly?', options: ['importent', 'important', 'importint', 'improtant'], correctAnswer: 'important', explanation: 'I-M-P-O-R-T-A-N-T' },
    { id: 'spell-3-3', subject: 'SPELLING', gradeLevel: 3, question: 'Which is spelled correctly?', options: ['finaly', 'finnally', 'finally', 'finelly'], correctAnswer: 'finally', explanation: 'F-I-N-A-L-L-Y' },

    // 4th Grade
    { id: 'spell-4-1', subject: 'SPELLING', gradeLevel: 4, question: 'Which is spelled correctly?', options: ['separate', 'seperate', 'seperete', 'separete'], correctAnswer: 'separate', explanation: 'S-E-P-A-R-A-T-E (a rat in separate!)' },
    { id: 'spell-4-2', subject: 'SPELLING', gradeLevel: 4, question: 'Which is spelled correctly?', options: ['definately', 'definetly', 'definitely', 'definitly'], correctAnswer: 'definitely', explanation: 'D-E-F-I-N-I-T-E-L-Y' },
    { id: 'spell-4-3', subject: 'SPELLING', gradeLevel: 4, question: 'Which is spelled correctly?', options: ['experiance', 'experience', 'experence', 'expirience'], correctAnswer: 'experience', explanation: 'E-X-P-E-R-I-E-N-C-E' },

    // 5th Grade
    { id: 'spell-5-1', subject: 'SPELLING', gradeLevel: 5, question: 'Which is spelled correctly?', options: ['occurance', 'occurence', 'occurrence', 'occurrance'], correctAnswer: 'occurrence', explanation: 'O-C-C-U-R-R-E-N-C-E (double c, double r)' },
    { id: 'spell-5-2', subject: 'SPELLING', gradeLevel: 5, question: 'Which is spelled correctly?', options: ['accomodate', 'accommodate', 'acommodate', 'acomodate'], correctAnswer: 'accommodate', explanation: 'A-C-C-O-M-M-O-D-A-T-E (double c, double m)' },
    { id: 'spell-5-3', subject: 'SPELLING', gradeLevel: 5, question: 'Which is spelled correctly?', options: ['necesary', 'neccessary', 'necessary', 'neccesary'], correctAnswer: 'necessary', explanation: 'N-E-C-E-S-S-A-R-Y (one c, two s)' },

    // 6th Grade
    { id: 'spell-6-1', subject: 'SPELLING', gradeLevel: 6, question: 'Which is spelled correctly?', options: ['consciense', 'conscience', 'concience', 'consceince'], correctAnswer: 'conscience', explanation: 'C-O-N-S-C-I-E-N-C-E' },
    { id: 'spell-6-2', subject: 'SPELLING', gradeLevel: 6, question: 'Which is spelled correctly?', options: ['mischievous', 'mischevious', 'mischievious', 'mischevous'], correctAnswer: 'mischievous', explanation: 'M-I-S-C-H-I-E-V-O-U-S' },
    { id: 'spell-6-3', subject: 'SPELLING', gradeLevel: 6, question: 'Which is spelled correctly?', options: ['predjudice', 'prejudice', 'prejedice', 'prejudise'], correctAnswer: 'prejudice', explanation: 'P-R-E-J-U-D-I-C-E' },

    // 7th Grade
    { id: 'spell-7-1', subject: 'SPELLING', gradeLevel: 7, question: 'Which is spelled correctly?', options: ['embarass', 'embarras', 'embarrass', 'embaras'], correctAnswer: 'embarrass', explanation: 'E-M-B-A-R-R-A-S-S (double r, double s)' },
    { id: 'spell-7-2', subject: 'SPELLING', gradeLevel: 7, question: 'Which is spelled correctly?', options: ['recommendation', 'recomendation', 'reccommendation', 'recommendetion'], correctAnswer: 'recommendation', explanation: 'R-E-C-O-M-M-E-N-D-A-T-I-O-N' },
    { id: 'spell-7-3', subject: 'SPELLING', gradeLevel: 7, question: 'Which is spelled correctly?', options: ['independant', 'independint', 'independent', 'indipendent'], correctAnswer: 'independent', explanation: 'I-N-D-E-P-E-N-D-E-N-T' },

    // 8th Grade
    { id: 'spell-8-1', subject: 'SPELLING', gradeLevel: 8, question: 'Which is spelled correctly?', options: ['supercede', 'supersede', 'superceed', 'superseed'], correctAnswer: 'supersede', explanation: 'S-U-P-E-R-S-E-D-E' },
    { id: 'spell-8-2', subject: 'SPELLING', gradeLevel: 8, question: 'Which is spelled correctly?', options: ['lieutenant', 'leiutenant', 'lieutennant', 'liutenant'], correctAnswer: 'lieutenant', explanation: 'L-I-E-U-T-E-N-A-N-T' },
    { id: 'spell-8-3', subject: 'SPELLING', gradeLevel: 8, question: 'Which is spelled correctly?', options: ['bureaucracy', 'bureacracy', 'beaurocracy', 'beuracracy'], correctAnswer: 'bureaucracy', explanation: 'B-U-R-E-A-U-C-R-A-C-Y' },
  ],

  WRITING: [
    // Kindergarten
    { id: 'write-k-1', subject: 'WRITING', gradeLevel: 0, question: 'A sentence starts with a:', options: ['period', 'capital letter', 'small letter', 'number'], correctAnswer: 'capital letter', explanation: 'Sentences start with capital letters!' },
    { id: 'write-k-2', subject: 'WRITING', gradeLevel: 0, question: 'A sentence ends with a:', options: ['capital letter', 'comma', 'period', 'number'], correctAnswer: 'period', explanation: 'Sentences end with a period.' },
    { id: 'write-k-3', subject: 'WRITING', gradeLevel: 0, question: 'Which is a complete sentence?', options: ['The dog', 'Running fast', 'The cat sleeps.', 'Big and red'], correctAnswer: 'The cat sleeps.', explanation: 'A sentence needs who/what and an action' },

    // 1st Grade
    { id: 'write-1-1', subject: 'WRITING', gradeLevel: 1, question: 'Which sentence is correct?', options: ['i like apples.', 'I like apples.', 'i Like apples.', 'I like Apples.'], correctAnswer: 'I like apples.', explanation: 'Capitalize I and the first word only' },
    { id: 'write-1-2', subject: 'WRITING', gradeLevel: 1, question: 'What punctuation asks a question?', options: ['Period .', 'Comma ,', 'Question mark ?', 'Exclamation !'], correctAnswer: 'Question mark ?', explanation: 'Questions end with ?' },
    { id: 'write-1-3', subject: 'WRITING', gradeLevel: 1, question: 'Which shows excitement?', options: ['I am happy.', 'I am happy!', 'I am happy?', 'I am happy,'], correctAnswer: 'I am happy!', explanation: 'Exclamation marks show excitement!' },

    // 2nd Grade
    { id: 'write-2-1', subject: 'WRITING', gradeLevel: 2, question: 'Which sentence uses a comma correctly?', options: ['I ate pizza, and salad.', 'I ate, pizza and salad.', 'I ate pizza and, salad.', 'I ate pizza, salad, and cake.'], correctAnswer: 'I ate pizza, salad, and cake.', explanation: 'Commas separate items in a list' },
    { id: 'write-2-2', subject: 'WRITING', gradeLevel: 2, question: 'A noun is a:', options: ['Action word', 'Describing word', 'Person, place, or thing', 'Connecting word'], correctAnswer: 'Person, place, or thing', explanation: 'Nouns name people, places, or things' },
    { id: 'write-2-3', subject: 'WRITING', gradeLevel: 2, question: 'Which is an action verb?', options: ['happy', 'the', 'running', 'beautiful'], correctAnswer: 'running', explanation: 'Running is something you DO' },

    // 3rd Grade
    { id: 'write-3-1', subject: 'WRITING', gradeLevel: 3, question: 'What is an adjective?', options: ['A naming word', 'A describing word', 'An action word', 'A connecting word'], correctAnswer: 'A describing word', explanation: 'Adjectives describe nouns (big, red, happy)' },
    { id: 'write-3-2', subject: 'WRITING', gradeLevel: 3, question: 'A paragraph should have:', options: ['One sentence', 'Random sentences', 'Sentences about one topic', 'Only questions'], correctAnswer: 'Sentences about one topic', explanation: 'Paragraphs focus on one main idea' },
    { id: 'write-3-3', subject: 'WRITING', gradeLevel: 3, question: 'Which is a compound sentence?', options: ['The dog ran.', 'The dog ran, and the cat jumped.', 'Running fast.', 'Big brown dog.'], correctAnswer: 'The dog ran, and the cat jumped.', explanation: 'Compound = two sentences joined by and, but, or' },

    // 4th Grade
    { id: 'write-4-1', subject: 'WRITING', gradeLevel: 4, question: 'What is a topic sentence?', options: ['The last sentence', 'The main idea of a paragraph', 'A question', 'A very long sentence'], correctAnswer: 'The main idea of a paragraph', explanation: 'Topic sentence states the main point' },
    { id: 'write-4-2', subject: 'WRITING', gradeLevel: 4, question: 'Which transition word shows contrast?', options: ['Also', 'However', 'First', 'Then'], correctAnswer: 'However', explanation: 'However shows a contrast or opposite idea' },
    { id: 'write-4-3', subject: 'WRITING', gradeLevel: 4, question: 'What is dialogue?', options: ['Description', 'Characters talking', 'The ending', 'The setting'], correctAnswer: 'Characters talking', explanation: 'Dialogue = characters speaking to each other' },

    // 5th Grade
    { id: 'write-5-1', subject: 'WRITING', gradeLevel: 5, question: 'An introduction paragraph should:', options: ['End the essay', 'Hook the reader and state the thesis', 'List all details', 'Be only one sentence'], correctAnswer: 'Hook the reader and state the thesis', explanation: 'Introductions grab attention and state the main point' },
    { id: 'write-5-2', subject: 'WRITING', gradeLevel: 5, question: 'What is a thesis statement?', options: ['A question', 'The main argument of an essay', 'A quote', 'The conclusion'], correctAnswer: 'The main argument of an essay', explanation: 'Thesis = your main point or argument' },
    { id: 'write-5-3', subject: 'WRITING', gradeLevel: 5, question: 'Which shows correct apostrophe use for possession?', options: ['The dogs bone', 'The dog\'s bone', 'The dogs\' bone', 'The dog bone'], correctAnswer: 'The dog\'s bone', explanation: 'Dog\'s = belonging to one dog' },

    // 6th Grade
    { id: 'write-6-1', subject: 'WRITING', gradeLevel: 6, question: 'What is the purpose of a conclusion paragraph?', options: ['Add new information', 'Summarize and give final thoughts', 'Ask questions', 'List sources'], correctAnswer: 'Summarize and give final thoughts', explanation: 'Conclusions wrap up your main points' },
    { id: 'write-6-2', subject: 'WRITING', gradeLevel: 6, question: 'What is "voice" in writing?', options: ['Reading aloud', 'The author\'s unique style', 'Using quotations', 'The topic'], correctAnswer: 'The author\'s unique style', explanation: 'Voice = your unique writing personality' },
    { id: 'write-6-3', subject: 'WRITING', gradeLevel: 6, question: 'Which sentence is in active voice?', options: ['The ball was thrown by Sam.', 'Sam threw the ball.', 'The ball is being thrown.', 'Thrown by Sam was the ball.'], correctAnswer: 'Sam threw the ball.', explanation: 'Active: subject does the action' },

    // 7th Grade
    { id: 'write-7-1', subject: 'WRITING', gradeLevel: 7, question: 'What is a counterargument?', options: ['Your main point', 'An opposing viewpoint', 'The introduction', 'A quote'], correctAnswer: 'An opposing viewpoint', explanation: 'Counterargument = addressing the other side' },
    { id: 'write-7-2', subject: 'WRITING', gradeLevel: 7, question: 'Which citation style uses parenthetical in-text citations?', options: ['None', 'MLA', 'Only footnotes', 'Headlines'], correctAnswer: 'MLA', explanation: 'MLA uses (Author page) citations' },
    { id: 'write-7-3', subject: 'WRITING', gradeLevel: 7, question: 'What makes evidence "relevant"?', options: ['It\'s long', 'It directly supports your point', 'It\'s recent', 'It\'s a quote'], correctAnswer: 'It directly supports your point', explanation: 'Relevant evidence connects to your argument' },

    // 8th Grade
    { id: 'write-8-1', subject: 'WRITING', gradeLevel: 8, question: 'What is "ethos" in persuasive writing?', options: ['Emotional appeal', 'Credibility/trust', 'Logical reasoning', 'Style'], correctAnswer: 'Credibility/trust', explanation: 'Ethos = establishing credibility' },
    { id: 'write-8-2', subject: 'WRITING', gradeLevel: 8, question: 'What is the difference between "affect" and "effect"?', options: ['No difference', 'Affect=verb, Effect=noun (usually)', 'Effect=verb, Affect=noun', 'One is British'], correctAnswer: 'Affect=verb, Effect=noun (usually)', explanation: 'Affect is usually a verb, effect is usually a noun' },
    { id: 'write-8-3', subject: 'WRITING', gradeLevel: 8, question: 'What is a rhetorical question?', options: ['A grammatical error', 'A question not meant to be answered', 'A question with multiple answers', 'A simple question'], correctAnswer: 'A question not meant to be answered', explanation: 'Rhetorical questions make a point, not seek an answer' },
  ]
};

export default function PlacementTestPage() {
  const params = useParams();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const kidId = params.id as string;
  const supabase = createClient();


  const [phase, setPhase] = useState<TestPhase>('intro');
  const [childName, setChildName] = useState('');
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<PlacementQuestion | null>(null);
  const [currentGradeLevel, setCurrentGradeLevel] = useState(2); // Start at 2nd grade
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Track performance per subject
  const [subjectResults, setSubjectResults] = useState<Record<string, SubjectResult>>({});
  const [questionsAsked, setQuestionsAsked] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [highestCorrect, setHighestCorrect] = useState(0);
  const [lowestWrong, setLowestWrong] = useState(8);

  // Load child data
  useEffect(() => {
    const loadChild = async () => {
      const { data } = await supabase
        .from('children')
        .select('name, grade_level')
        .eq('id', kidId)
        .single();

      if (data) {
        setChildName(data.name);
        // Start at their registered grade level if available
        const gradeNum = data.grade_level === 'K' ? 0 : parseInt(data.grade_level) || 2;
        setCurrentGradeLevel(Math.min(Math.max(gradeNum, 0), 8));
      }
    };
    loadChild();
  }, [kidId]);

  // Get next question for current subject at appropriate grade level
  const getNextQuestion = (subject: string, targetGrade: number): PlacementQuestion | null => {
    const questions = PLACEMENT_QUESTIONS[subject] || [];

    // Find questions at target grade that haven't been asked
    let candidates = questions.filter(
      q => q.gradeLevel === targetGrade && !questionsAsked.includes(q.id)
    );

    // If no questions at target grade, try adjacent grades
    if (candidates.length === 0) {
      const nearbyGrades = [targetGrade - 1, targetGrade + 1, targetGrade - 2, targetGrade + 2];
      for (const grade of nearbyGrades) {
        if (grade >= 0 && grade <= 8) {
          candidates = questions.filter(
            q => q.gradeLevel === grade && !questionsAsked.includes(q.id)
          );
          if (candidates.length > 0) break;
        }
      }
    }

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // Start testing a subject
  const startSubject = (subjectIndex: number) => {
    setCurrentSubjectIndex(subjectIndex);
    setCorrectCount(0);
    setWrongCount(0);
    setHighestCorrect(0);
    setLowestWrong(8);
    setQuestionsAsked([]);

    const subject = SUBJECTS[subjectIndex].id;
    const question = getNextQuestion(subject, currentGradeLevel);

    if (question) {
      setCurrentQuestion(question);
      setQuestionsAsked([question.id]);
      setPhase('testing');
    }
  };

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setHighestCorrect(Math.max(highestCorrect, currentQuestion?.gradeLevel || 0));
    } else {
      setWrongCount(prev => prev + 1);
      setLowestWrong(Math.min(lowestWrong, currentQuestion?.gradeLevel || 8));
    }
  };

  // Move to next question or finish subject
  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    const totalAnswered = correctCount + wrongCount + 1;
    const subject = SUBJECTS[currentSubjectIndex].id;

    // Determine if we have enough data to place the student
    // Need at least 5 questions and a clear pattern
    if (totalAnswered >= 5) {
      const accuracy = correctCount / totalAnswered;

      // If accuracy is very high, try harder questions
      if (accuracy >= 0.8 && currentGradeLevel < 8) {
        const newGrade = Math.min(currentGradeLevel + 1, 8);
        setCurrentGradeLevel(newGrade);
        const nextQ = getNextQuestion(subject, newGrade);
        if (nextQ) {
          setCurrentQuestion(nextQ);
          setQuestionsAsked(prev => [...prev, nextQ.id]);
          return;
        }
      }

      // If accuracy is low, try easier questions
      if (accuracy < 0.5 && currentGradeLevel > 0) {
        const newGrade = Math.max(currentGradeLevel - 1, 0);
        setCurrentGradeLevel(newGrade);
        const nextQ = getNextQuestion(subject, newGrade);
        if (nextQ) {
          setCurrentQuestion(nextQ);
          setQuestionsAsked(prev => [...prev, nextQ.id]);
          return;
        }
      }

      // If we've asked 8+ questions or found good placement, finish
      if (totalAnswered >= 8 || (accuracy >= 0.6 && accuracy <= 0.85)) {
        finishSubject();
        return;
      }
    }

    // Adaptive: adjust grade level based on last answer
    let newGrade = currentGradeLevel;
    if (isCorrect && currentGradeLevel < 8) {
      newGrade = currentGradeLevel + 1;
    } else if (!isCorrect && currentGradeLevel > 0) {
      newGrade = currentGradeLevel - 1;
    }
    setCurrentGradeLevel(newGrade);

    // Get next question
    const nextQ = getNextQuestion(subject, newGrade);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionsAsked(prev => [...prev, nextQ.id]);
    } else {
      finishSubject();
    }
  };

  // Finish current subject
  const finishSubject = () => {
    const subject = SUBJECTS[currentSubjectIndex].id;
    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? correctCount / totalAnswered : 0;

    // Determine placement grade
    // If high accuracy at high grade → place at that grade
    // If low accuracy → place at lowest grade where they got things right
    let determinedGrade: number;

    if (accuracy >= 0.7) {
      determinedGrade = highestCorrect;
    } else if (accuracy >= 0.5) {
      determinedGrade = Math.floor((highestCorrect + lowestWrong) / 2);
    } else {
      determinedGrade = Math.max(0, lowestWrong - 1);
    }

    // Confidence based on number of questions and consistency
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (totalAnswered >= 8 && (accuracy >= 0.7 || accuracy <= 0.4)) {
      confidence = 'high';
    } else if (totalAnswered < 5) {
      confidence = 'low';
    }

    setSubjectResults(prev => ({
      ...prev,
      [subject]: {
        subject,
        questionsAnswered: totalAnswered,
        correctAnswers: correctCount,
        determinedGrade,
        confidence
      }
    }));

    setPhase('subject-complete');
  };

  // Move to next subject or finish all
  const continueToNextSubject = () => {
    if (currentSubjectIndex < SUBJECTS.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
      setPhase('subject-select');
    } else {
      setPhase('all-complete');
      saveResults();
    }
  };

  // Save all results to database
  const saveResults = async () => {
    try {
      // Build update object for children table
      const childUpdates: Record<string, number | boolean | string> = {
        placement_completed: true,
        placement_completed_at: new Date().toISOString()
      };

      // Add grade levels for each subject
      Object.values(subjectResults).forEach(result => {
        childUpdates[`${result.subject.toLowerCase()}_grade`] = result.determinedGrade;
      });

      // Update children table with grade levels
      await supabase
        .from('children')
        .update(childUpdates)
        .eq('id', kidId);

      // Save full results to placement_test_results table
      await supabase.from('placement_test_results').insert({
        child_id: kidId,
        results: subjectResults,
        taken_at: new Date().toISOString()
      });

      // Track each subject as a test result
      for (const result of Object.values(subjectResults)) {
        await trackTestResult({
          childId: kidId,
          testType: 'placement',
          subject: result.subject,
          score: result.correctAnswers,
          totalQuestions: result.questionsAnswered
        });
      }

      console.log('Placement results saved:', subjectResults);
    } catch (error) {
      console.error('Failed to save placement results:', error);
    }
  };

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-2xl mx-auto pt-8">
          <motion.button
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block text-8xl mb-6"
              >
                🎯
              </motion.div>

              <h1 className="text-4xl font-black text-white mb-4">
                Placement Test
              </h1>

              <p className="text-xl text-purple-200 mb-8">
                Hi {childName || 'there'}! Let&apos;s find out where you should start in each subject.
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  How it works:
                </h3>
                <ul className="space-y-3 text-purple-200">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📚</span>
                    <span>Answer questions in 4 subjects: Math, Reading, Spelling, and Writing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎚️</span>
                    <span>Questions get easier or harder based on your answers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">⭐</span>
                    <span>We&apos;ll find the perfect starting level for you!</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">⏱️</span>
                    <span>Takes about 10-15 minutes total</span>
                  </li>
                </ul>
              </div>

              <motion.button
                onClick={() => setPhase('subject-select')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl px-8 py-4 rounded-xl flex items-center gap-3 mx-auto shadow-lg shadow-yellow-500/30"
              >
                <Play className="h-6 w-6" />
                START TEST
              </motion.button>

              {/* Skip and Explore button */}
              <motion.button
                onClick={() => router.push(`/kid/${kidId}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold text-lg px-8 py-4 rounded-xl flex items-center gap-3 mx-auto transition-all"
              >
                <Sparkles className="h-5 w-5" />
                SKIP AND EXPLORE
              </motion.button>
              <p className="text-purple-300/70 text-sm mt-2">
                Take the test later - jump right into learning!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Subject selection screen
  if (phase === 'subject-select') {
    const currentSubject = SUBJECTS[currentSubjectIndex];
    const SubjectIcon = currentSubject.icon;

    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </motion.button>

            <div className="text-white/70 text-sm">
              Subject {currentSubjectIndex + 1} of {SUBJECTS.length}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center">
              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mb-8">
                {SUBJECTS.map((subject, idx) => (
                  <div
                    key={subject.id}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      idx < currentSubjectIndex
                        ? 'bg-green-500/30 border-2 border-green-500'
                        : idx === currentSubjectIndex
                          ? 'bg-white/20 border-2 border-white animate-pulse'
                          : 'bg-white/10 border-2 border-white/30'
                    }`}
                  >
                    {idx < currentSubjectIndex ? '✓' : subject.emoji}
                  </div>
                ))}
              </div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${currentSubject.color} mb-6`}
              >
                <SubjectIcon className="h-12 w-12 text-white" />
              </motion.div>

              <h2 className="text-3xl font-black text-white mb-4">
                {currentSubject.name} Assessment
              </h2>

              <p className="text-xl text-purple-200 mb-8">
                Ready to show what you know in {currentSubject.name}?
              </p>

              <div className="bg-black/30 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center gap-2 text-purple-300">
                  <Clock className="h-5 w-5" />
                  <span>About 5-8 questions</span>
                </div>
              </div>

              <motion.button
                onClick={() => startSubject(currentSubjectIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${currentSubject.color} text-white font-black text-xl px-8 py-4 rounded-xl flex items-center gap-3 mx-auto shadow-lg`}
              >
                <Target className="h-6 w-6" />
                BEGIN {currentSubject.name.toUpperCase()}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Testing screen
  if (phase === 'testing' && currentQuestion) {
    const currentSubject = SUBJECTS[currentSubjectIndex];
    const SubjectIcon = currentSubject.icon;

    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-2xl mx-auto pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentSubject.color} flex items-center justify-center`}>
                <SubjectIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold">{currentSubject.name}</div>
                <div className="text-purple-300 text-sm">
                  Question {questionsAsked.length} • {GRADE_NAMES[currentQuestion.gradeLevel]} level
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-green-400 font-bold">{correctCount} ✓</div>
              <div className="text-red-400 text-sm">{wrongCount} ✗</div>
            </div>
          </div>

          {/* Question card */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <div className="text-2xl font-bold text-white mb-8 text-center">
              {currentQuestion.question}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;

                let bgColor = 'bg-white/10 hover:bg-white/20';
                let borderColor = 'border-white/20';

                if (showFeedback) {
                  if (isCorrectAnswer) {
                    bgColor = 'bg-green-500/30';
                    borderColor = 'border-green-500';
                  } else if (isSelected && !isCorrectAnswer) {
                    bgColor = 'bg-red-500/30';
                    borderColor = 'border-red-500';
                  }
                } else if (isSelected) {
                  bgColor = 'bg-purple-500/30';
                  borderColor = 'border-purple-500';
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    className={`${bgColor} border-2 ${borderColor} rounded-xl p-4 text-left text-white font-medium text-lg transition-all flex items-center gap-3`}
                  >
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {showFeedback && isCorrectAnswer && (
                      <CheckCircle className="ml-auto h-6 w-6 text-green-400" />
                    )}
                    {showFeedback && isSelected && !isCorrectAnswer && (
                      <XCircle className="ml-auto h-6 w-6 text-red-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-orange-500/20 border border-orange-500/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-green-400 font-bold">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-orange-400" />
                          <span className="text-orange-400 font-bold">Not quite!</span>
                        </>
                      )}
                    </div>
                    <p className="text-white/80">{currentQuestion.explanation}</p>
                  </div>

                  <motion.button
                    onClick={nextQuestion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    Next Question
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }

  // Subject complete screen
  if (phase === 'subject-complete') {
    const currentSubject = SUBJECTS[currentSubjectIndex];
    const result = subjectResults[currentSubject.id];
    const SubjectIcon = currentSubject.icon;

    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-2xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1 }}
              className="text-6xl mb-6"
            >
              🎉
            </motion.div>

            <h2 className="text-3xl font-black text-white mb-2">
              {currentSubject.name} Complete!
            </h2>

            <p className="text-purple-200 mb-8">
              Great job, {childName}!
            </p>

            {result && (
              <div className="bg-black/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentSubject.color} flex items-center justify-center`}>
                    <SubjectIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white/70 text-sm">Your level:</div>
                    <div className="text-3xl font-black text-white">
                      {GRADE_NAMES[result.determinedGrade]}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-white">{result.questionsAnswered}</div>
                    <div className="text-purple-300 text-sm">Questions</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-400">{result.correctAnswers}</div>
                    <div className="text-purple-300 text-sm">Correct</div>
                  </div>
                </div>
              </div>
            )}

            <motion.button
              onClick={continueToNextSubject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl px-8 py-4 rounded-xl flex items-center gap-3 mx-auto"
            >
              {currentSubjectIndex < SUBJECTS.length - 1 ? (
                <>
                  Next Subject
                  <ArrowRight className="h-6 w-6" />
                </>
              ) : (
                <>
                  See Final Results
                  <Trophy className="h-6 w-6" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // All complete - final results screen
  if (phase === 'all-complete') {
    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-2xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block text-8xl mb-4"
              >
                🏆
              </motion.div>

              <h1 className="text-4xl font-black text-white mb-2">
                Placement Complete!
              </h1>

              <p className="text-xl text-purple-200">
                Here&apos;s where you&apos;ll start, {childName}!
              </p>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {SUBJECTS.map(subject => {
                const result = subjectResults[subject.id];
                const SubjectIcon = subject.icon;

                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gradient-to-br ${subject.color} bg-opacity-20 rounded-2xl p-4 border border-white/20`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <SubjectIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-white font-bold">{subject.name}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-black text-white">
                        {result ? GRADE_NAMES[result.determinedGrade] : 'N/A'}
                      </div>
                      {result && (
                        <div className="text-white/70 text-sm mt-1">
                          {result.correctAnswers}/{result.questionsAnswered} correct
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-black/30 rounded-xl p-4 mb-8 text-center">
              <Sparkles className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-purple-200">
                Your lessons will now be customized to these levels!
              </p>
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={() => router.push(`/kid/${kidId}`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                Start Learning!
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}
