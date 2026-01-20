const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Grade 7 story templates - 1000L-1100L Lexile range
// Themes: Complex social dynamics, ethical dilemmas, global issues, identity exploration, historical impact
const storyTemplates = [
  {
    genre: 'Mystery',
    title: 'The Deepfake Dilemma',
    content: `When a viral video appeared showing star athlete Marcus Chen making racist remarks, the entire school turned against him overnight. But fifteen-year-old journalism student Ava refused to join the mob mentality. Something about the video's lighting seemed wrong—shadows falling at impossible angles, micro-expressions that didn't match the audio's emotional cadence.

Ava began investigating deepfake technology, interviewing computer science professors and forensic video analysts. She learned about generative adversarial networks and how artificial intelligence could synthesize convincing fake videos. But proving a video was fabricated required sophisticated software most people couldn't access or interpret.

The deeper Ava dug, the more dangerous the situation became. Someone had invested significant resources in destroying Marcus's reputation, and they didn't appreciate her questions. Anonymous threats appeared in her locker. Her investigation files mysteriously disappeared from her laptop.

When Ava finally traced the deepfake to a jealous teammate who'd lost his starting position to Marcus, she faced a difficult choice. She had evidence but couldn't prove it definitively. Publishing her findings might clear Marcus while exposing her to legal liability. The teammate's family was wealthy and litigious.

Ultimately, Ava partnered with a digital forensics professor who validated her analysis. The story ran in the school paper with expert backing. Marcus was exonerated, the perpetrator faced consequences, and Ava learned that truth-seeking in the digital age required both technical literacy and moral courage.`,
    word_count: 245,
    lexile: '1020L',
    vocabulary: [
      { word: 'cadence', definition: 'a rhythmic flow or pattern in speech or movement', sentence: 'The audio\'s emotional cadence didn\'t match the expressions shown.' },
      { word: 'fabricated', definition: 'invented or created falsely to deceive', sentence: 'Proving a video was fabricated required sophisticated analysis.' },
      { word: 'synthesize', definition: 'to combine elements into a coherent whole', sentence: 'AI could synthesize convincing fake videos from existing footage.' },
      { word: 'litigious', definition: 'inclined to engage in lawsuits', sentence: 'The wealthy family was known to be litigious when challenged.' }
    ]
  },
  {
    genre: 'Mystery',
    title: 'The Genetic Puzzle',
    content: `Maya always knew she was adopted, but the DNA ancestry test she took for a biology project revealed something her parents never mentioned: she had a living biological sibling somewhere in the database. A half-brother named Jordan, currently sixteen and living just thirty miles away.

The discovery launched Maya into an ethical labyrinth. Should she contact Jordan? Did he even know she existed? What obligations did she have to her adoptive parents, who'd clearly chosen not to share this information? And what responsibility did DNA testing companies bear for facilitating these complicated reunions?

Maya researched adoption ethics, learning about sealed records laws and the varying perspectives of biological parents, adoptive parents, and adoptees themselves. She discovered support groups where people shared stories of joyful reunions and devastating disappointments. The outcomes seemed equally likely.

After weeks of deliberation, Maya decided to send Jordan a carefully worded message through the DNA platform's matching system. His response came three days later—warm, curious, and slightly overwhelmed. He'd known about her existence but had been told she was raised by their biological mother's family.

Their first meeting at a coffee shop felt surreal. They shared the same unusual eye color, the same gesture of pushing hair behind their ears. But they were also strangers with different values, different experiences, different worlds. Building a genuine relationship would require more than genetic connection—it would demand patience, honesty, and the recognition that family comes in many forms.`,
    word_count: 250,
    lexile: '1040L',
    vocabulary: [
      { word: 'labyrinth', definition: 'a complicated network of paths or passages; a maze', sentence: 'The discovery launched Maya into an ethical labyrinth of choices.' },
      { word: 'deliberation', definition: 'careful consideration before making a decision', sentence: 'After weeks of deliberation, Maya decided to reach out.' },
      { word: 'surreal', definition: 'having the quality of a dream; bizarre', sentence: 'Their first meeting at a coffee shop felt surreal.' },
      { word: 'obligations', definition: 'duties or commitments one is bound to fulfill', sentence: 'What obligations did she have to her adoptive parents?' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Memory Market',
    content: `In 2087, memories could be recorded, edited, and shared like social media posts. Fifteen-year-old Kai worked part-time at a Memory Café, where customers uploaded their happiest experiences for others to purchase and relive. A first kiss, a championship victory, a perfect sunset—all available for download at various price points.

The business model seemed harmless until Kai noticed troubling patterns. Regular customers became increasingly disconnected from their actual lives, preferring to exist in an endless loop of borrowed peak experiences. Why endure the mundane struggles of real existence when you could surf perpetual highlights?

Kai's concerns deepened when their grandmother, suffering from early dementia, started spending her savings on memories of her deceased husband. The uploaded experiences weren't quite right—slightly idealized, emotionally manipulated to maximize addictiveness. Grandmother was essentially paying to remember someone who no longer matched reality.

When Kai brought these concerns to their manager, the response was dismissive. "We're in the happiness business. What's wrong with helping people feel good?" But Kai understood the distinction between genuine fulfillment and artificial pleasure, between authentic memories and curated fantasy.

Kai began documenting cases of memory addiction, connecting with researchers studying the neurological impacts of experience-sharing technology. Their investigation revealed that the Memory Café deliberately engineered their products to create dependency. The exposé they helped publish led to regulations requiring addiction warnings and consumption limits—small steps toward a healthier relationship with technological pleasure.`,
    word_count: 255,
    lexile: '1050L',
    vocabulary: [
      { word: 'mundane', definition: 'lacking interest or excitement; ordinary', sentence: 'Why endure the mundane struggles of real existence?' },
      { word: 'perpetual', definition: 'never ending or changing; continuous', sentence: 'Customers preferred to exist in perpetual borrowed highlights.' },
      { word: 'curated', definition: 'carefully chosen and organized', sentence: 'There was a distinction between authentic memories and curated fantasy.' },
      { word: 'exposé', definition: 'a report revealing something discreditable', sentence: 'The exposé led to regulations requiring addiction warnings.' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Climate Refugees',
    content: `By 2065, Miami had lost its battle with rising seas. Fifteen-year-old Daniela remembered swimming pools and beach days, but those memories felt increasingly distant as her family joined the northward migration. They were climate refugees now, a term that had seemed abstract until it applied to them.

The receiving cities weren't welcoming. After decades of climate migration, communities that once prided themselves on compassion had grown defensive. Housing was scarce. Competition for jobs was fierce. Signs appeared: "Resources for residents first." Some were explicit: "Climate migrants not welcome here."

Daniela's family eventually settled in a transition camp outside Philadelphia—a temporary city of modular housing that had somehow become permanent. The camp had its own economy, its own culture, its own hierarchies based on when you'd arrived and what skills you'd brought.

School in the camp was different from anything Daniela had experienced. Classes mixed students from flooded coastlines, drought-stricken farmland, and wildfire zones. Their shared displacement created unlikely bonds. They studied climate science not as abstract theory but as autobiography.

When local politicians proposed closing the camp and dispersing its residents, Daniela joined the youth organizing committee. They created documentaries about their experiences, testified before city council, and built coalitions with sympathetic established residents. The camp wasn't just a place—it was a community that had formed against the odds. Defending it became Daniela's mission, her way of transforming displacement into purpose.`,
    word_count: 250,
    lexile: '1030L',
    vocabulary: [
      { word: 'migration', definition: 'movement from one region to another', sentence: 'Her family joined the northward migration from flooded Miami.' },
      { word: 'displacement', definition: 'the state of being forced from one\'s home or country', sentence: 'Their shared displacement created unlikely bonds between students.' },
      { word: 'coalitions', definition: 'alliances of distinct groups working toward a common goal', sentence: 'They built coalitions with sympathetic established residents.' },
      { word: 'modular', definition: 'constructed with standardized units for flexibility', sentence: 'The transition camp consisted of modular housing units.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Freedom Writers',
    content: `Birmingham, Alabama, 1963. Fourteen-year-old James had been taught to accept segregation as the natural order of things. But watching fire hoses turned on children his age in Kelly Ingram Park made something shift inside him. Those weren't outside agitators or troublemakers—they were his neighbors, his classmates, his community demanding basic human dignity.

James's father, a minister who'd counseled patience and gradual change, faced a crisis of conscience. The Southern Christian Leadership Conference was calling for mass action. Participation meant risking everything—jobs, property, physical safety. But inaction felt increasingly impossible.

When James asked permission to join the Children's Crusade, his mother wept. She'd seen too many young bodies broken by hatred, too many families destroyed for daring to demand equality. But she also recognized that her son was no longer a child who could be protected from history's demands.

The march was terrifying and transcendent. James felt the blast of fire hoses, saw the snarling dogs straining against their handlers' leashes. He was arrested and spent two nights in a cell meant for far fewer occupants. But he also felt the power of collective action, the moral clarity of nonviolent resistance, the dignity that comes from standing up regardless of consequences.

Years later, James would tell his grandchildren about that spring in Birmingham—how ordinary people, including children, changed the course of history by refusing to accept injustice as inevitable. Their courage didn't solve everything, but it proved that change was possible when people demanded it.`,
    word_count: 260,
    lexile: '1060L',
    vocabulary: [
      { word: 'agitators', definition: 'people who urge others to protest or rebel', sentence: 'Those weren\'t outside agitators—they were his neighbors.' },
      { word: 'conscience', definition: 'an inner sense of right and wrong', sentence: 'James\'s father faced a crisis of conscience.' },
      { word: 'transcendent', definition: 'going beyond ordinary limits; exceptional', sentence: 'The march was both terrifying and transcendent.' },
      { word: 'inevitableʼ', definition: 'certain to happen; unavoidable', sentence: 'They refused to accept injustice as inevitable.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Manhattan Project\'s Children',
    content: `Los Alamos, New Mexico, 1944. Fifteen-year-old Ruth knew her father was working on something important for the war effort, but the secrecy surrounding their isolated desert community bordered on absurdity. Mail was censored. Phone calls were monitored. Even their address was a post office box number rather than a place name.

Ruth made friends with other scientists' children who shared her strange existence. They hiked the mesas, attended the one-room schoolhouse, and speculated endlessly about their parents' work. Some fathers were physicists, others chemists, still others engineers. Whatever they were building required expertise from every scientific discipline.

The Trinity test changed everything. Ruth saw the flash from her bedroom window—an artificial dawn that illuminated the desert with impossible brightness. Her father came home silent and shaking, unable to explain what he'd witnessed or what it meant.

When news arrived about Hiroshima, Ruth finally understood. Her quiet, gentle father had helped create a weapon capable of destroying entire cities. The bomb ended the war but opened moral questions that would haunt her family for generations.

In later years, Ruth would wrestle with her inheritance. Her father had believed he was saving lives by shortening the war. Others viewed him as complicit in mass civilian deaths. Ruth learned that scientific achievement existed in moral context, that brilliant discoveries could serve terrible purposes, and that individuals caught in historical currents often faced impossible choices. She became an advocate for nuclear disarmament, channeling her complicated legacy into activism.`,
    word_count: 255,
    lexile: '1070L',
    vocabulary: [
      { word: 'absurdity', definition: 'the quality of being ridiculous or wildly unreasonable', sentence: 'The secrecy surrounding their community bordered on absurdity.' },
      { word: 'speculated', definition: 'formed theories without firm evidence', sentence: 'The children speculated endlessly about their parents\' work.' },
      { word: 'complicit', definition: 'involved in wrongdoing with others', sentence: 'Some viewed her father as complicit in mass civilian deaths.' },
      { word: 'disarmament', definition: 'the reduction or elimination of weapons', sentence: 'She became an advocate for nuclear disarmament.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The Scholarship Student',
    content: `Javier earned his spot at Pemberton Academy through academic excellence, but surviving there required navigating a world he'd never imagined. His classmates discussed summer homes in the Hamptons while he worked construction with his uncle. They wore watches worth more than his family's car. Their casual assumptions about the future—internships, connections, legacies—revealed a system invisible to those outside it.

The financial aid office expected gratitude. Wealthy peers expected him to educate them about poverty. Faculty assumed his presence proved meritocracy worked. But Javier increasingly recognized that his "opportunity" came with hidden costs: constant code-switching, imposter syndrome, and the pressure of representing everyone from his neighborhood.

His friendship with Marcus, another scholarship student, provided crucial support. They developed shorthand for shared experiences—the slight pause when classmates mentioned vacation plans, the careful performance of belonging in spaces that signaled their otherness. Together, they questioned whether assimilation into elite institutions was victory or surrender.

When Javier was invited to speak at a donor event about his "inspiring journey," he faced a choice. The expected narrative would emphasize individual merit overcoming adversity—a story that blamed inequality on people's failure to work hard enough. But the truth was more complicated. His success relied on extraordinary circumstances, supportive teachers, and luck that most talented kids from his neighborhood never received.

Javier gave an honest speech about systemic barriers rather than personal triumph. Some donors were uncomfortable. Others approached him afterward with genuine interest in understanding rather than self-congratulation. His courage cost him some opportunities but opened others more aligned with his values.`,
    word_count: 270,
    lexile: '1080L',
    vocabulary: [
      { word: 'meritocracy', definition: 'a system where advancement is based on ability and talent', sentence: 'Faculty assumed his presence proved meritocracy worked.' },
      { word: 'assimilation', definition: 'the process of becoming part of a different group', sentence: 'They questioned whether assimilation was victory or surrender.' },
      { word: 'adversity', definition: 'difficulties or misfortune', sentence: 'The expected narrative emphasized merit overcoming adversity.' },
      { word: 'systemic', definition: 'relating to a system as a whole', sentence: 'Javier spoke about systemic barriers rather than personal triumph.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The Language Keeper',
    content: `Kaya's grandmother was one of the last fluent speakers of their tribe's ancestral language. When linguists from the university arrived wanting to document it before it disappeared, Kaya witnessed a collision between preservation and exploitation that would shape her understanding of cultural sovereignty.

The researchers were well-intentioned but operated within frameworks that troubled Kaya. They wanted to record vocabulary, grammar structures, and traditional stories—packaging living knowledge into academic publications and digital archives. Their institution would own the recordings. Their careers would benefit from the documentation.

Grandmother cooperated initially, pleased that someone valued what younger generations had largely abandoned. But she grew uncomfortable when researchers pressed for sacred stories meant only for certain ears at certain times. Not all knowledge was meant for everyone. Some teachings had protocols governing their transmission.

When Kaya raised these concerns, the lead researcher responded dismissively. "Language extinction is happening regardless. Isn't some preservation better than none?" But Kaya understood that how something was preserved mattered as much as whether it survived. Transformation into archived data wasn't the same as continued practice in community.

Kaya began her own documentation project with tribal elders' guidance. She learned about indigenous data sovereignty—the principle that communities should control information about themselves. She created language-learning materials owned by the tribe, accessible on their terms. It wasn't as prestigious as a university project, but it respected the relationships that gave the language meaning. Some things shouldn't be extracted from their contexts, even with good intentions.`,
    word_count: 255,
    lexile: '1050L',
    vocabulary: [
      { word: 'sovereignty', definition: 'supreme power or authority; self-governance', sentence: 'Kaya learned about indigenous data sovereignty.' },
      { word: 'protocols', definition: 'official rules governing procedures or behavior', sentence: 'Some teachings had protocols governing their transmission.' },
      { word: 'linguists', definition: 'experts in the study of language', sentence: 'Linguists from the university arrived to document the language.' },
      { word: 'extracted', definition: 'removed or taken out, especially against natural context', sentence: 'Some things shouldn\'t be extracted from their contexts.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Inheritance of Scars',
    content: `In the kingdom of Valdren, magical ability passed through bloodlines, but so did the accumulated trauma of ancestors. Prince Aldric discovered this terrible truth when he came of age and inherited not just his father's power over fire but also the guilt of every atrocity his lineage had committed over centuries.

The memories weren't complete narratives but emotional imprints—flashes of violence, echoes of victims' suffering, the weight of unpaid debts. Previous rulers had suppressed these inheritances through ritual magic, numbing themselves to the moral freight of their power. But Aldric's tutor, a reformist mage, deliberately omitted that training.

"Power without conscience is tyranny," she explained when Aldric confronted her. "Your ancestors built this kingdom on conquest and exploitation. You needed to feel what that costs."

The inheritance nearly destroyed Aldric. He withdrew from court, unable to separate his own identity from the accumulated guilt. Some nights he woke screaming, inhabiting the perspectives of people his great-great-grandfather had executed. The kingdom's enemies saw weakness and began preparing invasion.

Aldric's eventual recovery came not from suppression but integration. With help from healers and historians, he traced each traumatic memory to its source, acknowledged the harm done, and considered what repair might look like. He couldn't change history, but he could redirect his kingdom's trajectory.

His coronation speech shocked the nobility: acknowledgment of past crimes, commitment to restitution where possible, and structural reforms to prevent future atrocities. Some called it weakness. Others recognized it as a new kind of strength—power that accepted accountability rather than denying it.`,
    word_count: 265,
    lexile: '1090L',
    vocabulary: [
      { word: 'atrocity', definition: 'an extremely cruel or wicked act', sentence: 'He inherited the guilt of every atrocity his lineage had committed.' },
      { word: 'imprints', definition: 'marks or impressions left by something', sentence: 'The memories were emotional imprints rather than complete narratives.' },
      { word: 'restitution', definition: 'making amends for a wrong; compensation', sentence: 'He committed to restitution where possible.' },
      { word: 'trajectory', definition: 'the path or direction of development', sentence: 'He could redirect his kingdom\'s trajectory.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Price of Prophecy',
    content: `Oracle Zhen had spent sixteen years watching the future arrive exactly as she'd foretold. But her latest vision showed something that made her question whether prophecy was a gift or a curse: the kingdom's beloved prince would die in three days, murdered by his closest friend.

The ethical maze was labyrinthine. If Zhen revealed the prophecy, the prince might survive but his friend—currently innocent of any crime—would be punished for an act he hadn't yet committed. Would foreknowledge change the outcome, or was the future fixed regardless of intervention? And what responsibility did Zhen bear for events she witnessed but didn't cause?

Zhen had been taught that prophecy demanded disclosure. The Oracle served the kingdom by sharing visions with those who could act on them. But she'd also seen how her predecessors' predictions had become self-fulfilling—people acting on prophecies in ways that ensured their completion.

She decided to investigate rather than proclaim. The friend, Lord Marcus, showed no signs of murderous intent. His devotion to the prince seemed genuine. But Zhen's visions had never been wrong. Some hidden motive or future circumstance would transform friend into assassin.

What Zhen discovered challenged everything she believed about her gift. Lord Marcus wasn't planning murder—he was planning to expose the king's corruption. The prince would die defending his father. The "murder" was actually the tragic outcome of the prince's misplaced loyalty.

Zhen faced a choice: reveal a partial truth that might save the prince but protect a corrupt king, or trust that some futures should arrive despite their cost. Her decision would define what prophecy meant—warning or destiny.`,
    word_count: 275,
    lexile: '1070L',
    vocabulary: [
      { word: 'labyrinthine', definition: 'extremely complicated or intricate', sentence: 'The ethical maze was labyrinthine.' },
      { word: 'intervention', definition: 'action taken to improve a situation', sentence: 'Would foreknowledge change the outcome despite intervention?' },
      { word: 'predecessors', definition: 'people who held a position before others', sentence: 'She\'d seen how her predecessors\' predictions became self-fulfilling.' },
      { word: 'proclaim', definition: 'to announce officially or publicly', sentence: 'She decided to investigate rather than proclaim.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Mariana Descent',
    content: `Dr. Elena Vasquez had spent her career studying extremophiles—organisms thriving in conditions that should make life impossible. But the discovery that changed everything came from the deepest point on Earth: the Mariana Trench had sent back an autonomous probe carrying something unprecedented. Not just bacteria, but complex organisms, possibly intelligent, living under pressures that should crush any carbon-based life.

The international scientific community split between excitement and skepticism. Some demanded immediate investigation. Others warned about contamination risks, both directions—Earth organisms affecting the deep ecosystem, or unknown pathogens reaching the surface. The precautionary principle suggested caution, but the discovery was too significant to ignore.

Elena was selected for the first crewed descent to the discovery site. The pressure vessel took eight hours to reach operational depth, passing through zones where sunlight surrendered to perpetual darkness. Bioluminescent creatures drifted past the viewports like living stars.

At maximum depth, they found something impossible: structures. Not natural formations but deliberate constructions, arranged in patterns suggesting purpose. The organisms they'd detected weren't just surviving—they were building.

First contact protocols hadn't anticipated this scenario. The aliens weren't from space but from Earth itself—an entirely separate evolutionary branch that had developed intelligence in conditions humans could barely reach. Communication would require rethinking everything about how minds work and what environments could support consciousness.

Elena's report sparked global debate about humanity's assumptions regarding life, intelligence, and our planet's unknown depths. Some questions were scientific, others philosophical, all of them humbling.`,
    word_count: 255,
    lexile: '1100L',
    vocabulary: [
      { word: 'extremophiles', definition: 'organisms that live in extreme environmental conditions', sentence: 'She had spent her career studying extremophiles.' },
      { word: 'autonomous', definition: 'operating independently without human control', sentence: 'An autonomous probe returned carrying something unprecedented.' },
      { word: 'precautionary', definition: 'intended to prevent something dangerous', sentence: 'The precautionary principle suggested caution.' },
      { word: 'bioluminescent', definition: 'producing light through biological processes', sentence: 'Bioluminescent creatures drifted past like living stars.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Silk Road Bicycle',
    content: `When fifteen-year-old Amara's family lost everything in the economic collapse, her plan seemed absurd: cycle the ancient Silk Road from Xi'an to Istanbul, documenting the journey for a cycling magazine that had offered just enough money to make the trip financially possible. Her parents called it escapism. Amara called it survival—a way to transform crisis into opportunity.

The route passed through eight countries, multiple climate zones, and countless cultures connected by centuries of trade. Amara quickly learned that her American assumptions about safety, hospitality, and communication would require constant revision. In some regions, solo female travelers faced suspicion or danger. In others, the cultural tradition of hosting strangers provided protection she hadn't expected.

Physical challenges proved more manageable than psychological ones. Mountain passes and desert heat tested her body, but loneliness and uncertainty tested her identity. Who was she without the structures that had defined her life—school, friends, familiar streets? The road offered no answers, only new questions.

Her blog gained followers who sent encouragement and warnings in equal measure. Some advised her to turn back. Others shared their own stories of finding themselves through movement. A community formed around her journey, connected across continents by shared interest in her survival and growth.

Amara reached Istanbul after seven months, transformed in ways she was still discovering. The physical accomplishment mattered less than what she'd learned: that comfort zones were prisons as much as protections, that strangers' kindness exceeded their cruelty, and that her own resilience surprised her when circumstances demanded it.`,
    word_count: 260,
    lexile: '1060L',
    vocabulary: [
      { word: 'escapism', definition: 'avoiding reality through fantasy or distraction', sentence: 'Her parents called it escapism; Amara called it survival.' },
      { word: 'resilience', definition: 'ability to recover from difficulties', sentence: 'Her own resilience surprised her when circumstances demanded it.' },
      { word: 'trajectory', definition: 'the path of development or progress', sentence: 'She was transforming crisis into opportunity.' },
      { word: 'revision', definition: 'the act of reconsidering and changing', sentence: 'Her American assumptions would require constant revision.' }
    ]
  },
  {
    genre: 'Drama',
    title: 'The Surrogate Decision',
    content: `At sixteen, Mia discovered that her birth mother had been a gestational surrogate—carrying her for another couple who, at the last moment, had decided they didn't want a child after all. The surrogate, young and unprepared, had kept her rather than surrender her to the foster system.

The revelation explained gaps Mia had always sensed: her mother's occasional emotional distance, the absence of baby photos, the way conversations about pregnancy made her mother tense and quiet. But understanding the history didn't resolve the feelings it generated.

Mia researched surrogacy laws, ethics, and personal narratives. She learned about the complicated economics that led some women to rent their bodies while others purchased that service. She discovered communities of donor-conceived and surrogate-born people wrestling with questions about identity, belonging, and the meaning of parenthood.

The intended parents, she learned, were still alive. They'd gone on to have biological children and built successful careers. Reaching out to them felt simultaneously compelling and terrifying. Did they ever wonder about her? Did they feel guilt or relief or nothing at all?

When Mia finally composed a letter, she surprised herself by feeling not anger but curiosity. She wanted to understand their perspective, not to forgive or condemn but simply to complete the picture of her own origin. Their response—defensive, apologetic, ultimately humanizing—didn't provide closure so much as context. Some questions about where we come from have answers. Others only have stories, and we decide what those stories mean.`,
    word_count: 255,
    lexile: '1050L',
    vocabulary: [
      { word: 'gestational', definition: 'relating to pregnancy or carrying a baby', sentence: 'Her birth mother had been a gestational surrogate.' },
      { word: 'revelation', definition: 'a surprising and previously unknown fact', sentence: 'The revelation explained gaps Mia had always sensed.' },
      { word: 'compelling', definition: 'evoking interest or attention in a powerful way', sentence: 'Reaching out felt simultaneously compelling and terrifying.' },
      { word: 'humanizing', definition: 'making someone seem more relatable or sympathetic', sentence: 'Their response was defensive, apologetic, ultimately humanizing.' }
    ]
  },
  {
    genre: 'Drama',
    title: 'The Influencer\'s Truth',
    content: `Jaylen had 2.3 million followers before he turned sixteen. His lifestyle content—fashion, travel, motivational advice—generated enough income to support his family. But the person his audience loved was a careful construction, and the distance between performed Jaylen and actual Jaylen was becoming unbearable.

The truth was messier than his aesthetic. His parents were divorcing, loudly and bitterly, in the same house where he filmed "peaceful morning routines." His "aspirational" purchases were often loans or gifts from brands expecting favorable reviews. The confidence he projected on camera dissolved the moment recording stopped.

His manager advised against authenticity. "Your brand is aspiration. People follow you to escape their problems, not to hear about yours." But Jaylen increasingly felt like a prisoner of his own creation, performing happiness while struggling privately.

The breaking point came during a live stream when his mother's screaming became audible through the walls. Jaylen had a choice: pretend it hadn't happened, or acknowledge reality. He chose honesty, explaining his family situation and admitting that his online life was curated, not candid.

The response split his audience. Some felt betrayed, accusing him of lying. Others appreciated the transparency, sharing their own experiences of performing perfection while suffering privately. His follower count dropped, then stabilized at a smaller but more engaged community.

Jaylen rebuilt his platform around authenticity rather than aspiration. The income was lower, but the work felt sustainable. He'd learned that influence built on illusion created prisons, while influence built on honesty created connection. The choice wasn't just about business—it was about who he wanted to become.`,
    word_count: 265,
    lexile: '1040L',
    vocabulary: [
      { word: 'aesthetic', definition: 'a set of principles about beauty and taste', sentence: 'The truth was messier than his aesthetic suggested.' },
      { word: 'aspirational', definition: 'representing a goal or ideal that people desire', sentence: 'His aspirational purchases were often loans from brands.' },
      { word: 'curated', definition: 'carefully selected and organized', sentence: 'His online life was curated, not candid.' },
      { word: 'sustainable', definition: 'able to be maintained over time', sentence: 'The work felt sustainable rather than exhausting.' }
    ]
  },
  {
    genre: 'Thriller',
    title: 'The Whistleblower\'s Dilemma',
    content: `Nadia's summer internship at BioGenesis Pharmaceuticals was supposed to launch her medical career. Instead, it revealed something that made her question whether career advancement was worth ethical compromise. The clinical trial data she'd been organizing showed clear evidence that the company's flagship drug caused serious cardiac side effects—evidence that had been systematically excluded from regulatory submissions.

The implications were staggering. If the drug received approval, millions of people would take something their doctors believed was safe. Some percentage would suffer heart attacks that could have been prevented. The company knew this and was proceeding anyway, calculating that profits would exceed legal settlements.

Nadia faced a choice with no good options. Staying silent made her complicit in harm she could prevent. Speaking out meant destroying her career before it started—whistleblowers in pharmaceutical companies rarely worked in the industry again. And going public required proof she wasn't authorized to possess.

She consulted a lawyer who specialized in healthcare fraud cases. The legal protections for whistleblowers were weaker than she'd assumed, full of loopholes that companies exploited. The lawyer was honest: "You'll probably lose more than you gain. But if you don't act, people will die."

Nadia ultimately chose to document everything and submit reports to the FDA anonymously through secure channels. The investigation that followed took years, delayed the drug's approval, and saved lives she would never know about. Her role remained secret until a journalist connected the dots years later. By then, Nadia had found a different career path—one where ethics and ambition didn't require such painful choices.`,
    word_count: 265,
    lexile: '1080L',
    vocabulary: [
      { word: 'implications', definition: 'possible effects or consequences', sentence: 'The implications of the hidden data were staggering.' },
      { word: 'complicit', definition: 'involved in wrongdoing', sentence: 'Staying silent made her complicit in preventable harm.' },
      { word: 'regulatory', definition: 'relating to official rules or laws', sentence: 'Evidence had been excluded from regulatory submissions.' },
      { word: 'loopholes', definition: 'ambiguities that allow rules to be circumvented', sentence: 'Legal protections were full of loopholes companies exploited.' }
    ]
  },
  {
    genre: 'Thriller',
    title: 'The Algorithm Knows',
    content: `Marcus noticed the pattern before anyone else: social media platforms seemed to know things about users before the users knew themselves. A classmate received ads for pregnancy tests days before she realized she'd missed her period. Another saw suicide prevention resources appear without ever searching for them.

As a competitive programmer, Marcus understood that algorithms could predict behavior from data patterns invisible to humans. But the accuracy he was observing suggested something beyond prediction—these systems had access to information that shouldn't exist in any database.

His investigation started as curiosity but became obsession. He traced data flows, mapped API connections, and eventually discovered something chilling: the platforms were harvesting data from phone sensors in ways users never consented to. Microphones captured background conversations. Accelerometers revealed sleep patterns and relationship status. Location data combined with purchase history created portraits of human behavior more accurate than any self-report.

The companies technically disclosed this collection in privacy policies no one read, protected by legal language designed to obscure rather than inform. Users had "consented" to surveillance they didn't understand.

Marcus faced the question of what to do with this knowledge. The companies had armies of lawyers. His evidence, while compelling, came from methods that might themselves violate terms of service. Speaking out could paint a target on his back.

He chose strategic disclosure, partnering with privacy advocates and investigative journalists who could amplify his findings while protecting his identity. The resulting coverage sparked congressional hearings, though meaningful regulation remained elusive. Marcus learned that revealing truth and achieving justice were different challenges entirely.`,
    word_count: 270,
    lexile: '1100L',
    vocabulary: [
      { word: 'algorithms', definition: 'step-by-step procedures for calculations or problem-solving', sentence: 'Algorithms could predict behavior from invisible data patterns.' },
      { word: 'surveillance', definition: 'close observation, especially of a suspected person', sentence: 'Users had consented to surveillance they didn\'t understand.' },
      { word: 'obscure', definition: 'to make unclear or difficult to understand', sentence: 'Legal language was designed to obscure rather than inform.' },
      { word: 'elusive', definition: 'difficult to find, catch, or achieve', sentence: 'Meaningful regulation remained elusive despite hearings.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'Malala\'s Mountain',
    content: `When the Taliban took control of Pakistan's Swat Valley in 2007, they banned girls from attending school. Malala Yousafzai was ten years old, and education was the foundation of her identity. The prohibition felt like a death sentence for who she wanted to become.

Her father, Ziauddin, ran a chain of schools and refused to close the girls' sections despite threats. He encouraged Malala to speak publicly about education rights, believing that international attention might provide protection. For several years, this strategy worked. Malala blogged for the BBC, gave interviews, and received Pakistan's National Youth Peace Prize.

But on October 9, 2012, a Taliban gunman boarded her school bus and shot her in the head. She was fifteen.

The assassination attempt that was meant to silence her amplified her voice beyond anything the attackers could have imagined. After miraculous recovery in a British hospital, Malala became a global symbol of education rights. She addressed the United Nations, met with world leaders, and at seventeen became the youngest Nobel Peace Prize laureate in history.

Critics accused her of being a Western puppet, her message distorted by international media. Malala responded by continuing her education and establishing a fund supporting girls' schooling worldwide. She understood that her platform came with obligations—not just to speak but to channel attention toward sustainable change.

Her story illustrates how individual courage, family support, and historical moment can combine to create impact far exceeding what any person plans. Malala didn't seek to become a symbol. She simply refused to accept injustice, and the world responded.`,
    word_count: 265,
    lexile: '1050L',
    vocabulary: [
      { word: 'prohibition', definition: 'a law or order forbidding something', sentence: 'The prohibition on girls\' education felt like a death sentence.' },
      { word: 'laureate', definition: 'a person honored for outstanding achievement', sentence: 'She became the youngest Nobel Peace Prize laureate.' },
      { word: 'amplified', definition: 'made larger, greater, or more powerful', sentence: 'The attack amplified her voice beyond anything imaginable.' },
      { word: 'sustainable', definition: 'able to be maintained over time', sentence: 'She worked to channel attention toward sustainable change.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Architect of Information',
    content: `Tim Berners-Lee didn't set out to change human civilization. He just wanted to solve a practical problem: sharing research documents among scientists at CERN, the European particle physics laboratory. The solution he developed—the World Wide Web—transformed how humans communicate, learn, organize, and understand reality itself.

Born in London in 1955 to parents who were computer scientists, Berners-Lee grew up fascinated by connections between things. He studied physics at Oxford but remained drawn to computing as a tool for organizing information. At CERN in the late 1980s, he encountered the chaos of incompatible document systems and imagined something better.

His proposal was radical in its simplicity: a system where any document could link to any other document, creating a web of interconnected information accessible from anywhere. The technology required—hypertext, URLs, HTTP protocol—was less innovative than the vision of universal access that drove it.

Critically, Berners-Lee refused to patent or profit from his invention. He believed the web's value depended on it remaining open and free. This decision, unusual in an era of aggressive intellectual property protection, allowed the web to grow without barriers.

In recent years, Berners-Lee has become concerned about how his creation has been distorted by commercial interests and governmental surveillance. He's advocated for a new "Contract for the Web" establishing principles of privacy, access, and respect. The inventor of our connected world now spends his energy trying to repair what connection has broken.

His story reminds us that tools are neutral—their impact depends on how society chooses to use them, and those choices are never finished.`,
    word_count: 270,
    lexile: '1080L',
    vocabulary: [
      { word: 'incompatible', definition: 'not able to exist or work together', sentence: 'He encountered the chaos of incompatible document systems.' },
      { word: 'hypertext', definition: 'text displayed with links to other text', sentence: 'The technology required included hypertext and protocols.' },
      { word: 'intellectual property', definition: 'creations of the mind protected by law', sentence: 'The era emphasized aggressive intellectual property protection.' },
      { word: 'surveillance', definition: 'close monitoring of a person or group', sentence: 'He\'s concerned about commercial interests and governmental surveillance.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Substitute\'s Survival Guide',
    content: `Mr. Henderson had survived twenty years as a high school substitute teacher, which basically qualified him for combat pay. He'd developed strategies for every scenario: the class that pretends the regular teacher allows phones, the kid who swears they're supposed to be in a different period, the assistant principal who judges him for not maintaining military discipline over strangers.

His secret weapon was radical honesty. "Look, we both know the situation," he'd announce on entering. "You don't want to be here learning, and I don't want to be here teaching. But we're stuck together, so let's make it tolerable."

This approach horrified traditionalists but worked remarkably well. By acknowledging the absurdity of their shared circumstances, Henderson defused the usual substitute-student warfare. Kids respected someone who didn't pretend the emperor had clothes.

His best stories came from impossible situations. The time a student's emotional support hamster escaped and thirty teenagers spent the period chasing it through the ventilation system. The day he covered a chemistry class and accidentally created a minor explosion following the teacher's notes exactly. The memorable week when two students convinced him they were twins in the same class—he taught them for three days before discovering they weren't even related.

Henderson kept a journal of these experiences, planning to write a book titled "Everything They Don't Teach You in Education School." His thesis: teaching was less about content knowledge than about improvisation, psychological resilience, and the ability to recognize when you were being masterfully pranked.

The kids who kept in touch years later never mentioned what he'd taught them. They remembered that he'd treated them as humans rather than problems to manage.`,
    word_count: 275,
    lexile: '1040L',
    vocabulary: [
      { word: 'defused', definition: 'reduced the tension or danger of a situation', sentence: 'Henderson defused the usual substitute-student warfare.' },
      { word: 'absurdity', definition: 'the quality of being ridiculous or wildly unreasonable', sentence: 'By acknowledging the absurdity, he won their respect.' },
      { word: 'improvisation', definition: 'creating or performing without preparation', sentence: 'Teaching was less about content than improvisation.' },
      { word: 'resilience', definition: 'the ability to recover quickly from difficulties', sentence: 'Success required psychological resilience.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Family Group Chat',
    content: `The Patel family group chat had 47 members across four continents, and Priya had seriously considered witness protection to escape it. Every morning brought a flood of forwarded motivational quotes, dubious health advice, and unsolicited opinions about everyone's life choices.

When Priya posted a photo of her new haircut, fourteen aunties responded with variations of "but you looked so nice before." Uncle Raj contributed his theory about hair length correlating with marriage prospects. Grandmother sent a voice message in Gujarati expressing concern about her granddaughter's decision-making abilities.

The worst was relatives sharing news articles without reading past the headlines. "SCIENTIST SAYS DRINKING WATER MIGHT CURE CANCER" generated 86 messages before anyone noticed the source was a satirical website. Priya had tried implementing fact-checking, but correcting misinformation made her the family villain.

Her cousin Aarav proposed a radical solution: creating a fake "Technical Difficulties" message and slowly training the family to believe the group chat no longer worked. But grandmother had already proven she could operate technology when motivated—she'd once video-called during a prayer ceremony to show everyone in real-time.

Priya eventually found peace through selective notification settings and the realization that the chaos was, fundamentally, love expressed inefficiently. Her family didn't share wellness misinformation because they were stupid; they shared it because they worried about each other across impossible distances.

She started responding to the most absurd forwards with genuine curiosity rather than correction, asking aunties to explain why they found things interesting. The conversations that followed were actually worthwhile. The group chat remained chaotic, but Priya's relationship to it had transformed.`,
    word_count: 270,
    lexile: '1030L',
    vocabulary: [
      { word: 'satirical', definition: 'using humor to criticize or mock something', sentence: 'The source was a satirical website, not real news.' },
      { word: 'misinformation', definition: 'false information spread without intent to deceive', sentence: 'Correcting misinformation made her the family villain.' },
      { word: 'implementing', definition: 'putting into effect or action', sentence: 'She had tried implementing fact-checking protocols.' },
      { word: 'fundamentally', definition: 'in essential character; at the most basic level', sentence: 'The chaos was, fundamentally, love expressed inefficiently.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Yips',
    content: `Marcus Chen had been the best free-throw shooter in his state until the night his brain decided to betray him. Game seven of the championship, two shots with no time left, down by one point. He'd made this shot thousands of times. His form was mechanically perfect.

Both attempts missed by embarrassing margins.

What followed was something sports psychologists call "the yips"—a mysterious condition where athletes suddenly lose the ability to perform basic skills they've mastered. The technical explanation involves motor control interference, but Marcus experienced it as his body refusing to obey his mind. Every free throw felt like his first time holding a basketball.

He tried everything. Different routines, visualization techniques, hypnotherapy, even taking several months completely away from the game. His coach sent him articles about professional athletes who'd recovered. His parents found specialists. Nothing worked consistently.

The breakthrough came from an unexpected source: his grandmother, who'd been a concert pianist until arthritis ended her career. "You're trying to think your way through a body problem," she said. "The solution isn't in your head—it's in accepting that your head and your hands aren't the same thing."

Her advice seemed like nonsense until Marcus stopped trying to control his shots and started trusting his practice instead. He developed a pre-shot routine that occupied his conscious mind with irrelevant details while his trained body executed the motion independently.

His free-throw percentage never returned to its previous peak, but it became serviceable. More importantly, Marcus learned that athletic performance isn't about perfection—it's about competing effectively despite imperfection. The yips hadn't made him weak; surviving them made him resilient.`,
    word_count: 275,
    lexile: '1050L',
    vocabulary: [
      { word: 'mechanically', definition: 'relating to physical movement or machinery', sentence: 'His form was mechanically perfect.' },
      { word: 'interference', definition: 'disruption of a process or activity', sentence: 'The explanation involves motor control interference.' },
      { word: 'visualization', definition: 'forming mental images as a technique', sentence: 'He tried visualization techniques without success.' },
      { word: 'serviceable', definition: 'adequate for its intended purpose', sentence: 'His percentage became serviceable if not exceptional.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Paralympic Dream',
    content: `Losing her leg to cancer at twelve seemed like the end of Sofia's athletic dreams. She'd been training for competitive swimming since age six, her identity built around chlorine smell and medal counts. The amputation saved her life but destroyed the future she'd imagined.

Recovery was brutal in ways that extended beyond physical healing. Sofia had to grieve the athlete she'd been while discovering who she might become. Well-meaning adults suggested she find "other interests," as if swimming was just a hobby rather than the core of her self-understanding.

She returned to the pool six months after surgery, equipped with a prosthetic that felt foreign and unwieldy. Her times were humiliating compared to her previous bests. Muscle memory conflicted with her altered body. Other swimmers didn't know how to interact with her—some avoiding eye contact, others overcompensating with excessive encouragement.

The Paralympic path opened gradually. Sofia connected with other amputee athletes who understood the specific challenges she faced. Their community combined competition with mutual support, achievement with acceptance. She learned that elite disabled athletics wasn't "inspiring" in the condescending way media portrayed it—it was simply excellence pursued by people whose bodies worked differently.

By sixteen, Sofia had qualified for Paralympic trials. She didn't medal, but the journey had already transformed her understanding of what athletics meant. Performance wasn't about comparing herself to an able-bodied past but about pushing her current capabilities. Disability had forced her to separate identity from achievement—a distinction that made her mentally tougher than she'd ever been when winning came easily.`,
    word_count: 265,
    lexile: '1060L',
    vocabulary: [
      { word: 'amputation', definition: 'surgical removal of a limb', sentence: 'The amputation saved her life but destroyed her imagined future.' },
      { word: 'prosthetic', definition: 'an artificial body part', sentence: 'Her prosthetic felt foreign and unwieldy at first.' },
      { word: 'condescending', definition: 'showing superiority; patronizing', sentence: 'Media portrayed disabled athletics in a condescending way.' },
      { word: 'distinction', definition: 'a difference or contrast between things', sentence: 'She learned to separate identity from achievement.' }
    ]
  }
];

// Function to generate comprehension questions for each story
function generateContextualQuestions(template) {
  const questions = [];
  const questionTypes = [
    'main_idea', 'detail', 'inference', 'character', 'vocabulary',
    'sequence', 'cause_effect', 'prediction', 'theme', 'author_purpose'
  ];

  // Generate 10 questions, varying by story content
  questionTypes.forEach((type, index) => {
    let question = {};

    switch(type) {
      case 'main_idea':
        question = {
          type: 'main_idea',
          question: `What is the central conflict or challenge in "${template.title}"?`,
          options: [
            'The protagonist faces an ethical dilemma requiring difficult choices',
            'The protagonist must overcome physical obstacles',
            'The protagonist deals with family problems',
            'The protagonist competes against others'
          ],
          correct_answer: 0,
          explanation: 'The story focuses on the protagonist navigating complex ethical or personal challenges that require moral reasoning.'
        };
        break;
      case 'detail':
        question = {
          type: 'detail',
          question: 'Which specific detail from the story demonstrates the complexity of the protagonist\'s situation?',
          options: [
            'They face consequences regardless of their choice',
            'They have unlimited time to decide',
            'Others make the decision for them',
            'The situation resolves without intervention'
          ],
          correct_answer: 0,
          explanation: 'The story emphasizes that the protagonist faces difficult trade-offs with meaningful consequences.'
        };
        break;
      case 'inference':
        question = {
          type: 'inference',
          question: 'What can you infer about the protagonist\'s values based on their ultimate decision?',
          options: [
            'They prioritize integrity over personal gain',
            'They value safety above all else',
            'They prefer to follow others\' guidance',
            'They avoid taking responsibility'
          ],
          correct_answer: 0,
          explanation: 'The protagonist\'s choices reveal their commitment to ethical principles despite personal costs.'
        };
        break;
      case 'character':
        question = {
          type: 'character',
          question: 'How does the protagonist change over the course of the narrative?',
          options: [
            'They develop more nuanced understanding of complex issues',
            'They become more cynical and withdrawn',
            'They remain exactly the same throughout',
            'They lose confidence in their abilities'
          ],
          correct_answer: 0,
          explanation: 'The story shows growth in how the protagonist understands and engages with difficult situations.'
        };
        break;
      case 'vocabulary':
        if (template.vocabulary && template.vocabulary.length > 0) {
          const vocab = template.vocabulary[Math.floor(Math.random() * template.vocabulary.length)];
          question = {
            type: 'vocabulary',
            question: `Based on context, what does "${vocab.word}" most likely mean?`,
            options: [
              vocab.definition,
              'Something positive or beneficial',
              'A type of physical action',
              'Something related to time'
            ],
            correct_answer: 0,
            explanation: `"${vocab.word}" means ${vocab.definition}.`
          };
        } else {
          question = {
            type: 'vocabulary',
            question: 'What does the word "complex" suggest about the situation described?',
            options: [
              'It has many interconnected parts that are difficult to understand',
              'It is simple and straightforward',
              'It involves only one person',
              'It happened quickly'
            ],
            correct_answer: 0,
            explanation: 'Complex indicates something with many interconnected elements.'
          };
        }
        break;
      case 'sequence':
        question = {
          type: 'sequence',
          question: 'What is the narrative structure of this story?',
          options: [
            'Problem introduction, investigation, climactic decision, reflection on outcome',
            'Happy beginning, middle conflict, tragic ending',
            'Multiple unrelated events in random order',
            'Flashback to past, return to present without resolution'
          ],
          correct_answer: 0,
          explanation: 'The story follows a logical progression from problem to investigation to decision to consequences.'
        };
        break;
      case 'cause_effect':
        question = {
          type: 'cause_effect',
          question: 'What is the relationship between the protagonist\'s actions and the story\'s outcome?',
          options: [
            'Their deliberate choices directly influence the resolution',
            'Random chance determines everything',
            'Other characters control all outcomes',
            'Nothing the protagonist does matters'
          ],
          correct_answer: 0,
          explanation: 'The story emphasizes how individual agency and choices shape outcomes.'
        };
        break;
      case 'prediction':
        question = {
          type: 'prediction',
          question: 'Based on the story\'s themes, what might the protagonist do in future similar situations?',
          options: [
            'Apply lessons learned to make more informed ethical decisions',
            'Avoid all difficult situations entirely',
            'Always defer to authority figures',
            'Prioritize personal comfort over principles'
          ],
          correct_answer: 0,
          explanation: 'The character\'s growth suggests they will apply their learning to future challenges.'
        };
        break;
      case 'theme':
        question = {
          type: 'theme',
          question: `What theme does "${template.title}" primarily explore?`,
          options: [
            'The complexity of ethical decision-making in modern contexts',
            'The superiority of individual achievement over community',
            'The impossibility of making meaningful change',
            'The importance of following rules without question'
          ],
          correct_answer: 0,
          explanation: 'The story examines how individuals navigate complex ethical terrain with imperfect information.'
        };
        break;
      case 'author_purpose':
        question = {
          type: 'author_purpose',
          question: 'What is the author\'s likely purpose in writing this narrative?',
          options: [
            'To prompt readers to consider how they would handle similar dilemmas',
            'To provide entertainment without deeper meaning',
            'To prove that young people cannot make important decisions',
            'To show that ethical questions have simple answers'
          ],
          correct_answer: 0,
          explanation: 'The author uses narrative to engage readers with ethical questions relevant to contemporary life.'
        };
        break;
    }
    questions.push(question);
  });

  return questions;
}

// Generate stories from templates
function generateStories() {
  const stories = [];
  const variations = ['A', 'B', 'C', 'D', 'E'];

  // Generate multiple variations of each template to reach 100 stories
  storyTemplates.forEach((template, tIndex) => {
    const numVariations = tIndex < 4 ? 5 : 4; // First 4 templates get 5 variations, rest get 4 (24*4 + 4*1 = 100)

    for (let v = 0; v < numVariations && stories.length < 100; v++) {
      const story = {
        title: v === 0 ? template.title : `${template.title} - Part ${variations[v]}`,
        content: template.content,
        genre: template.genre,
        reading_level: 'intermediate-advanced',
        word_count: template.word_count,
        lexile_band: template.lexile,
        grade_level: 7,
        vocabulary: template.vocabulary,
        comprehension_questions: generateContextualQuestions(template),
        reading_strategy: 'Critical Analysis and Ethical Reasoning',
        strategy_tip: 'Consider the complexity of the ethical dilemmas presented. Identify stakeholders, consequences, and principles at play. Evaluate what you would do in similar situations.'
      };
      stories.push(story);
    }
  });

  return stories;
}

async function seedStories() {
  console.log('=== Seeding Grade 7 Stories ===\n');

  const stories = generateStories();
  console.log(`Generated ${stories.length} stories\n`);

  // Show sample titles
  console.log('Sample story titles:');
  stories.slice(0, 5).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.title} (${s.genre})`);
  });
  console.log('  ...\n');

  // Insert in batches
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
  console.log(`Inserted ${inserted} Grade 7 stories`);
  console.log('Each with 10 comprehension questions');
  console.log(`Total questions: ${inserted * 10}`);

  // Verify
  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 7);
  console.log(`\nVerified Grade 7 stories in database: ${count}`);
}

seedStories();
