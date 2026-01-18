// Writing Content Generator for SchoolGenius
// Generates 11,500 writing items for grades K-7
// Visual types: sentence_builder, paragraph_structure, grammar_highlight

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEMPLATES_DIR = './library/templates/writing';

// Global counter for unique IDs
let globalIdCounter = 0;

function loadTemplate(grade) {
  const filename = grade === 0 ? 'writing-templates-K.json' : `writing-templates-G${grade}.json`;
  const content = readFileSync(`${TEMPLATES_DIR}/${filename}`, 'utf-8');
  return JSON.parse(content);
}

function generateId(grade, skillCode) {
  globalIdCounter++;
  return `WRITE-G${grade}-${skillCode}-${String(globalIdCounter).padStart(5, '0')}`;
}

function generateTier1(skill, answer, visualType, visualData) {
  return {
    teach: `${skill}: Focus on the key concept.`.substring(0, 80),
    steps: [
      {
        step: 1,
        visual: { type: visualType, data: visualData },
        voice_text: `Let me show you how this works.`,
        duration: 4000
      },
      {
        step: 2,
        visual: { type: visualType, data: { ...visualData, highlighted: true } },
        voice_text: `The answer is: ${String(answer).substring(0, 30)}.`,
        duration: 4000
      }
    ]
  };
}

function generateTier2(skill, answer, visualType, visualData) {
  return {
    teach: `${skill} - simplified.`.substring(0, 60),
    steps: [
      {
        step: 1,
        visual: { type: visualType, data: { ...visualData, simplified: true } },
        voice_text: `The answer is ${String(answer).substring(0, 20)}.`,
        duration: 4000
      }
    ]
  };
}

// Helper to create an item
function createItem(template, skill, question, answer, visualType, visualData) {
  return {
    id: generateId(template.grade, skill.code),
    subject: 'writing',
    grade: template.grade,
    skill: skill.skill,
    standard: skill.standard,
    question,
    answer,
    tier1: generateTier1(skill.skill, answer, visualType, visualData),
    tier2: generateTier2(skill.skill, answer, visualType, visualData)
  };
}

// Supplemental data for generating more items
const supplementalData = {
  sentenceTypes: [
    { sentence: "The dog runs fast.", type: "declarative" },
    { sentence: "Can you help me?", type: "interrogative" },
    { sentence: "Please close the door.", type: "imperative" },
    { sentence: "What a beautiful day!", type: "exclamatory" },
    { sentence: "Birds fly south in winter.", type: "declarative" },
    { sentence: "Where are you going?", type: "interrogative" },
    { sentence: "Stop running in the halls.", type: "imperative" },
    { sentence: "I can't believe it!", type: "exclamatory" },
    { sentence: "The sun rises in the east.", type: "declarative" },
    { sentence: "Do you like pizza?", type: "interrogative" }
  ],
  coordinating: ["and", "but", "or", "so", "yet", "for", "nor"],
  sentencePairs: [
    { s1: "I like apples", s2: "I also like oranges", conjunction: "and" },
    { s1: "She wanted to go", s2: "it was raining", conjunction: "but" },
    { s1: "We can eat now", s2: "we can wait", conjunction: "or" },
    { s1: "He studied hard", s2: "he passed the test", conjunction: "so" },
    { s1: "The movie was long", s2: "it was entertaining", conjunction: "yet" }
  ],
  commaIntro: [
    { intro: "After the game", sentence: "After the game, we went home." },
    { intro: "However", sentence: "However, I disagree." },
    { intro: "First", sentence: "First, mix the ingredients." },
    { intro: "In the morning", sentence: "In the morning, we exercise." },
    { intro: "Unfortunately", sentence: "Unfortunately, it rained." }
  ],
  evidenceTopics: [
    { claim: "Exercise is important", evidence: "Studies show active kids focus better." },
    { claim: "Reading helps learning", evidence: "Students who read score higher on tests." },
    { claim: "Sleep is essential", evidence: "Research shows sleep improves memory." },
    { claim: "Water is vital", evidence: "The body is 60% water." },
    { claim: "Breakfast matters", evidence: "Kids who eat breakfast perform better." }
  ],
  compoundComplex: [
    { sentence: "When the bell rang, students left, and teachers cleaned up.", independent1: "students left", independent2: "teachers cleaned up", dependent: "When the bell rang" },
    { sentence: "Although it rained, we played outside, but we got wet.", independent1: "we played outside", independent2: "we got wet", dependent: "Although it rained" },
    { sentence: "Because she studied, she passed, and she was happy.", independent1: "she passed", independent2: "she was happy", dependent: "Because she studied" }
  ],
  verbConsistency: [
    { incorrect: "She walks and talked.", correct: "She walked and talked.", issue: "mixed tenses" },
    { incorrect: "I go and ate.", correct: "I went and ate.", issue: "mixed tenses" },
    { incorrect: "He runs and jumped.", correct: "He ran and jumped.", issue: "mixed tenses" },
    { incorrect: "They play and swam.", correct: "They played and swam.", issue: "mixed tenses" }
  ],
  thesisStatements: [
    { topic: "homework", weak: "Homework is bad.", strong: "Homework should be limited because it causes stress and reduces family time." },
    { topic: "uniforms", weak: "I don't like uniforms.", strong: "School uniforms improve focus and reduce bullying." },
    { topic: "recess", weak: "Recess is good.", strong: "Extended recess improves student focus and physical health." }
  ],
  counterclaims: [
    { claim: "Recess should be longer.", counterclaim: "Some say it takes from learning.", response: "But breaks improve focus." },
    { claim: "Homework should be banned.", counterclaim: "Some say it reinforces learning.", response: "However, research shows diminishing returns." }
  ],
  conclusions: [
    { type: "restate", example: "In conclusion, exercise benefits everyone." },
    { type: "call to action", example: "Start exercising today for better health." },
    { type: "final thought", example: "A healthy body leads to a healthy mind." }
  ],
  counterclaims6: [
    { claim: "Zoos should close.", counterclaim: "They protect endangered species.", rebuttal: "But wild conservation is more effective." },
    { claim: "Social media is harmful.", counterclaim: "It connects people.", rebuttal: "However, it increases anxiety in teens." }
  ],
  sentenceTypes7: [
    { sentence: "The cat slept.", type: "simple", structure: "one independent clause" },
    { sentence: "The cat slept, and the dog played.", type: "compound", structure: "two independent clauses" },
    { sentence: "When it rained, the cat slept.", type: "complex", structure: "independent + dependent clause" },
    { sentence: "When it rained, the cat slept, and the dog stayed inside.", type: "compound-complex", structure: "two independent + one dependent" }
  ],
  advancedArgument: [
    { topic: "Year-round school", claim: "Year-round schooling benefits students.", counterclaim: "It eliminates summer.", refutation: "Shorter breaks prevent learning loss." },
    { topic: "School start times", claim: "School should start later.", counterclaim: "It affects parents' schedules.", refutation: "Student health should be the priority." }
  ],
  literaryAnalysis: [
    { element: "thesis", example: "The author uses symbolism to show growth." },
    { element: "evidence", example: "The quote 'the sun rose' represents hope." },
    { element: "analysis", example: "This shows the character's transformation." }
  ],
  researchWriting: [
    { element: "quote", example: "According to Smith, 'climate affects all.' (45)" },
    { element: "paraphrase", example: "Smith argues that climate impacts everyone." },
    { element: "citation", example: "(Smith 45)" }
  ],
  narrativeTechniques: [
    { technique: "pacing", slow: "She reached slowly. Her hand trembled.", fast: "She grabbed it and ran." },
    { technique: "dialogue", example: "'I won't give up,' she said firmly." },
    { technique: "description", example: "The old house creaked with every step." }
  ]
};

function generateItems(template) {
  const items = [];

  for (const skill of template.skills) {
    let count = 0;
    const targetCount = skill.count;

    // Capitalization exercises
    if (skill.sentences && skill.skill.includes('capitalization')) {
      while (count < targetCount) {
        for (const s of skill.sentences) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Fix the capitalization: "${s.wrong}"`,
            s.right,
            'grammar_highlight',
            { sentence: s.right, highlights: [{ word: s.fix, type: 'capital' }] }
          ));
          count++;
        }
      }
    }

    // End punctuation exercises
    if (skill.sentences && skill.skill.includes('punctuation') && !skill.techniques) {
      while (count < targetCount) {
        for (const s of skill.sentences) {
          if (count >= targetCount) break;
          const sentence = s.sentence || s.example;
          const punct = s.punctuation || s.ends_with;
          if (sentence && punct) {
            items.push(createItem(template, skill,
              `Add the correct end punctuation: "${sentence}"`,
              sentence + punct,
              'sentence_builder',
              { parts: sentence.split(' '), punctuation: punct }
            ));
            count++;
          }
        }
      }
    }

    // Noun/verb identification
    if (skill.sentences && (skill.skill.includes('noun') || skill.skill.includes('verb')) && skill.sentences[0]?.noun) {
      while (count < targetCount) {
        for (const s of skill.sentences) {
          if (count >= targetCount) break;
          const target = s.noun || s.verb;
          const type = s.noun ? 'noun' : 'verb';
          items.push(createItem(template, skill,
            `Find the ${type} in: "${s.sentence}"`,
            target,
            'grammar_highlight',
            { sentence: s.sentence, highlights: [{ word: target, type }] }
          ));
          count++;
        }
      }
    }

    // Verb identification (separate)
    if (skill.sentences && skill.sentences[0]?.verb && !skill.sentences[0]?.noun) {
      while (count < targetCount) {
        for (const s of skill.sentences) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Find the verb in: "${s.sentence}"`,
            s.verb,
            'grammar_highlight',
            { sentence: s.sentence, highlights: [{ word: s.verb, type: 'verb' }] }
          ));
          count++;
        }
      }
    }

    // Complete sentences (sentence parts)
    if (skill.sentence_parts) {
      while (count < targetCount) {
        for (const sp of skill.sentence_parts) {
          if (count >= targetCount) break;
          const complete = `${sp.subject} ${sp.predicate}.`;
          items.push(createItem(template, skill,
            `Make a complete sentence: Subject: "${sp.subject}" + Predicate: "${sp.predicate}"`,
            complete,
            'sentence_builder',
            { parts: [sp.subject, sp.predicate], punctuation: '.' }
          ));
          count++;
        }
      }
    }

    // Opinion writing prompts
    if (skill.prompts && skill.skill.includes('opinion')) {
      while (count < targetCount) {
        for (const p of skill.prompts) {
          if (count >= targetCount) break;
          const reasons = p.reasons || [p.reason];
          items.push(createItem(template, skill,
            `Write an opinion about: ${p.topic}. Start with your opinion, then give a reason.`,
            `${p.opinion} ${reasons[0]}`,
            'paragraph_structure',
            { topic_sentence: p.opinion, detail_sentences: reasons }
          ));
          count++;
        }
      }
    }

    // Informative topics
    if (skill.topics && skill.skill.includes('informative')) {
      while (count < targetCount) {
        for (const t of skill.topics) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write a fact about: ${t.topic}`,
            t.facts[0],
            'paragraph_structure',
            { topic_sentence: `About ${t.topic}`, detail_sentences: t.facts }
          ));
          count++;
        }
      }
    }

    // Narrative sequences
    if (skill.sequences) {
      while (count < targetCount) {
        for (const seq of skill.sequences) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Put in order for "${seq.event}": What comes first?`,
            seq.steps[0],
            'paragraph_structure',
            { detail_sentences: seq.steps }
          ));
          count++;
        }
      }
    }

    // Fragment/complete sentence exercises
    if (skill.exercises && skill.exercises[0]?.fragment) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Fix this fragment: "${ex.fragment}"`,
            ex.complete,
            'sentence_builder',
            { fragment: ex.fragment, complete: ex.complete, missing: ex.missing }
          ));
          count++;
        }
      }
    }

    // Sentence types (declarative, etc.)
    if (skill.exercises && skill.exercises[0]?.type && skill.skill.includes('sentence type')) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What type of sentence is this? "${ex.sentence}"`,
            ex.type,
            'grammar_highlight',
            { sentence: ex.sentence, type: ex.type }
          ));
          count++;
        }
        // Use supplemental data if needed
        if (count < targetCount) {
          for (const ex of supplementalData.sentenceTypes) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `What type of sentence is this? "${ex.sentence}"`,
              ex.type,
              'grammar_highlight',
              { sentence: ex.sentence, type: ex.type }
            ));
            count++;
          }
        }
      }
    }

    // Compound sentences (sentence pairs)
    if (skill.sentence_pairs) {
      while (count < targetCount) {
        for (const sp of skill.sentence_pairs) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Combine using "${sp.conjunction}": "${sp.s1}" + "${sp.s2}"`,
            sp.combined,
            'sentence_builder',
            { parts: [sp.s1, sp.conjunction, sp.s2], combined: sp.combined }
          ));
          count++;
        }
      }
    }

    // Simple and compound sentences (Grade 3)
    if (skill.skill === 'simple and compound sentences') {
      while (count < targetCount) {
        for (const pair of supplementalData.sentencePairs) {
          if (count >= targetCount) break;
          const combined = `${pair.s1}, ${pair.conjunction} ${pair.s2}.`;
          items.push(createItem(template, skill,
            `Combine these sentences with "${pair.conjunction}": "${pair.s1}." + "${pair.s2}."`,
            combined,
            'sentence_builder',
            { s1: pair.s1, s2: pair.s2, conjunction: pair.conjunction, combined }
          ));
          count++;
        }
        for (const st of supplementalData.sentenceTypes) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Is this a simple or compound sentence? "${st.sentence}"`,
            'simple',
            'grammar_highlight',
            { sentence: st.sentence, type: 'simple' }
          ));
          count++;
        }
      }
    }

    // Coordinating conjunctions (Grade 3)
    if (skill.skill === 'coordinating conjunctions') {
      while (count < targetCount) {
        for (const conj of supplementalData.coordinating) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `"${conj}" is a coordinating conjunction. Use it: "I like dogs ___ cats."`,
            `I like dogs ${conj} cats.`,
            'grammar_highlight',
            { conjunction: conj, sentence: `I like dogs ${conj} cats.` }
          ));
          count++;
        }
        for (const pair of supplementalData.sentencePairs) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What coordinating conjunction joins: "${pair.s1}, ___ ${pair.s2}."`,
            pair.conjunction,
            'grammar_highlight',
            { conjunction: pair.conjunction }
          ));
          count++;
        }
      }
    }

    // Commas with introductory elements (Grade 4)
    if (skill.skill === 'commas with introductory elements') {
      const introExercises = skill.exercises || supplementalData.commaIntro;
      while (count < targetCount) {
        for (const ex of introExercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Add a comma after the introductory element: "${ex.intro} we went home."`,
            ex.sentence || `${ex.intro}, we went home.`,
            'grammar_highlight',
            { intro: ex.intro, sentence: ex.sentence }
          ));
          count++;
        }
        for (const ex of supplementalData.commaIntro) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Where does the comma go? "${ex.intro} the story began."`,
            `${ex.intro}, the story began.`,
            'grammar_highlight',
            { intro: ex.intro }
          ));
          count++;
        }
      }
    }

    // Evidence and examples (Grade 4)
    if (skill.skill === 'evidence and examples') {
      const evidenceExercises = skill.exercises || [];
      while (count < targetCount) {
        for (const ex of evidenceExercises) {
          if (count >= targetCount) break;
          for (const ev of ex.evidence || []) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `What evidence supports: "${ex.claim}"?`,
              ev,
              'paragraph_structure',
              { claim: ex.claim, evidence: ev }
            ));
            count++;
          }
        }
        for (const ev of supplementalData.evidenceTopics) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Give evidence for: "${ev.claim}"`,
            ev.evidence,
            'paragraph_structure',
            { claim: ev.claim, evidence: ev.evidence }
          ));
          count++;
        }
      }
    }

    // Compound-complex sentences (Grade 5)
    if (skill.skill === 'compound-complex sentences') {
      const exercises = skill.exercises || supplementalData.compoundComplex;
      while (count < targetCount) {
        for (const ex of exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Identify the dependent clause: "${ex.sentence}"`,
            ex.dependent,
            'sentence_builder',
            ex
          ));
          count++;
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Identify the first independent clause: "${ex.sentence}"`,
            ex.independent1,
            'sentence_builder',
            ex
          ));
          count++;
        }
        for (const ex of supplementalData.compoundComplex) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Is this compound-complex? "${ex.sentence}"`,
            'yes',
            'grammar_highlight',
            ex
          ));
          count++;
        }
      }
    }

    // Verb tense consistency (Grade 5)
    if (skill.skill === 'verb tense consistency') {
      const exercises = skill.exercises || supplementalData.verbConsistency;
      while (count < targetCount) {
        for (const ex of exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Fix the tense inconsistency: "${ex.incorrect}"`,
            ex.correct,
            'grammar_highlight',
            { incorrect: ex.incorrect, correct: ex.correct, issue: ex.issue }
          ));
          count++;
        }
        for (const ex of supplementalData.verbConsistency) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Make tenses consistent: "${ex.incorrect}"`,
            ex.correct,
            'grammar_highlight',
            ex
          ));
          count++;
        }
      }
    }

    // Thesis statements (Grade 5)
    if (skill.skill === 'thesis statements') {
      const exercises = skill.exercises || supplementalData.thesisStatements;
      while (count < targetCount) {
        for (const ex of exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Improve this weak thesis: "${ex.weak}"`,
            ex.strong,
            'paragraph_structure',
            { topic: ex.topic, weak: ex.weak, strong: ex.strong }
          ));
          count++;
        }
        for (const ex of supplementalData.thesisStatements) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write a strong thesis about: ${ex.topic}`,
            ex.strong,
            'paragraph_structure',
            ex
          ));
          count++;
        }
      }
    }

    // Counterclaims (Grade 5)
    if (skill.skill === 'counterclaims' && template.grade === 5) {
      const exercises = skill.exercises || supplementalData.counterclaims;
      while (count < targetCount) {
        for (const ex of exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Respond to this counterclaim for "${ex.claim}": "${ex.counterclaim}"`,
            ex.response,
            'paragraph_structure',
            ex
          ));
          count++;
        }
        for (const ex of supplementalData.counterclaims) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What is a counterclaim to: "${ex.claim}"?`,
            ex.counterclaim,
            'paragraph_structure',
            ex
          ));
          count++;
        }
      }
    }

    // Concluding statements (Grade 5)
    if (skill.skill === 'concluding statements') {
      const techniques = skill.techniques || supplementalData.conclusions;
      while (count < targetCount) {
        for (const t of techniques) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What type of conclusion is this? "${t.example}"`,
            t.type,
            'paragraph_structure',
            t
          ));
          count++;
        }
        for (const t of supplementalData.conclusions) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write a ${t.type} conclusion about exercise.`,
            t.example,
            'paragraph_structure',
            t
          ));
          count++;
        }
      }
    }

    // Argument structure - counterclaims (Grade 6)
    if (skill.skill === 'argument structure - counterclaims') {
      const exercises = skill.exercises || supplementalData.counterclaims6;
      while (count < targetCount) {
        for (const ex of exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Rebut this counterclaim for "${ex.claim}": "${ex.counterclaim}"`,
            ex.rebuttal,
            'paragraph_structure',
            ex
          ));
          count++;
        }
        for (const ex of supplementalData.counterclaims6) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What's a counterclaim to: "${ex.claim}"?`,
            ex.counterclaim,
            'paragraph_structure',
            ex
          ));
          count++;
        }
      }
    }

    // Sentence types and purposes (Grade 7)
    if (skill.skill === 'sentence types and purposes') {
      const types = skill.types || supplementalData.sentenceTypes7;
      while (count < targetCount) {
        for (const t of types) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What type of sentence is this? "${t.sentence}"`,
            t.type,
            'grammar_highlight',
            { sentence: t.sentence, type: t.type, structure: t.structure }
          ));
          count++;
        }
        for (const t of supplementalData.sentenceTypes7) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Describe the structure: "${t.sentence}"`,
            t.structure,
            'grammar_highlight',
            t
          ));
          count++;
        }
      }
    }

    // Advanced argument - acknowledged counterclaims (Grade 7)
    if (skill.skill === 'advanced argument - acknowledged counterclaims') {
      const exercises = skill.exercises || supplementalData.advancedArgument;
      while (count < targetCount) {
        for (const ex of exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Refute this for "${ex.topic}": "${ex.counterclaim}"`,
            ex.refutation,
            'paragraph_structure',
            ex
          ));
          count++;
        }
        for (const ex of supplementalData.advancedArgument) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What claim would you make about: ${ex.topic}?`,
            ex.claim,
            'paragraph_structure',
            ex
          ));
          count++;
        }
      }
    }

    // Literary analysis writing (Grade 7)
    if (skill.skill === 'literary analysis writing') {
      const elements = skill.elements || supplementalData.literaryAnalysis;
      while (count < targetCount) {
        for (const el of elements) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What literary analysis element is this? "${el.example}"`,
            el.element,
            'paragraph_structure',
            el
          ));
          count++;
        }
        for (const el of supplementalData.literaryAnalysis) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write an example of: ${el.element}`,
            el.example,
            'paragraph_structure',
            el
          ));
          count++;
        }
      }
    }

    // Research writing basics (Grade 7)
    if (skill.skill === 'research writing basics') {
      const elements = skill.elements || supplementalData.researchWriting;
      while (count < targetCount) {
        for (const el of elements) {
          if (count >= targetCount) break;
          const example = el.example || el.techniques?.[0] || 'direct quote';
          items.push(createItem(template, skill,
            `What research writing technique is this? "${example}"`,
            el.element,
            'paragraph_structure',
            el
          ));
          count++;
        }
        for (const el of supplementalData.researchWriting) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write a ${el.element} for research.`,
            el.example,
            'paragraph_structure',
            el
          ));
          count++;
        }
      }
    }

    // Narrative techniques (Grade 7)
    if (skill.skill === 'narrative techniques') {
      const techniques = skill.techniques || supplementalData.narrativeTechniques;
      while (count < targetCount) {
        for (const t of techniques) {
          if (count >= targetCount) break;
          const example = t.slow || t.example;
          items.push(createItem(template, skill,
            `What narrative technique is shown? "${example}"`,
            t.technique,
            'paragraph_structure',
            t
          ));
          count++;
        }
        for (const t of supplementalData.narrativeTechniques) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write an example of: ${t.technique}`,
            t.slow || t.example,
            'paragraph_structure',
            t
          ));
          count++;
        }
      }
    }

    // Collective nouns
    if (skill.collectives) {
      while (count < targetCount) {
        for (const c of skill.collectives) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `A group of ${c.of} is called a ___`,
            c.collective,
            'grammar_highlight',
            { sentence: `a ${c.collective} of ${c.of}`, highlights: [{ word: c.collective, type: 'collective noun' }] }
          ));
          count++;
        }
      }
    }

    // Irregular plurals
    if (skill.irregulars) {
      while (count < targetCount) {
        for (const ir of skill.irregulars) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What is the plural of "${ir.singular}"?`,
            ir.plural,
            'grammar_highlight',
            { singular: ir.singular, plural: ir.plural }
          ));
          count++;
        }
      }
    }

    // Past tense verbs
    if (skill.regular && skill.irregular) {
      while (count < targetCount) {
        for (const v of [...skill.regular, ...skill.irregular]) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What is the past tense of "${v.present}"?`,
            v.past,
            'grammar_highlight',
            { present: v.present, past: v.past }
          ));
          count++;
        }
      }
    }

    // Contractions
    if (skill.contractions) {
      while (count < targetCount) {
        for (const c of skill.contractions) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Write the contraction for "${c.full}"`,
            c.contraction,
            'grammar_highlight',
            { full: c.full, contraction: c.contraction }
          ));
          count++;
        }
      }
    }

    // Possessives
    if (skill.possessives) {
      while (count < targetCount) {
        for (const p of skill.possessives) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Show that ${p.owner} owns the ${p.item}`,
            p.possessive,
            'grammar_highlight',
            { owner: p.owner, item: p.item, possessive: p.possessive }
          ));
          count++;
        }
      }
    }

    // Paragraphs
    if (skill.paragraphs) {
      while (count < targetCount) {
        for (const para of skill.paragraphs) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What is the topic sentence for a paragraph about "${para.topic}"?`,
            para.topic_sentence || para.intro,
            'paragraph_structure',
            para
          ));
          count++;
        }
      }
    }

    // Adjectives
    if (skill.adjectives) {
      while (count < targetCount) {
        for (const adj of skill.adjectives) {
          if (count >= targetCount) break;
          if (adj.base) {
            items.push(createItem(template, skill,
              `What is the comparative form of "${adj.base}"?`,
              adj.comparative,
              'grammar_highlight',
              adj
            ));
            count++;
          }
        }
      }
    }

    // Verbs (action list)
    if (skill.verbs && Array.isArray(skill.verbs) && typeof skill.verbs[0] === 'string') {
      while (count < targetCount) {
        for (const verb of skill.verbs) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Use the action verb "${verb}" in a sentence.`,
            `I ${verb}.`,
            'grammar_highlight',
            { verb, type: 'action verb' }
          ));
          count++;
        }
      }
    }

    // Categories (nouns)
    if (skill.categories) {
      while (count < targetCount) {
        for (const cat of skill.categories) {
          for (const noun of cat.nouns) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `Is "${noun}" a person, place, or thing?`,
              cat.category === 'names' ? 'person' : cat.category === 'places' ? 'place' : 'thing',
              'grammar_highlight',
              { word: noun, category: cat.category }
            ));
            count++;
          }
        }
      }
    }

    // Adjective sets
    if (skill.adjective_sets) {
      while (count < targetCount) {
        for (const set of skill.adjective_sets) {
          for (const adj of set.adjectives) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `Add an adjective to describe: "The ___ ${set.noun}"`,
              `The ${adj} ${set.noun}`,
              'grammar_highlight',
              { noun: set.noun, adjective: adj }
            ));
            count++;
          }
        }
      }
    }

    // Subject-verb agreement
    if (skill.exercises && skill.exercises[0]?.verb_choices) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Choose the correct verb: ${ex.subject} ___ (${ex.verb_choices.join('/')})`,
            ex.correct,
            'grammar_highlight',
            { sentence: ex.sentence, highlights: [{ word: ex.correct, type: 'verb' }] }
          ));
          count++;
        }
      }
    }

    // Pronoun-antecedent
    if (skill.exercises && skill.exercises[0]?.antecedent) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What pronoun replaces "${ex.antecedent}"?`,
            ex.pronoun,
            'grammar_highlight',
            { sentence: ex.sentence, highlights: [{ word: ex.pronoun, type: 'pronoun' }] }
          ));
          count++;
        }
      }
    }

    // Dialogues
    if (skill.dialogues) {
      while (count < targetCount) {
        for (const d of skill.dialogues) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Format this dialogue: ${d.speaker} ${d.said}: ${d.dialogue}`,
            d.formatted,
            'grammar_highlight',
            { dialogue: d.formatted }
          ));
          count++;
        }
      }
    }

    // Story starters
    if (skill.story_starters) {
      while (count < targetCount) {
        for (const story of skill.story_starters) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Continue this story: ${story.setting} - ${story.character} ${story.problem}`,
            story.dialogue,
            'paragraph_structure',
            story
          ));
          count++;
        }
      }
    }

    // Linking words
    if (skill.linking_words && typeof skill.linking_words === 'object' && !Array.isArray(skill.linking_words)) {
      while (count < targetCount) {
        for (const [category, words] of Object.entries(skill.linking_words)) {
          for (const word of words) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `"${word}" is a linking word for ___ (addition/contrast/sequence/conclusion)`,
              category,
              'grammar_highlight',
              { word, category }
            ));
            count++;
          }
        }
      }
    }

    // Complex sentences with subordinating conjunctions
    if (skill.exercises && skill.exercises[0]?.independent && skill.exercises[0]?.dependent && !skill.exercises[0]?.independent2) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Combine: "${ex.independent}" + "${ex.dependent}"`,
            ex.combined || ex.answer,
            'sentence_builder',
            ex
          ));
          count++;
        }
      }
    }

    // Run-on sentences
    if (skill.exercises && skill.exercises[0]?.runon) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Fix this run-on: "${ex.runon}"`,
            ex.fixed,
            'grammar_highlight',
            { runon: ex.runon, fixed: ex.fixed, fix_type: ex.fix_type }
          ));
          count++;
        }
      }
    }

    // Relative pronouns
    if (skill.exercises && skill.exercises[0]?.sentence && skill.exercises[0]?.answer && skill.relative_pronouns) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            ex.sentence,
            ex.answer,
            'grammar_highlight',
            { sentence: ex.sentence.replace('___', ex.answer), explanation: ex.explanation }
          ));
          count++;
        }
      }
    }

    // Verb tenses (progressive, perfect)
    if (skill.tenses) {
      while (count < targetCount) {
        for (const t of skill.tenses) {
          if (count >= targetCount) break;
          const forms = ['past_progressive', 'present_progressive', 'future_progressive', 'past_perfect', 'present_perfect', 'future_perfect'];
          for (const form of forms) {
            if (t[form] && count < targetCount) {
              items.push(createItem(template, skill,
                `What is the ${form.replace('_', ' ')} of "${t.base}"?`,
                t[form],
                'grammar_highlight',
                { base: t.base, form: t[form], tense: form }
              ));
              count++;
            }
          }
        }
      }
    }

    // Modals
    if (skill.modals) {
      while (count < targetCount) {
        for (const m of skill.modals) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `"${m.modal}" is used to show ___ (${m.use})`,
            m.use,
            'grammar_highlight',
            { modal: m.modal, use: m.use, example: m.example }
          ));
          count++;
        }
      }
    }

    // Prepositions
    if (skill.prepositions && skill.exercises) {
      while (count < targetCount) {
        for (const ex of skill.exercises) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Find the prepositional phrase in: "${ex.sentence}"`,
            ex.prep_phrase,
            'grammar_highlight',
            { sentence: ex.sentence, highlights: [{ phrase: ex.prep_phrase, type: 'prepositional phrase' }] }
          ));
          count++;
        }
      }
    }

    // Comma uses
    if (skill.uses && skill.skill.includes('comma')) {
      while (count < targetCount) {
        for (const use of skill.uses) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What type of comma use is this? "${use.example}"`,
            use.use,
            'grammar_highlight',
            { sentence: use.example, comma_use: use.use }
          ));
          count++;
        }
      }
    }

    // Formal/informal comparisons
    if (skill.comparisons) {
      while (count < targetCount) {
        for (const c of skill.comparisons) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Make this formal: "${c.informal}"`,
            c.formal,
            'grammar_highlight',
            { informal: c.informal, formal: c.formal }
          ));
          count++;
        }
      }
    }

    // Conversions (informal to formal)
    if (skill.conversions) {
      while (count < targetCount) {
        for (const c of skill.conversions) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Rewrite formally: "${c.informal}"`,
            c.formal,
            'grammar_highlight',
            { informal: c.informal, formal: c.formal }
          ));
          count++;
        }
      }
    }

    // Pairs (correlative conjunctions)
    if (skill.pairs) {
      while (count < targetCount) {
        for (const p of skill.pairs) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Complete using "${p.pair}": ___`,
            p.example,
            'sentence_builder',
            { pair: p.pair, example: p.example }
          ));
          count++;
        }
      }
    }

    // Title formatting rules
    if (skill.rules && skill.skill.includes('titles')) {
      while (count < targetCount) {
        for (const r of skill.rules) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `How should you format a ${r.type} title like "${r.example}"?`,
            r.format,
            'grammar_highlight',
            { type: r.type, format: r.format, example: r.example }
          ));
          count++;
        }
      }
    }

    // Sentence varying techniques
    if (skill.techniques && skill.skill.includes('varying')) {
      while (count < targetCount) {
        for (const t of skill.techniques) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Improve: "${t.original}"`,
            t.improved,
            'sentence_builder',
            { original: t.original, improved: t.improved, technique: t.technique }
          ));
          count++;
        }
      }
    }

    // Pronouns (subjective/objective)
    if (skill.pronouns && (skill.pronouns.subjective || skill.pronouns.objective)) {
      while (count < targetCount) {
        for (const ex of skill.exercises || []) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            ex.sentence,
            ex.answer,
            'grammar_highlight',
            { sentence: ex.sentence.replace('___', ex.answer), type: ex.type }
          ));
          count++;
        }
      }
    }

    // Intensives
    if (skill.intensives) {
      while (count < targetCount) {
        for (const ex of skill.exercises || []) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What is the intensive pronoun in: "${ex.sentence}"?`,
            ex.intensive,
            'grammar_highlight',
            { sentence: ex.sentence, intensive: ex.intensive, emphasizes: ex.emphasizes }
          ));
          count++;
        }
      }
    }

    // Sentence patterns
    if (skill.patterns && !skill.skill.includes('varying')) {
      while (count < targetCount) {
        for (const p of skill.patterns) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What technique is used here? "${p.example}"`,
            p.technique || p.purpose,
            'grammar_highlight',
            p
          ));
          count++;
        }
      }
    }

    // Punctuation for effect
    if (skill.techniques && skill.skill.includes('punctuation') && skill.techniques[0]?.punctuation) {
      while (count < targetCount) {
        for (const t of skill.techniques) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What effect does the ${t.punctuation} create in: "${t.example}"?`,
            t.effect,
            'grammar_highlight',
            t
          ));
          count++;
        }
      }
    }

    // Style and tone
    if (skill.tones) {
      while (count < targetCount) {
        for (const t of skill.tones) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What tone is this? "${t.example}"`,
            t.tone,
            'grammar_highlight',
            t
          ));
          count++;
        }
      }
    }

    // Argument elements
    if (skill.elements && skill.skill.includes('argument')) {
      while (count < targetCount) {
        for (const el of skill.elements) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What argument element is this? "${el.example}"`,
            el.element,
            'paragraph_structure',
            el
          ));
          count++;
        }
      }
    }

    // Transitions
    if (skill.transitions && typeof skill.transitions === 'object') {
      while (count < targetCount) {
        for (const [category, words] of Object.entries(skill.transitions)) {
          for (const word of words) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `"${word}" is a ___ transition`,
              category.replace('_', '/'),
              'grammar_highlight',
              { word, category }
            ));
            count++;
          }
        }
      }
    }

    // Phrase types
    if (skill.types && skill.skill.includes('phrases')) {
      while (count < targetCount) {
        for (const t of skill.types) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `What type of phrase/clause is "${t.example}"?`,
            t.type,
            'grammar_highlight',
            t
          ));
          count++;
        }
      }
    }

    // Concise revisions
    if (skill.revisions) {
      while (count < targetCount) {
        for (const r of skill.revisions) {
          if (count >= targetCount) break;
          items.push(createItem(template, skill,
            `Make concise: "${r.wordy}"`,
            r.concise,
            'grammar_highlight',
            r
          ));
          count++;
        }
      }
    }

    // Precise vocabulary replacements
    if (skill.replacements) {
      while (count < targetCount) {
        for (const r of skill.replacements) {
          for (const precise of r.precise) {
            if (count >= targetCount) break;
            items.push(createItem(template, skill,
              `Replace "${r.vague}" with a more precise word`,
              precise,
              'grammar_highlight',
              { vague: r.vague, precise: r.precise }
            ));
            count++;
          }
        }
      }
    }

    if (count === 0) {
      console.log(`  Warning: No items generated for skill "${skill.skill}" - may need handler`);
    }
  }

  return items;
}

async function uploadBatch(items, batchNum, total) {
  const { error } = await supabase.from('practice_problems').upsert(items, { onConflict: 'id' });
  if (error) {
    console.log(`Batch ${batchNum} error:`, error.message);
    return false;
  }
  console.log(`Batch ${batchNum}: Uploaded ${items.length} items (${Math.min(batchNum * 500, total)}/${total})`);
  return true;
}

async function generateGrade(grade) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`GENERATING GRADE ${grade === 0 ? 'K' : grade} WRITING`);
  console.log('='.repeat(50));

  const template = loadTemplate(grade);
  console.log(`Target: ${template.total_target} items`);
  console.log(`Skills: ${template.skills.length}`);

  const items = generateItems(template);
  console.log(`Generated: ${items.length} items`);

  // Upload in batches
  for (let i = 0; i < items.length; i += 500) {
    const batch = items.slice(i, i + 500);
    const batchNum = Math.floor(i / 500) + 1;
    await uploadBatch(batch, batchNum, items.length);
  }

  return items.length;
}

async function verify() {
  console.log('\n' + '='.repeat(50));
  console.log('VERIFICATION');
  console.log('='.repeat(50));

  const targets = { 0: 1000, 1: 1500, 2: 1500, 3: 2000, 4: 1500, 5: 1500, 6: 1500, 7: 1000 };
  let grandTotal = 0;

  for (let grade = 0; grade <= 7; grade++) {
    const { count } = await supabase
      .from('practice_problems')
      .select('*', { count: 'exact', head: true })
      .eq('subject', 'writing')
      .eq('grade', grade);

    const target = targets[grade];
    const pct = ((count / target) * 100).toFixed(1);
    const status = count >= target ? 'DONE' : 'SHORT ' + (target - count);
    console.log(`Grade ${grade === 0 ? 'K' : grade}: ${count} / ${target} (${pct}%) - ${status}`);
    grandTotal += count;
  }

  console.log('\n' + '-'.repeat(50));
  console.log(`TOTAL: ${grandTotal} / 11,500 (${((grandTotal / 11500) * 100).toFixed(1)}%)`);
  return grandTotal;
}

async function main() {
  console.log('WRITING CONTENT GENERATOR');
  console.log('Target: 11,500 items across grades K-7');
  console.log('Started:', new Date().toISOString());

  // Reset global counter
  globalIdCounter = 0;

  let totalGenerated = 0;

  for (let grade = 0; grade <= 7; grade++) {
    const count = await generateGrade(grade);
    totalGenerated += count;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`GENERATION COMPLETE: ${totalGenerated} items`);
  console.log('='.repeat(50));

  await verify();

  console.log('\nCompleted:', new Date().toISOString());
}

main().catch(console.error);
