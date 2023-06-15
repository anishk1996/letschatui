import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{

  public chat = new Subject();
  public notification = new Subject();
  public readSignal = new Subject();
  selectedChatID: any = -1;
  constructor(private socket: Socket) {
    let userData: any = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string) : null;
    this.socket.emit('setup', userData);
  }
  

  ngOnInit(): void {
  }

  joinChatRoom(id: any) {
    this.selectedChatID = id;
    this.socket.emit('join chat', id);
  }

  sendMessage(msg: any) {
    this.socket.emit('new message', msg);
  }

  sendReadSignal(msg: any) {
    this.socket.emit('send read', msg);
  }

  tryReceivingMsg(): any {
  this.socket.on('message received', (newMessageReceived: any) => {
    if(this.selectedChatID == -1  || this.selectedChatID != newMessageReceived.chat._id) {
      // give notification
      this.notification.next(newMessageReceived);
    } else {
      this.chat.next(newMessageReceived);
    }
  })

  this.socket.on('read received', (newMessageReceived: any) => {
    this.readSignal.next(newMessageReceived);
  })
  }

  getChat() {
    return this.chat;
  }

  getNotification() {
    return this.notification;
  }

  getReadSignal() {
    return this.readSignal;
  }
}
