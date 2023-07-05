import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  mode = 'side';
  buttonClicked = new EventEmitter<void>();
  modeChange = new EventEmitter<void>();

  emitButtonClick() {
    this.buttonClicked.emit();
  }

  modeChangeAlert() {
    this.modeChange.emit();
  } 
}
