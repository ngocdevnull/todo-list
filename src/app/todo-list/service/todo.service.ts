import { BehaviorSubject, delay, noop, Observable, of, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Todo } from '../interfaces/todo.interface';
import { getTodosStorage, setTodosStorage } from '../../shared/storage/todo.storage';
import { Level } from '../../shared/enums/level.enum';

@Injectable()
export class TodoService {
  private innerTodo$ = new BehaviorSubject<Todo[]>([]);

  public todos$: Observable<Todo[]> = this.innerTodo$.asObservable();

  public constructor(private router: Router) {
    this.innerTodo$.next(this.formatTodos(getTodosStorage() || []));
    this.getTodos();
  }

  public getTodos(): Observable<Todo[]> {
    if (this.isServerError()) {
      this.router.navigate(['/server-error']).then(noop);
    }
    return this.todos$;
  }

  public createTodo(newTodo: Todo): Observable<Todo[]> {
    newTodo.id = this.generateTodoId();
    const todos = this.innerTodo$.value;
    todos.push(newTodo);
    this.innerTodo$.next(this.formatTodos(todos));
    setTodosStorage(todos);
    return this.todos$;
  }

  public editTodo(id: number, todo: Todo): Observable<Todo[]> {
    if (!todo) {
      return of();
    }
    const todos = this.innerTodo$.value;
    const index = todos.findIndex(item => item.id === id);
    if (index !== -1) {
      todos[index] = { ...todo, id: id };
    }
    this.innerTodo$.next(this.formatTodos(todos));
    setTodosStorage(todos);
    return this.todos$;
  }

  public deleteTodo(todoId: number): Observable<Todo[]> {
    let todos = this.innerTodo$.value;
    todos = todos.filter((i: Todo) => i.id !== todoId);
    this.innerTodo$.next(this.formatTodos(todos));
    setTodosStorage(todos);
    return this.todos$;
  }

  public markAsCompleted(todoId: number): Observable<Todo[]> {
    const todos = this.innerTodo$.value;
    const index = todos.findIndex(todo => todo.id === todoId);
    const completedTodo = todos[index];
    completedTodo.isCompleted = true;
    todos.splice(index, 1);
    todos.push(completedTodo);
    this.innerTodo$.next(this.formatTodos(todos));
    setTodosStorage(todos);
    return this.todos$;
  }

  public markAsUnfinished(todoId: number): Observable<Todo[]> {
    const todos = this.innerTodo$.value;
    todos.map((i: Todo) => {
      i.isCompleted = i.id === todoId ? false : i.isCompleted;
    });
    this.innerTodo$.next(this.formatTodos(todos));
    setTodosStorage(todos);
    return this.todos$;
  }

  private generateTodoId(): number {
    const todos = this.innerTodo$.value;
    return Math.max(...todos.map((todo: Todo) => todo.id), 0) + 1;
  }

  private convertMsToDay(ms: number): number {
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }

  private formatTodos(data: Todo[]): Todo[] {
    let todos = [...this.determineItemsHighlight(data)];
    todos.sort((a, b) => b.priority - a.priority);
    todos.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
    return todos;
  }

  private determineItemsHighlight(todos: Todo[]): Todo[] {
    const today = new Date();
    return todos.map(i => {
      const dayCompleteFromNow = this.convertMsToDay(new Date(i.completeByDate).getTime() - today.getTime());
      return { ...i, isHighlight: i.priority === Level.HIGH && dayCompleteFromNow <= 0 };
    });
  }

  private isServerError(): boolean {
    return Math.floor(Math.random() * 1000) === 1;
  }
}
