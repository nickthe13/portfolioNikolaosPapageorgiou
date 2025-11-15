import { Injectable, signal } from '@angular/core';

export interface TodoIntegrationItem {
  text: string;
  source: 'music-moodboard' | 'other';
  metadata?: {
    songTitle?: string;
    artist?: string;
    mood?: string;
  };
}

/**
 * Service for integrating different features with the Todo app
 * Allows components to send items to the todo list
 */
@Injectable({
  providedIn: 'root'
})
export class TodoIntegrationService {
  /**
   * Signal to notify when a new item should be added to todos
   */
  private readonly pendingItem = signal<TodoIntegrationItem | null>(null);

  /**
   * Get the current pending item
   */
  getPendingItem() {
    return this.pendingItem.asReadonly();
  }

  /**
   * Send an item to be added to the todo list
   */
  sendToTodo(item: TodoIntegrationItem): void {
    this.pendingItem.set(item);
  }

  /**
   * Clear the pending item after it's been processed
   */
  clearPendingItem(): void {
    this.pendingItem.set(null);
  }
}
