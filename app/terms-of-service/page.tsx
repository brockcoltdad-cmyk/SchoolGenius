import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - SchoolGenius',
  description: 'Terms of Service for SchoolGenius',
};

export default function TermsOfServicePage() {
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
          <h1 className="mb-8 text-4xl font-bold text-slate-900">Terms of Service</h1>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using SchoolGenius, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">2. Use License</h2>
              <p className="leading-relaxed">
                Permission is granted to temporarily access the materials on SchoolGenius for personal, non-commercial use only.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">3. User Account</h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">4. Content Guidelines</h2>
              <p className="leading-relaxed">
                Users must not post or transmit any unlawful, threatening, defamatory, obscene, or otherwise objectionable material through our service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">5. Termination</h2>
              <p className="leading-relaxed">
                We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">6. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  contact page
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
