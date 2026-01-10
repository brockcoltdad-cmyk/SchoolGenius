'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';

export default function COPPACompliancePage() {
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
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-slate-800">COPPA Compliance</h1>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-50 px-6 py-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Fully COPPA Compliant</span>
            </div>
          </div>

          <Card className="mb-6 p-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-800">What is COPPA?</h2>
              <p className="text-slate-700">
                The Children's Online Privacy Protection Act (COPPA) is a federal law that protects the privacy of
                children under 13 years old. It requires websites and online services to obtain verifiable parental
                consent before collecting, using, or disclosing personal information from children.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8">How We Comply</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Parental Consent</h3>
                    <p className="text-slate-700">
                      Parents must create accounts for their children. We do not allow children to sign up independently.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Transparent Data Collection</h3>
                    <p className="text-slate-700">
                      We clearly explain what information we collect and how we use it in plain language.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Parent Controls</h3>
                    <p className="text-slate-700">
                      Parents can view, download, or delete their child's data at any time through the parent dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">No Third-Party Advertising</h3>
                    <p className="text-slate-700">
                      We do not display targeted ads or share children's information with advertisers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Minimal Data Collection</h3>
                    <p className="text-slate-700">
                      We only collect information necessary to provide our educational services.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Secure Data Storage</h3>
                    <p className="text-slate-700">
                      All data is encrypted and stored securely using industry-standard practices.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mt-8">Parent Rights Under COPPA</h2>
              <p className="text-slate-700">As a parent, you have the right to:</p>
              <ul className="text-slate-700 space-y-2">
                <li>Review the personal information collected from your child</li>
                <li>Refuse to allow further collection or use of your child's information</li>
                <li>Delete your child's personal information</li>
                <li>Download a copy of all collected data</li>
              </ul>

              <div className="mt-8 rounded-lg bg-blue-50 p-6">
                <h3 className="font-bold text-blue-900 mb-2">Exercise Your Rights</h3>
                <p className="text-blue-800">
                  Access all these controls through your parent dashboard's Data Management section.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mt-8">Questions?</h2>
              <p className="text-slate-700">
                If you have questions about our COPPA compliance or data practices, contact us at{' '}
                <a href="mailto:privacy@schoolgenius.com" className="text-blue-600 hover:underline">
                  privacy@schoolgenius.com
                </a>
              </p>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/privacy-policy">
              <Button variant="outline" className="w-full">
                Read Privacy Policy
              </Button>
            </Link>
            <Link href="/dashboard/data">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Manage Your Data
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
