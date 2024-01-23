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
    let result: Todo[] = [];
    const itemsSoonestDeadline = incompleteTodos.sort(
      (a, b) => new Date(a.completeByDate!).getTime() - new Date(b.completeByDate!).getTime(),
    );
    const itemsHighestPriority = incompleteTodos.filter((i) => i.priority === 3);
    result.push(itemsSoonestDeadline[0]);
    result = [...result, ...itemsHighestPriority];
    const resultIds: number[] = result.map((i) => i.id);
    return resultIds.includes(id);
  }
}
