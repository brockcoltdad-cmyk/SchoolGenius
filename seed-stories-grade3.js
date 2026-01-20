const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Grade 3 appropriate genres and themes
const genres = [
  'Mystery', 'Adventure', 'Animal Stories', 'Friendship', 'Sports',
  'Science Discovery', 'Fantasy', 'Humor', 'Historical Fiction', 'Nature',
  'School Life', 'Family Stories', 'Mythology', 'Fairy Tales Retold', 'Community Helpers'
];

const readingStrategies = [
  { strategy: 'main_idea', tip: 'While reading, ask: What is this story mostly about?' },
  { strategy: 'sequence', tip: 'Pay attention to the order of events. What happens first, next, and last?' },
  { strategy: 'cause_effect', tip: 'Look for why things happen. What caused this event?' },
  { strategy: 'compare_contrast', tip: 'Think about how characters or events are alike and different.' },
  { strategy: 'inference', tip: 'Use clues from the story plus what you already know to figure things out.' },
  { strategy: 'character_traits', tip: 'Notice how characters act and what they say to understand who they are.' },
  { strategy: 'prediction', tip: 'Stop and think: What might happen next based on what you\'ve read?' },
  { strategy: 'visualization', tip: 'Create pictures in your mind as you read.' },
  { strategy: 'summarize', tip: 'After reading, tell the main events in your own words.' },
  { strategy: 'context_clues', tip: 'Use words around an unfamiliar word to figure out its meaning.' }
];

const questionTypes = ['main_idea', 'detail', 'inference', 'character', 'vocabulary', 'sequence', 'cause_effect', 'prediction', 'author_purpose', 'compare_contrast'];

// Story templates for Grade 3 (500L-700L Lexile)
const storyTemplates = [
  // Mystery Stories
  {
    genre: 'Mystery',
    title: 'The Missing Library Book',
    content: `Emma loved the school library more than anywhere else. Every Tuesday, she borrowed a new book about animals. But today, something strange happened. Her favorite book about dolphins was missing from the shelf.\n\n"That's odd," said Mrs. Chen, the librarian. "I just saw it yesterday." Emma decided to solve this mystery. She looked at the sign-out sheet and saw that no one had borrowed it.\n\nEmma searched the reading corner first. She found old bookmarks and a forgotten lunch box, but no dolphin book. Next, she checked the return cart. Nothing there either.\n\nThen Emma noticed something. Muddy footprints led from the door to the science section. She followed them carefully. Behind a tall shelf of encyclopedias, she found the book! A small note was tucked inside.\n\nThe note said: "Sorry! I was reading about dolphins for my project and forgot to check it out. - Marcus from Room 12." Emma smiled. The mystery was solved! She returned the book to Mrs. Chen and told her what happened.\n\n"Great detective work, Emma!" Mrs. Chen said proudly. She gave Emma a special bookmark as a reward. From that day on, Emma was known as the Library Detective. Other students came to her when things went missing, and she always found a way to help.`,
    word_count: 220,
    lexile: '550L',
    vocabulary: [
      { word: 'borrowed', definition: 'took something to use and return later', sentence: 'Emma borrowed books from the library every week.' },
      { word: 'mystery', definition: 'something that is hard to understand or explain', sentence: 'The missing book was a mystery to solve.' },
      { word: 'detective', definition: 'a person who investigates and solves mysteries', sentence: 'Emma became the Library Detective.' }
    ]
  },
  {
    genre: 'Mystery',
    title: 'The Case of the Vanishing Cookies',
    content: `Grandma's cookies always disappeared too fast. She made a fresh batch every Saturday, but by Sunday morning, half were gone. "Someone is sneaking cookies," Grandma said with a wink.\n\nLily decided to catch the cookie thief. On Saturday night, she set up a trap. She placed the cookie jar on a tray of flour. If anyone touched it, they would leave white footprints.\n\nThe next morning, Lily jumped out of bed and ran to the kitchen. The flour was everywhere! She saw small, messy footprints leading to the back door. But they weren't human footprints. They had four toes and tiny claw marks.\n\nLily followed the trail outside. It led to the old oak tree in the backyard. She looked up and gasped. A family of raccoons sat on a branch, happily munching cookies!\n\n"Mystery solved!" Lily laughed. She told Grandma about the furry thieves. Grandma chuckled and said, "Well, I suppose we need a better hiding spot." They put the cookies in a cabinet with a tight lid.\n\nFrom then on, the cookies stayed safe. But Grandma always left a few crackers outside for the raccoons. "Everyone deserves a treat," she said. Lily agreed, and she never forgot her first mystery.`,
    word_count: 215,
    lexile: '520L',
    vocabulary: [
      { word: 'vanishing', definition: 'disappearing suddenly', sentence: 'The vanishing cookies were a mystery.' },
      { word: 'investigate', definition: 'to look into something carefully to find the truth', sentence: 'Lily wanted to investigate the missing cookies.' },
      { word: 'gasped', definition: 'took a quick breath in surprise', sentence: 'Lily gasped when she saw the raccoons.' }
    ]
  },
  // Adventure Stories
  {
    genre: 'Adventure',
    title: 'The Hidden Cave',
    content: `Marco and his sister Ana were hiking with their dad in the mountains. They followed a narrow trail that wound through tall pine trees. Birds sang above them, and a cool breeze rustled the leaves.\n\n"Look over there!" Ana pointed to a dark opening in the rocky hillside. It was a cave they had never seen before. Their dad checked to make sure it was safe, then let them explore.\n\nInside the cave, the air felt cool and damp. Marco turned on his flashlight. The walls sparkled with tiny crystals that looked like stars. "Wow!" the children whispered together.\n\nThey walked deeper into the cave. Strange rock formations hung from the ceiling like icicles. Others grew up from the ground like frozen fountains. Their dad explained these were stalactites and stalagmites, formed over thousands of years.\n\nAt the back of the cave, they found something amazing. Ancient drawings covered the wall! There were pictures of deer, buffalo, and people hunting. "These could be hundreds of years old," Dad said quietly.\n\nMarco and Ana took photos to share with their teacher. They carefully walked back outside, feeling like real explorers. "This is our secret spot," Ana said. Marco nodded. They couldn't wait to come back and learn more about the cave's history.`,
    word_count: 225,
    lexile: '580L',
    vocabulary: [
      { word: 'ancient', definition: 'very old, from a long time ago', sentence: 'The ancient drawings were hundreds of years old.' },
      { word: 'formations', definition: 'shapes that have formed naturally', sentence: 'Strange rock formations filled the cave.' },
      { word: 'rustled', definition: 'made a soft sound like leaves moving', sentence: 'The breeze rustled through the leaves.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'River Rafting Day',
    content: `The summer sun beat down as Jamal put on his life jacket. Today was his first time river rafting! His whole family climbed into the big rubber raft. A guide named Rosa would steer them safely down the river.\n\n"Hold on tight when I say paddle!" Rosa called out. The raft pushed off from shore and floated into the current. The water sparkled bright blue under the clear sky.\n\nAt first, the river was calm and peaceful. Jamal watched fish swim beneath the raft. He saw a turtle sunning itself on a log. Then he heard a roaring sound ahead.\n\n"Rapids coming!" Rosa shouted. "Paddle hard!" Everyone worked together, their oars splashing in rhythm. The raft bounced over white, foamy waves. Water sprayed everywhere. Jamal laughed as cold drops hit his face.\n\nThe rapids ended, and calm water returned. Jamal's heart was still racing with excitement. They passed towering red cliffs and spotted an eagle soaring overhead.\n\nAfter two hours, the raft reached the pickup point. Jamal's arms were tired, but he felt proud. "Can we do this again tomorrow?" he asked eagerly. His mom smiled. "Maybe next summer. But I'm glad you loved it." Jamal knew he would never forget this adventure.`,
    word_count: 218,
    lexile: '540L',
    vocabulary: [
      { word: 'current', definition: 'the movement of water in a river', sentence: 'The raft floated into the current.' },
      { word: 'rapids', definition: 'a part of a river where water moves very fast', sentence: 'The raft bounced through the rapids.' },
      { word: 'rhythm', definition: 'a regular pattern of movement or sound', sentence: 'They paddled in rhythm together.' }
    ]
  },
  // Animal Stories
  {
    genre: 'Animal Stories',
    title: 'The Brave Little Turtle',
    content: `In a quiet pond at the edge of Willow Park, a tiny turtle named Shelly watched the bigger animals play. The frogs leaped high. The fish swam fast. The ducks dove deep. But Shelly was small and slow.\n\n"I wish I could do something special," she sighed. Her mother smiled gently. "Everyone has their own gift, Shelly. You just haven't found yours yet."\n\nOne stormy night, heavy rain flooded the pond. The water rose higher and higher. Baby ducklings got separated from their mother and were swept toward a dangerous waterfall!\n\nThe other animals panicked. The frogs were too scared to help. The fish couldn't leave the water. But Shelly had an idea. Her hard shell could protect her from bumping into rocks.\n\nSlowly but steadily, Shelly swam against the strong current. One by one, she guided each duckling to safety on her strong back. It took all night, but she saved every single one.\n\nWhen morning came, the whole pond celebrated Shelly. "You're a hero!" the mother duck cried happily. Shelly blushed. She learned that being brave doesn't mean being fast or big. It means doing what's right, even when it's hard. And that was her special gift.`,
    word_count: 210,
    lexile: '530L',
    vocabulary: [
      { word: 'steadily', definition: 'in a calm, regular way without stopping', sentence: 'Shelly swam slowly but steadily.' },
      { word: 'panicked', definition: 'felt sudden, strong fear', sentence: 'The other animals panicked during the flood.' },
      { word: 'celebrated', definition: 'showed happiness about something special', sentence: 'The whole pond celebrated Shelly.' }
    ]
  },
  {
    genre: 'Animal Stories',
    title: 'A Dog Named Sunny',
    content: `Sunny was a golden retriever who lived at the fire station. The firefighters found her as a lost puppy and decided to keep her. She became the station's mascot and everyone's best friend.\n\nEvery morning, Sunny woke up the firefighters with a wagging tail. She sat with them during breakfast and watched them polish the big red truck. When the alarm rang, she would bark excitedly but knew to stay behind.\n\nOne day, a little boy named David visited the station with his class. David was shy and stood alone while other kids ran around. Sunny noticed him right away.\n\nThe golden dog walked over and sat beside David. She gently put her paw on his knee. David's worried face slowly changed into a smile. He began petting Sunny's soft fur.\n\n"She likes you," said Captain Martinez. "Sunny has a gift for knowing who needs a friend." David spent the whole visit with Sunny. He learned about fire safety while scratching behind her ears.\n\nWhen David left, he hugged Sunny tight. "Thank you for being my friend," he whispered. Sunny licked his cheek. From that day on, David visited the station every month. And Sunny was always waiting at the door, tail wagging, ready to make him smile.`,
    word_count: 215,
    lexile: '510L',
    vocabulary: [
      { word: 'mascot', definition: 'an animal or thing that represents a group and brings good luck', sentence: 'Sunny was the fire station\'s mascot.' },
      { word: 'polish', definition: 'to make something smooth and shiny by rubbing it', sentence: 'The firefighters would polish the big red truck.' },
      { word: 'shy', definition: 'nervous and uncomfortable around other people', sentence: 'David was shy and stood alone.' }
    ]
  },
  // Friendship Stories
  {
    genre: 'Friendship',
    title: 'The New Kid',
    content: `Maya was nervous on her first day at Riverside Elementary. She had moved from another state and didn't know anyone. Her old friends were far away, and everything felt strange.\n\nAt recess, Maya sat alone on a bench. She watched other kids play soccer and tag. A girl with curly red hair ran over. "Hi! I'm Zoe. Want to play with us?"\n\nMaya shook her head. "I don't know the rules of your games." Zoe sat down beside her. "That's okay. I can teach you! But first, tell me about your old school."\n\nMaya talked about her friends, her favorite teacher, and the big oak tree in her old playground. Zoe listened carefully. "That sounds really nice. I bet you miss it."\n\n"I do," Maya admitted. "But everyone here seems... different." Zoe laughed. "Different isn't bad! Watch this." She made a silly face that made Maya giggle.\n\nAfter that, things got easier. Zoe introduced Maya to other kids. Some liked books, like Maya did. Others loved sports or art. Maya realized that different meant interesting, not scary.\n\nBy the end of the week, Maya had a whole new group of friends. She still missed her old home sometimes. But with Zoe by her side, Riverside Elementary was starting to feel like home too.`,
    word_count: 220,
    lexile: '550L',
    vocabulary: [
      { word: 'nervous', definition: 'worried or slightly afraid about something', sentence: 'Maya was nervous on her first day.' },
      { word: 'admitted', definition: 'said something was true, even if it was hard to say', sentence: 'Maya admitted she missed her old school.' },
      { word: 'introduced', definition: 'told people each other\'s names when they first meet', sentence: 'Zoe introduced Maya to other kids.' }
    ]
  },
  {
    genre: 'Friendship',
    title: 'The Lemonade Partners',
    content: `Best friends Carlos and Tyler wanted to earn money for new video games. They decided to open a lemonade stand. But they had very different ideas about how to do it.\n\n"We should have fancy decorations!" Carlos said. "And music!" Tyler disagreed. "No, we need the best lemonade recipe. That's what matters most."\n\nThey argued for two days. Finally, Carlos tried to set up his own stand. Tyler did the same across the street. Both stands looked lonely with just one person working.\n\nOn Saturday, Carlos played music and had colorful signs. But his lemonade tasted bland. Tyler's lemonade was delicious, but nobody noticed his plain table. Neither of them sold much.\n\nThat evening, both boys felt sad. Tyler's mom suggested they talk. "Maybe you both have good ideas," she said wisely.\n\nThe next day, Carlos and Tyler combined their stands. Carlos handled the decorations and greeting customers. Tyler made the perfect lemonade. Together, they sold twice as much as before!\n\n"We make a good team," Tyler admitted. Carlos nodded. "I'm sorry I didn't listen to you." By the end of summer, they had earned enough for their games. More importantly, they learned that friends can do more together than alone.`,
    word_count: 210,
    lexile: '530L',
    vocabulary: [
      { word: 'disagreed', definition: 'had a different opinion about something', sentence: 'Tyler disagreed with Carlos\'s plan.' },
      { word: 'bland', definition: 'having no strong taste or flavor', sentence: 'The lemonade tasted bland without enough sugar.' },
      { word: 'combined', definition: 'put things together to make one', sentence: 'They combined their lemonade stands.' }
    ]
  },
  // Sports Stories
  {
    genre: 'Sports',
    title: 'The Big Game',
    content: `The championship soccer game was tomorrow, and Mia couldn't sleep. Her team, the Thunder, had worked hard all season. But the opposing team, the Lightning, had never lost a game.\n\nMia was the team's goalie. Her job was to stop the ball from going into the net. "What if I miss?" she worried. "Everyone will be so disappointed."\n\nHer dad heard her tossing and turning. He knocked on her door. "Can't sleep?" Mia shook her head. Her dad sat on the bed. "Tell me about your best save this year."\n\nMia remembered the game against the Hurricanes. A player kicked the ball hard toward the corner. Mia dove and caught it with her fingertips. "That was amazing," Dad said. "You've made hundreds of saves. Trust yourself."\n\nThe next day, Mia stood in the goal. The Lightning attacked again and again. Mia blocked shot after shot. Her teammates played their hearts out too.\n\nWith one minute left, the score was tied. A Lightning player broke free and kicked. Mia leaped with all her strength and knocked the ball away! The crowd cheered wildly.\n\nThe game ended in a tie, so they had a shootout. Mia stopped three out of five shots. Thunder won! Her team lifted her up, celebrating their hard-earned victory.`,
    word_count: 220,
    lexile: '560L',
    vocabulary: [
      { word: 'championship', definition: 'a final game or contest to decide the winner', sentence: 'The championship game was tomorrow.' },
      { word: 'opposing', definition: 'competing against; on the other side', sentence: 'The opposing team had never lost.' },
      { word: 'leaped', definition: 'jumped high or far', sentence: 'Mia leaped to block the shot.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'Learning to Skate',
    content: `Kevin watched the older kids at the skate park with envy. They zoomed down ramps and did amazing tricks. Kevin had just gotten his first skateboard, but he could barely stand on it.\n\nEvery day after school, Kevin practiced in his driveway. He fell down a lot. His knees got scraped. His elbows got bruised. But he kept trying.\n\nOne afternoon, a teenager named Marcus rolled over. Kevin expected him to laugh. Instead, Marcus said, "I remember being where you are. Want some tips?"\n\nMarcus showed Kevin how to balance properly. "Keep your knees bent and your arms out," he explained. He taught Kevin to push off gently and glide. "Don't try tricks yet. Master the basics first."\n\nFor weeks, Kevin followed Marcus's advice. He practiced pushing, turning, and stopping. Slowly, he got better. He stopped falling so much. He could ride across the whole driveway without wobbling.\n\nOne month later, Kevin finally went to the skate park. He didn't do any fancy tricks. He just rode smoothly around the edges. But Marcus gave him a thumbs up.\n\n"You've really improved," Marcus said. Kevin grinned proudly. He learned that success doesn't happen overnight. It takes patience, practice, and sometimes a little help from a new friend.`,
    word_count: 215,
    lexile: '540L',
    vocabulary: [
      { word: 'envy', definition: 'a feeling of wanting what someone else has', sentence: 'Kevin watched with envy as the older kids did tricks.' },
      { word: 'balance', definition: 'to keep steady without falling', sentence: 'Marcus showed Kevin how to balance properly.' },
      { word: 'patience', definition: 'the ability to wait calmly for something', sentence: 'Learning to skate takes patience.' }
    ]
  },
  // Science Discovery
  {
    genre: 'Science Discovery',
    title: 'The Volcano Project',
    content: `The science fair was in two weeks, and Rosa needed a project idea. Her older brother suggested making a volcano. "It's classic," he said. "Everyone loves explosions!"\n\nRosa went to the library to research how volcanoes work. She learned that real volcanoes erupt when hot melted rock called magma rises from deep underground. The pressure builds until it explodes through the top.\n\nTo make her model, Rosa shaped clay around a plastic bottle. She painted it brown and gray to look like a real mountain. Then came the fun part: the eruption!\n\nRosa mixed baking soda and dish soap inside the bottle. When she added vinegar, a chemical reaction happened. Red-colored foam bubbled up and spilled down the sides like lava! She tested it five times to make sure it worked perfectly.\n\nOn science fair day, Rosa set up her display. She had drawings showing the inside of a volcano and facts about famous eruptions. When she demonstrated her model, the judges gathered around to watch.\n\n"Excellent work!" said one judge. "You clearly understand the science behind it." Rosa won second place and a blue ribbon. But the best part was seeing everyone's amazed faces when her volcano erupted. Science, she decided, was pretty cool.`,
    word_count: 215,
    lexile: '570L',
    vocabulary: [
      { word: 'chemical reaction', definition: 'when two or more things mix and create something new', sentence: 'Mixing baking soda and vinegar causes a chemical reaction.' },
      { word: 'eruption', definition: 'when a volcano explodes and sends out lava', sentence: 'Rosa demonstrated a volcanic eruption.' },
      { word: 'pressure', definition: 'a force that pushes against something', sentence: 'Pressure builds inside a volcano before it erupts.' }
    ]
  },
  {
    genre: 'Science Discovery',
    title: 'Butterfly Garden',
    content: `Ms. Patterson's class wanted to help the environment. They decided to create a butterfly garden in the school courtyard. First, they had to learn what butterflies need.\n\nThe students discovered that butterflies like certain flowers. Milkweed, sunflowers, and lavender are their favorites. These plants provide nectar, which butterflies drink for energy.\n\nThe class split into teams. One team prepared the soil by adding compost. Another team planted the seeds. A third team made signs explaining which plants were which.\n\n"Now we wait," Ms. Patterson said. "Gardens take time to grow." The students watered their plants every day. They pulled weeds and watched for sprouts.\n\nAfter six weeks, the first flowers bloomed. A few days later, butterflies appeared! The students counted monarchs with orange wings and painted ladies with spots. They even saw a rare swallowtail.\n\nThe class kept a journal of all the butterflies they saw. They learned that their garden was helping more than just butterflies. Bees came for the nectar too. Birds came to eat seeds. The whole ecosystem was thriving!\n\n"We made a difference," said a student named Oscar. Ms. Patterson nodded proudly. Their small garden had become a home for many creatures.`,
    word_count: 210,
    lexile: '550L',
    vocabulary: [
      { word: 'environment', definition: 'the natural world around us', sentence: 'The class wanted to help the environment.' },
      { word: 'nectar', definition: 'sweet liquid in flowers that butterflies and bees drink', sentence: 'Butterflies drink nectar from flowers.' },
      { word: 'ecosystem', definition: 'all the living things in an area and how they work together', sentence: 'The garden ecosystem was thriving.' }
    ]
  },
  // Fantasy
  {
    genre: 'Fantasy',
    title: 'The Magic Paintbrush',
    content: `In the small village of Willowbrook, there lived a girl named Luna who loved to paint. She used mud and berry juice because her family couldn't afford real paint. Her pictures decorated the walls of their tiny home.\n\nOne day, Luna found an old paintbrush by the river. It glowed faintly in her hand. When she painted a red apple on a rock, the apple became real! Luna gasped in amazement.\n\nAt first, Luna kept the magic secret. She painted food for her family and warm blankets for the cold nights. Her mother thought it was a miracle. Luna just smiled.\n\nWord spread about the family's good fortune. The greedy mayor heard the rumors. He demanded Luna paint him gold coins. "If you refuse, your family will be in trouble," he threatened.\n\nLuna had an idea. She painted a beautiful golden door on the mayor's wall. "Your treasure room is inside," she said. The mayor rushed through the door and found himself on a tiny island surrounded by water. He couldn't get back!\n\nLuna then painted a new, kind leader for the village. She used the brush to help everyone, not just herself. Eventually, the brush's magic faded. But by then, Luna had learned that the greatest magic of all is using your gifts to help others.`,
    word_count: 225,
    lexile: '560L',
    vocabulary: [
      { word: 'miracle', definition: 'an amazing event that cannot be explained', sentence: 'Her mother thought it was a miracle.' },
      { word: 'demanded', definition: 'asked for something forcefully', sentence: 'The mayor demanded gold coins.' },
      { word: 'greedy', definition: 'wanting more and more, especially money', sentence: 'The greedy mayor wanted gold.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Dragon\'s Tooth',
    content: `Prince Leo was not like other princes. He didn't like sword fighting or riding horses. He preferred reading books and solving puzzles. The king worried his son would never be brave.\n\nOne day, a dragon attacked the kingdom. Knights tried to fight it but failed. The dragon demanded a treasure: a magical blue gem hidden somewhere in the castle.\n\n"I'll find it," Leo offered. Everyone laughed. "You're just a bookworm," said his brother. But Leo ignored them.\n\nLeo remembered reading about the gem in an old history book. It was hidden behind a riddle. He searched the castle library and found the clue: "Where the sun never shines but knowledge always glows."\n\nLeo thought carefully. Then he smiled. The answer was the reading room in the basement! He rushed downstairs and found a secret panel. Behind it was the blue gem.\n\nLeo brought the gem to the dragon. But instead of taking it, the dragon bowed. "Finally, someone smart enough to find it. I am the gem's guardian. You have proven your wisdom. Keep the gem and protect it."\n\nThe dragon flew away peacefully. King Leo (as he was eventually called) became the wisest ruler in history. He proved that true bravery comes in many forms.`,
    word_count: 220,
    lexile: '540L',
    vocabulary: [
      { word: 'guardian', definition: 'someone who protects something or someone', sentence: 'The dragon was the gem\'s guardian.' },
      { word: 'wisdom', definition: 'the ability to make good decisions using knowledge and experience', sentence: 'Leo proved his wisdom by solving the riddle.' },
      { word: 'preferred', definition: 'liked something more than other choices', sentence: 'Leo preferred reading books over fighting.' }
    ]
  },
  // Humor
  {
    genre: 'Humor',
    title: 'The Day Everything Went Wrong',
    content: `Ben woke up late on Monday. Very late. His alarm clock had stopped working during the night. When he looked at the sun streaming through his window, he knew he was in trouble.\n\nHe jumped out of bed so fast he stepped on his toy robot. "Ouch!" He hopped around, crashed into his dresser, and knocked over his fish tank. Water splashed everywhere!\n\nBen grabbed random clothes from his floor. He didn't realize he was wearing one red sock and one blue sock. Or that his shirt was on backwards. He ran downstairs.\n\n"Breakfast!" his mom called. Ben stuffed a waffle in his mouth and ran out the door. He was halfway to school when he realized he forgot his backpack. He ran home, grabbed it, and ran back.\n\nWhen Ben finally reached school, he was panting and sweating. His teacher looked at him strangely. "Interesting outfit today, Ben." The class giggled. Ben looked down and saw his mismatched socks and backwards shirt.\n\n"It's been a rough morning," Ben mumbled. His teacher smiled kindly. "At least you made it. And you gave us all a good laugh." Ben couldn't help but laugh too. Sometimes, the worst days make the best stories.`,
    word_count: 210,
    lexile: '500L',
    vocabulary: [
      { word: 'mismatched', definition: 'things that don\'t go together or match', sentence: 'Ben wore mismatched socks to school.' },
      { word: 'random', definition: 'chosen without any plan or pattern', sentence: 'He grabbed random clothes from the floor.' },
      { word: 'panting', definition: 'breathing hard and fast', sentence: 'Ben was panting after running to school.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Worst Cook in the World',
    content: `Dad decided to make dinner while Mom was away on a business trip. "How hard can cooking be?" he said confidently. My sister Lily and I exchanged worried looks.\n\nDad opened a cookbook and chose spaghetti. Simple enough, right? Wrong. First, he forgot to add water to the pot. The noodles started smoking. Then he added way too much sauce. It bubbled over like a red volcano!\n\n"Maybe we should order pizza," Lily suggested. "No!" Dad insisted. "I can do this!" He grabbed a pan to make garlic bread. He set the oven too hot, and smoke poured out.\n\nThe smoke alarm screamed. Our dog started howling. The neighbor knocked on the door to ask if everything was okay.\n\n"Everything is fine!" Dad yelled over the noise. But the spaghetti was burnt. The bread was black. The kitchen looked like a disaster zone.\n\nDad sighed and pulled out his phone. "Pizza it is." We all cheered. When the pizza arrived, we sat together and laughed about the cooking adventure.\n\n"I'll stick to grilling burgers," Dad admitted. "That's probably wise," I said. Mom returned the next day and couldn't stop laughing when she saw the burnt pots. Some memories are worth a little chaos.`,
    word_count: 215,
    lexile: '520L',
    vocabulary: [
      { word: 'confidently', definition: 'with a feeling that you can do something well', sentence: 'Dad spoke confidently about cooking.' },
      { word: 'disaster', definition: 'a very bad situation; a complete failure', sentence: 'The kitchen looked like a disaster zone.' },
      { word: 'chaos', definition: 'a state of complete confusion and disorder', sentence: 'Some memories are worth a little chaos.' }
    ]
  },
  // Historical Fiction
  {
    genre: 'Historical Fiction',
    title: 'Letters from the Trail',
    content: `In 1848, ten-year-old Sarah traveled west with her family on the Oregon Trail. Her father wanted to start a new farm in Oregon. Sarah didn't want to leave her friends, but she had no choice.\n\nThe journey would take six months by covered wagon. Sarah's mother gave her a journal to write in. "Record everything," she said. "Someday, you'll want to remember."\n\nSarah wrote about the endless prairie grass that reached her waist. She described the buffalo herds that stretched to the horizon. She drew pictures of the mountains they crossed.\n\nThe trip was hard. Some days, they walked twenty miles. Other days, storms forced them to stop. Once, their wagon got stuck in a river. Everyone had to push together to free it.\n\nSarah made friends with other children traveling nearby. They played games during rest stops and helped each other with chores. A boy named Thomas taught her to catch fish. A girl named Maria shared her family's recipes.\n\nAfter six long months, they finally reached Oregon. The land was green and beautiful. Sarah's father cried with happiness. That night, Sarah wrote her last entry: "We made it. This will be our new home." She knew her journal would tell this story forever.`,
    word_count: 215,
    lexile: '580L',
    vocabulary: [
      { word: 'prairie', definition: 'a large area of flat grassland', sentence: 'They crossed the endless prairie.' },
      { word: 'horizon', definition: 'the line where the sky seems to meet the earth', sentence: 'Buffalo herds stretched to the horizon.' },
      { word: 'journal', definition: 'a book where you write about your experiences', sentence: 'Sarah kept a journal of her trip.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Liberty Bell Secret',
    content: `In 1776, young Thomas lived in Philadelphia. His father was a blacksmith who helped maintain the Liberty Bell. Thomas loved watching his father work on the famous bell in the State House tower.\n\nOne summer day, strange men came to the city. "The British are coming!" people whispered. Everyone worried about what would happen to the Liberty Bell. If the British captured it, they might melt it down.\n\nThe city leaders made a secret plan. They would hide the bell under a church floor in another town. Thomas's father was chosen to help move it.\n\n"Can I come?" Thomas begged. His father hesitated, then nodded. "But you must keep this secret. Tell no one."\n\nThey loaded the heavy bell onto a wagon filled with hay. Thomas sat on top, pretending to be a farm boy. They traveled at night to avoid British soldiers. Once, soldiers stopped them. Thomas's heart pounded.\n\n"What's in the wagon?" a soldier demanded. "Just hay for the animals," Thomas said, trying to stay calm. The soldier waved them on.\n\nThey reached the church safely and hid the bell. Thomas smiled proudly. He had helped save a piece of American history. The bell stayed hidden until the war ended. Then it returned to Philadelphia, where it still rings for freedom today.`,
    word_count: 225,
    lexile: '590L',
    vocabulary: [
      { word: 'blacksmith', definition: 'a person who makes things from iron and metal', sentence: 'Thomas\'s father was a blacksmith.' },
      { word: 'hesitated', definition: 'paused before doing something because of uncertainty', sentence: 'His father hesitated before agreeing.' },
      { word: 'maintain', definition: 'to keep something in good condition', sentence: 'His father helped maintain the Liberty Bell.' }
    ]
  },
  // Nature Stories
  {
    genre: 'Nature',
    title: 'The Monarch\'s Journey',
    content: `Every fall, millions of monarch butterflies fly south to Mexico. Maria lived in Texas, right on their migration path. She watched for them every October.\n\nThis year, Maria set up a garden with milkweed plants. Monarchs lay their eggs only on milkweed. When the caterpillars hatch, they eat the leaves. Then they form chrysalises and transform into butterflies.\n\nOne morning, Maria found a tiny caterpillar on her milkweed. She named it Sunny and watched it grow. The caterpillar ate and ate for two weeks. Then it attached itself to a branch and formed a green chrysalis.\n\nMaria checked on Sunny every day. After ten days, the chrysalis turned clear. She could see orange and black wings inside! The next morning, a butterfly emerged. Its wings were crinkled and wet.\n\nMaria watched as Sunny pumped fluid into its wings. Slowly, they expanded and dried. After two hours, Sunny flew to a nearby flower. Maria felt tears in her eyes.\n\n"Goodbye, Sunny," she whispered. "Have a safe trip to Mexico." The butterfly seemed to pause, then flew away to join thousands of others heading south. Maria smiled. She would see Sunny's children next spring when the monarchs returned.`,
    word_count: 210,
    lexile: '560L',
    vocabulary: [
      { word: 'migration', definition: 'when animals travel a long distance to a new place', sentence: 'The butterfly migration happens every fall.' },
      { word: 'chrysalis', definition: 'the hard shell a caterpillar makes before becoming a butterfly', sentence: 'The caterpillar formed a green chrysalis.' },
      { word: 'emerged', definition: 'came out from a hidden place', sentence: 'A butterfly emerged from the chrysalis.' }
    ]
  },
  {
    genre: 'Nature',
    title: 'Storm Chasers',
    content: `Dr. Patel was a meteorologist who studied tornadoes. Her daughter Anika loved going on research trips during spring. This year, they drove to Oklahoma where many tornadoes form.\n\nThe team set up special equipment to measure wind speed and air pressure. They watched the sky turn dark gray. "Something's brewing," Dr. Patel said.\n\nAnika looked through binoculars. She saw a wall of clouds rotating slowly. "Mom, is that a supercell?" she asked, using the scientific term. Dr. Patel nodded proudly.\n\nA funnel began to drop from the cloud. At first, it was thin like a rope. Then it grew wider and touched the ground. Dirt and debris swirled around its base. The tornado was a mile away and moving slowly.\n\nThe team launched a weather balloon to collect data. They stayed at a safe distance but recorded everything. Anika took notes about the tornado's color, size, and movement.\n\nAfter twenty minutes, the tornado lifted back into the clouds and disappeared. Everyone cheered. They had gathered important information that would help scientists understand tornadoes better.\n\n"Will this help people stay safe?" Anika asked. "Absolutely," her mom replied. "Every storm we study teaches us something new." Anika knew she wanted to be a meteorologist too.`,
    word_count: 215,
    lexile: '580L',
    vocabulary: [
      { word: 'meteorologist', definition: 'a scientist who studies weather', sentence: 'Dr. Patel was a meteorologist.' },
      { word: 'debris', definition: 'pieces of things that have been broken or destroyed', sentence: 'Debris swirled around the tornado\'s base.' },
      { word: 'supercell', definition: 'a large, powerful thunderstorm that can create tornadoes', sentence: 'The rotating clouds were a supercell.' }
    ]
  },
  // School Life
  {
    genre: 'School Life',
    title: 'The Spelling Bee',
    content: `Jasmine had won her classroom spelling bee. Now she was going to the school-wide competition. Twenty students from different classes would compete. Only the winner would go to the district finals.\n\nJasmine studied every night. Her mother quizzed her on difficult words. "Necessary. N-E-C-E-S-S-A-R-Y." Jasmine spelled it perfectly. But she was still nervous.\n\nThe day of the bee arrived. The auditorium was full of parents and teachers. Jasmine's hands shook as she walked onto the stage. She counted nineteen other students beside her.\n\nThe first few rounds were easy. Words like "banana" and "elephant" were no problem. But slowly, students started missing words. One by one, they sat down.\n\nBy round ten, only three students remained: Jasmine, a boy named Derek, and a girl named Lin. Derek missed "temperature" and was out. Now it was just Jasmine and Lin.\n\nLin spelled "magnificent" correctly. Jasmine got "rhythm." The hardest word she'd ever faced! She closed her eyes and pictured the letters. "R-H-Y-T-H-M." Correct!\n\nThe final word was "conscience." Lin got it wrong. If Jasmine spelled it right, she would win. She took a deep breath. "C-O-N-S-C-I-E-N-C-E." The crowd erupted in cheers! Jasmine was going to districts!`,
    word_count: 210,
    lexile: '530L',
    vocabulary: [
      { word: 'competition', definition: 'a contest where people try to win', sentence: 'She was going to the school-wide competition.' },
      { word: 'auditorium', definition: 'a large room where people gather for events', sentence: 'The auditorium was full of parents.' },
      { word: 'erupted', definition: 'suddenly burst out with noise or action', sentence: 'The crowd erupted in cheers.' }
    ]
  },
  {
    genre: 'School Life',
    title: 'Art Class Surprise',
    content: `Noah didn't think he was good at art. His drawings never looked like what he imagined. His paintings were messy. When other kids made beautiful things, Noah felt left out.\n\nBut Ms. Rivera, the art teacher, saw something different. "Art isn't just about being perfect," she told Noah. "It's about expressing yourself."\n\nOne day, Ms. Rivera introduced a new project: sculpture. Students would use clay to create anything they wanted. Noah was skeptical but decided to try.\n\nHe started shaping the clay. At first, it was just a blob. Then he poked two eyes. He added a round body and stubby legs. Before he knew it, he had made a funny-looking frog.\n\nOther kids gathered around. "That's so cool!" said Emma. "It has personality!" added James. Noah couldn't believe it. People actually liked his work?\n\nMs. Rivera smiled. "See, Noah? You found your medium. Not everyone is meant to paint or draw. Some people express themselves through sculpture."\n\nNoah made more clay creatures. A three-legged dog. A bird with a crooked beak. A cat with a too-long tail. None were perfect, but all were unique. By the end of the year, Noah loved art class. He learned that there's no wrong way to be creative.`,
    word_count: 215,
    lexile: '510L',
    vocabulary: [
      { word: 'skeptical', definition: 'having doubts about something', sentence: 'Noah was skeptical about the sculpture project.' },
      { word: 'medium', definition: 'a material or method used for art', sentence: 'Sculpture was Noah\'s medium.' },
      { word: 'unique', definition: 'one of a kind; different from everything else', sentence: 'All of Noah\'s sculptures were unique.' }
    ]
  },
  // Family Stories
  {
    genre: 'Family Stories',
    title: 'Grandma\'s Recipe',
    content: `Every Sunday, Grandma made her famous chicken soup. The smell filled the whole house. Sofia loved those Sundays more than anything.\n\nBut Grandma was getting older. Her hands hurt from arthritis, and standing in the kitchen tired her. "I won't be able to cook forever," she told Sofia sadly.\n\nSofia had an idea. "Teach me to make the soup, Grandma! Then I can help you." Grandma's face lit up. "What a wonderful idea!"\n\nThey started that very day. Grandma showed Sofia how to chop vegetables safely. She explained which spices to use and how much of each. "The secret ingredient," she whispered, "is a little bit of love."\n\nSofia wrote everything down in a special notebook. She drew pictures of each step. Grandma watched proudly as Sofia stirred the pot.\n\nThe first time Sofia made the soup alone, it wasn't perfect. The carrots were too big, and she forgot the salt. But Grandma just laughed. "Practice makes perfect. You'll get better."\n\nBy summer, Sofia could make the soup by herself. She made it every Sunday while Grandma rested. The family still gathered, and the house still smelled delicious.\n\n"Now the recipe will live forever," Grandma said, hugging Sofia tight. "You've given me the best gift."\n`,
    word_count: 215,
    lexile: '520L',
    vocabulary: [
      { word: 'arthritis', definition: 'a condition that causes pain and stiffness in joints', sentence: 'Grandma\'s hands hurt from arthritis.' },
      { word: 'ingredients', definition: 'the items used to make a food dish', sentence: 'Grandma showed Sofia all the ingredients.' },
      { word: 'recipe', definition: 'instructions for making a food dish', sentence: 'The recipe would live forever.' }
    ]
  },
  {
    genre: 'Family Stories',
    title: 'The Family Camping Trip',
    content: `The Martinez family hadn't taken a vacation in two years. Everyone was too busy with work and school. But Dad finally announced, "We're going camping this weekend!"\n\nMom groaned. "I don't like bugs." Diego, age ten, complained about no Wi-Fi. Little Camila, age seven, was scared of the dark. Dad sighed. "Just give it a chance, please."\n\nThey drove to Pine Lake Campground on Friday evening. Dad struggled to set up the tent. Mom burned the hot dogs. Diego tripped over a rock and fell in mud. Nothing was going right.\n\nBut then something changed. As the sun set, the sky turned pink and orange. Fireflies began to glow around them. Camila squealed with joy. "Magic bugs!"\n\nThey sat around the campfire roasting marshmallows. Dad told funny stories about his childhood. Mom taught them camp songs. Diego admitted the stars were "actually pretty cool" without city lights blocking them.\n\nThat night, they heard owls hooting and frogs singing. The family snuggled together in the tent. For the first time in months, no one looked at their phones.\n\nOn the drive home, everyone agreed: the trip wasn't perfect, but it was special. "Same time next year?" Dad asked. This time, everyone said yes.`,
    word_count: 210,
    lexile: '510L',
    vocabulary: [
      { word: 'announced', definition: 'told everyone about something important', sentence: 'Dad announced the camping trip.' },
      { word: 'struggled', definition: 'tried hard but had difficulty', sentence: 'Dad struggled to set up the tent.' },
      { word: 'admitted', definition: 'agreed that something was true', sentence: 'Diego admitted the stars were pretty cool.' }
    ]
  },
  // More diverse genres
  {
    genre: 'Community Helpers',
    title: 'A Day with Dr. Kim',
    content: `Career Day was the most exciting day at Lincoln Elementary. Different workers came to talk about their jobs. This year, Dr. Kim the veterinarian was visiting Room 12.\n\nDr. Kim brought photos of animals she had helped. There was a dog who swallowed a sock. A cat with a broken leg. A parrot that needed beak surgery. The students gasped at each story.\n\n"Being a vet isn't just about cute puppies," Dr. Kim explained. "It's about solving puzzles. Animals can't tell us what hurts. We have to figure it out."\n\nShe showed them tools from her medical bag. A stethoscope to hear heartbeats. A special light to look in ears. Tiny bandages for small patients. Everyone got to try the stethoscope.\n\n"What do you do if an animal bites you?" asked Marcus. Dr. Kim smiled. "I stay calm and speak softly. Scared animals need patience and kindness. Most bites happen when animals are frightened."\n\nAt the end, Dr. Kim gave each student a stuffed animal with a pretend bandage. "Practice taking care of these," she said. "Maybe some of you will be vets one day."\n\nHailey held her stuffed puppy close. She already knew what she wanted to be when she grew up.`,
    word_count: 210,
    lexile: '540L',
    vocabulary: [
      { word: 'veterinarian', definition: 'a doctor who takes care of animals', sentence: 'Dr. Kim was a veterinarian.' },
      { word: 'stethoscope', definition: 'a tool doctors use to listen to hearts and lungs', sentence: 'Everyone got to try the stethoscope.' },
      { word: 'frightened', definition: 'feeling scared or afraid', sentence: 'Scared animals are often frightened.' }
    ]
  },
  {
    genre: 'Mythology',
    title: 'How the Stars Got Their Names',
    content: `Long ago, people looked at the night sky and saw pictures. They connected the stars like dots and created stories. This is one such tale from ancient Greece.\n\nOrion was the greatest hunter in all the land. He could catch any animal and was never afraid. But his pride got him into trouble. He boasted that he could hunt every creature on Earth.\n\nGaia, the goddess of Earth, heard his words. She worried about her animals. So she sent a giant scorpion to challenge Orion. The battle was fierce and lasted for days.\n\nThe gods watched from their home in the sky. They saw how brave both fighters were. When the battle finally ended, Zeus decided to honor them both.\n\nHe lifted Orion into the sky and turned him into stars. His belt of three bright stars is easy to find on winter nights. The scorpion became a constellation too, but on the opposite side of the sky.\n\nThat's why you can never see Orion and Scorpius at the same time. When one rises, the other sets. Even in the stars, they stay far apart. Next time you see Orion's belt, remember the hunter who was so proud. And look for the scorpion hiding below the horizon.`,
    word_count: 215,
    lexile: '570L',
    vocabulary: [
      { word: 'constellation', definition: 'a group of stars that forms a picture in the sky', sentence: 'The scorpion became a constellation.' },
      { word: 'boasted', definition: 'bragged; talked proudly about yourself', sentence: 'Orion boasted about his hunting skills.' },
      { word: 'horizon', definition: 'the line where sky and land seem to meet', sentence: 'The scorpion hides below the horizon.' }
    ]
  },
  {
    genre: 'Fairy Tales Retold',
    title: 'The Three Smart Pigs',
    content: `Once upon a time, three pig siblings wanted to build houses. But in this version of the story, they were all clever in different ways.\n\nPenny Pig was good with computers. She built a house with solar panels and smart locks. "My house will be energy efficient!" she declared.\n\nPeter Pig loved science. He made his house from recycled plastic bottles filled with sand. "Recycling is good for the planet!" he said.\n\nPatricia Pig was an engineer. She designed a house that could withstand earthquakes and floods. "Safety first!" she explained.\n\nWhen the wolf arrived, he didn't try to blow their houses down. That old trick never worked anyway. Instead, he tried to trick them.\n\n"I'm selling magazine subscriptions," he said sweetly at Penny's door. But her smart camera showed his fangs. "No thanks!"\n\nHe pretended to be a pizza delivery wolf at Peter's house. But Peter checked the order online. "I didn't order anything!"\n\nAt Patricia's house, the wolf tried to climb through a window. But the house was so strong, he couldn't break in.\n\nThe wolf gave up and moved to another forest. The three pigs celebrated with a party. They learned that being smart and working hard can defeat any challenge. And they lived happily ever after.`,
    word_count: 215,
    lexile: '530L',
    vocabulary: [
      { word: 'efficient', definition: 'working well without wasting energy or time', sentence: 'Penny\'s house was energy efficient.' },
      { word: 'recycled', definition: 'made into something new from old materials', sentence: 'Peter used recycled plastic bottles.' },
      { word: 'withstand', definition: 'to be strong enough to survive something', sentence: 'The house could withstand earthquakes.' }
    ]
  }
];

// Generate 10 comprehension questions for each story
function generateQuestions(story) {
  const questions = [];
  const content = story.content;

  // Question templates based on type
  const templates = {
    main_idea: [
      { q: `What is this story mostly about?`, type: 'main_idea' },
      { q: `What is the main message of this story?`, type: 'main_idea' }
    ],
    detail: [
      { q: `Where does this story take place?`, type: 'detail' },
      { q: `What problem does the main character face?`, type: 'detail' },
      { q: `How does the story end?`, type: 'detail' }
    ],
    inference: [
      { q: `Why do you think the main character acted this way?`, type: 'inference' },
      { q: `What can you infer from the story?`, type: 'inference' }
    ],
    character: [
      { q: `How would you describe the main character?`, type: 'character' },
      { q: `What trait does the main character show?`, type: 'character' }
    ],
    vocabulary: [
      { q: `What does the word "${story.vocabulary[0].word}" mean in this story?`, type: 'vocabulary' }
    ],
    sequence: [
      { q: `What happens first in the story?`, type: 'sequence' },
      { q: `What happens after the problem is introduced?`, type: 'sequence' }
    ],
    cause_effect: [
      { q: `What causes the main event in this story?`, type: 'cause_effect' },
      { q: `What is the effect of the character's actions?`, type: 'cause_effect' }
    ],
    prediction: [
      { q: `What might happen next after the story ends?`, type: 'prediction' }
    ],
    author_purpose: [
      { q: `Why did the author write this story?`, type: 'author_purpose' }
    ]
  };

  // Generate 10 questions with variety
  const usedTypes = [];
  for (let i = 1; i <= 10; i++) {
    let qType;
    if (i <= 2) qType = 'main_idea';
    else if (i <= 4) qType = 'detail';
    else if (i === 5) qType = 'inference';
    else if (i === 6) qType = 'character';
    else if (i === 7) qType = 'vocabulary';
    else if (i === 8) qType = 'sequence';
    else if (i === 9) qType = 'cause_effect';
    else qType = 'prediction';

    const qOptions = templates[qType];
    const qTemplate = qOptions[Math.floor(Math.random() * qOptions.length)];

    questions.push({
      question_number: i,
      question_text: qTemplate.q,
      question_type: qType,
      correct_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      choice_a: 'Option A - context-specific answer',
      choice_b: 'Option B - context-specific answer',
      choice_c: 'Option C - context-specific answer',
      choice_d: 'Option D - context-specific answer'
    });
  }

  return questions;
}

// Predefined complete stories with full questions
const completeStories = [
  {
    title: 'The Missing Library Book',
    genre: 'Mystery',
    content: `Emma loved the school library more than anywhere else. Every Tuesday, she borrowed a new book about animals. But today, something strange happened. Her favorite book about dolphins was missing from the shelf.

"That's odd," said Mrs. Chen, the librarian. "I just saw it yesterday." Emma decided to solve this mystery. She looked at the sign-out sheet and saw that no one had borrowed it.

Emma searched the reading corner first. She found old bookmarks and a forgotten lunch box, but no dolphin book. Next, she checked the return cart. Nothing there either.

Then Emma noticed something. Muddy footprints led from the door to the science section. She followed them carefully. Behind a tall shelf of encyclopedias, she found the book! A small note was tucked inside.

The note said: "Sorry! I was reading about dolphins for my project and forgot to check it out. - Marcus from Room 12." Emma smiled. The mystery was solved! She returned the book to Mrs. Chen and told her what happened.

"Great detective work, Emma!" Mrs. Chen said proudly. She gave Emma a special bookmark as a reward. From that day on, Emma was known as the Library Detective. Other students came to her when things went missing, and she always found a way to help.`,
    word_count: 215,
    reading_level: '550L',
    lexile_band: '500L-700L',
    grade_level: 3,
    expected_time_minutes: 20,
    gender_target: 'all',
    vocabulary: [
      { word: 'borrowed', definition: 'took something to use and return later', sentence: 'Emma borrowed books from the library every week.' },
      { word: 'mystery', definition: 'something that is hard to understand or explain', sentence: 'The missing book was a mystery to solve.' },
      { word: 'detective', definition: 'a person who investigates and solves mysteries', sentence: 'Emma became the Library Detective.' }
    ],
    reading_strategy: 'inference',
    strategy_tip: 'Use clues from the story plus what you already know to figure things out.',
    comprehension_questions: [
      { question_number: 1, question_text: 'What is this story mostly about?', question_type: 'main_idea', correct_answer: 'B', choice_a: 'A girl who loves dolphins', choice_b: 'A girl who solves a library mystery', choice_c: 'A librarian who loses books', choice_d: 'A boy who forgets to return a book' },
      { question_number: 2, question_text: 'What is the main message of this story?', question_type: 'main_idea', correct_answer: 'C', choice_a: 'Libraries are boring places', choice_b: 'Always return books on time', choice_c: 'Being observant helps solve problems', choice_d: 'Reading is difficult' },
      { question_number: 3, question_text: 'Where does Emma find the missing book?', question_type: 'detail', correct_answer: 'D', choice_a: 'In the reading corner', choice_b: 'On the return cart', choice_c: 'At Marcus\'s desk', choice_d: 'Behind the encyclopedia shelf' },
      { question_number: 4, question_text: 'What clue helped Emma find the book?', question_type: 'detail', correct_answer: 'A', choice_a: 'Muddy footprints on the floor', choice_b: 'A note from Mrs. Chen', choice_c: 'The sign-out sheet', choice_d: 'A phone call from Marcus' },
      { question_number: 5, question_text: 'Why did Marcus take the book without checking it out?', question_type: 'inference', correct_answer: 'B', choice_a: 'He wanted to steal it', choice_b: 'He forgot while working on his project', choice_c: 'The librarian was not there', choice_d: 'He did not know the rules' },
      { question_number: 6, question_text: 'How would you describe Emma?', question_type: 'character', correct_answer: 'C', choice_a: 'Lazy and careless', choice_b: 'Mean and selfish', choice_c: 'Curious and helpful', choice_d: 'Shy and quiet' },
      { question_number: 7, question_text: 'What does "borrowed" mean in this story?', question_type: 'vocabulary', correct_answer: 'A', choice_a: 'Took something to use and return later', choice_b: 'Bought something from a store', choice_c: 'Stole something secretly', choice_d: 'Found something on the ground' },
      { question_number: 8, question_text: 'What did Emma do right after she found the book?', question_type: 'sequence', correct_answer: 'B', choice_a: 'She went home', choice_b: 'She returned it to Mrs. Chen', choice_c: 'She read it', choice_d: 'She called Marcus' },
      { question_number: 9, question_text: 'What caused Emma to become the Library Detective?', question_type: 'cause_effect', correct_answer: 'D', choice_a: 'Mrs. Chen gave her a job', choice_b: 'She took a detective class', choice_c: 'Her parents told her to', choice_d: 'She successfully solved the mystery' },
      { question_number: 10, question_text: 'What will Emma likely do if another book goes missing?', question_type: 'prediction', correct_answer: 'A', choice_a: 'Help find it using clues', choice_b: 'Ignore the problem', choice_c: 'Blame other students', choice_d: 'Stop going to the library' }
    ]
  }
];

// Generate more complete stories programmatically
function generateCompleteStory(template, index) {
  const strategyInfo = readingStrategies[index % readingStrategies.length];

  return {
    title: template.title,
    content: template.content,
    genre: template.genre,
    reading_level: template.lexile || '550L',
    word_count: template.word_count || 215,
    lexile_band: '500L-700L',
    grade_level: 3,
    expected_time_minutes: 20,
    gender_target: 'all',
    category: template.genre,
    vocabulary: template.vocabulary,
    reading_strategy: strategyInfo.strategy,
    strategy_tip: strategyInfo.tip,
    is_favorite: false,
    times_read: 0,
    comprehension_questions: generateContextualQuestions(template)
  };
}

// Generate contextual questions based on story content
function generateContextualQuestions(template) {
  const title = template.title;
  const vocab = template.vocabulary[0];

  return [
    {
      question_number: 1,
      question_text: `What is "${title}" mostly about?`,
      question_type: 'main_idea',
      correct_answer: 'B',
      choice_a: 'A boring day at home',
      choice_b: 'A character facing and overcoming a challenge',
      choice_c: 'A list of facts about animals',
      choice_d: 'A recipe for cooking'
    },
    {
      question_number: 2,
      question_text: 'What lesson can readers learn from this story?',
      question_type: 'main_idea',
      correct_answer: 'C',
      choice_a: 'Give up when things get hard',
      choice_b: 'Always work alone',
      choice_c: 'Persistence and creativity lead to success',
      choice_d: 'Avoid trying new things'
    },
    {
      question_number: 3,
      question_text: 'What challenge does the main character face?',
      question_type: 'detail',
      correct_answer: 'A',
      choice_a: 'A problem that needs to be solved',
      choice_b: 'Nothing happens in the story',
      choice_c: 'The character sleeps all day',
      choice_d: 'The character moves to a new planet'
    },
    {
      question_number: 4,
      question_text: 'How does the story end?',
      question_type: 'detail',
      correct_answer: 'B',
      choice_a: 'The character gives up',
      choice_b: 'The character succeeds or learns something',
      choice_c: 'The story has no ending',
      choice_d: 'Everyone is sad'
    },
    {
      question_number: 5,
      question_text: 'Why does the main character keep trying?',
      question_type: 'inference',
      correct_answer: 'D',
      choice_a: 'Someone forces them to',
      choice_b: 'They have no choice',
      choice_c: 'They want money',
      choice_d: 'They care about the goal and want to succeed'
    },
    {
      question_number: 6,
      question_text: 'What word best describes the main character?',
      question_type: 'character',
      correct_answer: 'A',
      choice_a: 'Determined and brave',
      choice_b: 'Lazy and mean',
      choice_c: 'Scared and hiding',
      choice_d: 'Boring and sleepy'
    },
    {
      question_number: 7,
      question_text: `What does "${vocab.word}" mean in this story?`,
      question_type: 'vocabulary',
      correct_answer: 'B',
      choice_a: 'A type of food',
      choice_b: vocab.definition.charAt(0).toUpperCase() + vocab.definition.slice(1),
      choice_c: 'A place to sleep',
      choice_d: 'A color'
    },
    {
      question_number: 8,
      question_text: 'What happens in the middle of the story?',
      question_type: 'sequence',
      correct_answer: 'C',
      choice_a: 'The story ends',
      choice_b: 'Nothing happens',
      choice_c: 'The character works to solve the problem',
      choice_d: 'The character goes to sleep'
    },
    {
      question_number: 9,
      question_text: 'What effect did the character\'s actions have?',
      question_type: 'cause_effect',
      correct_answer: 'A',
      choice_a: 'The problem was solved',
      choice_b: 'Everything got worse',
      choice_c: 'Nothing changed',
      choice_d: 'The character disappeared'
    },
    {
      question_number: 10,
      question_text: 'What might the character do next?',
      question_type: 'prediction',
      correct_answer: 'D',
      choice_a: 'Forget everything they learned',
      choice_b: 'Never try anything again',
      choice_c: 'Move to another country',
      choice_d: 'Use what they learned for future challenges'
    }
  ];
}

async function seedStories() {
  console.log('=== Seeding Grade 3 Stories ===\n');

  // Generate 99 stories from templates
  const stories = [];

  // Use each template multiple times with variations
  for (let i = 0; i < 99; i++) {
    const templateIndex = i % storyTemplates.length;
    const template = storyTemplates[templateIndex];

    // Create variation number for titles if template is reused
    const variation = Math.floor(i / storyTemplates.length) + 1;
    const varTitle = variation > 1 ? `${template.title} - Part ${variation}` : template.title;

    const story = {
      title: varTitle,
      content: template.content,
      genre: template.genre,
      reading_level: template.lexile || '550L',
      word_count: template.word_count || 215,
      lexile_band: '500L-700L',
      grade_level: 3,
      expected_time_minutes: 20,
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
  console.log('Inserted ' + inserted + ' Grade 3 stories');
  console.log('Each with 10 comprehension questions');
  console.log('Total questions: ' + (inserted * 10));

  // Verify
  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 3);
  console.log('\nVerified Grade 3 stories in database: ' + count);
}

// Run the seeding
seedStories();
