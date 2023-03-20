import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseTimer',
  pure: true
})
export class ParseTimerPipe implements PipeTransform {

  transform(ms: number): string {
    let date = new Date(ms);
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
