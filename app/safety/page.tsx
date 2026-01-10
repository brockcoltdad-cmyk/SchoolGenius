import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Child Safety - SchoolGenius',
  description: 'Learn about child safety features and parental controls',
};

export default function SafetyPage() {
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
            <Shield className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">Child Safety</h1>
              <p className="text-lg text-slate-600">
                Your child's safety and privacy are our top priorities
              </p>
            </div>
          </div>

          <div className="space-y-8 text-slate-700">
            <section className="rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">COPPA Compliant</h2>
              </div>
              <p className="leading-relaxed text-green-800">
                SchoolGenius is fully compliant with the Children's Online Privacy Protection Act (COPPA).
                We never collect personal information from children without parental consent.
                Learn more on our{' '}
                <Link href="/coppa-compliance" className="font-semibold text-green-900 hover:underline">
                  COPPA Compliance page
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Safety Features</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-6">
                  <Lock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold text-slate-900">Secure PIN Access</h3>
                    <p className="leading-relaxed text-sm">
                      Children access their profiles using a secure PIN code that only parents can set or reset. This prevents unauthorized access and ensures children only see age-appropriate content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-6">
                  <Eye className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold text-slate-900">Parent Dashboard</h3>
                    <p className="leading-relaxed text-sm">
                      Monitor your child's learning progress, time spent, and activities through your comprehensive parent dashboard. View detailed reports and analytics at any time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-6">
                  <UserCheck className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold text-slate-900">Age-Appropriate Content</h3>
                    <p className="leading-relaxed text-sm">
                      All content is carefully curated and filtered based on your child's age and grade level. We ensure children only see educational material appropriate for their developmental stage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-6">
                  <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold text-slate-900">No Social Features</h3>
                    <p className="leading-relaxed text-sm">
                      SchoolGenius does not include chat, messaging, or social networking features. Children cannot communicate with strangers or share personal information with others.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-slate-200 p-6">
                  <Lock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold text-slate-900">Data Encryption</h3>
                    <p className="leading-relaxed text-sm">
                      All data is encrypted in transit and at rest. We use industry-standard security measures to protect your family's information.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Parental Controls</h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Content Management</h3>
                  <p className="leading-relaxed text-sm">
                    Parents can customize learning paths, disable specific subjects or themes, and control what content their child can access.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Time Limits</h3>
                  <p className="leading-relaxed text-sm">
                    Set daily time limits and schedules for learning sessions to ensure healthy screen time habits.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">Activity Reports</h3>
                  <p className="leading-relaxed text-sm">
                    Receive regular reports on your child's activities, progress, and achievements via email or through your dashboard.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Privacy Protection</h2>
              <p className="leading-relaxed mb-4">
                We are committed to protecting your child's privacy:
              </p>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>We never sell or share children's data with third parties</li>
                <li>We collect only the minimum data necessary for educational purposes</li>
                <li>Parents can view, download, or delete their child's data at any time</li>
                <li>We comply with all applicable privacy laws including COPPA, FERPA, and GDPR</li>
                <li>Regular security audits ensure ongoing protection</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                For more details, read our{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-semibold text-amber-900">Safety Tips for Parents</h2>
              </div>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed text-amber-800">
                <li>Keep your account password secure and don't share it with children</li>
                <li>Choose a PIN your child can remember but others cannot guess</li>
                <li>Regularly review your child's progress and activity reports</li>
                <li>Discuss online safety with your child</li>
                <li>Report any concerns to our support team immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Report a Concern</h2>
              <p className="leading-relaxed mb-4">
                If you have any safety concerns or notice something inappropriate, please contact us immediately:
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Contact Support
              </Link>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">Additional Resources</h2>
              <div className="space-y-2">
                <Link href="/privacy-policy" className="block text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/coppa-compliance" className="block text-blue-600 hover:underline">
                  COPPA Compliance
                </Link>
                <Link href="/data-request" className="block text-blue-600 hover:underline">
                  Data Access & Deletion
                </Link>
                <Link href="/help" className="block text-blue-600 hover:underline">
                  Help Center
                </Link>
              </div>
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
