import { Component, ViewChild} from '@angular/core';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSidenav } from '@angular/material/sidenav';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  users: any = [];
  selectedUserID: any = -1;
  selectedChatID: any = -1;
  selectedUserName: any = '';

  constructor(private socketService: SocketService, private userService: UsersService, private SpinnerService: NgxSpinnerService, private sharedService: SharedService) {
  }

  toggleList() {
    this.sidenav.toggle();
    this.selectedChatID = -1;
    this.selectedUserID = -1;
    this.selectedUserName = '';
  }

  ngOnInit(): void {
    this.SpinnerService.show();
    this.userService.getAllUsers().subscribe((response) => {
      if (response) {
        this.users = response;
        this.SpinnerService.hide();
      }
    });
    this.sharedService.buttonClicked.subscribe(() => {
      this.sidenav.toggle();
    });
  }

  // ngAfterViewInit() {
  //   this.sidenav.toggle();
  // }

  async userSelected(index: any) {
    let toLoad: boolean = false;
    if (this.selectedUserID != -1 && this.selectedUserID == this.users[index]._id) {
      this.sidenav.toggle();
    } else {
      toLoad = true;
      this.toggleList();
    }
    if (toLoad) {
      this.selectedUserName = this.users[index].name;
      this.selectedUserID = this.users[index]._id;
      this.SpinnerService.show();
      this.userService.getChat(this.selectedUserID).subscribe(async (response) => {
        if (response == null) {
          this.createSelectedUserChat(this.selectedUserID);
        } 
        // else if(response.message == 'jwt expired') {
        //   this.SpinnerService.hide();
        // } 
        else {
          this.selectedChatID = response._id;
          this.socketService.joinChatRoom(response._id);
          this.SpinnerService.hide();
        }
      });
    }
  }

  async createSelectedUserChat(id: any) {
    this.userService.createChat(id).subscribe((response) => {
      if (response.length !== 0) {
        this.selectedChatID = response[0]._id;
        this.socketService.joinChatRoom(response[0]._id);
        this.SpinnerService.hide();
      }
    });
  }

}