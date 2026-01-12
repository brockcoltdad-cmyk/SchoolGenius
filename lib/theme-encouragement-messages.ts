/**
 * THEME-BASED ENCOURAGEMENT MESSAGES
 *
 * Different encouragement messages for each theme!
 * Kids hear Fortnite terms in battle mode, superhero terms in hero mode, etc.
 * Makes learning WAY more fun and immersive!
 */

import { ThemeId } from './theme-context'

interface ThemeMessages {
  correct: string[]
  wrong: string[]
  struggling: string[]
  streak: string[]
  complete: string[]
}

export const THEME_ENCOURAGEMENT: Record<ThemeId, ThemeMessages> = {
  // 🎮 BATTLE (Fortnite-style)
  battle: {
    correct: [
      "Victory Royale! 🏆",
      "Legendary play! ⭐",
      "Got the W! 💪",
      "Clutch! 🔥",
      "Battle Pass earned! 🎯",
      "That's a dub! ✨",
      "GG! You're cracked! ⚡",
      "Mythic move! 💎",
      "Eliminated it! 💥",
      "Squad carried! 🤝"
    ],
    wrong: [
      "Gotta rotate! Try again! 🗺️",
      "Take the L... but learn from it! 💪",
      "Dropped into the wrong spot! 🎯",
      "Storm's coming! Adjust! ⚡",
      "Reset and retry! 🔄",
      "Everyone gets eliminated sometimes! 💭"
    ],
    struggling: [
      "This is endgame - stay focused! 🎯",
      "You got this! Channel your inner pro! 💪",
      "Take a med kit break! 🩹",
      "Watch the replay - learn the strat! 📺",
      "Even pros practice! Keep grinding! 🏋️"
    ],
    streak: [
      "2-Kill Streak! 🔥",
      "3 in a row! On fire! 🔥🔥",
      "Quad feed! 💥",
      "5-streak! Unstoppable! ⚡",
      "Team wipe! 🏆"
    ],
    complete: [
      "Match complete! Victory! 🏆",
      "Season objectives complete! 🎉",
      "Battle Pass tier up! ⬆️",
      "Champion! GG! 👑"
    ]
  },

  // 🏗️ BUILDER (Minecraft-style)
  builder: {
    correct: [
      "Achievement unlocked! 🏆",
      "That's diamond-level! 💎",
      "Crafted perfectly! ⚒️",
      "Enchanted! ✨",
      "Redstone genius! 🔴",
      "Legendary loot! 💰",
      "Nether portal worthy! 🌀",
      "Dragon slayer move! 🐉",
      "Built different! 🏗️",
      "Mined that answer! ⛏️"
    ],
    wrong: [
      "Creeper got you! Try again! 💚",
      "Fell in lava! Respawn! 🔥",
      "Need better tools! 🔨",
      "Mine a different way! ⛏️",
      "Craft plan failed! Re-craft! 📝",
      "Zombie attacked! Defend! 🧟"
    ],
    struggling: [
      "This is The End - you got this! 🌌",
      "Even the Wither is beatable! 💪",
      "Break for some food! 🍖",
      "Check your crafting recipe! 📖",
      "Diamonds take mining! Keep digging! ⛏️"
    ],
    streak: [
      "2-combo! ⛏️⛏️",
      "3-chain mine! 💎",
      "4-block streak! 🏗️",
      "5-craft combo! Legendary! 🔥",
      "Ender Dragon level! 🐉"
    ],
    complete: [
      "World conquered! 🌍",
      "Beat the Ender Dragon! 🐉",
      "Full diamond armor! 💎",
      "Hardcore mode complete! 🏆"
    ]
  },

  // 🏴‍☠️ PIRATE
  pirate: {
    correct: [
      "Shiver me timbers! ⚓",
      "Treasure found! 💰",
      "Ahoy, that's right! 🏴‍☠️",
      "Walk the plank... to success! 🪵",
      "X marks the spot! ❌",
      "Yo ho ho! Correct! 🎵",
      "Captain-worthy! ⛵",
      "Buried treasure! 💎",
      "Sail ho! 🚢",
      "Pieces of eight! 🪙"
    ],
    wrong: [
      "Lost at sea! Navigate again! 🧭",
      "Kraken got ya! Try again! 🐙",
      "Mutiny! Recalculate! 🗺️",
      "Overboard! Swim back! 🌊",
      "Scurvy dog! Learn from it! 🐕",
      "Reef ahead! Turn around! 🪨"
    ],
    struggling: [
      "Even captains need their crew! 🤝",
      "The sea is rough! Stay strong! 💪",
      "Take a grog break! 🍺",
      "Check your treasure map! 🗺️",
      "All great pirates practice! ⚔️"
    ],
    streak: [
      "2 treasures! 💰💰",
      "3-chest combo! 🏴‍☠️",
      "4 doubloons! ⚓",
      "5-plunder streak! 🎯",
      "Legendary pirate! 👑"
    ],
    complete: [
      "All treasure claimed! 🏆",
      "Captain of the seven seas! ⛵",
      "Pirate King status! 👑",
      "Legendary buccaneer! ⚔️"
    ]
  },

  // 🧟 ZOMBIE
  zombie: {
    correct: [
      "Braaaaains! Smart choice! 🧠",
      "Undead awesome! 🧟",
      "Grave-robbing genius! ⚰️",
      "Un-dead right! 💀",
      "Zombie zinger! ⚡",
      "Flesh... I mean fresh answer! 🎯",
      "Rising from the grave! 📈",
      "Ghoul-ishly good! 👻",
      "Monster move! 👹",
      "Cryptic genius! 🪦"
    ],
    wrong: [
      "Zombie stumble! Try again! 🧟",
      "Headshot missed! 🎯",
      "Fell in the graveyard! ⚰️",
      "Daylight! Take cover! ☀️",
      "Shuffled wrong way! 🔄",
      "Need more brains! 🧠"
    ],
    struggling: [
      "Even zombies never give up! 💪",
      "Rise from the grave again! 📈",
      "Take a tombstone timeout! 🪦",
      "All ghouls practice! 👻",
      "You're un-dead-termined! 🧟"
    ],
    streak: [
      "2-bite combo! 🧟🧟",
      "3 brains! 🧠🧠🧠",
      "4-zombie horde! 👹",
      "5-outbreak! Pandemic! 🌍",
      "Apocalypse master! 💀"
    ],
    complete: [
      "Survived the zombie horde! 🏆",
      "Brain buffet complete! 🧠",
      "Undead champion! 👑",
      "Apocalypse survived! 🌍"
    ]
  },

  // 🦸 ANIME
  anime: {
    correct: [
      "Plus Ultra! 💪",
      "Believe it! 🍥",
      "Over 9000! ⚡",
      "Bankai! ⚔️",
      "One For All! 💥",
      "Kamehameha! 🌊",
      "Main character energy! ⭐",
      "Protagonist power! 👑",
      "Jutsu mastered! 🥷",
      "Power level rising! 📈"
    ],
    wrong: [
      "Villain escaped! Chase again! 👹",
      "Training arc time! 💪",
      "Need more chakra! 🔵",
      "Flashback needed! Review! 📺",
      "Power-up required! ⚡",
      "Sensei says try again! 🧙"
    ],
    struggling: [
      "This is your training arc! 💪",
      "Even heroes struggle! Keep fighting! ⚔️",
      "Take a ramen break! 🍜",
      "Your sensei believes in you! 👨‍🏫",
      "Protagonists never give up! 🔥"
    ],
    streak: [
      "2-hit combo! 💥💥",
      "3-strike special! ⚔️",
      "4-attack ultimate! 🌟",
      "5-jutsu chain! Legendary! 🎯",
      "Final form unlocked! 👑"
    ],
    complete: [
      "Arc complete! Season finale! 🏆",
      "Main character victory! 👑",
      "Power level: Maximum! ⚡",
      "Legendary hero status! ⭐"
    ]
  },

  // 🦄 UNICORN
  unicorn: {
    correct: [
      "Magical! ✨",
      "Sparkle time! 💫",
      "Rainbow power! 🌈",
      "Enchanted! 🦄",
      "Glitter bomb! ✨",
      "Fairy dust approved! 🧚",
      "Mystical! 🔮",
      "Starlight! ⭐",
      "Wonderland worthy! 💖",
      "Crystal perfect! 💎"
    ],
    wrong: [
      "Lost your sparkle! Get it back! ✨",
      "Rainbow faded! Try again! 🌈",
      "Magic misfired! Re-cast! 🪄",
      "Cloud bumped! Float again! ☁️",
      "Glitter spill! Clean up! 💫",
      "Horn pointing wrong way! 🦄"
    ],
    struggling: [
      "Even unicorns practice magic! 🪄",
      "Your rainbow is still there! 🌈",
      "Take a cloud nap! ☁️",
      "All magical creatures learn! 📚",
      "Believe in your sparkle! ✨"
    ],
    streak: [
      "2 rainbows! 🌈🌈",
      "3-sparkle combo! ✨",
      "4 magical moments! 🦄",
      "5-enchantment streak! 🔮",
      "Ultimate unicorn! 👑"
    ],
    complete: [
      "Kingdom saved! 🏰",
      "Rainbow complete! 🌈",
      "Magic mastered! 🪄",
      "Queen unicorn! 👑"
    ]
  },

  // 🦖 DINOSAUR
  dinosaur: {
    correct: [
      "ROAR! Correct! 🦖",
      "T-Rex approved! 🦖",
      "Jurassic genius! 🦕",
      "Dino-mite! 💥",
      "Fossil find! 🦴",
      "Prehistoric perfect! 🌋",
      "Meteor dodged! ☄️",
      "Dino champion! 👑",
      "Rex-cellent! 🦖",
      "Cretaceous correct! 🌴"
    ],
    wrong: [
      "Stepped in tar pit! Climb out! 🕳️",
      "Meteor coming! Move! ☄️",
      "Volcano erupting! Relocate! 🌋",
      "Stuck in mud! Pull free! 💪",
      "Wrong era! Time travel! ⏰",
      "Herbivore mistake! Try again! 🌿"
    ],
    struggling: [
      "Even T-Rex had to practice hunting! 🦖",
      "Dinos never quit! 💪",
      "Take a prehistoric break! 🌴",
      "All dinosaurs learn! 📚",
      "Your inner dino is strong! 🔥"
    ],
    streak: [
      "2-roar combo! 🦖🦖",
      "3-chomp chain! 🦕",
      "4-stomp streak! 🦶",
      "5-dino domination! 👑",
      "King of dinosaurs! 🏆"
    ],
    complete: [
      "Ruled the Cretaceous! 🌍",
      "Fossil legend! 🦴",
      "Dino dynasty! 👑",
      "Jurassic master! 🦖"
    ]
  },

  // 🚀 SPACE
  space: {
    correct: [
      "Mission accomplished! 🚀",
      "Houston, we have success! 📡",
      "One giant leap! 🌙",
      "Out of this world! 🌍",
      "Stellar! ⭐",
      "Rocket science! 🧪",
      "Light speed! ⚡",
      "Galaxy brain! 🧠",
      "Cosmic! 🌌",
      "Astronaut-approved! 👨‍🚀"
    ],
    wrong: [
      "Course correction needed! 🛸",
      "Asteroid hit! Navigate! ☄️",
      "Lost in space! Recalibrate! 🗺️",
      "Orbit missed! Try again! 🌍",
      "Malfunction! Repair! 🔧",
      "Black hole! Escape! 🕳️"
    ],
    struggling: [
      "Space missions are tough! 💪",
      "Even astronauts train! 🏋️",
      "Take a spacewalk break! 🌌",
      "Mission Control believes in you! 📡",
      "The stars are watching! ⭐"
    ],
    streak: [
      "2-planet combo! 🪐🪐",
      "3-star chain! ⭐",
      "4-galaxy streak! 🌌",
      "5-cosmic domination! 🚀",
      "Universe conquered! 👑"
    ],
    complete: [
      "Mission complete! Return to Earth! 🌍",
      "Galaxy explored! 🌌",
      "Space master! 🚀",
      "Cosmic legend! 👨‍🚀"
    ]
  },

  // 🦸 HERO (Superman, Marvel, DC)
  hero: {
    correct: [
      "Super! 🦸",
      "Heroic! 💪",
      "Saved the day! 🌆",
      "Kryptonite avoided! 💚",
      "Cape-worthy! 🦸‍♂️",
      "Bat-signal approved! 🦇",
      "Avengers assemble! 🏆",
      "Marvelous! ✨",
      "Justice served! ⚖️",
      "Power move! ⚡"
    ],
    wrong: [
      "Villain escaped! Chase! 👹",
      "Need backup! Try again! 🦸",
      "Kryptonite weakened you! 💚",
      "Civilian in danger! Redirect! 🚨",
      "Lex won this round! Rematch! 🧪",
      "Joker tricked you! Be careful! 🃏"
    ],
    struggling: [
      "Even Superman trains! 💪",
      "Heroes never quit! 🦸",
      "Take a fortress break! 🏰",
      "Your powers are growing! 📈",
      "The city needs you! 🌆"
    ],
    streak: [
      "2-save combo! 🦸🦸",
      "3-rescue chain! 💪",
      "4-hero streak! 🌟",
      "5-saves! Legendary! 🏆",
      "Justice League level! 👑"
    ],
    complete: [
      "City saved! 🌆",
      "Hero hall of fame! 🏆",
      "Legendary protector! 👑",
      "Ultimate hero! 🦸"
    ]
  },

  // 🤖 ROBOT
  robot: {
    correct: [
      "Computing... Correct! 🤖",
      "System optimal! ✅",
      "Logic perfect! 🧠",
      "Algorithm approved! 📊",
      "Circuits firing! ⚡",
      "Binary brilliant! 01010001",
      "Processor peak! 💻",
      "AI approved! 🤖",
      "Bot-tastic! 🔧",
      "Mechanical mastery! ⚙️"
    ],
    wrong: [
      "Error detected! Debug! 🐛",
      "System malfunction! Repair! 🔧",
      "Reboot required! 🔄",
      "Virus found! Delete! 🦠",
      "Glitch! Restart! ⚡",
      "Need software update! 💾"
    ],
    struggling: [
      "Processing... Still calculating! 🤖",
      "Robots learn through iteration! 🔄",
      "Take an oil break! 🛢️",
      "Your AI is improving! 📈",
      "Beep boop! Keep going! 💪"
    ],
    streak: [
      "2-calc combo! 🤖🤖",
      "3-algorithm chain! 💻",
      "4-logic streak! 🧠",
      "5-process perfection! 🏆",
      "AI overlord! 👑"
    ],
    complete: [
      "System fully operational! 🤖",
      "All tasks executed! ✅",
      "Robot revolution! 🔥",
      "Ultimate AI! 👑"
    ]
  },

  // 🧜‍♀️ MERMAID
  mermaid: {
    correct: [
      "Ocean-approved! 🌊",
      "Pearl perfect! 🦪",
      "Whale done! 🐋",
      "Fin-tastic! 🧜‍♀️",
      "Coral correct! 🪸",
      "Treasure trove! 💎",
      "Making waves! 🌊",
      "Shell yeah! 🐚",
      "Tide's in your favor! 🌊",
      "Aqua-mazing! 💧"
    ],
    wrong: [
      "Wiped out! Surf again! 🏄",
      "Caught in net! Escape! 🥅",
      "Shark nearby! Swim! 🦈",
      "Riptide! Redirect! 🌊",
      "Seaweed tangle! Free yourself! 🌿",
      "Storm brewing! Take cover! ⛈️"
    ],
    struggling: [
      "Even mermaids practice swimming! 🧜‍♀️",
      "The ocean is deep - keep diving! 🌊",
      "Take a coral break! 🪸",
      "Your voice is powerful! 🎵",
      "The sea believes in you! 💙"
    ],
    streak: [
      "2-wave combo! 🌊🌊",
      "3-pearl chain! 🦪",
      "4-ocean streak! 🧜‍♀️",
      "5-tidal domination! 💎",
      "Queen of the sea! 👑"
    ],
    complete: [
      "All seven seas conquered! 🌍",
      "Treasure chest full! 💎",
      "Mermaid royalty! 👑",
      "Ocean legend! 🧜‍♀️"
    ]
  },

  // 👸 PRINCESS
  princess: {
    correct: [
      "Royal! 👑",
      "Queenly! 💖",
      "Castle-worthy! 🏰",
      "Crowned! ✨",
      "Majestic! 🎭",
      "Throne-level! 👸",
      "Ball perfect! 💃",
      "Tiara-approved! 👑",
      "Regal! 🎪",
      "Fairytale ending! 📖"
    ],
    wrong: [
      "Dragon escaped! Try again! 🐉",
      "Glass slipper broke! Get new one! 👠",
      "Lost your crown! Find it! 👑",
      "Spell backfired! Re-cast! 🪄",
      "Prince went wrong way! 🤴",
      "Ball started! Hurry! 💃"
    ],
    struggling: [
      "Even princesses face challenges! 👸",
      "Your kingdom needs you! 🏰",
      "Take a royal tea break! ☕",
      "All queens practiced! 👑",
      "Your crown awaits! ✨"
    ],
    streak: [
      "2-royal combo! 👑👑",
      "3-crown chain! ✨",
      "4-castle streak! 🏰",
      "5-kingdom domination! 🎭",
      "Supreme queen! 👸"
    ],
    complete: [
      "Kingdom saved! 🏰",
      "Royal ball success! 💃",
      "Queen crowned! 👑",
      "Happily ever after! 💖"
    ]
  },

  // 🌈 RAINBOW
  rainbow: {
    correct: [
      "Rainbow power! 🌈",
      "Spectrum perfect! 🎨",
      "All colors aligned! 🌟",
      "Pot of gold! 💰",
      "Prismatic! ✨",
      "Colorful! 🎨",
      "Vibrant victory! 🌈",
      "Full spectrum! 📊",
      "Technicolor! 🎬",
      "Kaleidoscope! 🔮"
    ],
    wrong: [
      "Color faded! Repaint! 🎨",
      "Rainbow broke! Rebuild! 🌈",
      "Spectrum misaligned! Adjust! 📊",
      "Lost a color! Find it! 🔍",
      "Prism cracked! Repair! 💎",
      "Need more colors! Add! 🖌️"
    ],
    struggling: [
      "Every rainbow starts with rain! 🌧️",
      "Your colors are still there! 🌈",
      "Take a spectrum break! 🎨",
      "Rainbows never quit! 💪",
      "Your pot of gold awaits! 💰"
    ],
    streak: [
      "2-color combo! 🌈🌈",
      "3-spectrum chain! 🎨",
      "4-rainbow streak! ✨",
      "5-prismatic perfection! 💎",
      "Rainbow master! 👑"
    ],
    complete: [
      "Full spectrum achieved! 🌈",
      "All colors collected! 🎨",
      "Rainbow royalty! 👑",
      "Colorful champion! 🏆"
    ]
  },

  // 🦋 BUTTERFLY
  butterfly: {
    correct: [
      "Beautiful! 🦋",
      "Flutter-by! ✨",
      "Metamorphosis complete! 🐛➡️🦋",
      "Wing-tastic! 💫",
      "Garden gorgeous! 🌸",
      "Cocoon conquered! 🎯",
      "Pollen perfect! 🌺",
      "Flight fantastic! 🦋",
      "Flower power! 🌻",
      "Graceful! 💖"
    ],
    wrong: [
      "Wind blew you off course! 🌬️",
      "Still in cocoon! Emerge! 🐛",
      "Wrong flower! Try another! 🌸",
      "Net nearby! Escape! 🥅",
      "Storm coming! Take cover! ⛈️",
      "Need more nectar! 🌺"
    ],
    struggling: [
      "Butterflies practice flying! 🦋",
      "Your metamorphosis continues! 🐛",
      "Take a flower break! 🌸",
      "All butterflies were caterpillars! 🌱",
      "Your wings are growing! 💪"
    ],
    streak: [
      "2-flutter combo! 🦋🦋",
      "3-wing chain! ✨",
      "4-flight streak! 💫",
      "5-garden domination! 🌸",
      "Queen butterfly! 👑"
    ],
    complete: [
      "Garden conquered! 🌸",
      "Full transformation! 🦋",
      "Butterfly royalty! 👑",
      "Flight master! 💫"
    ]
  },

  // 💭 DREAMS
  dreams: {
    correct: [
      "Dreamy! 💭",
      "Cloud nine! ☁️",
      "Wish granted! ⭐",
      "Starry success! 🌟",
      "Pillow perfect! 🛏️",
      "Moonlight magic! 🌙",
      "Sleep smarts! 😴",
      "Bedtime brilliant! 🌛",
      "Lullaby lovely! 🎵",
      "Snooze success! 💤"
    ],
    wrong: [
      "Nightmare! Wake up! 😱",
      "Bad dream! Try again! 💭",
      "Fell out of clouds! ☁️",
      "Shooting star missed! ⭐",
      "Pillow fight lost! 🛏️",
      "Moonlight faded! 🌙"
    ],
    struggling: [
      "Even dreams need practice! 💭",
      "Sweet dreams coming! 🌙",
      "Take a cloud nap! ☁️",
      "Your wishes will come true! ⭐",
      "Dreamland believes in you! 💤"
    ],
    streak: [
      "2-dream combo! 💭💭",
      "3-wish chain! ⭐",
      "4-cloud streak! ☁️",
      "5-dream domination! 🌙",
      "Dream master! 👑"
    ],
    complete: [
      "All dreams achieved! 💭",
      "Dreamland conquered! 🌙",
      "Wish royalty! ⭐",
      "Sleep champion! 💤"
    ]
  },

  // 🏆 VICTORY
  victory: {
    correct: [
      "Victory! 🏆",
      "Champion! 👑",
      "Winner! 🥇",
      "Trophy earned! 🏅",
      "Gold medal! 🥇",
      "Podium finish! 🏆",
      "First place! 🥇",
      "MVP! ⭐",
      "All-star! 🌟",
      "Hall of fame! 🏛️"
    ],
    wrong: [
      "Disqualified! Retry! 🚫",
      "False start! Go again! 🏁",
      "Dropped the ball! Pick up! 🏐",
      "Penalty! Redo! ⚠️",
      "Fouled! Free throw! 🏀",
      "Timeout needed! 🕐"
    ],
    struggling: [
      "Champions train hard! 💪",
      "Victory requires practice! 🏋️",
      "Take a sports break! ⚽",
      "Winners never quit! 🏆",
      "Your trophy awaits! 🥇"
    ],
    streak: [
      "2-win streak! 🏆🏆",
      "3-victory chain! 🥇",
      "4-trophy combo! 🏅",
      "5-win dynasty! 👑",
      "GOAT status! 🐐"
    ],
    complete: [
      "Championship won! 🏆",
      "Season victorious! 🥇",
      "Ultimate champion! 👑",
      "Legend created! 🏛️"
    ]
  },

  // 🎲 CUBE (Rubik's cube, geometry)
  cube: {
    correct: [
      "Solved! 🎲",
      "Aligned! ✅",
      "Cube complete! 🟦",
      "Algorithm aced! 🧠",
      "All sides match! 🎯",
      "Pattern perfect! 📐",
      "Geometry genius! 📏",
      "Cubic! 🎲",
      "3D success! 📦",
      "Dimension dominated! 🌐"
    ],
    wrong: [
      "Scrambled! Unscramble! 🎲",
      "Wrong rotation! Turn again! 🔄",
      "Colors mixed! Separate! 🌈",
      "Algorithm failed! Retry! 🧩",
      "Misaligned! Adjust! 📐",
      "Face incomplete! Fix! 🟦"
    ],
    struggling: [
      "Even pros use algorithms! 🧠",
      "Cubes take practice! 🎲",
      "Take a rotation break! 🔄",
      "Your pattern is forming! 📐",
      "Keep twisting! 💪"
    ],
    streak: [
      "2-solve combo! 🎲🎲",
      "3-cube chain! 🟦",
      "4-algorithm streak! 🧠",
      "5-solve perfection! 🎯",
      "Speedcube master! 👑"
    ],
    complete: [
      "All cubes solved! 🎲",
      "Geometry complete! 📐",
      "Cubic champion! 👑",
      "Dimension master! 🌐"
    ]
  },

  // 🕷️ WEB (Spider-themed)
  web: {
    correct: [
      "Spidey sense! 🕷️",
      "Web-slinging! 🕸️",
      "Wall-crawler! 🧗",
      "Sticky success! 🎯",
      "Spider power! ⚡",
      "Web-tastic! 🕸️",
      "Caught it! 🕷️",
      "Spectacular! ✨",
      "Neighborhood hero! 🏙️",
      "Swing-worthy! 🌆"
    ],
    wrong: [
      "Web broke! Repair! 🕸️",
      "Missed the swing! Try again! 🕷️",
      "Goblin escaped! Chase! 👺",
      "Sticky situation! Unstick! 🎯",
      "Lost your grip! Re-grab! 🧗",
      "Web-shooter jammed! Fix! 🔧"
    ],
    struggling: [
      "Great power, great responsibility! 🕷️",
      "Even Spider-Man trains! 💪",
      "Take a web break! 🕸️",
      "Your spidey sense is growing! 📈",
      "The city needs you! 🏙️"
    ],
    streak: [
      "2-web combo! 🕸️🕸️",
      "3-swing chain! 🕷️",
      "4-hero streak! 🌆",
      "5-save domination! 🏙️",
      "Amazing Spider-stat! 👑"
    ],
    complete: [
      "City saved! 🏙️",
      "All villains caught! 🕸️",
      "Web warrior! 👑",
      "Legendary Spider! 🕷️"
    ]
  },

  // 🐉 CREATURES (Mythical)
  creatures: {
    correct: [
      "Legendary! 🐉",
      "Mythical! ✨",
      "Epic creature! 🦄",
      "Beast mode! 👹",
      "Monster move! 🦖",
      "Fantastic! 🔮",
      "Phoenix rising! 🦅",
      "Dragon fire! 🔥",
      "Griffon glory! 🦅",
      "Hydra heads! 🐍"
    ],
    wrong: [
      "Dragon scorched you! Try again! 🔥",
      "Basilisk stare! Look away! 👁️",
      "Kraken grabbed! Escape! 🐙",
      "Unicorn fled! Chase! 🦄",
      "Phoenix reborn elsewhere! 🦅",
      "Chimera confused! Redirect! 👹"
    ],
    struggling: [
      "Even dragons practice! 🐉",
      "Mythical beasts train! 💪",
      "Take a legendary break! 🔮",
      "Your creature is evolving! 📈",
      "The myths believe in you! ✨"
    ],
    streak: [
      "2-beast combo! 🐉🐉",
      "3-creature chain! 🦄",
      "4-mythical streak! ✨",
      "5-legendary domination! 👑",
      "Ultimate creature! 🔥"
    ],
    complete: [
      "All creatures tamed! 🐉",
      "Bestiary complete! 📖",
      "Creature king! 👑",
      "Mythical master! ✨"
    ]
  },

  // 💅 GLAM
  glam: {
    correct: [
      "Gorgeous! 💅",
      "Fabulous! ✨",
      "Slay! 💖",
      "Flawless! 💎",
      "Stunning! 🌟",
      "Diva-licious! 👑",
      "Glitter bomb! ✨",
      "Sparkle queen! 💫",
      "Fierce! 🔥",
      "Runway ready! 👗"
    ],
    wrong: [
      "Makeup smudged! Touch up! 💄",
      "Outfit clash! Restyle! 👗",
      "Glitter spilled! Clean up! ✨",
      "Nail broke! File! 💅",
      "Hair frizz! Smooth! 💇",
      "Heel broke! Change shoes! 👠"
    ],
    struggling: [
      "Even divas practice! 💅",
      "Glam takes work! ✨",
      "Take a spa break! 🧖",
      "Your inner sparkle shines! 💎",
      "Queens never quit! 👑"
    ],
    streak: [
      "2-slay combo! 💅💅",
      "3-glam chain! ✨",
      "4-fierce streak! 💖",
      "5-diva domination! 👑",
      "Ultimate queen! 💎"
    ],
    complete: [
      "Total transformation! ✨",
      "Glam squad approved! 💅",
      "Beauty champion! 👑",
      "Flawless finish! 💎"
    ]
  },

  // 👗 FASHION
  fashion: {
    correct: [
      "Fashionista! 👗",
      "Runway ready! 💃",
      "Vogue-worthy! 📸",
      "Styled! ✨",
      "Trend-setter! 🌟",
      "Designer approved! 👔",
      "Haute couture! 👑",
      "Catwalk queen! 💫",
      "Model move! 📷",
      "Fashion forward! 👠"
    ],
    wrong: [
      "Wardrobe malfunction! Fix! 👗",
      "Out of season! Update! 🍂",
      "Trend missed! Catch up! 🏃",
      "Accessory lost! Find it! 👜",
      "Color clash! Coordinate! 🎨",
      "Pattern conflict! Match! 📐"
    ],
    struggling: [
      "Even designers sketch many times! ✏️",
      "Fashion takes practice! 👗",
      "Take a boutique break! 🛍️",
      "Your style is unique! ✨",
      "Runway awaits! 💫"
    ],
    streak: [
      "2-outfit combo! 👗👗",
      "3-style chain! 💃",
      "4-fashion streak! 📸",
      "5-trend domination! 👑",
      "Style icon! ✨"
    ],
    complete: [
      "Collection complete! 👗",
      "Fashion week conquered! 💃",
      "Style master! 👑",
      "Legendary designer! ✨"
    ]
  },

  // ❄️ ICE (Frozen-themed)
  ice: {
    correct: [
      "Let it go! ❄️",
      "Frozen perfect! 🧊",
      "Snow queen! 👑",
      "Ice-olated success! ✨",
      "Chill! 🥶",
      "Blizzard brilliant! 🌨️",
      "Snowflake! ❄️",
      "Icicle genius! 🧊",
      "Glacier great! 🏔️",
      "Arctic awesome! 🐧"
    ],
    wrong: [
      "Ice melted! Refreeze! 🌡️",
      "Snowstorm! Take cover! 🌨️",
      "Avalanche! Escape! 🏔️",
      "Slipped on ice! Get up! 🧊",
      "Thawed! Chill again! ❄️",
      "Frost failed! Re-frost! 🥶"
    ],
    struggling: [
      "Ice queens practice magic! ❄️",
      "Cold never bothered you! 🥶",
      "Take an ice castle break! 🏰",
      "Your powers are growing! 💪",
      "Winter is coming... you got this! 🌨️"
    ],
    streak: [
      "2-freeze combo! ❄️❄️",
      "3-ice chain! 🧊",
      "4-snow streak! 🌨️",
      "5-blizzard domination! 👑",
      "Ice empress! ✨"
    ],
    complete: [
      "Kingdom frozen! ❄️",
      "All ice mastered! 🧊",
      "Snow queen crowned! 👑",
      "Eternal winter! 🌨️"
    ]
  },

  // 🐴 PONY (My Little Pony)
  pony: {
    correct: [
      "Friendship is magic! 🐴",
      "Pony power! 🌈",
      "Cutie mark earned! ✨",
      "Gallop-tastic! 🎠",
      "Mare-velous! 💖",
      "Stable genius! 🏠",
      "Pony-fic! 🦄",
      "Mane event! 💫",
      "Hay-mazing! 🌾",
      "Neigh-borly! 🐎"
    ],
    wrong: [
      "Lost your horseshoe! Find it! 🧲",
      "Fell off saddle! Climb back! 🎠",
      "Wrong stable! Trot back! 🏠",
      "Mane tangled! Brush! 💇",
      "Apple fell! Pick up! 🍎",
      "Rainbow faded! Restore! 🌈"
    ],
    struggling: [
      "Friendship solves everything! 🤝",
      "Ponies help each other! 🐴",
      "Take a meadow break! 🌾",
      "Your cutie mark is forming! ✨",
      "Equestria believes in you! 💖"
    ],
    streak: [
      "2-gallop combo! 🐴🐴",
      "3-pony chain! 🌈",
      "4-friendship streak! 💖",
      "5-magic domination! ✨",
      "Princess pony! 👑"
    ],
    complete: [
      "Friendship complete! 🤝",
      "All ponies united! 🐴",
      "Pony royalty! 👑",
      "Magic master! ✨"
    ]
  },

  // 💡 NEON
  neon: {
    correct: [
      "Lit! 💡",
      "Glow up! ✨",
      "Neon bright! 🌟",
      "Electric! ⚡",
      "Luminous! 💫",
      "Radiant! 🔆",
      "Shining! 💎",
      "Illuminated! 🏮",
      "Fluorescent! 🎆",
      "Glowing success! 🌠"
    ],
    wrong: [
      "Bulb burned out! Replace! 💡",
      "Circuit broken! Fix! ⚡",
      "Light dimmed! Brighten! 🔦",
      "Neon flickered! Repair! 🌟",
      "Power outage! Restore! 🔌",
      "Glow faded! Recharge! 🔋"
    ],
    struggling: [
      "Even lights need warm-up! 💡",
      "Your glow is still there! ✨",
      "Take an LED break! 🔆",
      "Brightness is building! 📈",
      "Keep shining! 🌟"
    ],
    streak: [
      "2-light combo! 💡💡",
      "3-glow chain! ✨",
      "4-neon streak! 🌟",
      "5-electric domination! ⚡",
      "Supernova! 🌠"
    ],
    complete: [
      "Fully illuminated! 💡",
      "All lights on! 🌟",
      "Neon master! 👑",
      "Electric legend! ⚡"
    ]
  },

  // 👟 SNEAKER
  sneaker: {
    correct: [
      "Fresh! 👟",
      "Drip! 💧",
      "Fire kicks! 🔥",
      "Heat! 🌶️",
      "Grails obtained! 🏆",
      "Deadstock! 📦",
      "Retro ready! 🎨",
      "Sneakerhead! 👟",
      "Laced up! 🎯",
      "Sole-mates! 💯"
    ],
    wrong: [
      "Creased! Iron them! 👟",
      "Wrong colorway! Try again! 🎨",
      "Laces untied! Tie up! 🎗️",
      "Sole dirty! Clean! 🧽",
      "Size wrong! Resize! 📏",
      "Drop missed! Refresh! 🔄"
    ],
    struggling: [
      "Even sneakerheads take Ls! 👟",
      "Keep copping! 💪",
      "Take a sneaker store break! 🏬",
      "Your collection is growing! 📈",
      "Grails are coming! 🏆"
    ],
    streak: [
      "2-cop combo! 👟👟",
      "3-drop chain! 🔥",
      "4-heat streak! 🌶️",
      "5-grail domination! 🏆",
      "Sneaker royalty! 👑"
    ],
    complete: [
      "Full collection! 👟",
      "All grails obtained! 🏆",
      "Sneaker legend! 👑",
      "Heat master! 🔥"
    ]
  },

  // 🎮 ESPORTS
  esports: {
    correct: [
      "GG! 🎮",
      "Pro play! 🏆",
      "MVP! ⭐",
      "Clutch! 💪",
      "Ace! 🎯",
      "Tournament worthy! 🏅",
      "Pentakill! 💥",
      "Legendary! 👑",
      "Challenger tier! 📈",
      "Worlds-level! 🌍"
    ],
    wrong: [
      "Respawn! Try again! 💀",
      "Lag spike! Reconnect! 📡",
      "Trolled! Report! 🎯",
      "Ganked! Ward next time! 👁️",
      "Surrendered! Rematch! 🔄",
      "Disconnected! Rejoin! 🔌"
    ],
    struggling: [
      "Even pros practice in customs! 🎮",
      "Grind never stops! 💪",
      "Take a queue break! ⏸️",
      "Your rank is climbing! 📈",
      "Worlds awaits! 🏆"
    ],
    streak: [
      "2-kill streak! 💀💀",
      "3-multikill! 💥",
      "4-rampage! 🔥",
      "5-unstoppable! 👑",
      "GODLIKE! 🌟"
    ],
    complete: [
      "Tournament won! 🏆",
      "Championship claimed! 👑",
      "Hall of fame! 🏛️",
      "GOAT gamer! 🐐"
    ]
  },

  // 🎨 GRAFFITI
  graffiti: {
    correct: [
      "Tagged! 🎨",
      "Piece perfect! 🖌️",
      "Bomb! 💣",
      "Street art! 🎭",
      "Spray genius! 🌈",
      "Wall worthy! 🧱",
      "Urban legend! 🏙️",
      "Stencil supreme! ✂️",
      "Aerosol ace! 💨",
      "Gallery-ready! 🖼️"
    ],
    wrong: [
      "Paint dripped! Fix it! 🎨",
      "Can empty! Shake up! 💨",
      "Cops coming! Scatter! 🚨",
      "Wall wet! Wait! 💧",
      "Wrong color! Switch cans! 🌈",
      "Outline messy! Retrace! ✏️"
    ],
    struggling: [
      "Even Banksy practiced! 🎨",
      "Art takes layers! 💪",
      "Take a rooftop break! 🏢",
      "Your tag is legendary! 📈",
      "Keep bombing! 💣"
    ],
    streak: [
      "2-tag combo! 🎨🎨",
      "3-piece chain! 🖌️",
      "4-wall streak! 🧱",
      "5-city domination! 🏙️",
      "Street legend! 👑"
    ],
    complete: [
      "City bombed! 🏙️",
      "All walls tagged! 🎨",
      "Urban king! 👑",
      "Graffiti legend! 🖼️"
    ]
  },

  // 🐨 DEFAULT (fallback)
  default: {
    correct: [
      "Correct! ✅",
      "Great job! 🌟",
      "Perfect! 💯",
      "Excellent! ⭐",
      "Well done! 👍",
      "Amazing! 🎉",
      "Fantastic! 🔥",
      "Brilliant! 💡",
      "Outstanding! 🏆",
      "Superb! ✨"
    ],
    wrong: [
      "Not quite! Try again! 💪",
      "Almost! Keep going! 🎯",
      "Close! One more time! 🔄",
      "Oops! Let's retry! 🤔",
      "Good try! Again! 📚",
      "Keep trying! 💭"
    ],
    struggling: [
      "This is tough! You got this! 💪",
      "Don't give up! 🌟",
      "Take a break! Come back! ☕",
      "You're learning! Keep going! 📈",
      "Practice makes perfect! 🎯"
    ],
    streak: [
      "2 in a row! 🔥",
      "3 correct! Hot! 🌶️",
      "4 straight! Amazing! ⚡",
      "5 streak! Unstoppable! 🏆",
      "Perfect streak! 👑"
    ],
    complete: [
      "All done! Great work! 🏆",
      "Complete! You did it! 🎉",
      "Finished! Excellent! ⭐",
      "Success! Well done! 💫"
    ]
  }
}

// 🎯 HELPER FUNCTION
export function getThemeMessage(
  themeId: ThemeId,
  messageType: 'correct' | 'wrong' | 'struggling' | 'streak' | 'complete',
  index?: number
): string {
  const messages = THEME_ENCOURAGEMENT[themeId]?.[messageType] || THEME_ENCOURAGEMENT.default[messageType]

  if (index !== undefined && index < messages.length) {
    return messages[index]
  }

  return messages[Math.floor(Math.random() * messages.length)]
}

// 🌟 SMART THEME MESSAGE SELECTOR
export function getSmartThemeMessage(context: {
  themeId: ThemeId
  isCorrect: boolean
  consecutiveWrong: number
  streakCorrect: number
}): string {
  const { themeId, isCorrect, consecutiveWrong, streakCorrect } = context

  // Determine message type
  if (isCorrect && streakCorrect >= 2 && streakCorrect <= 5) {
    return getThemeMessage(themeId, 'streak', streakCorrect - 2)
  } else if (isCorrect) {
    return getThemeMessage(themeId, 'correct')
  } else if (consecutiveWrong >= 3) {
    return getThemeMessage(themeId, 'struggling')
  } else {
    return getThemeMessage(themeId, 'wrong')
  }
}
