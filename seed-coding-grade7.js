/**
 * Seed Coding Practice Problems - GRADE 7 ONLY
 * Target: ~1,000 problems for Grade 7
 * Skills: python dictionaries, file handling, error handling, modular code, project planning
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eczpdbkslqbduiesbqcm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Grade 7 Skills - Total 1,000 problems
const GRADE_7_SKILLS = [
  { skill: 'python dictionaries', code: 'DICT', count: 200 },
  { skill: 'file handling', code: 'FILE', count: 200 },
  { skill: 'error handling', code: 'ERRR', count: 200 },
  { skill: 'modular code', code: 'MODL', count: 200 },
  { skill: 'project planning', code: 'PLAN', count: 200 },
];

// Python dictionaries templates
const dictTemplates = [
  { code: 'person = {"name": "Emma", "age": 13}\nprint(person["name"])', output: 'Emma', concept: 'Access value by key' },
  { code: 'person = {"name": "Emma", "age": 13}\nprint(person["age"])', output: '13', concept: 'Keys can have different value types' },
  { code: 'scores = {"math": 95, "english": 88}\nscores["science"] = 92\nprint(scores)', output: "{'math': 95, 'english': 88, 'science': 92}", concept: 'Add new key-value pair' },
  { code: 'data = {"x": 10, "y": 20}\nprint(data.keys())', output: "dict_keys(['x', 'y'])", concept: '.keys() returns all keys' },
  { code: 'data = {"x": 10, "y": 20}\nprint(data.values())', output: 'dict_values([10, 20])', concept: '.values() returns all values' },
  { code: 'data = {"a": 1, "b": 2}\nprint(len(data))', output: '2', concept: 'len() counts key-value pairs' },
  { code: 'pet = {"name": "Max", "type": "dog"}\npet["name"] = "Buddy"\nprint(pet["name"])', output: 'Buddy', concept: 'Update existing value' },
  { code: 'info = {"city": "Phoenix"}\nprint("city" in info)', output: 'True', concept: '"in" checks if key exists' },
  { code: 'info = {"city": "Phoenix"}\nprint("state" in info)', output: 'False', concept: 'Key does not exist' },
  { code: 'grades = {"A": 90, "B": 80, "C": 70}\nfor key in grades:\n    print(key)', output: 'A\nB\nC', concept: 'Loop through keys' },
  { code: 'user = {"name": "Jo"}\nprint(user.get("name", "Unknown"))', output: 'Jo', concept: '.get() with default value' },
  { code: 'user = {}\nprint(user.get("name", "Unknown"))', output: 'Unknown', concept: '.get() returns default if missing' },
  { code: 'd = {"a": 1, "b": 2}\nd.pop("a")\nprint(d)', output: "{'b': 2}", concept: '.pop() removes a key' },
  { code: 'inventory = {"apples": 5, "oranges": 3}\ntotal = sum(inventory.values())\nprint(total)', output: '8', concept: 'Sum all values' },
];

// File handling templates
const fileTemplates = [
  { code: 'with open("test.txt", "w") as f:\n    f.write("Hello")', output: 'Creates file with "Hello"', concept: '"w" mode writes (creates/overwrites)' },
  { code: 'with open("test.txt", "r") as f:\n    content = f.read()\nprint(content)', output: 'Prints file contents', concept: '"r" mode reads the file' },
  { code: 'with open("test.txt", "a") as f:\n    f.write("More")', output: 'Adds "More" to end', concept: '"a" mode appends to file' },
  { code: 'with open("data.txt", "w") as f:\n    f.write("Line 1\\n")\n    f.write("Line 2\\n")', output: 'File with 2 lines', concept: '\\n creates new line' },
  { code: 'with open("data.txt", "r") as f:\n    lines = f.readlines()\nprint(len(lines))', output: 'Number of lines', concept: '.readlines() returns list of lines' },
  { code: 'with open("data.txt", "r") as f:\n    for line in f:\n        print(line.strip())', output: 'Prints each line', concept: 'Loop through file lines' },
  { code: 'import os\nprint(os.path.exists("test.txt"))', output: 'True or False', concept: 'Check if file exists' },
  { code: 'with open("nums.txt", "w") as f:\n    for i in range(5):\n        f.write(str(i) + "\\n")', output: 'File with 0,1,2,3,4', concept: 'Write numbers to file' },
  { code: 'with open("data.txt", "r") as f:\n    first_line = f.readline()\nprint(first_line)', output: 'First line only', concept: '.readline() reads one line' },
  { code: 'content = "Hello World"\nwith open("out.txt", "w") as f:\n    f.write(content)', output: 'Saves string to file', concept: 'Save variable to file' },
];

// Error handling templates
const errorTemplates = [
  { code: 'try:\n    x = int("abc")\nexcept ValueError:\n    print("Not a number!")', output: 'Not a number!', concept: 'ValueError for invalid conversion', why: '"abc" cannot become an integer' },
  { code: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")', output: 'Cannot divide by zero!', concept: 'ZeroDivisionError', why: 'Division by zero is undefined' },
  { code: 'try:\n    nums = [1, 2, 3]\n    print(nums[10])\nexcept IndexError:\n    print("Index out of range!")', output: 'Index out of range!', concept: 'IndexError for bad index', why: 'List only has indices 0, 1, 2' },
  { code: 'try:\n    d = {"a": 1}\n    print(d["b"])\nexcept KeyError:\n    print("Key not found!")', output: 'Key not found!', concept: 'KeyError for missing key', why: 'Key "b" does not exist' },
  { code: 'try:\n    x = int("5")\nexcept ValueError:\n    print("Error")\nelse:\n    print("Success!")', output: 'Success!', concept: 'else runs if no error', why: '"5" converts fine' },
  { code: 'try:\n    f = open("missing.txt")\nexcept FileNotFoundError:\n    print("File not found!")', output: 'File not found!', concept: 'FileNotFoundError', why: 'File does not exist' },
  { code: 'try:\n    x = 10 / 2\nexcept:\n    print("Error")\nfinally:\n    print("Done")', output: 'Done', concept: 'finally always runs', why: 'finally runs no matter what' },
  { code: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 0\n\nprint(safe_divide(10, 0))', output: '0', concept: 'Return default on error', why: 'Returns 0 instead of crashing' },
  { code: 'age = input("Age: ")  # user types "abc"\ntry:\n    age = int(age)\nexcept ValueError:\n    age = 0\nprint(age)', output: '0', concept: 'Handle bad user input', why: 'Invalid input gets default value' },
  { code: 'try:\n    nums = []\n    print(nums[0])\nexcept IndexError as e:\n    print(f"Error: {e}")', output: 'Error: list index out of range', concept: 'Capture error message', why: 'as e stores the error details' },
];

// Modular code templates
const modularTemplates = [
  { code: 'import random\nnum = random.randint(1, 10)\nprint(num)', output: 'Random 1-10', concept: 'import brings in a module' },
  { code: 'from math import sqrt\nprint(sqrt(16))', output: '4.0', concept: 'from...import gets specific function' },
  { code: 'import math\nprint(math.pi)', output: '3.141592653589793', concept: 'Access module constants' },
  { code: 'import datetime\ntoday = datetime.date.today()\nprint(today)', output: "Today's date", concept: 'datetime for dates/times' },
  { code: 'from random import choice\ncolors = ["red", "blue", "green"]\nprint(choice(colors))', output: 'Random color', concept: 'choice picks random item' },
  { code: 'import math\nprint(math.floor(4.7))', output: '4', concept: 'floor rounds down' },
  { code: 'import math\nprint(math.ceil(4.2))', output: '5', concept: 'ceil rounds up' },
  { code: 'import random\nnums = [1, 2, 3, 4, 5]\nrandom.shuffle(nums)\nprint(nums)', output: 'Shuffled list', concept: 'shuffle randomizes order' },
  { code: 'import string\nprint(string.ascii_lowercase)', output: 'abcdefghijklmnopqrstuvwxyz', concept: 'string module has useful constants' },
  { code: 'import os\nprint(os.getcwd())', output: 'Current directory path', concept: 'os for operating system tasks' },
  { code: 'from collections import Counter\nletters = ["a", "b", "a", "c", "a"]\nprint(Counter(letters))', output: "Counter({'a': 3, 'b': 1, 'c': 1})", concept: 'Counter counts occurrences' },
  { code: 'import json\ndata = {"name": "Emma"}\ntext = json.dumps(data)\nprint(text)', output: '{"name": "Emma"}', concept: 'json converts dict to string' },
];

// Project planning templates
const planningTemplates = [
  { q: 'What should you do FIRST when starting a coding project?', a: 'Understand the problem and plan your approach before writing code', concept: 'Planning before coding' },
  { q: 'What is pseudocode?', a: 'Writing out your logic in plain English before coding', concept: 'Plan in plain language first' },
  { q: 'Why break a big problem into smaller parts?', a: 'Smaller problems are easier to solve and test', concept: 'Decomposition' },
  { q: 'What are comments in code for?', a: 'To explain what your code does so others (and future you) can understand it', concept: 'Code documentation' },
  { q: 'Why use functions instead of repeating code?', a: 'Functions are reusable, easier to test, and make code cleaner', concept: 'DRY - Don\'t Repeat Yourself' },
  { q: 'What is debugging?', a: 'Finding and fixing errors (bugs) in your code', concept: 'Testing and fixing' },
  { q: 'How do you find a bug in your code?', a: 'Add print statements, check line by line, test with simple inputs', concept: 'Debugging strategies' },
  { q: 'What is a variable naming best practice?', a: 'Use descriptive names like "student_count" not "x" or "sc"', concept: 'Readable variable names' },
  { q: 'Why test your code with different inputs?', a: 'To make sure it works in all cases, not just the one you tried', concept: 'Test edge cases' },
  { q: 'What is version control (like Git)?', a: 'A way to save different versions of your code and collaborate with others', concept: 'Code versioning' },
  { q: 'What does MVP mean in project planning?', a: 'Minimum Viable Product - the simplest version that works', concept: 'Start simple, then add features' },
  { q: 'Why write tests for your code?', a: 'To automatically check that your code works correctly', concept: 'Automated testing' },
  { q: 'What is refactoring?', a: 'Improving code structure without changing what it does', concept: 'Code improvement' },
  { q: 'How should you handle user input?', a: 'Always validate it - users might enter unexpected values', concept: 'Input validation' },
  { q: 'What makes code "readable"?', a: 'Good names, consistent style, comments, and logical structure', concept: 'Code readability' },
];

// Generate problems
function generateGrade7Problems() {
  const problems = [];
  let idCounter = { DICT: 1, FILE: 1, ERRR: 1, MODL: 1, PLAN: 1 };

  // Python dictionaries - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = dictTemplates[i % dictTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G7-DICT-${String(idCounter.DICT++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhat concept does this demonstrate?`;
      answer = template.concept;
    } else {
      question = `${template.code}\n\nExplain why the output is: ${template.output}`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 7,
      skill: 'python dictionaries',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'Dictionaries store key-value pairs. Access values with dict["key"]. Keys must be unique.' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-15',
      source_file: 'coding-templates-G7.json',
    });
  }

  // File handling - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = fileTemplates[i % fileTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G7-FILE-${String(idCounter.FILE++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What does this code do?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhat mode is being used and what does it do?`;
      answer = template.concept;
    } else {
      question = `Explain the file operation:\n\n${template.code}`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 7,
      skill: 'file handling',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'Use "with open()" for files. "r"=read, "w"=write, "a"=append. Always close files!' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-15',
      source_file: 'coding-templates-G7.json',
    });
  }

  // Error handling - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = errorTemplates[i % errorTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G7-ERRR-${String(idCounter.ERRR++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What is the output?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhy does this error occur?`;
      answer = template.why;
    } else {
      question = `${template.code}\n\nWhat type of error is being caught?`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 7,
      skill: 'error handling',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'try/except catches errors so your program doesn\'t crash. Handle specific error types!' },
      tier2: { teach: template.concept },
      explanation: `${template.concept}. ${template.why}`,
      standard: '1B-AP-15',
      source_file: 'coding-templates-G7.json',
    });
  }

  // Modular code - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = modularTemplates[i % modularTemplates.length];
    const questionType = i % 3;
    const id = `CODE-G7-MODL-${String(idCounter.MODL++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = `What does this code produce?\n\n${template.code}`;
      answer = template.output;
    } else if (questionType === 1) {
      question = `${template.code}\n\nWhat module is being used and why?`;
      answer = template.concept;
    } else {
      question = `What is the purpose of this import?\n\n${template.code.split('\n')[0]}`;
      answer = template.concept;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 7,
      skill: 'modular code',
      question,
      answer,
      visual_type: 'code_block',
      visual_data: { language: 'python', code: template.code, output: template.output },
      tier1: { teach: 'Modules are pre-built code libraries. import brings them in. Use from...import for specific items.' },
      tier2: { teach: template.concept },
      explanation: template.concept,
      standard: '1B-AP-15',
      source_file: 'coding-templates-G7.json',
    });
  }

  // Project planning - 200 problems
  for (let i = 0; i < 200; i++) {
    const template = planningTemplates[i % planningTemplates.length];
    const questionType = i % 2;
    const id = `CODE-G7-PLAN-${String(idCounter.PLAN++).padStart(4, '0')}`;

    let question, answer;

    if (questionType === 0) {
      question = template.q;
      answer = template.a;
    } else {
      question = `Concept: ${template.concept}\n\nExplain what this means for coding projects.`;
      answer = template.a;
    }

    problems.push({
      id,
      subject: 'coding',
      grade: 7,
      skill: 'project planning',
      question,
      answer,
      visual_type: 'output',
      visual_data: { concept: template.concept },
      tier1: { teach: 'Good programmers plan before coding, break problems into parts, and test their work!' },
      tier2: { teach: template.concept },
      explanation: template.a,
      standard: '1B-AP-15',
      source_file: 'coding-templates-G7.json',
    });
  }

  return problems;
}

// Main seeding function
async function seedGrade7() {
  console.log('===========================================');
  console.log('SEEDING GRADE 7 CODING PROBLEMS');
  console.log('===========================================\n');

  const problems = generateGrade7Problems();
  console.log(`Generated ${problems.length} problems for Grade 7\n`);

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
  console.log(`COMPLETE: Inserted ${inserted} Grade 7 problems`);
  console.log('===========================================');
}

seedGrade7().catch(console.error);
