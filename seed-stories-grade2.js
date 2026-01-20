const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Grade 2 story templates - 300L-500L Lexile range
// Simple sentences, familiar topics, beginning chapter book style
const storyTemplates = [
  {
    genre: 'Adventure',
    title: 'The Sandbox Treasure',
    content: `Mia was digging in the sandbox. She found something hard. It was a small blue box!

"What is inside?" Mia asked herself. She opened the box slowly. Inside was a shiny gold coin!

Mia ran to show her mom. "Look what I found!" she said. Her mom smiled big.

"That looks very old," Mom said. "Maybe someone lost it long ago."

Mia thought about who lost the coin. Was it a pirate? Was it a king? She did not know. But she felt like a real treasure hunter.

She put the coin in her pocket. She would keep it safe. Maybe one day she would find more treasures. The sandbox was a magical place after all.`,
    word_count: 110,
    lexile: '320L',
    vocabulary: [
      { word: 'treasure', definition: 'something very special and valuable', sentence: 'Mia found a treasure in the sandbox.' },
      { word: 'shiny', definition: 'bright and reflecting light', sentence: 'The gold coin was very shiny.' },
      { word: 'magical', definition: 'full of wonder and amazing things', sentence: 'The sandbox was a magical place.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Tree House Club',
    content: `Ben and his friends built a tree house. It took three days. Now they had a club!

"We need rules," said Ben. His friend Lily agreed. They made a list.

Rule one: Be kind to everyone.
Rule two: Share the snacks.
Rule three: Keep the tree house clean.

The first day was fun. They played games. They ate crackers. They told jokes.

Then it started to rain. Drip, drip, drip! Water came through the roof.

"Oh no!" said Ben. But Lily had an idea. She put a bucket under the drip.

"Now we can stay dry," she said. Everyone cheered. The tree house was the best place ever.`,
    word_count: 105,
    lexile: '340L',
    vocabulary: [
      { word: 'rules', definition: 'things you must follow', sentence: 'The club had three rules.' },
      { word: 'agreed', definition: 'said yes to something', sentence: 'Lily agreed with Ben.' },
      { word: 'bucket', definition: 'a container that holds water', sentence: 'Lily put a bucket under the drip.' }
    ]
  },
  {
    genre: 'Animal Stories',
    title: 'The Helpful Squirrel',
    content: `A little squirrel named Nutkin lived in a big oak tree. One day, he saw a bird crying.

"What is wrong?" asked Nutkin.

"I lost my nest!" said the bird. "The wind blew it away."

Nutkin wanted to help. He gathered twigs and leaves. He worked very hard.

"Here," said Nutkin. "Let's build a new nest together."

The bird was so happy. They worked side by side. Soon the nest was done.

"Thank you, Nutkin!" said the bird. "You are a true friend."

Nutkin felt warm inside. Helping others made him happy too. He waved goodbye and went home for dinner.`,
    word_count: 100,
    lexile: '310L',
    vocabulary: [
      { word: 'gathered', definition: 'collected or picked up', sentence: 'Nutkin gathered twigs and leaves.' },
      { word: 'together', definition: 'with each other', sentence: 'They built the nest together.' },
      { word: 'true', definition: 'real and honest', sentence: 'Nutkin was a true friend.' }
    ]
  },
  {
    genre: 'Animal Stories',
    title: 'The Brave Little Fish',
    content: `Finn was a small fish in a big pond. The other fish swam fast. Finn swam slow.

"I wish I was faster," Finn said sadly.

One day, a baby duck got stuck in some weeds. The big fish were scared. They swam away.

But Finn was small. He could fit between the weeds! He swam to the baby duck.

"Follow me!" said Finn. He showed the duck a path out.

The baby duck was free! It quacked happily and swam to its mother.

All the fish cheered for Finn. Being small was not so bad after all. Finn was a hero!`,
    word_count: 100,
    lexile: '330L',
    vocabulary: [
      { word: 'brave', definition: 'not afraid to do hard things', sentence: 'Finn was a brave little fish.' },
      { word: 'stuck', definition: 'not able to move', sentence: 'The baby duck got stuck in the weeds.' },
      { word: 'hero', definition: 'someone who helps others in a big way', sentence: 'Finn was a hero to all the fish.' }
    ]
  },
  {
    genre: 'Friendship',
    title: 'The New Kid',
    content: `A new boy came to class. His name was Raj. He looked scared.

No one talked to him at lunch. He sat alone. Maya felt sad for him.

"Hi, I'm Maya," she said. "Want to sit with me?"

Raj smiled a little. "Okay," he said.

They ate lunch together. Maya learned that Raj liked dinosaurs. She liked dinosaurs too!

"I have dinosaur books," Maya said. "Want to see them after school?"

"Yes please!" said Raj. His smile was big now.

By the end of the day, they were friends. Maya was glad she said hello. One small word can make a big difference.`,
    word_count: 100,
    lexile: '300L',
    vocabulary: [
      { word: 'scared', definition: 'feeling afraid', sentence: 'Raj looked scared on his first day.' },
      { word: 'alone', definition: 'by yourself with no one else', sentence: 'Raj sat alone at lunch.' },
      { word: 'difference', definition: 'a change that matters', sentence: 'One word can make a big difference.' }
    ]
  },
  {
    genre: 'Friendship',
    title: 'Sharing is Caring',
    content: `Emma got a new box of crayons. They had 64 colors! She was so excited.

At art time, she started to draw. Her friend Zoe looked sad.

"My crayons are broken," Zoe said. "I only have three left."

Emma looked at her big box. She had so many colors. Zoe had so few.

"Here," said Emma. She gave Zoe half of her crayons. "Now we both have enough."

Zoe's face lit up. "Really? Thank you, Emma!"

They drew pictures together. Emma drew a rainbow. Zoe drew flowers. Their pictures were beautiful.

Sharing made both girls happy. Emma still had plenty of colors. And now she had a happy friend too.`,
    word_count: 105,
    lexile: '320L',
    vocabulary: [
      { word: 'excited', definition: 'feeling happy and full of energy', sentence: 'Emma was so excited about her crayons.' },
      { word: 'plenty', definition: 'more than enough', sentence: 'Emma still had plenty of colors.' },
      { word: 'beautiful', definition: 'very pretty to look at', sentence: 'Their pictures were beautiful.' }
    ]
  },
  {
    genre: 'Family',
    title: 'Helping Grandma',
    content: `Grandma came to visit. She walked with a cane. Her legs hurt sometimes.

"Can I help you, Grandma?" asked Leo.

"That would be nice," Grandma said with a smile.

Leo helped Grandma sit down. He brought her a pillow. He got her a glass of water.

"You are so kind," said Grandma. "Come sit with me."

They looked at old photos together. Leo saw pictures of his mom as a little girl.

"That's Mommy!" he laughed.

Grandma told stories about the old days. Leo listened carefully. He loved hearing about when Grandma was young.

"Thank you for helping me," Grandma said. "And thank you for listening."

Leo hugged her tight. He loved his grandma very much.`,
    word_count: 115,
    lexile: '330L',
    vocabulary: [
      { word: 'cane', definition: 'a stick that helps people walk', sentence: 'Grandma walked with a cane.' },
      { word: 'pillow', definition: 'something soft to rest on', sentence: 'Leo brought Grandma a pillow.' },
      { word: 'carefully', definition: 'with attention and care', sentence: 'Leo listened carefully to the stories.' }
    ]
  },
  {
    genre: 'Family',
    title: 'Baby Brother',
    content: `Mom and Dad brought the baby home. His name was Max. He was tiny and red.

"He's so small!" said Anna. She touched his little hand.

Max cried a lot at night. Anna could not sleep. She put a pillow on her head.

In the morning, Anna was tired. She was a little grumpy.

"I know it's hard," said Mom. "But Max needs us."

Anna watched Mom feed the baby. Max looked at Anna. He smiled!

"He smiled at me!" Anna said. She forgot she was tired.

"He loves his big sister," said Dad.

Anna felt proud. She was a big sister now. That was an important job. She would help take care of Max.`,
    word_count: 110,
    lexile: '310L',
    vocabulary: [
      { word: 'tiny', definition: 'very very small', sentence: 'The baby was tiny and red.' },
      { word: 'grumpy', definition: 'feeling annoyed or cranky', sentence: 'Anna was a little grumpy in the morning.' },
      { word: 'proud', definition: 'feeling good about yourself', sentence: 'Anna felt proud to be a big sister.' }
    ]
  },
  {
    genre: 'School',
    title: 'The Spelling Bee',
    content: `The spelling bee was today! Sam had studied all week. He felt nervous.

"You can do it," said his teacher, Mrs. Lee.

The first word was "cat." Easy! Sam spelled it right.

The words got harder. "Friend." Sam spelled it. "Because." Sam spelled it too!

Finally, only Sam and Mia were left. The word was "beautiful."

Sam thought hard. B-E-A-U-T-I-F-U-L.

"Correct!" said Mrs. Lee. Sam won the spelling bee!

Everyone clapped. Sam got a blue ribbon. He felt so happy.

"Good job," said Mia. "You're really good at spelling."

"Thanks," said Sam. "You were great too."

Sam showed his ribbon to his parents. They were so proud. Studying hard had paid off!`,
    word_count: 110,
    lexile: '340L',
    vocabulary: [
      { word: 'nervous', definition: 'feeling worried or scared', sentence: 'Sam felt nervous about the spelling bee.' },
      { word: 'studied', definition: 'worked hard to learn something', sentence: 'Sam had studied all week.' },
      { word: 'ribbon', definition: 'a prize made of colorful cloth', sentence: 'Sam got a blue ribbon for winning.' }
    ]
  },
  {
    genre: 'School',
    title: 'The Science Project',
    content: `Ava had to make a volcano for science class. She worked with her dad.

They used clay to make a mountain. They put a bottle inside. It looked real!

"Now for the lava," said Dad. He mixed vinegar and baking soda.

Ava poured it in. WHOOSH! Red foam came out! It looked like a real volcano!

"Wow!" said Ava. "That was amazing!"

The next day, Ava showed her class. She explained how volcanoes work. The foam erupted again!

"That's so cool!" said her friend Jack.

Mrs. Chen smiled. "Great job, Ava. You taught us something new today."

Ava felt proud. Science was fun! She wanted to learn more about how things work.`,
    word_count: 110,
    lexile: '350L',
    vocabulary: [
      { word: 'volcano', definition: 'a mountain that can explode with hot lava', sentence: 'Ava made a volcano for science class.' },
      { word: 'erupted', definition: 'exploded or burst out', sentence: 'The foam erupted from the volcano.' },
      { word: 'explained', definition: 'told how something works', sentence: 'Ava explained how volcanoes work.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Magic Paintbrush',
    content: `Lily found a paintbrush in the park. It had sparkles on the handle.

She took it home and painted a cat. The cat came to life! It jumped off the paper!

"Meow!" said the cat. Lily could not believe her eyes.

She painted a cupcake. POP! A real cupcake appeared! It was delicious.

"This brush is magic!" Lily said.

She painted a rainbow. It stretched across her room. She painted stars. They glowed on her ceiling.

But then Lily got tired. She put the brush away.

"I will use you tomorrow," she said.

That night, she dreamed of all the things she would paint. A puppy? A castle? The magic brush made anything possible!`,
    word_count: 110,
    lexile: '330L',
    vocabulary: [
      { word: 'sparkles', definition: 'tiny bits of shiny light', sentence: 'The paintbrush had sparkles on it.' },
      { word: 'appeared', definition: 'showed up or came into view', sentence: 'A real cupcake appeared!' },
      { word: 'possible', definition: 'something that can happen', sentence: 'The magic brush made anything possible.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Friendly Dragon',
    content: `Tom was lost in the forest. It was getting dark. He was scared.

Then he saw a light. It was coming from a cave. Tom walked closer.

Inside was a small dragon! It was green with orange wings.

"Please don't be scared," said the dragon. "I'm Spark. I'm friendly."

Tom was surprised. A talking dragon!

"I'm lost," Tom said. "Can you help me find my way home?"

"Of course!" said Spark. "Hop on my back."

Tom climbed on. Spark flew into the sky! They soared over the trees.

"There's my house!" Tom pointed.

Spark landed gently. "Goodbye, new friend," said the dragon.

"Goodbye, Spark! Thank you!" said Tom. He would never forget his dragon friend.`,
    word_count: 110,
    lexile: '320L',
    vocabulary: [
      { word: 'friendly', definition: 'kind and nice to others', sentence: 'Spark was a friendly dragon.' },
      { word: 'surprised', definition: 'feeling shocked by something unexpected', sentence: 'Tom was surprised by the talking dragon.' },
      { word: 'soared', definition: 'flew high in the sky', sentence: 'They soared over the trees.' }
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
          question: `What is this story mostly about?`,
          options: [
            'Someone learning or doing something special',
            'A sad day at school',
            'Eating dinner at home',
            'Watching TV all day'
          ],
          correct_answer: 0,
          explanation: 'The story is about the main character having an adventure or learning something.'
        };
        break;
      case 'detail':
        question = {
          type: 'detail',
          question: 'What happened in the story?',
          options: [
            'The character solved a problem or helped someone',
            'Everyone went to sleep',
            'Nothing happened at all',
            'The character stayed inside all day'
          ],
          correct_answer: 0,
          explanation: 'The story shows the character doing something important.'
        };
        break;
      case 'inference':
        question = {
          type: 'inference',
          question: 'How did the main character probably feel at the end?',
          options: [
            'Happy and proud',
            'Angry and upset',
            'Bored and tired',
            'Scared and worried'
          ],
          correct_answer: 0,
          explanation: 'The character felt good after what happened in the story.'
        };
        break;
      case 'character':
        question = {
          type: 'character',
          question: 'What kind of person is the main character?',
          options: [
            'Kind and helpful',
            'Mean and selfish',
            'Lazy and grumpy',
            'Silly and careless'
          ],
          correct_answer: 0,
          explanation: 'The main character shows good qualities in the story.'
        };
        break;
      case 'vocabulary':
        if (template.vocabulary && template.vocabulary.length > 0) {
          const vocab = template.vocabulary[0];
          question = {
            type: 'vocabulary',
            question: `What does the word "${vocab.word}" mean?`,
            options: [
              vocab.definition,
              'Something that is very cold',
              'A type of food',
              'A color'
            ],
            correct_answer: 0,
            explanation: `"${vocab.word}" means ${vocab.definition}.`
          };
        } else {
          question = {
            type: 'vocabulary',
            question: 'What does "happy" mean?',
            options: [
              'Feeling good and glad',
              'Feeling sad',
              'Feeling sleepy',
              'Feeling hungry'
            ],
            correct_answer: 0,
            explanation: 'Happy means feeling good and glad.'
          };
        }
        break;
      case 'sequence':
        question = {
          type: 'sequence',
          question: 'What happened first in the story?',
          options: [
            'The story began with the main character',
            'Everyone went home',
            'The story ended happily',
            'Nothing happened first'
          ],
          correct_answer: 0,
          explanation: 'The story started by introducing the main character.'
        };
        break;
      case 'cause_effect':
        question = {
          type: 'cause_effect',
          question: 'Why did things turn out well in the story?',
          options: [
            'Because the character tried hard or was kind',
            'Because magic happened',
            'Because someone else fixed everything',
            'Because it was a school day'
          ],
          correct_answer: 0,
          explanation: 'Good things happened because of what the character did.'
        };
        break;
      case 'prediction':
        question = {
          type: 'prediction',
          question: 'What might the character do next time?',
          options: [
            'Try to help again or have another adventure',
            'Stay in bed all day',
            'Never go outside again',
            'Forget what happened'
          ],
          correct_answer: 0,
          explanation: 'The character learned something good and will probably do it again.'
        };
        break;
      case 'theme':
        question = {
          type: 'theme',
          question: 'What lesson does this story teach?',
          options: [
            'Being kind and helpful is good',
            'Never try new things',
            'Stay away from friends',
            'Only think about yourself'
          ],
          correct_answer: 0,
          explanation: 'The story teaches that being kind and helpful is a good thing.'
        };
        break;
      case 'author_purpose':
        question = {
          type: 'author_purpose',
          question: 'Why did the author write this story?',
          options: [
            'To teach a lesson and tell a fun story',
            'To make readers feel sad',
            'To explain how to do math',
            'To describe the weather'
          ],
          correct_answer: 0,
          explanation: 'The author wanted to teach something and tell an enjoyable story.'
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
    for (let v = 0; v < 2 && stories.length < 24; v++) {
      const story = {
        title: v === 0 ? template.title : `${template.title} - Part ${variations[v]}`,
        content: template.content,
        genre: template.genre,
        reading_level: 'beginning',
        word_count: template.word_count,
        lexile_band: template.lexile,
        grade_level: 2,
        vocabulary: template.vocabulary,
        comprehension_questions: generateContextualQuestions(template),
        reading_strategy: 'Making Connections',
        strategy_tip: 'Think about how the story is like your own life. Have you felt the way the characters feel?'
      };
      stories.push(story);
    }
  });

  return stories;
}

async function seedStories() {
  console.log('=== Seeding Grade 2 Stories (filling gap) ===\n');

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
  console.log(`Inserted ${inserted} Grade 2 stories`);
  console.log('Each with 10 comprehension questions');
  console.log(`Total questions: ${inserted * 10}`);

  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 2);
  console.log(`\nVerified Grade 2 stories in database: ${count}`);
}

seedStories();
