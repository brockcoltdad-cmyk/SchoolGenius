import fs from 'fs';
import path from 'path';

// Files to fix
const files = [
  'app/contact/page.tsx',
  'app/coppa-compliance/page.tsx',
  'app/dashboard/add-child/page.tsx',
  'app/dashboard/child/[id]/voice-clone/page.tsx',
  'app/dashboard/children/[childId]/settings/page.tsx',
  'app/dashboard/data/[childId]/page.tsx',
  'app/dashboard/data/page.tsx',
  'app/dashboard/documents/[childId]/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/syllabus/[childId]/page.tsx',
  'app/data-request/page.tsx',
  'app/help/page.tsx',
  'app/kid/[id]/[subject]/page.tsx',
  'app/kid/[id]/documents/page.tsx',
  'app/kid/[id]/games/spelling-bee/page.tsx',
  'app/kid/[id]/games/word-scramble/page.tsx',
  'app/kid/[id]/lesson/[skillId]/page.tsx',
  'app/kid/[id]/page.tsx',
  'app/kid/[id]/placement-test/page.tsx',
  'app/kid/[id]/reading/page.tsx',
  'app/kid/[id]/reading/quiz/[storyId]/page.tsx',
  'app/kid/[id]/scan/page.tsx',
  'app/kid/[id]/stories/[storyId]/page.tsx',
  'app/kid/[id]/syllabus/page.tsx',
  'app/kid/[id]/weekly-test/page.tsx',
  'app/login/kid/page.tsx',
  'app/login/page.tsx',
  'app/page.tsx',
  'app/privacy-policy/page.tsx',
  'app/safety/page.tsx',
  'app/signup/page.tsx',
  'app/signup/teen/page.tsx',
  'app/test-themes/page.tsx',
  'components/ComprehensiveLessonViewer.tsx',
  'components/GigiLiveChat.tsx',
  'components/lesson/CodingLessonPlayer.tsx',
  'components/lesson/MathLessonPlayer.tsx',
  'components/lesson/ReadingLessonPlayer.tsx',
  'components/lesson/SpellingLessonPlayer.tsx',
  'components/lesson/VisualLessonPlayer.tsx',
  'components/lesson/visuals/NumberLineVisual.tsx',
  'components/LessonViewer.tsx',
  'components/LiveGigi.tsx',
  'components/parent/ScannedSyllabusViewer.tsx',
  'components/parent/SimpleSyllabusEditor.tsx',
  'components/parent/ThemeManagement.tsx',
  'components/QuizComponent.tsx',
  'components/StoryReader.tsx',
  'components/SubjectIntro.tsx',
  'components/SubjectPage.tsx',
  'components/theme/DashboardTemplate.tsx',
  'components/VoiceCloneRecorder.tsx',
  'lib/auth-context.tsx'
];

let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.log(`Skip: ${file} (not found)`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Fix unescaped quotes in JSX text content
  // Match text between > and < that contains ' or "
  // Be careful not to replace quotes in JS strings or attributes

  // Strategy: Find JSX text nodes and escape quotes there
  // JSX text is between >text< where text isn't inside {} or quotes

  let fixCount = 0;

  // Replace ' with &apos; in JSX text (between > and <, not in attributes or JS)
  // This regex looks for >...text with '...< patterns
  content = content.replace(/>([^<]*)'([^<]*)</g, (match, before, after) => {
    // Don't replace if it looks like it's in a JS expression (has { before it on same segment)
    if (before.includes('{') || after.includes('}')) return match;
    fixCount++;
    return `>${before}&apos;${after}<`;
  });

  // Handle multiple quotes in same text node
  content = content.replace(/>([^<]*)'([^<]*)</g, (match, before, after) => {
    if (before.includes('{') || after.includes('}')) return match;
    fixCount++;
    return `>${before}&apos;${after}<`;
  });

  // Third pass for any remaining
  content = content.replace(/>([^<]*)'([^<]*)</g, (match, before, after) => {
    if (before.includes('{') || after.includes('}')) return match;
    fixCount++;
    return `>${before}&apos;${after}<`;
  });

  // Fix unescaped " in JSX text
  content = content.replace(/>([^<]*)"([^<]*)"([^<]*)</g, (match, before, q1, after) => {
    if (before.includes('{') || after.includes('}')) return match;
    fixCount += 2;
    return `>${before}&quot;${q1}&quot;${after}<`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file} (${fixCount} replacements)`);
    totalFixed += fixCount;
  }
}

console.log(`\nTotal fixes: ${totalFixed}`);
