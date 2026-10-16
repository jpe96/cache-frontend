import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('aboutAnimation', [
      state('show', style({
        transform: 'translateX(0px)'
      })),
      state('hide', style({
        transform: 'translateX(-130%)'
      })),
      state('hide_na', style({
        transform: 'translateX(-130%)'
      })),
      transition('show <=> hide', [
        animate('1s ease-in-out')
      ]),
      transition('hide_na => show', [
        animate('1s ease-in-out')
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {


  constructor(
    public frontendService: FrontendService
  ) { }

  activeStateSubscription: any;

  ngOnInit() {
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
  }

  ngOnDestroy() {
    this.activeStateSubscription.unsubscribe();
  }

  aboutState:string = 'hide';
  activeStateChange(state){
    if(state=="about"){
      this.aboutState = 'show'
      this.frontendService.waitFor(_ => document.getElementById("about")).then(_ => {
        document.getElementById("about").scrollTo({ top: 0, behavior: 'smooth' });
      })
    }else{
      this.aboutState = 'hide'
    }
  }

  aboutAnimationDone(event){
    this.frontendService.animationNavigate = false
  }

}
