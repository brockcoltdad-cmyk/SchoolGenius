'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bell, BellOff, Brain, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Zap, Target, Award,
  BookOpen, Calculator, PenTool, Sparkles, RefreshCw, Eye,
  BarChart3, Calendar, User, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';

/**
 * SELF-MONITORING AI DASHBOARD
 *
 * Shows parents:
 * - Active alerts (struggling, inactive, achievements)
 * - AI-generated insights about their children
 * - Daily/weekly summaries
 * - Learning patterns and recommendations
 */

interface Alert {
  id: string;
  child_id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'urgent';
  title: string;
  message: string;
  subject_code?: string;
  is_read: boolean;
  created_at: string;
  data: any;
}

interface Insight {
  id: string;
  child_id: string;
  insight_type: string;
  title: string;
  description: string;
  recommendation?: string;
  confidence: number;
}

interface DailySummary {
  id: string;
  child_id: string;
  summary_date: string;
  questions_answered: number;
  questions_correct: number;
  accuracy: number;
  lessons_completed: number;
  coins_earned: number;
  subject_breakdown: Record<string, { completed: number; avgScore: number }>;
  mood_detected?: string;
}

interface Child {
  id: string;
  name: string;
  grade_level: string | null;
  current_streak: number | null;
  coins: number | null;
  level: number | null;
  last_activity_date?: string | null;
}

const ALERT_ICONS: Record<string, any> = {
  struggling: AlertTriangle,
  inactive: Clock,
  streak_broken: TrendingDown,
  low_accuracy: TrendingDown,
  frustration_detected: AlertTriangle,
  milestone_achieved: Award,
  improvement: TrendingUp,
  subject_weakness: BookOpen,
  test_reminder: Bell,
  celebration: Sparkles,
};

const ALERT_COLORS: Record<string, string> = {
  info: 'from-blue-500 to-cyan-500',
  warning: 'from-yellow-500 to-orange-500',
  urgent: 'from-red-500 to-pink-500',
};

const INSIGHT_ICONS: Record<string, any> = {
  learning_pattern: Brain,
  best_time: Clock,
  subject_strength: TrendingUp,
  subject_weakness: TrendingDown,
  pace_recommendation: Zap,
  encouragement_style: Sparkles,
  break_pattern: Clock,
  focus_time: Target,
};

export default function MonitoringDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load children and data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user's family
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: family } = await supabase
          .from('families')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!family) {
          setLoading(false);
          return;
        }

        // Get children
        const { data: childrenData } = await supabase
          .from('children')
          .select('id, name, grade_level, current_streak, coins, level, last_activity_date')
          .eq('parent_id', user.id);

        if (childrenData && childrenData.length > 0) {
          setChildren(childrenData as Child[]);
          setSelectedChild(childrenData[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load monitoring data for selected child
  useEffect(() => {
    if (!selectedChild) return;

    const loadMonitoringData = async () => {
      try {
        const response = await fetch(`/api/monitoring?childId=${selectedChild}&type=all`);
        const data = await response.json();

        if (data.alerts) setAlerts(data.alerts);
        if (data.insights) setInsights(data.insights);
        if (data.summaries) setSummaries(data.summaries);
        if (data.unreadCount !== undefined) setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error('Error loading monitoring data:', error);
      }
    };

    loadMonitoringData();
  }, [selectedChild]);

  // Run analysis
  const runAnalysis = async () => {
    if (!selectedChild) return;

    setAnalyzing(true);
    try {
      await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: selectedChild, action: 'full_analysis' }),
      });

      // Reload data
      const response = await fetch(`/api/monitoring?childId=${selectedChild}&type=all`);
      const data = await response.json();

      if (data.alerts) setAlerts(data.alerts);
      if (data.insights) setInsights(data.insights);
      if (data.summaries) setSummaries(data.summaries);
      if (data.unreadCount !== undefined) setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  // Mark alert as read
  const markAlertRead = async (alertId: string) => {
    try {
      await supabase
        .from('monitoring_alerts')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', alertId);

      setAlerts(alerts.map(a =>
        a.id === alertId ? { ...a, is_read: true } : a
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking alert read:', error);
    }
  };

  // Dismiss alert
  const dismissAlert = async (alertId: string) => {
    try {
      await supabase
        .from('monitoring_alerts')
        .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
        .eq('id', alertId);

      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const selectedChildData = children.find(c => c.id === selectedChild);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-400" />
                <h1 className="text-xl font-bold text-white">AI Monitoring</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Unread badge */}
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-3 py-1">
                  <Bell className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 font-bold text-sm">{unreadCount} new</span>
                </div>
              )}

              {/* Run analysis button */}
              <motion.button
                onClick={runAnalysis}
                disabled={analyzing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/50 rounded-lg px-4 py-2 text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
                {analyzing ? 'Analyzing...' : 'Run Analysis'}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Child selector */}
        {children.length > 1 && (
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {children.map(child => (
                <motion.button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                    selectedChild === child.id
                      ? 'bg-purple-500/30 border-purple-500 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:border-white/40'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{child.name}</span>
                  <span className="text-sm opacity-70">Grade {child.grade_level}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Quick stats */}
        {selectedChildData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-3xl font-black text-white">{selectedChildData.current_streak} days</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">Level</span>
              </div>
              <div className="text-3xl font-black text-white">{selectedChildData.level}</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">Coins</span>
              </div>
              <div className="text-3xl font-black text-white">{selectedChildData.coins}</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Last Active</span>
              </div>
              <div className="text-lg font-bold text-white">
                {selectedChildData.last_activity_date
                  ? new Date(selectedChildData.last_activity_date).toLocaleDateString()
                  : 'Never'}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Alerts section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-400" />
                Alerts
              </h2>
              {alerts.length > 0 && (
                <span className="text-white/50 text-sm">{alerts.length} total</span>
              )}
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-8 text-center"
                  >
                    <BellOff className="h-12 w-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50">No alerts at this time</p>
                    <p className="text-white/30 text-sm mt-1">Everything looks good!</p>
                  </motion.div>
                ) : (
                  alerts.slice(0, 5).map((alert, index) => {
                    const Icon = ALERT_ICONS[alert.alert_type] || Bell;
                    const colorClass = ALERT_COLORS[alert.severity] || ALERT_COLORS.info;

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative bg-gradient-to-r ${colorClass} bg-opacity-10 border border-white/10 rounded-xl p-4 ${
                          !alert.is_read ? 'ring-2 ring-white/20' : ''
                        }`}
                        onClick={() => !alert.is_read && markAlertRead(alert.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white truncate">{alert.title}</h3>
                              {!alert.is_read && (
                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">New</span>
                              )}
                            </div>
                            <p className="text-white/70 text-sm">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-white/40 text-xs">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.created_at).toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className="text-white/30 hover:text-white/70 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Insights section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                AI Insights
              </h2>
            </div>

            <div className="space-y-3">
              {insights.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <Brain className="h-12 w-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50">No insights yet</p>
                  <p className="text-white/30 text-sm mt-1">Run analysis to generate insights</p>
                </div>
              ) : (
                insights.map((insight, index) => {
                  const Icon = INSIGHT_ICONS[insight.insight_type] || Brain;

                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1">{insight.title}</h3>
                          <p className="text-white/70 text-sm">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                              <p className="text-cyan-300 text-sm">
                                💡 {insight.recommendation}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                style={{ width: `${insight.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-white/40 text-xs">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Daily summaries */}
        {summaries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-green-400" />
              Recent Activity
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaries.slice(0, 6).map((summary, index) => (
                <motion.div
                  key={summary.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(summary.summary_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {summary.mood_detected && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        summary.mood_detected === 'frustrated' ? 'bg-red-500/20 text-red-300' :
                        summary.mood_detected === 'excited' ? 'bg-green-500/20 text-green-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {summary.mood_detected}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-white/50 text-xs">Lessons</div>
                      <div className="text-white font-bold">{summary.lessons_completed}</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Accuracy</div>
                      <div className={`font-bold ${
                        summary.accuracy >= 0.8 ? 'text-green-400' :
                        summary.accuracy >= 0.6 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {Math.round(summary.accuracy * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Questions</div>
                      <div className="text-white font-bold">{summary.questions_answered}</div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Coins</div>
                      <div className="text-yellow-400 font-bold">{summary.coins_earned}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {children.length === 0 && (
          <div className="text-center py-16">
            <Brain className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Children Found</h2>
            <p className="text-white/50 mb-6">Add a child to your family to start monitoring their progress.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
