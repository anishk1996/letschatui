import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{

  public chat = new Subject();
  public notification = new Subject();
  selectedChatID: any = -1;
  constructor(private socket: Socket) {
    let userData: any = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string) : null;
    console.log('userData id', userData._id);
    this.socket.emit('setup', userData);
  }
  

  ngOnInit(): void {
  }

  joinChatRoom(id: any) {
    console.log('Joining room', id);
    this.selectedChatID = id;
    this.socket.emit('join chat', id);
  }

  sendMessage(msg: any) {
    console.log('sending msg', msg);
    // this.socket.emit('message sent', msg);
    this.socket.emit('new message', msg);
  }

  tryReceivingMsg(): any {
  this.socket.on('message received', (newMessageReceived: any) => {
    console.log('new msg received', newMessageReceived);
    if(this.selectedChatID == -1  || this.selectedChatID != newMessageReceived.chat._id) {
      // give notification
      this.notification.next(newMessageReceived);
    } else {
      this.chat.next(newMessageReceived);
    }
  })
  }

  getChat() {
    return this.chat;
  }

  getNotification() {
    return this.notification;
  }

}
