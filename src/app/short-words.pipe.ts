import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortWords',
})
export class ShortWordsPipe implements PipeTransform {
  transform(value: any, limit: number): any {
    if (value.length > limit) return value.substring(0, limit) + '...';
    else return value;
  }
}
