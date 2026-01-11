'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Child {
  id: string;
  name: string;
  grade_level: string;
  avatar_url: string | null;
  coins: number;
  level: number;
  current_streak: number;
  pin_required: boolean;
  pin_code: string | null;
  current_theme: string;
}

export default function FamilySelectPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, verifyParentPIN } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinDialog, setPinDialog] = useState(false);
  const [pinType, setPinType] = useState<'parent' | 'child'>('parent');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    loadChildren();
  }, [user, authLoading]);

  const loadChildren = async () => {
    if (!user) {
      console.log('No user found, redirecting to login');
      setLoading(false);
      return;
    }

    console.log('Loading children for user:', user.id);

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading children:', error);
    } else {
      console.log('Loaded children:', data);
      setChildren((data || []) as unknown as Child[]);
    }

    setLoading(false);
  };

  const handleChildClick = (child: Child) => {
    if (child.pin_required && child.pin_code) {
      setSelectedChildId(child.id);
      setPinType('child');
      setPinDialog(true);
      setPin('');
      setPinError('');
    } else {
      router.push(`/kid/${child.id}`);
    }
  };

  const handleParentModeClick = () => {
    setPinType('parent');
    setPinDialog(true);
    setPin('');
    setPinError('');
  };

  const handlePinSubmit = async () => {
    if (pinType === 'parent') {
      const valid = await verifyParentPIN(pin);
      if (valid) {
        setPinDialog(false);
        router.push('/dashboard');
      } else {
        setPinError('Incorrect PIN');
        setPin('');
      }
    } else {
      const child = children.find(c => c.id === selectedChildId);
      if (child && child.pin_code === pin) {
        setPinDialog(false);
        router.push(`/kid/${selectedChildId}`);
      } else {
        setPinError('Incorrect PIN');
        setPin('');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <span className="text-6xl">🐨</span>
          </motion.div>
          <p className="mt-4 text-lg font-semibold text-slate-700">Loading your family...</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <span className="text-6xl block mb-4">👨‍👩‍👧‍👦</span>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SchoolGenius!</h1>
          <p className="text-slate-600 mb-6">Let&apos;s add your first child to get started.</p>
          <Button
            onClick={() => router.push('/dashboard/add-child')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Your First Child
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Who&apos;s Learning Today?</h1>
            <p className="text-slate-600 mt-1">Select a child to continue</p>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="text-slate-600 hover:text-slate-800"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-white/80 backdrop-blur-sm"
                onClick={() => handleChildClick(child)}
              >
                <div className="text-center">
                  <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {child.avatar_url || child.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{child.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">Grade {child.grade_level}</p>

                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">💰</span>
                      <span className="font-semibold text-slate-700">{child.coins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">🔥</span>
                      <span className="font-semibold text-slate-700">{child.current_streak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-blue-600">Level {child.level}</span>
                    </div>
                  </div>

                  {child.pin_required && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Lock className="h-3 w-3" />
                      <span>PIN Protected</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: children.length * 0.1 }}
          >
            <Button
              onClick={handleParentModeClick}
              variant="outline"
              className="px-8 py-6 text-lg font-semibold border-2 hover:bg-slate-100"
            >
              <Lock className="mr-2 h-5 w-5" />
              Parent Mode
            </Button>
          </motion.div>
        </div>
      </div>

      <Dialog open={pinDialog} onOpenChange={setPinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pinType === 'parent' ? 'Enter Parent PIN' : 'Enter Child PIN'}
            </DialogTitle>
            <DialogDescription>
              {pinType === 'parent'
                ? 'Enter your 4-digit parent PIN to access the dashboard'
                : 'Enter the 2-digit PIN to continue'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={pinType === 'parent' ? 4 : 2}
              placeholder={pinType === 'parent' ? '0000' : '00'}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setPinError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePinSubmit();
                }
              }}
              className="text-center text-3xl font-bold tracking-widest"
              autoFocus
            />

            {pinError && (
              <p className="text-sm text-red-600 text-center">{pinError}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPinDialog(false);
                  setPin('');
                  setPinError('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePinSubmit}
                disabled={pin.length !== (pinType === 'parent' ? 4 : 2)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
