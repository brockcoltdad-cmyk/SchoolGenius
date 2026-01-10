'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';

const grades = [
  { label: 'Kindergarten', value: 'K' },
  { label: 'Grade 1', value: '1' },
  { label: 'Grade 2', value: '2' },
  { label: 'Grade 3', value: '3' },
  { label: 'Grade 4', value: '4' },
  { label: 'Grade 5', value: '5' },
  { label: 'Grade 6', value: '6' },
  { label: 'Grade 7', value: '7' },
  { label: 'Grade 8', value: '8' },
  { label: 'Grade 9', value: '9' },
  { label: 'Grade 10', value: '10' },
  { label: 'Grade 11', value: '11' },
  { label: 'Grade 12', value: '12' },
];

export default function AddChildPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    pinRequired: false,
    pin: '',
    confirmPin: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (formData.pinRequired) {
      if (formData.pin.length !== 4) {
        setError('PIN must be 4 digits');
        return;
      }
      if (formData.pin !== formData.confirmPin) {
        setError('PINs do not match');
        return;
      }
      if (!/^\d{4}$/.test(formData.pin)) {
        setError('PIN must contain only numbers');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: formData.name,
          grade_level: formData.grade,
          coins: 0,
          current_theme: 'default',
          theme_level: 1,
          level: 1,
          current_streak: 0,
          pin_required: formData.pinRequired,
          pin_code: formData.pinRequired ? formData.pin : null,
        } as any)
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      router.push('/family');
    } catch (err: any) {
      setError(err.message || 'Failed to add child');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-700 transition-colors hover:text-blue-600">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">👶</div>
            <h1 className="mb-2 text-4xl font-bold text-slate-800">Add Your Child</h1>
            <p className="text-lg text-slate-600">
              Create a learning profile to get started
            </p>
          </div>

          <Card className="bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Child's Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="grade" className="mb-2 block text-sm font-semibold text-slate-700">
                  Grade Level
                </label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="pinRequired"
                    checked={formData.pinRequired}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pinRequired: checked === true,
                        pin: '',
                        confirmPin: ''
                      })
                    }
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="pinRequired"
                      className="cursor-pointer text-sm font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Require PIN to access dashboard
                    </label>
                    <p className="mt-1 text-xs text-slate-500">
                      Add an extra layer of security by requiring a 4-digit PIN
                    </p>
                  </div>
                </div>

                {formData.pinRequired && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div>
                      <label htmlFor="pin" className="mb-2 block text-xs font-semibold text-slate-700">
                        Create 4-Digit PIN
                      </label>
                      <Input
                        id="pin"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="0000"
                        value={formData.pin}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, pin: value });
                          setError('');
                        }}
                        className="text-center text-2xl tracking-widest"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPin" className="mb-2 block text-xs font-semibold text-slate-700">
                        Confirm PIN
                      </label>
                      <Input
                        id="confirmPin"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="0000"
                        value={formData.confirmPin}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, confirmPin: value });
                          setError('');
                        }}
                        className="text-center text-2xl tracking-widest"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.name || !formData.grade}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Child...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Add Child
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
