import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  username: any = null;
  menu: any = 'default';
  constructor(private route: Router, public loginService: LoginService) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if(val.url) {
        if (sessionStorage.getItem("name")) {
          this.username = sessionStorage.getItem("name") ? sessionStorage.getItem("name") : null;
          this.menu = 'user';
        }
      }
    });
  }
  navigate(url: any) {
    this.route.navigateByUrl('/' + url);
  }

  logoutUser() {
    sessionStorage.removeItem('name');
    this.menu = 'default';
    this.route.navigate(['/'])
  }
}
