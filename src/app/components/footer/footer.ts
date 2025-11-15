import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  /**
   * Current year for copyright notice
   * Automatically updates each year
   */
  protected readonly currentYear = signal(new Date().getFullYear());

  /**
   * Angular version used in the project
   */
  protected readonly angularVersion = signal('20.3');
}
