import fs from 'fs';
import path from 'path';

// Get all files with unescaped quote errors from eslint output
const filesToFix = [
  'app/contact/page.tsx',
  'app/coppa-compliance/page.tsx',
  'app/dashboard/add-child/page.tsx',
  'app/dashboard/child/[id]/voice-clone/page.tsx',
  'app/dashboard/children/[childId]/settings/page.tsx',
  'app/dashboard/data/page.tsx',
  'app/dashboard/data/[childId]/page.tsx',
  'app/dashboard/documents/[childId]/page.tsx',
  'app/dashboard/page.tsx',
  'app/dashboard/syllabus/[childId]/page.tsx',
  'app/data-request/page.tsx',
  'app/help/page.tsx',
  'app/kid/[id]/games/spelling-bee/page.tsx',
  'app/kid/[id]/games/word-scramble/page.tsx',
  'app/kid/[id]/lesson/[skillId]/page.tsx',
  'app/kid/[id]/page.tsx',
  'app/kid/[id]/placement-test/page.tsx',
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
  'components/LessonViewer.tsx',
  'components/parent/SimpleSyllabusEditor.tsx',
  'components/parent/ThemeManagement.tsx',
  'components/QuizComponent.tsx',
  'components/StoryReader.tsx',
  'components/SubjectIntro.tsx',
  'components/SubjectPage.tsx',
  'components/theme/DashboardTemplate.tsx',
  'components/VoiceCloneRecorder.tsx'
];

// Common contractions and possessives that appear in JSX text
const replacements = [
  // Contractions
  [/(\s)don't(\s|[,.<])/g, "$1don&apos;t$2"],
  [/(\s)doesn't(\s|[,.<])/g, "$1doesn&apos;t$2"],
  [/(\s)won't(\s|[,.<])/g, "$1won&apos;t$2"],
  [/(\s)can't(\s|[,.<])/g, "$1can&apos;t$2"],
  [/(\s)shouldn't(\s|[,.<])/g, "$1shouldn&apos;t$2"],
  [/(\s)wouldn't(\s|[,.<])/g, "$1wouldn&apos;t$2"],
  [/(\s)couldn't(\s|[,.<])/g, "$1couldn&apos;t$2"],
  [/(\s)isn't(\s|[,.<])/g, "$1isn&apos;t$2"],
  [/(\s)aren't(\s|[,.<])/g, "$1aren&apos;t$2"],
  [/(\s)wasn't(\s|[,.<])/g, "$1wasn&apos;t$2"],
  [/(\s)weren't(\s|[,.<])/g, "$1weren&apos;t$2"],
  [/(\s)haven't(\s|[,.<])/g, "$1haven&apos;t$2"],
  [/(\s)hasn't(\s|[,.<])/g, "$1hasn&apos;t$2"],
  [/(\s)hadn't(\s|[,.<])/g, "$1hadn&apos;t$2"],
  [/(\s)didn't(\s|[,.<])/g, "$1didn&apos;t$2"],
  [/(\s)let's(\s|[,.<])/g, "$1let&apos;s$2"],
  [/(\s)Let's(\s|[,.<])/g, "$1Let&apos;s$2"],
  [/(\s)it's(\s|[,.<])/g, "$1it&apos;s$2"],
  [/(\s)It's(\s|[,.<])/g, "$1It&apos;s$2"],
  [/(\s)that's(\s|[,.<])/g, "$1that&apos;s$2"],
  [/(\s)That's(\s|[,.<])/g, "$1That&apos;s$2"],
  [/(\s)what's(\s|[,.<])/g, "$1what&apos;s$2"],
  [/(\s)What's(\s|[,.<])/g, "$1What&apos;s$2"],
  [/(\s)there's(\s|[,.<])/g, "$1there&apos;s$2"],
  [/(\s)There's(\s|[,.<])/g, "$1There&apos;s$2"],
  [/(\s)here's(\s|[,.<])/g, "$1here&apos;s$2"],
  [/(\s)Here's(\s|[,.<])/g, "$1Here&apos;s$2"],
  [/(\s)we'll(\s|[,.<])/g, "$1we&apos;ll$2"],
  [/(\s)We'll(\s|[,.<])/g, "$1We&apos;ll$2"],
  [/(\s)you'll(\s|[,.<])/g, "$1you&apos;ll$2"],
  [/(\s)You'll(\s|[,.<])/g, "$1You&apos;ll$2"],
  [/(\s)they'll(\s|[,.<])/g, "$1they&apos;ll$2"],
  [/(\s)I'll(\s|[,.<])/g, "$1I&apos;ll$2"],
  [/(\s)I'm(\s|[,.<])/g, "$1I&apos;m$2"],
  [/(\s)you're(\s|[,.<])/g, "$1you&apos;re$2"],
  [/(\s)You're(\s|[,.<])/g, "$1You&apos;re$2"],
  [/(\s)we're(\s|[,.<])/g, "$1we&apos;re$2"],
  [/(\s)We're(\s|[,.<])/g, "$1We&apos;re$2"],
  [/(\s)they're(\s|[,.<])/g, "$1they&apos;re$2"],
  [/(\s)I've(\s|[,.<])/g, "$1I&apos;ve$2"],
  [/(\s)you've(\s|[,.<])/g, "$1you&apos;ve$2"],
  [/(\s)we've(\s|[,.<])/g, "$1we&apos;ve$2"],
  [/(\s)they've(\s|[,.<])/g, "$1they&apos;ve$2"],
  [/(\s)you'd(\s|[,.<])/g, "$1you&apos;d$2"],
  [/(\s)he'd(\s|[,.<])/g, "$1he&apos;d$2"],
  [/(\s)she'd(\s|[,.<])/g, "$1she&apos;d$2"],
  [/(\s)we'd(\s|[,.<])/g, "$1we&apos;d$2"],
  [/(\s)they'd(\s|[,.<])/g, "$1they&apos;d$2"],
  [/(\s)who's(\s|[,.<])/g, "$1who&apos;s$2"],
  [/(\s)Who's(\s|[,.<])/g, "$1Who&apos;s$2"],

  // Possessives - common ones
  [/child's(\s|[,.<])/g, "child&apos;s$1"],
  [/Child's(\s|[,.<])/g, "Child&apos;s$1"],
  [/children's(\s|[,.<])/g, "children&apos;s$1"],
  [/Children's(\s|[,.<])/g, "Children&apos;s$1"],
  [/parent's(\s|[,.<])/g, "parent&apos;s$1"],
  [/Parent's(\s|[,.<])/g, "Parent&apos;s$1"],
  [/user's(\s|[,.<])/g, "user&apos;s$1"],
  [/User's(\s|[,.<])/g, "User&apos;s$1"],
  [/student's(\s|[,.<])/g, "student&apos;s$1"],
  [/Student's(\s|[,.<])/g, "Student&apos;s$1"],
  [/today's(\s|[,.<])/g, "today&apos;s$1"],
  [/Today's(\s|[,.<])/g, "Today&apos;s$1"],
  [/kid's(\s|[,.<])/g, "kid&apos;s$1"],
  [/Kid's(\s|[,.<])/g, "Kid&apos;s$1"],
  [/Gigi's(\s|[,.<])/g, "Gigi&apos;s$1"],
  [/account's(\s|[,.<])/g, "account&apos;s$1"],
  [/app's(\s|[,.<])/g, "app&apos;s$1"],

  // Start of line/text versions
  [/>don't(\s)/g, ">don&apos;t$1"],
  [/>Don't(\s)/g, ">Don&apos;t$1"],
  [/>doesn't(\s)/g, ">doesn&apos;t$1"],
  [/>Doesn't(\s)/g, ">Doesn&apos;t$1"],
  [/>can't(\s)/g, ">can&apos;t$1"],
  [/>Can't(\s)/g, ">Can&apos;t$1"],
  [/>won't(\s)/g, ">won&apos;t$1"],
  [/>Won't(\s)/g, ">Won&apos;t$1"],
  [/>it's(\s)/g, ">it&apos;s$1"],
  [/>It's(\s)/g, ">It&apos;s$1"],
  [/>let's(\s)/g, ">let&apos;s$1"],
  [/>Let's(\s)/g, ">Let&apos;s$1"],
  [/>we're(\s)/g, ">we&apos;re$1"],
  [/>We're(\s)/g, ">We&apos;re$1"],
  [/>you're(\s)/g, ">you&apos;re$1"],
  [/>You're(\s)/g, ">You&apos;re$1"],
  [/>I'm(\s)/g, ">I&apos;m$1"],
  [/>I'll(\s)/g, ">I&apos;ll$1"],
  [/>that's(\s)/g, ">that&apos;s$1"],
  [/>That's(\s)/g, ">That&apos;s$1"],
  [/>what's(\s)/g, ">what&apos;s$1"],
  [/>What's(\s)/g, ">What&apos;s$1"],
  [/>here's(\s)/g, ">here&apos;s$1"],
  [/>Here's(\s)/g, ">Here&apos;s$1"],
  [/>there's(\s)/g, ">there&apos;s$1"],
  [/>There's(\s)/g, ">There&apos;s$1"],
  [/>We'll(\s)/g, ">We&apos;ll$1"],
  [/>we'll(\s)/g, ">we&apos;ll$1"],
  [/>You'll(\s)/g, ">You&apos;ll$1"],

  // Double quotes in text
  [/"([^"]+)"/g, '&quot;$1&quot;'], // Only if between > and <
];

let totalFixed = 0;
let totalFiles = 0;

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    totalFiles++;
    const changes = (original.match(/'/g) || []).length - (content.match(/'/g) || []).length;
    totalFixed += Math.abs(changes);
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nFixed ${totalFiles} files`);
