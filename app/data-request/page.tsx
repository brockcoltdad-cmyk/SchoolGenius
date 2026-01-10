'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';

export default function DataRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-slate-800">Data Request</h1>
            <p className="text-slate-600">Request a copy of your family's data</p>
          </div>

          <Card className="mb-6 border-blue-200 bg-blue-50/50 p-6">
            <div className="flex gap-4">
              <Download className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="mb-2 font-bold text-blue-900">Instant Data Export Available</h2>
                <p className="text-sm text-blue-800">
                  You can download your child's complete data anytime through the Data Management page.
                  No waiting required!
                </p>
              </div>
            </div>
          </Card>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Self-Service Export</h3>
              <p className="mb-4 text-slate-600">
                Download all your child's data instantly in JSON format. Includes learning progress, chat history,
                scanned documents, and more.
              </p>
              <Link href="/dashboard/data">
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700">
                  Download Data Now
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Request by Email</h3>
              <p className="mb-4 text-slate-600">
                Need a specific format or have special requirements? Contact our support team and we'll prepare
                a custom export for you.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = 'mailto:privacy@schoolgenius.com?subject=Data Request'}
              >
                Email Support
              </Button>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">What's Included in Your Data Export</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <div className="text-2xl">👤</div>
                <div>
                  <h4 className="font-bold text-slate-800">Profile Information</h4>
                  <p className="text-sm text-slate-600">Name, grade, account creation date</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h4 className="font-bold text-slate-800">Learning Data</h4>
                  <p className="text-sm text-slate-600">Lessons, scores, progress tracking</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="font-bold text-slate-800">Economy Data</h4>
                  <p className="text-sm text-slate-600">Coins earned, themes owned, purchases</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">🏆</div>
                <div>
                  <h4 className="font-bold text-slate-800">Achievements</h4>
                  <p className="text-sm text-slate-600">All unlocked badges with dates</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <h4 className="font-bold text-slate-800">Chat History</h4>
                  <p className="text-sm text-slate-600">Conversations with Gigi</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">📸</div>
                <div>
                  <h4 className="font-bold text-slate-800">Scanned Documents</h4>
                  <p className="text-sm text-slate-600">All homework and document uploads</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">📅</div>
                <div>
                  <h4 className="font-bold text-slate-800">Calendar Events</h4>
                  <p className="text-sm text-slate-600">Tests, projects, important dates</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h4 className="font-bold text-slate-800">Usage Statistics</h4>
                  <p className="text-sm text-slate-600">Time spent, streaks, activity logs</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mt-6 border-amber-200 bg-amber-50/50 p-6">
            <div className="flex gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="mb-2 font-bold text-amber-900">Fast & Easy</h3>
                <p className="text-sm text-amber-800">
                  Your data export typically takes less than a second. Large files with many scanned documents
                  may take a few seconds longer.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
