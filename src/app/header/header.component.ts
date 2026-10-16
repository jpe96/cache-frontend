import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  currentUser: any;
  ngOnInit() {
    this.currentUser = this.authenticationService.getcurrentUser();
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }

}