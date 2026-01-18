'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

interface ModeSwitcherProps {
  childId: string;
  currentMode: 'default' | 'custom' | 'school';
  hasCustomSyllabus?: boolean;
  hasScannedSyllabus?: boolean;
  onModeChange?: (newMode: 'default' | 'custom' | 'school') => void;
}

const MODES = [
  {
    value: 'default',
    label: 'Default Mode',
    icon: '🔵',
    description: 'Standard grade-level curriculum',
    fullDescription: 'Use the standard curriculum designed for your child\'s grade level. All 6 subjects are balanced with appropriate daily practice time.',
  },
  {
    value: 'custom',
    label: 'Custom Mode',
    icon: '🟣',
    description: 'Your personalized subject schedule',
    fullDescription: 'Create your own syllabus by choosing which subjects to focus on, their order, and how much time to spend on each daily.',
  },
  {
    value: 'school',
    label: 'Scanned Mode',
    icon: '🟢',
    description: 'AI-analyzed school syllabus',
    fullDescription: 'Upload your child\'s school syllabus and our AI will automatically create prep lessons 1-3 days before each topic is taught at school.',
  },
] as const;

export default function ModeSwitcher({
  childId,
  currentMode,
  hasCustomSyllabus = true,
  hasScannedSyllabus = false,
  onModeChange,
}: ModeSwitcherProps) {
  const [selectedMode, setSelectedMode] = useState<'default' | 'custom' | 'school'>(currentMode);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleModeSelect = (value: string) => {
    const newMode = value as 'default' | 'custom' | 'school';

    // Validate mode availability
    if (newMode === 'school' && !hasScannedSyllabus) {
      toast({
        title: 'No Syllabus Scanned',
        description: 'Please upload a school syllabus first before switching to Scanned Mode.',
        variant: 'destructive',
      });
      return;
    }

    // Note: We allow switching to Custom Mode even without a saved custom syllabus
    // The editor will create one on first save

    // If same mode, do nothing
    if (newMode === currentMode) {
      return;
    }

    // Otherwise, show confirmation dialog
    setSelectedMode(newMode);
    setIsConfirmOpen(true);
  };

  const handleConfirmSwitch = async () => {
    setIsSaving(true);

    try {
      // Update syllabus_settings table
      const { error } = await (supabase
        .from('syllabus_settings' as any)
        .upsert(
          {
            child_id: childId,
            mode: selectedMode,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'child_id',
          }
        ) as any);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Switched to ${MODES.find(m => m.value === selectedMode)?.label}`,
      });

      setIsConfirmOpen(false);

      // Notify parent component
      if (onModeChange) {
        onModeChange(selectedMode);
      }

      // Refresh page to update UI
      window.location.reload();

    } catch (error: any) {
      console.error('Error switching mode:', error);
      toast({
        title: 'Error',
        description: 'Failed to switch mode. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedModeInfo = MODES.find(m => m.value === selectedMode);
  const currentModeInfo = MODES.find(m => m.value === currentMode);

  return (
    <>
      <div className="space-y-4">
        {/* Removed confusing dropdown - click the cards below instead! */}
        <div className="grid gap-3 md:grid-cols-3">
          {MODES.map((mode) => {
            const isActive = mode.value === currentMode;
            // Only disable Scanned Mode if no syllabus uploaded
            const isDisabled = (mode.value === 'school' && !hasScannedSyllabus);

            return (
              <motion.div
                key={mode.value}
                onClick={() => !isDisabled && !isActive && handleModeSelect(mode.value)}
                whileHover={!isDisabled && !isActive ? { scale: 1.03 } : {}}
                className={`relative rounded-xl border-3 p-4 transition-all ${
                  isActive
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : isDisabled
                    ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-orange-200 bg-white hover:border-orange-400 cursor-pointer'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-2 -right-2 rounded-full bg-green-500 p-1 shadow-lg">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="text-center">
                  <div className="mb-2 text-4xl">{mode.icon}</div>
                  <div className="mb-1 font-black text-gray-900">{mode.label}</div>
                  <div className="text-xs text-gray-600">{mode.description}</div>
                  {isDisabled && (
                    <div className="mt-2 text-xs font-semibold text-orange-600">
                      Upload syllabus first
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="text-3xl">{selectedModeInfo?.icon}</span>
              Switch to {selectedModeInfo?.label}?
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {selectedModeInfo?.fullDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg bg-orange-50 border-2 border-orange-200 p-4">
            <p className="text-sm font-semibold text-orange-900">
              ⚠️ This will replace your current syllabus
            </p>
            <p className="text-sm text-orange-800 mt-1">
              Your current {currentModeInfo?.label} settings will be saved but not active.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSaving}
              className="border-2 border-orange-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSwitch}
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 font-black"
            >
              {isSaving ? 'Switching...' : 'Switch Mode'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
