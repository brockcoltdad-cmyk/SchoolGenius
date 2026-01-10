'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Download, Trash2, AlertTriangle, FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumButton from '@/components/ui/premium-button';
import PremiumCard from '@/components/ui/premium-card';
import Footer from '@/components/ui/footer';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface Child {
  id: string;
  name: string;
  grade_level: string;
  created_at: string;
}

export default function DataManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingChild, setDeletingChild] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState('');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  async function fetchChildren() {
    try {
      // Demo mode with mock data
      setChildren([
        {
          id: '1',
          name: 'Emma',
          grade_level: 'Grade 3',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Noah',
          grade_level: 'Grade 5',
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: 'Error',
        description: 'Failed to load children data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownloadData(childId: string, childName: string) {
    toast({
      title: 'Demo Mode',
      description: `In production, this would export all data for ${childName}`,
    });

    try {
      // Mock data for demo
      const profile = {
        name: childName,
        grade_level: childId === '1' ? 'Grade 3' : 'Grade 5',
        coins: 1247,
        created_at: new Date().toISOString()
      };
      const tasks: any[] = [];
      const themes: any[] = [];
      const achievements: any[] = [];
      const chatHistory: any[] = [];
      const scannedHomework: any[] = [];
      const learningSessions: any[] = [];
      const calendarEvents: any[] = [];

      const exportData = {
        exported_at: new Date().toISOString(),
        child_name: childName,
        profile: profile,
        learning: {
          tasks: tasks || [],
          sessions: learningSessions || [],
          total_sessions: learningSessions?.length || 0,
          total_coins_earned: tasks?.reduce((sum, t) => sum + (t.completed ? t.coins_reward : 0), 0) || 0
        },
        economy: {
          current_coins: profile?.coins || 0,
          themes_owned: themes || [],
          themes_count: themes?.length || 0
        },
        achievements: achievements || [],
        chat_history: chatHistory || [],
        scanned_documents: scannedHomework || [],
        calendar_events: calendarEvents || [],
        statistics: {
          account_created: profile?.created_at,
          total_achievements: achievements?.length || 0,
          total_chat_messages: chatHistory?.length || 0,
          total_documents_scanned: scannedHomework?.length || 0
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${childName.toLowerCase().replace(/\s+/g, '-')}-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download complete!',
        description: `${childName}'s complete learning record has been exported.`,
      });
    } catch (error) {
      console.error('Error downloading data:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function handleDeleteAccount() {
    if (!selectedChild || confirmName !== selectedChild.name) {
      toast({
        title: 'Name mismatch',
        description: 'Please type the child\'s name exactly to confirm deletion',
        variant: 'destructive',
      });
      return;
    }

    setDeletingChild(selectedChild.id);

    try {
      // Demo mode - simulate deletion
      toast({
        title: 'Demo Mode',
        description: `In production, ${selectedChild.name}'s account would be permanently deleted.`,
      });

      setTimeout(() => {
        setChildren(children.filter(c => c.id !== selectedChild.id));
        setSelectedChild(null);
        setConfirmName('');
        setDeletingChild(null);
      }, 500);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
      setDeletingChild(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Data Management</h1>
              <p className="text-sm text-slate-600">View, download, or delete your family's data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-8 border-blue-200 bg-blue-50/50 p-6">
            <div className="flex gap-4">
              <div className="text-4xl">🔒</div>
              <div>
                <h2 className="mb-2 text-lg font-bold text-blue-900">Your Privacy Matters</h2>
                <p className="text-sm text-blue-800">
                  We're committed to protecting your family's privacy. You have full control over your data.
                  You can view everything we store, download it anytime, or permanently delete it.
                  We comply with COPPA and other privacy regulations.
                </p>
              </div>
            </div>
          </Card>

          <h2 className="mb-6 text-2xl font-bold text-slate-800">Your Children's Data</h2>

          {isLoading ? (
            <Card className="p-12 text-center">
              <div className="mb-4 text-4xl">⏳</div>
              <p className="text-slate-600">Loading...</p>
            </Card>
          ) : children.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mb-4 text-6xl">👶</div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">No children added yet</h3>
              <p className="mb-6 text-slate-600">Add a child to start managing their data</p>
              <Link href="/dashboard/add-child">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Add Child
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {children.map((child, i) => (
                <PremiumCard key={child.id} delay={i * 0.1} className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{child.name}</h3>
                      <p className="text-sm text-slate-600">{child.grade_level}</p>
                      <p className="text-xs text-slate-500">
                        Account created: {new Date(child.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href={`/dashboard/data/${child.id}`}>
                      <PremiumButton
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View All Data
                      </PremiumButton>
                    </Link>

                    <Link href={`/dashboard/documents/${child.id}`}>
                      <PremiumButton
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        View Documents
                      </PremiumButton>
                    </Link>

                    <PremiumButton
                      onClick={() => handleDownloadData(child.id, child.name)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Data
                    </PremiumButton>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            setSelectedChild(child);
                            setConfirmName('');
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                              <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                          </div>
                          <AlertDialogTitle className="text-center text-xl">
                            Delete {child.name}'s Account?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-center">
                            This will <strong>permanently delete</strong> {child.name}'s account and <strong>ALL data</strong> including:
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <ul className="mb-4 space-y-2 text-sm text-slate-600">
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">•</span> Learning progress and scores
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">•</span> Coins and achievements
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">•</span> Chat history with Gigi
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">•</span> All scanned homework images
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">•</span> Unlocked themes and settings
                          </li>
                        </ul>
                        <div className="rounded-lg bg-red-50 p-4">
                          <p className="mb-3 text-sm font-semibold text-red-900">
                            This action cannot be undone. To confirm, type <strong>{child.name}</strong> below:
                          </p>
                          <Input
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder={`Type "${child.name}" to confirm`}
                            className="border-red-300 focus:border-red-500"
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => {
                            setSelectedChild(null);
                            setConfirmName('');
                          }}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={confirmName !== child.name || deletingChild === child.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deletingChild === child.id ? 'Deleting...' : 'Delete Forever'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </PremiumCard>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
