import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  public transform(text: string): string {
    return new Date(text).toLocaleDateString();
  }
}
