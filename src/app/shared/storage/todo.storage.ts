import { Todo } from '../../todo-list/interfaces/todo.interface';
import { TODO } from '../constants';

export function setTodosStorage(todos: Todo[]): void {
  localStorage.setItem(TODO, JSON.stringify(todos));
}

export function getTodosStorage(): Todo[] {
  let data = JSON.parse(localStorage.getItem(TODO) || '[]');
  return (
    data.map((item: Todo) => ({
      ...item,
      priority: Number(item.priority)
    })) as Todo[]
  ).filter(i => !i.isCompleted);
}
