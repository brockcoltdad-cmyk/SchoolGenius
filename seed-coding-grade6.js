/**
 * Seed Coding Practice Problems - GRADE 6 ONLY
 * Target: ~1,500 problems for Grade 6
 * Skills: python variables, python conditionals, python loops, python functions, python lists
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 6 Skills - Total 1,500 problems
const GRADE_6_SKILLS = [
  { skill: 'python variables', code: 'PVAR', count: 300 },
  { skill: 'python conditionals', code: 'PCND', count: 300 },
  { skill: 'python loops', code: 'PLOP', count: 300 },
  { skill: 'python functions', code: 'PFNC', count: 300 },
  { skill: 'python lists', code: 'PLST', count: 300 },
];

// Python variables templates
const variableTemplates = [
  { code: 'x = 10\nprint(x)', output: '10', concept: 'Variable stores a value' },
  { code: 'x = 5\ny = 3\nprint(x + y)', output: '8', concept: 'Variables can be added' },
  { code: 'x = 10\ny = 4\nprint(x - y)', output: '6', concept: 'Variables can be subtracted' },
  { code: 'x = 6\ny = 7\nprint(x * y)', output: '42', concept: 'Variables can be multiplied' },
  { code: 'x = 20\ny = 4\nprint(x / y)', output: '5.0', concept: 'Division gives a decimal' },
  { code: 'name = "Emma"\nprint(name)', output: 'Emma', concept: 'Variables can store text (strings)' },
  { code: 'name = "Python"\nprint(len(name))', output: '6', concept: 'len() counts characters' },
  { code: 'a = "Hello"\nb = "World"\nprint(a + " " + b)', output: 'Hello World', concept: '+ joins strings' },
  { code: 'x = 10\nx = x + 5\nprint(x)', output: '15', concept: 'Variables can be updated' },
  { code: 'x = 10\nx += 5\nprint(x)', output: '15', concept: '+= is shorthand for x = x + 5' },
  { code: 'count = 0\ncount += 1\ncount += 1\nprint(count)', output: '2', concept: 'Counting up by 1' },
  { code: 'price = 10.50\ntax = 1.05\nprint(price * tax)', output: '11.025', concept: 'Decimals work too' },
  { code: 'x = 17\nprint(x % 5)', output: '2', concept: '% gives remainder (17÷5 = 3 R2)' },
  { code: 'x = 17\nprint(x // 5)', output: '3', concept: '// gives integer division' },
  { code: 'first = "Ada"\nlast = "Lovelace"\nfull = first + " " + last\nprint(full)', output: 'Ada Lovelace', concept: 'Building strings from parts' },
];

// Python conditionals templates
const conditionalTemplates = [
  { code: 'x = 10\nif x > 5:\n    print("Big")', output: 'Big', concept: 'if runs when condition is True' },
  { code: 'x = 3\nif x > 5:\n    print("Big")', output: '(nothing)', concept: 'if skips when condition is False' },
  { code: 'score = 85\nif score >= 70:\n    print("Pass")\nelse:\n    print("Fail")', output: 'Pass', concept: 'else runs when if is False' },
  { code: 'score = 50\nif score >= 70:\n    print("Pass")\nelse:\n    print("Fail")', output: 'Fail', concept: 'else catches the False case' },
  { code: 'age = 15\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teen")\nelse:\n    print("Child")', output: 'Teen', concept: 'elif checks another condition' },
  { code: 'age = 8\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teen")\nelse:\n    print("Child")', output: 'Child', concept: 'else is the final fallback' },
  { code: 'x = 10\nif x > 5 and x < 15:\n    print("In range")', output: 'In range', concept: 'and needs both True' },
  { code: 'x = 3\nif x < 5 or x > 10:\n    print("Outside")', output: 'Outside', concept: 'or needs at least one True' },
  { code: 'x = 7\nif not x == 5:\n    print("Not five")', output: 'Not five', concept: 'not flips True/False' },
  { code: 'name = "Emma"\nif name == "Emma":\n    print("Hello Emma!")', output: 'Hello Emma!', concept: '== checks equality for strings' },
  { code: 'password = "secret"\nif password != "wrong":\n    print("Access granted")', output: 'Access granted', concept: '!= means not equal' },
  { code: 'num = 4\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")', output: 'Even', concept: 'Check even with % 2 == 0' },
];

// Python loops templates
const loopTemplates = [
  { code: 'for i in range(3):\n    print(i)', output: '0\n1\n2', concept: 'range(3) gives 0, 1, 2' },
  { code: 'for i in range(5):\n    print(i)', output: '0\n1\n2\n3\n4', concept: 'range(5) gives 0 to 4' },
  { code: 'for i in range(1, 4):\n    print(i)', output: '1\n2\n3', concept: 'range(1,4) starts at 1' },
  { code: 'for i in range(2, 10, 2):\n    print(i)', output: '2\n4\n6\n8', concept: 'Third number is step size' },
  { code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)', output: '10', concept: '1+2+3+4 = 10' },
  { code: 'for letter in "Hi":\n    print(letter)', output: 'H\ni', concept: 'Loop through string characters' },
  { code: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1', output: '0\n1\n2', concept: 'while loops until False' },
  { code: 'x = 10\nwhile x > 0:\n    print(x)\n    x -= 3', output: '10\n7\n4\n1', concept: 'Counting down by 3' },
  { code: 'for i in range(3):\n    print("*" * (i+1))', output: '*\n**\n***', concept: 'String * number repeats it' },
  { code: 'nums = [1, 2, 3]\nfor n in nums:\n    print(n * 2)', output: '2\n4\n6', concept: 'Loop through a list' },
  { code: 'for i in range(5, 0, -1):\n    print(i)', output: '5\n4\n3\n2\n1', concept: 'Negative step counts down' },
  { code: 'word = "code"\nfor i, letter in enumerate(word):\n    print(i, letter)', output: '0 c\n1 o\n2 d\n3 e', concept: 'enumerate gives index and value' },
];

// Python functions templates
const functionTemplates = [
  { code: 'def greet():\n    print("Hello!")\n\ngreet()', output: 'Hello!', concept: 'def creates a function' },
  { code: 'def greet(name):\n    print("Hello " + name)\n\ngreet("Emma")', output: 'Hello Emma', concept: 'Functions can take parameters' },
  { code: 'def add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)', output: '8', concept: 'return sends back a value' },
  { code: 'def double(x):\n    return x * 2\n\nprint(double(7))', output: '14', concept: 'Function returns doubled value' },
  { code: 'def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(4))', output: 'True', concept: 'Functions can return True/False' },
  { code: 'def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(7))', output: 'False', concept: '7 is odd, so False' },
  { code: 'def square(x):\n    return x * x\n\nprint(square(5))', output: '25', concept: '5 * 5 = 25' },
  { code: 'def max_of_two(a, b):\n    if a > b:\n        return a\n    else:\n        return b\n\nprint(max_of_two(3, 7))', output: '7', concept: 'Function finds larger number' },
  { code: 'def say_hi(name, times):\n    for i in range(times):\n        print("Hi " + name)\n\nsay_hi("Joe", 2)', output: 'Hi Joe\nHi Joe', concept: 'Multiple parameters' },
  { code: 'def countdown(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    print("Go!")\n\ncountdown(3)', output: '3\n2\n1\nGo!', concept: 'Function with loop inside' },
  { code: 'def add_exclaim(text):\n    return text + "!"\n\nprint(add_exclaim("Hello"))', output: 'Hello!', concept: 'String manipulation function' },
  { code: 'def area(width, height):\n    return width * height\n\nprint(area(4, 5))', output: '20', concept: 'Calculate rectangle area' },
];

// Python lists templates
const listTemplates = [
  { code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])', output: 'apple', concept: 'Index 0 is first item' },
  { code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[1])', output: 'banana', concept: 'Index 1 is second item' },
  { code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[-1])', output: 'cherry', concept: '-1 is last item' },
  { code: 'nums = [1, 2, 3]\nnums.append(4)\nprint(nums)', output: '[1, 2, 3, 4]', concept: 'append() adds to end' },
  { code: 'nums = [1, 2, 3, 4, 5]\nprint(len(nums))', output: '5', concept: 'len() counts items' },
  { code: 'nums = [10, 20, 30]\nprint(sum(nums))', output: '60', concept: 'sum() adds all numbers' },
  { code: 'nums = [5, 2, 8, 1]\nprint(max(nums))', output: '8', concept: 'max() finds largest' },
  { code: 'nums = [5, 2, 8, 1]\nprint(min(nums))', output: '1', concept: 'min() finds smallest' },
  { code: 'nums = [3, 1, 4, 1, 5]\nnums.sort()\nprint(nums)', output: '[1, 1, 3, 4, 5]', concept: 'sort() orders the list' },
  { code: 'letters = ["a", "b", "c"]\nprint("b" in letters)', output: 'True', concept: '"in" checks if item exists' },
  { code: 'letters = ["a", "b", "c"]\nprint("x" in letters)', output: 'False', concept: 'x is not in the list' },
  { code: 'nums = [1, 2, 3]\nnums[0] = 99\nprint(nums)', output: '[99, 2, 3]', concept: 'Change item by index' },
  { code: 'nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])', output: '[2, 3, 4]', concept: 'Slice from index 1 to 3' },
  { code: 'a = [1, 2]\nb = [3, 4]\nprint(a + b)', output: '[1, 2, 3, 4]', concept: '+ combines lists' },
  { code: 'nums = [1, 2, 3]\nnums.remove(2)\nprint(nums)', output: '[1, 3]', concept: 'remove() deletes by value' },
];

// Generate problems
function generateGrade6Problems() {
  const problems = [];
  let idCounter = { PVAR: 1, PCND: 1, PLOP: 1, PFNC: 1, PLST: 1 };

  // Python variables - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = variableTemplates[i % variableTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G6-PVAR-${String(idCounter.PVAR++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nOutput: ${template.output}\n\nWhat concept does this show?`;
      answer = template.concept;
    } else {
      question = `${template.code}\n\nExplain why the output is ${template.output}`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 6,
      skill: 'python variables',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'Variables store data. Use = to assign. Numbers do math, strings use + to join.' },
      tier2: { teach: template.concept },
      explanation: `${template.code} → ${template.output}. ${template.concept}`,
      standard: '1B-AP-13',
      source_file: 'coding-templates-G6.json',
    });
  }

  // Python conditionals - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = conditionalTemplates[i % conditionalTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G6-PCND-${String(idCounter.PCND++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhy is the output "${template.output}"?`;
      answer = template.concept;
    } else {
      question = `Explain how if/elif/else works in:\n\n${template.code}`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 6,
      skill: 'python conditionals',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'if checks a condition. elif checks another. else is the fallback. Indentation matters!' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-13',
      source_file: 'coding-templates-G6.json',
    });
  }

  // Python loops - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = loopTemplates[i % loopTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G6-PLOP-${String(idCounter.PLOP++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nHow many times does the loop run?`;
      answer = String(template.output.split('\n').length);
    } else {
      question = `${template.code}\n\nExplain how this loop works.`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 6,
      skill: 'python loops',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'for loops repeat a set number of times. while loops repeat until condition is False.' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-13',
      source_file: 'coding-templates-G6.json',
    });
  }

  // Python functions - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = functionTemplates[i % functionTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G6-PFNC-${String(idCounter.PFNC++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhat does the function do?`;
      answer = template.concept;
    } else {
      question = `${template.code}\n\nWhat does "return" do in this function?`;
      answer = 'return sends a value back to where the function was called';
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 6,
      skill: 'python functions',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'def creates a function. Parameters go in (). return sends back a value.' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-13',
      source_file: 'coding-templates-G6.json',
    });
  }

  // Python lists - 300 problems
  for (let i = 0; i < 300; i++) {
    const template = listTemplates[i % listTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G6-PLST-${String(idCounter.PLST++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhat list operation is being used?`;
      answer = template.concept;
    } else {
      question = `${template.code}\n\nExplain the result.`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 6,
      skill: 'python lists',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'Lists hold multiple items. Index starts at 0. append() adds, remove() deletes.' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-13',
      source_file: 'coding-templates-G6.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade6() {
  console.log('===========================================');
  console.log('SEEDING GRADE 6 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade6Problems();
  console.log(`Generated ${problems.length} problems for Grade 6\n`);

  const skillCounts = {};
  problems.forEach(p => {
    skillCounts[p.skill] = (skillCounts[p.skill] || 0) + 1;
  });
  console.log('Breakdown by skill:');
  Object.entries(skillCounts).forEach(([skill, count]) => {
    console.log(`  ${skill}: ${count}`);
  });
  console.log('');

  const batchSize = 200;
  let inserted = 0;

  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);

    const { error } = await supabase
      .from('practice_problems')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(problems.length / batchSize)} (${batch.length} problems)`);
    }
  }

  console.log('\n===========================================');
  console.log(`COMPLETE: Inserted ${inserted} Grade 6 problems`);
  console.log('===========================================');
}

seedGrade6().catch(console.error);
