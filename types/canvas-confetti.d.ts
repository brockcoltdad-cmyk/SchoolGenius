declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number
    angle?: number
    spread?: number
    startVelocity?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
  }
  function confetti(options?: Options): Promise<null>
  namespace confetti {
    function reset(): void
  }
  export = confetti
}
