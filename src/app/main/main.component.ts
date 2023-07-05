import { Component, ViewChild} from '@angular/core';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
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
  hideList: boolean = false;

  constructor(private observer: BreakpointObserver,private socketService: SocketService, private userService: UsersService, private SpinnerService: NgxSpinnerService, private sharedService: SharedService) {
  }

  toggleList() {
    this.hideList = !this.hideList;
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
      this.toggleNavbar();
    });
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width:800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.sharedService.mode = 'over';
        this.sharedService.modeChangeAlert();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
        this.sharedService.mode = 'side';
        this.sharedService.modeChangeAlert();
      }
    })
  }

  toggleNavbar() {
    if (this.sidenav.mode == 'over') {
      this.sidenav.mode = 'side';
      this.sidenav.open();
    } else {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }
  }

  async userSelected(index: any) {
    this.toggleList();
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