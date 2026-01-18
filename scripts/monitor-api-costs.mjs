#!/usr/bin/env node
/**
 * API Cost Monitoring System
 * Sprint 0, Task 4
 *
 * Tracks API usage and costs for all AI services
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Cost tracking database (local JSON file for now)
const COST_LOG_PATH = join(__dirname, '..', 'logs', 'api-costs.json');

// Cost rates (per request/token)
const COST_RATES = {
  claude: {
    name: 'Claude Sonnet 4.5',
    input: 0.000003,  // $3 per million tokens
    output: 0.000015, // $15 per million tokens
    perRequest: null
  },
  grok: {
    name: 'Grok 3',
    perRequest: 0.001, // $0.001 per request (flat)
    input: null,
    output: null
  },
  gemini: {
    name: 'Gemini 2.5 Flash',
    input: 0.00000075,  // $0.075 per 1M input chars
    output: 0.0000003,  // $0.30 per 1M output chars
    perRequest: null,
    freeTier: 20 // 20 requests/day free
  }
};

/**
 * Initialize cost tracking
 */
function initCostTracking() {
  const logsDir = join(__dirname, '..', 'logs');

  // Create logs directory if it doesn't exist
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }

  // Initialize cost log file if it doesn't exist
  if (!existsSync(COST_LOG_PATH)) {
    const initialData = {
      startDate: new Date().toISOString(),
      daily: {},
      monthly: {},
      total: {
        claude: { requests: 0, cost: 0, tokens: { input: 0, output: 0 } },
        grok: { requests: 0, cost: 0 },
        gemini: { requests: 0, cost: 0, chars: { input: 0, output: 0 } }
      }
    };
    writeFileSync(COST_LOG_PATH, JSON.stringify(initialData, null, 2));
  }

  console.log('✅ Cost tracking initialized');
}

/**
 * Log an API call
 */
function logAPICall(service, details) {
  const data = JSON.parse(readFileSync(COST_LOG_PATH, 'utf-8'));
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);

  // Initialize daily/monthly if needed
  if (!data.daily[today]) {
    data.daily[today] = {
      claude: { requests: 0, cost: 0, tokens: { input: 0, output: 0 } },
      grok: { requests: 0, cost: 0 },
      gemini: { requests: 0, cost: 0, chars: { input: 0, output: 0 } }
    };
  }
  if (!data.monthly[month]) {
    data.monthly[month] = {
      claude: { requests: 0, cost: 0, tokens: { input: 0, output: 0 } },
      grok: { requests: 0, cost: 0 },
      gemini: { requests: 0, cost: 0, chars: { input: 0, output: 0 } }
    };
  }

  // Update totals
  data.daily[today][service].requests++;
  data.monthly[month][service].requests++;
  data.total[service].requests++;

  if (service === 'claude') {
    const cost = (details.inputTokens / 1000000 * COST_RATES.claude.input) +
                 (details.outputTokens / 1000000 * COST_RATES.claude.output);
    data.daily[today][service].cost += cost;
    data.monthly[month][service].cost += cost;
    data.total[service].cost += cost;
    data.daily[today][service].tokens.input += details.inputTokens;
    data.daily[today][service].tokens.output += details.outputTokens;
    data.monthly[month][service].tokens.input += details.inputTokens;
    data.monthly[month][service].tokens.output += details.outputTokens;
    data.total[service].tokens.input += details.inputTokens;
    data.total[service].tokens.output += details.outputTokens;
  } else if (service === 'grok') {
    const cost = COST_RATES.grok.perRequest;
    data.daily[today][service].cost += cost;
    data.monthly[month][service].cost += cost;
    data.total[service].cost += cost;
  } else if (service === 'gemini') {
    const cost = (details.inputChars / 1000000 * COST_RATES.gemini.input) +
                 (details.outputChars / 1000000 * COST_RATES.gemini.output);
    data.daily[today][service].cost += cost;
    data.monthly[month][service].cost += cost;
    data.total[service].cost += cost;
    data.daily[today][service].chars.input += details.inputChars;
    data.daily[today][service].chars.output += details.outputChars;
    data.monthly[month][service].chars.input += details.inputChars;
    data.monthly[month][service].chars.output += details.outputChars;
    data.total[service].chars.input += details.inputChars;
    data.total[service].chars.output += details.outputChars;
  }

  writeFileSync(COST_LOG_PATH, JSON.stringify(data, null, 2));
}

/**
 * Generate cost report
 */
function generateReport() {
  if (!existsSync(COST_LOG_PATH)) {
    console.log('❌ No cost data found. Run initCostTracking() first.');
    return;
  }

  const data = JSON.parse(readFileSync(COST_LOG_PATH, 'utf-8'));
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);

  console.log('\n📊 API COST MONITORING REPORT');
  console.log('='.repeat(80));
  console.log(`Start Date: ${data.startDate}`);
  console.log(`Report Date: ${new Date().toISOString()}`);

  // Today's costs
  console.log('\n📅 TODAY (' + today + '):');
  if (data.daily[today]) {
    const todayData = data.daily[today];
    console.log(`   Claude:  ${todayData.claude.requests} requests, $${todayData.claude.cost.toFixed(4)}`);
    console.log(`   Grok:    ${todayData.grok.requests} requests, $${todayData.grok.cost.toFixed(4)}`);
    console.log(`   Gemini:  ${todayData.gemini.requests} requests, $${todayData.gemini.cost.toFixed(4)}`);
    const todayTotal = todayData.claude.cost + todayData.grok.cost + todayData.gemini.cost;
    console.log(`   TOTAL:   $${todayTotal.toFixed(4)}`);
  } else {
    console.log('   No usage today');
  }

  // This month's costs
  console.log('\n📅 THIS MONTH (' + month + '):');
  if (data.monthly[month]) {
    const monthData = data.monthly[month];
    console.log(`   Claude:  ${monthData.claude.requests} requests, $${monthData.claude.cost.toFixed(2)}`);
    console.log(`   Grok:    ${monthData.grok.requests} requests, $${monthData.grok.cost.toFixed(2)}`);
    console.log(`   Gemini:  ${monthData.gemini.requests} requests, $${monthData.gemini.cost.toFixed(2)}`);
    const monthTotal = monthData.claude.cost + monthData.grok.cost + monthData.gemini.cost;
    console.log(`   TOTAL:   $${monthTotal.toFixed(2)}`);
  } else {
    console.log('   No usage this month');
  }

  // All-time costs
  console.log('\n📅 ALL TIME:');
  const total = data.total;
  console.log(`   Claude:  ${total.claude.requests} requests, $${total.claude.cost.toFixed(2)}`);
  console.log(`   Grok:    ${total.grok.requests} requests, $${total.grok.cost.toFixed(2)}`);
  console.log(`   Gemini:  ${total.gemini.requests} requests, $${total.gemini.cost.toFixed(2)}`);
  const allTimeTotal = total.claude.cost + total.grok.cost + total.gemini.cost;
  console.log(`   TOTAL:   $${allTimeTotal.toFixed(2)}`);

  // Projected monthly cost
  const daysElapsed = Object.keys(data.daily).length || 1;
  const avgDailyCost = allTimeTotal / daysElapsed;
  const projectedMonthly = avgDailyCost * 30;
  console.log('\n💡 PROJECTIONS:');
  console.log(`   Average daily cost: $${avgDailyCost.toFixed(2)}`);
  console.log(`   Projected monthly: $${projectedMonthly.toFixed(2)}`);

  // Budget status
  const BUDGET_MONTHLY = 50; // $50/mo budget
  const budgetPercent = (projectedMonthly / BUDGET_MONTHLY * 100).toFixed(1);
  console.log(`   Budget ($${BUDGET_MONTHLY}/mo): ${budgetPercent}% used (projected)`);

  if (projectedMonthly > BUDGET_MONTHLY) {
    console.log(`   ⚠️  WARNING: Projected monthly cost exceeds budget by $${(projectedMonthly - BUDGET_MONTHLY).toFixed(2)}`);
  } else {
    console.log(`   ✅ Within budget (${BUDGET_MONTHLY - projectedMonthly.toFixed(2)} remaining)`);
  }

  console.log('\n✅ Report complete!\n');
}

/**
 * Create database table for cost tracking (optional - Supabase)
 */
async function createCostTrackingTable() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS api_cost_tracking (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP DEFAULT NOW(),
        service TEXT NOT NULL,
        endpoint TEXT,
        request_tokens INTEGER,
        response_tokens INTEGER,
        cost_usd DECIMAL(10, 6),
        metadata JSONB
      );

      CREATE INDEX IF NOT EXISTS api_cost_tracking_created_at_idx ON api_cost_tracking(created_at);
      CREATE INDEX IF NOT EXISTS api_cost_tracking_service_idx ON api_cost_tracking(service);
    `
  });

  if (error) {
    console.error('❌ Error creating cost tracking table:', error);
  } else {
    console.log('✅ Cost tracking table created');
  }
}

// CLI interface
const command = process.argv[2];

if (command === 'init') {
  initCostTracking();
} else if (command === 'report') {
  generateReport();
} else if (command === 'log') {
  const service = process.argv[3];
  const details = JSON.parse(process.argv[4] || '{}');
  logAPICall(service, details);
  console.log(`✅ Logged ${service} API call`);
} else {
  console.log(`
📊 API Cost Monitoring System

Usage:
  node monitor-api-costs.mjs init          Initialize cost tracking
  node monitor-api-costs.mjs report        Generate cost report
  node monitor-api-costs.mjs log <service> <details>  Log an API call

Services: claude, grok, gemini

Examples:
  node monitor-api-costs.mjs init
  node monitor-api-costs.mjs report
  node monitor-api-costs.mjs log grok '{}'
  node monitor-api-costs.mjs log claude '{"inputTokens":100,"outputTokens":200}'
  `);
}

export { initCostTracking, logAPICall, generateReport };
