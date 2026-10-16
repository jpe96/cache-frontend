import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AlertService {

  alertSource = new BehaviorSubject(0);
  currentAlert = this.alertSource.asObservable();

  constructor() { }

  changeMessage(alert:any) {
    this.alertSource.next(alert);
    console.log(alert);
  }

}