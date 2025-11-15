import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoIntegrationService } from '../../services/todo-integration.service';
import { MoodAudioService } from '../../services/mood-audio.service';

interface Song {
  id: string;
  title: string;
  artist: string;
  mood: Mood;
  color: string;
  createdAt: number;
}

interface Feature {
  title: string;
  description: string;
}

type Mood = 'happy' | 'sad' | 'energetic' | 'calm' | 'focused' | 'romantic';

interface MoodOption {
  value: Mood;
  label: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-music-moodboard',
  imports: [RouterLink],
  templateUrl: './music-moodboard.html',
  styleUrl: './music-moodboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicMoodboard {
  private readonly STORAGE_KEY = 'music-moodboard-songs';

  // State signals
  protected readonly songs = signal<Song[]>(this.loadSongsFromStorage());
  protected readonly newSongTitle = signal('');
  protected readonly newSongArtist = signal('');
  protected readonly selectedMood = signal<Mood>('happy');
  protected readonly currentFilter = signal<Mood | 'all'>('all');
  protected readonly backgroundMood = signal<Mood>('happy'); // For dynamic background color

  // Mood options
  protected readonly moodOptions = signal<MoodOption[]>([
    { value: 'happy', label: 'Happy', color: '#f59e0b', icon: '😊' },
    { value: 'sad', label: 'Sad', color: '#6366f1', icon: '😢' },
    { value: 'energetic', label: 'Energetic', color: '#ef4444', icon: '⚡' },
    { value: 'calm', label: 'Calm', color: '#10b981', icon: '🌊' },
    { value: 'focused', label: 'Focused', color: '#8b5cf6', icon: '🎯' },
    { value: 'romantic', label: 'Romantic', color: '#ec4899', icon: '💕' }
  ]);

  // Computed signals
  protected readonly filteredSongs = computed(() => {
    const filter = this.currentFilter();
    const songs = this.songs();

    if (filter === 'all') {
      return songs;
    }

    return songs.filter(song => song.mood === filter);
  });

  protected readonly moodCounts = computed(() => {
    const songs = this.songs();
    const counts = new Map<Mood, number>();

    this.moodOptions().forEach(mood => {
      counts.set(mood.value, songs.filter(s => s.mood === mood.value).length);
    });

    return counts;
  });

  protected readonly features = signal<Feature[]>([
    {
      title: 'Mood-Based Organization',
      description: 'Categorize songs by your current mood with visual color coding'
    },
    {
      title: 'Todo Integration',
      description: 'Send songs to your todo list to remind yourself to listen later'
    },
    {
      title: 'Local Storage',
      description: 'Your music collection persists across sessions automatically'
    },
    {
      title: 'Visual Moodboard',
      description: 'Beautiful card-based layout with mood-specific colors and icons'
    },
    {
      title: 'Smart Filtering',
      description: 'Filter songs by mood to match how you\'re feeling right now'
    },
    {
      title: 'Angular Signals',
      description: 'Built with modern reactive patterns for optimal performance'
    }
  ]);

  constructor(
    private todoIntegration: TodoIntegrationService,
    protected moodAudio: MoodAudioService
  ) {
    // Update background color when mood changes
    effect(() => {
      const mood = this.backgroundMood();
      this.updateBackgroundColor(mood);
    });
  }

  /**
   * Load songs from localStorage
   */
  private loadSongsFromStorage(): Song[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save songs to localStorage
   */
  private saveSongsToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.songs()));
  }

  /**
   * Update new song title from input
   */
  protected updateSongTitle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newSongTitle.set(input.value);
  }

  /**
   * Update new song artist from input
   */
  protected updateSongArtist(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newSongArtist.set(input.value);
  }

  /**
   * Set the selected mood and trigger audio/visual effects
   */
  protected setSelectedMood(mood: Mood): void {
    this.selectedMood.set(mood);
    this.backgroundMood.set(mood);

    // Play mood-based ambient sound
    this.moodAudio.playMoodSound(mood);
  }

  /**
   * Update background color with smooth transition
   */
  private updateBackgroundColor(mood: Mood): void {
    const moodOption = this.moodOptions().find(m => m.value === mood);
    if (moodOption) {
      // Update CSS custom property for background color
      document.documentElement.style.setProperty('--current-mood-color', moodOption.color);
    }
  }

  /**
   * Toggle audio on/off
   */
  protected toggleAudio(): void {
    if (this.moodAudio.isPlaying()) {
      this.moodAudio.stopSound();
    } else {
      // Play the currently selected mood
      this.moodAudio.playMoodSound(this.selectedMood());
    }
  }

  /**
   * Add a new song
   */
  protected addSong(): void {
    const title = this.newSongTitle().trim();
    const artist = this.newSongArtist().trim();

    if (!title || !artist) return;

    const mood = this.selectedMood();
    const moodOption = this.moodOptions().find(m => m.value === mood)!;

    const newSong: Song = {
      id: crypto.randomUUID(),
      title,
      artist,
      mood,
      color: moodOption.color,
      createdAt: Date.now()
    };

    this.songs.update(songs => [...songs, newSong]);
    this.saveSongsToStorage();

    // Reset form
    this.newSongTitle.set('');
    this.newSongArtist.set('');
  }

  /**
   * Delete a song
   */
  protected deleteSong(id: string): void {
    this.songs.update(songs => songs.filter(song => song.id !== id));
    this.saveSongsToStorage();
  }

  /**
   * Set filter type
   */
  protected setFilter(filter: Mood | 'all'): void {
    this.currentFilter.set(filter);
  }

  /**
   * Send song to todo list
   */
  protected sendToTodo(song: Song): void {
    this.todoIntegration.sendToTodo({
      text: `Listen to "${song.title}" by ${song.artist}`,
      source: 'music-moodboard',
      metadata: {
        songTitle: song.title,
        artist: song.artist,
        mood: song.mood
      }
    });
  }

  /**
   * Get mood option by value
   */
  protected getMoodOption(mood: Mood): MoodOption {
    return this.moodOptions().find(m => m.value === mood)!;
  }

  /**
   * Get the current filter as a mood (excluding 'all')
   */
  protected getCurrentFilterAsMood(): Mood {
    const filter = this.currentFilter();
    return filter === 'all' ? 'happy' : filter;
  }

  /**
   * Format timestamp for display
   */
  protected formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
