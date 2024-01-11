import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Todo} from "../model/todo.model";

export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      summary: 'test1',
      description: 'test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1 test1',
      isCompleted: false,
      priority: 2,
      completeByDate: new Date()
    },
    {
      id: 2,
      summary: 'test2',
      description: 'test2 test2 test test2 test2 test2 test2 test2 test2 test2 test2 test2 test2 test2',
      isCompleted: false,
      priority: 3,
      completeByDate: new Date()
    },
    {
      id: 3,
      summary: 'test3',
      description: 'test3 test3 test3 test3 test3 test3 test3 test3 test3 test3 test3 test3 test3 test3',
      isCompleted: false,
      priority: 2,
      completeByDate: new Date()
    }
  ];

  public getTodos(): Observable<Todo[]> {
    this.todos.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
    return of(this.todos).pipe(delay(2000))
  }

  public createTodo(newTodo: Todo): Observable<Todo[]> {
    newTodo.id = this.generateTodoId();
    this.todos.push(newTodo);
    return of(this.todos).pipe(delay(2000));
  }

  public editTodo(id: number, todo: Todo): Observable<Todo[]> {
    const index = this.todos.findIndex(item => item.id === id);
    if (index !== -1) {
      this.todos[index] = {...todo, id: id};
    }
    return of(this.todos).pipe(delay(2000))
  }

  public deleteTodo(todoId: number): Observable<Todo[]> {
    this.todos = this.todos.filter((i: Todo) => i.id !== todoId)
    return of(this.todos).pipe(delay(2000))
  }

  public markAsCompleted(todoId: number): Observable<Todo[]> {
    const index = this.todos.findIndex((todo) => todo.id === todoId);
    const completedTodo = this.todos[index];
    completedTodo.isCompleted = true;
    this.todos.splice(index, 1);
    this.todos.push(completedTodo);
    return of(this.todos);
  }

  public markAsUnfinished(todoId: number): Observable<Todo[]> {
    this.todos.map((i: Todo) => {
      i.isCompleted = i.id === todoId ? false : i.isCompleted
    })
    return of(this.todos);
  }

  private generateTodoId(): number {
    return Math.max(...this.todos.map((todo: Todo) => todo.id), 0) + 1;
  }
}
