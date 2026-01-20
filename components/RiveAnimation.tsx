'use client';

import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect, useCallback } from 'react';

// Available animations in public/animations/rive/
export type RiveAnimationName =
  | 'success-confetti'
  | 'confetti-explosion'
  | 'interactive-confetti'
  | 'fire-crackers'
  | 'checkmark'
  | 'success-icon'
  | 'loading-collection'
  | 'circle-spinner'
  | 'progress-bar'
  | 'animated-button'
  | 'mascot';

interface RiveAnimationProps {
  name: RiveAnimationName;
  className?: string;
  width?: number | string;
  height?: number | string;
  autoplay?: boolean;
  stateMachine?: string;
  artboard?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scaleDown';
  alignment?: 'center' | 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onLoop?: () => void;
}

const fitMap: Record<string, Fit> = {
  cover: Fit.Cover,
  contain: Fit.Contain,
  fill: Fit.Fill,
  none: Fit.None,
  scaleDown: Fit.ScaleDown,
};

const alignmentMap: Record<string, Alignment> = {
  center: Alignment.Center,
  topLeft: Alignment.TopLeft,
  topCenter: Alignment.TopCenter,
  topRight: Alignment.TopRight,
  centerLeft: Alignment.CenterLeft,
  centerRight: Alignment.CenterRight,
  bottomLeft: Alignment.BottomLeft,
  bottomCenter: Alignment.BottomCenter,
  bottomRight: Alignment.BottomRight,
};

export function RiveAnimation({
  name,
  className = '',
  width = '100%',
  height = '100%',
  autoplay = true,
  stateMachine,
  artboard,
  fit = 'contain',
  alignment = 'center',
  onLoad,
  onPlay,
  onPause,
  onStop,
  onLoop,
}: RiveAnimationProps) {
  const { rive, RiveComponent } = useRive({
    src: `/animations/rive/${name}.riv`,
    stateMachines: stateMachine,
    artboard,
    autoplay,
    layout: new Layout({
      fit: fitMap[fit],
      alignment: alignmentMap[alignment],
    }),
    onLoad: () => onLoad?.(),
    onPlay: () => onPlay?.(),
    onPause: () => onPause?.(),
    onStop: () => onStop?.(),
    onLoop: () => onLoop?.(),
  });

  return (
    <div style={{ width, height }} className={className}>
      <RiveComponent />
    </div>
  );
}

// Preset components for common use cases

interface CelebrationProps {
  type?: 'confetti' | 'fireworks' | 'success';
  className?: string;
  size?: number | string;
  onComplete?: () => void;
}

export function Celebration({
  type = 'confetti',
  className = '',
  size = 200,
  onComplete
}: CelebrationProps) {
  const animationMap: Record<string, RiveAnimationName> = {
    confetti: 'success-confetti',
    fireworks: 'fire-crackers',
    success: 'interactive-confetti',
  };

  return (
    <RiveAnimation
      name={animationMap[type]}
      width={size}
      height={size}
      className={className}
      onLoop={onComplete}
    />
  );
}

interface SuccessCheckProps {
  className?: string;
  size?: number | string;
}

export function SuccessCheck({ className = '', size = 64 }: SuccessCheckProps) {
  return (
    <RiveAnimation
      name="checkmark"
      width={size}
      height={size}
      className={className}
    />
  );
}

interface LoadingSpinnerProps {
  className?: string;
  size?: number | string;
  variant?: 'circle' | 'collection';
}

export function LoadingSpinner({
  className = '',
  size = 48,
  variant = 'circle'
}: LoadingSpinnerProps) {
  return (
    <RiveAnimation
      name={variant === 'circle' ? 'circle-spinner' : 'loading-collection'}
      width={size}
      height={size}
      className={className}
    />
  );
}

interface ProgressBarProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function AnimatedProgressBar({
  className = '',
  width = '100%',
  height = 24
}: ProgressBarProps) {
  return (
    <RiveAnimation
      name="progress-bar"
      width={width}
      height={height}
      className={className}
    />
  );
}

interface AnimatedButtonWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButtonWrapper({
  children,
  className = ''
}: AnimatedButtonWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <RiveAnimation
        name="animated-button"
        className="absolute inset-0 pointer-events-none"
      />
      {children}
    </div>
  );
}

interface MascotProps {
  className?: string;
  size?: number | string;
}

export function Mascot({ className = '', size = 150 }: MascotProps) {
  return (
    <RiveAnimation
      name="mascot"
      width={size}
      height={size}
      className={className}
    />
  );
}

export default RiveAnimation;
