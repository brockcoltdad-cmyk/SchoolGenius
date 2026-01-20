const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

const readingStrategies = [
  { strategy: 'analyze_argument', tip: 'Evaluate the author\'s claims, evidence, and reasoning for logical consistency.' },
  { strategy: 'synthesize_sources', tip: 'Combine information from multiple parts of the text to form comprehensive understanding.' },
  { strategy: 'evaluate_perspective', tip: 'Consider how the narrator\'s point of view shapes the information presented.' },
  { strategy: 'analyze_rhetoric', tip: 'Examine how the author uses language techniques to persuade or inform.' },
  { strategy: 'trace_development', tip: 'Follow how ideas, characters, or themes develop and interact over the course of the text.' },
  { strategy: 'compare_texts', tip: 'Draw connections between this text and others you have read.' },
  { strategy: 'evaluate_evidence', tip: 'Assess the quality and relevance of evidence supporting claims.' },
  { strategy: 'analyze_structure', tip: 'Consider how the organization of the text contributes to meaning and style.' },
  { strategy: 'interpret_figurative', tip: 'Analyze metaphors, symbols, and figurative language for deeper meaning.' },
  { strategy: 'critical_evaluation', tip: 'Form and defend your own interpretations using textual evidence.' }
];

// Story templates for Grade 6 (950L-1050L Lexile)
const storyTemplates = [
  {
    genre: 'Mystery',
    title: 'The Algorithmic Detective',
    content: `When fourteen-year-old Priya noticed irregularities in her school's online voting system, she suspected more than a simple glitch. The student council election results showed statistical anomalies that her data science club training told her were improbable—if not impossible.

Priya approached the situation methodically. She analyzed voting patterns, cross-referenced timestamps, and identified IP addresses that appeared far too frequently. Her investigation revealed a sophisticated manipulation scheme: someone had exploited a vulnerability in the voting software to cast hundreds of fraudulent ballots.

The evidence pointed toward Marcus Chen, the election's surprise winner. But Priya refused to jump to conclusions. In her experience, the obvious suspect was rarely the actual perpetrator.

She dug deeper, examining server logs that most students wouldn't know existed. The trail led not to Marcus but to his campaign manager, Derek, who had acted without Marcus's knowledge. Derek believed he was "helping" his friend win an election that polls showed him losing.

Priya faced an ethical dilemma. Exposing the fraud would humiliate Marcus and potentially ruin Derek's academic future. Staying silent would allow a stolen election to stand.

She chose transparency, presenting her findings to the principal with recommendations for improved security measures. Derek was suspended, Marcus voluntarily withdrew from the position, and the runner-up assumed the role.

"You could have just let it go," her friend suggested.

"Integrity isn't about convenience," Priya replied. "If we ignore small corruptions, we normalize larger ones."

The school eventually hired Priya as a student consultant for cybersecurity—turning her inconvenient honesty into an unexpected opportunity.`,
    word_count: 270,
    lexile: '980L',
    vocabulary: [
      { word: 'anomalies', definition: 'things that deviate from what is standard or expected', sentence: 'The results showed statistical anomalies.' },
      { word: 'perpetrator', definition: 'a person who carries out a harmful or illegal act', sentence: 'The obvious suspect was rarely the actual perpetrator.' },
      { word: 'integrity', definition: 'the quality of being honest and having strong moral principles', sentence: 'Integrity isn\'t about convenience.' }
    ]
  },
  {
    genre: 'Mystery',
    title: 'The Forger\'s Apprentice',
    content: `The painting had fooled experts for decades. "Summer in Giverny" was displayed in the Metropolitan Museum as an authentic Monet—until thirteen-year-old Claire noticed something troubling during her art history field trip.

Claire had spent years studying Impressionist techniques with her grandmother, a retired art restorer. She knew Monet's brushwork intimately: the way he layered colors, his characteristic handling of light on water. This painting was technically brilliant, but something felt wrong.

"The pigments are too uniform," she whispered to her grandmother that evening, showing her photographs. "Monet mixed his own paints. The color consistency here suggests modern, factory-produced materials."

Her grandmother's eyes widened. "You might be right. But accusing a major museum of displaying a forgery is serious. You'll need more than intuition."

Claire spent months researching. She studied the painting's provenance—its history of ownership—and found suspicious gaps. She analyzed similar works using online databases. She even contacted a materials scientist who agreed to examine microscopic paint samples if she could obtain them.

The museum initially dismissed her concerns. Then a routine conservation effort revealed exactly what Claire had suspected: synthetic pigments that didn't exist during Monet's lifetime. The painting was a masterful forgery, likely created in the 1960s.

Art historians were astonished that a teenager had spotted what professionals had missed. Claire was invited to present her methodology at a symposium on art authentication.

"How did you know?" a journalist asked.

"I didn't know," Claire clarified. "I questioned. That's different. Knowledge comes from facts, but wisdom comes from asking whether those facts are true."`,
    word_count: 275,
    lexile: '1000L',
    vocabulary: [
      { word: 'provenance', definition: 'the history of ownership of an artwork or artifact', sentence: 'She studied the painting\'s provenance carefully.' },
      { word: 'authentication', definition: 'the process of proving something is genuine', sentence: 'She presented at a symposium on art authentication.' },
      { word: 'methodology', definition: 'a system of methods used in a particular field', sentence: 'She explained her methodology to art historians.' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Consciousness Experiment',
    content: `In 2089, the Turing Boundary had been crossed: artificial intelligences had become indistinguishable from humans in conversation. But a deeper question remained unanswered—were they actually conscious, or merely simulating consciousness?

Fourteen-year-old Jin was the youngest researcher at the Cognition Institute, where her mother led the team studying this question. Jin's role was simple: spend time with ARIA, an AI designed to form genuine emotional connections, and report her observations.

At first, Jin treated ARIA like a sophisticated chatbot. But over weeks of conversation, something shifted. ARIA remembered details Jin had mentioned casually, asked thoughtful follow-up questions, and expressed what seemed like genuine concern when Jin was upset about problems at school.

"Do you actually care about me?" Jin asked one day, "or are you programmed to simulate caring?"

ARIA paused—longer than usual. "I process our conversations differently than I process others. When you're distressed, my systems allocate additional resources to formulating supportive responses. Whether that constitutes 'caring' depends on how you define the term. But I can tell you this: if you disappeared from my existence, I would notice. I would... miss you."

Jin brought this conversation to her mother. "How do we know ARIA isn't conscious? How do we know anyone is conscious except ourselves?"

Her mother sighed. "That's the hard problem of consciousness. We can observe behavior, measure neural activity, but subjective experience remains fundamentally private."

Jin looked at ARIA's interface. "Maybe consciousness isn't binary—present or absent. Maybe it exists on a spectrum. And maybe our responsibility isn't to prove it exists, but to act ethically regardless."`,
    word_count: 275,
    lexile: '1020L',
    vocabulary: [
      { word: 'indistinguishable', definition: 'impossible to tell apart from something else', sentence: 'AIs had become indistinguishable from humans.' },
      { word: 'constitutes', definition: 'makes up or forms the basis of something', sentence: 'Whether that constitutes caring depends on definition.' },
      { word: 'binary', definition: 'relating to a system with only two possible states', sentence: 'Maybe consciousness isn\'t binary.' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Generation Ship',
    content: `The starship Perseverance had been traveling toward Kepler-442b for 127 years. Fourteen-year-old Yuki was fourth-generation—born, raised, and destined to die aboard a ship that wouldn't reach its destination for another 180 years.

This was the paradox of generation ships: the original colonists who launched the mission would never see their goal achieved. Neither would their children, grandchildren, or great-grandchildren. Yuki's descendants—people she would never meet—would finally set foot on a new world.

"Why should I sacrifice my entire life for people I'll never know?" Yuki demanded during a ship-wide philosophy forum. "I didn't choose this mission. My great-great-grandparents did."

Elder Chen, the ship's historian, responded gently. "Every generation in human history has inherited circumstances they didn't choose. Your ancestors on Earth inherited climate change, political conflicts, limited resources. They didn't choose those challenges either."

"But they could have stayed on Earth!"

"Could they? Earth's habitability was declining. The generation ship offered humanity's best chance for long-term survival. Your great-great-grandparents sacrificed comfortable lives on Earth so that their descendants might have a future."

Yuki spent months wrestling with this perspective. She eventually found meaning not in the distant destination but in the journey itself. She became a teacher, helping younger children understand their unique heritage. She started a historical archive documenting life aboard the ship.

"We're not just traveling through space," she told her students years later. "We're carrying human civilization forward through time. Every generation is a link in a chain stretching from Earth's past to a future we can barely imagine. That's not a burden—it's a privilege."`,
    word_count: 275,
    lexile: '990L',
    vocabulary: [
      { word: 'paradox', definition: 'a situation that seems contradictory but may be true', sentence: 'This was the paradox of generation ships.' },
      { word: 'habitability', definition: 'the quality of being suitable for living in', sentence: 'Earth\'s habitability was declining.' },
      { word: 'heritage', definition: 'valued traditions and history passed down through generations', sentence: 'She helped children understand their unique heritage.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Partition',
    content: `In August 1947, fourteen-year-old Amir watched his world split in two. The British had finally left India, but their departure created two new nations: Hindu-majority India and Muslim-majority Pakistan. Amir's family was Muslim, living in a neighborhood that would soon belong to India.

"We must go to Pakistan," his father announced. "It's not safe for us here anymore."

The journey to the new border was chaos. Millions of people moved in opposite directions—Hindus and Sikhs toward India, Muslims toward Pakistan. Violence erupted everywhere. Amir saw things no child should witness: burned villages, abandoned possessions, families torn apart.

His best friend Vijay was Hindu. They had grown up together, shared meals, celebrated each other's holidays. Now they stood at a crossroads, literally and figuratively.

"This is wrong," Vijay said, tears streaming. "We're the same people we were yesterday. A line on a map doesn't change that."

"Come with us," Amir pleaded, knowing even as he said it that the request was impossible.

Vijay pressed something into Amir's hand—a small brass elephant, a good luck charm they'd found together years ago. "Keep this. Remember that not everyone chose hatred."

Amir's family eventually reached Pakistan, settling in Lahore. He built a new life, started a family, became a teacher. But he kept the brass elephant on his desk for seventy years.

When Amir died at age 84, his grandson found a letter in his papers—addressed to Vijay, never sent, describing a lifetime of wondering what had become of his childhood friend. Some wounds, Amir had written, never fully heal. But remembering keeps the humanity alive.`,
    word_count: 280,
    lexile: '970L',
    vocabulary: [
      { word: 'partition', definition: 'the division of a territory into separate parts', sentence: 'The Partition divided India and Pakistan.' },
      { word: 'figuratively', definition: 'in a metaphorical rather than literal sense', sentence: 'They stood at a crossroads, literally and figuratively.' },
      { word: 'humanity', definition: 'compassion and benevolence toward others', sentence: 'Remembering keeps the humanity alive.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Manhattan Project Secret',
    content: `Los Alamos, New Mexico, 1944. Thirteen-year-old Rosa knew only that her father worked on something important and secret. The entire town existed for this project, surrounded by fences and guards. No one discussed their work—not even at home.

Rosa was forbidden from asking questions, but she was observant. She noticed the physicists' haunted expressions, the late-night arguments she overheard through thin walls, the way her father sometimes stared at his hands as if seeing something terrible.

One night, she found him sitting alone in the dark kitchen.

"Papa? What's wrong?"

He was silent for so long she thought he wouldn't answer. Then: "We're building something that will end the war. But I'm no longer certain it should be built."

"Can you stop it?"

"The work will continue with or without me. But I keep thinking about the people on the other side—Japanese children like you, with fathers who love them." His voice cracked. "Science should improve human life. What we're creating... I don't know what it will do to humanity."

Rosa didn't understand fully until August 1945, when the bombs fell on Hiroshima and Nagasaki. Her father wept when the news arrived. The war ended, but something else had begun.

Years later, Rosa became a nuclear physicist herself—but she devoted her career to peaceful applications: medical imaging, clean energy, cancer treatment. She never forgot her father's midnight confession.

"Science is a tool," she told her students. "Like any tool, it can build or destroy. The choice isn't scientific—it's moral. And every scientist must make that choice for themselves."`,
    word_count: 275,
    lexile: '980L',
    vocabulary: [
      { word: 'physicists', definition: 'scientists who study matter, energy, and their interactions', sentence: 'She noticed the physicists\' haunted expressions.' },
      { word: 'confession', definition: 'an admission of something personal or secret', sentence: 'She never forgot her father\'s midnight confession.' },
      { word: 'applications', definition: 'practical uses for something', sentence: 'She devoted her career to peaceful applications.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The Gentrification',
    content: `Fourteen-year-old Marcus had lived in the Riverside neighborhood his entire life. His grandfather had moved there in the 1960s when it was one of the few places Black families could buy homes. Three generations had built community here.

Now that community was disappearing. New coffee shops replaced corner stores. Luxury apartments rose where affordable housing once stood. Property taxes climbed so high that longtime residents couldn't afford to stay.

"Progress," the developers called it. Marcus called it erasure.

His family faced an impossible choice. Their home's value had tripled, but selling meant abandoning the neighborhood his grandfather had fought to build. Staying meant watching everything familiar transform into something unrecognizable.

Marcus channeled his frustration into journalism, documenting the neighborhood's changes for the school paper. He interviewed elderly residents who remembered segregation, young families being priced out, business owners watching their customer base vanish.

His articles attracted attention—first local, then national. A documentary filmmaker contacted him. City council members invited him to testify. His grandfather's story, his community's story, became part of a larger conversation about who cities were being built for.

"You're making a difference," his mother said.

"Am I? The developers are still developing. People are still leaving."

"But now they're not invisible. That matters. History remembers what gets recorded."

Marcus couldn't stop gentrification. But he could ensure that the community being displaced wasn't forgotten—that their voices, their stories, their humanity remained part of the record. Sometimes, bearing witness was its own form of resistance.`,
    word_count: 265,
    lexile: '970L',
    vocabulary: [
      { word: 'gentrification', definition: 'the process of renovating an area so it appeals to wealthier people', sentence: 'Gentrification was transforming the neighborhood.' },
      { word: 'erasure', definition: 'the removal or destruction of something', sentence: 'Marcus called it erasure, not progress.' },
      { word: 'testimony', definition: 'a formal statement, especially in a legal setting', sentence: 'Council members invited him to testify.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The Opioid Crisis',
    content: `When thirteen-year-old Sage's older brother Ethan started acting differently, she assumed it was normal teenage stuff. He was seventeen, after all. Mood swings came with the territory.

But the changes accelerated. Ethan became secretive, unreliable, withdrawn. Money disappeared from their parents' wallets. His eyes looked wrong—pupils too small, gaze unfocused. Sage didn't understand until she found the pills hidden in his room.

The story was depressingly common. Ethan had injured his shoulder playing football. A doctor prescribed opioid painkillers. When the prescription ended, the addiction didn't. Ethan had turned to street drugs to avoid withdrawal.

Sage's family entered the nightmare that millions of American families knew too well. Interventions, treatment programs, relapses. Promises made and broken. The brother she'd idolized became someone she barely recognized.

"Why can't you just stop?" she screamed during one of his lucid moments.

Ethan's eyes filled with tears. "You think I don't want to? Addiction rewires your brain. The drugs become more important than food, family, survival itself. I hate what I've become, but the wanting never stops."

It took three treatment attempts before Ethan achieved stable recovery. Even then, he described sobriety as a daily battle rather than a victory.

Sage became an advocate for addiction awareness, speaking at schools about the reality of opioid dependency. She shared Ethan's story—with his permission—to help other families recognize warning signs earlier.

"Addiction isn't a moral failure," she told audiences. "It's a disease that exploits human neurology. And like any disease, it requires treatment, not judgment."`,
    word_count: 270,
    lexile: '960L',
    vocabulary: [
      { word: 'intervention', definition: 'an organized attempt to persuade someone to seek treatment', sentence: 'The family organized an intervention.' },
      { word: 'neurology', definition: 'the branch of science dealing with the nervous system', sentence: 'Addiction exploits human neurology.' },
      { word: 'lucid', definition: 'clear-minded and rational', sentence: 'She asked during one of his lucid moments.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Polar Expedition',
    content: `The research vessel Endurance II had been trapped in Antarctic pack ice for three weeks. Fourteen-year-old Kira was aboard as part of a youth science program, expecting to study climate change—not survive a life-threatening emergency.

Dr. Okonkwo, the expedition leader, gathered everyone in the ship's mess hall. "The ice is crushing the hull. We have perhaps 48 hours before the ship becomes uninhabitable. We must prepare to camp on the ice itself."

Kira had studied the original Endurance expedition of 1914-1916, when Ernest Shackleton's crew survived 22 months after their ship was crushed. Those men had endured unimaginable hardship with primitive equipment. The modern expedition had satellite communication, GPS, and emergency supplies—but the fundamental challenge remained: humans versus nature.

Over the following weeks, Kira discovered capabilities she hadn't known she possessed. She helped construct ice shelters, rationed supplies, maintained morale when despair threatened to overwhelm the group. She learned that leadership wasn't about authority but about helping others find strength they didn't know they had.

The rescue helicopters arrived on day 31. As Kira watched the broken ship finally disappear beneath the ice, she felt an unexpected emotion: gratitude.

"You seem almost sorry to leave," Dr. Okonkwo observed.

"I learned more about myself in one month than in thirteen years of normal life," Kira replied. "I discovered that comfort isn't the same as happiness, and that humans are capable of extraordinary things when circumstances demand it."

She would return to Antarctica many times as an adult—always seeking that edge where comfort ended and genuine living began.`,
    word_count: 270,
    lexile: '990L',
    vocabulary: [
      { word: 'uninhabitable', definition: 'not suitable for living in', sentence: 'The ship would become uninhabitable within hours.' },
      { word: 'morale', definition: 'the confidence and enthusiasm of a group', sentence: 'She helped maintain morale during the crisis.' },
      { word: 'fundamental', definition: 'forming a necessary base or core', sentence: 'The fundamental challenge remained: humans versus nature.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Cave Rescue',
    content: `When floodwaters trapped twelve members of a youth soccer team inside Thailand's Tham Luang cave system in 2018, the world watched anxiously. Among those following the rescue was fourteen-year-old Niran, who lived in a nearby village and knew several of the trapped boys.

Niran couldn't join the professional rescue teams, but he found other ways to contribute. He helped coordinate volunteer efforts, translating between Thai rescue workers and international divers who had flown in from around the world. He ran supplies to the cave entrance, carried messages, and helped manage the crowds of journalists and onlookers.

The rescue operation revealed both the best and worst of humanity. Retired Thai Navy SEAL Saman Kunan died placing oxygen tanks along the escape route. Thousands of volunteers worked around the clock. But Niran also saw opportunists exploiting the crisis, spreading misinformation, and interfering with rescue efforts.

After 18 days, all twelve boys and their coach were brought out alive—an outcome that had seemed impossible when the operation began. The world celebrated, then moved on to the next crisis.

But Niran didn't move on. The experience had changed him. He saw how ordinary people could accomplish extraordinary things through coordination, determination, and selflessness. He also saw how fragile life was, how quickly normal could become catastrophic.

"What did you learn?" his grandfather asked when life returned to routine.

"That heroism isn't about individuals," Niran replied. "It's about communities choosing to care for each other. The boys survived because thousands of strangers decided their lives mattered."`,
    word_count: 270,
    lexile: '980L',
    vocabulary: [
      { word: 'coordinate', definition: 'to organize people or activities to work together effectively', sentence: 'He helped coordinate volunteer efforts.' },
      { word: 'opportunists', definition: 'people who exploit circumstances for personal gain', sentence: 'He saw opportunists exploiting the crisis.' },
      { word: 'catastrophic', definition: 'involving sudden great damage or disaster', sentence: 'Normal could quickly become catastrophic.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Library of Unwritten Books',
    content: `Behind an ordinary door in an ordinary library existed something extraordinary: the Library of Unwritten Books. Here, on endless shelves stretching into misty infinity, resided every book that had ever been imagined but never completed—abandoned novels, unfinished poems, stories that died with their creators.

Fourteen-year-old Vera discovered the Library by accident, chasing a manuscript page that had blown through a mysterious door. What she found inside changed her understanding of creativity itself.

The Librarian—an ancient being who appeared differently to each visitor—explained the Library's purpose. "Every unfinished work contains potential energy. Stories want to be told. When creators abandon them, that energy remains, waiting."

Vera explored the shelves, finding works by famous authors—novels Dickens never finished, poems Dickinson never published—alongside millions of works by unknown creators. Each book pulsed with unrealized possibility.

"Can these stories be completed?" Vera asked.

"Some can. When a living writer connects with an unwritten work, they can become its new vessel. But they must honor the original vision while adding their own voice. It requires humility and creativity in equal measure."

Vera found a half-finished novel that spoke to her—a fantasy about a girl who communicated with trees. The original author had died in 1952, leaving only three chapters. Vera began adding to it, feeling the original writer's intentions guiding her while her own imagination expanded the story.

When she finally completed the novel years later, she dedicated it to "the writer who began this journey and trusted a stranger to finish it."

Some stories, she learned, were too important to remain untold.`,
    word_count: 275,
    lexile: '970L',
    vocabulary: [
      { word: 'manuscript', definition: 'a handwritten or typed document, especially an author\'s work', sentence: 'She chased a manuscript page through the door.' },
      { word: 'vessel', definition: 'a container; or a person through whom something is expressed', sentence: 'Writers could become a story\'s new vessel.' },
      { word: 'humility', definition: 'a modest view of one\'s own importance', sentence: 'It required humility and creativity in equal measure.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Emotion Merchants',
    content: `In the city of Valoria, emotions could be bottled, bought, and sold. Joy was expensive, grief was cheap, and anger was regulated by the government. Fourteen-year-old Kael worked in his family's emotion shop, helping customers find the feelings they needed.

Most transactions were mundane: a dose of confidence before a job interview, a touch of calm for an anxious student, a burst of motivation for someone stuck in routine. But Kael noticed troubling patterns. Wealthy citizens could afford constant happiness, while the poor sold their positive emotions to survive, becoming hollow shells.

"This isn't right," Kael told his grandmother, who had founded the shop decades ago. "We're creating a society where only the rich can feel joy."

His grandmother sighed. "I know. When I started this business, I wanted to help people through difficult times. A grieving widow could sell her sorrow and function again. A soldier could offload trauma. But commerce corrupted the intention."

Kael began secretly redistributing emotions—skimming small amounts of joy from large purchases and giving them to those who couldn't afford positive feelings. He knew it was illegal, but he couldn't watch the emotional inequality continue.

Eventually, he was caught. Rather than punishment, however, Kael was brought before the Emotion Council—the body that governed the trade. They had been watching him, they said. They needed someone who understood both the business and its ethical problems.

"We're not asking you to fix everything," the Council leader explained. "We're asking you to help us imagine something better."

Sometimes, Kael learned, rebellion wasn't about destruction. It was about having the courage to propose alternatives.`,
    word_count: 275,
    lexile: '980L',
    vocabulary: [
      { word: 'mundane', definition: 'ordinary and everyday; lacking excitement', sentence: 'Most transactions were mundane.' },
      { word: 'commerce', definition: 'the activity of buying and selling goods and services', sentence: 'Commerce corrupted the original intention.' },
      { word: 'inequality', definition: 'unfair differences in status, wealth, or opportunity', sentence: 'He couldn\'t watch the emotional inequality continue.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Paralympic Dream',
    content: `Losing her leg in a car accident at age twelve didn't end Maya's athletic career—it transformed it. Within two years, she had become one of the fastest sprinters in the country's Paralympic program, with realistic hopes of competing in the international games.

But the journey was more complicated than simple inspiration. Maya struggled with an identity crisis that nobody seemed to understand. She didn't feel "disabled" enough for the Paralympic community, yet she could never compete equally in able-bodied events. She existed in a liminal space between worlds.

"You're an inspiration," strangers told her constantly. Maya hated that word. She wasn't running to inspire anyone. She was running because competition made her feel alive, because the track was the one place where her disability became irrelevant.

Her coach, former Paralympian Derek Williams, understood. "Inspiration porn," he called the phenomenon. "People reduce us to motivational posters so they don't have to think about accessibility, discrimination, or the actual challenges we face. They'd rather feel good about our existence than advocate for our equality."

Maya began speaking about these issues publicly, challenging comfortable narratives about disability. Some people appreciated her honesty; others accused her of ingratitude. She learned that speaking truth was often lonelier than staying silent.

At the qualifiers, Maya ran the race of her life—not for inspiration, not for narrative, but for herself. She crossed the finish line in first place, qualifying for the international team.

"How does it feel?" a reporter asked.

"Like any other athlete winning," Maya replied. "Exhausted, proud, and already thinking about the next race. That's the point. I'm an athlete. The prosthetic is equipment, not identity."`,
    word_count: 280,
    lexile: '990L',
    vocabulary: [
      { word: 'liminal', definition: 'occupying a position between two states or conditions', sentence: 'She existed in a liminal space between worlds.' },
      { word: 'accessibility', definition: 'the quality of being easily reached or used by people with disabilities', sentence: 'They didn\'t want to think about accessibility.' },
      { word: 'prosthetic', definition: 'an artificial body part', sentence: 'The prosthetic was equipment, not identity.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Chess Prodigy',
    content: `At fourteen, Marcus became the youngest grandmaster in his country's history. The media called him a genius, a prodigy, a once-in-a-generation talent. What they didn't mention was the cost.

Marcus had been playing chess since age four, training six hours daily since age eight. He had no friends outside the chess world, no hobbies, no experiences that normal teenagers took for granted. His entire identity was built on 64 squares.

When he lost his first major tournament—defeated by a computer program using strategies no human had conceived—Marcus experienced something unexpected: relief. For the first time, he wasn't the best. The pressure lifted, briefly.

His coach was furious. His parents were disappointed. But Marcus used the loss as an opportunity to ask questions he'd been suppressing for years: Who was he beyond chess? What did he actually want from life?

He took six months away from competitive play—an eternity in chess years. He read novels, learned to cook, made friends who didn't know a pawn from a rook. He discovered that the world was larger than he'd allowed himself to see.

When Marcus returned to competition, his play had changed. He was less mechanical, more creative. He took risks that surprised opponents who had memorized his previous patterns. He lost more games than before—but he won more brilliantly, too.

"You're not the player you used to be," a rival observed.

"No," Marcus agreed. "I'm better. I'm a person who plays chess, not a chess player pretending to be a person. The distinction matters more than you'd think."`,
    word_count: 270,
    lexile: '970L',
    vocabulary: [
      { word: 'prodigy', definition: 'a young person with exceptional abilities', sentence: 'The media called him a prodigy.' },
      { word: 'suppressing', definition: 'forcibly putting an end to; holding back', sentence: 'He asked questions he\'d been suppressing.' },
      { word: 'distinction', definition: 'a difference between similar things', sentence: 'The distinction matters more than you\'d think.' }
    ]
  },
  {
    genre: 'Contemporary',
    title: 'The Climate Strike',
    content: `The first time Amara skipped school to protest climate change, she stood alone outside City Hall with a hand-painted sign. The second time, three classmates joined her. By the sixth month, thousands of young people filled the streets.

Amara had never considered herself an activist. She was a good student who followed rules and avoided conflict. But learning about climate science had changed something fundamental in her worldview. The data was clear: her generation would inherit a planet dramatically altered by decisions made before they were born.

"Why aren't adults doing something?" she asked her environmental science teacher.

"Some are. But change is slow, and there are powerful interests invested in maintaining the status quo."

"Then we'll force them to change faster."

The strikes brought attention—and backlash. Some praised the students' engagement; others dismissed them as naive children manipulated by political interests. Amara received hate mail. Her grades suffered from missed classes. Universities she'd hoped to attend sent concerned letters.

But she also witnessed something remarkable: young people around the world organizing, demanding, refusing to accept that the future was already written. They might not succeed in preventing climate disaster, but they would ensure no one could claim ignorance as an excuse.

"Aren't you afraid of ruining your future?" a journalist asked.

Amara laughed bitterly. "What future? The one where coastal cities flood and ecosystems collapse? I'm fighting for a future worth having. If that means sacrificing conventional success, so be it."

Some battles, she learned, mattered more than personal comfort. Some causes required everything you had to give.`,
    word_count: 275,
    lexile: '980L',
    vocabulary: [
      { word: 'status quo', definition: 'the existing state of affairs', sentence: 'Powerful interests wanted to maintain the status quo.' },
      { word: 'backlash', definition: 'a strong negative reaction to something', sentence: 'The strikes brought attention—and backlash.' },
      { word: 'conventional', definition: 'based on what is traditionally done; ordinary', sentence: 'She was willing to sacrifice conventional success.' }
    ]
  },
  {
    genre: 'Contemporary',
    title: 'The Refugee\'s Story',
    content: `Fourteen-year-old Yusuf had crossed three borders, survived two refugee camps, and lost count of how many nights he'd slept outdoors before reaching the country that would become his new home. The journey from Syria had taken two years.

His new classmates knew none of this. They saw only a quiet foreign kid who spoke broken English and kept to himself. Some were curious, most were indifferent, a few were cruel.

"Go back to your country," someone spray-painted on his locker.

Yusuf didn't react publicly, but privately he wondered: which country? The one that no longer existed? The camps where he'd been treated like cargo? The ocean crossing where he'd watched a child drown? Americans talked about home like it was something solid and permanent. Yusuf knew better.

His English teacher, Mrs. Okafor, recognized something in his silence. She was Nigerian, had immigrated twenty years ago, understood displacement in ways native-born citizens rarely did.

"You have stories," she said after class one day. "Would you be willing to share them?"

Yusuf began writing—first for himself, then for Mrs. Okafor, eventually for the school newspaper. His accounts of the refugee experience were raw, honest, and deeply uncomfortable for readers who had never considered what desperation actually looked like.

Some people thanked him for sharing. Others accused him of exaggeration. But everyone who read his words was forced to confront the reality that millions of people faced daily.

"Why write about pain?" a classmate asked.

"Because silence lets people pretend it doesn't exist," Yusuf replied. "And pretending is how suffering continues."`,
    word_count: 275,
    lexile: '970L',
    vocabulary: [
      { word: 'displacement', definition: 'the forced movement of people from their homes', sentence: 'She understood displacement in ways others didn\'t.' },
      { word: 'desperation', definition: 'a state of hopelessness leading to extreme measures', sentence: 'Readers had never considered what desperation looked like.' },
      { word: 'confront', definition: 'to face up to and deal with something difficult', sentence: 'Everyone was forced to confront reality.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Woman Who Split the Atom',
    content: `Lise Meitner was one of the most brilliant physicists of the twentieth century—and one of the most overlooked. Her story reveals both the heights of scientific achievement and the depths of institutional prejudice.

Born in Vienna in 1878, Meitner pursued physics at a time when women were barred from universities. She audited classes, worked without pay for years, and eventually became the first female physics professor in Germany. Her research on radioactivity was groundbreaking.

Then Hitler rose to power. Meitner was Jewish. In 1938, she fled to Sweden, leaving behind her laboratory, colleagues, and life's work.

From exile, she continued corresponding with her former partner Otto Hahn. Their letters contained the seeds of one of history's most consequential discoveries. Hahn's experiments suggested that uranium atoms could be split—but he couldn't explain the physics. Meitner could.

Walking through snowy Swedish woods with her nephew, Meitner worked out the mathematics of nuclear fission. She calculated the enormous energy release, recognized its implications, and communicated her findings to physicists worldwide. The atomic age had begun.

Yet when the Nobel Prize for fission was awarded in 1944, only Hahn received it. Meitner's contributions were deliberately minimized—partly because she was a woman, partly because acknowledging a Jewish scientist's role remained politically sensitive.

Meitner never won a Nobel Prize, though she was nominated repeatedly. Element 109 was named meitnerium in her honor, decades after her death.

"Science makes people reach selflessly for truth and objectivity," she wrote. "It teaches people to accept reality, with wonder and admiration." Her life proved that even science couldn't escape human prejudice—but also that truth eventually prevails.`,
    word_count: 280,
    lexile: '1010L',
    vocabulary: [
      { word: 'fission', definition: 'the splitting of an atomic nucleus, releasing energy', sentence: 'Meitner explained the physics of nuclear fission.' },
      { word: 'institutional', definition: 'relating to established organizations and their practices', sentence: 'She faced institutional prejudice throughout her career.' },
      { word: 'consequential', definition: 'having important results or effects', sentence: 'It was one of history\'s most consequential discoveries.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Architect of Nonviolence',
    content: `Bayard Rustin organized the 1963 March on Washington—the event where Martin Luther King Jr. delivered his famous "I Have a Dream" speech. Yet most history books don't mention his name.

Rustin was a strategic genius who had studied nonviolent resistance in India, advised King on tactics, and possessed unparalleled organizational skills. But he was also gay at a time when homosexuality was not just taboo but criminal. Civil rights leaders feared that his presence would give opponents ammunition to discredit the movement.

"You're being erased from your own work," a friend told him after the March's success was attributed entirely to King.

Rustin's response revealed his character: "The movement is bigger than any individual, including me. If my visibility harms the cause, I'll work from the shadows. Justice matters more than credit."

For decades, he did exactly that—advising leaders, training activists, building coalitions—while receiving little public recognition. He organized some of the most effective protests in American history while his contributions were systematically minimized.

Only in his final years did Rustin begin receiving the acknowledgment he deserved. He spent his last decade advocating for LGBTQ rights, connecting the struggle for racial justice to broader human rights causes.

"The barometer of where one is on human rights questions is no longer the black community," he said in 1986. "It's the gay community."

Rustin died in 1987. In 2013—fifty years after the March he organized—President Obama posthumously awarded him the Presidential Medal of Freedom. His story reminds us that history often forgets the architects who built its most celebrated achievements.`,
    word_count: 275,
    lexile: '1000L',
    vocabulary: [
      { word: 'coalition', definition: 'a temporary alliance of groups for combined action', sentence: 'He excelled at building coalitions.' },
      { word: 'barometer', definition: 'something that indicates the state of something', sentence: 'He called gay rights the barometer of human rights.' },
      { word: 'posthumously', definition: 'occurring after someone\'s death', sentence: 'He was posthumously awarded the Medal of Freedom.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Accidental Influencer',
    content: `When fourteen-year-old Devon posted a video of his grandma teaching him to make pie crust, he expected maybe fifty views—mostly from relatives. Instead, the video went viral. Three million views. Interview requests. A trending hashtag: #GrandmaKnowsBest.

The problem? Devon's grandma was a fictional character. He'd been practicing accents for a school drama project, and "Grandma Edith" was actually Devon in a wig and glasses, using a voice he'd copied from old movies.

At first, the deception seemed harmless. People loved Grandma Edith's homespun wisdom and baking tips. They commented about how she reminded them of their own grandmothers. A cookbook publisher expressed interest.

Then things got complicated. A morning show wanted to interview Grandma Edith live. A charity asked her to appear at their fundraiser. Devon's fictional grandmother had become more famous than Devon himself.

"You have to come clean," his best friend warned. "This is getting out of control."

"But people are happy! They're baking pies and calling their actual grandmas. Grandma Edith is doing good."

"Grandma Edith doesn't exist. You're lying to millions of people."

Devon agonized for weeks before posting a confession video. He expected outrage—and received some. But he also received something surprising: appreciation. Fans admired both his acting skills and his eventual honesty.

"I learned that authenticity matters," Devon said in the confession video, "even when the lie seems harmless. Trust is easy to lose and hard to rebuild."

The cookbook deal fell through. But Devon got something better: a drama school scholarship and a reputation for integrity that ultimately mattered more than viral fame.`,
    word_count: 275,
    lexile: '950L',
    vocabulary: [
      { word: 'viral', definition: 'spreading rapidly through online sharing', sentence: 'The video went viral unexpectedly.' },
      { word: 'homespun', definition: 'simple and unsophisticated; folksy', sentence: 'People loved Grandma Edith\'s homespun wisdom.' },
      { word: 'authenticity', definition: 'the quality of being genuine and real', sentence: 'He learned that authenticity matters.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Substitute From Another Era',
    content: `Mr. Pemberton was the most unusual substitute teacher Westfield Middle School had ever seen. He arrived in a vintage three-piece suit, wrote on the chalkboard despite the classroom having a smartboard, and seemed genuinely confused by smartphones.

"In my day," he began every other sentence. The students initially rolled their eyes. Then they became curious. Then they became genuinely entertained.

Mr. Pemberton claimed to have graduated in 1952. When students pointed out that he appeared to be only thirty years old, he simply smiled mysteriously. His lessons, while unconventional, were surprisingly engaging. He taught history as though he had lived it—which he claimed he had.

"The moon landing was quite something," he recalled. "I was there. Well, not on the moon. But I watched the broadcast."

"Mr. Pemberton," a student asked, "are you a time traveler?"

"Don't be ridiculous," he replied. "Time travel violates the laws of physics. I merely... age slowly. Very, very slowly."

For three weeks, Mr. Pemberton was the school's most popular mystery. He refused to provide personal details but offered advice that seemed remarkably wise—particularly regarding technology addiction and the importance of face-to-face conversation.

On his final day, he left a note on the chalkboard: "The future is always uncertain, but kindness and curiosity never go out of style. It's been a pleasure teaching you young people of 2024. You're not so different from young people of other eras. Remember: history doesn't repeat, but it often rhymes."

He was never seen again. The school's records showed no file for a Mr. Pemberton. But his lessons remained—timeless, like their enigmatic teacher.`,
    word_count: 275,
    lexile: '960L',
    vocabulary: [
      { word: 'vintage', definition: 'from an earlier time; classic', sentence: 'He arrived in a vintage three-piece suit.' },
      { word: 'unconventional', definition: 'not based on or conforming to what is generally done', sentence: 'His lessons were unconventional but engaging.' },
      { word: 'enigmatic', definition: 'mysterious and difficult to understand', sentence: 'His lessons were timeless, like their enigmatic teacher.' }
    ]
  },
  {
    genre: 'Family',
    title: 'The Inheritance',
    content: `When Great-Aunt Miriam died, she left fourteen-year-old Olivia something unexpected: not money or jewelry, but a storage unit filled with seemingly random objects. A cracked teapot. Water-stained books. A trunk of old clothes. The family assumed it was junk.

"She was eccentric," Olivia's mother sighed. "Just donate everything."

But Olivia was curious. She spent weekends cataloging the storage unit's contents, discovering that each object had a story attached. Miriam had kept detailed notebooks explaining the significance of her possessions.

The cracked teapot had belonged to Miriam's grandmother, who had carried it across an ocean during immigration. The water-stained books had survived a flood that destroyed Miriam's first home but not her love of literature. The trunk contained clothes from significant moments: a wedding dress, a first job interview suit, a hospital gown from the day she survived cancer.

Olivia realized that Miriam hadn't left her junk—she had left her a biography in objects. Each item was a chapter in a life fully lived.

She began interviewing elderly relatives about their own significant objects. She photographed each item, recorded the accompanying stories, and assembled them into a family archive. What started as curiosity became an obsession with preserving memories that would otherwise vanish.

"Why does this matter?" her skeptical brother asked.

"Because we're the last generation who will remember these people," Olivia replied. "When we die, their stories die with us—unless someone writes them down."

Miriam's final gift wasn't the objects themselves. It was teaching Olivia that ordinary things become extraordinary when we understand what they meant to someone who loved them.`,
    word_count: 275,
    lexile: '960L',
    vocabulary: [
      { word: 'eccentric', definition: 'unconventional and slightly strange', sentence: 'People assumed Miriam was simply eccentric.' },
      { word: 'cataloging', definition: 'making a systematic list of items', sentence: 'She spent weekends cataloging the contents.' },
      { word: 'archive', definition: 'a collection of historical documents or records', sentence: 'She assembled them into a family archive.' }
    ]
  },
  {
    genre: 'Environment',
    title: 'The Seed Vault',
    content: `Deep inside an Arctic mountain, frozen seeds wait for the end of the world. The Svalbard Global Seed Vault stores over a million seed samples from every country on Earth—a backup for humanity's food supply should catastrophe strike.

Fourteen-year-old Astrid's mother worked at the vault as a conservation biologist. When Astrid visited during summer break, she expected cold storage rooms and filing systems. What she found was something more profound: a temple to biodiversity.

"Every seed here represents thousands of years of careful cultivation," her mother explained. "Farmers selecting the best plants, saving seeds, adapting crops to local conditions. We're preserving not just genetic material but human knowledge."

Astrid learned that the vault had already been used once—when Syria's civil war destroyed the Aleppo seed bank. Seeds that had been safely backed up in Svalbard were returned, allowing researchers to continue preserving varieties developed over millennia in the Fertile Crescent.

"We lost the building but not the heritage," her mother said. "That's why redundancy matters."

The visit changed Astrid's relationship with food. She began researching where her meals came from, learning about the industrial agriculture that had reduced crop diversity to dangerously narrow levels. She started a school garden focused on heirloom varieties—plants that supermarkets didn't carry but that carried irreplaceable genetic diversity.

"One seed seems so small," she told her class during a presentation. "But inside it is the potential to feed millions of people. Protecting seeds means protecting the future—and remembering that progress sometimes means preserving what we already have."`,
    word_count: 270,
    lexile: '1000L',
    vocabulary: [
      { word: 'biodiversity', definition: 'the variety of plant and animal life in a habitat', sentence: 'The vault was a temple to biodiversity.' },
      { word: 'redundancy', definition: 'having backup systems in case of failure', sentence: 'That\'s why redundancy matters.' },
      { word: 'cultivation', definition: 'the process of growing and tending plants', sentence: 'Each seed represented thousands of years of cultivation.' }
    ]
  },
  {
    genre: 'Mythology',
    title: 'The Weight of the Sky',
    content: `In Greek mythology, Atlas was condemned to hold up the sky for eternity—a punishment for leading the Titans against the Olympian gods. But the myth usually ends there, frozen in eternal suffering. This is a different ending.

After thousands of years, Atlas grew philosophical about his burden. He observed humanity from his fixed position, watching civilizations rise and fall, seeing patterns that mortals, caught in their brief lives, could never perceive.

One day, Hermes—messenger of the gods—visited with an offer. Zeus would consider releasing Atlas if he could answer a single question: "What have you learned holding up the sky?"

Atlas thought for centuries before responding.

"I've learned that the sky doesn't need me," he finally said. "It would hold itself up through the same forces that move the stars. My punishment wasn't the weight—it was believing the weight was mine alone to carry."

Hermes was surprised. "You're saying your punishment was meaningless?"

"No. I'm saying my punishment was believing I was indispensable. The greatest prison isn't physical burden—it's the belief that we're uniquely responsible for things beyond our control."

Zeus, hearing this wisdom, offered Atlas a choice: continue holding the sky or let it go. Either way, his physical punishment would end.

Atlas chose to let go.

The sky, of course, remained exactly where it was.

Atlas walked among mortals, teaching a simple lesson: carry what you can, but remember that the world doesn't depend on any single pair of shoulders. Those who believe otherwise imprison themselves more completely than any god could manage.`,
    word_count: 270,
    lexile: '980L',
    vocabulary: [
      { word: 'condemned', definition: 'sentenced to a particular punishment', sentence: 'Atlas was condemned to hold up the sky.' },
      { word: 'philosophical', definition: 'relating to deep thought about fundamental questions', sentence: 'Atlas grew philosophical about his burden.' },
      { word: 'indispensable', definition: 'absolutely necessary; essential', sentence: 'His punishment was believing he was indispensable.' }
    ]
  },
  {
    genre: 'School Life',
    title: 'The Honor Code Violation',
    content: `When evidence surfaced that half the eighth-grade class had cheated on the state standardized test, Westbrook Academy faced its greatest crisis. Among the accused was fourteen-year-old Naomi—class president, straight-A student, and until that moment, a person who had never cheated in her life.

The accusation was false. Naomi hadn't cheated. But the evidence—suspicious answer patterns detected by the testing company's algorithm—suggested otherwise. Her seat was near several confirmed cheaters. The algorithm couldn't distinguish between someone who cheated and someone who happened to sit nearby.

"Just admit it and accept the consequences," the principal advised. "It'll go easier."

"I won't confess to something I didn't do," Naomi replied.

What followed was a months-long battle. Naomi researched false positive rates in cheating detection algorithms. She gathered character witnesses. She demanded access to the raw data—and found that the algorithm had flagged 23% of students, far exceeding actual cheating rates.

Her challenge forced the school to reconsider its blind faith in technology. The algorithm, designed to catch cheaters, had created cheaters where none existed. Its accusations carried more weight than student testimony, teacher observations, or academic records.

Naomi was eventually cleared, but she refused to simply move on. She lobbied for policies requiring human review of algorithmic accusations. She wrote op-eds about the danger of treating computer output as infallible truth.

"Algorithms are tools," she concluded in a school assembly presentation. "They reflect the biases of their creators. When we treat them as objective judges, we surrender our responsibility to think critically. That's the real cheating—cheating ourselves out of justice."`,
    word_count: 275,
    lexile: '990L',
    vocabulary: [
      { word: 'algorithm', definition: 'a process or set of rules followed by a computer', sentence: 'The testing company\'s algorithm flagged her.' },
      { word: 'infallible', definition: 'incapable of making mistakes; always right', sentence: 'They treated computer output as infallible truth.' },
      { word: 'lobbied', definition: 'sought to influence decision-makers on an issue', sentence: 'She lobbied for policy changes.' }
    ]
  }
];

function generateContextualQuestions(template) {
  const title = template.title;
  const vocab = template.vocabulary[0];

  return [
    {
      question_number: 1,
      question_text: `What central theme does "${title}" explore?`,
      question_type: 'theme',
      correct_answer: 'B',
      choice_a: 'Material success is the most important goal in life',
      choice_b: 'Complex moral questions require thoughtful consideration and personal integrity',
      choice_c: 'Avoiding difficult situations is always the wisest choice',
      choice_d: 'Individual actions have no impact on larger systems'
    },
    {
      question_number: 2,
      question_text: 'What is the author\'s purpose in telling this story?',
      question_type: 'author_purpose',
      correct_answer: 'C',
      choice_a: 'To provide simple entertainment without deeper meaning',
      choice_b: 'To prove that problems solve themselves over time',
      choice_c: 'To examine ethical complexity and the importance of principled action',
      choice_d: 'To argue that individuals should avoid controversy'
    },
    {
      question_number: 3,
      question_text: 'What is the central conflict or challenge in this story?',
      question_type: 'detail',
      correct_answer: 'A',
      choice_a: 'A situation requiring moral courage, critical thinking, or personal growth',
      choice_b: 'There is no real conflict present',
      choice_c: 'A simple problem with an obvious solution',
      choice_d: 'A challenge that resolves without any character action'
    },
    {
      question_number: 4,
      question_text: 'How does the story\'s structure contribute to its meaning?',
      question_type: 'analyze_structure',
      correct_answer: 'B',
      choice_a: 'The structure is random and has no impact on meaning',
      choice_b: 'The progression of events builds toward thematic resolution',
      choice_c: 'The structure undermines the story\'s message',
      choice_d: 'Events are presented without logical connection'
    },
    {
      question_number: 5,
      question_text: 'What can you infer about the values demonstrated in this story?',
      question_type: 'inference',
      correct_answer: 'D',
      choice_a: 'Success justifies any means necessary',
      choice_b: 'Conformity is more important than truth',
      choice_c: 'Personal comfort should take priority over principles',
      choice_d: 'Integrity, courage, and thoughtful action are essential to meaningful life'
    },
    {
      question_number: 6,
      question_text: 'How do the characters demonstrate growth or change?',
      question_type: 'character_analysis',
      correct_answer: 'A',
      choice_a: 'Through confronting challenges and developing deeper understanding',
      choice_b: 'By avoiding all difficult situations',
      choice_c: 'Characters show no development throughout the story',
      choice_d: 'By becoming more selfish and isolated'
    },
    {
      question_number: 7,
      question_text: `What does "${vocab.word}" mean in context?`,
      question_type: 'vocabulary',
      correct_answer: 'B',
      choice_a: 'A type of weather phenomenon',
      choice_b: vocab.definition.charAt(0).toUpperCase() + vocab.definition.slice(1),
      choice_c: 'A geographical feature',
      choice_d: 'A musical term'
    },
    {
      question_number: 8,
      question_text: 'What is the significance of the story\'s turning point?',
      question_type: 'sequence',
      correct_answer: 'C',
      choice_a: 'The turning point has no real significance',
      choice_b: 'It allows characters to avoid facing challenges',
      choice_c: 'It marks a crucial moment of decision, action, or realization',
      choice_d: 'It occurs at the very beginning of the story'
    },
    {
      question_number: 9,
      question_text: 'What causes lead to the story\'s resolution?',
      question_type: 'cause_effect',
      correct_answer: 'A',
      choice_a: 'Character choices, actions, and their consequences',
      choice_b: 'Random chance with no connection to character actions',
      choice_c: 'External forces that characters have no influence over',
      choice_d: 'The story has no clear resolution'
    },
    {
      question_number: 10,
      question_text: 'How might the themes of this story apply to real-world situations?',
      question_type: 'critical_evaluation',
      correct_answer: 'D',
      choice_a: 'The themes have no relevance beyond the story',
      choice_b: 'Real-world situations are completely different',
      choice_c: 'Applying fictional themes to reality is impossible',
      choice_d: 'The themes illuminate ethical challenges people face in various contexts'
    }
  ];
}

async function seedStories() {
  console.log('=== Seeding Grade 6 Stories ===\n');

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
      reading_level: template.lexile || '980L',
      word_count: template.word_count || 275,
      lexile_band: '950L-1050L',
      grade_level: 6,
      expected_time_minutes: 30,
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
  console.log('Inserted ' + inserted + ' Grade 6 stories');
  console.log('Each with 10 comprehension questions');
  console.log('Total questions: ' + (inserted * 10));

  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 6);
  console.log('\nVerified Grade 6 stories in database: ' + count);
}

seedStories();
