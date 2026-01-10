'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';
import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { PINDialog } from '@/components/dialogs/PINDialog';
import { createClient } from '@/lib/supabase/client';

export default function KidDashboard() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;

  const [pinRequired, setPinRequired] = useState<boolean | null>(null);
  const [pinVerified, setPinVerified] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ level: 1, currency: 0, streak: 0 });

  const supabase = createClient();

  const config = themeDashboardConfigs[currentTheme.id] || themeDashboardConfigs['wwe'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_child_id', kidId);
    }
  }, [kidId]);

  useEffect(() => {
    const checkPinRequirement = async () => {
      try {
        const { data, error } = await supabase
          .from('children')
          .select('id, name, pin_required, pin_code')
          .eq('id', kidId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          router.push('/dashboard');
          return;
        }

        setChildData(data);
        setPinRequired(data.pin_required);

        const { data: childStats } = await supabase
          .from('children')
          .select('level, coins, current_streak')
          .eq('id', kidId)
          .single();

        if (childStats) {
          setStats({
            level: childStats.level || 1,
            currency: childStats.coins || 0,
            streak: childStats.current_streak || 0
          });
        }

        const sessionKey = `pin_verified_${kidId}`;
        const sessionVerified = sessionStorage.getItem(sessionKey);

        if (data.pin_required && !sessionVerified) {
          setShowPinDialog(true);
        } else {
          setPinVerified(true);
        }
      } catch (error) {
        console.error('Error checking PIN requirement:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkPinRequirement();
  }, [kidId, router]);

  const handlePinVerify = async (pin: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('pin_code')
        .eq('id', kidId)
        .maybeSingle();

      if (error) throw error;

      if (data && data.pin_code === pin) {
        const sessionKey = `pin_verified_${kidId}`;
        sessionStorage.setItem(sessionKey, 'true');
        setPinVerified(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const themeEmojiMap: Record<string, string> = {
    'wwe': '💪',
    'fortnite': '🎮',
    'minecraft': '⛏️',
    'pirate': '☠️',
    'anime': '⚡',
    'zombie': '🧟',
    'slime': '💚',
    'investor': '💰',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (pinRequired && !pinVerified) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-white font-bold text-xl">PIN Required</p>
            <p className="text-gray-400 mt-2">Please enter your PIN to continue</p>
          </div>
        </div>
        <PINDialog
          open={showPinDialog}
          onOpenChange={(open) => {
            if (!open) {
              router.push('/dashboard');
            }
            setShowPinDialog(open);
          }}
          onVerify={handlePinVerify}
          title="Enter Your PIN"
          description="Enter your 4-digit PIN to access your dashboard"
          pinLength={4}
        />
      </>
    );
  }

  return (
    <DashboardTemplate
      themeId={currentTheme.id}
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName={childData?.name || "STUDENT"}
      playerEmoji={themeEmojiMap[currentTheme.id] || '📚'}
      level={stats.level}
      currency={stats.currency}
      streak={stats.streak}
      ranking={47}
      stat1Value={4}
      stat2Value={28}
      stat3Value={156}
      currentXP={750}
      maxXP={1000}
      leaderboardLink={`/kid/${kidId}/leaderboard`}
      kidId={kidId}
    />
  );
}
