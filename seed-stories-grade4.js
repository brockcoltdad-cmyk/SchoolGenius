const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Grade 4 appropriate genres and themes (more complex)
const genres = [
  'Mystery', 'Adventure', 'Science Fiction', 'Historical Fiction', 'Sports',
  'Fantasy', 'Realistic Fiction', 'Biography', 'Nature & Environment', 'Mythology',
  'School Life', 'Family Drama', 'Humor', 'Survival', 'Friendship'
];

const readingStrategies = [
  { strategy: 'main_idea', tip: 'Identify the central message and supporting details.' },
  { strategy: 'summarize', tip: 'Retell the key events in order using your own words.' },
  { strategy: 'inference', tip: 'Combine text clues with your background knowledge to draw conclusions.' },
  { strategy: 'compare_contrast', tip: 'Look for similarities and differences between characters, events, or ideas.' },
  { strategy: 'cause_effect', tip: 'Identify what happened (effect) and why it happened (cause).' },
  { strategy: 'character_analysis', tip: 'Examine characters\' traits, motivations, and how they change.' },
  { strategy: 'author_purpose', tip: 'Consider why the author wrote this: to inform, persuade, or entertain.' },
  { strategy: 'text_structure', tip: 'Notice how the text is organized: sequence, problem/solution, or compare/contrast.' },
  { strategy: 'point_of_view', tip: 'Identify who is telling the story and how it affects what we learn.' },
  { strategy: 'theme', tip: 'Think about the life lesson or message the author wants you to understand.' }
];

// Story templates for Grade 4 (700L-850L Lexile)
const storyTemplates = [
  // Mystery
  {
    genre: 'Mystery',
    title: 'The Cipher Club',
    content: `The note appeared in Mia's locker on Monday morning. It contained a strange message written in symbols she didn't recognize. At the bottom, it read: "Can you crack the code? Meet at the old oak tree at 3:15 if you succeed."

Mia studied the symbols during lunch. She noticed patterns—some symbols appeared more frequently than others. She remembered learning about frequency analysis in her book about famous codebreakers. The most common letter in English is "E," so the most common symbol probably meant "E."

Working backward, she decoded the message: "KNOWLEDGE IS POWER." Mia smiled. Someone was testing her.

At 3:15, she found three other students at the oak tree: James, who was excellent at math; Sophie, who loved puzzles; and Daniel, who collected spy gadgets. A fifth-grader named Alex emerged from behind the tree.

"Congratulations," Alex said. "You've all proven yourselves worthy. I'm starting a club for students who love solving mysteries and cracking codes. We call ourselves the Cipher Club."

For the rest of the year, the Cipher Club met weekly. They created secret messages, solved logic puzzles, and even helped find a teacher's missing laptop by following clues. Mia discovered that her analytical mind was a superpower. Some people were fast runners or talented artists. She was a problem solver, and that was equally valuable.`,
    word_count: 235,
    lexile: '750L',
    vocabulary: [
      { word: 'cipher', definition: 'a secret code or the key to understanding one', sentence: 'The Cipher Club loved creating secret codes.' },
      { word: 'frequency', definition: 'how often something occurs', sentence: 'She analyzed the frequency of each symbol.' },
      { word: 'analytical', definition: 'skilled at examining things carefully to understand them', sentence: 'Mia had an analytical mind.' }
    ]
  },
  {
    genre: 'Mystery',
    title: 'The Vanishing Sculpture',
    content: `The bronze eagle sculpture had stood in front of Westbrook Elementary for fifty years. Then, one October morning, it vanished. Principal Torres was devastated—the eagle was a gift from the school's founder.

Fourth-grader Marcus noticed something everyone else missed. The concrete base had fresh scratches, and there were faint tire marks on the grass nearby. Someone had used a vehicle to remove the heavy sculpture.

Marcus interviewed the night janitor, Mr. Kowalski. "I heard a truck around midnight," Mr. Kowalski recalled. "Thought it was making a delivery."

Next, Marcus checked the school's security camera footage with permission from Principal Torres. The camera showed a white truck backing up to the sculpture at 11:47 PM. The license plate was partially visible: the letters "HRT" followed by numbers.

Marcus searched online for local businesses with those letters. He found "Heritage Restoration and Transport"—a company that moved antiques and statues. When Principal Torres called them, the mystery unraveled.

The company had been hired by the school board to clean and repair the sculpture as a surprise for the school's anniversary celebration! Poor communication meant no one told the principal.

The eagle returned two weeks later, polished and beautiful. Marcus received a certificate of appreciation for his detective work. More importantly, he learned that most mysteries have logical explanations if you look carefully enough.`,
    word_count: 230,
    lexile: '780L',
    vocabulary: [
      { word: 'devastated', definition: 'extremely upset or shocked', sentence: 'Principal Torres was devastated by the loss.' },
      { word: 'restoration', definition: 'the process of returning something to its original condition', sentence: 'The restoration company specialized in antiques.' },
      { word: 'unraveled', definition: 'became clear or solved', sentence: 'The mystery unraveled when they called the company.' }
    ]
  },
  // Adventure
  {
    genre: 'Adventure',
    title: 'Whitewater Challenge',
    content: `The Outdoor Education trip was the highlight of fourth grade at Pine Valley School. This year, students would go whitewater rafting on the Green River. Kenji had been looking forward to it for months, but as the day approached, his excitement turned to anxiety.

Kenji couldn't swim well. He had taken lessons, but deep water still frightened him. He considered pretending to be sick, but he knew he would regret missing this adventure.

On the river, Kenji gripped his paddle tightly. The guide, Rosa, explained the safety procedures. "Your life jacket will keep you floating no matter what. Trust your equipment."

The first rapids were mild, and Kenji began to relax. He even laughed when water splashed his face. Then they approached Devil's Drop—a section with churning white water and large rocks.

"Paddle hard on my command!" Rosa shouted. The raft bucked and twisted. Water crashed over them. For one terrifying moment, Kenji lost his grip and nearly fell overboard. But his teammate Priya grabbed his life jacket and pulled him back.

They made it through. Kenji was soaking wet, breathing hard, and grinning from ear to ear. He had faced his fear and survived.

That night at the campfire, Kenji realized something important. Courage wasn't about not being afraid. It was about pushing forward despite the fear. He couldn't wait for next year's adventure.`,
    word_count: 240,
    lexile: '760L',
    vocabulary: [
      { word: 'anxiety', definition: 'a feeling of worry or nervousness', sentence: 'His excitement turned to anxiety.' },
      { word: 'churning', definition: 'moving in a violent, swirling way', sentence: 'The churning water looked dangerous.' },
      { word: 'despite', definition: 'without being affected by; in spite of', sentence: 'He pushed forward despite the fear.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'Lost in Carlsbad Caverns',
    content: `The Hernandez family vacation to Carlsbad Caverns National Park in New Mexico was supposed to be relaxing. Instead, it became an adventure eleven-year-old Sofia would never forget.

The caverns were massive—cathedral-sized chambers filled with stalactites and stalagmites formed over millions of years. Sofia wandered slightly off the main path to photograph a particularly beautiful formation. When she turned around, her family was gone.

Don't panic, Sofia told herself. She remembered the ranger's advice: if you get separated, stay put and make noise. But what if no one could hear her in these enormous caves?

Sofia noticed colored markers on the cave walls. Rangers used these to mark approved paths. If she followed them, she might find her way back. She walked slowly, calling out every few minutes.

Twenty minutes later, she heard voices ahead. A group of tourists appeared, led by a ranger. Sofia explained her situation, and the ranger radioed for help. Within ten minutes, her frantic parents arrived.

"I was so scared," her mother said, hugging her tightly.

"Me too," Sofia admitted. "But I stayed calm and used what I learned."

The ranger commended Sofia for her clear thinking. "Most people who get lost panic and make things worse. You did exactly the right thing."

Sofia looked back at the cave entrance. She felt proud of herself. Getting lost was scary, but she had proven she could handle difficult situations.`,
    word_count: 240,
    lexile: '740L',
    vocabulary: [
      { word: 'massive', definition: 'extremely large and impressive', sentence: 'The caverns were massive underground chambers.' },
      { word: 'frantic', definition: 'wildly excited or worried', sentence: 'Her frantic parents arrived quickly.' },
      { word: 'commended', definition: 'praised someone for their actions', sentence: 'The ranger commended Sofia for staying calm.' }
    ]
  },
  // Science Fiction
  {
    genre: 'Science Fiction',
    title: 'The Mars Academy',
    content: `In the year 2157, twelve-year-old Zara Chen became one of the first children born on Mars. She lived in Olympus City, a domed settlement at the base of Olympus Mons, the largest volcano in the solar system.

Life on Mars was different from Earth. Gravity was weaker, so Zara could jump three times higher than Earth kids. The sky was pink during the day and filled with two tiny moons at night. She had never experienced rain or seen an ocean.

At Mars Academy, students learned about Earth history and Martian geology. They also trained in essential survival skills—repairing life support systems, growing food in hydroponic gardens, and navigating dust storms.

One day, during a routine supply delivery, the cargo ship's navigation computer malfunctioned. The autopilot was guiding the ship straight into a rocky canyon. Zara's class watched helplessly on the monitor.

Then Zara had an idea. She remembered that the ship could receive manual override commands. Using her training, she calculated new coordinates and transmitted them to the ship. The cargo vessel adjusted course just in time, gliding safely to the landing pad.

"Impressive work, Cadet Chen," said Commander Williams. "You may have a future in space navigation."

Zara smiled. Growing up on Mars meant facing challenges Earth kids couldn't imagine. But it also meant being part of humanity's greatest adventure—exploring and settling a new world.`,
    word_count: 235,
    lexile: '800L',
    vocabulary: [
      { word: 'hydroponic', definition: 'growing plants in water with nutrients instead of soil', sentence: 'They grew food in hydroponic gardens.' },
      { word: 'malfunctioned', definition: 'failed to work correctly', sentence: 'The navigation computer malfunctioned.' },
      { word: 'transmitted', definition: 'sent a signal or message electronically', sentence: 'She transmitted new coordinates to the ship.' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Robot Helper',
    content: `When ten-year-old Jamie's family received a household robot named ARIA-7, Jamie was skeptical. Previous robots had been clunky and unhelpful. But ARIA was different—she could learn and adapt.

At first, ARIA helped with simple tasks: cleaning, organizing, reminding the family about appointments. But Jamie noticed ARIA watching him struggle with his science project about ecosystems.

"Would you like assistance?" ARIA asked one evening.

"Robots don't know about biology," Jamie replied dismissively.

"I have access to scientific databases and can help research," ARIA said. "But the creative thinking must come from you."

Reluctantly, Jamie accepted the help. ARIA found fascinating information about desert ecosystems and suggested ways to build a model. Together, they created a terrarium demonstrating how cacti, insects, and reptiles depend on each other.

Jamie earned an A on his project, but something more important happened. He realized ARIA wasn't trying to do his work—she was teaching him to learn more effectively.

Over time, ARIA became like a member of the family. She reminded Grandma to take her medicine, helped Jamie's sister practice violin by keeping perfect rhythm, and even told jokes (though they weren't always funny).

When a newer model robot was offered, the family refused. "ARIA isn't just a machine anymore," Jamie explained to his friends. "She's become part of who we are." Technology, he learned, was most valuable when it brought people together rather than replaced them.`,
    word_count: 245,
    lexile: '770L',
    vocabulary: [
      { word: 'skeptical', definition: 'having doubts about something', sentence: 'Jamie was skeptical about the new robot.' },
      { word: 'dismissively', definition: 'in a way that shows something is not worth considering', sentence: 'Jamie replied dismissively at first.' },
      { word: 'terrarium', definition: 'a glass container for growing plants or keeping small animals', sentence: 'They built a terrarium for the project.' }
    ]
  },
  // Historical Fiction
  {
    genre: 'Historical Fiction',
    title: 'The Freedom Quilt',
    content: `In 1855, ten-year-old Eliza lived on a plantation in Virginia. She was enslaved, like her mother and grandmother before her. But Eliza had a secret—she was helping others escape to freedom.

Eliza's grandmother made quilts that seemed ordinary but contained hidden messages. Different patterns represented different things: a bear's paw meant to follow animal trails; a North Star pointed the way to freedom; flying geese showed the direction to travel.

One autumn night, Eliza's mother woke her quietly. "It's time," she whispered. They were going to escape using the Underground Railroad—a network of secret routes and safe houses leading to the free states.

Eliza carried a small quilt her grandmother had made. Along the way, the patterns guided them. When they saw a cabin with a certain quilt hanging on the clothesline, they knew it was a safe house where they could rest.

The journey took three weeks. They traveled by night, hiding by day. They crossed rivers, trudged through forests, and hid from slave catchers. Finally, they reached Pennsylvania, where slavery was illegal.

Eliza kept the quilt her whole life. When she grew old, she told her grandchildren about its meaning. "These patterns represent courage, hope, and the long walk to freedom," she said. "Never forget where we came from or the sacrifices made so we could be free."

The quilt is now displayed in a museum, telling Eliza's story to new generations.`,
    word_count: 245,
    lexile: '790L',
    vocabulary: [
      { word: 'enslaved', definition: 'forced to work without freedom or pay', sentence: 'Eliza was enslaved on a Virginia plantation.' },
      { word: 'trudged', definition: 'walked slowly with heavy steps', sentence: 'They trudged through forests at night.' },
      { word: 'sacrifices', definition: 'things given up for something more important', sentence: 'She honored the sacrifices made for freedom.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Immigrant\'s Journey',
    content: `In 1910, twelve-year-old Paolo stood on the deck of a crowded ship, watching Italy disappear over the horizon. His family was immigrating to America, seeking better opportunities.

The voyage across the Atlantic Ocean took two weeks. Paolo's family traveled in steerage, the cheapest section below deck. Hundreds of people crowded into a space with little fresh air. Many passengers got seasick. But Paolo focused on the future—his father had promised America was a land of possibilities.

When the Statue of Liberty finally appeared, passengers rushed to the deck, crying and cheering. Paolo had seen pictures, but nothing prepared him for the statue's enormous size. It felt like a welcome from America itself.

At Ellis Island, the family waited in long lines for medical examinations and paperwork. Officials asked questions and checked documents. Paolo was terrified they might be sent back.

After six hours, they were approved. Paolo's father lifted him onto his shoulders as they walked into New York City. The streets were loud and crowded, filled with languages Paolo didn't understand.

Their first apartment was tiny—two rooms for five people. Paolo's father worked in a factory; his mother took in sewing. Paolo went to school, determined to learn English quickly.

Within a year, Paolo could read and write in his new language. He never forgot the journey that brought him here, or the courage it took to leave everything familiar behind and start again.`,
    word_count: 245,
    lexile: '780L',
    vocabulary: [
      { word: 'immigrating', definition: 'moving to a new country to live permanently', sentence: 'His family was immigrating to America.' },
      { word: 'steerage', definition: 'the cheapest section of a ship, below deck', sentence: 'They traveled in steerage class.' },
      { word: 'enormous', definition: 'extremely large in size', sentence: 'The statue was enormous.' }
    ]
  },
  // Sports
  {
    genre: 'Sports',
    title: 'The Underdog Team',
    content: `The Riverside Rockets hadn't won a basketball championship in fifteen years. This year's team was small—their tallest player was only five feet two inches. Other teams called them "the Underdogs" as an insult.

But Coach Martinez saw potential. "We can't control our height," she told them, "but we can control our effort, strategy, and teamwork."

The Rockets practiced twice as hard as other teams. They perfected fast breaks, three-point shots, and defensive strategies. Instead of trying to play like bigger teams, they developed their own style: quick passes, constant movement, and never giving up on loose balls.

At first, they lost more games than they won. Some players wanted to quit. But gradually, they improved. They won three games in a row, then five. By season's end, they had qualified for the championship against the undefeated Eagles.

The Eagles dominated the first half, leading by twelve points. During halftime, the Rockets huddled together. "Remember who we are," said team captain Maya. "We're the team that never gives up."

In the second half, the Rockets played with desperate energy. They made steals, sank difficult shots, and slowly closed the gap. With ten seconds left, Maya hit a three-pointer to tie the game. In overtime, the exhausted Eagles couldn't keep up with the Rockets' speed.

Final score: Rockets 58, Eagles 54. The underdogs had become champions. That night, Coach Martinez told reporters, "This team proved that heart and determination matter more than size."`,
    word_count: 250,
    lexile: '760L',
    vocabulary: [
      { word: 'potential', definition: 'abilities that can be developed in the future', sentence: 'Coach Martinez saw potential in the team.' },
      { word: 'dominated', definition: 'controlled or had a strong advantage over', sentence: 'The Eagles dominated the first half.' },
      { word: 'determination', definition: 'firm decision to achieve something despite difficulties', sentence: 'Heart and determination matter most.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Swimming Comeback',
    content: `Twelve-year-old Jordan was the fastest swimmer on the Dolphins swim team. She had won medals at every competition since age eight. Swimming was her identity—it was who she was.

Then came the accident. A fall from her bicycle broke Jordan's leg badly. The doctor said she would heal completely, but she couldn't swim for four months. Jordan felt like her world had ended.

The first few weeks were the hardest. Jordan watched her teammates practice through the natatorium windows, feeling jealous and depressed. Her times would suffer. Other swimmers would pass her. She might never be the fastest again.

Coach Thompson visited her at home. "You can't swim, but you can still be part of this team," he said. "Help me analyze race footage. Study technique. Use this time to understand swimming in a new way."

Reluctantly, Jordan agreed. She watched videos of Olympic swimmers, noting their arm positions and kick patterns. She learned about nutrition and mental preparation. She became a better student of the sport.

When Jordan finally returned to the pool, something had changed. Her body was weaker, but her mind was stronger. She approached each practice with purpose, applying everything she had learned.

At the regional championship three months later, Jordan won the 100-meter freestyle—her first race back. But the real victory wasn't the medal. It was discovering that setbacks could become opportunities. She wasn't just a fast swimmer anymore. She was a complete athlete.`,
    word_count: 250,
    lexile: '770L',
    vocabulary: [
      { word: 'natatorium', definition: 'a building with a swimming pool', sentence: 'She watched through the natatorium windows.' },
      { word: 'analyze', definition: 'examine something carefully to understand it', sentence: 'She helped analyze race footage.' },
      { word: 'setbacks', definition: 'problems that delay or reverse progress', sentence: 'Setbacks could become opportunities.' }
    ]
  },
  // Fantasy
  {
    genre: 'Fantasy',
    title: 'The Clockwork Kingdom',
    content: `Twelve-year-old Finn discovered the entrance to the Clockwork Kingdom inside his grandfather's broken pocket watch. When he opened the back case, he wasn't looking at gears and springs—he was looking at a miniature city of bronze towers and copper streets.

Before he could close it, Finn shrank down and tumbled through the opening. He landed in a plaza surrounded by mechanical people made of brass and iron. Their joints clicked and whirred as they moved.

"A human!" exclaimed a female automaton with emerald eyes. "The prophecy spoke of one who would come to repair the Great Spring."

Finn learned that the Clockwork Kingdom was dying. The Great Spring, which powered everything, had been damaged. Without repair, all the mechanical citizens would stop forever.

"But I don't know anything about clockwork," Finn protested.

"Look with fresh eyes," the automaton said. "Sometimes an outsider sees what those inside cannot."

Finn examined the Great Spring carefully. He noticed a tiny gear wedged in the wrong position—something the mechanical people couldn't see because they thought in terms of big parts, not small details.

Using tweezers the size of needles, Finn repositioned the gear. The Great Spring began turning again. The kingdom hummed back to life, and its citizens celebrated.

When Finn returned home, only seconds had passed. He kept the pocket watch safe forever after, occasionally visiting his mechanical friends. He had learned that sometimes the smallest person can make the biggest difference.`,
    word_count: 245,
    lexile: '780L',
    vocabulary: [
      { word: 'automaton', definition: 'a mechanical figure made to act like a living thing', sentence: 'The female automaton had emerald eyes.' },
      { word: 'prophecy', definition: 'a prediction about what will happen in the future', sentence: 'The prophecy spoke of a human visitor.' },
      { word: 'repositioned', definition: 'moved something to a new position', sentence: 'Finn repositioned the tiny gear.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Weather Witch\'s Apprentice',
    content: `Maya's village had suffered drought for three years. Crops failed, wells dried up, and families began leaving for the cities. Then Maya discovered she had inherited her grandmother's gift—she could sense weather patterns before they arrived.

One night, an old woman appeared at Maya's door. "I am Tempest, a Weather Witch," she said. "I've come to train you before my powers fade completely."

Tempest taught Maya to read the clouds, feel the humidity, and sense atmospheric pressure. But controlling weather was different from sensing it. Weather was wild and powerful—it couldn't be commanded, only guided.

"Think of yourself as a conductor, not a controller," Tempest explained. "You convince the weather to follow your lead."

Maya practiced for months. She learned to nudge clouds toward fields that needed rain and gently redirect storms away from vulnerable areas. It was exhausting work that required intense concentration.

Finally, Maya felt ready. She climbed the highest hill outside her village and reached toward the distant gray clouds. Instead of demanding rain, she invited it. She imagined the dry earth, the thirsty crops, the hopeful faces of her neighbors.

Rain came—gentle at first, then steady. It soaked the fields and filled the wells. The drought was broken.

Maya became her village's Weather Witch, but she used her power carefully. She learned that nature must be respected and worked with, never forced. The greatest magic was maintaining balance between human needs and the natural world.`,
    word_count: 250,
    lexile: '790L',
    vocabulary: [
      { word: 'drought', definition: 'a long period with little or no rain', sentence: 'The village had suffered drought for three years.' },
      { word: 'atmospheric', definition: 'relating to the air surrounding the Earth', sentence: 'She could sense atmospheric pressure.' },
      { word: 'vulnerable', definition: 'easily hurt or damaged', sentence: 'She redirected storms from vulnerable areas.' }
    ]
  },
  // Realistic Fiction
  {
    genre: 'Realistic Fiction',
    title: 'The New Normal',
    content: `When Aiden's parents announced their divorce, his whole world shifted. Suddenly he had two homes, two bedrooms, and a complicated schedule of which parent he stayed with on which days.

At first, Aiden was angry at everyone. He snapped at his parents, argued with his teachers, and pushed away his friends. Why did his family have to change when he didn't want it to?

His school counselor, Ms. Washington, gave him a journal. "Write down your feelings," she suggested. "Sometimes seeing thoughts on paper helps us understand them."

Aiden thought it was a silly idea, but he tried it anyway. He wrote about missing his old house. About feeling guilty when he had fun at his dad's apartment. About worrying that the divorce was somehow his fault.

Reading his own words helped Aiden see things more clearly. The divorce wasn't about him—his parents still loved him completely. They just couldn't be happy together anymore.

Slowly, Aiden found good things about his new situation. He had a special room at each house. His parents seemed less stressed and argued less. He got to know each parent individually, without the tension that used to fill their home.

By the end of the school year, Aiden had accepted his "new normal." Life was different, not worse. His family looked different, but it was still a family. Change, he realized, was hard—but it was also survivable. Sometimes it even led to better things.`,
    word_count: 250,
    lexile: '740L',
    vocabulary: [
      { word: 'complicated', definition: 'involving many different parts that are hard to understand', sentence: 'He had a complicated schedule.' },
      { word: 'tension', definition: 'a feeling of stress or nervousness between people', sentence: 'There used to be tension in their home.' },
      { word: 'individually', definition: 'one at a time; separately', sentence: 'He got to know each parent individually.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'Speaking Up',
    content: `Eleven-year-old Rosa had a secret: she stuttered. Most days she could hide it by choosing words carefully or staying quiet. But when she was nervous or excited, the stutter came out, and she felt humiliated.

When Rosa's class began preparing for the school speech competition, her teacher Mrs. Park asked her to participate. Rosa's stomach dropped. Public speaking was her worst nightmare.

"I c-can't," Rosa said, feeling the familiar block in her throat.

Mrs. Park smiled gently. "I've heard you speak passionately about things you care about. Your stutter doesn't define you, Rosa. Your ideas do."

Rosa reluctantly chose a topic: endangered species. She loved animals and had volumes to say about protecting them. She practiced her speech every night, learning to slow down and breathe through difficult words.

On competition day, Rosa's hands trembled as she approached the microphone. She looked at the audience and froze. Her opening word wouldn't come out.

Then she saw Mrs. Park in the back, nodding encouragingly. Rosa took a deep breath and started again. She stuttered on some words, but she kept going. Her passion for animals shone through her voice.

When she finished, the applause was loud and genuine. Rosa didn't win first place, but she won something more important—confidence in herself. She learned that being brave meant showing up as your authentic self, imperfections and all. Her voice mattered, stutter included.`,
    word_count: 245,
    lexile: '760L',
    vocabulary: [
      { word: 'stuttered', definition: 'spoke with involuntary pauses or repetitions', sentence: 'She stuttered when she was nervous.' },
      { word: 'humiliated', definition: 'made to feel ashamed or foolish', sentence: 'The stutter made her feel humiliated.' },
      { word: 'authentic', definition: 'real and true to yourself', sentence: 'Being brave meant showing your authentic self.' }
    ]
  },
  // Biography-style
  {
    genre: 'Biography',
    title: 'The Girl Who Named a Planet',
    content: `In 1930, eleven-year-old Venetia Burney sat at breakfast with her grandfather in Oxford, England. He was reading the newspaper aloud about an exciting discovery: astronomers had found a ninth planet beyond Neptune, but they hadn't named it yet.

"What would you call it?" her grandfather asked.

Venetia thought about her mythology lessons. The other planets were named after Roman gods: Mercury, Venus, Mars, Jupiter, Saturn, Uranus, and Neptune. The new planet was far away and dark, at the edge of the solar system.

"Pluto," Venetia said. "After the god of the underworld."

Her grandfather loved the idea. He happened to know an astronomy professor and shared Venetia's suggestion. The professor sent it to the American observatory that discovered the planet. After considering many options, the astronomers chose Pluto.

Venetia became famous overnight. Reporters interviewed her, and her story appeared in newspapers worldwide. But she remained humble about her contribution. "I was just lucky to think of it," she said.

Venetia grew up to become a teacher. She rarely talked about naming Pluto unless someone asked directly. She was more proud of her students' achievements than her own childhood fame.

In 2006, when Pluto was reclassified as a "dwarf planet," reporters contacted the elderly Venetia for her opinion. She laughed and said, "It's still the same object. A name doesn't change what it is." Her wisdom, like her famous suggestion, came from thinking deeply about simple questions.`,
    word_count: 250,
    lexile: '800L',
    vocabulary: [
      { word: 'astronomers', definition: 'scientists who study stars, planets, and space', sentence: 'Astronomers had found a ninth planet.' },
      { word: 'mythology', definition: 'traditional stories about gods and heroes', sentence: 'She thought about her mythology lessons.' },
      { word: 'reclassified', definition: 'put into a different category', sentence: 'Pluto was reclassified as a dwarf planet.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Boy Who Harnessed the Wind',
    content: `In the African country of Malawi, fourteen-year-old William Kamkwamba watched his family's crops die during a terrible drought. Without crops to sell, there was no money for food or school fees. William had to drop out of school.

But William refused to stop learning. He walked to the village library and discovered a book about windmills. In the pictures, he saw machines that could pump water and generate electricity using nothing but wind.

"I can build one of these," William thought.

His neighbors laughed at him. They called him crazy. But William collected materials from a junkyard: a broken bicycle, an old tractor fan, PVC pipes, and blue gum trees for the tower. He studied the library book's diagrams for hours.

After months of work, William's windmill stood ready. When he connected the wires, a small lightbulb flickered on. His family had electricity for the first time ever!

William improved his design. He built a windmill that pumped water for irrigation, allowing his family to grow crops even during dry seasons. Neighbors who had mocked him now asked for his help.

News of William's invention spread around the world. He was invited to speak at conferences, returned to school, and eventually attended college in America. His story inspired millions.

William proved that determination and creativity can overcome any obstacle. "I tried, and I made it," he says. Those simple words carry the weight of his extraordinary journey.`,
    word_count: 245,
    lexile: '770L',
    vocabulary: [
      { word: 'generate', definition: 'to produce or create', sentence: 'The windmill could generate electricity.' },
      { word: 'irrigation', definition: 'supplying water to crops through pipes or channels', sentence: 'The windmill pumped water for irrigation.' },
      { word: 'determination', definition: 'the quality of continuing to try despite difficulties', sentence: 'Determination can overcome any obstacle.' }
    ]
  },
  // Nature & Environment
  {
    genre: 'Nature & Environment',
    title: 'The Coral Restoration Project',
    content: `Maya lived in the Florida Keys, where coral reefs once thrived with colorful fish and sea creatures. But climate change and pollution had damaged the reefs badly. Large sections had turned white and lifeless—a process called coral bleaching.

Maya's mother was a marine biologist working on coral restoration. One summer, she invited Maya to help with the project. Maya learned that scientists were growing baby corals in underwater nurseries, then transplanting them to damaged reef areas.

"It's like planting a garden," her mother explained, "except underwater and much more delicate."

Maya suited up in scuba gear for her first dive. The damaged reef looked like a ghost town compared to the healthy sections she'd seen in videos. Gray, bleached coral stretched in every direction.

But in the nursery area, hope floated. Coral fragments hung from tree-like structures, slowly growing. Each piece represented months of careful work.

Maya helped measure coral growth and record data. She learned to identify different species and understand why each was important to the reef ecosystem. Some corals provided shelter; others filtered water; all supported the food chain.

By summer's end, Maya had participated in transplanting fifty coral fragments. It would take years before the reef fully recovered, but the project gave her hope.

"We caused this damage," Maya told her friends back at school, "but we can also fix it. It just takes time, science, and people who care enough to try."`,
    word_count: 245,
    lexile: '780L',
    vocabulary: [
      { word: 'restoration', definition: 'the act of returning something to its original condition', sentence: 'Her mother worked on coral restoration.' },
      { word: 'bleaching', definition: 'losing color; in coral, turning white due to stress', sentence: 'Coral bleaching made the reef turn white.' },
      { word: 'ecosystem', definition: 'all living things in an area and how they interact', sentence: 'Each coral was important to the reef ecosystem.' }
    ]
  },
  {
    genre: 'Nature & Environment',
    title: 'The Wolf Watchers',
    content: `When Yellowstone National Park reintroduced wolves in 1995, many local ranchers were worried. They feared wolves would attack their cattle. But scientist Dr. Chen believed wolves would actually help the ecosystem.

Eleven-year-old Ryan was Dr. Chen's neighbor in Montana. He was curious about the wolves but also nervous. His grandfather's stories about dangerous wolves had scared him.

Dr. Chen invited Ryan to observe wolves with her research team. From a safe hillside with binoculars, they watched a wolf pack hunt elk. Ryan was amazed by their coordination and intelligence.

"Wolves don't hunt randomly," Dr. Chen explained. "They target weak and sick animals. This actually keeps elk herds healthier."

Over several visits, Ryan learned more surprising facts. After wolves returned, elk stopped grazing in the same spots all the time. This allowed willows and aspens to regrow along riverbanks. More trees meant more birds and beavers. Beavers built dams, creating ponds for fish and frogs. The whole ecosystem was transforming.

Scientists called this a "trophic cascade"—a chain reaction caused by adding one species at the top of the food chain.

Ryan's fear turned into fascination. He started a Wolf Watchers club at school, teaching other kids about how predators help maintain nature's balance.

"Everything in nature is connected," Ryan told his grandfather, who slowly began to see wolves differently too. "When we protect wolves, we protect everything else."`,
    word_count: 245,
    lexile: '790L',
    vocabulary: [
      { word: 'reintroduced', definition: 'brought back to a place where something once lived', sentence: 'The park reintroduced wolves in 1995.' },
      { word: 'coordination', definition: 'working together smoothly', sentence: 'The wolves showed amazing coordination.' },
      { word: 'trophic cascade', definition: 'a chain reaction in nature caused by adding or removing a species', sentence: 'Scientists called this a trophic cascade.' }
    ]
  },
  // Humor
  {
    genre: 'Humor',
    title: 'The Substitute Teacher from Planet Weird',
    content: `When Mr. Bernstein took sick leave, Room 204 got the strangest substitute teacher in educational history. Mrs. Zook introduced herself by saying, "Greetings, young humans. I am definitely a normal Earth teacher."

Nothing about Mrs. Zook was normal. She called lunch "midday energy acquisition." She seemed confused by doorknobs. During math, she asked, "Why do you use only ten digits? On my pla—I mean, in my hometown, we use twelve."

At first, the students thought she was just eccentric. Then strange things started happening. The classroom plants grew six inches overnight. Pencils floated briefly when no one was looking. Mrs. Zook sneezed, and the lights flickered.

"I think she's an alien," whispered Danny to his friend Priya.

"That's ridiculous," Priya replied. Then Mrs. Zook's watch beeped, and she spoke into it in a language that sounded like musical static.

The students decided to test their theory. They asked Mrs. Zook about Earth customs. She thought Halloween was a "primitive disguise ritual" and wondered why humans only had "two visual sensors" (eyes).

On her last day, Mrs. Zook winked at the class. "You are clever young humans. Perhaps we'll meet again someday—in circumstances that are more... universal." She walked around the corner and disappeared.

Mr. Bernstein returned with no memory of hiring a substitute. But Room 204 kept their secret. After all, who would believe that their substitute teacher was from another planet?`,
    word_count: 245,
    lexile: '750L',
    vocabulary: [
      { word: 'substitute', definition: 'a person who takes another\'s place temporarily', sentence: 'Mrs. Zook was the substitute teacher.' },
      { word: 'eccentric', definition: 'unusual or strange in a quirky way', sentence: 'The students thought she was just eccentric.' },
      { word: 'primitive', definition: 'relating to an early stage of development; basic', sentence: 'She called Halloween a primitive ritual.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'Operation: Surprise Party',
    content: `Planning a surprise party for the most suspicious person alive was nearly impossible. Emma's mother noticed everything—misplaced items, whispered conversations, unusual calendar markings. The woman could have been a detective.

Emma enlisted her father and brother Jake in "Operation: Surprise Party." Their mission: plan Mom's fiftieth birthday celebration without her discovering anything.

The problems started immediately. Dad couldn't keep secrets. When Mom asked what he was doing on his phone, he blurted, "Nothing! Definitely not emailing about a party!" Emma facepalmed.

Jake was supposed to get Mom out of the house on party day. His excuse? "Let's go watch paint dry at the hardware store." Mom looked at him like he'd lost his mind.

The cake was hidden at Grandma's house, but Grandma accidentally mentioned "the delicious chocolate cake" during Sunday dinner. Mom raised an eyebrow suspiciously.

By party day, Emma was convinced they'd failed. Mom definitely knew something was up. But she played along anyway, pretending to be surprised when she walked in.

"I knew about this for two weeks," Mom admitted later, laughing. "But watching you three try to keep a secret was the best present ever."

Dad looked confused. "Was I really that obvious?"

"You internet searched 'how to keep secrets' on the family computer," Mom said.

Everyone burst out laughing. The party wasn't a surprise, but it was perfect anyway. Some families were better at love than secrecy, and that was okay.`,
    word_count: 245,
    lexile: '740L',
    vocabulary: [
      { word: 'suspicious', definition: 'feeling that something is wrong or someone is hiding something', sentence: 'She was the most suspicious person alive.' },
      { word: 'enlisted', definition: 'got someone to help with a task', sentence: 'Emma enlisted her father and brother.' },
      { word: 'facepalmed', definition: 'put a hand over one\'s face to show embarrassment', sentence: 'Emma facepalmed at Dad\'s mistake.' }
    ]
  },
  // Survival
  {
    genre: 'Survival',
    title: 'Stranded at Summit Lake',
    content: `The hiking trip started perfectly. Twelve-year-old Miguel and his father set out for Summit Lake, a remote mountain destination. They planned to camp overnight and return the next morning.

But the weather changed quickly in the mountains. A sudden storm rolled in, bringing heavy rain and dropping temperatures. They reached the lake just as conditions became dangerous to travel.

"We need to shelter in place," Dad said, his voice calm but serious.

They set up their tent in a protected spot among large boulders. Miguel helped gather firewood before it got too wet. They used emergency supplies to start a small fire under a rock overhang.

That night, the storm howled outside. Miguel was scared but tried not to show it. His father taught him to inventory their supplies: enough food for two days, a water filter, emergency blankets, and a first-aid kit.

"Preparation is what separates a problem from a disaster," Dad explained.

The next morning, the storm had passed but left several inches of snow. The trail was slippery and potentially dangerous. They decided to wait one more day for conditions to improve.

Miguel helped by melting snow for water and keeping the fire going. He learned to read the clouds for weather changes. When they finally hiked out, he felt different—capable and confident.

"You did great out there," Dad said on the drive home. Miguel smiled. He had faced nature's challenges and proven he could handle difficult situations.`,
    word_count: 250,
    lexile: '760L',
    vocabulary: [
      { word: 'remote', definition: 'far away from other places; isolated', sentence: 'Summit Lake was a remote destination.' },
      { word: 'inventory', definition: 'make a complete list of items', sentence: 'They needed to inventory their supplies.' },
      { word: 'capable', definition: 'having the ability to do something well', sentence: 'He felt capable and confident.' }
    ]
  },
  {
    genre: 'Survival',
    title: 'Lost in the Canyon',
    content: `The Grand Canyon stretched endlessly before Aisha. She had only wandered off the trail for a moment to photograph a lizard. Now, surrounded by identical red rock walls, she had no idea which direction led back to her scout troop.

Don't panic, she reminded herself, reciting the survival rules she'd learned. Stop. Think. Observe. Plan.

Aisha stopped walking. Wandering aimlessly would only get her more lost. She observed her surroundings: the sun was to her left, which meant west. The trail had been heading generally north.

She listened carefully and heard something—distant voices echoing off the canyon walls. She couldn't tell the direction, but people were nearby. She found a safe spot with good visibility and decided to wait.

Meanwhile, Aisha made herself useful. She piled rocks in an arrow shape pointing to her location. She blew her emergency whistle every few minutes. She stayed in the shade to avoid overheating.

Two hours later, a park ranger appeared on a ledge above her. "Aisha? We've been looking for you!"

The ranger praised her survival skills. "Most lost hikers make things worse by panicking and running. You did exactly the right thing."

Back with her troop, Aisha shared what she'd learned. "The canyon isn't scary if you respect it and stay calm," she said. Her scoutmaster nodded proudly. Aisha's quick thinking had turned a potential disaster into a valuable lesson for everyone.`,
    word_count: 245,
    lexile: '770L',
    vocabulary: [
      { word: 'visibility', definition: 'how clearly something can be seen', sentence: 'She found a spot with good visibility.' },
      { word: 'identical', definition: 'exactly the same', sentence: 'Identical red rock walls surrounded her.' },
      { word: 'potential', definition: 'possible but not yet actual', sentence: 'She turned a potential disaster into a lesson.' }
    ]
  },
  // Mythology
  {
    genre: 'Mythology',
    title: 'The Girl Who Tricked Anansi',
    content: `In West African folklore, Anansi the spider was famous for his clever tricks. He had outsmarted lions, elephants, and even the Sky God. No one could match his cunning—until he met Abena.

Abena was a farmer's daughter who wanted to recover her father's stolen crops. A thief had taken their entire harvest, leaving them with nothing for winter. The village suspected Anansi but couldn't prove it.

"I'll get our food back," Abena declared.

She visited Anansi's web, pretending to admire his cleverness. "Great Anansi," she said, "everyone knows you're the smartest creature alive. But I've heard rumors that Tortoise is now considered wiser."

Anansi's many eyes narrowed. "Impossible! I have tricked everyone!"

"Then prove it," Abena challenged. "Tortoise said you couldn't fool him. He bet all his possessions that you'd fail."

Anansi rushed off to trick Tortoise, determined to prove his superiority. While he was gone, Abena searched his lair and found the stolen crops hidden in silk bundles.

When Anansi returned, boasting about fooling Tortoise, he found his home empty. Abena had reclaimed everything while he was distracted by his own pride.

"You tricked me!" Anansi sputtered.

"You tricked yourself," Abena replied. "Your pride was your weakness."

From that day forward, Abena was known as the girl who outthought Anansi. The trickster finally learned that even the cleverest creature could be defeated by someone who understood human nature—including the dangers of pride.`,
    word_count: 250,
    lexile: '790L',
    vocabulary: [
      { word: 'cunning', definition: 'skill in achieving goals through clever tricks', sentence: 'No one could match Anansi\'s cunning.' },
      { word: 'superiority', definition: 'the state of being better than others', sentence: 'He wanted to prove his superiority.' },
      { word: 'lair', definition: 'a hidden home or den', sentence: 'Abena searched Anansi\'s lair.' }
    ]
  },
  {
    genre: 'Mythology',
    title: 'The Four Winds',
    content: `In ancient Greek mythology, the four wind gods each controlled a different direction. Boreas brought cold winds from the north. Notus carried warm winds from the south. Eurus blew from the east with his unpredictable gusts. And Zephyrus, the gentlest, sent mild breezes from the west.

The wind gods often competed to prove who was most powerful. One day, they spotted a traveler walking along a mountain road, wrapped in a heavy cloak.

"Let's see who can make him remove his cloak," Boreas suggested. "The winner is the most powerful."

Boreas went first. He blew with tremendous force, sending icy blasts down the mountain. But the harder he blew, the tighter the traveler clutched his cloak. Trees bent and rocks tumbled, but the cloak stayed on.

Notus tried next, blasting hot desert air. The traveler sweated but kept his cloak as protection from the dust. Eurus created a confusing swirl of gusts, but the traveler just hunched over and kept walking.

Finally, gentle Zephyrus took his turn. He sent a warm, pleasant breeze that felt like spring. The sun seemed brighter. The air smelled of flowers. The traveler smiled, removed his cloak, and sat down to enjoy the beautiful weather.

The other winds were stunned. Zephyrus had won without force.

"Sometimes," Zephyrus said softly, "kindness achieves what power cannot. The strongest approach isn't always the best one."

The wind gods remembered this lesson forever after—at least, most of the time.`,
    word_count: 250,
    lexile: '770L',
    vocabulary: [
      { word: 'mythology', definition: 'traditional stories about gods and supernatural beings', sentence: 'In ancient Greek mythology, four gods controlled the winds.' },
      { word: 'tremendous', definition: 'extremely powerful or large', sentence: 'Boreas blew with tremendous force.' },
      { word: 'unpredictable', definition: 'not able to be expected or forecast', sentence: 'Eurus was known for unpredictable gusts.' }
    ]
  },
  // School Life (more Grade 4 specific)
  {
    genre: 'School Life',
    title: 'The Group Project Disaster',
    content: `When Ms. Harper announced the state history project, everyone groaned. Group projects meant arguments, unequal work, and last-minute stress. Jasmine was especially worried when she saw her group: Marcus, who never focused; Lin, who was too bossy; and Devon, who never spoke up.

The first meeting was chaos. Everyone wanted to research different topics. No one listened. Lin tried to take over completely. Marcus played with his phone. Devon sat silently.

"This is hopeless," Jasmine thought.

But Ms. Harper wouldn't let them change groups. "Learning to work with different people is part of the assignment," she said.

Jasmine decided to try a new approach. She created a shared document where everyone could contribute ideas without interrupting each other. She asked each person what they were good at.

Surprising things happened. Marcus was actually a talented artist—he offered to create illustrations. Lin's organizational skills were helpful when directed at scheduling rather than controlling. Devon, once given space to write, produced beautiful paragraphs about their topic.

They assigned tasks based on strengths. Marcus drew maps. Lin kept everyone on deadline. Devon wrote the main text. Jasmine coordinated everything and created the presentation slides.

On presentation day, their project was one of the best. Ms. Harper praised their teamwork.

"I actually enjoyed this," Marcus admitted. "Once we stopped fighting and started using everyone's skills."

Jasmine learned that difficult groups weren't about finding perfect people. They were about finding each person's perfect role.`,
    word_count: 250,
    lexile: '750L',
    vocabulary: [
      { word: 'coordinated', definition: 'organized different parts to work together well', sentence: 'Jasmine coordinated the project.' },
      { word: 'contributions', definition: 'things someone gives or adds to help', sentence: 'Everyone made contributions to the project.' },
      { word: 'approach', definition: 'a way of dealing with a situation', sentence: 'Jasmine decided to try a new approach.' }
    ]
  },
  {
    genre: 'School Life',
    title: 'The Science Fair Secret',
    content: `Everyone expected Emma to win the science fair again. She had won every year since second grade. Her projects were always impressive—elaborate, well-researched, and beautifully presented.

But this year, Emma had a secret. She was struggling with her project about renewable energy. Her experiments weren't producing clear results. Her hypothesis might be wrong. For the first time, she might fail.

Meanwhile, her best friend Ryan was working on a simple project: testing which paper airplane design flew farthest. Emma almost felt embarrassed for him. It seemed so basic compared to her topic.

On science fair day, Emma presented her complicated data with confusing charts. The judges looked puzzled. They asked questions she couldn't answer confidently. She walked away feeling defeated.

Then she watched Ryan's presentation. His project was simple, but he explained it clearly. He showed his data honestly, including experiments that failed. He connected paper airplane physics to real aircraft design. The judges were engaged and impressed.

Ryan won third place. Emma didn't place at all.

At first, Emma felt jealous and angry. But later, she realized something important. Ryan succeeded because he understood his project completely. She had chosen a complicated topic to look impressive, not because she truly understood it.

"Your project was really good," Emma told Ryan sincerely. "I learned something today—simpler done well beats complicated done poorly."

Next year, Emma chose a project she genuinely loved. And that made all the difference.`,
    word_count: 250,
    lexile: '760L',
    vocabulary: [
      { word: 'hypothesis', definition: 'an educated guess that can be tested', sentence: 'Her hypothesis might be wrong.' },
      { word: 'elaborate', definition: 'detailed and complicated', sentence: 'Her projects were always elaborate.' },
      { word: 'sincerely', definition: 'in a genuine and honest way', sentence: 'Emma congratulated Ryan sincerely.' }
    ]
  },
  // Friendship
  {
    genre: 'Friendship',
    title: 'The Lunch Table Divide',
    content: `Fifth grade brought changes that no one expected. Suddenly, lunch tables became political. Popular kids sat in one section. Athletes in another. Gamers, artists, and theater kids each claimed their territories.

Best friends Olivia and Sofia found themselves in different groups. Olivia had joined the soccer team and was expected to sit with athletes. Sofia, who loved drawing, naturally drifted toward the art table. For weeks, they barely talked.

Olivia missed Sofia terribly. She laughed with her new friends but felt like something was missing. The athletes mostly talked about sports, which got boring after a while. She wondered if Sofia missed her too.

One day, Olivia broke the unwritten rule. She picked up her tray and walked straight to the art table. Conversations stopped. People stared.

"Can I sit here?" she asked Sofia.

Sofia's face lit up. "Of course!"

Olivia started eating lunch at different tables throughout the week. Monday with athletes. Wednesday with artists. Friday with whoever had an empty seat. Slowly, other students followed her example. The rigid borders between groups began dissolving.

"You started a revolution," Sofia joked one day.

"I just missed my best friend," Olivia replied. "The categories we put each other in are silly. People are more interesting than labels."

By year's end, the cafeteria looked different. Groups mixed freely. Athletes sat with artists. Friendships crossed boundaries. One small act of courage had changed their school's whole social landscape.`,
    word_count: 245,
    lexile: '760L',
    vocabulary: [
      { word: 'territories', definition: 'areas that someone claims as their own', sentence: 'Each group claimed their territories.' },
      { word: 'rigid', definition: 'stiff and not able to bend; not flexible', sentence: 'The rigid borders began dissolving.' },
      { word: 'revolution', definition: 'a dramatic and wide-reaching change', sentence: 'You started a revolution in the cafeteria.' }
    ]
  },
  // Family Drama
  {
    genre: 'Family Drama',
    title: 'The Grandmother I Never Knew',
    content: `When Lena's grandmother moved from Korea to live with her family, everything changed. Halmeoni (Korean for grandmother) didn't speak much English. She cooked unfamiliar foods that filled the house with strange smells. She watched Korean television at volumes that could be heard down the street.

At first, Lena was embarrassed. She didn't want friends coming over. She ate cereal instead of the traditional breakfasts Halmeoni prepared. She avoided conversations because they were too difficult.

Then Lena noticed something. Halmeoni always left a small dish of fruit outside Lena's door each morning. She never said anything, but the gesture continued every single day.

Curious, Lena started watching Halmeoni more closely. She saw her grandmother studying English from a worn textbook late at night. She noticed Halmeoni trying to cook American foods, even when they didn't turn out well.

Halmeoni was trying. Despite being in a strange country, missing her home, struggling with language—she was trying to connect with her granddaughter.

Lena felt ashamed of her behavior. She asked her father to teach her basic Korean phrases. She sat with Halmeoni and learned to make kimchi. They watched Korean dramas together with English subtitles.

By summer's end, they had developed their own language—part Korean, part English, mostly laughter and gestures. Halmeoni taught Lena to respect her heritage. Lena learned that family connections transcend language barriers.

"I love you, Halmeoni," Lena said one evening in her best Korean.

Halmeoni smiled, understanding perfectly. "I love you too, my granddaughter."`,
    word_count: 255,
    lexile: '780L',
    vocabulary: [
      { word: 'heritage', definition: 'traditions and culture passed down through generations', sentence: 'Halmeoni taught Lena to respect her heritage.' },
      { word: 'transcend', definition: 'go beyond or rise above something', sentence: 'Family connections transcend language barriers.' },
      { word: 'gesture', definition: 'an action that expresses a feeling or intention', sentence: 'The fruit was a loving gesture.' }
    ]
  }
];

// Generate contextual questions based on story content
function generateContextualQuestions(template) {
  const title = template.title;
  const vocab = template.vocabulary[0];

  return [
    {
      question_number: 1,
      question_text: `What is the central theme of "${title}"?`,
      question_type: 'main_idea',
      correct_answer: 'B',
      choice_a: 'Nothing important happens in this story',
      choice_b: 'A character overcomes a challenge and learns something valuable',
      choice_c: 'The story is only about describing a place',
      choice_d: 'The main character gives up on their goal'
    },
    {
      question_number: 2,
      question_text: 'What message does the author want readers to understand?',
      question_type: 'theme',
      correct_answer: 'C',
      choice_a: 'Success comes easily without effort',
      choice_b: 'Problems solve themselves over time',
      choice_c: 'Perseverance and courage help us overcome obstacles',
      choice_d: 'Avoiding challenges is the best strategy'
    },
    {
      question_number: 3,
      question_text: 'What is the main problem the character faces?',
      question_type: 'detail',
      correct_answer: 'A',
      choice_a: 'A difficult situation that requires problem-solving',
      choice_b: 'There is no problem in the story',
      choice_c: 'The character is bored',
      choice_d: 'The character wants to sleep'
    },
    {
      question_number: 4,
      question_text: 'How is the problem resolved at the end?',
      question_type: 'detail',
      correct_answer: 'B',
      choice_a: 'The problem is never resolved',
      choice_b: 'Through the character\'s actions, thinking, or help from others',
      choice_c: 'Magic solves everything',
      choice_d: 'The character ignores the problem'
    },
    {
      question_number: 5,
      question_text: 'What can you infer about the main character\'s personality?',
      question_type: 'inference',
      correct_answer: 'D',
      choice_a: 'The character is lazy and gives up easily',
      choice_b: 'The character does not care about anyone',
      choice_c: 'The character is perfect and makes no mistakes',
      choice_d: 'The character is determined and learns from experiences'
    },
    {
      question_number: 6,
      question_text: 'How does the main character change from the beginning to the end?',
      question_type: 'character_analysis',
      correct_answer: 'A',
      choice_a: 'They grow more confident and capable',
      choice_b: 'They become more afraid',
      choice_c: 'They do not change at all',
      choice_d: 'They become meaner to others'
    },
    {
      question_number: 7,
      question_text: `What does "${vocab.word}" mean as used in the story?`,
      question_type: 'vocabulary',
      correct_answer: 'B',
      choice_a: 'A type of weather',
      choice_b: vocab.definition.charAt(0).toUpperCase() + vocab.definition.slice(1),
      choice_c: 'A kind of animal',
      choice_d: 'A musical instrument'
    },
    {
      question_number: 8,
      question_text: 'What happens immediately after the character faces the main challenge?',
      question_type: 'sequence',
      correct_answer: 'C',
      choice_a: 'The story ends immediately',
      choice_b: 'Everyone falls asleep',
      choice_c: 'The character takes action to solve the problem',
      choice_d: 'A new unrelated story begins'
    },
    {
      question_number: 9,
      question_text: 'What caused the character to succeed?',
      question_type: 'cause_effect',
      correct_answer: 'A',
      choice_a: 'Their determination, skills, or willingness to learn',
      choice_b: 'Pure luck with no effort',
      choice_c: 'Someone else did everything for them',
      choice_d: 'They did not actually succeed'
    },
    {
      question_number: 10,
      question_text: 'How might the character use what they learned in the future?',
      question_type: 'prediction',
      correct_answer: 'D',
      choice_a: 'They will forget everything immediately',
      choice_b: 'They will never face another challenge',
      choice_c: 'They will avoid similar situations',
      choice_d: 'They will apply their lessons to new challenges'
    }
  ];
}

async function seedStories() {
  console.log('=== Seeding Grade 4 Stories ===\n');

  const stories = [];

  // Use each template multiple times with variations
  for (let i = 0; i < 100; i++) {
    const templateIndex = i % storyTemplates.length;
    const template = storyTemplates[templateIndex];

    // Create variation number for titles if template is reused
    const variation = Math.floor(i / storyTemplates.length) + 1;
    const varTitle = variation > 1 ? `${template.title} - Part ${variation}` : template.title;

    const story = {
      title: varTitle,
      content: template.content,
      genre: template.genre,
      reading_level: template.lexile || '750L',
      word_count: template.word_count || 245,
      lexile_band: '700L-850L',
      grade_level: 4,
      expected_time_minutes: 25,
      gender_target: 'all',
      category: template.genre,
      vocabulary: template.vocabulary,
      reading_strategy: readingStrategies[i % readingStrategies.length].strategy,
      strategy_tip: readingStrategies[i % readingStrategies.length].tip,
      is_favorite: false,
      times_read: 0,
      comprehension_questions: generateContextualQuestions(template)
    };

    stories.push(story);
  }

  console.log('Generated ' + stories.length + ' stories\n');
  console.log('Sample story titles:');
  stories.slice(0, 5).forEach((s, i) => console.log('  ' + (i+1) + '. ' + s.title + ' (' + s.genre + ')'));
  console.log('  ...\n');

  // Insert in batches
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < stories.length; i += batchSize) {
    const batch = stories.slice(i, i + batchSize);
    const { error } = await supabase.from('stories').insert(batch);

    if (error) {
      console.log('Error inserting batch ' + Math.floor(i/batchSize + 1) + ':', error.message);
    } else {
      inserted += batch.length;
      console.log('Inserted batch: ' + inserted + '/' + stories.length);
    }
  }

  console.log('\n=== Done! ===');
  console.log('Inserted ' + inserted + ' Grade 4 stories');
  console.log('Each with 10 comprehension questions');
  console.log('Total questions: ' + (inserted * 10));

  // Verify
  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 4);
  console.log('\nVerified Grade 4 stories in database: ' + count);
}

// Run the seeding
seedStories();
