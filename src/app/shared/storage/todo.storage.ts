import { Todo } from '../../todo-list/model/todo.model';
import { TODO } from '../constants/constant';

export function setTodosStorage(todos: Todo[]): void {
  sessionStorage.setItem(TODO, JSON.stringify(todos));
}

export function getTodosStorage(): Todo[] {
  let data = JSON.parse(sessionStorage.getItem(TODO) || '[]');
  return data.map((item: Todo) => ({ ...item, priority: Number(item.priority) }));
}
