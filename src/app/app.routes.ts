import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About)
  },
  {
    path: 'projects',
    children: [
      {
        path: 'todo-app',
        loadComponent: () => import('./projects/todo-app/todo-app').then(m => m.TodoApp)
      },
      {
        path: 'music-moodboard',
        loadComponent: () => import('./projects/music-moodboard/music-moodboard').then(m => m.MusicMoodboard)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
