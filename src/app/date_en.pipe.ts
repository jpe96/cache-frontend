import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateEn'
})
export class CustomDateEnPipe extends 
  DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, "MMMM d, y", undefined, "en-US")
  }
}
