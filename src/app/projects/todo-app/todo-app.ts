import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoIntegrationService } from '../../services/todo-integration.service';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface Feature {
  title: string;
  description: string;
}

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-app',
  imports: [RouterLink],
  templateUrl: './todo-app.html',
  styleUrl: './todo-app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoApp {
  private readonly STORAGE_KEY = 'angular-todos';

  // State signals
  protected readonly todos = signal<Todo[]>(this.loadTodosFromStorage());
  protected readonly newTodoText = signal('');
  protected readonly currentFilter = signal<Filter>('all');
  protected readonly editingTodoId = signal<string | null>(null);
  protected readonly editingText = signal('');

  // Computed signals
  protected readonly activeTodosCount = computed(() =>
    this.todos().filter(t => !t.completed).length
  );

  protected readonly completedTodosCount = computed(() =>
    this.todos().filter(t => t.completed).length
  );

  protected readonly filteredTodos = computed(() => {
    const filter = this.currentFilter();
    const todos = this.todos();

    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  });

  protected readonly features = signal<Feature[]>([
    {
      title: 'Angular Signals',
      description: 'Built with Angular\'s modern reactive primitives for fine-grained reactivity'
    },
    {
      title: 'Local Storage',
      description: 'Automatic persistence to browser storage - your tasks survive page refreshes'
    },
    {
      title: 'Inline Editing',
      description: 'Double-click any task to edit it inline with instant updates'
    },
    {
      title: 'Smart Filtering',
      description: 'Filter between all, active, and completed tasks with computed signals'
    },
    {
      title: 'Clean UI',
      description: 'Modern, responsive design with smooth animations and accessibility'
    },
    {
      title: 'TypeScript',
      description: 'Fully typed codebase ensuring reliability and maintainability'
    }
  ]);

  constructor(private todoIntegration: TodoIntegrationService) {
    // Auto-save to localStorage whenever todos change
    effect(() => {
      const todos = this.todos();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    });

    // Listen for items from other components (like Music Moodboard)
    effect(() => {
      const pendingItem = this.todoIntegration.getPendingItem()();

      if (pendingItem) {
        // Create a new todo from the pending item
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text: pendingItem.text,
          completed: false,
          createdAt: Date.now()
        };

        this.todos.update(todos => [...todos, newTodo]);

        // Clear the pending item
        this.todoIntegration.clearPendingItem();
      }
    });
  }

  /**
   * Load todos from localStorage
   */
  private loadTodosFromStorage(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Update new todo text from input
   */
  protected updateNewTodoText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newTodoText.set(input.value);
  }

  /**
   * Add a new todo
   */
  protected addTodo(): void {
    const text = this.newTodoText().trim();
    if (!text) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now()
    };

    this.todos.update(todos => [...todos, newTodo]);
    this.newTodoText.set('');
  }

  /**
   * Toggle todo completed status
   */
  protected toggleTodo(id: string): void {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  /**
   * Delete a todo
   */
  protected deleteTodo(id: string): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  /**
   * Start editing a todo
   */
  protected startEdit(todo: Todo): void {
    this.editingTodoId.set(todo.id);
    this.editingText.set(todo.text);
  }

  /**
   * Update editing text from input
   */
  protected updateEditingText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editingText.set(input.value);
  }

  /**
   * Save edited todo
   */
  protected saveEdit(id: string): void {
    const text = this.editingText().trim();

    if (!text) {
      this.deleteTodo(id);
    } else {
      this.todos.update(todos =>
        todos.map(todo =>
          todo.id === id ? { ...todo, text } : todo
        )
      );
    }

    this.editingTodoId.set(null);
    this.editingText.set('');
  }

  /**
   * Cancel editing
   */
  protected cancelEdit(): void {
    this.editingTodoId.set(null);
    this.editingText.set('');
  }

  /**
   * Set filter type
   */
  protected setFilter(filter: Filter): void {
    this.currentFilter.set(filter);
  }

  /**
   * Clear all completed todos
   */
  protected clearCompleted(): void {
    this.todos.update(todos => todos.filter(todo => !todo.completed));
  }

  /**
   * Format timestamp for display
   */
  protected formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }
}
