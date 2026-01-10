'use client';

import { motion } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import * as React from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  enableHover?: boolean;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, delay = 0, enableHover = true, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={
          enableHover
            ? {
                y: -8,
                rotateX: 2,
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                },
              }
            : undefined
        }
        style={{ perspective: 1000 }}
      >
        <Card
          ref={ref}
          className={cn(
            enableHover && 'hover:shadow-2xl',
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };
