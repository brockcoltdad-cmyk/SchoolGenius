'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';

export default function PrivacyPolicyPage() {
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
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-slate-800">Privacy Policy</h1>
            <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-800">Your Privacy Matters</h2>
              <p className="text-slate-700">
                At SchoolGenius, we take your family's privacy seriously. This policy explains what data we collect,
                how we use it, and your rights to control it.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-6">Information We Collect</h3>
              <ul className="text-slate-700 space-y-2">
                <li><strong>Profile Information:</strong> Child's name, grade level, parent email</li>
                <li><strong>Learning Data:</strong> Completed lessons, scores, progress tracking</li>
                <li><strong>Uploaded Content:</strong> Scanned homework images, calendar events</li>
                <li><strong>Chat History:</strong> Conversations with Gigi (our AI tutor)</li>
                <li><strong>Usage Data:</strong> Time spent learning, features used</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mt-6">How We Use Your Data</h3>
              <ul className="text-slate-700 space-y-2">
                <li>Personalize your child's learning experience</li>
                <li>Track progress and provide insights to parents</li>
                <li>Improve our educational content and features</li>
                <li>Provide customer support</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mt-6">Data Sharing</h3>
              <p className="text-slate-700">
                We <strong>never</strong> sell your child's data. We do not share personal information with third parties
                except as required by law or with your explicit consent.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-6">Your Rights</h3>
              <ul className="text-slate-700 space-y-2">
                <li><strong>Access:</strong> View all data we store about your child</li>
                <li><strong>Download:</strong> Export a complete copy of your data</li>
                <li><strong>Delete:</strong> Permanently remove your child's account and all data</li>
                <li><strong>Control:</strong> Manage what features your child can access</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mt-6">COPPA Compliance</h3>
              <p className="text-slate-700">
                We comply with the Children's Online Privacy Protection Act (COPPA). We require verifiable parental
                consent before collecting personal information from children under 13. Parents have full control over
                their child's data through our parent dashboard.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mt-6">Contact Us</h3>
              <p className="text-slate-700">
                Questions about our privacy practices? Contact us at <a href="mailto:privacy@schoolgenius.com" className="text-blue-600 hover:underline">privacy@schoolgenius.com</a>
              </p>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/dashboard/data">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Manage Your Family's Data
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
