'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Volume2, VolumeX, CheckCircle, XCircle,
  BookOpen, Star, Trophy, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReadingLesson } from '@/hooks/useReadingLesson';
import { Celebration } from '@/components/RiveAnimation';
import ThemeMascot from '@/components/ThemeMascot';
import { useTheme } from '@/lib/theme-context';

/**
 * READING LESSON PLAYER
 *
 * Follows MASTER-RULES-CHECKLIST:
 * 1. Lexile-based progression (BR to 1500L)
 * 2. Story Display - Age-appropriate formatting
 * 3. Audio Option - TTS read-aloud for K-5
 * 4. Comprehension Quiz - 10 ABCD questions per story
 * 5. Passing Score - 70% (7/10 correct)
 * 6. Coins - 25 base + 15 bonus for perfect
 *
 * Lexile Bands by Grade:
 * K: BR-200L | 1: 200L-400L | 2: 300L-500L | 3: 400L-700L
 * 4: 500L-800L | 5: 600L-900L | 6: 700L-1000L | 7: 800L-1100L
 * 8-12: 900L-1500L
 */

// Lexile ranges by grade
const LEXILE_BY_GRADE: Record<number, { min: number; max: number }> = {
  0: { min: 0, max: 200 },      // K: BR-200L
  1: { min: 200, max: 400 },    // 1st
  2: { min: 300, max: 500 },    // 2nd
  3: { min: 400, max: 700 },    // 3rd
  4: { min: 500, max: 800 },    // 4th
  5: { min: 600, max: 900 },    // 5th
  6: { min: 700, max: 1000 },   // 6th
  7: { min: 800, max: 1100 },   // 7th
  8: { min: 900, max: 1500 },   // 8th+
  9: { min: 900, max: 1500 },
  10: { min: 900, max: 1500 },
  11: { min: 900, max: 1500 },
  12: { min: 900, max: 1500 },
};

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  lexileLevel: number;
  gradeLevel: number;
  questions: ComprehensionQuestion[];
}

// Sample stories by grade level
const STORIES_BY_GRADE: Record<number, Story[]> = {
  0: [
    {
      id: 'k-story-1',
      title: 'The Red Ball',
      content: `Sam has a red ball.

The ball is big.

Sam kicks the ball.

The ball goes far!

Sam runs to get the ball.

Sam is happy.`,
      lexileLevel: 100,
      gradeLevel: 0,
      questions: [
        {
          question: 'What color is the ball?',
          options: ['Blue', 'Red', 'Green', 'Yellow'],
          correctAnswer: 'Red',
          explanation: 'The story says "Sam has a red ball."'
        },
        {
          question: 'What does Sam do with the ball?',
          options: ['Throws it', 'Kicks it', 'Catches it', 'Hides it'],
          correctAnswer: 'Kicks it',
          explanation: 'The story says "Sam kicks the ball."'
        },
        {
          question: 'How does Sam feel at the end?',
          options: ['Sad', 'Angry', 'Happy', 'Tired'],
          correctAnswer: 'Happy',
          explanation: 'The story says "Sam is happy."'
        },
        {
          question: 'Is the ball big or small?',
          options: ['Big', 'Small', 'Tiny', 'Huge'],
          correctAnswer: 'Big',
          explanation: 'The story says "The ball is big."'
        },
        {
          question: 'What happens after Sam kicks the ball?',
          options: ['It stops', 'It goes far', 'It pops', 'It rolls back'],
          correctAnswer: 'It goes far',
          explanation: 'The story says "The ball goes far!"'
        },
        {
          question: 'Who has the ball?',
          options: ['Mom', 'Dad', 'Sam', 'Cat'],
          correctAnswer: 'Sam',
          explanation: 'The story says "Sam has a red ball."'
        },
        {
          question: 'What does Sam do after the ball goes far?',
          options: ['Cries', 'Runs to get it', 'Goes home', 'Sits down'],
          correctAnswer: 'Runs to get it',
          explanation: 'The story says "Sam runs to get the ball."'
        },
        {
          question: 'What is this story mostly about?',
          options: ['A cat', 'A ball', 'A dog', 'A car'],
          correctAnswer: 'A ball',
          explanation: 'The whole story is about Sam playing with a ball.'
        },
        {
          question: 'What kind of story is this?',
          options: ['Scary', 'Funny', 'Happy', 'Sad'],
          correctAnswer: 'Happy',
          explanation: 'Sam is happy at the end, so it is a happy story.'
        },
        {
          question: 'Could this story happen in real life?',
          options: ['Yes', 'No', 'Maybe', 'Never'],
          correctAnswer: 'Yes',
          explanation: 'Kids can really kick balls and run to get them!'
        }
      ]
    }
  ],
  1: [
    {
      id: 'g1-story-1',
      title: 'The Lost Puppy',
      content: `Max was a small puppy. He lived with a family on Oak Street.

One sunny day, Max saw a butterfly. The butterfly was yellow and pretty. Max wanted to play with it!

Max ran after the butterfly. He ran and ran. Soon, Max was lost. He did not know where he was.

Max sat down and cried. He missed his family.

A kind girl named Emma found Max. She saw his collar. It had his address on it.

Emma walked Max home. His family was so happy! They gave Emma cookies to say thank you.

Max learned to stay in his yard.`,
      lexileLevel: 350,
      gradeLevel: 1,
      questions: [
        {
          question: 'What kind of animal is Max?',
          options: ['Cat', 'Puppy', 'Bird', 'Fish'],
          correctAnswer: 'Puppy',
          explanation: 'The story says "Max was a small puppy."'
        },
        {
          question: 'Why did Max run away?',
          options: ['He was scared', 'He chased a butterfly', 'He was hungry', 'He wanted to swim'],
          correctAnswer: 'He chased a butterfly',
          explanation: 'The story says Max ran after a butterfly.'
        },
        {
          question: 'What color was the butterfly?',
          options: ['Blue', 'Red', 'Yellow', 'Green'],
          correctAnswer: 'Yellow',
          explanation: 'The story says "The butterfly was yellow and pretty."'
        },
        {
          question: 'How did Max feel when he was lost?',
          options: ['Happy', 'Sad', 'Excited', 'Angry'],
          correctAnswer: 'Sad',
          explanation: 'The story says "Max sat down and cried."'
        },
        {
          question: 'Who found Max?',
          options: ['A boy named Tom', 'A girl named Emma', 'His mom', 'A policeman'],
          correctAnswer: 'A girl named Emma',
          explanation: 'The story says "A kind girl named Emma found Max."'
        },
        {
          question: 'How did Emma know where Max lived?',
          options: ['Max told her', 'She knew his family', 'His collar had his address', 'She guessed'],
          correctAnswer: 'His collar had his address',
          explanation: 'The story says "She saw his collar. It had his address on it."'
        },
        {
          question: 'What did the family give Emma?',
          options: ['Money', 'A toy', 'Cookies', 'A puppy'],
          correctAnswer: 'Cookies',
          explanation: 'The story says "They gave Emma cookies to say thank you."'
        },
        {
          question: 'What lesson did Max learn?',
          options: ['To bark louder', 'To stay in his yard', 'To chase cats', 'To run faster'],
          correctAnswer: 'To stay in his yard',
          explanation: 'The story says "Max learned to stay in his yard."'
        },
        {
          question: 'Where did Max live?',
          options: ['Park Street', 'Oak Street', 'Main Street', 'Pine Street'],
          correctAnswer: 'Oak Street',
          explanation: 'The story says "He lived with a family on Oak Street."'
        },
        {
          question: 'What is the main idea of this story?',
          options: ['Butterflies are pretty', 'Stay close to home', 'Cookies are yummy', 'Girls are kind'],
          correctAnswer: 'Stay close to home',
          explanation: 'The story teaches that Max should have stayed in his yard.'
        }
      ]
    }
  ],
  2: [
    {
      id: 'g2-story-1',
      title: 'The Magic Garden',
      content: `Lily loved to help her grandmother in the garden. Every Saturday, she would put on her gardening gloves and walk to Grandma's house.

"Today we're planting something special," Grandma said with a twinkle in her eye. She handed Lily a packet of rainbow flower seeds.

Lily dug small holes in the soil. She dropped one seed in each hole. Then she covered them with dirt and watered them gently.

"Now we wait," Grandma said. "But remember, gardens need three things: sun, water, and love."

Every day for two weeks, Lily visited the garden. She watered the seeds and talked to them. She told them about her day at school.

One morning, Lily saw tiny green sprouts! She jumped up and down with joy.

By summer, the garden was full of beautiful flowers. There were red ones, purple ones, orange ones, and pink ones. Butterflies and bees visited every day.

"You made something magical," Grandma said, hugging Lily.

Lily smiled. She learned that patience and care can create wonderful things.`,
      lexileLevel: 450,
      gradeLevel: 2,
      questions: [
        {
          question: 'What did Lily and her grandmother plant?',
          options: ['Vegetables', 'Trees', 'Rainbow flower seeds', 'Grass'],
          correctAnswer: 'Rainbow flower seeds',
          explanation: 'The story says Grandma gave Lily "a packet of rainbow flower seeds."'
        },
        {
          question: 'What three things does a garden need according to Grandma?',
          options: ['Food, water, shade', 'Sun, water, love', 'Dirt, seeds, pots', 'Rain, wind, sun'],
          correctAnswer: 'Sun, water, love',
          explanation: 'Grandma said "gardens need three things: sun, water, and love."'
        },
        {
          question: 'How often did Lily visit the garden?',
          options: ['Once a week', 'Every day', 'Twice a month', 'Only on weekends'],
          correctAnswer: 'Every day',
          explanation: 'The story says "Every day for two weeks, Lily visited the garden."'
        },
        {
          question: 'What did Lily do besides watering the seeds?',
          options: ['She sang to them', 'She talked to them', 'She read to them', 'She danced'],
          correctAnswer: 'She talked to them',
          explanation: 'The story says "She watered the seeds and talked to them."'
        },
        {
          question: 'How long did Lily wait before seeing sprouts?',
          options: ['One day', 'One week', 'Two weeks', 'One month'],
          correctAnswer: 'Two weeks',
          explanation: 'The story says "Every day for two weeks" before she saw sprouts.'
        },
        {
          question: 'What colors were the flowers?',
          options: ['Only red', 'Only purple', 'Blue and green', 'Red, purple, orange, and pink'],
          correctAnswer: 'Red, purple, orange, and pink',
          explanation: 'The story lists "red ones, purple ones, orange ones, and pink ones."'
        },
        {
          question: 'What visitors came to the garden in summer?',
          options: ['Birds and squirrels', 'Butterflies and bees', 'Rabbits and deer', 'Cats and dogs'],
          correctAnswer: 'Butterflies and bees',
          explanation: 'The story says "Butterflies and bees visited every day."'
        },
        {
          question: 'What did Lily wear to garden?',
          options: ['A hat', 'Gardening gloves', 'Boots', 'An apron'],
          correctAnswer: 'Gardening gloves',
          explanation: 'The story says "she would put on her gardening gloves."'
        },
        {
          question: 'What is the main lesson of this story?',
          options: ['Gardens are hard work', 'Grandmas are nice', 'Patience and care create wonderful things', 'Flowers are pretty'],
          correctAnswer: 'Patience and care create wonderful things',
          explanation: 'The story ends with Lily learning that "patience and care can create wonderful things."'
        },
        {
          question: 'When did Lily usually visit Grandma?',
          options: ['Mondays', 'Fridays', 'Saturdays', 'Sundays'],
          correctAnswer: 'Saturdays',
          explanation: 'The story says "Every Saturday, she would... walk to Grandma\'s house."'
        }
      ]
    }
  ],
  3: [
    {
      id: 'g3-story-1',
      title: 'The Secret Treehouse',
      content: `Jake and his sister Maria discovered something amazing in their backyard. Hidden behind the old oak tree was a wooden ladder leading up to a treehouse they had never noticed before.

"How is this possible?" Maria whispered. "We've lived here for five years!"

The treehouse was covered in vines and moss, which explained why it had been invisible. Jake climbed up first, his heart pounding with excitement.

Inside, they found an incredible surprise. The walls were covered with maps of distant lands, drawings of mythical creatures, and photographs of adventures. There was a journal on the dusty table.

Maria opened the journal carefully. "Property of Eleanor Wright, 1962," she read aloud. The pages were filled with stories about Eleanor's imaginary adventures to places like the Crystal Caves and the Floating Islands.

Over the following weeks, Jake and Maria cleaned up the treehouse. They painted the walls bright colors and added beanbag chairs. They even continued Eleanor's journal, writing their own adventure stories.

One afternoon, an elderly woman walked past their fence. She stopped and stared at the treehouse with tears in her eyes.

"Excuse me," Jake called out. "Are you Eleanor Wright?"

The woman smiled. "I haven't been up there in sixty years. I can't believe it's still standing."

Jake and Maria invited Eleanor to see her old treehouse. She climbed the ladder slowly, amazed at how they had transformed it. They spent the afternoon listening to her real adventures—traveling to Egypt, climbing mountains, and sailing across oceans.

"You know," Eleanor said, "those imaginary adventures I wrote as a child inspired me to have real ones when I grew up. Never stop dreaming."`,
      lexileLevel: 650,
      gradeLevel: 3,
      questions: [
        {
          question: 'How long had Jake and Maria lived in their house before finding the treehouse?',
          options: ['One year', 'Three years', 'Five years', 'Ten years'],
          correctAnswer: 'Five years',
          explanation: 'Maria said "We\'ve lived here for five years!"'
        },
        {
          question: 'Why was the treehouse hidden?',
          options: ['It was painted to match the tree', 'It was covered in vines and moss', 'It was too small to see', 'It was behind a fence'],
          correctAnswer: 'It was covered in vines and moss',
          explanation: 'The story says "The treehouse was covered in vines and moss."'
        },
        {
          question: 'What was inside the treehouse?',
          options: ['Old toys', 'Maps, drawings, photographs, and a journal', 'Food and drinks', 'Nothing at all'],
          correctAnswer: 'Maps, drawings, photographs, and a journal',
          explanation: 'The walls had maps, drawings, and photographs, and there was a journal on the table.'
        },
        {
          question: 'Who was Eleanor Wright?',
          options: ['Their neighbor', 'The original owner of the treehouse', 'Their teacher', 'A famous explorer'],
          correctAnswer: 'The original owner of the treehouse',
          explanation: 'Eleanor wrote in the journal in 1962 and later confirmed it was her treehouse.'
        },
        {
          question: 'What imaginary places did Eleanor write about?',
          options: ['Crystal Caves and Floating Islands', 'Magic Mountains and Deep Oceans', 'Dragon Lands and Fairy Forests', 'Space Stations and Moon Bases'],
          correctAnswer: 'Crystal Caves and Floating Islands',
          explanation: 'The story mentions "the Crystal Caves and the Floating Islands."'
        },
        {
          question: 'How did Jake and Maria improve the treehouse?',
          options: ['They tore it down', 'They painted it and added beanbag chairs', 'They locked it up', 'They left it exactly the same'],
          correctAnswer: 'They painted it and added beanbag chairs',
          explanation: 'They "painted the walls bright colors and added beanbag chairs."'
        },
        {
          question: 'How did Eleanor react when she saw the treehouse?',
          options: ['She was angry', 'She was scared', 'She had tears in her eyes', 'She ignored it'],
          correctAnswer: 'She had tears in her eyes',
          explanation: 'The story says Eleanor "stopped and stared at the treehouse with tears in her eyes."'
        },
        {
          question: 'What real adventures did Eleanor have as an adult?',
          options: ['She stayed home', 'She traveled to Egypt, climbed mountains, and sailed oceans', 'She only read books', 'She worked in an office'],
          correctAnswer: 'She traveled to Egypt, climbed mountains, and sailed oceans',
          explanation: 'Eleanor talked about "traveling to Egypt, climbing mountains, and sailing across oceans."'
        },
        {
          question: 'What was Eleanor\'s advice to the children?',
          options: ['Stop playing outside', 'Never stop dreaming', 'Don\'t climb trees', 'Study harder'],
          correctAnswer: 'Never stop dreaming',
          explanation: 'Eleanor said "Never stop dreaming."'
        },
        {
          question: 'What is the main theme of this story?',
          options: ['Treehouses are dangerous', 'Dreams and imagination can inspire real adventures', 'Old things should be thrown away', 'Strangers are always nice'],
          correctAnswer: 'Dreams and imagination can inspire real adventures',
          explanation: 'Eleanor\'s imaginary adventures inspired her real ones, showing imagination leads to reality.'
        }
      ]
    }
  ],
  4: [
    {
      id: 'g4-story-1',
      title: 'The Midnight Inventor',
      content: `Thomas couldn't sleep. His mind was racing with ideas, as it often did at midnight. While his family slumbered peacefully, he crept down to the basement workshop his father had helped him set up.

On his workbench lay the scattered parts of his latest project: a solar-powered flashlight. The concept seemed simple enough—use the sun's energy during the day to power a light at night—but Thomas had failed seventeen times already.

"Failure is just practice for success," his grandmother always said. Thomas picked up his soldering iron and got back to work.

By 2 AM, he had assembled version eighteen. His hands trembled slightly as he flipped the switch. Nothing happened. Thomas sighed and was about to disassemble it when he noticed something—he had connected the battery backward.

After fixing his mistake, Thomas tried again. This time, a bright beam of light shot across the workshop. He had done it! His heart pounded with excitement.

The next morning, Thomas showed his invention to his family at breakfast. His mother hugged him tightly, and his father's eyes glistened with pride.

"You know what made the difference?" his grandmother asked with a knowing smile.

Thomas thought for a moment. "I didn't give up. And I learned from each mistake."

"That's the secret to everything worthwhile," she replied. "Remember this feeling, Thomas. This is what perseverance tastes like."

That summer, Thomas entered his solar flashlight in the county science fair. He didn't win first place—a girl named Maria won with her water purification system—but he received an honorable mention and, more importantly, an invitation to join the Young Inventors Club.

Thomas learned that success isn't just about winning. It's about the journey, the failures, and the persistence to keep going when things get difficult.`,
      lexileLevel: 720,
      gradeLevel: 4,
      questions: [
        {
          question: 'Why couldn\'t Thomas sleep?',
          options: ['He was scared', 'His mind was racing with ideas', 'He was hungry', 'It was too hot'],
          correctAnswer: 'His mind was racing with ideas',
          explanation: 'The story says "His mind was racing with ideas, as it often did at midnight."'
        },
        {
          question: 'How many times had Thomas failed before his success?',
          options: ['Five times', 'Ten times', 'Seventeen times', 'Twenty times'],
          correctAnswer: 'Seventeen times',
          explanation: 'The story states "Thomas had failed seventeen times already."'
        },
        {
          question: 'What was Thomas trying to invent?',
          options: ['A robot', 'A solar-powered flashlight', 'A computer', 'A telephone'],
          correctAnswer: 'A solar-powered flashlight',
          explanation: 'The story describes "a solar-powered flashlight" as his project.'
        },
        {
          question: 'What mistake did Thomas make with version eighteen?',
          options: ['Wrong bulb', 'Battery connected backward', 'Missing switch', 'Broken wire'],
          correctAnswer: 'Battery connected backward',
          explanation: 'The story says "he had connected the battery backward."'
        },
        {
          question: 'What did Thomas\'s grandmother say about failure?',
          options: ['Failure is bad', 'Failure is just practice for success', 'Failure means you should quit', 'Failure is embarrassing'],
          correctAnswer: 'Failure is just practice for success',
          explanation: 'His grandmother said "Failure is just practice for success."'
        },
        {
          question: 'Who won first place at the science fair?',
          options: ['Thomas', 'His grandmother', 'A girl named Maria', 'No one'],
          correctAnswer: 'A girl named Maria',
          explanation: 'The story says "a girl named Maria won with her water purification system."'
        },
        {
          question: 'What did Thomas receive at the science fair?',
          options: ['First place', 'Nothing', 'Honorable mention and an invitation to Young Inventors Club', 'A trophy'],
          correctAnswer: 'Honorable mention and an invitation to Young Inventors Club',
          explanation: 'He received "an honorable mention and...an invitation to join the Young Inventors Club."'
        },
        {
          question: 'What time did Thomas finally get his invention to work?',
          options: ['Midnight', '2 AM', 'Morning', 'Afternoon'],
          correctAnswer: '2 AM',
          explanation: 'The story says "By 2 AM, he had assembled version eighteen."'
        },
        {
          question: 'What is the main lesson of this story?',
          options: ['Sleep is important', 'Perseverance leads to success', 'Science fairs are fun', 'Grandmothers are wise'],
          correctAnswer: 'Perseverance leads to success',
          explanation: 'The story emphasizes that persistence and learning from mistakes leads to success.'
        },
        {
          question: 'Where did Thomas work on his invention?',
          options: ['His bedroom', 'The kitchen', 'The basement workshop', 'The garage'],
          correctAnswer: 'The basement workshop',
          explanation: 'The story mentions "the basement workshop his father had helped him set up."'
        }
      ]
    }
  ],
  5: [
    {
      id: 'g5-story-1',
      title: 'The Last Lighthouse Keeper',
      content: `Margaret Chen was the last lighthouse keeper on Pelican Point. For forty years, she had climbed the 127 spiral steps each evening to light the beacon that guided ships safely through the treacherous waters.

"Automation," the Coast Guard official had explained apologetically. "The new computer system will handle everything. We won't need a human keeper anymore."

Margaret nodded, understanding but feeling a hollow ache in her chest. The lighthouse wasn't just her job—it was her life, her purpose, her connection to the sea and the sailors who depended on her vigilance.

On her final night, a fierce storm rolled in from the Pacific. Margaret watched the automated system flicker to life, its cold electronic eye scanning the darkness. She should have gone home, but something kept her rooted to the lighthouse.

At midnight, the power failed. The backup generator sputtered and died. The automated beacon went dark just as a fishing vessel, the Maria Elena, was navigating the rocky passage.

Without hesitation, Margaret grabbed the emergency oil lamp—the same one her grandfather had used decades ago—and raced up the stairs. Her seventy-two-year-old legs burned with each step, but she didn't slow down.

At the top, she lit the lamp and held it high, waving it in the traditional pattern that sailors had recognized for centuries. Through the howling wind, she heard the Maria Elena's horn—three short blasts, the signal for "message received."

The fishing boat altered course, narrowly avoiding the deadly rocks. By morning, the storm had passed, and the crew of the Maria Elena stood at Margaret's door with tears of gratitude.

The Coast Guard reconsidered their decision. Technology was efficient, they admitted, but it couldn't replace human judgment, dedication, and the kind of courage that comes from truly caring about others.

Margaret continued as lighthouse keeper for five more years, training a young apprentice named Carlos who shared her love of the sea. When she finally retired, the lighthouse remained staffed—a testament to the irreplaceable value of human connection.`,
      lexileLevel: 850,
      gradeLevel: 5,
      questions: [
        {
          question: 'How many years had Margaret been a lighthouse keeper?',
          options: ['Twenty years', 'Thirty years', 'Forty years', 'Fifty years'],
          correctAnswer: 'Forty years',
          explanation: 'The story says "For forty years, she had climbed the 127 spiral steps."'
        },
        {
          question: 'Why was Margaret being replaced?',
          options: ['She was too old', 'Automation was taking over', 'She wanted to retire', 'The lighthouse was closing'],
          correctAnswer: 'Automation was taking over',
          explanation: 'The Coast Guard official explained that "The new computer system will handle everything."'
        },
        {
          question: 'How many spiral steps were in the lighthouse?',
          options: ['100', '127', '150', '200'],
          correctAnswer: '127',
          explanation: 'The story mentions "the 127 spiral steps."'
        },
        {
          question: 'What happened at midnight during the storm?',
          options: ['The ship sank', 'The power failed', 'Margaret fell asleep', 'The storm ended'],
          correctAnswer: 'The power failed',
          explanation: 'The story says "At midnight, the power failed."'
        },
        {
          question: 'What did Margaret use to signal the ship?',
          options: ['A flashlight', 'Her phone', 'An emergency oil lamp', 'A flare gun'],
          correctAnswer: 'An emergency oil lamp',
          explanation: 'She "grabbed the emergency oil lamp—the same one her grandfather had used."'
        },
        {
          question: 'What was the name of the fishing vessel?',
          options: ['Pelican Point', 'Maria Elena', 'Pacific Star', 'Coast Guard'],
          correctAnswer: 'Maria Elena',
          explanation: 'The story identifies the ship as "the Maria Elena."'
        },
        {
          question: 'How old was Margaret?',
          options: ['Sixty-two', 'Seventy-two', 'Eighty-two', 'Fifty-two'],
          correctAnswer: 'Seventy-two',
          explanation: 'The story mentions "Her seventy-two-year-old legs."'
        },
        {
          question: 'What signal did the Maria Elena give to show they received the message?',
          options: ['One long blast', 'Two short blasts', 'Three short blasts', 'Flashing lights'],
          correctAnswer: 'Three short blasts',
          explanation: 'The story says "three short blasts, the signal for message received."'
        },
        {
          question: 'Who did Margaret train as her apprentice?',
          options: ['Maria', 'The Coast Guard official', 'Carlos', 'Her grandfather'],
          correctAnswer: 'Carlos',
          explanation: 'She trained "a young apprentice named Carlos."'
        },
        {
          question: 'What is the main message of this story?',
          options: ['Technology always fails', 'Old people are better workers', 'Human judgment and caring cannot be replaced by machines', 'Storms are dangerous'],
          correctAnswer: 'Human judgment and caring cannot be replaced by machines',
          explanation: 'The story shows that technology couldn\'t replace "human judgment, dedication, and courage."'
        }
      ]
    }
  ],
  6: [
    {
      id: 'g6-story-1',
      title: 'The Algorithm of Kindness',
      content: `Priya Sharma had always been fascinated by patterns. As a sixth-grader at Lincoln Middle School, she spent her lunch periods in the computer lab, teaching herself to code. Her latest project was ambitious: an app that could predict which students might be feeling lonely or left out.

"That's creepy," her friend Marcus said when she explained her idea. "Like surveillance or something."

Priya shook her head. "It's not about watching people. It's about noticing patterns that humans miss. Sometimes people are struggling right in front of us, and we don't see it because we're too busy with our own lives."

She programmed her algorithm to analyze publicly available data—not private messages, but things like how often someone sat alone at lunch, whether they participated in class discussions, or if their social media posts had changed in tone. The app would then suggest simple actions: "Consider inviting someone to sit with you" or "This person might appreciate a friendly conversation."

When Priya presented her prototype to the school counselor, Mrs. Rodriguez, the reaction was mixed. Some teachers worried about privacy. Others thought it was unnecessary—surely they would notice if a student was struggling.

Then something happened that changed everyone's minds. A quiet student named James, who the algorithm had flagged, was discovered crying in the bathroom. He had been dealing with his parents' divorce and felt like no one noticed or cared. The app had detected subtle changes in his behavior that humans had overlooked.

Mrs. Rodriguez worked with Priya to refine the app, adding strict privacy protections and ensuring it was used as a tool to enhance human connection, not replace it. The app would never share data or make accusations—it simply encouraged students to practice small acts of kindness.

By the end of the school year, Lincoln Middle School had the highest student satisfaction scores in the district. But more importantly, students reported feeling more connected to each other.

"Technology isn't good or bad," Priya explained at the district science fair, where she won first place. "It's a tool. And like any tool, its value depends on how we choose to use it."`,
      lexileLevel: 950,
      gradeLevel: 6,
      questions: [
        {
          question: 'What was Priya\'s app designed to do?',
          options: ['Help students cheat on tests', 'Predict which students might be feeling lonely', 'Track students\' locations', 'Grade homework automatically'],
          correctAnswer: 'Predict which students might be feeling lonely',
          explanation: 'Priya created "an app that could predict which students might be feeling lonely or left out."'
        },
        {
          question: 'What was Marcus\'s initial reaction to Priya\'s idea?',
          options: ['He loved it', 'He thought it was creepy', 'He wanted to help', 'He didn\'t understand it'],
          correctAnswer: 'He thought it was creepy',
          explanation: 'Marcus said "That\'s creepy...Like surveillance or something."'
        },
        {
          question: 'What type of data did Priya\'s algorithm analyze?',
          options: ['Private messages', 'Publicly available data like lunch patterns', 'Test scores only', 'Medical records'],
          correctAnswer: 'Publicly available data like lunch patterns',
          explanation: 'It analyzed "publicly available data—not private messages, but things like how often someone sat alone at lunch."'
        },
        {
          question: 'Who was the school counselor?',
          options: ['Mrs. Smith', 'Mrs. Rodriguez', 'Mrs. Johnson', 'Mrs. Chen'],
          correctAnswer: 'Mrs. Rodriguez',
          explanation: 'The story mentions "the school counselor, Mrs. Rodriguez."'
        },
        {
          question: 'What was happening in James\'s life?',
          options: ['He was moving away', 'His parents were getting divorced', 'He was failing classes', 'He was being bullied'],
          correctAnswer: 'His parents were getting divorced',
          explanation: 'James "had been dealing with his parents\' divorce."'
        },
        {
          question: 'What did the app suggest users do?',
          options: ['Report students to teachers', 'Practice small acts of kindness', 'Ignore the notifications', 'Share data with parents'],
          correctAnswer: 'Practice small acts of kindness',
          explanation: 'The app "simply encouraged students to practice small acts of kindness."'
        },
        {
          question: 'Where did Priya spend her lunch periods?',
          options: ['The cafeteria', 'The gym', 'The computer lab', 'The library'],
          correctAnswer: 'The computer lab',
          explanation: 'She "spent her lunch periods in the computer lab, teaching herself to code."'
        },
        {
          question: 'What did Lincoln Middle School achieve by the end of the year?',
          options: ['Highest test scores', 'Highest student satisfaction scores', 'Most sports wins', 'Biggest budget'],
          correctAnswer: 'Highest student satisfaction scores',
          explanation: 'The school "had the highest student satisfaction scores in the district."'
        },
        {
          question: 'What place did Priya win at the district science fair?',
          options: ['Second place', 'Third place', 'First place', 'Honorable mention'],
          correctAnswer: 'First place',
          explanation: 'The story says she "won first place" at the district science fair.'
        },
        {
          question: 'What was Priya\'s conclusion about technology?',
          options: ['Technology is always good', 'Technology is always bad', 'Technology is a tool whose value depends on how we use it', 'Technology should be banned'],
          correctAnswer: 'Technology is a tool whose value depends on how we use it',
          explanation: 'Priya said "Technology isn\'t good or bad...its value depends on how we choose to use it."'
        }
      ]
    }
  ],
  7: [
    {
      id: 'g7-story-1',
      title: 'The Weight of Water',
      content: `Dr. Amara Okonkwo stood at the edge of the dried riverbed, her boots crunching on cracked earth that had once been the flowing Kubani River. As a hydrologist—a scientist who studies water—she had seen droughts before, but nothing like this. The village of Tambura was dying of thirst.

"The elders say the river spirit is angry," her guide, seventeen-year-old Kofi, explained. "They've performed ceremonies, but nothing works."

Amara nodded respectfully. She understood that traditional beliefs and science weren't necessarily in conflict. Both sought to explain the world and find solutions to problems. Her job was to find where those approaches could work together.

Using satellite imagery and ground-penetrating radar, Amara discovered something remarkable: an underground aquifer—a natural reservoir of water trapped between layers of rock—lay just fifty meters below the village. The river hadn't disappeared; it had simply changed course underground, following a geological shift caused by a distant earthquake.

But accessing the aquifer would require drilling equipment that cost more than the village could afford. Amara faced a moral dilemma: she could write her scientific paper, collect her data, and return to her university in Nairobi. Her career wouldn't suffer. But the village would continue to struggle.

Instead, she made a different choice. Amara spent the next three months writing grant proposals, contacting NGOs, and even starting a crowdfunding campaign. She used her scientific credibility to advocate for people who had no voice in international forums.

When the drilling equipment finally arrived, Amara insisted that Kofi and other young villagers learn to operate and maintain it. "I won't always be here," she told them. "This knowledge belongs to you now."

The day water first surged from the new well, the village erupted in celebration. The elders declared that the river spirit had been appeased—and in a way, Amara thought, perhaps it had. Science had found the water, but human compassion and determination had brought it to the surface.

"You could have just written your paper," Kofi said to her later. "Why did you stay?"

Amara smiled. "Because knowledge without action is just information. And information that doesn't help people is worthless."`,
      lexileLevel: 1020,
      gradeLevel: 7,
      questions: [
        {
          question: 'What is a hydrologist?',
          options: ['A doctor who studies health', 'A scientist who studies water', 'An engineer who builds bridges', 'A teacher who studies history'],
          correctAnswer: 'A scientist who studies water',
          explanation: 'The story defines a hydrologist as "a scientist who studies water."'
        },
        {
          question: 'What did the village elders believe caused the drought?',
          options: ['Climate change', 'The river spirit was angry', 'Overuse of water', 'A broken dam'],
          correctAnswer: 'The river spirit was angry',
          explanation: 'Kofi explained that "The elders say the river spirit is angry."'
        },
        {
          question: 'What did Dr. Okonkwo discover underground?',
          options: ['Oil', 'Gold', 'An aquifer', 'An ancient city'],
          correctAnswer: 'An aquifer',
          explanation: 'She discovered "an underground aquifer—a natural reservoir of water."'
        },
        {
          question: 'How deep was the water source below the village?',
          options: ['Ten meters', 'Fifty meters', 'One hundred meters', 'Two hundred meters'],
          correctAnswer: 'Fifty meters',
          explanation: 'The aquifer "lay just fifty meters below the village."'
        },
        {
          question: 'What caused the river to change course?',
          options: ['A dam', 'A geological shift from an earthquake', 'Pollution', 'Climate change'],
          correctAnswer: 'A geological shift from an earthquake',
          explanation: 'The river followed "a geological shift caused by a distant earthquake."'
        },
        {
          question: 'Where was Dr. Okonkwo\'s university located?',
          options: ['Lagos', 'Cairo', 'Nairobi', 'Johannesburg'],
          correctAnswer: 'Nairobi',
          explanation: 'She could "return to her university in Nairobi."'
        },
        {
          question: 'How long did Amara spend writing grant proposals?',
          options: ['One month', 'Three months', 'Six months', 'One year'],
          correctAnswer: 'Three months',
          explanation: 'She "spent the next three months writing grant proposals."'
        },
        {
          question: 'Why did Amara insist that Kofi learn to operate the equipment?',
          options: ['To save money', 'Because she wouldn\'t always be there', 'Because Kofi asked', 'To finish faster'],
          correctAnswer: 'Because she wouldn\'t always be there',
          explanation: 'She said "I won\'t always be here. This knowledge belongs to you now."'
        },
        {
          question: 'How old was Kofi?',
          options: ['Fifteen', 'Sixteen', 'Seventeen', 'Eighteen'],
          correctAnswer: 'Seventeen',
          explanation: 'The story describes "seventeen-year-old Kofi."'
        },
        {
          question: 'What did Amara say about knowledge without action?',
          options: ['It\'s valuable', 'It\'s just information', 'It\'s powerful', 'It\'s scientific'],
          correctAnswer: 'It\'s just information',
          explanation: 'Amara said "knowledge without action is just information."'
        }
      ]
    }
  ],
  8: [
    {
      id: 'g8-story-1',
      title: 'The Geometry of Justice',
      content: `The courtroom fell silent as Maya Chen approached the witness stand. At sixteen, she was the youngest expert witness in the history of Riverside County—and possibly the most unlikely. Her expertise wasn't in forensics or psychology, but in mathematics.

Three months earlier, Marcus Webb had been arrested for a convenience store robbery. The prosecution's case seemed airtight: security camera footage showed a figure in a dark hoodie matching Marcus's height and build. A witness had identified him from a photo lineup. Most damning of all, the stolen cash had been found in a dumpster behind Marcus's apartment building.

But Maya, a junior at Jefferson High School and president of the Math Club, had noticed something everyone else missed.

"The prosecution claims the defendant is five-foot-eleven," Maya began, her voice steady despite her nervousness. "They base this on the security footage, comparing the suspect's height to a shelf in the background that measures six feet."

She clicked to her first slide—a diagram showing the camera angle, the shelf, and the suspect's position. "But this analysis ignores parallax error. The camera was positioned at a fifteen-degree angle, and the suspect was standing four feet closer to it than the shelf. When you correct for these factors using basic trigonometry..."

Maya walked the jury through her calculations, showing how the actual height of the suspect was closer to five-foot-seven—a full four inches shorter than Marcus Webb.

The defense attorney then called Marcus's basketball coach, who confirmed that Marcus had been at practice during the time of the robbery, with twenty teammates as witnesses. The alibi had been dismissed initially because the police believed the height match was too precise to be coincidental.

Maya's mathematical analysis created reasonable doubt. Marcus Webb was acquitted.

Outside the courthouse, Marcus's mother hugged Maya, tears streaming down her face. "You saved my son," she whispered.

Maya shook her head. "Math saved your son. I just showed people how to use it."

Later, a journalist asked Maya why she had gotten involved in the case. "I read about it in the newspaper," she explained. "Something about the math didn't add up—literally. I believe everyone deserves someone who will look closely at the evidence, even when the answer seems obvious."

The case became a landmark example of how mathematical literacy could serve justice. Maya went on to study forensic mathematics in college, eventually becoming a consultant who helped defense attorneys identify flawed analysis in criminal cases.

"Numbers don't lie," she often said in interviews. "But they can be misread. My job is to make sure we're reading them correctly."`,
      lexileLevel: 1100,
      gradeLevel: 8,
      questions: [
        {
          question: 'What made Maya an unusual expert witness?',
          options: ['Her age and expertise in mathematics', 'Her legal training', 'Her experience as a detective', 'Her relationship to the defendant'],
          correctAnswer: 'Her age and expertise in mathematics',
          explanation: 'At sixteen, Maya was "the youngest expert witness" with expertise in mathematics, not typical forensic fields.'
        },
        {
          question: 'What was Marcus Webb accused of?',
          options: ['Assault', 'A convenience store robbery', 'Vandalism', 'Fraud'],
          correctAnswer: 'A convenience store robbery',
          explanation: 'The story states "Marcus Webb had been arrested for a convenience store robbery."'
        },
        {
          question: 'What mathematical concept did Maya use to challenge the evidence?',
          options: ['Algebra', 'Calculus', 'Parallax error and trigonometry', 'Statistics'],
          correctAnswer: 'Parallax error and trigonometry',
          explanation: 'Maya\'s analysis focused on "parallax error" and "basic trigonometry."'
        },
        {
          question: 'What was the prosecution\'s estimated height for the suspect?',
          options: ['Five-foot-seven', 'Five-foot-nine', 'Five-foot-eleven', 'Six feet'],
          correctAnswer: 'Five-foot-eleven',
          explanation: 'The prosecution claimed "the defendant is five-foot-eleven."'
        },
        {
          question: 'What was the actual height of the suspect according to Maya\'s analysis?',
          options: ['Five-foot-seven', 'Five-foot-nine', 'Five-foot-eleven', 'Six feet'],
          correctAnswer: 'Five-foot-seven',
          explanation: 'Maya showed "the actual height of the suspect was closer to five-foot-seven."'
        },
        {
          question: 'Where was Marcus during the robbery?',
          options: ['At home', 'At basketball practice', 'At school', 'At work'],
          correctAnswer: 'At basketball practice',
          explanation: 'The coach confirmed "Marcus had been at practice during the time of the robbery."'
        },
        {
          question: 'What position did Maya hold at her school?',
          options: ['Class president', 'Math Club president', 'Student council treasurer', 'Team captain'],
          correctAnswer: 'Math Club president',
          explanation: 'Maya was "president of the Math Club."'
        },
        {
          question: 'What was the outcome of the trial?',
          options: ['Marcus was convicted', 'Marcus was acquitted', 'The trial was postponed', 'A mistrial was declared'],
          correctAnswer: 'Marcus was acquitted',
          explanation: 'The story says "Marcus Webb was acquitted."'
        },
        {
          question: 'What career did Maya eventually pursue?',
          options: ['Lawyer', 'Police officer', 'Forensic mathematics consultant', 'Judge'],
          correctAnswer: 'Forensic mathematics consultant',
          explanation: 'Maya went on to become "a consultant who helped defense attorneys identify flawed analysis."'
        },
        {
          question: 'What was Maya\'s main point about numbers?',
          options: ['Numbers always lie', 'Numbers don\'t lie but can be misread', 'Numbers are too complex', 'Numbers aren\'t important in court'],
          correctAnswer: 'Numbers don\'t lie but can be misread',
          explanation: 'Maya said "Numbers don\'t lie...But they can be misread."'
        }
      ]
    }
  ]
};

type Phase = 'story' | 'quiz' | 'complete';

interface ReadingLessonPlayerProps {
  childId: string;
  gradeLevel: number;
  lessonId?: string;
  onComplete?: (score: number, correct: number, total: number) => void;
  onBack?: () => void;
}

export default function ReadingLessonPlayer({
  childId,
  gradeLevel,
  lessonId,
  onComplete,
  onBack
}: ReadingLessonPlayerProps) {
  // Theme for ThemedGigi
  const { currentTheme } = useTheme();
  const themeId = currentTheme?.id || 'default';

  // NEW: Fetch stories from database (with fallback to hardcoded)
  const { stories: dbStories, loading: dbLoading, error: dbError } = useReadingLesson(gradeLevel);

  const [phase, setPhase] = useState<Phase>('story');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(gradeLevel <= 5);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Get story - prefer database, fallback to hardcoded
  const getStory = () => {
    if (dbStories && dbStories.length > 0) {
      console.log(`✅ Using DATABASE reading: ${dbStories[0].title} (grade ${gradeLevel})`);
      return dbStories[0];
    }
    const stories = STORIES_BY_GRADE[gradeLevel] || STORIES_BY_GRADE[0];
    console.log(`⚠️ Using HARDCODED reading: ${stories[0].title} (grade ${gradeLevel})`);
    if (dbError) console.log(`   DB Error: ${dbError}`);
    return stories[0];
  };

  const story = dbLoading ? null : getStory();
  const questions = story?.questions || [];

  // Text-to-speech for younger grades
  const speakText = useCallback(async (text: string) => {
    if (!audioEnabled) return;

    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      setIsAudioPlaying(true);

      // Use TTS API (with parent's cloned voice if available)
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, childId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audio.onended = () => {
            setIsAudioPlaying(false);
            setCurrentAudio(null);
          };
          audio.onerror = () => {
            setIsAudioPlaying(false);
            setCurrentAudio(null);
          };
          setCurrentAudio(audio);
          audio.play();
          return;
        }
      }

      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setIsAudioPlaying(false);
    }
  }, [audioEnabled, currentAudio]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
      window.speechSynthesis?.cancel();
    };
  }, [currentAudio]);

  const handleAnswerSelect = (answer: string) => {
    if (isCorrect !== null) return; // Already answered
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setScore(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      setPhase('complete');

      // Calculate coins: 25 base + 15 bonus for perfect (7/10 = passing)
      const finalScore = score + (isCorrect ? 1 : 0);
      const isPassing = finalScore >= 7;
      const isPerfect = finalScore === 10;
      const coinsEarned = isPassing ? (isPerfect ? 40 : 25) : 10;

      if (onComplete) {
        onComplete(coinsEarned, finalScore, questions.length);
      }
    }
  };

  const handleStartQuiz = () => {
    // Stop any audio before starting quiz
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    window.speechSynthesis?.cancel();
    setIsAudioPlaying(false);
    setPhase('quiz');
  };

  // Auto-read story for younger grades
  useEffect(() => {
    if (phase === 'story' && audioEnabled && gradeLevel <= 2) {
      // Small delay before auto-reading
      const timer = setTimeout(() => {
        speakText(story?.content || '');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, audioEnabled, gradeLevel, story?.content, speakText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-4">
            {/* Audio toggle for grades K-5 */}
            {gradeLevel <= 5 && (
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  audioEnabled ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/70'
                }`}
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            )}

            {phase === 'quiz' && (
              <div className="bg-white/10 px-4 py-2 rounded-full">
                <span className="text-white font-bold">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Story Phase */}
          {phase === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                {/* Theme Mascot */}
                <div className="flex justify-center mb-4">
                  <ThemeMascot theme={themeId} size={150} animate />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                    {story?.title}
                  </h1>

                  {audioEnabled && (
                    <button
                      onClick={() => speakText(story?.content || '')}
                      disabled={isAudioPlaying}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isAudioPlaying
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                      {isAudioPlaying ? 'Reading...' : 'Read Aloud'}
                    </button>
                  )}
                </div>

                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <p className="text-white text-lg leading-relaxed whitespace-pre-line">
                    {story?.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-white/60">
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                      Lexile: {story?.lexileLevel}L
                    </span>
                  </div>

                  <Button
                    onClick={handleStartQuiz}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6"
                  >
                    I&apos;m Ready for Questions!
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Quiz Phase */}
          {phase === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Question {currentQuestionIndex + 1}
                  </h2>
                  <p className="text-white text-lg">
                    {questions[currentQuestionIndex].question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isCorrect !== null}
                      className={`p-4 rounded-xl text-left font-medium transition-all ${
                        isCorrect !== null
                          ? option === questions[currentQuestionIndex].correctAnswer
                            ? 'bg-green-500 text-white'
                            : option === selectedAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-white/10 text-white/50'
                          : selectedAnswer === option
                            ? 'bg-blue-500 text-white scale-[1.02]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  ))}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 ${
                      isCorrect
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? 'Correct!' : 'Not quite right'}
                        </p>
                        <p className="text-white/80 mt-1">
                          {questions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit / Next Button */}
                {isCorrect === null ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-4"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        See Results
                        <Trophy className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-white/60 mb-2">
                    <span>Progress</span>
                    <span>{score} correct so far</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <div className="text-8xl mb-6">
                    {score >= 7 ? '🏆' : score >= 5 ? '⭐' : '📚'}
                  </div>
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  {score >= 7 ? 'Great Reading!' : score >= 5 ? 'Good Effort!' : 'Keep Practicing!'}
                </h2>

                <div className="bg-white/10 rounded-xl p-6 mb-6 inline-block">
                  <p className="text-white/60 mb-2">Your Score</p>
                  <p className="text-4xl font-bold text-white">{score} / {questions.length}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 ${
                          score >= star * 3 + 1
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className={`rounded-xl p-4 mb-6 ${
                  score >= 7 ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  <p className={`text-2xl font-bold ${
                    score >= 7 ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {score === 10 ? '🪙 +40 Coins (Perfect!)' :
                     score >= 7 ? '🪙 +25 Coins (Passed!)' :
                     '🪙 +10 Coins (Keep trying!)'}
                  </p>
                </div>

                {score < 7 && (
                  <p className="text-white/70 mb-6">
                    You need 7 correct answers to pass. Try reading the story again!
                  </p>
                )}

                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-8"
                >
                  Back to Lessons
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CELEBRATION ANIMATION */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            >
              <Celebration type="confetti" size={400} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
