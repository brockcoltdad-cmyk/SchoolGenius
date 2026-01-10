'use client';

import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';
import { FloatingXPManager } from '@/components/animations/FloatingXP';
import { ParticleManager } from '@/components/animations/ParticleSystem';
import { GigiExpressionManager } from '@/components/animations/GigiExpressions';
import { SoundEffectsProvider } from '@/hooks/use-sound-effects';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SoundEffectsProvider>
          <FloatingXPManager>
            <ParticleManager>
              <GigiExpressionManager>
                {children}
              </GigiExpressionManager>
            </ParticleManager>
          </FloatingXPManager>
        </SoundEffectsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
