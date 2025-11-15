import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  // Mobile menu state
  protected readonly isMenuOpen = signal(false);

  // Projects dropdown state
  protected readonly isProjectsOpen = signal(false);

  /**
   * Toggle mobile menu open/close
   */
  protected toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  /**
   * Toggle projects dropdown
   */
  protected toggleProjectsDropdown(): void {
    this.isProjectsOpen.update(value => !value);
  }

  /**
   * Close all menus (used when navigating)
   */
  protected closeMenus(): void {
    this.isMenuOpen.set(false);
    this.isProjectsOpen.set(false);
  }
}
