import { Component, OnInit } from '@angular/core';
import { AlertService } from "./alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  alert:any;



  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.currentAlert.subscribe(alert => this.alert = alert)
  }

  closeAlert(){
    this.alertService.changeMessage(false);
  }


}
