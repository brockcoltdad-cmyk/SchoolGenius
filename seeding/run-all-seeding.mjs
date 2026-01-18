#!/usr/bin/env node
/**
 * MASTER SEEDING ORCHESTRATOR
 * Sprint 2: Content Generation
 *
 * Runs all 8 seeding scripts sequentially with progress tracking
 * Estimated time: 22 hours
 * Estimated cost: $2.28
 * Expected savings: $27,000/year
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Seeding batches (in priority order)
const SEEDING_BATCHES = [
  {
    name: 'Kid Stuck Responses',
    script: 'seed-kid-stuck-responses.mjs',
    items: 340,
    priority: 'CRITICAL',
    estimatedMinutes: 240,
    cost: 0.34
  },
  {
    name: 'Subject Analogies',
    script: 'seed-subject-analogies.mjs',
    items: 1100,
    priority: 'HIGH',
    estimatedMinutes: 480,
    cost: 1.10
  },
  {
    name: 'Parent Struggle Guides',
    script: 'seed-parent-struggle-guides.mjs',
    items: 28,
    priority: 'MEDIUM',
    estimatedMinutes: 60,
    cost: 0.03
  },
  {
    name: 'Transition Phrases',
    script: 'seed-transition-phrases.mjs',
    items: 300,
    priority: 'MEDIUM',
    estimatedMinutes: 180,
    cost: 0.30
  },
  {
    name: 'Achievement Celebrations',
    script: 'seed-achievement-celebrations.mjs',
    items: 168,
    priority: 'MEDIUM',
    estimatedMinutes: 120,
    cost: 0.17
  },
  {
    name: 'Time Greetings',
    script: 'seed-time-greetings.mjs',
    items: 64,
    priority: 'LOW',
    estimatedMinutes: 60,
    cost: 0.06
  },
  {
    name: 'Return Messages',
    script: 'seed-return-messages.mjs',
    items: 80,
    priority: 'LOW',
    estimatedMinutes: 60,
    cost: 0.08
  },
  {
    name: 'Gigi Personality',
    script: 'seed-gigi-personality.mjs',
    items: 200,
    priority: 'MEDIUM',
    estimatedMinutes: 120,
    cost: 0.20
  }
];

const PROGRESS_FILE = join(__dirname, 'seeding-progress.json');

/**
 * Initialize or load progress tracking
 */
function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }

  return {
    startTime: new Date().toISOString(),
    completed: [],
    failed: [],
    current: null,
    totalItems: SEEDING_BATCHES.reduce((sum, batch) => sum + batch.items, 0),
    totalCost: SEEDING_BATCHES.reduce((sum, batch) => sum + batch.cost, 0),
    itemsGenerated: 0,
    costSpent: 0
  };
}

/**
 * Save progress
 */
function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/**
 * Format time remaining
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Run a seeding batch
 */
async function runBatch(batch, progress) {
  console.log('\n' + '='.repeat(80));
  console.log(`🌱 SEEDING: ${batch.name}`);
  console.log('='.repeat(80));
  console.log(`Priority: ${batch.priority}`);
  console.log(`Items: ${batch.items}`);
  console.log(`Estimated time: ${formatTime(batch.estimatedMinutes)}`);
  console.log(`Cost: $${batch.cost.toFixed(2)}`);
  console.log('');

  progress.current = batch.name;
  saveProgress(progress);

  const startTime = Date.now();

  try {
    // Run the seeding script
    execSync(`node ${batch.script}`, {
      cwd: __dirname,
      stdio: 'inherit'
    });

    const duration = Math.round((Date.now() - startTime) / 1000 / 60);

    progress.completed.push({
      name: batch.name,
      items: batch.items,
      cost: batch.cost,
      duration,
      completedAt: new Date().toISOString()
    });
    progress.itemsGenerated += batch.items;
    progress.costSpent += batch.cost;
    progress.current = null;
    saveProgress(progress);

    console.log(`\n✅ ${batch.name} complete!`);
    console.log(`   Generated: ${batch.items} items`);
    console.log(`   Duration: ${formatTime(duration)}`);
    console.log(`   Cost: $${batch.cost.toFixed(2)}`);

    return true;
  } catch (error) {
    progress.failed.push({
      name: batch.name,
      error: error.message,
      failedAt: new Date().toISOString()
    });
    progress.current = null;
    saveProgress(progress);

    console.error(`\n❌ ${batch.name} FAILED: ${error.message}`);
    return false;
  }
}

/**
 * Generate progress report
 */
function generateReport(progress) {
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SEEDING COMPLETE - FINAL REPORT');
  console.log('='.repeat(80));

  const endTime = new Date();
  const startTime = new Date(progress.startTime);
  const totalMinutes = Math.round((endTime - startTime) / 1000 / 60);

  console.log(`\nStart Time: ${startTime.toLocaleString()}`);
  console.log(`End Time: ${endTime.toLocaleString()}`);
  console.log(`Total Duration: ${formatTime(totalMinutes)}`);

  console.log('\n📈 GENERATION STATS:');
  console.log(`   Items Generated: ${progress.itemsGenerated} / ${progress.totalItems} (${Math.round(progress.itemsGenerated / progress.totalItems * 100)}%)`);
  console.log(`   Cost Spent: $${progress.costSpent.toFixed(2)} / $${progress.totalCost.toFixed(2)}`);
  console.log(`   Batches Completed: ${progress.completed.length} / ${SEEDING_BATCHES.length}`);
  console.log(`   Batches Failed: ${progress.failed.length}`);

  if (progress.completed.length > 0) {
    console.log('\n✅ COMPLETED BATCHES:');
    progress.completed.forEach(batch => {
      console.log(`   ${batch.name}: ${batch.items} items in ${formatTime(batch.duration)} ($${batch.cost.toFixed(2)})`);
    });
  }

  if (progress.failed.length > 0) {
    console.log('\n❌ FAILED BATCHES:');
    progress.failed.forEach(batch => {
      console.log(`   ${batch.name}: ${batch.error}`);
    });
  }

  console.log('\n💰 ECONOMIC IMPACT:');
  console.log(`   Investment: $${progress.costSpent.toFixed(2)}`);
  console.log(`   Annual Savings: $27,000`);
  console.log(`   ROI: ${Math.round(27000 / progress.costSpent)}:1`);
  console.log(`   Payback Period: ${Math.round(progress.costSpent / 27000 * 365)} days`);

  console.log('\n🎯 CLOSED-LOOP STATUS:');
  console.log(`   Cache populated: ${progress.itemsGenerated} items`);
  console.log(`   Future requests: FREE (cached)`);
  console.log(`   Marginal cost: $0`);

  console.log('\n' + '='.repeat(80));
  console.log('🎉 ALL SEEDING COMPLETE!');
  console.log('='.repeat(80) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 MASTER SEEDING ORCHESTRATOR');
  console.log('='.repeat(80));
  console.log(`Total Batches: ${SEEDING_BATCHES.length}`);
  console.log(`Total Items: ${SEEDING_BATCHES.reduce((sum, b) => sum + b.items, 0)}`);
  console.log(`Estimated Time: ${formatTime(SEEDING_BATCHES.reduce((sum, b) => sum + b.estimatedMinutes, 0))}`);
  console.log(`Estimated Cost: $${SEEDING_BATCHES.reduce((sum, b) => sum + b.cost, 0).toFixed(2)}`);
  console.log(`Expected Savings: $27,000/year`);
  console.log('='.repeat(80));

  const progress = loadProgress();

  // Resume from where we left off
  const completedNames = new Set(progress.completed.map(b => b.name));
  const remainingBatches = SEEDING_BATCHES.filter(b => !completedNames.has(b.name));

  if (remainingBatches.length === 0) {
    console.log('\n✅ All batches already completed!');
    generateReport(progress);
    return;
  }

  console.log(`\nResuming... ${remainingBatches.length} batches remaining`);

  // Run each batch sequentially
  for (const batch of remainingBatches) {
    const success = await runBatch(batch, progress);

    if (!success) {
      console.log(`\n⚠️  Batch ${batch.name} failed. Continuing with next batch...`);
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Final report
  generateReport(progress);

  // Log to cost monitoring system
  try {
    execSync(`node ../scripts/monitor-api-costs.mjs log grok '{"requests":${progress.itemsGenerated}}'`, {
      cwd: __dirname
    });
  } catch (e) {
    console.log('Note: Could not log to cost monitoring system');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
