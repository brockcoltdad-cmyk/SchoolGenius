'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FolderOpen, ChevronRight, Download, Trash2, Eye, Camera, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumCard from '@/components/ui/premium-card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from '@/lib/theme-context';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';

type Category = 'syllabus' | 'homework' | 'test' | 'calendar' | 'report_card' | 'general';

interface Document {
  id: string;
  file_name: string;
  category: Category;
  subject: string | null;
  notes: string | null;
  scanned_at: string;
  ai_analysis: string | null;
  needs_help: boolean;
  help_request: string | null;
}

interface CategoryFolder {
  id: Category;
  label: string;
  icon: string;
  color: string;
  documents: Document[];
}

interface CalendarEvent {
  id: string;
  event_title: string;
  event_date: string;
  event_type: string;
  description: string | null;
}

export default function DocumentsPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const { toast } = useToast();
  const kidId = params.id as string;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const folders: CategoryFolder[] = [
    { id: 'syllabus' as Category, label: 'Syllabus', icon: '📋', color: 'from-blue-500 to-blue-600', documents: [] },
    { id: 'homework' as Category, label: 'Homework', icon: '📝', color: 'from-green-500 to-green-600', documents: [] },
    { id: 'test' as Category, label: 'Tests & Quizzes', icon: '📊', color: 'from-orange-500 to-orange-600', documents: [] },
    { id: 'calendar' as Category, label: 'Calendar', icon: '📅', color: 'from-purple-500 to-purple-600', documents: [] },
    { id: 'report_card' as Category, label: 'Report Cards', icon: '🎓', color: 'from-pink-500 to-pink-600', documents: [] },
    { id: 'general' as Category, label: 'General', icon: '📁', color: 'from-slate-500 to-slate-600', documents: [] },
  ].map(folder => ({
    ...folder,
    documents: documents.filter(doc => doc.category === folder.id)
  }));

  useEffect(() => {
    fetchDocuments();
    fetchCalendarEvents();
  }, [kidId]);

  async function fetchDocuments() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('kid_scanned_docs')
        .select('*')
        .eq('child_id', kidId)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCalendarEvents() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('extracted_calendar_events')
        .select('*')
        .eq('child_id', kidId)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      setCalendarEvents(data || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  }

  async function handleDelete(documentId: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('scanned_homework')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: 'Deleted',
        description: 'Document has been deleted',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  }

  const selectedFolderData = folders.find(f => f.id === selectedFolder);

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-24">
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex items-center justify-between">
                <Link
                  href={selectedFolder ? '#' : `/kid/${kidId}`}
                  onClick={() => selectedFolder && setSelectedFolder(null)}
                  className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  {selectedFolder ? 'Back to Folders' : 'Back'}
                </Link>
                <Link href={`/kid/${kidId}/scan`}>
                  <Button
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.secondary} 100%)`,
                      color: 'white',
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Scan New
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedFolder ? (
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="mb-6 flex justify-center"
                >
                  <GigiCharacter size="lg" showName={false} />
                </motion.div>
                <h1 className="mb-2 text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                  📚 My Documents
                </h1>
                <p className="text-lg" style={{ color: currentTheme.colors.secondary }}>
                  All your scanned school stuff in one place
                </p>
              </div>

              {calendarEvents.length > 0 && (
                <Card className={`${currentTheme.cardClass} p-6`}>
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                    <h3 className="text-lg font-bold" style={{ color: currentTheme.colors.primary }}>
                      Upcoming Events
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {calendarEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-lg bg-white/50 p-3"
                      >
                        <div>
                          <p className="font-semibold" style={{ color: currentTheme.colors.primary }}>
                            {event.event_title}
                          </p>
                          {event.description && (
                            <p className="text-sm" style={{ color: currentTheme.colors.secondary }}>
                              {event.description}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: currentTheme.colors.primary }}>
                          {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {isLoading ? (
                <Card className={`${currentTheme.cardClass} p-12 text-center`}>
                  <p style={{ color: currentTheme.colors.secondary }}>Loading...</p>
                </Card>
              ) : documents.length === 0 ? (
                <Card className={`${currentTheme.cardClass} p-12 text-center`}>
                  <Camera className="mx-auto mb-4 h-16 w-16" style={{ color: currentTheme.colors.primary }} />
                  <h3 className="mb-2 text-xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    No documents yet
                  </h3>
                  <p className="mb-6" style={{ color: currentTheme.colors.secondary }}>
                    Start by scanning your first document!
                  </p>
                  <Link href={`/kid/${kidId}/scan`}>
                    <Button
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.secondary} 100%)`,
                        color: 'white',
                      }}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Scan Document
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {folders.map((folder, i) => (
                    <motion.div
                      key={folder.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => folder.documents.length > 0 && setSelectedFolder(folder.id)}
                        className={`w-full text-left ${folder.documents.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <Card className={`${currentTheme.cardClass} overflow-hidden p-6`}>
                          <div className="mb-4 flex items-center justify-between">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${folder.color} text-3xl shadow-lg`}>
                              {folder.icon}
                            </div>
                            {folder.documents.length > 0 && (
                              <ChevronRight className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                            )}
                          </div>
                          <h3 className="mb-1 text-xl font-bold" style={{ color: currentTheme.colors.primary }}>
                            {folder.label}
                          </h3>
                          <p className="text-sm" style={{ color: currentTheme.colors.secondary }}>
                            {folder.documents.length} {folder.documents.length === 1 ? 'document' : 'documents'}
                          </p>
                        </Card>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${selectedFolderData?.color} text-3xl shadow-lg`}>
                  {selectedFolderData?.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    {selectedFolderData?.label}
                  </h1>
                  <p style={{ color: currentTheme.colors.secondary }}>
                    {selectedFolderData?.documents.length} {selectedFolderData?.documents.length === 1 ? 'document' : 'documents'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedFolderData?.documents.map((doc, i) => (
                  <PremiumCard key={doc.id} delay={i * 0.05} className="p-4">
                    <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-slate-100">
                      <Camera className="h-12 w-12 text-slate-400" />
                    </div>

                    <div className="mb-3">
                      <h4 className="mb-1 truncate font-bold" style={{ color: currentTheme.colors.primary }}>
                        {doc.file_name}
                      </h4>
                      {doc.subject && (
                        <p className="text-sm" style={{ color: currentTheme.colors.secondary }}>
                          {doc.subject}
                        </p>
                      )}
                      <p className="text-xs opacity-60">
                        {new Date(doc.scanned_at).toLocaleDateString()}
                      </p>
                    </div>

                    {doc.needs_help && (
                      <div className="mb-3 rounded-lg bg-yellow-100 p-2 text-xs">
                        <p className="font-semibold text-yellow-900">Help requested</p>
                        {doc.help_request && (
                          <p className="text-yellow-800">{doc.help_request}</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{doc.file_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-100">
                              <p className="text-slate-500">Document: {doc.file_name}</p>
                            </div>
                            {doc.ai_analysis && (
                              <div className="rounded-lg bg-blue-50 p-4">
                                <p className="mb-1 font-semibold text-blue-900">AI Analysis</p>
                                <p className="text-sm text-blue-800">{doc.ai_analysis}</p>
                              </div>
                            )}
                            {doc.notes && (
                              <div>
                                <p className="mb-1 font-semibold">Notes:</p>
                                <p className="text-sm text-slate-600">{doc.notes}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleDelete(doc.id);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
