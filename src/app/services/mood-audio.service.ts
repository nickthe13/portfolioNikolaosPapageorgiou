import { Injectable, signal } from '@angular/core';

type Mood = 'happy' | 'sad' | 'energetic' | 'calm' | 'focused' | 'romantic';

/**
 * Service for managing mood-based background audio
 * Uses Web Audio API for ambient sound generation
 */
@Injectable({
  providedIn: 'root'
})
export class MoodAudioService {
  private audioContext: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private currentGain: GainNode | null = null;

  /**
   * Signal to track if audio is currently playing
   */
  readonly isPlaying = signal(false);

  /**
   * Signal to track current mood
   */
  readonly currentMood = signal<Mood | null>(null);

  /**
   * Mood-specific frequencies and characteristics
   */
  private readonly moodConfig: Record<Mood, { frequency: number; type: OscillatorType; volume: number }> = {
    happy: { frequency: 523.25, type: 'sine', volume: 0.1 }, // C5 - bright and cheerful
    sad: { frequency: 220, type: 'sine', volume: 0.08 }, // A3 - melancholic
    energetic: { frequency: 659.25, type: 'square', volume: 0.12 }, // E5 - energetic
    calm: { frequency: 174.61, type: 'sine', volume: 0.06 }, // F3 - very calming
    focused: { frequency: 440, type: 'triangle', volume: 0.07 }, // A4 - focused attention
    romantic: { frequency: 293.66, type: 'sine', volume: 0.09 } // D4 - warm and romantic
  };

  /**
   * Initialize or get the AudioContext
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play mood-based ambient sound
   */
  playMoodSound(mood: Mood): void {
    // Stop any currently playing sound
    this.stopSound();

    try {
      const context = this.getAudioContext();
      const config = this.moodConfig[mood];

      // Create oscillator for the base tone
      const oscillator = context.createOscillator();
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, context.currentTime);

      // Create gain node for volume control
      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.volume, context.currentTime + 0.5); // Fade in

      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Start the oscillator
      oscillator.start();

      // Store references
      this.currentOscillator = oscillator;
      this.currentGain = gainNode;
      this.isPlaying.set(true);
      this.currentMood.set(mood);

      // Add subtle vibrato for more natural sound
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.value = 5; // 5 Hz vibrato
      lfoGain.gain.value = 10; // Slight pitch variation
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();

    } catch (error) {
      console.error('Error playing mood sound:', error);
    }
  }

  /**
   * Stop the currently playing sound
   */
  stopSound(): void {
    if (this.currentOscillator && this.currentGain) {
      try {
        const context = this.getAudioContext();

        // Fade out
        this.currentGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);

        // Stop after fade out
        setTimeout(() => {
          if (this.currentOscillator) {
            this.currentOscillator.stop();
            this.currentOscillator.disconnect();
            this.currentOscillator = null;
          }
          if (this.currentGain) {
            this.currentGain.disconnect();
            this.currentGain = null;
          }
        }, 300);

        this.isPlaying.set(false);
        this.currentMood.set(null);
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }
  }

  /**
   * Toggle sound on/off
   */
  toggleSound(mood: Mood): void {
    if (this.isPlaying() && this.currentMood() === mood) {
      this.stopSound();
    } else {
      this.playMoodSound(mood);
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopSound();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
