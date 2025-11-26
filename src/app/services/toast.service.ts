import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

/**
 * Service for managing toast notifications
 * Provides methods to show success, error, info, and warning messages
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /**
   * Signal containing all active toasts
   */
  private readonly toasts = signal<Toast[]>([]);

  /**
   * Get readonly signal of toasts for consumption by components
   */
  getToasts() {
    return this.toasts.asReadonly();
  }

  /**
   * Show a success toast notification
   */
  success(message: string, duration: number = 3000): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'success',
      duration
    });
  }

  /**
   * Show an error toast notification
   */
  error(message: string, duration: number = 4000): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'error',
      duration
    });
  }

  /**
   * Show an info toast notification
   */
  info(message: string, duration: number = 3000): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'info',
      duration
    });
  }

  /**
   * Show a warning toast notification
   */
  warning(message: string, duration: number = 3500): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'warning',
      duration
    });
  }

  /**
   * Add a toast to the list and auto-remove after duration
   */
  private addToast(toast: Toast): void {
    this.toasts.update(toasts => [...toasts, toast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      this.removeToast(toast.id);
    }, toast.duration);
  }

  /**
   * Remove a specific toast by ID
   */
  removeToast(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toasts.set([]);
  }
}
