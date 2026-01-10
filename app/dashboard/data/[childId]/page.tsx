'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, BookOpen, Coins, Award, MessageCircle, Camera, Clock, Trash2, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumCard from '@/components/ui/premium-card';
import Footer from '@/components/ui/footer';
import ThemeManagement from '@/components/parent/ThemeManagement';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ChildData {
  profile: {
    name: string;
    grade_level: string;
    created_at: string;
    coins: number;
    current_theme: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    subject: string;
    coins_reward: number;
    completed: boolean;
    completed_at: string | null;
    created_at: string;
  }>;
  themes: Array<{
    theme_id: string;
    unlocked_at: string;
  }>;
  achievements: Array<{
    badge_name: string;
    badge_description: string;
    earned_at: string;
  }>;
  chatHistory: Array<{
    message: string;
    sender: string;
    created_at: string;
  }>;
  scannedHomework: Array<{
    id: string;
    image_url: string;
    file_name: string;
    subject: string | null;
    notes: string | null;
    scanned_at: string;
  }>;
  learningSessions: Array<{
    subject: string;
    duration_minutes: number;
    score: number | null;
    lessons_completed: number;
    coins_earned: number;
    session_date: string;
  }>;
}

export default function ChildDataViewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const childId = params.childId as string;

  const [childData, setChildData] = useState<ChildData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChildData();
  }, [childId]);

  async function fetchChildData() {
    try {
      // Demo mode with mock data
      const profile = {
        name: childId === '1' ? 'Emma' : 'Noah',
        grade_level: childId === '1' ? 'Grade 3' : 'Grade 5',
        created_at: new Date().toISOString(),
        coins: childId === '1' ? 1247 : 2156,
        current_theme: 'default',
      };

      setChildData({
        profile,
        tasks: [],
        themes: [],
        achievements: [],
        chatHistory: [],
        scannedHomework: [],
        learningSessions: []
      });
    } catch (error) {
      console.error('Error fetching child data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteHomework(id: string) {
    try {
      // Demo mode - simulate deletion
      setChildData(prev => prev ? {
        ...prev,
        scannedHomework: prev.scannedHomework.filter(h => h.id !== id)
      } : null);

      toast({
        title: 'Demo Mode',
        description: 'In production, homework image would be deleted',
      });
    } catch (error) {
      console.error('Error deleting homework:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete homework',
        variant: 'destructive',
      });
    }
  }

  const totalLearningTime = childData?.learningSessions.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
  const totalCoinsEarned = childData?.learningSessions.reduce((sum, s) => sum + s.coins_earned, 0) || 0;
  const totalLessons = childData?.learningSessions.reduce((sum, s) => sum + s.lessons_completed, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Card className="p-12 text-center">
          <div className="mb-4 text-6xl">⏳</div>
          <p className="text-xl font-semibold text-slate-800">Loading data...</p>
        </Card>
      </div>
    );
  }

  if (!childData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Card className="p-12 text-center">
          <div className="mb-4 text-6xl">❌</div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">Child not found</h3>
          <Link href="/dashboard/data">
            <Button>Back to Data Management</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-12">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/data">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{childData.profile.name}'s Complete Data</h1>
              <p className="text-sm text-slate-600">All stored information for this account</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PremiumCard className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <User className="h-5 w-5" />
              Profile Information
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-sm text-slate-600">Name</p>
                <p className="font-semibold text-slate-900">{childData.profile.name}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-sm text-slate-600">Grade Level</p>
                <p className="font-semibold text-slate-900">{childData.profile.grade_level}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-sm text-slate-600">Account Created</p>
                <p className="font-semibold text-slate-900">
                  {new Date(childData.profile.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-sm text-slate-600">Current Theme</p>
                <p className="font-semibold text-slate-900">{childData.profile.current_theme}</p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5" />
              Learning Summary
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <Clock className="mb-2 h-6 w-6 text-blue-600" />
                <p className="text-2xl font-bold text-blue-900">{totalLearningTime}</p>
                <p className="text-sm text-blue-700">Total Minutes</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
                <BookOpen className="mb-2 h-6 w-6 text-green-600" />
                <p className="text-2xl font-bold text-green-900">{totalLessons}</p>
                <p className="text-sm text-green-700">Lessons Completed</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                <Coins className="mb-2 h-6 w-6 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-900">{childData.profile.coins}</p>
                <p className="text-sm text-yellow-700">Current Coins</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <Coins className="mb-2 h-6 w-6 text-purple-600" />
                <p className="text-2xl font-bold text-purple-900">{totalCoinsEarned}</p>
                <p className="text-sm text-purple-700">Total Earned</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-3 font-semibold text-slate-800">Recent Learning Sessions</h4>
              <div className="space-y-2">
                {childData.learningSessions.length === 0 ? (
                  <p className="text-sm text-slate-600">No learning sessions recorded yet</p>
                ) : (
                  childData.learningSessions.slice(0, 5).map((session, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-800">{session.subject}</span>
                        <span className="text-slate-600"> • {session.duration_minutes} min</span>
                        {session.score && <span className="text-slate-600"> • Score: {session.score}%</span>}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(session.session_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PremiumCard>

          <ThemeManagement childId={childId} childName={childData.profile.name} />

          <PremiumCard className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5" />
              Achievements ({childData.achievements.length})
            </div>
            {childData.achievements.length === 0 ? (
              <p className="text-sm text-slate-600">No achievements earned yet</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {childData.achievements.map((achievement, i) => (
                  <div key={i} className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <span className="font-bold text-orange-900">{achievement.badge_name}</span>
                    </div>
                    <p className="mb-2 text-sm text-orange-800">{achievement.badge_description}</p>
                    <p className="text-xs text-orange-600">
                      Earned {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Coins className="h-5 w-5" />
                Economy Activity
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-slate-800">Owned Themes ({childData.themes.length})</h4>
                <div className="space-y-2">
                  {childData.themes.length === 0 ? (
                    <p className="text-sm text-slate-600">No themes unlocked yet</p>
                  ) : (
                    childData.themes.map((theme, i) => (
                      <div key={i} className="rounded-lg bg-purple-50 p-3 text-sm">
                        <span className="font-semibold text-purple-900">{theme.theme_id}</span>
                        <span className="text-xs text-purple-600"> • Unlocked {new Date(theme.unlocked_at).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-slate-800">Tasks ({childData.tasks.filter(t => t.completed).length} completed)</h4>
                <div className="space-y-2">
                  {childData.tasks.length === 0 ? (
                    <p className="text-sm text-slate-600">No tasks assigned yet</p>
                  ) : (
                    childData.tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className={task.completed ? 'text-green-700 line-through' : 'text-slate-800 font-medium'}>
                            {task.title}
                          </span>
                          <span className="text-xs text-slate-500">{task.coins_reward} coins</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <MessageCircle className="h-5 w-5" />
              Chat History with Gigi ({childData.chatHistory.length} messages)
            </div>
            {childData.chatHistory.length === 0 ? (
              <p className="text-sm text-slate-600">No chat messages yet</p>
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {childData.chatHistory.map((chat, i) => (
                  <div
                    key={i}
                    className={`rounded-lg p-3 text-sm ${
                      chat.sender === 'child'
                        ? 'ml-8 bg-blue-50 text-blue-900'
                        : 'mr-8 bg-purple-50 text-purple-900'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold">{chat.sender === 'child' ? childData.profile.name : 'Gigi'}</span>
                      <span className="text-xs opacity-60">
                        {new Date(chat.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p>{chat.message}</p>
                  </div>
                ))}
              </div>
            )}
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Camera className="h-5 w-5" />
              Scanned Homework ({childData.scannedHomework.length} files)
            </div>
            {childData.scannedHomework.length === 0 ? (
              <p className="text-sm text-slate-600">No scanned homework yet</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {childData.scannedHomework.map((homework) => (
                  <div key={homework.id} className="group relative overflow-hidden rounded-lg border-2 border-slate-200 bg-white">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer">
                          <div className="flex aspect-square items-center justify-center bg-slate-100">
                            <Camera className="h-12 w-12 text-slate-400" />
                          </div>
                          <div className="p-3">
                            <p className="mb-1 truncate text-sm font-semibold text-slate-800">{homework.file_name}</p>
                            {homework.subject && (
                              <p className="mb-1 text-xs text-slate-600">{homework.subject}</p>
                            )}
                            <p className="text-xs text-slate-500">
                              {new Date(homework.scanned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <div className="space-y-4">
                          <div className="flex aspect-video items-center justify-center bg-slate-100">
                            <p className="text-slate-500">Image preview: {homework.file_name}</p>
                          </div>
                          <div>
                            <p className="font-semibold">File: {homework.file_name}</p>
                            {homework.subject && <p className="text-sm text-slate-600">Subject: {homework.subject}</p>}
                            {homework.notes && <p className="text-sm text-slate-600">Notes: {homework.notes}</p>}
                            <p className="text-xs text-slate-500">Scanned: {new Date(homework.scanned_at).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeleteHomework(homework.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </PremiumCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
