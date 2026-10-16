import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ){}

  currentUser: any;
  ngOnInit() {
    this.currentUser = this.authenticationService.getcurrentUser();
  }


}