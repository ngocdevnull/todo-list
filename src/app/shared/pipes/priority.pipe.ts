import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityPipe',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  public transform(priority: number): string {
    let result = 'Low';
    switch (priority) {
      case 1:
        result = 'Low';
        break;
      case 2:
        result = 'Medium';
        break;
      case 3:
        result = 'High';
        break;
    }
    return result;
  }
}
