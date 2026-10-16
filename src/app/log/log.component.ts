import { Component, OnInit } from '@angular/core';
import { LogService } from '../log/log.service';
import { AlertService } from "../alert/alert.service";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css','../app.component.css'],
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
export class LogComponent implements OnInit {

  constructor(
    private LogService: LogService,
    private alertService: AlertService
  ){};

  logData : any;
  position : number = 0;

  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  ngOnInit() {
    this.alertService.currentAlert.subscribe(alert => this.alert = alert);
    this.getLogData();
  }

  getLogData(){
    this.LogService.getLogData()
    .subscribe((res)=>{
      if(!res.error){
        this.logData = res.data
        for(let key in this.logData){
          this.logData[key].time = formatDate(this.logData[key].logtimestamp*1000, 'dd.MM.yyyy HH:mm:ss', 'en-US');
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  

}
