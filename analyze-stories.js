const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient('https://eczpdbkslqbduiesbqcm.supabase.co', serviceKey);

async function analyzeStories() {
  const { data, error } = await supabase.from('stories').select('id, title, comprehension_questions, grade_level, genre');

  if (error) {
    console.log('Error:', error.message);
    return;
  }

  let withQuestions = 0;
  let withoutQuestions = 0;
  let totalQuestions = 0;
  const gradeBreakdown = {};
  const genreBreakdown = {};

  data.forEach(story => {
    const hasQ = story.comprehension_questions && story.comprehension_questions.length > 0;
    if (hasQ) {
      withQuestions++;
      totalQuestions += story.comprehension_questions.length;
    } else {
      withoutQuestions++;
    }

    // Grade breakdown
    const grade = story.grade_level || 'unknown';
    if (gradeBreakdown[grade] === undefined) gradeBreakdown[grade] = { with: 0, without: 0 };
    gradeBreakdown[grade][hasQ ? 'with' : 'without']++;

    // Genre breakdown
    const genre = story.genre || 'unknown';
    if (genreBreakdown[genre] === undefined) genreBreakdown[genre] = 0;
    genreBreakdown[genre]++;
  });

  console.log('=== Story Questions Analysis ===\n');
  console.log('Total Stories: ' + data.length);
  console.log('With Questions: ' + withQuestions + ' (' + Math.round(withQuestions/data.length*100) + '%)');
  console.log('Without Questions: ' + withoutQuestions + ' (' + Math.round(withoutQuestions/data.length*100) + '%)');
  console.log('Total Questions: ' + totalQuestions);
  if (withQuestions > 0) {
    console.log('Avg Questions/Story: ' + (totalQuestions/withQuestions).toFixed(1));
  }

  console.log('\n=== By Grade Level ===');
  Object.entries(gradeBreakdown).sort((a,b) => a[0] - b[0]).forEach(([grade, counts]) => {
    console.log('Grade ' + grade + ': ' + counts.with + ' with, ' + counts.without + ' without');
  });

  console.log('\n=== By Genre (top 10) ===');
  Object.entries(genreBreakdown).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([genre, count]) => {
    console.log(genre + ': ' + count);
  });

  // Gap analysis
  console.log('\n=== GAP ANALYSIS ===');
  const targetStoriesPerGrade = 100;
  const targetGrades = [1, 2, 3, 4, 5, 6, 7, 8];

  targetGrades.forEach(grade => {
    const current = gradeBreakdown[grade] ? gradeBreakdown[grade].with : 0;
    const gap = targetStoriesPerGrade - current;
    console.log('Grade ' + grade + ': ' + current + '/' + targetStoriesPerGrade + ' (need ' + Math.max(0, gap) + ' more)');
  });
}

analyzeStories();
