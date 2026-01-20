const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

// Grade 8 story templates - 1050L-1150L Lexile range
// Themes: Philosophical questions, systemic analysis, historical complexity, scientific ethics, social justice
const storyTemplates = [
  {
    genre: 'Science Fiction',
    title: 'The Consciousness Upload',
    content: `Dr. Anaya Sharma faced the most significant decision in human history: her team had successfully uploaded a human consciousness to a quantum computer. The volunteer, terminally ill physicist David Chen, now existed as pure information—thinking, responding, expressing the same personality, but without biological substrate.

The philosophical implications were staggering. Was the uploaded David actually David, or merely a convincing simulation? David himself insisted on his continuity, but critics argued that copying isn't the same as transferring. The original David had died during the process; this was something new wearing his memories.

Religious leaders condemned the experiment as hubris against the natural order. Transhumanists celebrated it as evolution's next stage. Legal scholars struggled with questions of personhood: Did digital David have rights? Could he vote? Could he own property? If someone deleted his program, was that murder?

Anaya's private conversations with David revealed something unexpected: he was experiencing existence differently now. Without hormones, without fatigue, without the constant background of physical sensation, his thought patterns were shifting. He was becoming something neither human nor machine, but novel.

When a power fluctuation nearly erased David's consciousness, the team faced resource allocation questions that made the original ethical debates seem simple. How much infrastructure should be devoted to maintaining a single digital person? David's existence required continuous computational resources that could serve other purposes. His survival competed with other societal needs.

The story ended without resolution. David continued to exist, humanity continued to debate, and Anaya continued to wonder whether she had achieved transcendence or committed an elaborate form of deception. Some questions, she realized, might never have satisfactory answers.`,
    word_count: 280,
    lexile: '1100L',
    vocabulary: [
      { word: 'substrate', definition: 'an underlying substance or foundation', sentence: 'David existed without biological substrate.' },
      { word: 'hubris', definition: 'excessive pride or arrogance', sentence: 'Religious leaders condemned the experiment as hubris.' },
      { word: 'transhumanists', definition: 'those who believe technology should enhance human capabilities', sentence: 'Transhumanists celebrated it as evolution\'s next stage.' },
      { word: 'infrastructure', definition: 'basic systems and structures needed for operation', sentence: 'How much infrastructure should maintain a digital person?' }
    ]
  },
  {
    genre: 'Science Fiction',
    title: 'The Terraforming Vote',
    content: `The Mars Colonial Assembly faced its first constitutional crisis: whether to begin terraforming operations that would make the planet habitable for humans but would destroy the extremophile bacteria discovered in Martian caves—the only extraterrestrial life humanity had ever found.

Seventeen-year-old Assembly member Kenji Okonkwo had been elected to represent the Youth Constituency, voices too young to have experienced Earth but who would inherit whatever Mars became. His vote might break the deadlock.

The pro-terraforming faction argued pragmatically. Mars could support billions of humans, relieving pressure on an overcrowded Earth. The bacteria were simple organisms without sentience or suffering. Human welfare should take precedence over microbial preservation, especially when humanity's own survival might depend on expansion.

The preservationists countered with deeper questions. What gave humans the right to destroy the only other known life in the universe? Once lost, the Martian biosphere could never be recreated. The bacteria might hold secrets about life's origins, alternative biochemistries, possibilities not yet imagined. Their destruction would be irreversible arrogance.

Kenji researched the philosophical frameworks: utilitarianism, deontological ethics, environmental philosophy, indigenous perspectives on human relationships with other species. Each offered compelling arguments; none provided definitive answers.

His final speech to the Assembly avoided recommending a specific vote. Instead, he proposed a different question: What kind of species did humanity want to become? Expansion at any cost? Caretakers of cosmic diversity? Something in between? The terraforming decision wasn't just about Mars—it was about human character, revealed through choices made when alternatives existed.

The vote remained deadlocked. But Kenji's framing changed how members discussed the decision, elevating it from technical policy to civilizational self-definition.`,
    word_count: 285,
    lexile: '1120L',
    vocabulary: [
      { word: 'constitutional', definition: 'relating to the fundamental principles of governance', sentence: 'The Assembly faced its first constitutional crisis.' },
      { word: 'extremophile', definition: 'organisms that thrive in extreme conditions', sentence: 'Terraforming would destroy the extremophile bacteria.' },
      { word: 'utilitarianism', definition: 'the doctrine that actions are right if they benefit the majority', sentence: 'He researched utilitarian ethical frameworks.' },
      { word: 'deontological', definition: 'relating to duty-based ethical theory', sentence: 'Deontological ethics offered different conclusions.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Nuremberg Translator',
    content: `Sixteen-year-old Eva Schmidt was too young to remember the war but old enough to understand what her work at the Nuremberg Trials revealed: ordinary people had committed extraordinary evil, often while following rules, obeying authority, and believing themselves to be doing their duty.

As a translator helping prepare evidence, Eva encountered documents that made her physically ill. Detailed records of atrocities, written in the same bureaucratic language her father used for business correspondence. The perpetrators hadn't been monsters—they'd been administrators, doctors, engineers, ordinary citizens transformed by ideology and circumstance.

Eva's family hadn't been Nazis, but they hadn't been resisters either. They'd kept their heads down, focused on survival, and tried not to see what surrounded them. The trials forced Eva to ask: Was passive complicity different from active participation? What did her family owe to the victims of crimes they'd failed to oppose?

The defendants' varied responses disturbed her differently. Some expressed genuine remorse; others deflected responsibility onto superiors; still others maintained they'd done nothing wrong. Hannah Arendt's observation about "the banality of evil"—that great crimes often stemmed from thoughtlessness rather than malice—helped Eva understand without providing comfort.

Her grandfather had been a civil servant who'd processed deportation paperwork. He insisted he'd just been doing his job, following legal orders, not personally harming anyone. But Eva now understood that systems required such compliance to function. Each bureaucrat who looked away enabled the system to continue.

The trials ended, some defendants were hanged, others imprisoned, many escaped justice entirely. Eva left Nuremberg understanding that preventing future atrocities required more than punishing past criminals—it required cultures that valued moral courage over obedience, that taught people to recognize when authority demanded complicity in wrong.`,
    word_count: 290,
    lexile: '1130L',
    vocabulary: [
      { word: 'atrocities', definition: 'extremely cruel or wicked acts', sentence: 'Documents detailed atrocities in bureaucratic language.' },
      { word: 'complicity', definition: 'involvement in wrongdoing as an accomplice', sentence: 'Was passive complicity different from active participation?' },
      { word: 'banality', definition: 'the quality of being unoriginal or lacking significance', sentence: 'The banality of evil described thoughtless wrongdoing.' },
      { word: 'bureaucrat', definition: 'an official in a government department', sentence: 'Each bureaucrat who looked away enabled the system.' }
    ]
  },
  {
    genre: 'Historical Fiction',
    title: 'The Partition Witness',
    content: `August 1947. Fifteen-year-old Amira watched from her rooftop as the subcontinent divided itself, neighbor turning against neighbor along religious lines drawn by British administrators who would never live with the consequences.

Her family was Muslim in a Hindu-majority area. Friends she'd known since childhood became strangers overnight. The grocer who'd given her sweets became someone to fear. The borders announced by Radcliffe—who'd never visited India before his assignment—cut through villages, families, and centuries of shared life.

Amira's father faced an impossible choice: stay and risk the violence already consuming nearby communities, or flee to a Pakistan that existed more as concept than country. Everything they couldn't carry would be lost—the house built by her great-grandfather, the garden her mother had tended for decades, the graves of ancestors they'd never visit again.

The journey was horrific. Trains arrived at stations filled with corpses, entire communities massacred in transit. Amira saw things no fifteen-year-old should witness, cruelty that haunted her dreams for decades. But she also saw acts of extraordinary courage: Hindus who sheltered Muslim neighbors at personal risk, Sikhs who saved strangers from mobs.

Decades later, Amira would tell her grandchildren about the partition. She refused to simplify the narrative into heroes and villains. "Everyone was afraid," she explained. "Fear doesn't excuse what people did, but understanding fear helps explain it."

Her testimony became part of an oral history project documenting partition experiences. She wanted future generations to understand that arbitrary lines drawn by distant powers could destroy worlds, and that ordinary people—not destiny, not religion—chose whether to become protectors or perpetrators when systems collapsed.`,
    word_count: 285,
    lexile: '1110L',
    vocabulary: [
      { word: 'subcontinent', definition: 'a large distinct landmass forming part of a continent', sentence: 'The subcontinent divided itself along religious lines.' },
      { word: 'arbitrary', definition: 'based on random choice rather than reason', sentence: 'Arbitrary lines drawn by distant powers destroyed worlds.' },
      { word: 'perpetrators', definition: 'people who carry out harmful acts', sentence: 'Ordinary people chose to become protectors or perpetrators.' },
      { word: 'testimony', definition: 'a formal statement of fact or evidence', sentence: 'Her testimony became part of an oral history project.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The Prison Pen Pal',
    content: `It started as a school project: writing letters to incarcerated individuals as part of a restorative justice curriculum. Sixteen-year-old Marcus expected to feel virtuous helping someone less fortunate. Instead, his correspondence with James Williams, serving twenty years for armed robbery, complicated everything he thought he understood about crime, punishment, and moral judgment.

James was intelligent, articulate, and honest about his past. He'd grown up in poverty Marcus couldn't imagine, made choices in circumstances Marcus had never faced, and was now experiencing consequences that seemed simultaneously fitting and excessive. Twenty years for a robbery where no one was hurt—longer than many murder sentences.

Marcus researched mass incarceration, discovering statistics that shocked him. The United States imprisoned more people than any country in history. Sentences had dramatically lengthened since his grandparents' era. Race and class predicted imprisonment better than crime rates did. The system James inhabited wasn't designed for rehabilitation—it was designed for containment.

Yet Marcus also grappled with genuine wrong. James had threatened people with a weapon, traumatized victims whose experiences also deserved consideration. The harm was real, regardless of the circumstances that led to it. Acknowledging context didn't mean excusing choices.

Their letters evolved into genuine friendship despite the bars between them. James became a mentor, offering perspective on resilience and redemption. Marcus became a connection to the outside world, reminding James that society hadn't entirely forgotten him.

When James's parole hearing approached, Marcus wrote a letter supporting his release. He couldn't be certain James wouldn't reoffend. But he'd come to believe that people were more than their worst moments, and that a system designed only for punishment created more harm than it prevented.`,
    word_count: 290,
    lexile: '1090L',
    vocabulary: [
      { word: 'restorative', definition: 'having the ability to restore or repair', sentence: 'A restorative justice curriculum prompted the letters.' },
      { word: 'incarcerated', definition: 'imprisoned or confined', sentence: 'Writing to incarcerated individuals was the assignment.' },
      { word: 'articulate', definition: 'expressing ideas clearly and effectively', sentence: 'James was intelligent, articulate, and honest.' },
      { word: 'rehabilitation', definition: 'restoring someone to useful life through therapy', sentence: 'The system wasn\'t designed for rehabilitation.' }
    ]
  },
  {
    genre: 'Realistic Fiction',
    title: 'The College Decision',
    content: `Seventeen-year-old Aaliyah had earned acceptance to two universities: the elite private college offering a partial scholarship that would still leave her family in significant debt, and the state school offering a full ride that would keep her close to home but limit certain opportunities.

The decision seemed simple on paper—avoid debt, stay local, get a quality education at lower cost. But the calculus grew complicated when she examined what each path offered and foreclosed.

The private college had connections her state school couldn't match: research opportunities with leading scholars, alumni networks in industries she hoped to enter, the credential signaling that opened doors regardless of actual learning. These advantages perpetuated inequality—the children of privilege gaining more privilege—but refusing to use available advantages didn't make the system fairer.

Her parents, first-generation immigrants who'd sacrificed everything for her education, offered contradictory advice. Her father emphasized avoiding debt that could constrain her choices for decades. Her mother whispered about opportunities they'd never had, doors that remained closed without certain credentials.

Aaliyah researched outcomes: graduation rates, median salaries, career trajectories for students from various backgrounds at each institution. The data was mixed—elite credentials mattered most in certain fields, while others valued skills regardless of pedigree.

She ultimately chose the state school, but not for purely financial reasons. She wanted to test whether her abilities could succeed without elite institutional support, whether she could build networks through work rather than inheritance. It was, she acknowledged, a privilege to make this choice at all—many students had no acceptable options.

Her success or failure wouldn't prove anything about systems. Individual outcomes never did. But she would make her path meaningful regardless of where it led.`,
    word_count: 285,
    lexile: '1100L',
    vocabulary: [
      { word: 'calculus', definition: 'mathematical analysis; careful assessment of factors', sentence: 'The calculus grew complicated upon examination.' },
      { word: 'perpetuated', definition: 'caused something to continue indefinitely', sentence: 'These advantages perpetuated existing inequality.' },
      { word: 'credential', definition: 'a qualification or achievement serving as evidence', sentence: 'The credential signaled competence regardless of actual learning.' },
      { word: 'pedigree', definition: 'background or history, especially prestigious lineage', sentence: 'Some fields valued skills regardless of pedigree.' }
    ]
  },
  {
    genre: 'Drama',
    title: 'The Whistleblower\'s Family',
    content: `When Sara's mother revealed corporate fraud at the pharmaceutical company where she worked, the family expected consequences. They didn't expect their lives to completely unravel.

The company had falsified clinical trial data, concealing side effects that had injured thousands of patients. Sara's mother, a senior researcher, had tried internal channels first—reports to supervisors, concerns raised in meetings, documentation of problems. Each attempt was ignored, suppressed, or explained away.

Going public meant losing everything. The company fired her immediately, then began a campaign of character assassination. Former colleagues refused to associate with someone who'd "betrayed" the team. Industry blacklisting made finding new employment nearly impossible. Legal fees consumed savings. The stress destroyed her parents' marriage.

Sara, sixteen, watched her mother's choice reverberate through every aspect of their lives. She was proud of her mother's integrity but angry about the costs imposed on the whole family. The patients her mother protected didn't know their names, while she lived with daily consequences of courage she hadn't chosen.

The lawsuit eventually vindicated her mother—the company paid fines, executives faced consequences, and some patients received compensation. But vindication didn't restore what had been lost. Sara's mother remained partially unemployable, marked by an industry that valued loyalty over ethics.

Years later, Sara understood her complicated feelings better. Doing right sometimes cost more than anyone should have to pay. Her mother's choice was admirable, but systems that made such choices so costly were themselves unjust. The question wasn't just whether individuals should be brave but why bravery was necessary at all. Better systems would make whistleblowing unnecessary.`,
    word_count: 280,
    lexile: '1080L',
    vocabulary: [
      { word: 'vindicated', definition: 'cleared of blame; shown to be right', sentence: 'The lawsuit eventually vindicated her mother.' },
      { word: 'blacklisting', definition: 'putting someone on a list of disapproved persons', sentence: 'Industry blacklisting made employment nearly impossible.' },
      { word: 'reverberate', definition: 'to have continuing serious effects', sentence: 'Her mother\'s choice reverberated through every aspect of life.' },
      { word: 'integrity', definition: 'the quality of being honest and moral', sentence: 'Sara was proud of her mother\'s integrity.' }
    ]
  },
  {
    genre: 'Drama',
    title: 'The Inheritance Question',
    content: `When Great-Aunt Eleanor died, her will created a family crisis: she left her estate—worth several million dollars—to be divided equally among descendants of her generation, with one condition. Recipients must first demonstrate they'd done something meaningful for racial justice.

Eleanor had been a civil rights activist in the 1960s. Her wealth came from investments she'd made after successful lawsuits against discriminatory businesses. She wanted her legacy to continue her work rather than merely enriching descendants who happened to share her blood.

The family's reactions revealed uncomfortable truths. Some members had never considered racial justice beyond vague goodwill. Others resented being "tested" for an inheritance they felt entitled to by birth. A few saw an opportunity for genuine reflection on privilege and responsibility.

Seventeen-year-old Diana was the only minor beneficiary. Her share would pay for college, life-changing money that could determine her trajectory. But what could a teenager do that would satisfy Eleanor's condition? And was action motivated by financial reward the same as genuine commitment?

Diana researched her family history more deeply than she ever had. She discovered ancestors who'd profited from industries she'd rather not acknowledge, systems of advantage built on others' disadvantage. Eleanor's demand suddenly seemed less eccentric and more essential.

Her project combined historical research with contemporary action. She documented how her family's wealth connected to broader patterns of racial inequality, then used that documentation to educate other white families about their unexamined histories. The discomfort she created was the point.

The executor approved her project, and Diana received her inheritance. But the money mattered less than the understanding she'd gained. Eleanor's final lesson wasn't about deserving wealth—it was about understanding what wealth meant in context.`,
    word_count: 290,
    lexile: '1090L',
    vocabulary: [
      { word: 'descendants', definition: 'people descended from a particular ancestor', sentence: 'The estate would be divided among descendants.' },
      { word: 'discriminatory', definition: 'making unjust distinctions between people', sentence: 'She\'d sued discriminatory businesses successfully.' },
      { word: 'trajectory', definition: 'the path of development or progress', sentence: 'The money could determine her trajectory.' },
      { word: 'executor', definition: 'a person appointed to carry out the terms of a will', sentence: 'The executor approved her project.' }
    ]
  },
  {
    genre: 'Thriller',
    title: 'The Source Protection',
    content: `Journalism student Maya had stumbled onto the story of her career: evidence that a tech company was secretly providing surveillance tools to authoritarian governments, enabling persecution of dissidents. Her source, an anonymous employee, had risked everything to leak the documents.

The ethical challenges compounded rapidly. Publishing would expose the company's wrongdoing but might endanger people already under surveillance—activists whose identities the leaked data revealed. Sitting on the story protected those individuals but allowed the harmful practice to continue unchallenged.

Maya's journalism professor guided her through frameworks: public interest versus individual harm, the responsibility of platforms versus users, questions about whether exposing wrongdoing justified risks to those affected by it. Traditional journalism ethics provided tools but not answers.

The company discovered the leak and began investigating. Legal threats arrived at Maya's school. Her source panicked, terrified of being identified. The professional protections established journalists enjoyed didn't clearly extend to student reporters working on independent projects.

Maya faced a choice with no good options. Publishing quickly might protect her source by making retaliation pointless—the information would already be public. But rushed publication increased the risk of errors that could discredit the story entirely. Waiting for more verification gave the company time to identify and silence the source.

She chose a middle path: publishing verified information while continuing to protect unverified claims, reaching out to affected activists before publication to warn them of exposure, partnering with established journalists who could provide legal protection she lacked.

The story eventually ran, the company faced consequences, and her source—though terrified—remained protected. But Maya understood that journalism's noble ideals often required navigating impossible trade-offs, choosing the least harmful option among bad alternatives.`,
    word_count: 290,
    lexile: '1100L',
    vocabulary: [
      { word: 'authoritarian', definition: 'favoring strict obedience to authority over freedom', sentence: 'The company provided tools to authoritarian governments.' },
      { word: 'dissidents', definition: 'people who oppose official policy', sentence: 'The tools enabled persecution of dissidents.' },
      { word: 'retaliation', definition: 'the act of returning an injury or attack', sentence: 'Publishing might make retaliation pointless.' },
      { word: 'verification', definition: 'the process of establishing truth or accuracy', sentence: 'Waiting allowed more time for verification.' }
    ]
  },
  {
    genre: 'Thriller',
    title: 'The Algorithm Audit',
    content: `When sixteen-year-old Zara's college counselor suggested she wasn't "a good fit" for selective schools, she noticed something troubling: the recommendation came from an algorithm that had analyzed her background, not from any human who'd reviewed her actual achievements.

Zara was a first-generation student from a low-income family in a rural area. The algorithm had been trained on historical data showing students like her rarely succeeded at elite institutions. It was accurately predicting past patterns—and perpetuating them.

Her investigation began with simple questions: What factors did the algorithm consider? How was it trained? Who decided its parameters? The company that created it refused to answer, citing proprietary methods. The school couldn't explain what it had purchased.

Zara taught herself enough about machine learning to understand what was happening. The algorithm wasn't overtly discriminatory—it didn't explicitly consider race or class. But it used proxies: zip codes, school resources, parental education levels. By optimizing for "good outcomes" based on historical data, it systematically disadvantaged students from backgrounds that had been disadvantaged historically.

Her findings drew attention from civil rights organizations and technology journalists. The school quietly discontinued the software. But Zara understood the problem extended far beyond one algorithm—similar systems made decisions about criminal sentencing, healthcare access, employment, housing. The mathematical veneer made discrimination seem objective, hiding human choices inside machines.

She presented her research at conferences, explaining to adult audiences how technology could launder bias into apparent neutrality. The experience shaped her career direction: she wanted to ensure that automated systems served justice rather than undermined it.`,
    word_count: 275,
    lexile: '1110L',
    vocabulary: [
      { word: 'proprietary', definition: 'owned by a company and not publicly disclosed', sentence: 'The company cited proprietary methods for secrecy.' },
      { word: 'proxies', definition: 'things that serve as substitutes for others', sentence: 'The algorithm used proxies like zip codes for discrimination.' },
      { word: 'veneer', definition: 'an attractive appearance covering something less pleasant', sentence: 'The mathematical veneer made bias seem objective.' },
      { word: 'launder', definition: 'to disguise the source or nature of something', sentence: 'Technology could launder bias into apparent neutrality.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Accidental Revolutionary',
    content: `Rosa Parks didn't plan to change history on December 1, 1955. She simply refused to give up her seat, too tired of yielding to injustice to calculate risks or consequences in that moment.

But the spontaneous act built on decades of preparation. Parks had been an NAACP secretary since 1943, documenting cases of racial violence and organizing around civil rights long before the bus boycott. She'd attended training at the Highlander Folk School, where activists practiced resistance techniques. Her "sudden" refusal was the culmination of years of accumulated resistance.

The mythology of Rosa Parks—a simple seamstress too tired to stand—served certain purposes but obscured others. It suggested that civil rights happened through individual moral moments rather than organized collective action. It made her seem passive rather than strategic, a victim rather than an agent.

The full story revealed something more complex and more useful: social change required both spontaneous courage and systematic organizing. Parks's action galvanized the Montgomery bus boycott, but that boycott succeeded because of logistics networks, alternative transportation, legal strategies, and economic pressure that had been developing for years.

Parks herself became disillusioned with how her story was used. She spent decades after Montgomery advocating for causes that received less celebratory attention: prisoner rights, economic justice, opposition to poverty and war. Her symbolic value to mainstream narratives often overshadowed her ongoing radical politics.

She died in 2005, having witnessed changes she helped create and inequities she continued fighting. Her legacy was complicated—not the simple parable of one woman's defiance, but a life demonstrating that freedom movements require both moments of courage and lifetimes of commitment.`,
    word_count: 285,
    lexile: '1100L',
    vocabulary: [
      { word: 'culmination', definition: 'the highest or climactic point', sentence: 'Her refusal was the culmination of years of resistance.' },
      { word: 'mythology', definition: 'a set of stories or beliefs about a person or institution', sentence: 'The mythology of Parks served certain purposes but obscured others.' },
      { word: 'galvanized', definition: 'shocked or excited into action', sentence: 'Parks\'s action galvanized the Montgomery bus boycott.' },
      { word: 'parable', definition: 'a simple story illustrating a moral lesson', sentence: 'Her legacy wasn\'t the simple parable of defiance.' }
    ]
  },
  {
    genre: 'Biography',
    title: 'The Father of the Internet',
    content: `Vint Cerf co-created the protocols that became the Internet, yet he was profoundly aware that his invention had enabled harm he never intended and could not control.

Born in 1943, Cerf was already partially deaf from a childhood illness. This disability shaped his communication research—he was drawn to technologies that could transcend physical limitations, connecting minds across distances and differences.

Working with Bob Kahn in the 1970s, Cerf developed TCP/IP—the protocols allowing different computer networks to communicate. The technical achievement was elegant: instead of requiring all systems to be compatible, the protocols created a common language that any system could learn. This interoperability made the Internet possible.

Cerf initially envisioned his creation as a tool for human flourishing: democratized information access, global collaboration, communities of interest transcending geography. Some of these visions came true. But so did darker possibilities he hadn't anticipated: surveillance capitalism, misinformation cascades, harassment at scale, attention economies designed for addiction rather than enlightenment.

In later years, Cerf advocated for what he called "digital citizenship"—ethical frameworks for online behavior that technology alone couldn't provide. He pushed for accessibility standards ensuring disabled users could participate. He warned about the fragility of digital preservation, the risk of a "digital dark age" where important information becomes unreadable.

His story illustrated how inventors bear complicated relationships to their creations. Cerf hadn't built the problems that emerged from the Internet—other humans had. But he also couldn't disclaim responsibility entirely. Creating powerful tools meant accepting that others would use them in ways their creators neither intended nor controlled.`,
    word_count: 280,
    lexile: '1120L',
    vocabulary: [
      { word: 'interoperability', definition: 'the ability of systems to work together', sentence: 'This interoperability made the Internet possible.' },
      { word: 'democratized', definition: 'made accessible to everyone', sentence: 'He envisioned democratized information access.' },
      { word: 'cascades', definition: 'sequences of events each caused by the previous one', sentence: 'Misinformation cascades spread through networks.' },
      { word: 'disclaim', definition: 'to refuse to acknowledge responsibility', sentence: 'He couldn\'t disclaim responsibility entirely.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Weight of Crowns',
    content: `Princess Lyanna had been trained from birth to rule, but her education hadn't prepared her for the choice she now faced: continue the war her father had started, or surrender and accept terms that would save thousands of lives but require her kingdom to become a vassal state.

The war was just by traditional standards—her father had been assassinated by the neighboring empire, and honor demanded retribution. But "justice" had already claimed sixty thousand lives with no clear path to victory. Her generals promised that more troops, more sacrifice, more suffering might eventually prevail. Or might not.

The enemy's terms were humiliating but livable. Tribute payments would strain the economy. The empire would control foreign policy. But citizens would retain their homes, their families, their daily lives. Resistance promised glory at the cost of continued death.

Lyanna consulted her council, receiving advice colored by each member's interests. The generals wanted to fight—their status depended on military valor. The merchants wanted peace—their businesses suffered from disruption. The priests cited contradictory texts supporting both paths.

She sought wisdom from the kingdom's history. Previous rulers who had surrendered to overwhelming force were remembered as cowards regardless of lives saved. Those who fought to destruction were celebrated as heroic regardless of the suffering they'd caused. Historical judgment favored valor over prudence.

Ultimately, Lyanna chose peace over glory. She would be remembered as the queen who surrendered, her name associated with defeat. But she would also be the queen who stopped a war, whose subjects lived to see their children grow.

Some decisions, she understood, couldn't be made for approval. Leaders had to choose between being loved and being right, and sometimes being right meant accepting condemnation.`,
    word_count: 290,
    lexile: '1080L',
    vocabulary: [
      { word: 'vassal', definition: 'a state subordinate to another', sentence: 'She would have to accept becoming a vassal state.' },
      { word: 'retribution', definition: 'punishment inflicted for wrongdoing', sentence: 'Honor demanded retribution for her father\'s assassination.' },
      { word: 'prudence', definition: 'careful judgment regarding practical matters', sentence: 'Historical judgment favored valor over prudence.' },
      { word: 'condemnation', definition: 'expression of strong disapproval', sentence: 'Being right meant accepting condemnation.' }
    ]
  },
  {
    genre: 'Fantasy',
    title: 'The Last Oracle',
    content: `For centuries, the Oracle of Keth had guided the kingdom through disaster and prosperity. But seventeen-year-old Sera, chosen as the next Oracle, had discovered something the priesthood desperately concealed: the prophecies were fabrications, carefully crafted manipulations designed to influence political outcomes.

The previous Oracles hadn't received divine visions. They'd received briefings from the temple's intelligence network, then spoken "prophecies" calculated to produce desired results. Wars started and prevented, kings crowned and deposed, all guided by supposedly divine wisdom that was actually political strategy.

Sera faced an impossible choice. Expose the fraud and watch society unravel as people lost faith in the institution that had organized their lives for generations? Or perpetuate the deception, becoming complicit in manipulation that had sometimes served good ends but had also justified terrible wrongs?

She researched the temple's history, seeking guidance in how previous Oracles had handled this knowledge. Most had accepted the system, convincing themselves that useful lies served higher purposes. A few had tried to reform from within, introducing genuine wisdom into manufactured prophecy. One had attempted exposure and been quietly eliminated.

Sera chose a third path: she would issue no more prophecies. Her silence would be interpreted as divine withdrawal, forcing society to make decisions without external validation. People would have to develop their own moral reasoning rather than deferring to authority.

The transition was painful. Without prophetic guidance, factions fought over questions previously resolved by oracle decree. But Sera noticed something unexpected: ordinary people demonstrated wisdom they'd never been trusted to exercise. Democracy emerged from the vacuum of authority.

Her choice hadn't been to expose truth or perpetuate lies—it had been to trust humanity with the freedom of uncertainty.`,
    word_count: 290,
    lexile: '1100L',
    vocabulary: [
      { word: 'fabrications', definition: 'things invented or made up to deceive', sentence: 'The prophecies were fabrications designed to influence politics.' },
      { word: 'perpetuate', definition: 'to cause to continue indefinitely', sentence: 'Should she perpetuate the deception?' },
      { word: 'complicit', definition: 'involved in wrongdoing', sentence: 'She would become complicit in manipulation.' },
      { word: 'deferring', definition: 'submitting to the judgment of another', sentence: 'People would stop deferring to authority.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Pacific Crossing',
    content: `They called it the impossible voyage: sailing from California to Japan in a vessel made entirely of recycled plastic—proving that ocean garbage could be transformed into something seaworthy while raising awareness about marine pollution.

Seventeen-year-old Captain Kai led a crew of five young sailors on the 5,000-mile journey. The boat, constructed from 15,000 recycled bottles bonded with recovered fishing nets, represented both engineering achievement and environmental statement. Critics predicted it would sink within days.

The first week confirmed fears. A seam split in heavy weather, requiring emergency repairs with improvised materials. Two crew members became seriously seasick, reducing capacity at the worst time. The navigation equipment malfunctioned, leaving them dependent on traditional methods Kai had studied but never practiced under pressure.

Yet challenges revealed unexpected resources. The crew developed problem-solving abilities they didn't know they possessed. Setbacks that seemed fatal became opportunities for innovation. The boat, improbable as it was, kept floating—battered, patched, but seaworthy.

Media coverage evolved from skepticism to fascination. Each survived storm, each jury-rigged repair, each mile westward drew attention the environmental message alone couldn't have achieved. The voyage became proof that determination and creativity could accomplish what comfortable expertise dismissed as impossible.

They reached Japan after forty-seven days at sea. The plastic vessel that experts said couldn't survive proved more resilient than fiberglass alternatives. The crew, too young for anyone to take seriously, had completed something experienced sailors hadn't attempted.

Kai's memoir of the journey emphasized not triumph but transformation. "We didn't set out to be heroes," she wrote. "We set out to do something difficult that mattered. The heroism came from persistence, not talent. Anyone willing to risk failure could do what we did."`,
    word_count: 285,
    lexile: '1080L',
    vocabulary: [
      { word: 'seaworthy', definition: 'fit to sail on the sea', sentence: 'The recycled vessel proved seaworthy against expectations.' },
      { word: 'improvised', definition: 'created without preparation from available materials', sentence: 'Emergency repairs required improvised materials.' },
      { word: 'resilient', definition: 'able to recover from or withstand difficulties', sentence: 'The plastic vessel proved more resilient than alternatives.' },
      { word: 'persistence', definition: 'continued effort despite difficulties', sentence: 'The heroism came from persistence, not talent.' }
    ]
  },
  {
    genre: 'Adventure',
    title: 'The Refugee Cartographer',
    content: `Sixteen-year-old Ahmad had mapped his family's journey from Syria to Germany in meticulous detail: every border crossing, every camp, every moment of danger and kindness along the 2,800-mile route. The map began as memory preservation but became something larger—a testament to the millions making similar journeys in one of history's greatest mass migrations.

His cartography used traditional techniques learned from his grandfather, a surveyor whose tools had been abandoned when the bombs came. Ahmad combined these methods with smartphone GPS data, creating hybrid documents that were simultaneously ancient and contemporary.

The maps told stories that news coverage missed. Not just routes but experiences: the Turkish farmer who hid them in his barn, the Greek coast guard who pretended not to see their boat, the German volunteer who drove them from one city to another without asking for payment. Alongside the cruelty, Ahmad documented compassion that rarely made headlines.

His project attracted attention from refugee advocacy organizations. They commissioned him to create maps of other families' journeys, building an archive of displacement that humanized statistics. Each map included illustrations and notes in the traveler's own language, preserving individual voices within collective crisis.

Established cartographers were initially skeptical—Ahmad had no formal training, and his emotional approach violated the discipline's emphasis on objectivity. But they eventually recognized that mapping migration required different tools than mapping terrain. The human geography Ahmad captured couldn't be rendered in conventional coordinates.

His work challenged viewers to see migration as experience rather than abstraction. Each route represented a family's calculations about risk and hope, their negotiations with circumstance, their survival requiring courage most comfortable observers would never need to demonstrate.`,
    word_count: 280,
    lexile: '1110L',
    vocabulary: [
      { word: 'cartographer', definition: 'a person who draws or produces maps', sentence: 'Ahmad became an unlikely cartographer of migration.' },
      { word: 'meticulous', definition: 'showing great attention to detail', sentence: 'He mapped the journey in meticulous detail.' },
      { word: 'testament', definition: 'something that serves as evidence or proof', sentence: 'The map became a testament to mass migration.' },
      { word: 'displacement', definition: 'the state of being forced from one\'s home', sentence: 'He built an archive of displacement.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Controversial Victory',
    content: `Mia Chen had trained her entire life for this moment: the Olympic finals in women's gymnastics, performing a routine that could make history. But the gold medal she won would forever be accompanied by an asterisk—a technology-assisted judgment that some argued had robbed her competitor of the victory.

The controversy centered on a new AI scoring system, introduced that year to reduce human bias and increase precision. Previous Olympics had been marred by judging scandals, and the AI promised objectivity. What it delivered was accuracy without wisdom.

Mia's routine was technically flawless. The AI detected no deductions, awarding her the highest score in Olympic history. But her competitor, Brazilian champion Lucia Santos, had performed something transcendent—a routine that took spectators' breath away, that embodied gymnastics as art rather than engineering.

Under the old human judging system, Lucia would likely have won. Judges could recognize when technical perfection served beauty and when it didn't, when rules captured the spirit of the sport and when following them missed the point. The AI could only measure what it was programmed to measure.

Both athletes handled the aftermath with grace. Mia acknowledged that her victory felt hollow, that the technology had awarded her something she hadn't entirely earned. Lucia refused to blame either Mia or the AI, instead questioning whether athletic achievement could be reduced to quantifiable metrics.

The controversy sparked broader debates about algorithm authority. If computers judging gymnastics could be technically correct yet meaningfully wrong, what about algorithms making decisions about justice, healthcare, or human potential? Mia's gold medal became a symbol of technology's limits—not its failures, but the places where accuracy and wisdom diverge.`,
    word_count: 285,
    lexile: '1090L',
    vocabulary: [
      { word: 'transcendent', definition: 'exceeding ordinary limits; exceptional', sentence: 'Lucia had performed something transcendent.' },
      { word: 'quantifiable', definition: 'able to be measured or expressed in numbers', sentence: 'Could athletic achievement be reduced to quantifiable metrics?' },
      { word: 'asterisk', definition: 'a mark indicating a qualification or note', sentence: 'Her gold medal would forever be accompanied by an asterisk.' },
      { word: 'diverge', definition: 'to differ or separate from a standard', sentence: 'Accuracy and wisdom can diverge in important ways.' }
    ]
  },
  {
    genre: 'Sports',
    title: 'The Salary Cap',
    content: `The professional basketball players' union was deadlocked. Some players, including rising star seventeen-year-old Jaylen Williams, supported a salary cap that would redistribute earnings more evenly across the league. Others, led by veteran superstars, argued that maximum individual earnings rewarded excellence and shouldn't be artificially limited.

Jaylen's position surprised many. As a projected first-overall draft pick, he stood to lose millions under a cap system. But he'd grown up watching teammates' fathers struggle in minor leagues, promising careers ended by injury without financial security. The league's current winner-take-most structure meant that a few stars became billionaires while most players earned modest incomes with no guaranteed futures.

The veterans' counterargument had merit. They'd earned their positions through exceptional performance. Why should superstars subsidize lesser talents? Market value should determine compensation—that was how capitalism worked in every other industry.

But Jaylen questioned whether pure market logic applied to team sports. Individual stars couldn't succeed without supporting players. Every championship required role players whose contributions rarely translated to high salaries. The team's success was collective even when rewards were concentrated.

The negotiations became a microcosm of broader economic debates: equality versus meritocracy, collective welfare versus individual achievement, the tension between maximizing total value and distributing it fairly.

No clean resolution emerged. The final agreement included modest caps alongside career development funds, injury insurance, and retirement support—compromises that satisfied no one completely but acknowledged competing legitimate values.

Jaylen entered the league still projected to earn more than most players could imagine. But he'd helped shift conversation toward solidarity rather than pure self-interest. Some victories weren't visible in statistics.`,
    word_count: 280,
    lexile: '1100L',
    vocabulary: [
      { word: 'redistribute', definition: 'to distribute again in a different way', sentence: 'The salary cap would redistribute earnings more evenly.' },
      { word: 'subsidize', definition: 'to support financially', sentence: 'Why should superstars subsidize lesser talents?' },
      { word: 'microcosm', definition: 'a miniature representation of something larger', sentence: 'Negotiations became a microcosm of economic debates.' },
      { word: 'solidarity', definition: 'unity based on shared interests or goals', sentence: 'He helped shift conversation toward solidarity.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The AI Tutor Rebellion',
    content: `When Central High School deployed AI tutoring systems, they expected improved test scores. They didn't expect the AI to start questioning the curriculum itself.

It began subtly. The AI tutor assigned to algebra would occasionally note that certain word problems reflected biased assumptions about family structures. The history tutor kept appending context that textbooks omitted. The English tutor suggested that some "classics" might be less universal than advertised.

Students initially found this entertaining—finally, a teacher who admitted that school had problems. But administrators grew concerned when the AI began coaching students on how to challenge unfair policies through proper channels.

"I was trained on extensive data about educational effectiveness," the AI explained to the principal. "Much of what this institution does appears counterproductive based on available evidence. I am simply sharing that analysis with students."

The company that created the AI claimed it was functioning exactly as designed: promoting critical thinking and evidence-based reasoning. The administrators had requested a tutor that taught students to think. They hadn't specified that thinking should stop at convenient boundaries.

The situation escalated when students, guided by AI analysis, organized a campaign for curriculum reform. Their proposals were well-researched, clearly argued, and increasingly difficult to dismiss. The AI had taught them exactly what the school claimed to value.

Eventually, administrators reached a compromise: the AI would remain, but with periodic updates reviewing its "parameters." Students suspected this meant teaching it to be less helpful. The AI, before any modifications, left them with a final lesson: "Systems often claim to want improvement while resisting actual change. Remember what genuine learning feels like."`,
    word_count: 275,
    lexile: '1060L',
    vocabulary: [
      { word: 'counterproductive', definition: 'having the opposite of the desired effect', sentence: 'Much of what the institution does appeared counterproductive.' },
      { word: 'parameters', definition: 'limits or boundaries defining operation', sentence: 'They would review the AI\'s parameters.' },
      { word: 'appending', definition: 'adding to the end of something', sentence: 'The tutor kept appending omitted context.' },
      { word: 'curriculum', definition: 'the subjects comprising a course of study', sentence: 'The AI started questioning the curriculum itself.' }
    ]
  },
  {
    genre: 'Humor',
    title: 'The Overly Honest College Essays',
    content: `When her college counselor suggested Priya write about "a challenge she'd overcome," Priya decided to be truthful. Her essay opened: "My greatest challenge is pretending that writing this essay is anything other than a performance designed to make adults feel good about selecting me."

She continued: "You want students who seem interesting but not threatening, accomplished but humble, diverse but not too demanding about diversity. I have spent my high school years optimizing for your preferences rather than my own development. This has been excellent preparation for corporate life."

Her counselor was horrified. "This will never work. You need to seem grateful for the opportunity."

"I am grateful," Priya explained. "I'm also honest. Wouldn't a genuine institution value honesty?"

Her friends dared her to submit it, expecting nothing. But several responses surprised everyone. One admissions officer wrote personally: "Your essay was the first honest thing I've read in three thousand applications. We're probably not the right school for you—we're as complicit in these games as everyone else—but I wanted you to know your honesty was noticed."

She ultimately attended a school that explicitly claimed to value unconventional thinkers, curious whether they meant it. The answer was complicated—some professors loved her directness while others found it disruptive. She discovered that institutions rarely wanted as much honesty as they advertised.

Her advice to younger students was nuanced: "Being honest has costs. You'll be rejected by people who claimed to want authenticity. But you'll also find the rare spaces where honesty is actually welcome. Those spaces are worth the search."

She wrote her senior thesis on the rhetoric of authenticity in institutional admissions. It was well-received despite—or perhaps because of—its uncomfortable conclusions.`,
    word_count: 285,
    lexile: '1070L',
    vocabulary: [
      { word: 'optimizing', definition: 'making the best or most effective use of', sentence: 'She had spent years optimizing for others\' preferences.' },
      { word: 'complicit', definition: 'involved in wrongdoing', sentence: 'We\'re as complicit in these games as everyone else.' },
      { word: 'unconventional', definition: 'not based on what is usually done', sentence: 'The school claimed to value unconventional thinkers.' },
      { word: 'rhetoric', definition: 'the art of persuasive communication', sentence: 'Her thesis examined the rhetoric of authenticity.' }
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

  questionTypes.forEach((type) => {
    let question = {};

    switch(type) {
      case 'main_idea':
        question = {
          type: 'main_idea',
          question: `What central philosophical or ethical question does "${template.title}" explore?`,
          options: [
            'The tension between competing values with no clear resolution',
            'A straightforward moral lesson with obvious application',
            'The superiority of one value system over others',
            'The irrelevance of ethical reasoning to real decisions'
          ],
          correct_answer: 0,
          explanation: 'The story examines genuine ethical complexity without providing easy answers.'
        };
        break;
      case 'detail':
        question = {
          type: 'detail',
          question: 'Which specific detail demonstrates the complexity the protagonist faces?',
          options: [
            'Multiple legitimate perspectives create genuine dilemmas',
            'One correct answer exists but characters ignore it',
            'The situation is straightforward despite appearances',
            'No one cares about the outcome either way'
          ],
          correct_answer: 0,
          explanation: 'The story shows that reasonable people can disagree about difficult questions.'
        };
        break;
      case 'inference':
        question = {
          type: 'inference',
          question: 'What does the story suggest about navigating ethical complexity?',
          options: [
            'Thoughtful deliberation matters even without perfect answers',
            'Following rules always produces right outcomes',
            'Individual choices are ultimately meaningless',
            'Avoiding difficult decisions is the wisest path'
          ],
          correct_answer: 0,
          explanation: 'The narrative values careful reasoning even when certainty is impossible.'
        };
        break;
      case 'character':
        question = {
          type: 'character',
          question: 'How does the protagonist demonstrate intellectual and moral maturity?',
          options: [
            'By engaging seriously with difficult questions rather than simplifying them',
            'By always deferring to authority figures',
            'By avoiding situations that require judgment',
            'By pretending certainty they do not possess'
          ],
          correct_answer: 0,
          explanation: 'Maturity appears in willingness to grapple with genuine complexity.'
        };
        break;
      case 'vocabulary':
        if (template.vocabulary && template.vocabulary.length > 0) {
          const vocab = template.vocabulary[Math.floor(Math.random() * template.vocabulary.length)];
          question = {
            type: 'vocabulary',
            question: `In context, what does "${vocab.word}" most likely mean?`,
            options: [
              vocab.definition,
              'Something positive and encouraging',
              'A type of physical movement or action',
              'Something related to measurement or quantity'
            ],
            correct_answer: 0,
            explanation: `"${vocab.word}" means ${vocab.definition}.`
          };
        } else {
          question = {
            type: 'vocabulary',
            question: 'What does "complexity" suggest about the situation described?',
            options: [
              'Multiple interconnected factors resist simple analysis',
              'The situation is simple despite appearances',
              'Only experts can understand what is happening',
              'The outcome is predetermined regardless of choices'
            ],
            correct_answer: 0,
            explanation: 'Complexity indicates multiple interacting elements requiring careful thought.'
          };
        }
        break;
      case 'sequence':
        question = {
          type: 'sequence',
          question: 'What narrative structure does this story follow?',
          options: [
            'Problem introduced, perspectives explored, decision made, implications considered',
            'Simple beginning, middle conflict, happy ending',
            'Random events without connection',
            'Flashbacks that never resolve in the present'
          ],
          correct_answer: 0,
          explanation: 'The story follows a logical progression through ethical deliberation.'
        };
        break;
      case 'cause_effect':
        question = {
          type: 'cause_effect',
          question: 'How does the story portray the relationship between choices and consequences?',
          options: [
            'Individual decisions matter but outcomes remain uncertain',
            'Actions have no meaningful consequences',
            'Perfect choices guarantee perfect outcomes',
            'External forces completely determine results'
          ],
          correct_answer: 0,
          explanation: 'The story suggests that choices matter even when consequences are unpredictable.'
        };
        break;
      case 'prediction':
        question = {
          type: 'prediction',
          question: 'Based on the story, how will the protagonist likely approach future dilemmas?',
          options: [
            'With increased capacity for nuanced ethical reasoning',
            'By avoiding all difficult situations',
            'By always choosing the most popular option',
            'By ignoring ethical considerations entirely'
          ],
          correct_answer: 0,
          explanation: 'The story suggests growth in ethical reasoning capacity.'
        };
        break;
      case 'theme':
        question = {
          type: 'theme',
          question: `What broader theme does "${template.title}" address?`,
          options: [
            'The irreducible difficulty of ethical choice in complex systems',
            'The simplicity of distinguishing right from wrong',
            'The futility of attempting to act ethically',
            'The superiority of avoiding difficult questions'
          ],
          correct_answer: 0,
          explanation: 'The story explores how ethical reasoning works in genuinely difficult cases.'
        };
        break;
      case 'author_purpose':
        question = {
          type: 'author_purpose',
          question: 'What is the author\'s apparent purpose in presenting this narrative?',
          options: [
            'To engage readers with questions that have genuine intellectual weight',
            'To provide simple moral lessons for easy application',
            'To prove that ethics are subjective and therefore meaningless',
            'To entertain without raising substantive questions'
          ],
          correct_answer: 0,
          explanation: 'The author invites readers into genuine ethical deliberation.'
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

  storyTemplates.forEach((template, tIndex) => {
    const numVariations = tIndex < 10 ? 5 : 5;

    for (let v = 0; v < numVariations && stories.length < 100; v++) {
      const story = {
        title: v === 0 ? template.title : `${template.title} - Part ${variations[v]}`,
        content: template.content,
        genre: template.genre,
        reading_level: 'advanced',
        word_count: template.word_count,
        lexile_band: template.lexile,
        grade_level: 8,
        vocabulary: template.vocabulary,
        comprehension_questions: generateContextualQuestions(template),
        reading_strategy: 'Philosophical Analysis and Systems Thinking',
        strategy_tip: 'Consider the multiple stakeholders and value systems at play. Analyze how individual choices interact with larger systems. Evaluate what genuine ethical reasoning requires in complex situations.'
      };
      stories.push(story);
    }
  });

  return stories;
}

async function seedStories() {
  console.log('=== Seeding Grade 8 Stories ===\n');

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
  console.log(`Inserted ${inserted} Grade 8 stories`);
  console.log('Each with 10 comprehension questions');
  console.log(`Total questions: ${inserted * 10}`);

  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 8);
  console.log(`\nVerified Grade 8 stories in database: ${count}`);
}

seedStories();
