class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setEnabled(enabled: boolean) { this.enabled = enabled }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return
    if (this.audioContext.state === 'suspended') this.audioContext.resume()
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playAchievement() {
    if (!this.enabled) return
    setTimeout(() => this.playTone(523, 0.15, 'square', 0.2), 0)
    setTimeout(() => this.playTone(659, 0.15, 'square', 0.2), 100)
    setTimeout(() => this.playTone(784, 0.15, 'square', 0.2), 200)
    setTimeout(() => this.playTone(1047, 0.3, 'square', 0.25), 300)
  }

  playCoin() {
    if (!this.enabled) return
    this.playTone(988, 0.1, 'sine', 0.3)
    setTimeout(() => this.playTone(1319, 0.15, 'sine', 0.25), 80)
  }

  playCorrect() {
    if (!this.enabled) return
    this.playTone(523, 0.1, 'sine', 0.3)
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.3), 100)
  }

  playWrong() {
    if (!this.enabled) return
    this.playTone(200, 0.2, 'sawtooth', 0.15)
  }

  playClick() {
    if (!this.enabled) return
    this.playTone(600, 0.05, 'sine', 0.15)
  }
}

export const sounds = typeof window !== 'undefined' ? new SoundManager() : null
export default sounds
