import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slangHider'
})
export class SlangHiderPipe implements PipeTransform {

  transform(value: any): any {
    if (value == null) {
      return null
    } else {
      return this.hideSlang(value);
    }
  }

  private hideSlang(value: any) {
    const slangs = ['fuck', 'suck', 'randi', 'raand', 'bitch', 'whore', 'motherfucker', 'cock', 'sucker', 'lund', 'madharchod', 'behenchod', 'betichod', 'chod', 'gandu'];
    let value1: any = [];
    value.split(' ').forEach((element: any) => {
      if (slangs.includes(element.toLowerCase())) { 
        console.log('inside'); 
        value1.push(element.replace(/[a-zA-Z]/gi, '*'));
      } else {
          value1.push(element)
      }
    });
    return value1.join(' ');
  }
}
