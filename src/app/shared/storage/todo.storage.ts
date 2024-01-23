import { Todo } from '../../todo-list/model/todo.model';
import { TODO } from '../constants/constant';

export function setTodosStorage(todos: Todo[]): void {
  localStorage.setItem(TODO, JSON.stringify(todos));
}

export function getTodosStorage(): Todo[] {
  let data = JSON.parse(localStorage.getItem(TODO) || '[]');
  return data.map((item: Todo) => ({ ...item, priority: Number(item.priority) }));
}
