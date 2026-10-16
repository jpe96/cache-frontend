import { Component, OnInit, DoCheck } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doorman',
  templateUrl: './doorman.component.html',
  styleUrls: ['./doorman.component.css'],
  animations: [
    /* DOORMAN */
    trigger('doormanAnimation', [
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
    trigger('doormanImageFadeAnimation', [
      state('show', style({
        opacity: 1
      })),
      state('*', style({
        opacity: 0
      })),
      transition('* <=> show', [
        animate('4s 0.1s')
      ])
    ]),
    trigger('doormanContainerAnimation', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate(1000)
      ]),
      transition(':leave', [
        animate(1000, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ]),
    trigger('doormanBookAnimation', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      state('top', style({
        transform: 'translateY(7%)',
        opacity: 1
      })),
      state('bottom', style({
        transform: 'translateY(calc(93%))',
        opacity: 1
      })),
      state('bottom_bottom', style({
        transform: 'translateY(calc(100%))',
        opacity: 1
      })),
      transition('* => show', [
        animate('2s ease-in-out')
      ]),
      transition('* <=> top', [
        animate('1s ease-in-out')
      ]),
      transition('bottom_bottom => bottom', [
        animate('1s ease-in-out')
      ])
    ]),
    trigger('doormanBookTextAnimation', [
      state('show', style({
        maxHeight: 'calc(100vh - 130px)'
      })),
      state('hide', style({
        maxHeight: '0px'
      })),
      transition('* <=> *', [
        animate('0.5s')
      ])
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate(500)
      ]),
      transition(':leave', [
        animate(500, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ]),
    trigger('loaderLogoAnimation', [
      state('show', style({
        transform: 'translate(20vw, calc(50dvh - 5.25vw))',
        opacity:1
      })),
      state('pulse', style({
        transform: 'translate(20vw, calc(50dvh - 5.25vw)) scale(1.1)',
        opacity:1
      })),
      transition('pulse <=> show', [
        animate('1.5s ease-in-out')
      ]),
    ]),
  ]
})
export class DoormanComponent implements OnInit, DoCheck {

  private activeStateSubscription: Subscription;
  private _lastBooklistOrder: string = '';

  constructor(
    public frontendService: FrontendService
  ) { }


  ngOnInit() {
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
  }

  ngDoCheck() {
    if (this.frontendService.booklist) {
      const order = this.frontendService.booklist.map((b: any) => b.bookid).join(',');
      if (this._lastBooklistOrder && this._lastBooklistOrder !== order) {
        console.warn('[doorman] BOOKLIST ORDER CHANGED:', this._lastBooklistOrder, '→', order);
      }
      this._lastBooklistOrder = order;
    }
  }

  ngOnDestroy() {
    this.activeStateSubscription.unsubscribe();
  }

  activeStateChange(state){
    if(state=="doorman"){
      this.showDoorman()
    }else{
      this.hideDoorman()
    }
  }


  showDoorman(){
    this.doormanState='show';
  }
  hideDoorman(){
    this.doormanState='hide';
  }

  doormanState: String = 'show';
  doormanContainerState: boolean = false;
  loaderLogoState:string = 'show'


  loaderLogoAnimationDone(event){
    if(this.frontendService.booklistLoaded&&event.toState=="show"){
      this.loaderLogoState="hide"
    }else{
      if(event.toState=="show"){
        this.loaderLogoState="pulse";
      }
      if(event.toState=="pulse"){
        this.loaderLogoState="show";
      }
    }
  }



  doormanBookClickTitle(book){
    if(!this.frontendService.mobileVersion||book.textState=="show"){
      this.doormanBookClick(book);
    }else{
      book.textState = "show";
    }
  }

  doormanBookClickText(book){
    if(this.frontendService.mobileVersion){
      this.doormanBookClickTitle(book)
    }
  }


  doormanBookClick(book){
    if(book.public==1){
      this.frontendService.openBookOutside(book.bookid)
    }
  }

  doormanBookCheckText(bookid){
    // if(this.frontendService.mobileVersion){
    //   let title_height = document.getElementById('doorman_book'+bookid).getBoundingClientRect().height;
    //   let text_div = document.getElementById('doorman_book_text'+bookid)
    //   text_div.style.marginTop = title_height + "px";
    // }
  }

  doormanAnimationDone(event){
    this.frontendService.animationNavigate = false
  }

  doormanImageLoop(bookid){
    var bookKey = this.frontendService.getBookArrayKey(bookid);
    for(let key in this.frontendService.booklist){
      if(key!=bookKey){
        this.frontendService.booklist[key].imageLoop=false;
      }
    }
    if(this.doormanState=='show'){
      var book = this.frontendService.booklist[bookKey];
      if(book.public==1){
        book.imageLoop=true;
        clearTimeout(book.doormanBookImageDiashowTimeout);
        this.doormanBookImageDiashow(book);
      }
    }
  }

  doormanBookImageDiashow(book){
    book.doormanBookImageDiashowTimeout = setTimeout(() =>  {
      this.doormanBookImageDiashowLoop(book);
    }, 2000);
  }
  doormanBookImageDiashowLoop(book){
    if(book.imageLoop){
      if(book.images.length>1){
        console.log(`[doorman] book ${book.bookid} → diashow loop (actualimage=${book.actualimage}, images.length=${book.images.length})`);
        book.actualimage++;
          if(book.images.length <= book.actualimage)book.actualimage=0;
          if(book.imageState1=='show'){
            book.image2 = book.images[book.actualimage];
            console.log(`[doorman] book ${book.bookid} → slot2 fade IN: ${book.image2} (state1=${book.imageState1})`);
            book.imageState1 = 'hide';
            book.imageState2 = 'show';
          }else{
            book.image1 = book.images[book.actualimage];
            console.log(`[doorman] book ${book.bookid} → slot1 fade IN: ${book.image1} (state1=${book.imageState1})`);
            book.imageState1 = 'show';
            book.imageState2 = 'hide';
          }
          book.doormanBookImageDiashowTimeout = setTimeout(() => this.doormanBookImageDiashowLoop(book), 5000);
      }
    }
  }

  doormanImageLoopStop(book){
    book.imageLoop = false;
  }

  trackByBookId(index: number, book: any): any {
    return book.bookid;
  }

  floor(number){
    return Math.floor(number)
  }

}
