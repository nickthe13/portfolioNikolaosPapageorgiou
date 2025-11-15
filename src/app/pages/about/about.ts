import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Stat {
  value: string;
  label: string;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface TimelineItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements?: string[];
}

interface Interest {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  /**
   * Quick statistics about experience
   */
  protected readonly stats = signal<Stat[]>([
    { value: '1', label: 'Year Experience' },
    { value: '5+', label: 'Projects Completed' },
    { value: '5+', label: 'Technologies' }
  ]);

  /**
   * Categorized technical skills
   */
  protected readonly skillCategories = signal<SkillCategory[]>([
    {
      name: 'Frontend',
      skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS/SASS', 'Responsive Design']
    },
    {
      name: 'Backend & Tools',
      skills: ['Node.js', 'RESTful APIs', 'Git', 'npm/yarn', 'Webpack', 'Angular CLI']
    },
    {
      name: 'Libraries & Frameworks',
      skills: ['RxJS', 'Angular Material', 'Bootstrap', 'Tailwind CSS', 'NgRx']
    },
    {
      name: 'Best Practices',
      skills: ['Clean Code', 'Testing (Jasmine/Karma)', 'Responsive Design', 'Accessibility', 'Performance Optimization']
    }
  ]);

  /**
   * Professional experience and education timeline
   */
  protected readonly timeline = signal<TimelineItem[]>([
    {
      id: 'exp-1',
      title: 'Full-Stack Developer',
      company: 'Tech Company',
      period: '2021 - Present',
      description: 'Developing modern web applications using Angular and TypeScript, focusing on creating scalable and maintainable solutions.',
      achievements: [
        'Built responsive single-page applications with Angular',
        'Implemented state management using RxJS and Angular Signals',
        'Improved application performance by 40% through optimization',
        'Collaborated with cross-functional teams in Agile environment'
      ]
    },
    {
      id: 'exp-2',
      title: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2019 - 2021',
      description: 'Created engaging user interfaces and improved user experience across multiple client projects.',
      achievements: [
        'Developed reusable component libraries',
        'Implemented responsive designs for mobile-first applications',
        'Worked closely with designers to implement pixel-perfect UIs'
      ]
    },
    {
      id: 'edu-1',
      title: 'Bachelor of Computer Science',
      company: 'University Name',
      period: '2015 - 2019',
      description: 'Studied software engineering, algorithms, and web development. Graduated with honors.'
    }
  ]);

  /**
   * Personal interests and hobbies
   */
  protected readonly interests = signal<Interest[]>([
    {
      title: 'Open Source',
      description: 'Contributing to open-source projects and sharing knowledge with the community'
    },
    {
      title: 'Learning',
      description: 'Constantly exploring new technologies and staying updated with web development trends'
    },
    {
      title: 'Problem Solving',
      description: 'Enjoying algorithmic challenges and finding elegant solutions to complex problems'
    },
  ]);
}
