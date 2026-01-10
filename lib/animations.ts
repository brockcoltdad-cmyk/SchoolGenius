export const springConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const smoothConfig = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeInOut',
};

export const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { ...springConfig, stiffness: 500 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    rotateX: 0,
    z: 0
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothConfig
  },
  hover: {
    y: -8,
    rotateX: 2,
    z: 50,
    transition: { ...springConfig, stiffness: 300 }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const coinFloat = {
  initial: { opacity: 0, y: 0, scale: 0.5 },
  animate: {
    opacity: [0, 1, 1, 0],
    y: -100,
    scale: [0.5, 1.2, 1, 0.8],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      ease: 'easeOut'
    }
  }
};

export const celebrationBadge = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [180, 0, 0],
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

export const progressFill = {
  initial: { scaleX: 0 },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  })
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(34, 197, 94, 0.4)',
      '0 0 40px rgba(34, 197, 94, 0.8)',
      '0 0 20px rgba(34, 197, 94, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const ripple = (x: number, y: number) => ({
  initial: {
    scale: 0,
    opacity: 0.5,
    x,
    y
  },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.6 }
  }
});

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const bounceIn = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 0.9, 1.05, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      times: [0, 0.4, 0.6, 0.8, 1],
      ease: 'easeOut'
    }
  }
};

export const floatAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};
