'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-3xl">🐨</span>
              <span className="text-xl font-bold text-slate-800">SchoolGenius</span>
            </div>
            <p className="text-sm text-slate-600">
              Safe, fun, and effective learning for children of all ages.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-slate-600 hover:text-slate-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-slate-600 hover:text-slate-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/coppa-compliance" className="text-slate-600 hover:text-slate-900">
                  COPPA Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Your Data</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/data" className="text-slate-600 hover:text-slate-900">
                  Manage Data
                </Link>
              </li>
              <li>
                <Link href="/data-request" className="text-slate-600 hover:text-slate-900">
                  Data Request
                </Link>
              </li>
              <li>
                <Link href="/delete-account" className="text-slate-600 hover:text-slate-900">
                  Delete Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-slate-800">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-slate-600 hover:text-slate-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-slate-600 hover:text-slate-900">
                  Safety & Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} SchoolGenius. All rights reserved.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                ✓
              </div>
              <span className="text-sm font-semibold text-green-800">COPPA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
