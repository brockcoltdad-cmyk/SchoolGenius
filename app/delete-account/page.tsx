import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Delete Account - SchoolGenius',
  description: 'Request account deletion from SchoolGenius',
};

export default function DeleteAccountPage() {
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
          <div className="mb-6 flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0" />
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">Delete Account</h1>
              <p className="text-lg text-slate-600">
                Request permanent deletion of your account and data
              </p>
            </div>
          </div>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">What Happens When You Delete Your Account</h2>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>Your account and all associated data will be permanently deleted</li>
                <li>All child profiles and their progress will be removed</li>
                <li>You will lose access to all purchased themes and items</li>
                <li>This action cannot be undone</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">Data Retention</h2>
              <p className="leading-relaxed">
                We may retain certain information as required by law or for legitimate business purposes.
                See our{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                {' '}for more details about data retention and deletion.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">Alternative Options</h2>
              <p className="leading-relaxed mb-4">
                Before deleting your account, consider these alternatives:
              </p>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>Temporarily disable your account (contact support)</li>
                <li>Remove specific child profiles while keeping your account</li>
                <li>Download your data before deletion</li>
              </ul>
            </section>

            <section className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h2 className="mb-3 text-2xl font-semibold text-red-900">Request Account Deletion</h2>
              <p className="leading-relaxed mb-4 text-red-800">
                To delete your account, please contact our support team with your request. We will verify your identity and process your deletion request within 30 days.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Contact Support
              </Link>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">Questions?</h2>
              <p className="leading-relaxed">
                If you have questions about account deletion, please{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  contact us
                </Link>
                {' '}or review our{' '}
                <Link href="/data-request" className="text-blue-600 hover:underline">
                  data request information
                </Link>
                .
              </p>
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
