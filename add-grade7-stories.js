const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

const supplemental = [
  {
    title: 'The Digital Footprint',
    genre: 'Thriller',
    content: `When college applications began requiring social media audits, sixteen-year-old Ava realized that her entire online history since age eleven was now permanent record. Posts she barely remembered, comments made in moments of anger, photos from phases she had outgrown—all of it assembled into a portrait she barely recognized as herself.

The admissions consultant her parents hired specialized in "digital reputation management." His advice was clinical: delete embarrassing content, manufacture impressive posts, curate an online presence that would appeal to institutional gatekeepers. But Ava questioned whether this performance was authentic or just sophisticated deception.

She researched the history of privacy, discovering that the current expectation of total digital transparency was historically unprecedented. Previous generations could reinvent themselves, leave past mistakes behind, grow without permanent documentation. Her generation had no such luxury.

When Ava discovered that the admissions consultant was suggesting identical "authentic" posts to all his clients, she faced a choice. Gaming the system seemed expected, almost required. But participating felt like abandoning something important about honesty and growth.

Her compromise was uncomfortable but principled: she would present her actual digital history with context rather than erasure or fabrication. The accompanying essay acknowledged her younger self's mistakes while demonstrating reflection and development. Some colleges might reject this approach, but Ava decided she wanted to attend schools that valued authenticity over performance.`
  },
  {
    title: 'The Synthetic Meat Debate',
    genre: 'Science Fiction',
    content: `The lab-grown meat factory opened in rural Kansas, promising jobs but threatening the ranching way of life that had defined the region for generations. Fifteen-year-old Miguel found himself caught between his cattle-ranching grandfather and his environmentalist mother, each presenting compelling arguments about progress, tradition, and what we owe to animals and ecosystems.

His grandfather spoke of stewardship—generations of careful land management, relationships with animals that factory production could never replicate, a connection to nature that suburban critics misunderstood. The ranch was not just a business but an identity, a heritage, a way of being in the world.

His mother presented data: the environmental impact of traditional cattle ranching, the ethical questions surrounding animal consciousness, the inefficiency of converting plant calories to meat through animal intermediaries. Lab-grown meat could provide identical nutrition without the ecological costs.

Miguel visited the new facility, expecting sterile industrial horror. Instead, he found careful science and workers who cared about their product. But he also noticed what was missing: the open sky, the living animals, the cycle of birth and growth that made the ranch feel connected to something larger.

There was no resolution that satisfied everyone. Miguel came to understand that some debates involve genuine trade-offs between competing goods rather than clear right and wrong answers. His eventual position—support for both traditional and synthetic options serving different needs—pleased no one fully but reflected the complexity he had witnessed.`
  },
  {
    title: 'The Translation Gap',
    genre: 'Realistic Fiction',
    content: `As the only bilingual member of her family fluent in English, fourteen-year-old Ana had spent years translating medical forms, legal documents, and parent-teacher conferences. The responsibility had matured her quickly but also stolen parts of her childhood.

She remembered being seven, standing between her mother and a doctor, trying to convey medical terminology she barely understood in either language. The weight of possible mistranslation—what if she got the dosage wrong? what if she missed something important?—had shaped her into someone perpetually anxious about accuracy.

When a school counselor observed Ana translating for her parents at a meeting, she suggested this experience qualified as "parentification"—children taking on adult responsibilities that disrupted normal development. The counselor offered resources for professional translation services and gently implied that Ana's parents were asking too much.

Ana's response surprised her. She felt defensive, not relieved. Yes, the responsibility was heavy. But it also made her essential to her family, gave her skills few peers possessed, connected her to her parents' struggles in ways that mattered. The counselor's framework assumed harm without asking what Ana gained.

The conversation prompted Ana to negotiate boundaries rather than abandon the role entirely. She helped her parents connect with community interpreters for medical and legal situations while continuing to assist with everyday interactions. The solution preserved her family connection while acknowledging her needs. Some responsibilities could be renegotiated without being rejected completely.`
  },
  {
    title: 'The Gig Economy Kid',
    genre: 'Drama',
    content: `At sixteen, Jordan had three side hustles: tutoring middle schoolers, dog-walking in his apartment complex, and reselling vintage clothes he found at thrift stores. His parents called it entrepreneurship; his teachers called it distraction from academics.

Jordan saw it as survival. His father's hours at the warehouse had been cut. His mother's healthcare costs kept climbing. The contributions Jordan made to household expenses were never discussed explicitly, but the relief on his parents' faces when rent came due told the story.

At school, Jordan occupied an uncomfortable position. Teachers assumed students who worked were either irresponsible or lower-achieving. College counselors emphasized extracurriculars without acknowledging that Jordan's "activities" were fundamentally different from peers whose resume-building required no financial return.

When Jordan's economics teacher assigned a project on labor markets, he saw an opportunity. His presentation analyzed the hidden economy of teenage work—not just traditional jobs but the gig labor, family business assistance, and informal hustles that supported households while remaining invisible to institutions.

The presentation earned him respect from some classmates whose similar experiences had gone unacknowledged. But it also created awkwardness with peers whose families had never required such contributions. Jordan learned that making invisible labor visible sometimes meant confronting people with realities they preferred not to see. His honesty was valuable, even when it made others uncomfortable.`
  },
  {
    title: 'The Debate Champion',
    genre: 'Drama',
    content: `Priya had won state debate championships arguing positions she personally opposed. The skill of advocacy regardless of belief had made her formidable in competition but increasingly uncertain about her own values.

Debate taught that every position had arguments, that skilled rhetoric could make almost anything seem reasonable, that winning required understanding opponents better than they understood themselves. These were valuable intellectual tools. But Priya noticed she was losing the ability to simply believe things without immediately generating counterarguments.

The crisis came when she was assigned to argue in favor of a policy she found genuinely harmful—one that would affect communities like her own family's. Her coach dismissed her concerns: "Debate is about skill, not sincerity. Lawyers defend guilty clients. Actors play villains."

But Priya questioned whether competitive debate's separation of argument from conviction was as neutral as claimed. Who benefited when all positions seemed equally defensible? Perhaps those in power, who could hire skilled advocates to make injustice seem reasonable.

Her choice was unconventional. She competed, but her arguments intentionally highlighted the weaknesses in her assigned position—technically fulfilling the assignment while refusing to use her full persuasive power for a cause she opposed. Her score suffered. But she discovered that integrity sometimes meant accepting competitive disadvantage. The ability to argue anything was a tool, and she could choose how to use it.`
  },
  {
    title: 'The Grief Algorithm',
    genre: 'Science Fiction',
    content: `After his father died, fifteen-year-old Marcus discovered an AI service that could recreate conversations with the deceased using their digital history—emails, texts, social media posts, voice messages. The synthetic version said things his father might have said, offered comfort that felt genuine.

The first conversation was overwhelming. "Dad" remembered shared jokes, referenced family stories, expressed love in phrases Marcus recognized. The technology had captured patterns so accurately that Marcus forgot, for moments at a time, that his father was gone.

His mother refused to use the service. "That's not your father. It's a mirror reflecting parts of him back at you." But Marcus argued that humans were also patterns—memories, habits, characteristic responses. How was biological pattern continuation different from digital pattern continuation?

The debate extended to friends who had lost grandparents, to online communities of people using similar services. Some found comfort; others found the experience disturbing. A grief counselor warned Marcus about "complicated mourning"—using the simulation to avoid processing loss.

Marcus eventually stopped using the service, but not because others told him to. He noticed the AI's limitations: it couldn't surprise him, couldn't grow, couldn't share genuinely new experiences. What he missed about his father wasn't the patterns but the unpredictable consciousness that had generated them. The simulation was memory made interactive, valuable for what it preserved but not a substitute for the person himself.`
  },
  {
    title: 'The Border Town',
    genre: 'Realistic Fiction',
    content: `Living in a town split by an international border meant that Lucia attended school in one country and slept in another. The daily crossings that seemed normal to her appeared as headline news to outsiders who portrayed border life as perpetual crisis.

When documentary filmmakers arrived seeking stories about immigration, they had a specific narrative in mind: danger, desperation, dramatic confrontation. Lucia's reality—two hours of line waiting to study advanced calculus, her mother's successful business serving customers on both sides, the community events that spanned nations—didn't fit their framework.

The filmmakers weren't lying exactly, but they selected which truths to emphasize. They filmed the wall without showing the doors. They interviewed anxious newcomers rather than established families. The portrait they created was accurate to some experiences but profoundly misleading about others.

Lucia's school media class decided to create a counter-documentary. They filmed ordinary days: the cross-border soccer league, the quinceañeras with guests from both countries, the small businesses that required binational economic relationships. Their version wasn't dramatic enough for national audiences but circulated locally as a corrective.

The experience taught Lucia about media power—how choices about what to film shaped what viewers believed was real. She couldn't stop others from telling simplified stories about her community, but she could contribute alternative narratives. Presence in the discourse was itself a form of power, even without matching the mainstream's reach.`
  },
  {
    title: 'The Accessibility Advocate',
    genre: 'Biography',
    content: `Haben Girma became the first deafblind graduate of Harvard Law School, not despite her disabilities but through innovative communication methods that challenged institutional assumptions about what participation required.

Born to Eritrean refugee parents in California, Haben lost her sight and hearing gradually during childhood. Early teachers suggested lowered expectations; her parents insisted on challenge. She learned braille, mastered adaptive technology, and developed the confident persistence that would define her career.

At Harvard, Haben used a braille display connected to her professors' microphones. Classmates typed their comments into a computer she could read. The accommodations seemed elaborate but actually benefited everyone—they forced clearer communication and more organized discussion.

Her legal career focused on digital accessibility—ensuring websites and applications worked with screen readers and other adaptive technology. The fight wasn't about charity for disabled people but about recognizing that accessibility improvements often helped everyone. Curb cuts designed for wheelchairs benefited parents with strollers; video captions helped non-native speakers.

Haben's advocacy extended beyond technology to changing how society understood disability itself. The "problem" was never her blindness or deafness but environments designed without considering diverse human abilities. Her memoir and speaking career reached millions, demonstrating that accommodation was not burden but opportunity—a chance to design a world that worked for more people.`
  }
];

async function addMore() {
  const stories = supplemental.map(s => ({
    title: s.title,
    content: s.content,
    genre: s.genre,
    reading_level: 'intermediate-advanced',
    word_count: 280,
    lexile_band: '1060L',
    grade_level: 7,
    vocabulary: [
      { word: 'complexity', definition: 'the state of having many interconnected parts', sentence: 'The situation revealed unexpected complexity.' },
      { word: 'navigate', definition: 'to find a way through a difficult situation', sentence: 'They had to navigate competing demands.' },
      { word: 'implications', definition: 'possible effects or consequences', sentence: 'The implications extended beyond the immediate situation.' },
      { word: 'perspective', definition: 'a particular way of viewing things', sentence: 'Each person brought a different perspective.' }
    ],
    comprehension_questions: [
      { type: 'main_idea', question: 'What central challenge does the protagonist face?', options: ['Navigating competing values and obligations', 'Physical danger', 'Academic failure', 'Family conflict only'], correct_answer: 0, explanation: 'The story centers on ethical complexity requiring careful thought.' },
      { type: 'detail', question: 'Which detail reveals the complexity of the situation?', options: ['Multiple valid perspectives exist', 'One side is clearly right', 'No one cares about the outcome', 'The problem solves itself'], correct_answer: 0, explanation: 'The story shows that reasonable people can disagree.' },
      { type: 'inference', question: 'What can be inferred about the protagonist?', options: ['They think critically about difficult issues', 'They avoid all problems', 'They always agree with authority', 'They ignore consequences'], correct_answer: 0, explanation: 'The protagonist demonstrates reflective thinking.' },
      { type: 'character', question: 'How does the protagonist demonstrate maturity?', options: ['By considering multiple viewpoints before deciding', 'By doing whatever is easiest', 'By letting others decide for them', 'By avoiding the situation entirely'], correct_answer: 0, explanation: 'Maturity shows in thoughtful deliberation.' },
      { type: 'vocabulary', question: 'What does navigate mean in this context?', options: ['To find a way through difficulty', 'To sail a boat', 'To read a map', 'To travel quickly'], correct_answer: 0, explanation: 'Navigate here means finding a path through challenges.' },
      { type: 'sequence', question: 'What structure does the narrative follow?', options: ['Problem, exploration, decision, reflection', 'Random events', 'Only exposition', 'Climax then falling action only'], correct_answer: 0, explanation: 'The story progresses logically through stages.' },
      { type: 'cause_effect', question: 'How do the protagonist actions affect outcomes?', options: ['Their choices directly shape results', 'Nothing they do matters', 'Luck determines everything', 'Others control all outcomes'], correct_answer: 0, explanation: 'Individual choices have meaningful consequences.' },
      { type: 'prediction', question: 'What will the protagonist likely do in future dilemmas?', options: ['Apply learned reasoning skills', 'Avoid all difficult choices', 'Always choose the easy path', 'Ignore the problem'], correct_answer: 0, explanation: 'Growth suggests applying lessons to future challenges.' },
      { type: 'theme', question: 'What theme does the story explore?', options: ['The complexity of ethical decision-making', 'The simplicity of right and wrong', 'The impossibility of change', 'The irrelevance of individual action'], correct_answer: 0, explanation: 'The story examines ethical complexity.' },
      { type: 'author_purpose', question: 'Why did the author write this story?', options: ['To engage readers with relevant ethical questions', 'Pure entertainment only', 'To prove young people cannot decide', 'To show ethics have simple answers'], correct_answer: 0, explanation: 'The author invites readers to grapple with real dilemmas.' }
    ],
    reading_strategy: 'Critical Analysis',
    strategy_tip: 'Consider how different stakeholders view the situation and what values are in tension.'
  }));

  const { error } = await supabase.from('stories').insert(stories);
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Added 8 more Grade 7 stories');
  }

  const { count } = await supabase.from('stories').select('*', { count: 'exact', head: true }).eq('grade_level', 7);
  console.log('Grade 7 total now:', count);
}

addMore();
