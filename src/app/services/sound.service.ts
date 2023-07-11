import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  
  private audio: HTMLAudioElement;
  
  constructor() { 
    this.audio = new Audio();
    this.audio.src = '../../assets/ting.mp3';
  }

  playNotificationSound(): void {
    console.log('inside to play');
    this.audio.play();
  }
}
