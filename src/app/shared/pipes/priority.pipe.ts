import { Pipe, PipeTransform } from '@angular/core';
import { Level } from '../enums/level.enum';

@Pipe({
  name: 'priorityPipe',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  public transform(priority: number): string {
    let result = 'Low';
    switch (priority) {
      case Level.MEDIUM:
        result = 'Medium';
        break;
      case Level.HIGH:
        result = 'High';
        break;
    }
    return result;
  }
}
