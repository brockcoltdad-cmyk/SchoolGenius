import Link from 'next/link';
import { ArrowLeft, HelpCircle, BookOpen, Users, Settings, Shield } from 'lucide-react';

export const metadata = {
  title: 'Help Center - SchoolGenius',
  description: 'Get help with SchoolGenius',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-700 transition-colors hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-start gap-4">
            <HelpCircle className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">Help Center</h1>
              <p className="text-lg text-slate-600">
                Find answers to common questions and get support
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/contact"
              className="flex items-start gap-4 rounded-lg border border-slate-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <Users className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">Contact Support</h3>
                <p className="text-sm text-slate-600">Get in touch with our support team</p>
              </div>
            </Link>

            <Link
              href="/safety"
              className="flex items-start gap-4 rounded-lg border border-slate-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">Safety Information</h3>
                <p className="text-sm text-slate-600">Learn about child safety features</p>
              </div>
            </Link>
          </div>

          <div className="space-y-8 text-slate-700">
            <section>
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-slate-900">Getting Started</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">How do I add a child?</h3>
                  <p className="leading-relaxed text-sm">
                    From your dashboard, click &quot;Add Child&quot; and enter their information including name, age, and grade level. You can add multiple children to one account.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">How does the learning system work?</h3>
                  <p className="leading-relaxed text-sm">
                    SchoolGenius adapts to your child&apos;s learning pace. They complete lessons, earn coins, and unlock rewards. Our AI tracks progress and adjusts difficulty automatically.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">What subjects are covered?</h3>
                  <p className="leading-relaxed text-sm">
                    We cover core subjects including Math, Reading, Writing, Science, and more. Content is aligned with grade-level standards.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Settings className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-slate-900">Account Management</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">How do I track my child&apos;s progress?</h3>
                  <p className="leading-relaxed text-sm">
                    View detailed progress reports from your parent dashboard. Track lessons completed, time spent learning, and skill mastery.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Can I change my child&apos;s settings?</h3>
                  <p className="leading-relaxed text-sm">
                    Yes, access child settings from the dashboard to adjust difficulty, manage themes, and update profile information.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">How do I delete my account?</h3>
                  <p className="leading-relaxed text-sm">
                    Visit our{' '}
                    <Link href="/delete-account" className="text-blue-600 hover:underline">
                      account deletion page
                    </Link>
                    {' '}for information about permanently deleting your account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-slate-900">Privacy & Safety</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Is my child&apos;s data safe?</h3>
                  <p className="leading-relaxed text-sm">
                    We take data privacy seriously and are COPPA compliant. Learn more in our{' '}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    {' '}and{' '}
                    <Link href="/coppa-compliance" className="text-blue-600 hover:underline">
                      COPPA Compliance
                    </Link>
                    {' '}pages.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">What safety features are included?</h3>
                  <p className="leading-relaxed text-sm">
                    View our{' '}
                    <Link href="/safety" className="text-blue-600 hover:underline">
                      safety information page
                    </Link>
                    {' '}for details on parental controls and child safety features.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h2 className="mb-3 text-2xl font-semibold text-blue-900">Still Need Help?</h2>
              <p className="leading-relaxed mb-4 text-blue-800">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Contact Support
              </Link>
            </section>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-500">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
