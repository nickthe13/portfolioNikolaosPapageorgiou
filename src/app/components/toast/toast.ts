import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%) translateX(-50%)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0) translateX(-50%)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-20px) translateX(-50%)'
        }))
      ])
    ])
  ]
})
export class Toast {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.getToasts();

  /**
   * Get icon SVG path based on toast type
   */
  protected getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z';
      case 'error':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z';
      case 'warning':
        return 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z';
      case 'info':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
      default:
        return '';
    }
  }

  /**
   * Remove a toast when clicking the close button
   */
  protected removeToast(id: string): void {
    this.toastService.removeToast(id);
  }
}
