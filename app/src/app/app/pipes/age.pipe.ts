import { Pipe, PipeTransform } from '@angular/core';
import { differenceInYears } from 'date-fns';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {

  transform(birthdate: string): number {
    const birth = new Date(birthdate);
    const today = new Date();
    return differenceInYears(today, birth);
  }
}
