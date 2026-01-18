#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'

if (!existsSync('./seeding-output')) {
  console.log('No seeding-output directory found')
  process.exit(1)
}

const files = await readdir('./seeding-output')
const jsonFiles = files.filter(f => f.endsWith('.json'))

let totals = {
  kidStuck: 0,
  analogies: 0,
  encouragements: 0,
  mistakes: 0
}

console.log('\n📊 ITEM COUNT REPORT\n')

for (const file of jsonFiles.sort()) {
  try {
    const content = await readFile(`./seeding-output/${file}`, 'utf-8')
    const data = JSON.parse(content)
    const count = Array.isArray(data) ? data.length : 0

    if (count > 0) {
      console.log(`${file.padEnd(40)} ${count} items`)

      if (file.includes('kid-stuck')) totals.kidStuck += count
      else if (file.includes('subject-analogies')) totals.analogies += count
      else if (file.includes('encouragements')) totals.encouragements += count
      else if (file.includes('mistake')) totals.mistakes += count
    }
  } catch (e) {
    // Skip invalid files
  }
}

console.log('\n' + '='.repeat(60))
console.log('TOTALS:')
console.log(`  Kid stuck responses:  ${totals.kidStuck}`)
console.log(`  Subject analogies:    ${totals.analogies}`)
console.log(`  Encouragements:       ${totals.encouragements}`)
console.log(`  Mistake responses:    ${totals.mistakes}`)
console.log('  ' + '-'.repeat(56))
console.log(`  TOTAL:                ${totals.kidStuck + totals.analogies + totals.encouragements + totals.mistakes}`)
console.log(`  TARGET:               2,280`)
console.log(`  REMAINING:            ${2280 - (totals.kidStuck + totals.analogies + totals.encouragements + totals.mistakes)}`)
console.log('='.repeat(60))
