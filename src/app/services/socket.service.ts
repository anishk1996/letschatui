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
  public userOnlineStatus = new Subject();
  public currentUserId: any;
  selectedChatID: any = -1;

  constructor(private socket: Socket) {
    let userData: any = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string) : null;
    this.currentUserId = userData._id;
    this.socket.emit('setup', userData);
  }

  ngOnInit(): void {
  }

  joinChatRoom(chatId: any) {
    this.selectedChatID = chatId;
    this.socket.emit('join chat', chatId);
  }

  setUserStatus() {
    this.socket.on('userOnlineStatus', (data: any) => {
      this.userOnlineStatus.next(data);
      console.log('Users online', data);
    })
  }

  sendMessage(msg: any) {
    this.socket.emit('new message', msg);
  }

  sendReadSignal(msg: any) {
    this.socket.emit('send read', msg);
  }

  async userStatus(status: string) {
    let data = {
      id: this.currentUserId,
      status: status
    };
    this.socket.emit('user status', data);
    console.log('emitted');
  }

  tryReceivingMsg(): any {
  this.socket.on('message received', (newMessageReceived: any) => {
    console.log('message received');    
    if(this.selectedChatID == -1  || this.selectedChatID != newMessageReceived.chat._id) {
      // give notification
      this.notification.next(newMessageReceived);
    } else {
      this.chat.next(newMessageReceived);
    }
  })

  this.socket.on('read received', (newMessageReceived: any) => {
    this.readSignal.next(newMessageReceived);
  });
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

  getUserOnlineStatus() {
    return this.userOnlineStatus;
  }
}
