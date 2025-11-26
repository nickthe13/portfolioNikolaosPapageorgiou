import { ChangeDetectionStrategy, Component, HostListener, effect, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

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

  constructor(private router: Router) {
    // Close menus on route navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenus();
      });
  }

  /**
   * Toggle mobile menu open/close
   */
  protected toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
    // Close projects dropdown when opening mobile menu
    if (this.isMenuOpen()) {
      this.isProjectsOpen.set(false);
    }
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

  /**
   * Close dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const header = target.closest('header');

    // If click is outside the header, close all menus
    if (!header) {
      this.closeMenus();
      return;
    }

    // If click is inside header but not on the Projects button or dropdown, close the dropdown
    const isProjectsButton = target.closest('.nav-dropdown-trigger');
    const isDropdownMenu = target.closest('.dropdown-menu');

    if (!isProjectsButton && !isDropdownMenu && this.isProjectsOpen()) {
      this.isProjectsOpen.set(false);
    }
  }

  /**
   * Close mobile menu when pressing Escape key
   */
  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    this.closeMenus();
  }
}
