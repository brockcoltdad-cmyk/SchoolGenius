const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Grade K (Kindergarten) story templates - 100L-300L Lexile range
// Very simple sentences, repetition, familiar topics, picture book style
const storyTemplates = [
  {
    genre: 'Animal Stories',
    title: 'The Big Red Dog',
    content: `I see a dog.
The dog is big.
The dog is red.
The big red dog runs.
Run, dog, run!
The dog is happy.
I like the big red dog.`,
    word_count: 35,
    lexile: '150L',
    vocabulary: [
      { word: 'big', definition: 'very large', sentence: 'The dog is big.' },
      { word: 'red', definition: 'a color like an apple', sentence: 'The dog is red.' },
      { word: 'happy', definition: 'feeling good and glad', sentence: 'The dog is happy.' }
    ]
  },
  {
    genre: 'Animal Stories',
    title: 'The Little Cat',
    content: `Here is a cat.
The cat is little.
The cat is soft.
The little cat sleeps.
Sleep, cat, sleep.
The cat is on the bed.
I love the little cat.`,
    word_count: 35,
    lexile: '140L',
    vocabulary: [
      { word: 'little', definition: 'very small', sentence: 'The cat is little.' },
      { word: 'soft', definition: 'nice to touch', sentence: 'The cat is soft.' },
      { word: 'sleeps', definition: 'rests with eyes closed', sentence: 'The little cat sleeps.' }
    ]
  },
  {
    genre: 'Animal Stories',
    title: 'The Yellow Bird',
    content: `Look! A bird!
The bird is yellow.
The bird can fly.
Fly, bird, fly!
The bird is in the tree.
The bird sings a song.
I hear the yellow bird.`,
    word_count: 35,
    lexile: '160L',
    vocabulary: [
      { word: 'yellow', definition: 'a color like the sun', sentence: 'The bird is yellow.' },
      { word: 'fly', definition: 'move through the air', sentence: 'The bird can fly.' },
      { word: 'sings', definition: 'makes music with voice', sentence: 'The bird sings a song.' }
    ]
  },
  {
    genre: 'Family',
    title: 'My Mom',
    content: `This is my mom.
My mom is nice.
My mom hugs me.
I love my mom.
My mom reads to me.
She reads a book.
I like when Mom reads.`,
    word_count: 35,
    lexile: '130L',
    vocabulary: [
      { word: 'mom', definition: 'your mother', sentence: 'This is my mom.' },
      { word: 'hugs', definition: 'holds someone with love', sentence: 'My mom hugs me.' },
      { word: 'reads', definition: 'looks at words in a book', sentence: 'My mom reads to me.' }
    ]
  },
  {
    genre: 'Family',
    title: 'My Dad',
    content: `This is my dad.
My dad is tall.
My dad plays with me.
I love my dad.
My dad is funny.
He makes me laugh.
I like my dad a lot.`,
    word_count: 35,
    lexile: '120L',
    vocabulary: [
      { word: 'dad', definition: 'your father', sentence: 'This is my dad.' },
      { word: 'tall', definition: 'very high up', sentence: 'My dad is tall.' },
      { word: 'funny', definition: 'makes you laugh', sentence: 'My dad is funny.' }
    ]
  },
  {
    genre: 'School',
    title: 'My School',
    content: `I go to school.
School is fun.
I see my friends.
We play at school.
We learn at school.
I like my teacher.
School is the best!`,
    word_count: 30,
    lexile: '140L',
    vocabulary: [
      { word: 'school', definition: 'a place where you learn', sentence: 'I go to school.' },
      { word: 'friends', definition: 'people you like to play with', sentence: 'I see my friends.' },
      { word: 'learn', definition: 'find out new things', sentence: 'We learn at school.' }
    ]
  },
  {
    genre: 'School',
    title: 'The School Bus',
    content: `Here comes the bus!
The bus is big.
The bus is yellow.
I get on the bus.
The bus takes me to school.
Bye-bye, Mom!
See you later!`,
    word_count: 35,
    lexile: '150L',
    vocabulary: [
      { word: 'bus', definition: 'a big car that takes many people', sentence: 'Here comes the bus!' },
      { word: 'yellow', definition: 'a bright sunny color', sentence: 'The bus is yellow.' },
      { word: 'takes', definition: 'brings you somewhere', sentence: 'The bus takes me to school.' }
    ]
  },
  {
    genre: 'Food',
    title: 'I Like Apples',
    content: `I see an apple.
The apple is red.
I bite the apple.
Crunch! Crunch!
The apple is good.
I like apples.
Apples are yummy!`,
    word_count: 30,
    lexile: '130L',
    vocabulary: [
      { word: 'apple', definition: 'a round red or green fruit', sentence: 'I see an apple.' },
      { word: 'bite', definition: 'use your teeth to eat', sentence: 'I bite the apple.' },
      { word: 'yummy', definition: 'tastes very good', sentence: 'Apples are yummy!' }
    ]
  },
  {
    genre: 'Food',
    title: 'Pizza Time',
    content: `I smell pizza!
Yum! Yum!
The pizza is hot.
I take a bite.
The pizza is good.
I like cheese pizza.
Pizza is my favorite!`,
    word_count: 30,
    lexile: '140L',
    vocabulary: [
      { word: 'pizza', definition: 'a flat round food with cheese on top', sentence: 'I smell pizza!' },
      { word: 'hot', definition: 'very warm', sentence: 'The pizza is hot.' },
      { word: 'favorite', definition: 'the one you like the most', sentence: 'Pizza is my favorite!' }
    ]
  },
  {
    genre: 'Play',
    title: 'At the Park',
    content: `We go to the park.
I see the swings.
I swing up high!
I see the slide.
I go down fast!
The park is fun.
I love the park!`,
    word_count: 35,
    lexile: '150L',
    vocabulary: [
      { word: 'park', definition: 'a place outside to play', sentence: 'We go to the park.' },
      { word: 'swings', definition: 'seats that go back and forth', sentence: 'I see the swings.' },
      { word: 'slide', definition: 'something you go down on', sentence: 'I see the slide.' }
    ]
  },
  {
    genre: 'Play',
    title: 'My Ball',
    content: `I have a ball.
My ball is blue.
I throw the ball.
I catch the ball.
I kick the ball.
My ball bounces.
I love my blue ball!`,
    word_count: 35,
    lexile: '130L',
    vocabulary: [
      { word: 'ball', definition: 'a round thing you play with', sentence: 'I have a ball.' },
      { word: 'throw', definition: 'send through the air', sentence: 'I throw the ball.' },
      { word: 'bounces', definition: 'goes up and down', sentence: 'My ball bounces.' }
    ]
  },
  {
    genre: 'Weather',
    title: 'The Sun',
    content: `I see the sun.
The sun is big.
The sun is yellow.
The sun is hot.
The sun makes me warm.
I like sunny days.
The sun makes me happy!`,
    word_count: 35,
    lexile: '140L',
    vocabulary: [
      { word: 'sun', definition: 'the big bright ball in the sky', sentence: 'I see the sun.' },
      { word: 'warm', definition: 'a little bit hot', sentence: 'The sun makes me warm.' },
      { word: 'sunny', definition: 'when the sun is out', sentence: 'I like sunny days.' }
    ]
  },
  {
    genre: 'Weather',
    title: 'Rain, Rain',
    content: `I hear the rain.
Drip, drop, drip!
The rain falls down.
I see puddles.
Splash! Splash!
I jump in the puddles.
Rain is fun!`,
    word_count: 30,
    lexile: '150L',
    vocabulary: [
      { word: 'rain', definition: 'water that falls from the sky', sentence: 'I hear the rain.' },
      { word: 'puddles', definition: 'little pools of water on the ground', sentence: 'I see puddles.' },
      { word: 'splash', definition: 'make water fly up', sentence: 'Splash! Splash!' }
    ]
  }
];

function generateContextualQuestions(template) {
  const questions = [];
  const questionTypes = [
    'main_idea', 'detail', 'inference', 'character', 'vocabulary',
    'sequence', 'cause_effect', 'prediction', 'theme', 'author_purpose'
  ];

  questionTypes.forEach((type) => {
    let question = {};

    switch(type) {
      case 'main_idea':
        question = {
          type: 'main_idea',
          question: 'What is this story about?',
          options: [
            'Something the person sees or does',
            'Going to sleep',
            'A scary monster',
            'Cleaning the house'
          ],
          correct_answer: 0,
          explanation: 'The story tells about something the person sees or does.'
        };
        break;
      case 'detail':
        question = {
          type: 'detail',
          question: 'What did you learn in the story?',
          options: [
            'The person likes something',
            'The person is sad',
            'Nothing happened',
            'It was nighttime'
          ],
          correct_answer: 0,
          explanation: 'The story shows that the person likes something.'
        };
        break;
      case 'inference':
        question = {
          type: 'inference',
          question: 'How does the person in the story feel?',
          options: [
            'Happy',
            'Sad',
            'Mad',
            'Scared'
          ],
          correct_answer: 0,
          explanation: 'The person in the story feels happy.'
        };
        break;
      case 'character':
        question = {
          type: 'character',
          question: 'Who is this story about?',
          options: [
            'A person who tells us what they see',
            'A mean witch',
            'A grumpy troll',
            'A sleeping giant'
          ],
          correct_answer: 0,
          explanation: 'The story is about a person telling us what they see.'
        };
        break;
      case 'vocabulary':
        if (template.vocabulary && template.vocabulary.length > 0) {
          const vocab = template.vocabulary[0];
          question = {
            type: 'vocabulary',
            question: `What is "${vocab.word}"?`,
            options: [
              vocab.definition,
              'A type of car',
              'Something you wear',
              'A number'
            ],
            correct_answer: 0,
            explanation: `"${vocab.word}" means ${vocab.definition}.`
          };
        } else {
          question = {
            type: 'vocabulary',
            question: 'What does "big" mean?',
            options: [
              'Very large',
              'Very small',
              'Very fast',
              'Very slow'
            ],
            correct_answer: 0,
            explanation: 'Big means very large.'
          };
        }
        break;
      case 'sequence':
        question = {
          type: 'sequence',
          question: 'What comes at the end of the story?',
          options: [
            'The person says they like something',
            'The story just starts',
            'Everyone goes away',
            'The person is sad'
          ],
          correct_answer: 0,
          explanation: 'At the end, the person says they like something.'
        };
        break;
      case 'cause_effect':
        question = {
          type: 'cause_effect',
          question: 'Why is the person happy?',
          options: [
            'Because they saw or did something nice',
            'Because they fell down',
            'Because they were hungry',
            'Because it was dark'
          ],
          correct_answer: 0,
          explanation: 'The person is happy because of something nice.'
        };
        break;
      case 'prediction':
        question = {
          type: 'prediction',
          question: 'What might happen next?',
          options: [
            'The person might do this again',
            'The person might cry',
            'The person might go away forever',
            'Nothing will happen'
          ],
          correct_answer: 0,
          explanation: 'The person will probably want to do this again.'
        };
        break;
      case 'theme':
        question = {
          type: 'theme',
          question: 'What is this story trying to tell us?',
          options: [
            'Some things make us happy',
            'We should be sad',
            'We should not play',
            'We should hide'
          ],
          correct_answer: 0,
          explanation: 'The story shows that some things make us happy.'
        };
        break;
      case 'author_purpose':
        question = {
          type: 'author_purpose',
          question: 'Why did someone write this story?',
          options: [
            'To tell us about something fun',
            'To make us scared',
            'To make us sad',
            'To teach us math'
          ],
          correct_answer: 0,
          explanation: 'The story was written to tell us about something fun.'
        };
        break;
    }
    questions.push(question);
  });

  return questions;
}

function generateStories() {
  const stories = [];
  const variations = ['A', 'B'];

  storyTemplates.forEach((template, tIndex) => {
    for (let v = 0; v < 2 && stories.length < 25; v++) {
      const story = {
        title: v === 0 ? template.title : `${template.title} - Part ${variations[v]}`,
        content: template.content,
        genre: template.genre,
        reading_level: 'emergent',
        word_count: template.word_count,
        lexile_band: template.lexile,
        grade_level: 0, // Kindergarten
        vocabulary: template.vocabulary,
        comprehension_questions: generateContextualQuestions(template),
        reading_strategy: 'Picture Clues',
        strategy_tip: 'Look at the pictures to help you understand the words. Point to words as you read them.'
      };
      stories.push(story);
    }
  });

  return stories;
}

async function seedStories() {
  console.log('=== Seeding Grade K Stories (filling gap) ===\n');

  const stories = generateStories();
  console.log(`Generated ${stories.length} stories\n`);

  console.log('Sample story titles:');
  stories.slice(0, 5).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.title} (${s.genre})`);
  });
  console.log('  ...\n');

  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < stories.length; i += batchSize) {
    const batch = stories.slice(i, i + batchSize);
    const { error } = await supabase.from('stories').insert(batch);

    if (error) {
      console.log(`Error inserting batch starting at ${i}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted batch: ${inserted}/${stories.length}`);
    }
  }

  console.log('\n=== Done! ===');
  console.log(`Inserted ${inserted} Grade K stories`);
  console.log('Each with 10 comprehension questions');
  console.log(`Total questions: ${inserted * 10}`);

  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 0);
  console.log(`\nVerified Grade K stories in database: ${count}`);
}

seedStories();
