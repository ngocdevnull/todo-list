import {delay, noop, Observable, of} from 'rxjs';

import { Todo } from '../interfaces/todo.interface';
import { getTodosStorage, setTodosStorage } from '../../shared/storage/todo.storage';
import { Level } from '../../shared/enums/level.enum';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class TodoService {
  public constructor(private router: Router) {}
  public getTodos(isReload?: boolean): Observable<Todo[]> {
    if (this.isServerError()) {
      this.router.navigate(['/server-error']).then(noop);
    }
    let todos = getTodosStorage();
    if (isReload) {
      todos = todos.filter((i) => !i.isCompleted);
      setTodosStorage(todos);
    }
    todos = [...this.determineItemsHighlight(todos)];
    todos.sort((a, b) => b.priority - a.priority);
    return of(todos.sort((a, b) => +a.isCompleted - +b.isCompleted)).pipe(delay(2000));
  }

  public createTodo(newTodo: Todo): Observable<Todo[]> {
    newTodo.id = this.generateTodoId();
    const todos = getTodosStorage();
    todos.push(newTodo);
    setTodosStorage(todos);
    return of(todos).pipe(delay(2000));
  }

  public editTodo(id: number, todo: Todo): Observable<Todo[]> {
    const todos = getTodosStorage();
    const index = todos.findIndex((item) => item.id === id);
    if (index !== -1) {
      todos[index] = { ...todo, id: id };
    }
    setTodosStorage(todos);
    return of(todos).pipe(delay(2000));
  }

  public deleteTodo(todoId: number): Observable<Todo[]> {
    let todos = getTodosStorage();
    todos = todos.filter((i: Todo) => i.id !== todoId);
    setTodosStorage(todos);
    return of(todos).pipe(delay(2000));
  }

  public markAsCompleted(todoId: number): Observable<Todo[]> {
    const todos = getTodosStorage();
    const index = todos.findIndex((todo) => todo.id === todoId);
    const completedTodo = todos[index];
    completedTodo.isCompleted = true;
    todos.splice(index, 1);
    todos.push(completedTodo);
    setTodosStorage(todos);
    return of(todos);
  }

  public markAsUnfinished(todoId: number): Observable<Todo[]> {
    const todos = getTodosStorage();
    todos.map((i: Todo) => {
      i.isCompleted = i.id === todoId ? false : i.isCompleted;
    });
    setTodosStorage(todos);
    return of(todos);
  }

  private generateTodoId(): number {
    const todos = getTodosStorage();
    return Math.max(...todos.map((todo: Todo) => todo.id), 0) + 1;
  }

  private convertMsToDay(ms: number): number {
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }

  private determineItemsHighlight(todos: Todo[]): Todo[] {
    const today = new Date();
    return todos.map((i) => {
      const dayCompleteFromNow = this.convertMsToDay(new Date(i.completeByDate).getTime() - today.getTime());
      return { ...i, isHighlight: i.priority === Level.HIGH && dayCompleteFromNow <= 0 };
    });
  }

  private isServerError(): boolean {
    return Math.floor(Math.random() * 20 + 1) === 10;
  }
}
