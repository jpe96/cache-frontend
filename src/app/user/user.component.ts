import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { NgModel } from '@angular/forms';
import { AlertService } from "../alert/alert.service";      
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css','../app.component.css'],
  animations: [
    trigger('fade', [      
      transition(':enter', [
        style({ opacity: '0' }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ])
  ]
})
export class UserComponent implements OnInit {

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {}
  allUser : any;
  allBook : any;
  defaultBook: any = {"bookid":0, "bookname":"Alle Ausgaben"};
  listBook : any;
  newUserForm: UntypedFormGroup;
  isSubmitted = false;
  usernameUsed : boolean;
  permission:string[] = ['autor','admin', 'viewer'];

  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  ngOnInit() {
    this.getBook();
    this.alertService.currentAlert.subscribe(alert => this.alert = alert)
    this.newUserForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      permission: ['1'],
      book: ['0'],
    });
  }

  get formControls() {
    return this.newUserForm.controls;
  }

  getUser(){
    this.userService.getUser()
    .subscribe((res)=>{
      if(!res.error){
        this.allUser = res.data;
        for (let key in this.allBook) {
          for (let key2 in this.allUser) {
            if(this.allUser[key2].permission_book == this.allBook[key].bookid){
              this.allUser[key2].permission_book = this.allBook[key].bookname
            }
          }
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  getBook(){
    this.userService.getBook()
    .subscribe((res)=>{
      if(!res.error){
        this.allBook = res.data;
        this.allBook.unshift(this.defaultBook);  
        this.getUser();     
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteUser(userid:number){
    this.userService.deleteUser(userid)
    .subscribe((res)=>{
      console.log(res);
      if(!res.error){
        this.getUser();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  createUser(){
      this.isSubmitted = true;
      if(this.newUserForm.invalid){
        return;
      }
      for (let key in this.allUser) {
          if(this.newUserForm.value.username == this.allUser[key]['username']){
            this.usernameUsed = true;
            return;
          }else{
            this.usernameUsed = false;
          }
      }
      this.userService.createUser(this.newUserForm.value)
            .subscribe((res)=>{
              if(!res.error){
                this.getUser();
              }else{
                this.sendAlert(res.data,1);
              }
      });
  }
    
}
