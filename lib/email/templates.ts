// Email templates - plain text with variable substitution
// No AI generation, just fill-in-the-blanks

interface WeeklySummaryData {
  parentName: string
  childName: string
  totalProblems: number
  correctCount: number
  accuracy: number
  subjects: string[]
  weekStart: string
}

interface AchievementData {
  parentName: string
  childName: string
  achievementName: string
  achievementDescription: string
}

interface StreakData {
  parentName: string
  childName: string
  days: number
}

interface TestResultData {
  parentName: string
  childName: string
  testType: string
  score: number
  totalQuestions: number
  passed: boolean
}

// Base email wrapper
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SchoolGenius</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">SchoolGenius</h1>
    </div>
    <div style="padding: 32px;">
      ${content}
    </div>
    <div style="background: #f4f4f5; padding: 16px; text-align: center; color: #71717a; font-size: 14px;">
      <p style="margin: 0;">You're receiving this because you have a child on SchoolGenius.</p>
      <p style="margin: 8px 0 0 0;"><a href="{unsubscribeUrl}" style="color: #8b5cf6;">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
`
}

export function weeklySummaryEmail(data: WeeklySummaryData): { subject: string; html: string } {
  const subjectsText = data.subjects.length > 0
    ? data.subjects.join(', ')
    : 'No subjects practiced'

  const content = `
    <h2 style="color: #18181b; margin-top: 0;">Hi ${data.parentName}!</h2>
    <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">
      Here's ${data.childName}'s weekly progress report for the week of ${data.weekStart}:
    </p>

    <div style="background: linear-gradient(135deg, #faf5ff, #fdf2f8); border-radius: 12px; padding: 24px; margin: 24px 0;">
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #8b5cf6;">${data.totalProblems}</div>
          <div style="color: #71717a; font-size: 14px;">Problems</div>
        </div>
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #22c55e;">${data.correctCount}</div>
          <div style="color: #71717a; font-size: 14px;">Correct</div>
        </div>
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #ec4899;">${data.accuracy}%</div>
          <div style="color: #71717a; font-size: 14px;">Accuracy</div>
        </div>
      </div>
    </div>

    <p style="color: #3f3f46; font-size: 16px;">
      <strong>Subjects practiced:</strong> ${subjectsText}
    </p>

    ${data.accuracy >= 80
      ? '<p style="color: #22c55e; font-size: 18px; font-weight: bold;">Great job this week!</p>'
      : '<p style="color: #3f3f46; font-size: 16px;">Keep practicing - every problem helps!</p>'
    }
  `

  return {
    subject: `${data.childName}'s Weekly Progress Report`,
    html: emailWrapper(content)
  }
}

export function achievementEmail(data: AchievementData): { subject: string; html: string } {
  const content = `
    <h2 style="color: #18181b; margin-top: 0;">Hi ${data.parentName}!</h2>
    <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">
      Great news! ${data.childName} just earned a new achievement!
    </p>

    <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
      <div style="font-size: 24px; font-weight: bold; color: #92400e;">${data.achievementName}</div>
      <div style="color: #a16207; margin-top: 8px;">${data.achievementDescription}</div>
    </div>

    <p style="color: #3f3f46; font-size: 16px;">
      Keep up the amazing work!
    </p>
  `

  return {
    subject: `${data.childName} earned "${data.achievementName}"!`,
    html: emailWrapper(content)
  }
}

export function streakMilestoneEmail(data: StreakData): { subject: string; html: string } {
  const emoji = data.days >= 100 ? '🔥🔥🔥' : data.days >= 30 ? '🔥🔥' : '🔥'
  const message = data.days >= 100
    ? 'Incredible dedication!'
    : data.days >= 30
      ? 'A whole month of learning!'
      : 'A full week of practice!'

  const content = `
    <h2 style="color: #18181b; margin-top: 0;">Hi ${data.parentName}!</h2>
    <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">
      ${data.childName} just hit an amazing milestone!
    </p>

    <div style="background: linear-gradient(135deg, #fef2f2, #fecaca); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">${emoji}</div>
      <div style="font-size: 36px; font-weight: bold; color: #dc2626;">${data.days}-Day Streak!</div>
      <div style="color: #b91c1c; margin-top: 8px;">${message}</div>
    </div>

    <p style="color: #3f3f46; font-size: 16px;">
      Consistency is key to learning success. Keep it going!
    </p>
  `

  return {
    subject: `${data.childName} hit a ${data.days}-day streak!`,
    html: emailWrapper(content)
  }
}

export function testResultEmail(data: TestResultData): { subject: string; html: string } {
  const percentage = Math.round((data.score / data.totalQuestions) * 100)
  const bgColor = data.passed
    ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
    : 'linear-gradient(135deg, #fef3c7, #fde68a)'
  const textColor = data.passed ? '#166534' : '#92400e'
  const emoji = data.passed ? '✅' : '📚'

  const content = `
    <h2 style="color: #18181b; margin-top: 0;">Hi ${data.parentName}!</h2>
    <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">
      ${data.childName} just completed their ${data.testType} test!
    </p>

    <div style="background: ${bgColor}; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">${emoji}</div>
      <div style="font-size: 36px; font-weight: bold; color: ${textColor};">${percentage}%</div>
      <div style="color: ${textColor}; margin-top: 8px;">
        ${data.score} out of ${data.totalQuestions} correct
      </div>
      <div style="color: ${textColor}; margin-top: 8px; font-weight: bold;">
        ${data.passed ? 'Passed!' : 'Needs more practice'}
      </div>
    </div>

    <p style="color: #3f3f46; font-size: 16px;">
      ${data.passed
        ? 'Fantastic work! The hard work is paying off.'
        : "Don't worry - practice makes perfect. They'll do great next time!"}
    </p>
  `

  return {
    subject: data.passed
      ? `${data.childName} passed their ${data.testType} test!`
      : `${data.childName}'s ${data.testType} test results`,
    html: emailWrapper(content)
  }
}
