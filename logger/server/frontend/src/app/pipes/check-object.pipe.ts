import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'checkObject',
  pure: false
})
export class CheckObjectPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return ((value !== null) && (typeof value === 'object'));
  }
}
