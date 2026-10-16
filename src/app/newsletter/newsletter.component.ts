import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NewsletterService } from './newsletter.service';
import { NgModel } from '@angular/forms';
import { AlertService } from "../alert/alert.service";
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css','../app.component.css'],
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
export class NewsletterComponent implements OnInit {
  constructor(
    private newsletterService: NewsletterService,
    private alertService: AlertService
  ) {}
  selectedAddresses: number[] = Array();
  newsletterAddresses : any;
  templateText: any;
  showDeleteAddresses: boolean = false;
  showSendNewsletter: boolean = false;
  showInformation: boolean = false;
  

  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  ngOnInit() {
    this.getAddresses();
    this.alertService.currentAlert.subscribe(alert => this.alert = alert)
    this.getTemplate();
  }

  selectAllAddresses() {
    this.selectedAddresses = Array();
    for (let i in this.newsletterAddresses) {
      this.newsletterAddresses[i].status = true;
      this.selectedAddresses.push(this.newsletterAddresses[i].address_id);
    }
  }

  selectAddress(address_id:number){
    const i: number = this.selectedAddresses.indexOf(address_id);
    if (i !== -1) {
        this.selectedAddresses.splice(i, 1);
    }else{
      this.selectedAddresses.push(address_id);
    } 
  }

  deleteAddresses(){
    this.newsletterService.deleteAddresses(this.selectedAddresses)
    .subscribe((res)=>{
      if(!res.error){
        this.getAddresses();
        this.showDeleteAddresses=false;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getAddresses(){
    this.newsletterService.getAddresses()
    .subscribe((res)=>{
      if(!res.error){
      this.newsletterAddresses = res.data;
        for (let i in this.newsletterAddresses) {
          this.newsletterAddresses[i].status = false;
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getTemplate(){
    this.newsletterService.getTemplate()
    .subscribe((res)=>{
      if(!res.error){
        this.templateText = res.data[0].templatetext;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  saveTemplate(){
    this.newsletterService.saveTemplate(this.templateText)
    .subscribe((res)=>{
      if(!res.error){
        this.getTemplate();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  textReplaceTags(){
    this.templateText = this.templateText.replace(/<p[^>]*>/g, "").replace("</p>","<br/>").replace(/\r?\n|\r/g,"").replace(/\t/g,"");
  }

  sendNewsletter(){
    console.log("send newsletter");
  }

}
