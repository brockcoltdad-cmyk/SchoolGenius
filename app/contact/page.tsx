import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, HelpCircle, Shield } from 'lucide-react';

export const metadata = {
  title: 'Contact Us - SchoolGenius',
  description: 'Get in touch with the SchoolGenius team',
};

export default function ContactPage() {
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
            <MessageSquare className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">Contact Us</h1>
              <p className="text-lg text-slate-600">
                We&apos;re here to help with any questions or concerns
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-6">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">Email Support</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Send us an email and we&apos;ll respond within 24 hours
                </p>
                <a
                  href="mailto:support@schoolgenius.com"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  support@schoolgenius.com
                </a>
              </div>
            </div>

            <Link
              href="/help"
              className="flex items-start gap-4 rounded-lg border border-slate-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">Help Center</h3>
                <p className="text-sm text-slate-600">
                  Find answers to frequently asked questions
                </p>
              </div>
            </Link>
          </div>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">What Can We Help You With?</h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">General Support</h3>
                  <p className="leading-relaxed text-sm">
                    Questions about using the platform, features, or your account
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Technical Issues</h3>
                  <p className="leading-relaxed text-sm">
                    Problems logging in, bugs, or technical difficulties
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Educational Content</h3>
                  <p className="leading-relaxed text-sm">
                    Questions about curriculum, lessons, or learning materials
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Privacy & Safety</h3>
                  <p className="leading-relaxed text-sm">
                    Data privacy, security concerns, or child safety questions
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Account Deletion</h3>
                  <p className="leading-relaxed text-sm">
                    Visit our{' '}
                    <Link href="/delete-account" className="text-blue-600 hover:underline">
                      account deletion page
                    </Link>
                    {' '}for information about deleting your account
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Before You Contact Us</h2>
              <p className="leading-relaxed mb-4">
                To help us assist you more quickly, please:
              </p>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>Check our{' '}
                  <Link href="/help" className="text-blue-600 hover:underline">
                    Help Center
                  </Link>
                  {' '}for common questions
                </li>
                <li>Include your account email address</li>
                <li>Describe the issue in detail</li>
                <li>Mention any error messages you see</li>
                <li>Let us know what device and browser you&apos;re using</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Response Time</h2>
              <p className="leading-relaxed">
                Our support team typically responds within 24 hours during business days (Monday-Friday).
                For urgent issues, please mark your email as &quot;Urgent&quot; in the subject line.
              </p>
            </section>

            <section className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">Privacy & Data Requests</h2>
              </div>
              <p className="leading-relaxed text-blue-800 mb-4">
                For data access, correction, or deletion requests, please visit our dedicated page:
              </p>
              <Link
                href="/data-request"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Data Request Form
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
