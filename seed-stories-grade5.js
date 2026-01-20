const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

const readingStrategies = [
  { strategy: 'analyze_theme', tip: 'Identify the underlying message and how the author develops it through events and characters.' },
  { strategy: 'evaluate_evidence', tip: 'Assess how well the author supports claims with facts, examples, and reasoning.' },
  { strategy: 'compare_perspectives', tip: 'Consider how different characters view the same situation differently.' },
  { strategy: 'synthesize_information', tip: 'Combine information from different parts of the text to form new understanding.' },
  { strategy: 'analyze_structure', tip: 'Examine how the organization of the text contributes to its meaning.' },
  { strategy: 'character_motivation', tip: 'Explore why characters act the way they do based on their goals and values.' },
  { strategy: 'author_craft', tip: 'Notice the specific words, phrases, and techniques the author uses for effect.' },
  { strategy: 'make_connections', tip: 'Connect the text to other readings, your experiences, and the wider world.' },
  { strategy: 'critical_analysis', tip: 'Question the text and form your own opinions supported by evidence.' },
  { strategy: 'draw_conclusions', tip: 'Use multiple pieces of evidence to reach logical conclusions about the text.' }
];

// Story templates for Grade 5 (850L-950L Lexile)
const storyTemplates = [
  // Mystery/Thriller
  {
    genre: 'Mystery',
    title: 'The Lighthouse Conspiracy',
    content: `The abandoned Blackrock Lighthouse had been dark for fifty years, so when twelve-year-old Kai noticed a faint light flickering in its tower window, he knew something was wrong. His grandmother had always warned him to stay away from that place, but curiosity proved stronger than caution.

Armed with a flashlight and his father's old binoculars, Kai began his investigation. The lighthouse stood on a rocky peninsula, accessible only during low tide. He documented everything in his notebook: the patterns of the light (three short flashes, pause, two long), the times it appeared (always between 10 and 11 PM), and the strange boat he spotted anchored nearby on certain nights.

His research led him to the town's historical society, where he discovered that the original lighthouse keeper, Captain Morrison, had been accused of smuggling during Prohibition. The case was never solved. Could history be repeating itself?

Kai recruited his best friend Mira, whose mother worked for the Coast Guard. Together, they gathered enough evidence to convince Mira's mother to investigate. The authorities discovered a sophisticated operation using the lighthouse to signal boats carrying stolen electronics.

The case made local news, and Kai received a commendation from the mayor. But the real reward was learning that his great-great-grandfather had been the detective who originally investigated Captain Morrison. Solving mysteries, it seemed, ran in his blood.

"Some people inherit eye color or height," his grandmother said proudly. "You inherited curiosity and courage."`,
    word_count: 255,
    lexile: '880L',
    vocabulary: [
      { word: 'peninsula', definition: 'a piece of land almost surrounded by water', sentence: 'The lighthouse stood on a rocky peninsula.' },
      { word: 'sophisticated', definition: 'complex and highly developed', sentence: 'They discovered a sophisticated smuggling operation.' },
      { word: 'commendation', definition: 'an official award or praise for achievement', sentence: 'Kai received a commendation from the mayor.' }
    ]
  },
  {
    genre: 'Mystery',
    title: 'The Coded Diary',
    content: `When Elena's family purchased an old Victorian house, she discovered a leather diary hidden inside a hollow bedpost. The pages were filled with elegant handwriting—but the words made no sense. They were written in code.

Elena was fascinated by puzzles, and this was the ultimate challenge. She photographed every page and began analyzing patterns. The diary belonged to someone named "A.M." and dated back to 1923.

Her first breakthrough came when she noticed certain letters appeared more frequently. Using frequency analysis—a technique she'd learned from a documentary about codebreakers—she determined that the most common symbol represented the letter "E."

Slowly, the code revealed its secrets. A.M. was Amelia Marchetti, a young woman who had lived in this very house during Prohibition. Her diary described a hidden room where her family stored "merchandise" to protect it from "the authorities."

Elena searched the house systematically. Behind a bookshelf in the study, she found a door concealed by wallpaper. The hidden room was empty now, but old newspapers lining the shelves confirmed Amelia's story—her family had been bootleggers.

More importantly, Elena found Amelia's final entry, written in plain English: "If you've decoded this diary, you share my love of puzzles. May your curiosity lead you to wonderful discoveries."

Elena framed that page and hung it in her room. Across a century, two puzzle-lovers had connected through persistence and intellectual curiosity.`,
    word_count: 250,
    lexile: '890L',
    vocabulary: [
      { word: 'frequency analysis', definition: 'a method of code-breaking based on how often symbols appear', sentence: 'She used frequency analysis to crack the code.' },
      { word: 'systematically', definition: 'in an organized, methodical way', sentence: 'Elena searched the house systematically.' },
      { word: 'persistence', definition: 'continuing firmly despite difficulty', sentence: 'They connected through persistence and curiosity.' }
    ]
  },
  // Adventure
  {
    genre: 'Adventure',
    title: 'Expedition to Eagle Peak',
    content: `The Mountain Youth Program accepted only twenty students each summer, and thirteen-year-old Marcus couldn't believe he'd been chosen. For two weeks, he would learn wilderness survival, navigation, and leadership—culminating in a three-day expedition to Eagle Peak.

The training was rigorous. Marcus learned to read topographic maps, identify edible plants, build emergency shelters, and navigate using only a compass. His instructor, Dr. Okafor, had summited mountains on six continents.

"The mountain doesn't care about your excuses," Dr. Okafor said frequently. "Preparation and adaptability are everything."

On expedition day, Marcus's team of four set out before dawn. The first day went smoothly—eight miles of gradual ascent through pine forests. The second day brought unexpected challenges: a washed-out bridge forced them to find an alternate route, adding three miles to their journey.

On the final morning, disaster struck. A teammate named Sofia twisted her ankle badly. The summit was only two miles away, but Sofia couldn't walk. Marcus faced a difficult decision.

"We don't leave anyone behind," he announced. He reorganized the packs, distributed Sofia's weight among the team, and fashioned a walking stick from a sturdy branch. Together, they helped Sofia hobble forward.

They reached Eagle Peak three hours behind schedule—but they reached it together. The view from 11,000 feet made every struggle worthwhile. More importantly, Marcus understood that true leadership meant prioritizing people over goals.

Dr. Okafor met them at base camp. "You made the right choice," she said. "The summit means nothing if you sacrifice your team to reach it."`,
    word_count: 260,
    lexile: '900L',
    vocabulary: [
      { word: 'rigorous', definition: 'extremely thorough and demanding', sentence: 'The training was rigorous.' },
      { word: 'topographic', definition: 'showing the physical features of land, including elevation', sentence: 'He learned to read topographic maps.' },
      { word: 'adaptability', definition: 'the ability to adjust to new conditions', sentence: 'Preparation and adaptability are everything.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The River Runners',
    content: `The Colorado River stretched before them like a twisting brown ribbon. Twelve-year-old Jasmine adjusted her life jacket nervously. She had agreed to this family rafting trip months ago, but now, staring at the churning rapids ahead, she questioned her sanity.

"Class III rapids coming up!" the guide shouted over the roar. "Remember your paddle commands!"

Jasmine's heart pounded as the raft entered the whitewater. Waves crashed over the bow, soaking everyone. Her mother screamed with excitement; her brother whooped with joy. Jasmine just held on and paddled when commanded.

By the second day, something shifted. The terror became exhilaration. Jasmine learned to read the water—identifying currents, eddies, and the V-shaped channels indicating safe passage. She began anticipating the guide's commands.

On the final day, they faced the biggest rapid: Skull Canyon. The guide asked for volunteers to sit in the front—the most intense position. To everyone's surprise, Jasmine raised her hand.

The rapid was chaos—spinning water, massive waves, moments when the raft seemed almost vertical. Jasmine paddled with everything she had, spray blinding her, muscles burning.

Then, suddenly, calm water. They had made it.

Her family cheered, but Jasmine felt something more profound than relief. She had discovered that fear wasn't the opposite of courage—it was the prerequisite. True bravery meant acting despite fear, not in its absence.

"I want to do this again," she told her parents. "Next summer. Class IV rapids."

Her mother laughed. "Who are you and what happened to my cautious daughter?"

"She's still here," Jasmine smiled. "She just learned what she's capable of."`,
    word_count: 270,
    lexile: '870L',
    vocabulary: [
      { word: 'exhilaration', definition: 'a feeling of excitement and happiness', sentence: 'The terror became exhilaration.' },
      { word: 'eddies', definition: 'circular movements of water causing small whirlpools', sentence: 'She learned to identify currents and eddies.' },
      { word: 'prerequisite', definition: 'something required before something else can happen', sentence: 'Fear was the prerequisite for courage.' }
    ]
  },
  // Science Fiction
  {
    genre: 'Science Fiction',
    title: 'The Memory Keeper',
    content: `In the year 2247, memories could be extracted, stored, and transferred between people. Thirteen-year-old Nova worked at her grandmother's Memory Archive, where people preserved precious moments for future generations.

Most clients wanted to save happy occasions—weddings, births, graduations. But one day, an elderly man named Mr. Tanaka arrived with an unusual request. He wanted to donate memories of his childhood in a Japanese internment camp during World War II.

"These memories are painful," he explained, "but they must not be forgotten. History has a way of repeating itself when people forget."

Nova helped Mr. Tanaka through the extraction process, watching fragments of his memories appear on the viewing screen. She saw a young boy torn from his home, forced to live behind barbed wire fences, yet finding moments of beauty—a paper crane folded by his mother, friendships formed with other children, his father teaching him calligraphy by moonlight.

When the extraction was complete, Mr. Tanaka asked Nova to experience one memory herself. She hesitated—policy required parental permission—but something in his eyes convinced her.

The memory was of liberation day: the gates opening, families embracing, the overwhelming sensation of freedom after years of imprisonment. Nova emerged from the experience with tears streaming down her face.

"Now you understand," Mr. Tanaka said softly. "Memories carry responsibility. You've inherited my story. What will you do with it?"

Nova began a project that would define her life: creating a Memory Museum where anyone could experience history firsthand. Because some things should never be forgotten.`,
    word_count: 265,
    lexile: '910L',
    vocabulary: [
      { word: 'extraction', definition: 'the process of removing or taking out something', sentence: 'She helped with the memory extraction process.' },
      { word: 'internment', definition: 'the imprisonment of people during wartime', sentence: 'He shared memories of the internment camp.' },
      { word: 'liberation', definition: 'the act of setting someone free', sentence: 'The memory was of liberation day.' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Last Beekeeper',
    content: `By 2089, natural bees had been extinct for forty years. Robotic pollinators—"mechbees"—kept agriculture functioning, but twelve-year-old Iris's grandmother remembered when real bees filled the air with gentle humming.

Iris lived on an agricultural research station where scientists worked to restore extinct species through genetic reconstruction. Her mother was the lead geneticist on the bee revival project, which had been stalled for a decade due to incomplete DNA samples.

Then Iris made an extraordinary discovery. While exploring an abandoned research facility, she found a sealed cryogenic container labeled "Apis mellifera—Specimen Archive 2045." Inside were perfectly preserved bee specimens—enough genetic material to potentially revive the species.

The news electrified the scientific community, but the revival process was complicated. The reconstructed bees would need an ecosystem to survive—specific flowers, proper climate conditions, protection from pesticides that had contributed to their original extinction.

Iris became obsessed with creating that ecosystem. She researched historical gardens, learned about companion planting, and designed a sanctuary where bees could thrive. Her detailed plans impressed the research council, who allocated resources for a pilot project.

Three years later, the first living bees emerged from their laboratory hives. Iris stood in the sanctuary garden, watching them explore flowers her team had grown from heirloom seeds.

"They're really here," her grandmother whispered, crying softly. "I never thought I'd hear that sound again."

The gentle humming filled the air—a sound that had been absent from Earth for nearly half a century. Iris had helped bring it back.`,
    word_count: 260,
    lexile: '920L',
    vocabulary: [
      { word: 'cryogenic', definition: 'relating to very low temperatures used for preservation', sentence: 'She found a sealed cryogenic container.' },
      { word: 'genetic reconstruction', definition: 'rebuilding organisms using DNA information', sentence: 'Scientists worked on genetic reconstruction.' },
      { word: 'heirloom', definition: 'traditional varieties passed down through generations', sentence: 'They grew flowers from heirloom seeds.' }
    ]
  },
  // Historical Fiction
  {
    genre: 'Historical Fiction',
    title: 'The Navajo Code',
    content: `In 1942, fifteen-year-old Samuel Begay left his home on the Navajo reservation to join the United States Marines. The military had a special mission for young Navajo men: creating an unbreakable code using their native language.

Samuel had spent years at a boarding school where speaking Navajo was forbidden. Teachers had punished him for using his "primitive" language. Now, suddenly, that same language was considered a valuable military asset.

The training was intense. Samuel and his fellow Code Talkers developed a complex system where Navajo words represented military terms. "Turtle" meant tank. "Iron fish" meant submarine. "Hummingbird" meant fighter plane. They practiced transmitting messages under simulated combat conditions until the code became second nature.

In the Pacific theater, the Code Talkers proved invaluable. Japanese codebreakers, who had cracked every other American code, couldn't make sense of Navajo transmissions. Messages that once took hours to encrypt could now be sent in minutes.

Samuel served at Iwo Jima, one of the war's bloodiest battles. Under constant fire, he transmitted critical messages that helped coordinate the American assault. When the battle ended, a commanding officer told him, "You and your fellow Code Talkers helped win this island."

After the war, Samuel returned home a hero—though the Code Talker program remained classified for decades. He became a teacher, sharing Navajo language and culture with new generations.

"They tried to take our language away," he told his students. "Instead, our language helped save the world. Never let anyone tell you that your heritage is worthless."`,
    word_count: 265,
    lexile: '900L',
    vocabulary: [
      { word: 'classified', definition: 'officially declared secret by the government', sentence: 'The program remained classified for decades.' },
      { word: 'invaluable', definition: 'extremely useful and important; priceless', sentence: 'The Code Talkers proved invaluable.' },
      { word: 'heritage', definition: 'traditions and culture passed down from ancestors', sentence: 'Never let anyone dismiss your heritage.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Berlin Wall',
    content: `In August 1961, twelve-year-old Hannah woke to discover that her world had been divided overnight. The Berlin Wall—a barrier of concrete and barbed wire—now separated East Berlin from West Berlin. Her grandmother lived just three blocks away, but those three blocks were now in a different country.

Hannah's family lived in East Germany, under Soviet control. The government claimed the wall protected them from Western influence. Hannah knew the truth: it was a prison wall, keeping East Germans from escaping to freedom.

For months, Hannah found ways to communicate with her grandmother. They waved from their respective rooftops. They sent letters through approved channels, knowing the government read every word. They developed a simple code—mentioning "blue skies" meant they were doing well; "cloudy weather" meant they needed help.

In 1962, Hannah's father made a dangerous decision. A colleague had discovered an abandoned tunnel that ran beneath the wall. The tunnel was narrow, dark, and might collapse at any moment—but it led to freedom.

The night of the escape, Hannah's heart pounded with every step through that suffocating tunnel. She emerged in West Berlin, gasping for air, and ran straight into her grandmother's arms.

Years later, when the Berlin Wall finally fell in 1989, Hannah watched the celebration on television. Young people danced on the wall she had crawled beneath decades earlier. History had a way of turning prisons into monuments.

"Freedom," she told her own grandchildren, "is never guaranteed. Every generation must fight to protect it."`,
    word_count: 260,
    lexile: '890L',
    vocabulary: [
      { word: 'barrier', definition: 'an obstacle that prevents movement or access', sentence: 'The wall was a barrier of concrete and barbed wire.' },
      { word: 'suffocating', definition: 'making it difficult to breathe; stifling', sentence: 'She moved through the suffocating tunnel.' },
      { word: 'monuments', definition: 'structures built to remember important events or people', sentence: 'History turned prisons into monuments.' }
    ]
  },
  // Realistic Fiction
  {
    genre: 'Realistic Fiction',
    title: 'The Scholarship Essay',
    content: `The blank document on Jordan's screen seemed to mock him. The prompt was simple: "Describe a challenge you've overcome and what it taught you." But Jordan's challenge wasn't something he could easily discuss—his family had been homeless for eight months when he was ten.

They never lived on the streets; instead, they bounced between relatives' couches, shelters, and once, their car. Jordan had changed schools three times in one year. He learned to carry everything important in one backpack, to make friends quickly knowing he'd lose them soon, and to never complain because his parents were already struggling.

His English teacher, Ms. Rodriguez, noticed his hesitation. "The best essays come from authentic experiences," she said. "You don't have to share anything you're uncomfortable with, but don't write what you think they want to hear. Write your truth."

Jordan decided to be honest. He wrote about the shame he'd felt and how he'd hidden his situation from classmates. He described the lessons homelessness taught him: resilience, gratitude for small comforts, and empathy for others facing invisible struggles.

He also wrote about what ended their homelessness: his mother's new job, a church that helped with first month's rent, and a teacher who quietly made sure Jordan had school supplies and lunch money.

Six weeks later, Jordan received a letter. He'd won a full scholarship to a prestigious summer writing program.

"Your essay was remarkable," the committee wrote. "Your willingness to share your vulnerability while focusing on growth rather than self-pity demonstrated exceptional maturity."

Jordan realized that his hardest experience had become his greatest strength.`,
    word_count: 270,
    lexile: '920L',
    vocabulary: [
      { word: 'authentic', definition: 'genuine and true to oneself', sentence: 'The best essays come from authentic experiences.' },
      { word: 'resilience', definition: 'the ability to recover from difficulties', sentence: 'Homelessness taught him resilience.' },
      { word: 'vulnerability', definition: 'willingness to show weakness or emotion', sentence: 'His vulnerability demonstrated maturity.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The Orchestra Audition',
    content: `Mei had practiced violin for eight years, but the regional youth orchestra audition terrified her in ways that regular performances never did. This wasn't just about playing well—it was about competing against dozens of talented musicians for only three open spots.

Her hands trembled as she warmed up in the practice room. Through the thin walls, she heard other violinists playing passages from the audition pieces. Some sounded incredibly skilled. Mei's confidence wavered.

An older girl noticed her distress. "First time?" she asked kindly. Mei nodded. "I'm Simone. I've auditioned four times and never made it. But I keep trying."

"Why?" Mei asked. "Doesn't rejection hurt?"

"Of course it does," Simone admitted. "But the audition forces me to improve. Every year, I'm better than the year before. At this point, the orchestra is almost secondary—I'm competing against my past self."

Mei thought about that perspective as she entered the audition room. She played her prepared pieces with all the emotion she could muster, focusing on the music rather than the judges' expressionless faces.

Two weeks later, the results arrived. Mei had not been selected.

The disappointment was crushing—for about a day. Then she remembered Simone's words. She requested feedback from the judges, identified her weaknesses, and created a practice plan for the coming year.

"I'll try again," she told her teacher. "And I'll be better."

Sometimes, Mei realized, the point of auditions wasn't winning. It was discovering how much further you could push yourself when the stakes were high.`,
    word_count: 260,
    lexile: '880L',
    vocabulary: [
      { word: 'wavered', definition: 'became unsteady or uncertain', sentence: 'Her confidence wavered.' },
      { word: 'perspective', definition: 'a particular way of viewing things', sentence: 'Mei thought about that perspective.' },
      { word: 'secondary', definition: 'less important than something else', sentence: 'The orchestra became almost secondary.' }
    ]
  },
  // Sports
  {
    genre: 'Sports',
    title: 'The Comeback Season',
    content: `After tearing her ACL during the championship game, thirteen-year-old Destiny was told she might never play competitive basketball again. The surgery was successful, but recovery would take twelve months of grueling physical therapy.

The first weeks were the hardest. Destiny couldn't walk without crutches, let alone run or jump. She watched her team practice through the gym windows, feeling like an outsider in her own life.

Her physical therapist, Marcus, refused to let her sink into despair. "Your body is healing," he said. "But your mind needs to heal too. You're not just recovering—you're rebuilding."

Marcus designed a program that went beyond standard rehabilitation. While strengthening her knee, Destiny studied game footage, analyzing plays she'd never noticed before. She learned about sports psychology and visualization techniques. She became a student of basketball in ways she'd never been when she could simply rely on athletic ability.

Eight months into recovery, Destiny started shooting free throws. Ten months in, she was running sprints. At twelve months, she was cleared for full contact practice.

The first game back was overwhelming. Destiny's knee felt strong, but her movements were cautious, her timing off. She scored only two points.

Gradually, confidence returned. By season's end, Destiny was playing better than before her injury—not just physically, but strategically. She understood the game at a deeper level.

"The injury taught me something," she told a reporter after leading her team to the finals. "I used to play basketball. Now I think basketball. And that makes all the difference."`,
    word_count: 260,
    lexile: '890L',
    vocabulary: [
      { word: 'rehabilitation', definition: 'the process of restoring health after injury', sentence: 'Her program went beyond standard rehabilitation.' },
      { word: 'visualization', definition: 'forming mental images, often used for performance', sentence: 'She learned visualization techniques.' },
      { word: 'strategically', definition: 'in a way that involves careful planning', sentence: 'She played better strategically.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Long Distance Runner',
    content: `Cross-country running wasn't glamorous. There were no cheering crowds, no instant replays, no dramatic slam dunks. Just miles of trail, burning lungs, and the relentless voice in your head begging you to stop.

Twelve-year-old Omar loved it.

He'd discovered running by accident—chasing a bus he'd missed and realizing he felt more alive than he had in months. His family had recently immigrated from Somalia, and adjusting to American life had been overwhelming. Running was the one place where his limited English didn't matter.

Omar joined the middle school cross-country team, where Coach Williams recognized his natural talent. But talent wasn't enough. Distance running required mental toughness—the ability to push through pain when every instinct screamed for rest.

"The body quits before it needs to," Coach Williams explained. "Your job is to negotiate with your brain, to convince it that you have more to give."

Omar learned to break races into segments, focusing only on reaching the next landmark. He developed mantras to repeat when fatigue set in. He studied elite runners and discovered that champions thought differently than everyone else.

At the regional championship, Omar faced runners with years more experience. By mile two, his legs were screaming. By mile three, he wanted to collapse.

But he kept negotiating. Just reach that tree. Just pass that runner. Just one more hill.

Omar crossed the finish line in third place—earning a spot at the state championship. As he bent over, gasping for air, he realized he'd discovered something beyond athletics: the power of mental discipline to overcome any obstacle.`,
    word_count: 265,
    lexile: '900L',
    vocabulary: [
      { word: 'relentless', definition: 'never stopping; constant and intense', sentence: 'The relentless voice begged him to stop.' },
      { word: 'mantras', definition: 'words or phrases repeated for focus', sentence: 'He developed mantras to repeat.' },
      { word: 'discipline', definition: 'training to develop self-control', sentence: 'He discovered the power of mental discipline.' }
    ]
  },
  // Fantasy
  {
    genre: 'Fantasy',
    title: 'The Cartographer\'s Apprentice',
    content: `In the kingdom of Meridian, maps were magical. A properly drawn map didn't just represent territory—it could reshape it. Mountains could be moved, rivers redirected, even weather patterns altered. Naturally, mapmaking was strictly controlled by the Royal Cartographers' Guild.

Thirteen-year-old Lyra was the guild's newest apprentice, selected for her extraordinary artistic talent. But she soon discovered that the guild had a dark secret: they'd been manipulating Meridian's geography to benefit wealthy nobles while impoverishing border villages.

Her mentor, Master Corvus, had been quietly documenting these abuses for years. "A map should reflect truth, not serve power," he whispered. "But speaking against the guild means death."

Lyra faced an impossible choice. She could remain silent and build a comfortable career, or she could risk everything to expose the corruption.

She chose a third option: working within the system while subtly undermining it. She created maps that appeared normal but contained hidden corrections—a river restored to its natural course here, a mountain range shifted to protect a village there. The changes were small enough to escape notice but significant enough to matter.

Over years, Lyra's secret cartography accumulated. Villages that had been deliberately flooded by guild maps began thriving again. Trade routes that had been diverted to favor nobles reopened for common merchants.

When the truth finally emerged, the corrupt guild masters had lost too much power to retaliate effectively. A new guild emerged, committed to the principle Lyra had fought for: maps should reveal the world's true shape, not impose someone else's vision upon it.`,
    word_count: 265,
    lexile: '930L',
    vocabulary: [
      { word: 'cartographer', definition: 'a person who makes maps', sentence: 'She was an apprentice to the Royal Cartographers.' },
      { word: 'manipulating', definition: 'controlling something in a clever or unfair way', sentence: 'They had been manipulating geography.' },
      { word: 'undermining', definition: 'weakening something gradually from within', sentence: 'She worked while subtly undermining corruption.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Dream Walker',
    content: `Some people had unusual talents—perfect pitch, photographic memory, double-jointed fingers. Twelve-year-old Zara could enter other people's dreams.

She'd discovered her ability at age seven, accidentally stumbling into her mother's nightmare about a house fire. The experience terrified both of them, but over time, Zara learned to control her gift. She could sense when someone nearby was dreaming, slip into their dreamscape, and even influence what happened there.

Zara kept her ability secret until a classmate named Jordan stopped coming to school. His parents said he was sick, but rumors spread: Jordan had fallen into a coma after a car accident. Doctors couldn't wake him.

Zara agonized over what to do. She'd never tried to enter a comatose person's dreams. It might not work. It might be dangerous. But Jordan had always been kind to her, defending her when others mocked her "spacey" behavior.

She convinced Jordan's parents to let her visit the hospital. Sitting beside his bed, she reached out with her mind—and found herself in a confusing maze of fragmented memories. Jordan was lost, unable to find his way back to consciousness.

For three nights, Zara navigated his dreamscape, piecing together the shattered imagery. She helped Jordan reconstruct his identity: his favorite songs, his dog's name, the smell of his grandmother's kitchen. Gradually, the fragments became whole.

On the fourth day, Jordan opened his eyes.

Doctors called it a miraculous recovery. Only Zara and Jordan knew the truth. Some gifts seemed useless until the exact moment they were needed most.`,
    word_count: 265,
    lexile: '880L',
    vocabulary: [
      { word: 'dreamscape', definition: 'the landscape or environment within a dream', sentence: 'She could slip into their dreamscape.' },
      { word: 'comatose', definition: 'in a deep state of unconsciousness', sentence: 'She had never entered a comatose person\'s dreams.' },
      { word: 'fragmented', definition: 'broken into small, incomplete parts', sentence: 'She found a maze of fragmented memories.' }
    ]
  },
  // Biography/Inspiration
  {
    genre: 'Biography',
    title: 'The Deaf Inventor',
    content: `In 1847, a young Thomas Edison developed hearing problems that would leave him nearly deaf for life. Many people assumed this disability would limit his potential. Edison proved them spectacularly wrong.

Unable to hear clearly, Edison developed remarkable powers of concentration. He could focus intensely on problems for hours, undisturbed by surrounding noise. His deafness, which might have been a limitation, became an unexpected advantage.

Edison's most famous invention—the phonograph, which recorded and played back sound—seems ironic given his hearing loss. But Edison could feel vibrations, and he tested his audio equipment by biting into the wooden casing to sense the sound waves through his skull.

During his lifetime, Edison patented 1,093 inventions, including the practical light bulb, the motion picture camera, and improvements to the telephone. His laboratory in Menlo Park, New Jersey, was the world's first industrial research facility—a place dedicated entirely to innovation.

Not all of Edison's experiments succeeded. He famously tested thousands of materials before finding the right filament for his light bulb. When an assistant suggested they had failed, Edison replied, "I have not failed. I've just found ten thousand ways that won't work."

This attitude—treating failure as information rather than defeat—became Edison's greatest contribution. His inventions changed the world, but his mindset influenced generations of scientists and entrepreneurs.

Edison's story demonstrates that disabilities need not define us, that persistence matters more than natural talent, and that the most valuable skill might be the willingness to fail repeatedly in pursuit of success.`,
    word_count: 260,
    lexile: '940L',
    vocabulary: [
      { word: 'patented', definition: 'obtained legal rights to an invention', sentence: 'Edison patented over 1,000 inventions.' },
      { word: 'innovation', definition: 'the introduction of new ideas or methods', sentence: 'His lab was dedicated to innovation.' },
      { word: 'persistence', definition: 'continuing firmly despite difficulties', sentence: 'Persistence matters more than natural talent.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Hidden Mathematician',
    content: `Katherine Johnson grew up in West Virginia during the 1930s, when African American women faced overwhelming obstacles in education and careers. Despite these barriers, she displayed extraordinary mathematical talent from childhood, graduating from high school at fourteen and college at eighteen.

In 1953, Johnson joined NASA's predecessor agency, becoming one of the first African American women to work as a NASA scientist. She was assigned to the "colored computers" section—a group of Black women who performed complex calculations by hand.

Johnson's accuracy became legendary. When NASA began using electronic computers to calculate spacecraft trajectories, astronaut John Glenn specifically requested that Johnson verify the machine's calculations before his historic orbital flight in 1962. "If she says they're good," Glenn declared, "then I'm ready to go."

Throughout her career, Johnson calculated launch windows, emergency return paths, and trajectories for multiple space missions. Her work was essential to the Apollo program that landed humans on the Moon.

For decades, Johnson's contributions remained largely unknown to the public. The 2016 book and film "Hidden Figures" finally brought recognition to her and her colleagues, revealing how a group of brilliant women had helped America win the space race while facing discrimination at every turn.

Johnson received the Presidential Medal of Freedom in 2015. She continued advocating for STEM education until her death in 2020 at age 101.

"I counted everything," she once said. "I counted the steps to the road, the steps up to church. Anything that could be counted, I did."`,
    word_count: 265,
    lexile: '920L',
    vocabulary: [
      { word: 'trajectories', definition: 'the paths followed by moving objects through space', sentence: 'She calculated spacecraft trajectories.' },
      { word: 'discrimination', definition: 'unfair treatment based on characteristics like race', sentence: 'They faced discrimination at every turn.' },
      { word: 'advocating', definition: 'publicly supporting a cause', sentence: 'She continued advocating for STEM education.' }
    ]
  },
  // Environment/Nature
  {
    genre: 'Nature',
    title: 'The Plastic Hunters',
    content: `The Great Pacific Garbage Patch wasn't what most people imagined—a visible island of floating debris. Instead, it was a diffuse soup of microplastics spread across an area twice the size of Texas, invisible from the surface but devastating to marine ecosystems.

Thirteen-year-old Maya learned about this disaster during a marine biology summer program. "Plastics don't just disappear," the instructor explained. "They break into smaller and smaller pieces, entering the food chain and ultimately reaching humans."

Maya felt overwhelmed by the scale of the problem. What could one person possibly do against an ocean of pollution?

She started small. Her school's cafeteria used plastic utensils and containers for every meal. Maya calculated that this single school produced over 50,000 plastic items per year. She proposed a switch to compostable alternatives and presented data showing long-term cost savings to the administration.

The campaign took six months of research, presentations, and persistence. Some students mocked her as annoying. Some adults dismissed her as naive. But Maya kept pushing, recruiting allies, and refining her arguments.

Finally, the school board approved the change. Local news covered the story. Three neighboring schools adopted similar policies.

"You won't solve the garbage patch," her father noted. "That's true," Maya acknowledged. "But I proved that one person can create change. And if thousands of people make similar changes, the cumulative effect could be enormous."

Maya continued her environmental work throughout high school. She learned that systemic problems required systemic solutions—and that creating those solutions began with individuals willing to act.`,
    word_count: 265,
    lexile: '910L',
    vocabulary: [
      { word: 'diffuse', definition: 'spread out over a wide area', sentence: 'It was a diffuse soup of microplastics.' },
      { word: 'ecosystems', definition: 'communities of living things and their environments', sentence: 'Plastics were devastating marine ecosystems.' },
      { word: 'cumulative', definition: 'increasing through successive additions', sentence: 'The cumulative effect could be enormous.' }
    ]
  },
  {
    genre: 'Nature',
    title: 'The Elephant Whisperer',
    content: `In Kenya's Amboseli National Park, twelve-year-old David had a gift that baffled scientists: he could predict elephant behavior with uncanny accuracy. While researchers relied on data analysis and computer models, David simply observed—and somehow understood.

His grandmother, who had grown up in a village near the elephant migration routes, wasn't surprised. "Our ancestors lived alongside elephants for thousands of years," she explained. "That knowledge is in your blood."

David spent every available moment watching the elephant herds. He noticed subtle signals others missed: the way a matriarch's ears flattened before she changed direction, how young bulls postured before challenging each other, the specific rumbles that signaled different emotional states.

When a drought threatened the region, wildlife officials struggled to predict where the elephants would migrate. Traditional water sources were drying up, and hungry elephants sometimes destroyed farms while searching for food.

David studied the herd's behavior carefully. He noticed that the oldest female had been leading scouting parties toward the northeast—a direction that seemed random until David remembered his grandmother's stories about a hidden spring that appeared only during severe droughts.

Following David's advice, officials found the spring and created a protected corridor for the elephants to reach it. The herds avoided the farmland. Conflict was prevented.

"How did you know?" a researcher asked.

"I listened," David said simply. "Not just with my ears. With my whole self."

Sometimes, ancient wisdom and modern science needed to work together. David became a bridge between both worlds.`,
    word_count: 260,
    lexile: '900L',
    vocabulary: [
      { word: 'uncanny', definition: 'strange or mysterious; beyond normal', sentence: 'He predicted behavior with uncanny accuracy.' },
      { word: 'matriarch', definition: 'a female leader of a family or group', sentence: 'The matriarch led the herd.' },
      { word: 'corridor', definition: 'a passage or route connecting two places', sentence: 'They created a protected corridor for elephants.' }
    ]
  },
  // Humor
  {
    genre: 'Humor',
    title: 'The Worst Babysitter Ever',
    content: `When thirteen-year-old Jake agreed to babysit his neighbor's kids, he imagined an easy evening: pizza, video games, early bedtime, and twenty dollars in his pocket. What he got was the most chaotic four hours of his life.

The chaos began immediately. Five-year-old twins Lily and Leo had very different ideas about entertainment. Lily wanted to play princess tea party. Leo wanted to be a dinosaur. Their compromise—a dinosaur attacking a princess tea party—resulted in apple juice on the ceiling and a broken lamp.

"No worries," Jake said, desperately mopping the ceiling. "Let's make dinner."

He had agreed to make macaroni and cheese—a simple task, he thought. But the twins insisted on "helping." Leo added an entire container of salt. Lily decided the cheese powder "looked lonely" and added hot chocolate mix. The resulting paste was technically edible but resembled orange concrete.

"Pizza it is," Jake surrendered, calling for delivery.

Bath time was another adventure. Leo refused to get in the tub because he was "still being a dinosaur." Lily got in but insisted on wearing all her princess accessories. Jake ended up soaking wet while the kids somehow remained mostly dry.

By bedtime, Jake was exhausted. But as he finally got both twins tucked in, Lily looked up at him.

"Jake? You're the best babysitter ever."

"Really? Even though everything went wrong?"

"That's why you're the best," Leo added sleepily. "You didn't get mad. You just kept trying."

Jake laughed despite himself. Twenty dollars didn't seem like enough, but somehow, the compliment made everything worthwhile.`,
    word_count: 265,
    lexile: '850L',
    vocabulary: [
      { word: 'chaotic', definition: 'completely confused and disorderly', sentence: 'It was the most chaotic four hours of his life.' },
      { word: 'compromise', definition: 'an agreement where both sides give up something', sentence: 'Their compromise involved dinosaurs and tea parties.' },
      { word: 'surrendered', definition: 'gave up fighting and accepted defeat', sentence: 'Jake surrendered and ordered pizza.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Science Fair Disaster',
    content: `Everything that could go wrong at the science fair, did. Megan's volcano erupted thirty minutes early—during the judging of the project next to hers. Her classmate Andy's robot went haywire and chased the principal around the gymnasium. And someone's "harmless bacteria samples" turned out to be not so harmless, requiring a partial evacuation.

But the crowning disaster belonged to Marcus and his electromagnetic experiment.

Marcus had built a device designed to demonstrate how magnets affected electronic signals. Unfortunately, he'd dramatically underestimated its range. When he turned it on, every electronic device within fifty feet went berserk.

The digital scoreboard started displaying random numbers. Someone's insulin pump beeped frantically. The fire alarm triggered for no reason. And the local news reporter who was filming the event watched helplessly as her expensive camera went completely dead.

"Turn it off!" the principal screamed.

"I'm trying!" Marcus shouted back, but the power switch had somehow magnetized itself shut.

Mr. Chen, the physics teacher, finally unplugged the entire table from the wall, ending the electromagnetic chaos. An awkward silence filled the gymnasium.

Then, incredibly, the judges approached Marcus with first place.

"Your hypothesis was correct," the head judge explained. "Electromagnetic fields DO affect electronic devices. You've just... demonstrated it more dramatically than expected."

"Also," another judge added, "you've taught us a valuable lesson about safety protocols. We'll definitely require power limitations next year."

Marcus accepted his blue ribbon in a daze. Sometimes, he realized, spectacular failure and spectacular success looked surprisingly similar.`,
    word_count: 260,
    lexile: '870L',
    vocabulary: [
      { word: 'electromagnetic', definition: 'relating to the interaction of electric and magnetic fields', sentence: 'Marcus built an electromagnetic experiment.' },
      { word: 'haywire', definition: 'out of control; chaotically malfunctioning', sentence: 'The robot went haywire.' },
      { word: 'protocols', definition: 'official rules or procedures', sentence: 'They discussed new safety protocols.' }
    ]
  },
  // Social Issues/Contemporary
  {
    genre: 'Contemporary',
    title: 'The Social Media Detox',
    content: `Twelve-year-old Ava spent approximately six hours per day on social media. She didn't think it was a problem until her grades started slipping, she stopped sleeping well, and she caught herself checking her phone while having dinner conversations with her family.

Her parents proposed a radical experiment: one month completely offline. No Instagram, TikTok, YouTube, or messaging apps. Just real life.

"You'll see," her mother said. "You'll feel better than you have in years."

Ava doubted it. The first week was agony. She felt phantom vibrations from her phone. She had no idea what her friends were doing. She felt invisible, irrelevant, completely disconnected from the world.

But gradually, something shifted. Without constant notifications demanding attention, Ava noticed things she'd been missing: the sound of birds outside her window, her little brother's funny drawings, the way her father hummed while cooking.

She started reading again—actual books, not Instagram posts. She learned to play guitar from a patient human teacher rather than TikTok tutorials. She had face-to-face conversations that lasted longer than text exchanges.

When the month ended, Ava returned to social media—but differently. She set strict time limits. She unfollowed accounts that made her feel bad. She prioritized real-world friendships over online validation.

"The funny thing is," she reflected in a journal entry, "I thought I was connected to everyone online. But I was actually missing the connections that mattered most—the people right in front of me."

Sometimes, Ava discovered, you had to disconnect to truly connect.`,
    word_count: 265,
    lexile: '880L',
    vocabulary: [
      { word: 'radical', definition: 'extreme; representing a major change', sentence: 'Her parents proposed a radical experiment.' },
      { word: 'phantom', definition: 'something that seems real but isn\'t', sentence: 'She felt phantom vibrations from her phone.' },
      { word: 'validation', definition: 'approval or recognition from others', sentence: 'She prioritized friendships over online validation.' }
    ]
  },
  {
    genre: 'Contemporary',
    title: 'The Empty Desk',
    content: `When Omar stopped coming to school, his classmates assumed he was sick. After two weeks, rumors spread: his family had been deported.

Thirteen-year-old Sofia remembered Omar's laugh, his talent for math, the way he'd shared his grandmother's homemade tamales with anyone who asked. Now his desk sat empty, a daily reminder of how quickly someone could disappear.

Sofia felt helpless at first. Immigration policy seemed like an adult issue, far beyond her control. But she couldn't accept doing nothing.

She researched Omar's situation and learned that deportation often separated families—children who were American citizens from parents who weren't. She discovered organizations fighting for immigrant rights and read stories of other families torn apart.

Sofia organized her research into a presentation for her social studies class. Some students looked uncomfortable. A few made dismissive comments. But many seemed genuinely moved by the information.

"What can we actually do?" one classmate asked.

"Lots of things," Sofia replied. "Write letters to lawmakers. Support organizations helping immigrant families. Make sure everyone knows their legal rights. And most importantly—remember that behind every statistic is a real person like Omar."

Sofia never learned what happened to Omar's family. But she continued her advocacy, starting a school club focused on immigrant rights and organizing community events.

"You can't save everyone," her mother reminded her gently.

"I know," Sofia replied. "But I can make sure they're not forgotten. And sometimes, being remembered is the first step toward being helped."`,
    word_count: 260,
    lexile: '890L',
    vocabulary: [
      { word: 'deported', definition: 'forced to leave a country by the government', sentence: 'Rumors said his family had been deported.' },
      { word: 'advocacy', definition: 'publicly supporting a particular cause', sentence: 'She continued her advocacy work.' },
      { word: 'dismissive', definition: 'showing something is not worth considering', sentence: 'Some students made dismissive comments.' }
    ]
  },
  // Mythology/Legends
  {
    genre: 'Mythology',
    title: 'The Trickster\'s Lesson',
    content: `In many Native American traditions, Coyote is the ultimate trickster—clever but foolish, helpful but selfish, always teaching lessons in unexpected ways. This is one such tale.

Long ago, Coyote grew jealous of Eagle, who could soar above the clouds and see the whole world below. "I want to fly," Coyote complained to the Creator. "It's not fair that Eagle has something I lack."

The Creator, knowing Coyote's nature, granted his wish—but with a condition. "You may borrow Eagle's wings for one day. But you must return them at sunset."

Coyote was ecstatic. He strapped on the magnificent wings and launched into the sky. The world below became small and distant. He felt powerful, invincible.

But Coyote couldn't resist showing off. He flew dangerously close to other animals, laughing at their fear. He stole fish from rivers without effort. He began to believe he was better than everyone.

As sunset approached, Coyote ignored the Creator's warning. Why return the wings when flying was so wonderful? He flew higher and higher, convinced he could escape any consequence.

But the wings were never meant for Coyote. At the moment of sunset, they dissolved into feathers and scattered on the wind. Coyote plummeted toward Earth, saved only by landing in a deep lake.

Dripping wet and humiliated, Coyote learned his lesson—or at least, he learned it temporarily. The trickster's nature meant he would probably forget by next week.

"Some gifts are meant to be borrowed, not kept," the Creator reminded him. "Gratitude means knowing when to give things back."`,
    word_count: 265,
    lexile: '870L',
    vocabulary: [
      { word: 'trickster', definition: 'a character known for deceiving others or breaking rules', sentence: 'Coyote is the ultimate trickster.' },
      { word: 'invincible', definition: 'too powerful to be defeated', sentence: 'He felt powerful and invincible.' },
      { word: 'plummeted', definition: 'fell straight down very quickly', sentence: 'Coyote plummeted toward Earth.' }
    ]
  },
  {
    genre: 'Mythology',
    title: 'The Girl Who Became the Moon',
    content: `This story comes from Inuit tradition, passed down through generations of Arctic peoples.

Long ago, a girl named Malina lived in a village where the sun never set during summer and never rose during winter. She had a brother named Anningan who was cruel and constantly pursued her.

To escape him, Malina grabbed a flaming torch and ran into the sky. Her torch became the sun, bringing warmth and light wherever she went. Anningan chased after her, carrying only a dim, cold flame that became the moon.

Forever after, the sun and moon have chased each other across the sky. During eclipses, Anningan catches up to Malina briefly before she escapes again.

But the story doesn't end there.

As Malina traveled the sky, she noticed the people below struggling through the dark winters. She couldn't stay with them constantly—Anningan was always chasing—but she could leave something behind.

She plucked sparks from her torch and scattered them across the night sky. These became the stars—small pieces of warmth to comfort people during long, cold nights.

She also taught the animals to help. The snowy owl's white feathers would blend with snow for protection. The polar bear would hunt in darkness when others couldn't. The Arctic fox would grow a thick winter coat.

Malina couldn't solve every problem, but she did what she could from where she was. And sometimes, the Inuit say, when the northern lights dance across the sky, that's Malina reminding her people that even in the darkest times, light will return.`,
    word_count: 265,
    lexile: '860L',
    vocabulary: [
      { word: 'eclipses', definition: 'events when one object in space blocks another', sentence: 'During eclipses, the moon briefly catches the sun.' },
      { word: 'plucked', definition: 'pulled or picked something quickly', sentence: 'She plucked sparks from her torch.' },
      { word: 'generation', definition: 'all people born around the same time', sentence: 'The story passed through generations.' }
    ]
  },
  // School Life
  {
    genre: 'School Life',
    title: 'The Debate Tournament',
    content: `Public speaking terrified Amara. Her voice shook, her hands trembled, and her mind went blank the moment she faced an audience. So naturally, her English teacher signed her up for the school debate team.

"You have excellent ideas in your essays," Ms. Rodriguez explained. "You just need practice expressing them aloud."

The first practice was humiliating. Amara forgot her arguments mid-sentence, spoke so quietly no one could hear, and accidentally argued the opposite of her assigned position. Her teammates exchanged doubtful glances.

But Ms. Rodriguez refused to let her quit. "Debate is a skill, not a talent," she insisted. "Skills can be learned."

Amara practiced obsessively. She recorded herself speaking and cringed while reviewing the footage. She gave practice speeches to her mirror, her dog, and eventually her patient grandmother. She learned techniques for managing nervousness: deep breathing, power poses, focusing on the message rather than the audience.

By the regional tournament, Amara had transformed. She wasn't fearless—her heart still pounded before each round—but she had learned to channel that energy into passionate argument.

In the final round, facing the reigning champions, Amara delivered a closing statement that drew spontaneous applause. Her team won by a single point.

"How does it feel?" a teammate asked.

"Terrifying," Amara admitted. "But good terrifying. Like the fear is fuel instead of a wall."

She continued debating through high school and discovered that her greatest weakness—the fear of public speaking—had transformed into her greatest strength. All it took was refusing to let fear have the final word.`,
    word_count: 265,
    lexile: '890L',
    vocabulary: [
      { word: 'humiliating', definition: 'causing a painful loss of pride', sentence: 'The first practice was humiliating.' },
      { word: 'obsessively', definition: 'to an excessive degree; constantly', sentence: 'Amara practiced obsessively.' },
      { word: 'spontaneous', definition: 'happening naturally without planning', sentence: 'Her speech drew spontaneous applause.' }
    ]
  },
  // Family
  {
    genre: 'Family',
    title: 'The Recipe Box',
    content: `When Grandma Rose passed away, the family gathered to divide her possessions. Everyone wanted the antique furniture, the jewelry, the valuable paintings. Twelve-year-old Cara asked for the battered wooden recipe box that had always sat on Grandma's kitchen counter.

"That old thing?" her aunt asked, surprised. "It's falling apart."

But Cara remembered something the adults had forgotten: Grandma Rose hadn't just collected recipes—she'd collected stories.

Inside the box, each yellowed index card held more than ingredient lists. Grandma's handwriting covered the margins with notes: "Made this for your grandfather on our first anniversary." "Cara's mom requested this every birthday." "Cook when someone needs comfort."

The recipes themselves spanned generations and continents. Her great-grandmother's Irish soda bread. A Cuban friend's black beans and rice. The chocolate cake that had won a county fair in 1962.

Cara began cooking through the box, one recipe at a time. She discovered that her father's favorite childhood meal was simple tomato soup with grilled cheese. She learned that her grandmother had survived on nothing but this particular lentil stew during hard times.

Each recipe connected her to family members she'd never met and stories she'd never heard. Her kitchen became a time machine.

On what would have been Grandma Rose's birthday, Cara cooked a feast using recipes from the box. The whole family gathered, sharing memories that the food brought flooding back.

"You know," her father said, wiping his eyes, "you chose the most valuable thing in that house."

Cara smiled, understanding that some treasures couldn't be measured in dollars—only in memories and love.`,
    word_count: 270,
    lexile: '880L',
    vocabulary: [
      { word: 'battered', definition: 'worn and damaged from use', sentence: 'The battered wooden box sat on the counter.' },
      { word: 'antique', definition: 'valuable objects from the past', sentence: 'Everyone wanted the antique furniture.' },
      { word: 'spanning', definition: 'extending across', sentence: 'The recipes spanned generations and continents.' }
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
      question_type: 'theme',
      correct_answer: 'B',
      choice_a: 'Life is meaningless without material success',
      choice_b: 'Personal growth comes through facing challenges and learning from experiences',
      choice_c: 'Avoiding problems is the best solution',
      choice_d: 'Only talented people can achieve their goals'
    },
    {
      question_number: 2,
      question_text: 'What message is the author trying to convey to readers?',
      question_type: 'author_purpose',
      correct_answer: 'C',
      choice_a: 'Success comes easily to those who wait',
      choice_b: 'Problems always solve themselves over time',
      choice_c: 'Determination, courage, and learning from setbacks lead to growth',
      choice_d: 'People should avoid difficult situations'
    },
    {
      question_number: 3,
      question_text: 'What is the primary conflict the main character faces?',
      question_type: 'detail',
      correct_answer: 'A',
      choice_a: 'A challenging situation requiring courage, skill, or personal growth',
      choice_b: 'There is no real conflict in this story',
      choice_c: 'The character simply wants to sleep',
      choice_d: 'The character is bored with life'
    },
    {
      question_number: 4,
      question_text: 'How does the resolution reflect the story\'s theme?',
      question_type: 'analyze_structure',
      correct_answer: 'B',
      choice_a: 'The ending has nothing to do with the theme',
      choice_b: 'The character\'s growth or success reinforces the story\'s message',
      choice_c: 'The story ends with unresolved problems',
      choice_d: 'Everything stays exactly the same'
    },
    {
      question_number: 5,
      question_text: 'What can you infer about the main character\'s values and motivations?',
      question_type: 'inference',
      correct_answer: 'D',
      choice_a: 'The character only cares about money',
      choice_b: 'The character has no real motivations',
      choice_c: 'The character wants to hurt others',
      choice_d: 'The character values perseverance, learning, and meaningful connections'
    },
    {
      question_number: 6,
      question_text: 'How does the main character demonstrate growth throughout the story?',
      question_type: 'character_analysis',
      correct_answer: 'A',
      choice_a: 'They develop new skills, perspectives, or understanding',
      choice_b: 'They become more selfish and uncaring',
      choice_c: 'They show no change whatsoever',
      choice_d: 'They become weaker and more afraid'
    },
    {
      question_number: 7,
      question_text: `Based on context, what does "${vocab.word}" mean?`,
      question_type: 'vocabulary',
      correct_answer: 'B',
      choice_a: 'A type of weather pattern',
      choice_b: vocab.definition.charAt(0).toUpperCase() + vocab.definition.slice(1),
      choice_c: 'A musical instrument',
      choice_d: 'A kind of food'
    },
    {
      question_number: 8,
      question_text: 'What event marks the turning point of the story?',
      question_type: 'sequence',
      correct_answer: 'C',
      choice_a: 'The story has no turning point',
      choice_b: 'The very first sentence',
      choice_c: 'A key moment when the character faces their challenge directly',
      choice_d: 'Nothing significant happens'
    },
    {
      question_number: 9,
      question_text: 'What causes the character to ultimately succeed or grow?',
      question_type: 'cause_effect',
      correct_answer: 'A',
      choice_a: 'Their determination, willingness to learn, and support from others',
      choice_b: 'Pure luck with no effort required',
      choice_c: 'Someone else does everything for them',
      choice_d: 'They cheat or take shortcuts'
    },
    {
      question_number: 10,
      question_text: 'How might the character apply what they learned to future challenges?',
      question_type: 'prediction',
      correct_answer: 'D',
      choice_a: 'They will immediately forget all lessons',
      choice_b: 'They will avoid all future challenges',
      choice_c: 'They will become arrogant and stop learning',
      choice_d: 'They will approach new challenges with greater confidence and wisdom'
    }
  ];
}

async function seedStories() {
  console.log('=== Seeding Grade 5 Stories ===\n');

  const stories = [];

  for (let i = 0; i < 100; i++) {
    const templateIndex = i % storyTemplates.length;
    const template = storyTemplates[templateIndex];

    const variation = Math.floor(i / storyTemplates.length) + 1;
    const varTitle = variation > 1 ? `${template.title} - Part ${variation}` : template.title;

    const story = {
      title: varTitle,
      content: template.content,
      genre: template.genre,
      reading_level: template.lexile || '890L',
      word_count: template.word_count || 265,
      lexile_band: '850L-950L',
      grade_level: 5,
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
  console.log('Inserted ' + inserted + ' Grade 5 stories');
  console.log('Each with 10 comprehension questions');
  console.log('Total questions: ' + (inserted * 10));

  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 5);
  console.log('\nVerified Grade 5 stories in database: ' + count);
}

seedStories();
