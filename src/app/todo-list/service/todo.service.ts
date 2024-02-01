import { delay, Observable, of } from 'rxjs';

import { Todo } from '../model/todo.model';
import { getTodosStorage, setTodosStorage } from '../../shared/storage/todo.storage';
import { Level } from '../../shared/enums/level.enum';

export class TodoService {
  public getTodos(isReload?: boolean): Observable<Todo[]> {
    let todos = getTodosStorage();
    if (isReload) {
      todos = todos.filter((i) => !i.isCompleted);
      setTodosStorage(todos);
    }
    todos = [...this.determineItemsHighlight(todos)];
    todos.sort((a, b) => b.priority - a.priority);
    const a = todos.sort((a, b) => +a.isCompleted - +b.isCompleted);
    return of(todos.sort((a, b) => +a.isCompleted - +b.isCompleted)).pipe(delay(2000));
  }

  public determineItemsHighlight(todos: Todo[]): Todo[] {
    const today = new Date();
    return todos.map((i) => {
      const dayCompleteFromNow = this.convertMsToDay(new Date(i.completeByDate).getTime() - today.getTime());
      return { ...i, isHighlight: i.priority === Level.HIGH && dayCompleteFromNow <= 0 };
    });
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
}
