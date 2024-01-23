import { delay, Observable, of } from 'rxjs';

import { Todo } from '../model/todo.model';
import { getTodosStorage, setTodosStorage } from '../../shared/storage/todo.storage';
import { Injectable, OnInit } from '@angular/core';
import { ReloadTrackingService } from './reload-tracking.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  public constructor(private reloadTrackingService: ReloadTrackingService) {}

  public getTodos(): Observable<Todo[]> {
    let todos = getTodosStorage();
    if (this.reloadTrackingService.isReloaded()) {
      todos = todos.filter((i) => !i.isCompleted);
      setTodosStorage(todos);
      this.reloadTrackingService.resetReloadStatus();
    }
    todos.sort((a, b) => {
      return b.priority - a.priority;
    });
    return of(
      todos.sort((a, b) => {
        return +a.isCompleted - +b.isCompleted;
      }),
    ).pipe(delay(2000));
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
}
