import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  buttonClicked = new EventEmitter<void>();

  emitButtonClick() {
    this.buttonClicked.emit();
  }

  
}
