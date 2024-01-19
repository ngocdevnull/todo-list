import { Pipe, PipeTransform } from '@angular/core';

import { Todo } from '../../todo-list/model/todo.model';

@Pipe({
  name: 'highestPriorityPipe',
  standalone: true,
})
export class HighestPriorityPipe implements PipeTransform {
  public transform(id: number, todos: Todo[]): boolean {
    const incompleteTodos: Todo[] = todos?.filter((todo: Todo) => !todo.isCompleted);
    if (!incompleteTodos?.length) {
      return false;
    }
    const maxPriority = Math.max(...incompleteTodos.map((t) => t.priority));
    const highPriorityIncompleteTodos: Todo[] = incompleteTodos.filter((todo) => todo.priority === maxPriority);
    return (
      highPriorityIncompleteTodos.sort((a, b) => new Date(a.completeByDate!).getTime() - new Date(b.completeByDate!).getTime())[0].id === id
    );
  }
}
