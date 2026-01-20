'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, Brain, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Zap, Target, Award,
  BookOpen, Calculator, PenTool, Sparkles, RefreshCw, Eye,
  BarChart3, Calendar, User, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardShell, { useDashboardTheme } from '@/components/parent/DashboardShell';

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
  const { theme, isDark } = useDashboardTheme();
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
      <DashboardShell showBackButton backHref="/dashboard">
        <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-purple-400' : 'border-purple-600'} mx-auto mb-4`} />
          <p className={isDark ? 'text-white' : 'text-gray-800'}>Loading monitoring data...</p>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      showBackButton
      backHref="/dashboard"
      title="AI Monitoring"
      subtitle="Track your children's learning progress and get AI-powered insights"
    >
      {/* Header actions */}
      <div className="flex items-center justify-end gap-4 mb-8">
        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isDark ? 'bg-red-900/30 border border-red-500/50' : 'bg-red-50 border border-red-200'}`}>
            <Bell className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`font-bold text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{unreadCount} new</span>
          </div>
        )}

        {/* Run analysis button */}
        <Button
          onClick={runAnalysis}
          disabled={analyzing}
          className={`bg-gradient-to-r ${theme.gradient} text-white`}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </div>

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
                    ? `border-blue-500 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`
                    : `${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <User className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{child.name}</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Grade {child.grade_level}</span>
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
          <Card className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedChildData.current_streak} days</div>
          </Card>

          <Card className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Level</span>
            </div>
            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedChildData.level}</div>
          </Card>

          <Card className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Coins</span>
            </div>
            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedChildData.coins}</div>
          </Card>

          <Card className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Last Active</span>
            </div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedChildData.last_activity_date
                ? new Date(selectedChildData.last_activity_date).toLocaleDateString()
                : 'Never'}
            </div>
          </Card>
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
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Bell className={isDark ? 'text-purple-400' : 'text-purple-600'} />
              Alerts
            </h2>
            {alerts.length > 0 && (
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{alerts.length} total</span>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className={`p-8 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <BellOff className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                    <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No alerts at this time</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Everything looks good!</p>
                  </Card>
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
                    >
                      <Card
                        className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'} ${
                          !alert.is_read ? 'ring-2 ring-blue-500/50' : ''
                        }`}
                        onClick={() => !alert.is_read && markAlertRead(alert.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{alert.title}</h3>
                              {!alert.is_read && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>New</span>
                              )}
                            </div>
                            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{alert.message}</p>
                            <div className={`flex items-center gap-2 mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                              <Clock className="h-3 w-3" />
                              {new Date(alert.created_at).toLocaleString()}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className={`${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </Card>
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
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Brain className={isDark ? 'text-cyan-400' : 'text-cyan-600'} />
              AI Insights
            </h2>
          </div>

          <div className="space-y-3">
            {insights.length === 0 ? (
              <Card className={`p-8 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <Brain className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>No insights yet</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Run analysis to generate insights</p>
              </Card>
            ) : (
              insights.map((insight, index) => {
                const Icon = INSIGHT_ICONS[insight.insight_type] || Brain;

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h3>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{insight.description}</p>
                          {insight.recommendation && (
                            <div className={`mt-2 p-2 rounded-lg ${isDark ? 'bg-cyan-900/30 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-200'}`}>
                              <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                💡 {insight.recommendation}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                style={{ width: `${insight.confidence * 100}%` }}
                              />
                            </div>
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
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
          <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <BarChart3 className={isDark ? 'text-green-400' : 'text-green-600'} />
            Recent Activity
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries.slice(0, 6).map((summary, index) => (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`p-4 border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
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
                        summary.mood_detected === 'frustrated' ? 'bg-red-100 text-red-700' :
                        summary.mood_detected === 'excited' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {summary.mood_detected}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Lessons</div>
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{summary.lessons_completed}</div>
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Accuracy</div>
                      <div className={`font-bold ${
                        summary.accuracy >= 0.8 ? 'text-green-500' :
                        summary.accuracy >= 0.6 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {Math.round(summary.accuracy * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Questions</div>
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{summary.questions_answered}</div>
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Coins</div>
                      <div className="font-bold text-yellow-500">{summary.coins_earned}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {children.length === 0 && (
        <Card className={`p-16 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <Brain className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Children Found</h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Add a child to your family to start monitoring their progress.</p>
          <Link href="/dashboard">
            <Button className={`bg-gradient-to-r ${theme.gradient} text-white`}>
              Go to Dashboard
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </Card>
      )}
    </DashboardShell>
  );
}
