'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Upload, Check, X, HelpCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumButton from '@/components/ui/premium-button';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/lib/theme-context';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import GigiCharacter from '@/components/animations/GigiCharacter';
import PageTransition from '@/components/animations/PageTransition';

type Category = 'syllabus' | 'homework' | 'test' | 'calendar' | 'report_card' | 'general';

interface CategoryOption {
  id: Category;
  label: string;
  icon: string;
  description: string;
}

const categories: CategoryOption[] = [
  { id: 'syllabus', label: 'Syllabus', icon: '📋', description: 'School curriculum' },
  { id: 'homework', label: 'Homework', icon: '📝', description: 'Daily assignments' },
  { id: 'test', label: 'Test/Quiz', icon: '📊', description: 'Tests and quizzes' },
  { id: 'calendar', label: 'Calendar', icon: '📅', description: 'School schedule' },
  { id: 'report_card', label: 'Report Card', icon: '🎓', description: 'Grades and reports' },
  { id: 'general', label: 'General', icon: '📁', description: 'Other school stuff' },
];

export default function ScanPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const kidId = params.id as string;

  const [step, setStep] = useState<'upload' | 'categorize' | 'help' | 'processing'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [suggestedCategory, setSuggestedCategory] = useState<Category>('general');
  const [selectedCategory, setSelectedCategory] = useState<Category>('general');
  const [subject, setSubject] = useState('');
  const [needsHelp, setNeedsHelp] = useState(false);
  const [helpRequest, setHelpRequest] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const suggested = simulateAICategorization(file.name);
    setSuggestedCategory(suggested);
    setSelectedCategory(suggested);

    setStep('categorize');
  };

  const simulateAICategorization = (fileName: string): Category => {
    const name = fileName.toLowerCase();
    if (name.includes('syllabus') || name.includes('curriculum')) return 'syllabus';
    if (name.includes('homework') || name.includes('assignment')) return 'homework';
    if (name.includes('test') || name.includes('quiz') || name.includes('exam')) return 'test';
    if (name.includes('calendar') || name.includes('schedule')) return 'calendar';
    if (name.includes('report') || name.includes('grade')) return 'report_card';
    return 'general';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStep('processing');

    try {
      // Create FormData to send file to API
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('docType', selectedCategory);
      formData.append('studentId', kidId);
      if (subject) {
        formData.append('subject', subject);
      }

      // Call the real scan API (uses Gemini + Grok)
      const response = await fetch('/api/scan-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const result = await response.json();

      toast({
        title: 'Success!',
        description: selectedCategory === 'syllabus'
          ? 'Syllabus scanned! Grok is generating your prep schedule...'
          : 'Your document has been scanned and saved',
      });

      setTimeout(() => {
        if (selectedCategory === 'syllabus') {
          router.push(`/kid/${kidId}/syllabus`);
        } else {
          router.push(`/kid/${kidId}/documents`);
        }
      }, 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
      setStep('upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.colors.background} pb-24`}>
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link
            href={`/kid/${kidId}`}
            className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
            style={{ color: currentTheme.colors.primary }}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
              📸 Document Scanner
            </h1>
            <p className="text-lg" style={{ color: currentTheme.colors.secondary }}>
              Scan homework, syllabi, tests, and more!
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <Card className={`${currentTheme.cardClass} overflow-hidden p-8`}>
                  <div className="mb-6 text-center">
                    <Camera className="mx-auto mb-4 h-24 w-24" style={{ color: currentTheme.colors.primary }} />
                    <h2 className="mb-2 text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                      Choose how to scan
                    </h2>
                    <p style={{ color: currentTheme.colors.secondary }}>
                      Take a photo or upload an existing image
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <PremiumButton
                      onClick={() => cameraInputRef.current?.click()}
                      className="h-32"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.secondary} 100%)`,
                      }}
                    >
                      <div className="text-center">
                        <Camera className="mx-auto mb-2 h-12 w-12" />
                        <span className="text-lg font-bold">Take Photo</span>
                      </div>
                    </PremiumButton>

                    <PremiumButton
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.secondary} 0%, ${currentTheme.colors.primary} 100%)`,
                      }}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 h-12 w-12" />
                        <span className="text-lg font-bold">Upload File</span>
                      </div>
                    </PremiumButton>
                  </div>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </Card>
              </motion.div>
            )}

            {step === 'categorize' && (
              <motion.div
                key="categorize"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {previewUrl && (
                  <Card className={`${currentTheme.cardClass} overflow-hidden p-4`}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto max-h-64 rounded-lg object-contain"
                    />
                  </Card>
                )}

                <Card className={`${currentTheme.cardClass} p-6`}>
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                    <h3 className="text-lg font-bold" style={{ color: currentTheme.colors.primary }}>
                      AI suggested: {categories.find(c => c.id === suggestedCategory)?.label}
                    </h3>
                  </div>

                  <p className="mb-4" style={{ color: currentTheme.colors.secondary }}>
                    Select the category for this document:
                  </p>

                  <div className="mb-6 grid gap-3 md:grid-cols-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          selectedCategory === cat.id
                            ? 'border-current shadow-lg'
                            : 'border-transparent bg-white/50'
                        }`}
                        style={
                          selectedCategory === cat.id
                            ? { borderColor: currentTheme.colors.primary, backgroundColor: `${currentTheme.colors.primary}20` }
                            : {}
                        }
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-bold" style={{ color: currentTheme.colors.primary }}>
                            {cat.label}
                          </span>
                          {selectedCategory === cat.id && (
                            <Check className="ml-auto h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                          )}
                        </div>
                        <p className="text-sm" style={{ color: currentTheme.colors.secondary }}>
                          {cat.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>

                  {selectedCategory === 'homework' && (
                    <div className="mb-4">
                      <label className="mb-2 block font-semibold" style={{ color: currentTheme.colors.primary }}>
                        Subject (optional):
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Math, Reading, Science"
                        className="w-full rounded-lg border-2 px-4 py-2"
                        style={{ borderColor: currentTheme.colors.primary }}
                      />
                    </div>
                  )}

                  <div
                    className="mb-6 rounded-lg p-4"
                    style={{
                      background: `${currentTheme.colors.primary}15`,
                      border: `1px solid ${currentTheme.colors.primary}30`
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                      <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>Need help with this?</span>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={needsHelp}
                        onChange={(e) => setNeedsHelp(e.target.checked)}
                        className="h-5 w-5 rounded"
                        style={{ accentColor: currentTheme.colors.primary }}
                      />
                      <span className="text-sm" style={{ color: currentTheme.colors.text }}>
                        Yes, I need help understanding or solving this
                      </span>
                    </label>
                    {needsHelp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <Textarea
                          value={helpRequest}
                          onChange={(e) => setHelpRequest(e.target.value)}
                          placeholder="What do you need help with? (e.g., 'Explain problem 5' or 'Check my answers')"
                          className="resize-none"
                          style={{ borderColor: `${currentTheme.colors.primary}50` }}
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep('upload');
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <PremiumButton
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.secondary} 100%)`,
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {isUploading ? 'Saving...' : 'Save Document'}
                    </PremiumButton>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className={`${currentTheme.cardClass} p-12`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="mx-auto mb-4 h-16 w-16"
                  >
                    <Sparkles className="h-16 w-16" style={{ color: currentTheme.colors.primary }} />
                  </motion.div>
                  <h3 className="mb-2 text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    Processing your document...
                  </h3>
                  <p style={{ color: currentTheme.colors.secondary }}>
                    AI is analyzing and saving your document
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
