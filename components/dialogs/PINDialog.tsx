'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PINDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (pin: string) => Promise<boolean>;
  title: string;
  description: string;
  pinLength: 2 | 4;
}

export function PINDialog({
  open,
  onOpenChange,
  onVerify,
  title,
  description,
  pinLength,
}: PINDialogProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (pin.length !== pinLength) return;

    setLoading(true);
    const valid = await onVerify(pin);

    if (valid) {
      onOpenChange(false);
      setPin('');
      setError('');
    } else {
      setError('Incorrect PIN');
      setPin('');
    }

    setLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setPin('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="password"
            inputMode="numeric"
            maxLength={pinLength}
            placeholder={pinLength === 4 ? '0000' : '00'}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            className="text-center text-3xl font-bold tracking-widest"
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={pin.length !== pinLength || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
