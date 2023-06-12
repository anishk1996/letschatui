import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  message: any = '';
  users: any = [];
  chats: any = [];
  newChats: any = [];
  notification: any = [];
  previousSelectedUserID: any = -1;
  selectedUserID: any = -1;
  selectedChatID: any = -1;
  isLoading: boolean = false;
  constructor(private socketService: SocketService, private userService: UsersService) {
    this.socketService.tryReceivingMsg();
  }

  ngOnInit(): void {
    // Waiting for messages
    this.socketService.getChat().subscribe((response: any) => {
      if (response) {
        console.log('message from service emit', response);
        response['type'] = 'incoming';
        this.chats.push(response);
        this.newChats.push(response);
      }
    });

    //waiting for notgification
    this.socketService.getNotification().subscribe((response: any) => {
      if(response) {
        console.log('Notification received', response);
        this.notification.push(response);

      }
    });

    this.userService.getAllUsers().subscribe((response) => {
      if (response) {
        this.users = response;
      }
    });
  }
  
  sendMessage() {
    let data = {
      name: sessionStorage.getItem("name"),
      time: new Date(),
      msg: this.message,
      type: 'outgoing',
      chat: {
        _id: this.selectedChatID,
        users: [
          {
            _id: this.selectedUserID
          }
        ]
      },
      sender: {
        _id: sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string)._id: null
      }
    }
    this.socketService.sendMessage(data);
    this.chats.push(data);
    this.newChats.push(data);
    this.message = '';
  }

  async userSelected(index: any) {
    this.isLoading = true;
    if (this.users[index]._id != this.selectedUserID) {
      this.previousSelectedUserID = this.selectedUserID;
      this.selectedUserID = this.users[index]._id;
    }
    if (this.previousSelectedUserID != -1) {
      await this.saveMessages();
    }
    console.log('Selected user', this.users[index]);
    this.userService.getChat(this.selectedUserID).subscribe(async (response) => {
      if (response == null) {
        this.createSelectedUserChat(this.selectedUserID);
      } else {
        console.log('response got', response);
        console.log('chat id', response._id);
        this.selectedChatID = response._id;
        this.socketService.joinChatRoom(response._id);
        await this.getMessages();
        if (this.notification.length > 0) {
          for (let i = 0; i < this.notification.length; i++) {
            let item = this.notification[i];
            if (item.chat._id == this.selectedChatID) {
              item['type'] = 'incoming';
              this.chats.push(item);
              this.newChats.push(item);
              this.notification.splice(i, 1);
            }
          }
        } else {
        }
        this.isLoading = false;
      }
    });
  }

  async createSelectedUserChat(id: any) {
    this.userService.createChat(id).subscribe((response) => {
      if (response.length !== 0) {
        console.log('response created', response[0]);
        console.log('chat id', response[0]._id);
        this.selectedChatID = response[0]._id;
        this.socketService.joinChatRoom(response[0]._id);
        this.isLoading = false;
      }
    });
  }

  async saveMessages() {
    console.log('all chats', this.newChats);
    if (this.newChats.length > 0) {
      this.userService.saveMessages(this.newChats).subscribe((response) => {
      });
    }
    this.newChats = [];
    this.chats = [];
  }

  async getMessages() {
    const currentId = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string)._id: null
    this.userService.getMessages(this.selectedChatID).subscribe((response) => {
      if (response.length != 0) {
        this.chats.push(response);
        response.forEach((item: any) => {
          if (item.sender._id == currentId) {
            item.type = 'outgoing';
          } else {
            item.type = 'incoming';
          }
          this.chats.push(item);
        });
      }
    });
  }

}