import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DatePipe]
})
export class ChatComponent {

  @Input('selectedChatId') chat: any;
  @Input('selectedUserId') selectedUserID: any;
  @Input('selectedUserName') userName: any;

  @Output() chatClose = new EventEmitter();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  message: any = '';
  file: any;
  fileData: any;
  selectedFileName: any;
  fileType: any;
  file_resource_type: any = '';
  chats: any = {};
  newChats: any = [];
  notification: any = [];
  objectKeys = Object.keys;
  myDate: any = new Date();
  selectedUserName: any = '';
  messageRead: boolean = false;

  constructor(private uploadService: UploadService, private datePipe: DatePipe, private socketService: SocketService, private userService: UsersService, private SpinnerService: NgxSpinnerService) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.socketService.tryReceivingMsg();
  }

  ngOnInit() {
    // this.SpinnerService.show();
    // Waiting for messages
    this.socketService.getChat().subscribe((response: any) => {
      if (response) {
        response['type'] = 'incoming';
        this.groupChatByDate([response]);
          let keys = Object.keys(this.chats);
          this.socketService.sendReadSignal(this.chats[keys[0]][0]);
        this.scrollToBottom()
      }
    });

    //waiting for notgification
    this.socketService.getNotification().subscribe((response: any) => {
      if(response) {
        this.notification.push(response);
      }
    });

    //waiting for read signal
    this.socketService.getReadSignal().subscribe((response: any) => {
      if(response) {
        console.log('messaage read');
        this.messageRead = true;
      }
    });
    this.getMessages();
  }

  groupChatByDate(data: any) {
    data.forEach((element: any) => {
      let time = element.time.split('T')[0]
      if (this.chats.hasOwnProperty(time) == true) {
        this.chats[time].push(element)
      } else {
        this.chats[time] = []
        this.chats[time].push(element)
      }
    });
  }

  async getMessages() {
    const currentId = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string)._id: null
    this.userService.getMessages(this.chat).subscribe((response) => {
      if (response.length != 0) {
        let arr: any = [];
        response.forEach((item: any) => {
          if (item.sender._id == currentId) {
            item.type = 'outgoing';
          } else {
            item.type = 'incoming';
          }
          arr.push(item)
        });
        this.groupChatByDate(arr);
      }
      // if (this.notification.length > 0) {
      //   for (let i = 0; i < this.notification.length; i++) {
      //     let item = this.notification[i];
      //     if (item.chat._id == this.chat) {
      //       item['type'] = 'incoming';
      //       this.chats.push(item);
      //       this.notification.splice(i, 1);
      //     }
      //   }
      // }
      this.SpinnerService.hide();
      this.scrollToBottom();
    });
  }

  sendMessage() {
    let data = {
      name: sessionStorage.getItem("name"),
      time: new Date().toISOString(),
      msg: this.message,
      file: this.file,
      file_type: this.fileType,
      type: 'outgoing',
      chat: {
        _id: this.chat,
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
    this.groupChatByDate([data]);
    this.newChats.push(data);
    this.saveMessages();
    this.message = '';
    this.file = '';
    this.fileData = '';
    this.fileType = '';
    this.file_resource_type = '';
    this.selectedFileName = '';
    this.messageRead = false;
    this.scrollToBottom();
  }

  selectFile(event: any) {
    this.file = '';
    this.fileData = '';
    this.fileType = '';
    this.file_resource_type = '';
    this.selectedFileName = '';
    const file = event.target.files[0];
    this.fileData = file;
    this.selectedFileName = file.name;
    const allowedImgFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    const allowedVideoFileType = ["video/mp4"];
    const allowedAudioFileType = ["audio/mpeg"];
    if (file && file.size <= 10*1024*1024) {
      if (allowedImgFileTypes.includes(file.type)) {
        this.file_resource_type = 'image';
        this.fileType = 'image';
      } else if (allowedVideoFileType.includes(file.type)) {
        this.file_resource_type = 'auto';
        this.fileType = 'video';
      } else if (allowedAudioFileType.includes(file.type)) {
        this.fileType = 'audio';
        this.file_resource_type = 'auto';
      } else {
        this.file = '';
        this.fileData = '';
        this.fileType = '';
        this.file_resource_type = '';
        this.selectedFileName = '';
        alert("You can't send this file. It might not be a image/video/audio file");
      }
    } else {
      this.file = '';
      this.fileData = '';
      this.fileType = '';
      this.file_resource_type = '';
      this.selectedFileName = '';
      alert("You can't send this file, as it exceedes 16MB file size");
    }
  }

  async uploadFile() {
    if (this.file_resource_type != '') {
      this.SpinnerService.show();
      this.uploadService.uploadFile(this.fileData, this.file_resource_type).subscribe((response: any) => {
        this.file = response.secure_url;
        this.scrollToBottom();
        this.SpinnerService.hide();
        this.sendMessage();
      },
      (err: any) => {
        console.log('err from cloudinary', err);
        this.SpinnerService.hide();
      });
    } else {
      this.sendMessage();
    }
  }

  onFileDelete() {
    this.file = '';
    this.fileData = '';
    this.fileType = '';
    this.file_resource_type = '';
    this.selectedFileName = '';
  }

  async saveMessages() {
    if (this.newChats.length > 0) {
      this.userService.saveMessages(this.newChats).subscribe((response) => {
      });
    }
    this.newChats = [];
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = this.scrollContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }, 100);
  }

  async onChatClose() {
    this.chats = [];
    this.newChats = [];
    this.chat = '';
    this.chatClose.emit();
  }
}
