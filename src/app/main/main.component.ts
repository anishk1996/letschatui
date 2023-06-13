import { Component, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  message: any = '';
  users: any = [];
  chats: any = [];
  newChats: any = [];
  notification: any = [];
  previousSelectedUserID: any = -1;
  selectedUserID: any = -1;
  selectedChatID: any = -1;
  selectedUserName: any = '';
  closed: boolean = false;
  isLoading: boolean = false;
  hideList: boolean = false;

  constructor(private socketService: SocketService, private userService: UsersService) {
    this.socketService.tryReceivingMsg();
  }
  
  toggleList() {
    this.hideList = !this.hideList;
  }
  
  scrollToBottom() {
      setTimeout(() => {
        const container = this.scrollContainer.nativeElement;
        container.scrollTop = container.scrollHeight;          
      }, 100);
  }

  ngOnInit(): void {
    // Waiting for messages
    this.socketService.getChat().subscribe((response: any) => {
      if (response) {
        response['type'] = 'incoming';
        this.chats.push(response);
        this.newChats.push(response);
      }
    });

    //waiting for notgification
    this.socketService.getNotification().subscribe((response: any) => {
      if(response) {
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
    this.scrollToBottom();
  }

  async userSelected(index: any) {
    this.isLoading = true;
    this.toggleList();
    this.closed = false;
    if (this.users[index]._id != this.selectedUserID) {
      this.previousSelectedUserID = this.selectedUserID;
      this.selectedUserName = this.users[index].name;
      this.selectedUserID = this.users[index]._id;
    }
    if (this.previousSelectedUserID != -1) {
      await this.saveMessages();
    }
    this.userService.getChat(this.selectedUserID).subscribe(async (response) => {
      if (response == null) {
        this.createSelectedUserChat(this.selectedUserID);
      } else {
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
        }
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  async createSelectedUserChat(id: any) {
    this.userService.createChat(id).subscribe((response) => {
      if (response.length !== 0) {
        this.selectedChatID = response[0]._id;
        this.socketService.joinChatRoom(response[0]._id);
        this.isLoading = false;
      }
    });
  }

  async saveMessages() {
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
      this.scrollToBottom();
    });
  }

  async onChatClose() {
    this.closed = true;
    this.toggleList();
  }

}