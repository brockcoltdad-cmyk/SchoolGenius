import { WeeklySummary } from './useWeeklySummary'

// Generate full report text for Gigi to read
export function generateReportText(summary: WeeklySummary): string {
  const { childName, totalProblems, correctCount, accuracy, subjectBreakdown } = summary

  // No activity this week
  if (totalProblems === 0) {
    return `Hey ${childName}! You haven't done any practice problems this week yet. Let's get started!`
  }

  // Build the report
  let report = `Great job this week, ${childName}! `
  report += `You completed ${totalProblems} problems and got ${correctCount} correct. `
  report += `That's ${accuracy}% accuracy! `

  // Add subject breakdown if multiple subjects
  if (subjectBreakdown.length > 1) {
    const best = subjectBreakdown.reduce((a, b) => a.accuracy > b.accuracy ? a : b)
    report += `Your best subject was ${best.subject} with ${best.accuracy}% accuracy. `
  } else if (subjectBreakdown.length === 1) {
    report += `You practiced ${subjectBreakdown[0].subject}. `
  }

  // Encouragement based on accuracy
  if (accuracy >= 90) {
    report += `Amazing work! Keep it up!`
  } else if (accuracy >= 70) {
    report += `You're doing great! Keep practicing!`
  } else {
    report += `Keep trying, you're getting better every day!`
  }

  return report
}

// Short version for dashboard cards
export function generateShortReport(summary: WeeklySummary): string {
  const { totalProblems, accuracy } = summary

  if (totalProblems === 0) {
    return `No activity this week`
  }

  return `${totalProblems} problems, ${accuracy}% accuracy`
}

// Parent-facing detailed report
export function generateParentReport(summary: WeeklySummary): string {
  const { childName, totalProblems, correctCount, accuracy, subjectBreakdown, weekStart } = summary

  if (totalProblems === 0) {
    return `${childName} had no activity during the week of ${weekStart}.`
  }

  let report = `Weekly Report for ${childName} (Week of ${weekStart})\n\n`
  report += `Total Problems: ${totalProblems}\n`
  report += `Correct Answers: ${correctCount}\n`
  report += `Overall Accuracy: ${accuracy}%\n\n`

  if (subjectBreakdown.length > 0) {
    report += `Subject Breakdown:\n`
    for (const subject of subjectBreakdown) {
      report += `  - ${subject.subject}: ${subject.problems} problems, ${subject.accuracy}% accuracy\n`
    }
  }

  return report
}
