/**
 * AGE-APPROPRIATE ENCOURAGEMENT MESSAGES
 *
 * Different messages for different ages:
 * - K-2 (Ages 5-8): Super simple, lots of emojis, short
 * - 3-5 (Ages 8-11): Friendly, encouraging, medium length
 * - 6-8 (Ages 11-14): Cool, motivating, less cutesy
 * - 9-12 (Ages 14-18): Mature, empowering, no baby talk
 */

export const ageAppropriateMessages = {
  // 🎨 KINDERGARTEN - 2ND GRADE (Ages 5-8)
  k2: {
    correct: [
      "YES! You did it! 🎉",
      "WOW! So smart! ⭐",
      "You got it! Yay! 🌟",
      "Super job! 💪",
      "Amazing! 🚀",
      "You're so good! 👍",
      "Awesome work! 🎨",
      "Perfect! 💖",
      "You rock! 🎸",
      "Great job, friend! 🤗",
    ],
    wrong: [
      "Oops! Let's try again! 😊",
      "Not quite! You can do it! 💪",
      "Almost! Try one more time! 🌟",
      "Let's think about it! 🤔",
      "Good try! Keep going! 👍",
      "That's okay! Let's figure it out! 🧩",
    ],
    struggling: [
      "This is tricky! You're doing great! 💪",
      "You're working so hard! 🌟",
      "Want me to help? 🤗",
      "Let's do this together! 🤝",
      "You're so brave! Keep trying! 🦁",
    ],
    complete: [
      "YOU DID IT ALL! 🏆",
      "Lesson done! You're amazing! ⭐",
      "All finished! Great work! 🎉",
      "You're so smart! ✨",
    ],
  },

  // 📚 3RD - 5TH GRADE (Ages 8-11)
  grades35: {
    correct: [
      "Excellent! You nailed it! 🎯",
      "That's right! Great thinking! 🧠",
      "Perfect! You're getting good at this! ⭐",
      "Nice work! Keep it up! 💪",
      "Awesome! You really understand this! 📚",
      "Correct! Your hard work shows! 🌟",
      "You got it! Smart move! 💡",
      "Right on! You're crushing this! 🔥",
      "Fantastic! You're learning fast! 🚀",
      "Spot on! Excellent reasoning! 🎓",
    ],
    wrong: [
      "Not quite, but good effort! Try again! 💪",
      "Hmm, let's think about this differently! 🤔",
      "Close! You're on the right path! 🛤️",
      "That's a common mistake - let's fix it! 🔧",
      "Good try! Want a hint? 💡",
      "Almost there! One more shot! 🎯",
    ],
    struggling: [
      "This is challenging, but you've got this! 💪",
      "Tough one! Let's break it down step by step! 🪜",
      "Don't give up! You're learning! 🌱",
      "Want me to explain it a different way? 🔄",
      "This takes practice - you're doing great! 📈",
    ],
    complete: [
      "Lesson complete! You crushed it! 🏆",
      "All done! Your hard work paid off! 💪",
      "Finished! You should be proud! ⭐",
      "You did it! That was impressive! 🎉",
    ],
  },

  // 🎯 6TH - 8TH GRADE (Ages 11-14)
  grades68: {
    correct: [
      "Correct! Nice work! 💪",
      "Exactly right! Well done! ✓",
      "That's it! You've got this down! 🎯",
      "Perfect! Your understanding is solid! 🧠",
      "Right! Keep that momentum going! 🚀",
      "Nailed it! Great reasoning! 💡",
      "Correct! You're mastering this! 📊",
      "Yes! Your effort is paying off! 📈",
      "Spot on! Excellent thinking! 🎓",
      "Exactly! You really get this! ⭐",
    ],
    wrong: [
      "Not quite - let's review this! 🔍",
      "Close! Think about the approach! 🤔",
      "That's a common mistake - here's why... 💭",
      "Not this time, but you're learning! 📚",
      "Rethink your strategy! 🧩",
      "Let's analyze where this went wrong! 🔬",
    ],
    struggling: [
      "This is tough - stick with it! 💪",
      "Challenging concept! Let's tackle it together! 🤝",
      "Don't quit! This is where real learning happens! 🌱",
      "Need a different approach? Let me show you! 🔄",
      "You're pushing yourself - that's growth! 📈",
    ],
    complete: [
      "Lesson complete! Solid work! 🏆",
      "Done! Your persistence paid off! 💪",
      "Finished! You should feel accomplished! ✓",
      "Complete! You're building real skills! 📊",
    ],
  },

  // 🎓 9TH - 12TH GRADE (Ages 14-18)
  grades912: {
    correct: [
      "Correct! Well reasoned! ✓",
      "Exactly. Nice work! 💪",
      "Right. You've got this concept! 🎯",
      "Perfect. Your understanding is strong! 🧠",
      "Correct! Keep that up! 📈",
      "Yes! Solid answer! ✓",
      "Right! You're demonstrating mastery! 🎓",
      "Exactly! Your preparation shows! 📊",
      "Correct! Excellent critical thinking! 💡",
      "Yes! You've clearly understood this! ✓",
    ],
    wrong: [
      "Not correct - review the concept! 🔍",
      "Incorrect. Think about the fundamentals! 💭",
      "Not quite. Let's analyze your approach! 🔬",
      "That's not right - here's why... 📚",
      "Reconsider your method! 🧩",
      "Incorrect. Want to see the correct approach? 🔄",
    ],
    struggling: [
      "This is complex - stay focused! 💪",
      "Challenging material! Let's break it down systematically! 🔬",
      "Don't give up! Push through this! 💪",
      "Need clarification? I can explain it differently! 🔄",
      "This is where growth happens! Keep working! 📈",
    ],
    complete: [
      "Lesson complete. Well done! ✓",
      "Finished! Your work ethic is impressive! 💪",
      "Complete! You've demonstrated solid understanding! 🎓",
      "Done! You're building strong foundational skills! 📊",
    ],
  },
}

// 🎭 HELPER FUNCTIONS
export function getAgeAppropriateMessage(
  gradeLevel: number,
  messageType: 'correct' | 'wrong' | 'struggling' | 'complete',
  isCorrect?: boolean
): string {
  let ageGroup: 'k2' | 'grades35' | 'grades68' | 'grades912'

  if (gradeLevel <= 2) {
    ageGroup = 'k2'
  } else if (gradeLevel <= 5) {
    ageGroup = 'grades35'
  } else if (gradeLevel <= 8) {
    ageGroup = 'grades68'
  } else {
    ageGroup = 'grades912'
  }

  const messages = ageAppropriateMessages[ageGroup][messageType]
  return messages[Math.floor(Math.random() * messages.length)]
}

// 🎯 SMART MESSAGE SELECTOR
// This picks the right message based on grade, situation, and context
export function getSmartMessage(context: {
  gradeLevel: number
  isCorrect: boolean
  consecutiveWrong: number
  streakCorrect: number
  timeSpent: number
  isFirstTime: boolean
  isReturningUser: boolean
}): string {
  const { gradeLevel, isCorrect, consecutiveWrong, isFirstTime } = context

  // Special cases
  if (isFirstTime) {
    return gradeLevel <= 2
      ? "Let's have fun learning! 🎉"
      : gradeLevel <= 5
      ? "Welcome! Let's start learning! 🚀"
      : gradeLevel <= 8
      ? "Welcome! Let's get started! 💪"
      : "Welcome! Let's begin! 📚"
  }

  // Determine message type
  let messageType: 'correct' | 'wrong' | 'struggling' | 'complete'

  if (isCorrect) {
    messageType = 'correct'
  } else if (consecutiveWrong >= 3) {
    messageType = 'struggling'
  } else {
    messageType = 'wrong'
  }

  return getAgeAppropriateMessage(gradeLevel, messageType)
}

// 🌟 EXPORT AGE-SPECIFIC SETS
export const getMessagesForGrade = (gradeLevel: number) => {
  if (gradeLevel <= 2) return ageAppropriateMessages.k2
  if (gradeLevel <= 5) return ageAppropriateMessages.grades35
  if (gradeLevel <= 8) return ageAppropriateMessages.grades68
  return ageAppropriateMessages.grades912
}
