'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FolderOpen, ChevronRight, Download, Trash2, Eye, Camera, Calendar as CalendarIcon, FileDown, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumCard from '@/components/ui/premium-card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import DashboardShell, { useDashboardTheme } from '@/components/parent/DashboardShell';

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

interface Child {
  id: string;
  name: string;
  grade_level: string;
}

export default function ParentDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, isDark } = useDashboardTheme();
  const childId = params.childId as string;

  const [child, setChild] = useState<Child | null>(null);
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
    fetchChild();
    fetchDocuments();
    fetchCalendarEvents();
  }, [childId]);

  async function fetchChild() {
    try {
      // Demo mode with mock data
      setChild({
        id: childId,
        name: childId === '1' ? 'Emma' : 'Noah',
        grade_level: childId === '1' ? 'Grade 3' : 'Grade 5',
      });
    } catch (error) {
      console.error('Error fetching child:', error);
      toast({
        title: 'Error',
        description: 'Child not found',
        variant: 'destructive',
      });
      router.push('/dashboard');
    }
  }

  async function fetchDocuments() {
    try {
      // Demo mode - no documents
      setDocuments([]);
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
      // Demo mode - no events
      setCalendarEvents([]);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  }

  async function handleDelete(documentId: string) {
    try {
      // Demo mode - simulate deletion
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: 'Demo Mode',
        description: 'In production, document would be deleted',
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

  async function handleDownloadFolder(folderId: Category) {
    const folderDocs = documents.filter(doc => doc.category === folderId);
    toast({
      title: 'Preparing download',
      description: `Downloading ${folderDocs.length} documents...`,
    });

    setTimeout(() => {
      toast({
        title: 'Download ready',
        description: 'Your folder has been downloaded',
      });
    }, 1500);
  }

  const selectedFolderData = folders.find(f => f.id === selectedFolder);

  // Custom back button handling for folder navigation
  const handleBack = () => {
    if (selectedFolder) {
      setSelectedFolder(null);
    } else {
      router.push('/dashboard/data');
    }
  };

  return (
    <DashboardShell
      showBackButton
      backHref="/dashboard/data"
      title={child ? `${child.name}'s Documents` : 'Documents'}
      subtitle="View and manage all scanned documents"
    >
      {/* Custom back button for folder navigation */}
      {selectedFolder && (
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedFolder(null)}
            className={`gap-2 ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Folders
          </Button>
        </div>
      )}

      {!child ? (
        <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Loading...</p>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {!selectedFolder ? (
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {calendarEvents.length > 0 && (
                <Card className={`p-6 border-4 ${theme.border} ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    <h3 className={`text-lg font-bold ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                      Upcoming Events from Calendar
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {calendarEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`flex items-center justify-between rounded-lg p-3 ${isDark ? 'bg-slate-800/70' : 'bg-white/70'}`}
                      >
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>{event.event_title}</p>
                          {event.description && (
                            <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{event.description}</p>
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {isLoading ? (
                <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>Loading documents...</p>
                </Card>
              ) : documents.length === 0 ? (
                <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <Camera className={`mx-auto mb-4 h-16 w-16 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <h3 className={`mb-2 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    No documents yet
                  </h3>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    {child.name} hasn&apos;t scanned any documents yet
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {folders.map((folder, i) => (
                    <PremiumCard key={folder.id} delay={i * 0.05} className={`p-6 border-4 ${theme.border}`}>
                      <div className="mb-4 flex items-center justify-between">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${folder.color} text-3xl shadow-lg`}>
                          {folder.icon}
                        </div>
                        {folder.documents.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadFolder(folder.id)}
                            title="Download all files in this folder"
                          >
                            <FileDown className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                      <h3 className={`mb-1 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {folder.label}
                      </h3>
                      <p className={`mb-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {folder.documents.length} {folder.documents.length === 1 ? 'document' : 'documents'}
                      </p>
                      {folder.documents.length > 0 && (
                        <Button
                          onClick={() => setSelectedFolder(folder.id)}
                          variant="outline"
                          className="w-full"
                        >
                          Open Folder
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </PremiumCard>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${selectedFolderData?.color} text-3xl shadow-lg`}>
                    {selectedFolderData?.icon}
                  </div>
                  <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedFolderData?.label}
                    </h1>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      {selectedFolderData?.documents.length} {selectedFolderData?.documents.length === 1 ? 'document' : 'documents'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => selectedFolder && handleDownloadFolder(selectedFolder)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedFolderData?.documents.map((doc, i) => (
                  <PremiumCard key={doc.id} delay={i * 0.05} className={`p-4 border-4 ${theme.border}`}>
                    <div className={`mb-3 flex aspect-video items-center justify-center rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <Camera className={`h-12 w-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>

                    <div className="mb-3">
                      <h4 className={`mb-1 truncate font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {doc.file_name}
                      </h4>
                      {doc.subject && (
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{doc.subject}</p>
                      )}
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(doc.scanned_at).toLocaleDateString()}
                      </p>
                    </div>

                    {doc.needs_help && (
                      <div className="mb-3 rounded-lg bg-red-50 p-3">
                        <p className="mb-1 text-xs font-bold text-red-900">
                          ⚠️ Help Requested
                        </p>
                        {doc.help_request && (
                          <p className="text-xs text-red-800">{doc.help_request}</p>
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
                              <div className="rounded-lg bg-slate-50 p-4">
                                <p className="mb-1 font-semibold text-slate-800">Notes:</p>
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
                                onClick={() => handleDelete(doc.id)}
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
      )}
    </DashboardShell>
  );
}
