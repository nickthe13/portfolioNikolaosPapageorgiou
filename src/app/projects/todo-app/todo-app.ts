import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-todo-app',
  imports: [],
  templateUrl: './todo-app.html',
  styleUrl: './todo-app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoApp {

}
