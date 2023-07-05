import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  username: any = null;
  menu: any = 'default';
  mode = 'side';
  constructor(private route: Router, public loginService: LoginService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if(val.url) {
        if (sessionStorage.getItem("name")) {
          this.username = sessionStorage.getItem("name") ? sessionStorage.getItem("name") : null;
          this.menu = 'user';
        }
      }
    });

    this.sharedService.modeChange.subscribe(() => {
      this.mode = this.sharedService.mode;
    });
  }

  onMenuClick() {
    this.sharedService.emitButtonClick();
  }

  navigate(url: any) {
    if (url == 'login' && this.menu != 'default') {
      this.route.navigateByUrl('/main');
    } else {
      this.route.navigateByUrl('/' + url);
    }
  }

  logoutUser() {
    sessionStorage.removeItem('name');
    this.menu = 'default';
    this.route.navigate(['/'])
  }
}
