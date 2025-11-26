import { Injectable, signal } from '@angular/core';

type Mood = 'happy' | 'sad' | 'energetic' | 'calm' | 'focused' | 'romantic';

/**
 * Service for managing mood-based background audio
 * Plays MP3 audio files for each mood
 */
@Injectable({
  providedIn: 'root'
})
export class MoodAudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private fadeOutInterval: number | null = null;

  /**
   * Signal to track if audio is currently playing
   */
  readonly isPlaying = signal(false);

  /**
   * Signal to track current mood
   */
  readonly currentMood = signal<Mood | null>(null);

  /**
   * Map moods to their audio file paths
   */
  private readonly moodAudioFiles: Record<Mood, string> = {
    happy: 'audio/happy.mp3',
    sad: 'audio/sad.mp3',
    energetic: 'audio/energetic.mp3',
    calm: 'audio/calm.mp3',
    focused: 'audio/focused.mp3',
    romantic: 'audio/romantic.mp3'
  };

  /**
   * Play mood-based ambient sound
   */
  playMoodSound(mood: Mood): void {
    // Stop any currently playing sound immediately
    this.stopSoundImmediate();

    try {
      const audioPath = this.moodAudioFiles[mood];

      // Create new audio element
      const audio = new Audio(audioPath);
      audio.loop = true; // Loop the audio
      audio.volume = 0; // Start at 0 for fade in

      // Start playing immediately
      audio.play().then(() => {
        this.fadeIn(audio, 0.3, 1000); // Fade to 30% volume over 1 second
      }).catch(error => {
        console.error('Error playing audio:', error);
      });

      // Store reference
      this.currentAudio = audio;
      this.isPlaying.set(true);
      this.currentMood.set(mood);

    } catch (error) {
      console.error('Error playing mood sound:', error);
    }
  }

  /**
   * Fade in audio volume
   */
  private fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number): void {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeIncrement = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep >= steps || !this.currentAudio) {
        clearInterval(fadeInterval);
        if (audio) {
          audio.volume = targetVolume;
        }
        return;
      }

      currentStep++;
      audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);
    }, stepDuration);
  }

  /**
   * Fade out audio volume
   */
  private fadeOut(audio: HTMLAudioElement, duration: number): void {
    const steps = 20;
    const stepDuration = duration / steps;
    const startVolume = audio.volume;
    const volumeDecrement = startVolume / steps;
    let currentStep = 0;

    // Clear any existing fade out
    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval);
    }

    this.fadeOutInterval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(this.fadeOutInterval!);
        this.fadeOutInterval = null;
        audio.pause();
        audio.currentTime = 0;
        return;
      }

      currentStep++;
      audio.volume = Math.max(startVolume - (volumeDecrement * currentStep), 0);
    }, stepDuration) as unknown as number;
  }

  /**
   * Stop the currently playing sound immediately (for quick switching)
   */
  private stopSoundImmediate(): void {
    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }
  }

  /**
   * Stop the currently playing sound with fade out
   */
  stopSound(): void {
    if (this.currentAudio) {
      try {
        this.fadeOut(this.currentAudio, 500);
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
  }
}
