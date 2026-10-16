import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from  '../authentication/authentication.service';
import { AlertService } from "../alert/alert.service";
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent implements OnInit {

  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }


  loginForm: UntypedFormGroup;
  isSubmitted = false;
  loginFalse = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
) {
    if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/admin']);
    }
}
  ngOnInit() {
    this.alertService.currentAlert.subscribe(alert => this.alert = alert)
    this.loginForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  

  get formControls() {
    return this.loginForm.controls;
  }

  login(){
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.authenticationService.login(this.formControls.username.value, this.formControls.password.value).pipe(first()).subscribe(
                data => {
                  if(data.error){
                    if(data.data){
                      this.sendAlert(data.data, 1);
                    }else{
                      this.loginFalse = true;
                    }
                  }else{
                    this.router.navigate(['/admin']);
                  }
                });
  }

}
