import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';
@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.css'],
  animations: [
    trigger('impressumAnimation', [
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
    ]),
    trigger('impressumCrossAnimation', [
      state('0', style({
        transform: 'rotate(45deg) translate(8px, 0px) scale(0.7)'
      })),
      state('1', style({
        transform: 'translate(2px, 2px) scale(0.9)'
      })),
      transition('* <=> *', [
        animate('0.2s ease-in-out')
      ])
    ]),
    trigger('impressumCrossMobileAnimation', [
      state('0', style({
        transform: 'rotate(45deg) translate(0px, -8px) scale(0.9)'
      })),
      state('1', style({
        transform: 'none'
      })),
      transition('* <=> *', [
        animate('0.2s ease-in-out')
      ])
    ]),

    trigger('impressumToggleAnimation', [      
      state('true', style({
        height: '*'
      })),
      state('false', style({
        height: '0px'
      })),
      state('*', style({
        height: '0px'
      })),
      transition('* <=> *', [
        animate('0.5s ease-in-out')
      ]),
    ]),
  ]
})
export class ImpressumComponent implements OnInit {


  constructor(
    public frontendService: FrontendService
  ) { }

  activeStateSubscription: any;
  activeImpressumStateSubscription: any;

  ngOnInit() {
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
    this.activeImpressumStateSubscription = this.frontendService.getActiveImpressumState().subscribe((data) => {
      this.activeImpressumStateChange(data);
    });
  }

  ngOnDestroy() {
    this.activeStateSubscription.unsubscribe();
  }

  impressumState:string = "hide";
  impressumAlreadyShown:boolean = false

  activeStateChange(state){
    if(state=="impressum"){
      this.impressumAlreadyShown = true
      this.impressumState = 'show'
      this.frontendService.waitFor(_ => document.getElementById("impressum")).then(_ => {
        document.getElementById("impressum").scrollTo({ top: 0, behavior: 'smooth' });
      }).catch(error => {
        console.error('Timeout exceeded:', error.message);
      });
    }else{
      this.impressumState = 'hide'
    }
  }

  activeImpressumStateChange(state){
    if(state.bookid!="-1"){
      this.openImpressumBook(state.bookid, state.autorinnenkollektiv)
    }
  }

  trackByFn(index, item) {
    return index;
  }

  impressumAnimationDone(event){
    this.frontendService.animationNavigate = false
  }

  openImpressumBook(bookid, autorinnenkollektiv=false, second_time=false){
    var bookKey = this.frontendService.getBookArrayKey(bookid);
    if(!this.frontendService.booklist[bookKey].impressumShow){
      this.frontendService.booklist[bookKey].impressumShow = true;
      setTimeout(() => this.openImpressumBook(bookid, autorinnenkollektiv), 500);
    }else{
      let impressum_book = document.getElementById("impressum_book_"+bookid)
      if(autorinnenkollektiv){
        impressum_book = document.getElementById("impressum_book_kollektiv_"+bookid)
      }
      if (typeof(impressum_book) != 'undefined' && impressum_book != null){
        let impressum = document.getElementById("impressum")
        impressum.scrollTo({top: impressum_book.offsetTop, behavior: 'smooth'});
      }else{
        if(!second_time){
          setTimeout(() => this.openImpressumBook(bookid, autorinnenkollektiv, true), 500);
        }
      }
    }
  }


}
