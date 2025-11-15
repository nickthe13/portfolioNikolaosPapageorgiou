import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Skill {
  name: string;
  description: string;
  color: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  gradient: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  /**
   * Skills/Technologies showcase
   */
  protected readonly skills = signal<Skill[]>([
    {
      name: 'Angular',
      description: 'Building modern, reactive web applications with Angular framework',
      color: '#dd0031'
    },
    {
      name: 'TypeScript',
      description: 'Type-safe JavaScript development for scalable applications',
      color: '#3178c6'
    },
    {
      name: 'RxJS',
      description: 'Reactive programming with observables for async operations',
      color: '#b7178c'
    },
    {
      name: 'HTML/CSS',
      description: 'Semantic markup and modern CSS (Flexbox, Grid, Animations)',
      color: '#e34c26'
    },
    {
      name: 'SCSS/SASS',
      description: 'Advanced styling with variables, mixins, and nested rules',
      color: '#cc6699'
    },
    {
      name: 'Git',
      description: 'Version control and collaborative development workflows',
      color: '#f05032'
    }
  ]);

  /**
   * Featured projects to display on home page
   */
  protected readonly featuredProjects = signal<Project[]>([
    {
      id: 'todo-app',
      title: 'Todo Application',
      description: 'A full-featured task management app with Angular Signals, reactive forms, and local storage persistence.',
      tags: ['Angular', 'TypeScript', 'Signals', 'Forms'],
      link: '/projects/todo-app',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'music-moodboard',
      title: 'Music Moodboard',
      description: 'Interactive music discovery platform with mood-based recommendations and playlist creation.',
      tags: ['Angular', 'RxJS', 'API Integration'],
      link: '/projects/music-moodboard',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ]);
}
