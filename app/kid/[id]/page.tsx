'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';
import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { PINDialog } from '@/components/dialogs/PINDialog';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, X, ClipboardCheck, Calendar, Clock, Trophy, Sparkles } from 'lucide-react';

export default function KidDashboard() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;

  const [pinRequired, setPinRequired] = useState<boolean | null>(null);
  const [pinVerified, setPinVerified] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ level: 1, currency: 0, streak: 0 });
  const [showWeeklyTestWarning, setShowWeeklyTestWarning] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);
  const [autoScheduleDismissed, setAutoScheduleDismissed] = useState(false);

  const supabase = createClient();

  const config = themeDashboardConfigs[currentTheme.id] || themeDashboardConfigs['wwe'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_child_id', kidId);
    }
  }, [kidId]);

  useEffect(() => {
    const checkPinRequirement = async () => {
      try {
        // Check if demo mode (simple ID or demo_mode flag)
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
        const isSimpleId = !kidId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

        if (isDemoMode || isSimpleId) {
          // Demo mode: use mock data
          setChildData({
            id: kidId,
            name: kidId === '1' ? 'Demo Kid' : 'Test Student',
            pin_required: false,
            level: 5,
            coins: 500,
            current_streak: 7
          });
          setPinRequired(false);
          setPinVerified(true);
          setStats({ level: 5, currency: 500, streak: 7 });
          setLoading(false);
          return;
        }

        // Fetch all child data in one query instead of two
        const { data, error } = await supabase
          .from('children')
          .select('id, name, pin_required, pin_code, level, coins, current_streak')
          .eq('id', kidId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          router.push('/dashboard');
          return;
        }

        setChildData(data);
        setPinRequired(data.pin_required);

        // Set stats from the same query result
        setStats({
          level: data.level || 1,
          currency: data.coins || 0,
          streak: data.current_streak || 0
        });

        const sessionKey = `pin_verified_${kidId}`;
        const sessionVerified = sessionStorage.getItem(sessionKey);

        if (data.pin_required && !sessionVerified) {
          setShowPinDialog(true);
        } else {
          setPinVerified(true);
        }
      } catch (error) {
        console.error('Error checking PIN requirement:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkPinRequirement();
  }, [kidId, router]);

  // Check for weekly test warning (Thursday or later) and auto-schedule (Friday or later)
  useEffect(() => {
    const checkWeeklyTestWarning = async () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=Sunday, 4=Thursday, 5=Friday, 6=Saturday

      // Show warning Thursday (4), Friday (5), Saturday (6)
      // Sunday (0) is test day, so also show if they haven't taken it
      const isWarningDay = dayOfWeek >= 4 || dayOfWeek === 0;

      // Auto-schedule modal shows Friday (5), Saturday (6), Sunday (0) - more urgent!
      const isAutoScheduleDay = dayOfWeek >= 5 || dayOfWeek === 0;

      if (!isWarningDay) {
        setShowWeeklyTestWarning(false);
        setShowAutoScheduleModal(false);
        return;
      }

      // Check if they've already dismissed this week's warning
      const dismissKey = `weekly_test_warning_dismissed_${kidId}`;
      const autoScheduleKey = `weekly_test_auto_schedule_dismissed_${kidId}`;
      const weekKey = `${today.getFullYear()}-${Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;

      const warningDismissedValue = localStorage.getItem(dismissKey);
      const autoScheduleDismissedValue = localStorage.getItem(autoScheduleKey);

      if (warningDismissedValue === weekKey) {
        setWarningDismissed(true);
      }
      if (autoScheduleDismissedValue === weekKey) {
        setAutoScheduleDismissed(true);
      }

      // Calculate days until Sunday (deadline)
      const daysLeft = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      setDaysUntilDeadline(daysLeft);

      // Check if they've taken the weekly test this week
      try {
        // Get start of current week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const { data: testResult } = await supabase
          .from('weekly_test_results')
          .select('id, passed')
          .eq('child_id', kidId)
          .gte('taken_at', startOfWeek.toISOString())
          .order('taken_at', { ascending: false })
          .limit(1);

        // Show warning if no test taken this week OR if they failed
        const needsTest = !testResult || testResult.length === 0 || !testResult[0].passed;

        if (needsTest) {
          setShowWeeklyTestWarning(true);

          // Show auto-schedule modal on Friday/Saturday/Sunday (more urgent)
          if (isAutoScheduleDay && autoScheduleDismissedValue !== weekKey) {
            setShowAutoScheduleModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking weekly test status:', error);
      }
    };

    if (kidId) {
      checkWeeklyTestWarning();
    }
  }, [kidId]);

  const dismissWarning = () => {
    const today = new Date();
    const dismissKey = `weekly_test_warning_dismissed_${kidId}`;
    const weekKey = `${today.getFullYear()}-${Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
    localStorage.setItem(dismissKey, weekKey);
    setWarningDismissed(true);
    setShowWeeklyTestWarning(false);
  };

  const dismissAutoSchedule = () => {
    const today = new Date();
    const autoScheduleKey = `weekly_test_auto_schedule_dismissed_${kidId}`;
    const weekKey = `${today.getFullYear()}-${Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
    localStorage.setItem(autoScheduleKey, weekKey);
    setAutoScheduleDismissed(true);
    setShowAutoScheduleModal(false);
  };

  const handlePinVerify = async (pin: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('pin_code')
        .eq('id', kidId)
        .maybeSingle();

      if (error) throw error;

      if (data && data.pin_code === pin) {
        const sessionKey = `pin_verified_${kidId}`;
        sessionStorage.setItem(sessionKey, 'true');
        setPinVerified(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const themeEmojiMap: Record<string, string> = {
    'wwe': '💪',
    'fortnite': '🎮',
    'minecraft': '⛏️',
    'pirate': '☠️',
    'anime': '⚡',
    'zombie': '🧟',
    'slime': '💚',
    'investor': '💰',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (pinRequired && !pinVerified) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-white font-bold text-xl">PIN Required</p>
            <p className="text-gray-400 mt-2">Please enter your PIN to continue</p>
          </div>
        </div>
        <PINDialog
          open={showPinDialog}
          onOpenChange={(open) => {
            if (!open) {
              router.push('/dashboard');
            }
            setShowPinDialog(open);
          }}
          onVerify={handlePinVerify}
          title="Enter Your PIN"
          description="Enter your 4-digit PIN to access your dashboard"
          pinLength={4}
        />
      </>
    );
  }

  return (
    <>
      {/* Weekly Test Warning Banner */}
      <AnimatePresence>
        {showWeeklyTestWarning && !warningDismissed && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600 p-1">
              <div className="bg-black/90 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </motion.div>
                    <div>
                      <div className="text-yellow-400 font-black text-lg">
                        {daysUntilDeadline === 0
                          ? "TODAY IS THE DEADLINE!"
                          : daysUntilDeadline === 1
                            ? "ONLY 1 DAY LEFT!"
                            : `${daysUntilDeadline} DAYS LEFT!`}
                      </div>
                      <div className="text-white text-sm">
                        Take your Weekly Rules Test before Sunday to earn 50 coins!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/kid/${kidId}/weekly-test`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                      >
                        <ClipboardCheck className="h-5 w-5" />
                        TAKE TEST NOW
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={dismissWarning}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Friday Auto-Schedule Modal - Full screen, harder to dismiss */}
      <AnimatePresence>
        {showAutoScheduleModal && !autoScheduleDismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 max-w-lg w-full border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20"
            >
              {/* Scheduled Badge */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2 rounded-full flex items-center gap-2"
                >
                  <Calendar className="h-5 w-5 text-black" />
                  <span className="text-black font-black text-lg">AUTO-SCHEDULED</span>
                </motion.div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                    <ClipboardCheck className="h-12 w-12 text-black" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-black text-center text-white mb-2">
                Weekly Test Time!
              </h2>

              {/* Urgency message */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`text-2xl font-black ${
                    daysUntilDeadline === 0
                      ? 'text-red-500'
                      : daysUntilDeadline === 1
                        ? 'text-orange-500'
                        : 'text-yellow-500'
                  }`}
                >
                  {daysUntilDeadline === 0
                    ? "⚠️ LAST CHANCE - TODAY!"
                    : daysUntilDeadline === 1
                      ? "⏰ ONLY 1 DAY LEFT!"
                      : `📅 ${daysUntilDeadline} DAYS REMAINING`}
                </motion.div>
                <p className="text-gray-400 mt-2">
                  Your weekly rules test has been scheduled
                </p>
              </div>

              {/* Reward info */}
              <div className="bg-black/50 rounded-xl p-4 mb-6 border border-yellow-500/30">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <span className="text-white font-bold">Pass with 80%</span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 font-black text-xl">50</span>
                    <span className="text-yellow-500 font-bold">COINS!</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Link href={`/kid/${kidId}/weekly-test`} className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-black font-black text-xl py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/30"
                  >
                    <ClipboardCheck className="h-6 w-6" />
                    START TEST NOW
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={dismissAutoSchedule}
                  className="w-full bg-gray-800 text-gray-400 font-bold py-3 rounded-xl border border-gray-700 hover:text-white hover:border-gray-600 transition-colors text-sm"
                >
                  Remind me later (Parent Override)
                </motion.button>
              </div>

              {/* Timer effect */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>Test takes about 10-15 minutes</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add padding when warning is shown */}
      <div className={showWeeklyTestWarning && !warningDismissed ? 'pt-20' : ''}>
        <DashboardTemplate
          themeId={currentTheme.id}
          colors={config.colors}
          content={config.content}
          subjects={config.subjects}
          bottomNav={config.bottomNav}
          playerName={childData?.name || "STUDENT"}
          playerEmoji={themeEmojiMap[currentTheme.id] || '📚'}
          level={stats.level}
          currency={stats.currency}
          streak={stats.streak}
          ranking={47}
          stat1Value={4}
          stat2Value={28}
          stat3Value={156}
          currentXP={750}
          maxXP={1000}
          leaderboardLink={`/kid/${kidId}/leaderboard`}
          kidId={kidId}
        />
      </div>
    </>
  );
}
