import { HostListener, Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FrontendService } from '../frontend/frontend.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate, state, group, query, animateChild } from '@angular/animations';
import ResizeObserver from 'resize-observer-polyfill';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-book-frontend',
  templateUrl: './book-frontend.component.html',
  styleUrls: ['./book-frontend.component.css'],
  animations: [
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
    trigger('booktitleChapterAnimation', [      
      state('fixed_1', style({
        opacity: '1'
      })),
      state('fixed_2', style({
        opacity: '0'
      })),
      transition('* <=> *', [
        animate('0.2s')
      ]),
    ]),
    trigger('imageAnimation', [
      state('show', style({
        opacity: 1
      })),
      state('*', style({
        opacity: 0
      })),
      transition('* <=> show', [
        animate('1s')
      ])
    ]),
    trigger('megamenuAnimation', [
      state('hide', style({
        transform: 'translateY(-100%)'
      })),
      state('show', style({
        transform: 'translateY(75px)'
      })),
      state('show_mobile', style({
        transform: 'translateY(73px)'
      })),
      transition('hide <=> show', [
        animate('0.5s ease-in-out')
      ]),
      transition('hide <=> show_mobile', [
        animate('0.5s ease-in-out')
      ])
    ]),

    trigger('booktitleAnimation', [
      state('fixed_1', style({
        transform:'translateY(0px)',
        boxShadow: "rgba(0, 0, 0, 0.2) 0px 1px 5px 0px"
      })),
      state('fixed_2', style({
        transform:'translateY(45px)'
      })),

      transition('* <=> *', [
        group([
          query("@booktitleChapterAnimation", animateChild(), { optional: true }),
          animate('0.2s')
        ]),
      ]),
    ]),
    trigger('partlistAnimation', [
      state('up', style({
        transform: 'translateY({{partlistAnimationTop}}px)',
        height: '240px'
      }), {params: {partlistAnimationTop: 1, partlistAnimationZIndex: 1}}),
      state('down', style({
        transform: 'translateY({{partlistAnimationBottom}}px)',
        height: '240px'
      }), {params: {partlistAnimationBottom: 1, partlistAnimationZIndex: 1}}),
      state('stay', style({
        transform: 'translateY(0px)',
        height: '240px'
      }), {params: {partlistAnimationBottom: 1, partlistAnimationZIndex: 1}}),
      state('tile_up', style({
        transform: 'translateY(-100vh)',
        position: 'absolute',
        zIndex: '{{partlistAnimationZIndex}}',
        height: 'calc(100% - 77px)',
        overflow: 'hidden',
      }), {params: {partlistAnimationZIndex: 1}}),
      state('tile_up_na', style({
        transform: 'translateY(-100vh)',
        position: 'absolute',
        zIndex: '{{partlistAnimationZIndex}}',
        height: 'calc(100% - 77px)',
        overflow: 'hidden',
      }), {params: {partlistAnimationZIndex: 1}}),
      state('tile_down', style({
        transform: 'translateY(77px)',
        position: 'absolute',
        zIndex: '{{partlistAnimationZIndex}}',
        height: 'calc(100% - 77px)',
        overflow: 'hidden',
      }), {params: {partlistAnimationZIndex: 1}}),
      state('hide', style({
        display: 'none'
      })),
      transition('stay => up', [
        animate('0.5s ease-in-out')
      ]),
      transition('tile_up <=> tile_down', [
        animate('0.7s ease-in-out')
      ]),
      transition('tile_up_na => tile_down', [
        animate('0.7s ease-in-out')
      ]),
      transition('stay <=> down', [
        animate('1s ease-in-out')
      ]),
      transition('up => stay', [
        animate('0.5s ease-in-out')
      ]),
    ]),
    trigger('partimageAnimation', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      state('show_na', style({
        opacity: 1
      })),
      state('hide_na', style({
        opacity: 0
      })),
      state('slide_left', style({
        transform: 'translateX(calc(-100% - 10px))',
      })),
      transition('* => hide', [
        animate('{{partImageFadeTime}}ms 0.1s')
      ]),
      transition('* => show', [
        animate('{{partImageFadeTime}}ms 0.1s')
      ]),
      transition('* => slide_left', [
        animate('1s ease-in-out')
      ])
    ]),
    trigger('partimagecontainerAnimation', [
      state('slide_middle', style({
        transform: 'translateX(0vw)',
      })),
      state('slide_middle_na', style({
        transform: 'translateX(0vw)',
      })),
      state('slide_left', style({
        transform: 'translateX(calc(-100vw - 10px))',
      })),
      state('slide_left_na', style({
        transform: 'translateX(calc(-100vw - 10px))',
      })),
      transition('slide_middle <=> slide_left', [
        animate('1s 0.1s ease-in-out')
      ]),
      transition('slide_left_na => slide_middle', [
        animate('1s 0.1s ease-in-out')
      ]),
      transition('slide_middle_na => slide_left', [
        animate('1s 0.1s ease-in-out')
      ])
    ]),
    trigger('partregisterAnimation', [
      state('hide', style({
        width: '0px'
      })),
      state('show', style({
        width: '100vw'
      })),
      transition('* <=> *', [
        animate('1s 0.1s ease-in-out')
      ])
    ]),
    trigger('partregisterchapterAnimation', [
      state('hide', style({
        height: '2px',
        top: '60px'
      })),
      state('show', style({
        height: '62px',
        top: '0px'
      })),
      state('show_na', style({
        height: '62px',
        top: '0px'
      })),
      transition('* <=> show', [
        animate('0.5s ease-in-out')
      ]),
      transition('* <=> hide', [
        animate('0.5s ease-in-out')
      ]),
    ]),
    trigger('chapterlistTitleAnimation', [
      state('list', style({
        height:"*",
        opacity:'1'
      })),
      state('transparent', style({
        height:"*",
        opacity:'0'
      })),
      state('hide', style({
        display: 'none'
      })),
      transition('hide => list', [
        style({ opacity: '1'})
      ]),
    ]),
    trigger('unitAnimation', [
      state('slide_left', style({
        transform: 'translate(-103vw, 0px)'
      })),
      state('slide_left_na', style({
        transform: 'translate(-103vw, 0px)'
      })),
      state('show', style({
        transform: 'translate(0px, 0px)'
      })),
      state('show_na', style({
        transform: 'translate(0px, 0px)'
      })),
      state('show_first', style({
        transform: 'translate(0px, 75px)'
      })),
      transition('show_first <=> show', [
        animate('0.2s ease-in-out')
      ]),
      transition('* <=> show', [
        animate('1s ease-in-out')
      ]),
      transition('* <=> slide_left', [
        animate('1s ease-in-out')
      ])
    ]),
    trigger('unitContainerAnimation', [
      state('show', style({
        transform: 'translateY(30px)',
      })),
      state('show_header', style({
        transform: 'translateY(75px)',
      })),
      state('show_header_na', style({
        transform: 'translateY(75px)',
      })),
      state('nextpart', style({
        transform: 'translateY(calc(-100vh + 75px))',
      })),
      transition('* => nextpart', [
        animate('0.9s ease-in-out')
      ]),
      transition('show <=> show_header', [
        animate('0.2s')
      ]),
      transition('show_header_na => show', [
        animate('0.2s')
      ])
    ]),
    trigger('transitionNextElementAnimation', [
      state('hide', style({
        transform: 'translateY(62px)',
        opacity: 1
      })),
      state('nextpart', style({
        transform: 'translateY(calc(-100vh + 139px))',
        opacity: 1
      })),
      state('nextpart_hide', style({
        transform: 'translateY(calc(-100vh + 139px))',
        opacity: 0
      })),
      state('bottom', style({
        transform: 'translateY(-2px)',
      })),
      transition('hide <=> bottom', [
        animate('0.2s')
      ]),
      transition('bottom => nextpart', [
        animate('0.5s ease-in-out')
      ]),
      transition('nextpart => nextpart_hide', [
        animate('0.5s ease-in-out')
      ])
    ]),
    trigger('transitionNextElementBackgroundAnimation', [
      state('hide', style({
        transform: 'translateY(-62px)',
      })),
      state('show', style({
        transform: 'translateY(0px)',
      })),
      transition('show <=> hide', [
        animate('0.2s')
      ])
    ]),
    trigger('transitionUnitToUnitAnimation', [
      state('slide_left', style({
        transform: 'translate(calc(-100% - 10px), 0px)',
      })),
      state('show_state_fixedheader', style({
        transform: 'translate(1px, 0px)',
      })),
      transition('* => slide_left', [
        animate('1.3s ease-in-out')
      ])
    ]),
    trigger('headerMobileAnimation', [
      state('1', style({
        height: '*'
      })),
      state('0', style({
        height: '0px'
      })),
      transition('* <=> *', [
        animate('1.3s ease-in-out')
      ])
    ]),
    trigger('mobileContainerAnimation', [
      state('1', style({
        transform: 'translateX(0px)'
      })),
      state('0', style({
        transform: 'translateX(-100vw)'
      })),
      transition('* <=> *', [
          animate('1s ease-in-out')
      ])
    ]),
    trigger('mobileChapterContainerAnimation', [
      state('*', style({
        transform: 'translateY(-100vh)'
      })),
      state('up', style({
        transform: 'translateY(-100vh)'
      })),
      state('down', style({
        transform: 'translateY(0px)'
      })),
      state('up_na', style({
        transform: 'translateY(-100vh)'
      })),
      state('down_na', style({
        transform: 'translateY(0px)'
      })),
      transition('up <=> down', [
        animate('1s ease-in-out')
      ]),
      transition('up_na => down', [
        animate('1s ease-in-out')
      ]),
      transition('down_na => up', [
        animate('1s ease-in-out')
      ]),
    ]),
    trigger('mobileUnitContainerAnimation', [
      state('slide_left', style({
        transform: 'translate(-103vw, 0px)'
      })),
      state('slide_left_na', style({
        transform: 'translate(-103vw, 0px)'
      })),
      state('show', style({
        transform: 'translate(0px, 0px)'
      })),
      state('show_first', style({
        transform: 'translate(0px, 45px)'
      })),
      transition('show_first <=> show', [
        animate('0.2s ease-in-out')
      ]),
      transition('* <=> show', [
        animate('1s ease-in-out')
      ]),
      transition('* <=> slide_left', [
        animate('1s ease-in-out')
      ])

    ]),
    trigger('mobileChapterheaderAnimation', [
      state('show', style({
        transform: 'translateY(0)'
      })),
      state('fixed', style({
        transform: 'translateY(-45px)',
        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2)'
      })),
      transition('* <=> *', [
        animate('0.2s ease-in-out')
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
  ]
})
export class BookFrontendComponent implements OnInit {

  private activeStateSubscription: Subscription;
  private activeBookStateSubscription: Subscription;


  hiddenImage: String = "";
  hiddenImageLoaded: boolean = false;
  navigationBlocked: boolean = false;
  booklistImageDiashowTimeout: any;

  /* ANIMATIONS */
  partlistAnimationTop: number;
  partlistAnimationBottom: number;

  partlistAnimationSpeed: number = 700;
  partlistLineWidthMiddleSpeed: number = 700;
  partlistLineWidthSpeed: number = 700;
  partlistImageDiashowTimer: any;
  animationImageDiashow: any;
  animationImageDiashowLoop: any;
  animationUnitToUnit: boolean;
  animationUnitToNextPart: boolean;
  animationPartTile: boolean = false;
  transitionUnitToUnitState: String =  "show_state_fixedheader";

  unitLoading:boolean=false;

  partImageFadeTime: number = 4000;

  imagePreview: any;
  checkImagePreviewDimensionChecked: boolean = false;

  /* unit animations */
  unitBottom: boolean = false;
  unitBottomWait: boolean = false;
  timeoutUnitBottom: any;
  transitionNextElementState: String = 'hide';
  transitionNextElementBackgroundState: String = 'show';
  transitionNextElementPart: String;
  transitionNextElementImage: String;

  animationstack = [];

  /* MOBILE VERSION */
  headerMobileState:boolean = false;
  mobileBookState:boolean = true;
  mobilePartState:boolean = true;
  mobileUnitState:boolean = true;
  mobileChapterheaderState:String = "show";
  mobilePartoverviewState:boolean = false;


  /* MEGAMENU FUNCTIONS */

  bodyheightState: String = 'auto';
  booktitleState: String = 'fixed_1';
  megamenuState: String = 'hide';


  @ViewChild('chapterheader') chapterheader?: ElementRef<HTMLElement>;
  // @ts-ignore
  private ro?: ResizeObserver;
  constructor(
    public frontendService: FrontendService,
    private renderer: Renderer2
  ) { }


  @ViewChild('chapterheader')
  set header(el: ElementRef<HTMLElement> | undefined) {
    if (!el) return;

    this.chapterheader = el;
    this.updateHeaderHeight();

    this.ro?.disconnect();
    // @ts-ignore
    this.ro = new ResizeObserver(() => this.updateHeaderHeight());
    this.ro.observe(el.nativeElement);
  }

  activeBookStateOld:string = 'book'
  activeStateOld:string = 'doorman'
  ngOnInit() {
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
    this.activeBookStateSubscription = this.frontendService.getActiveBookState().subscribe((data) => {
      this.activeBookStateChange(data);
    });
    window.addEventListener('keydown', this.handleKeyboardEvent, true);
    window.addEventListener('wheel', this.wheel, true);
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    this.activeStateSubscription.unsubscribe();
    this.activeBookStateSubscription.unsubscribe();
    window.removeEventListener('wheel', this.wheel, true);
    window.removeEventListener('scroll', this.scroll, true);
    window.removeEventListener('keydown', this.handleKeyboardEvent, true);
    this.ro?.disconnect();
  }

  book_openend_outside: boolean = false;
  activeStateChange(state){
    if(state=="book"&&this.activeStateOld!=state){
      this.resetBook(this.frontendService.activeBook)
      this.book_openend_outside = true
    }
    this.activeStateOld = state
  }

  activeBookStateChange(state){
    this.navigateInBook()
  }

  handleKeyboardEvent = (event): void => {
    if(!this.frontendService.animationNavigate&&this.frontendService.activeState=="book"&&!this.frontendService.mobileVersion&&!this.frontendService.showSearch){
      var key = event.which || event.keyCode;
      var activePartKey = this.frontendService.getPartArrayKey(this.frontendService.activePart.partid)
      var partlist = this.frontendService.activeBook.partlist
      switch (key){
        case 40:
          if(this.frontendService.activeBookState=="part"){
            if(partlist[(Number(activePartKey)+1)]){
              this.frontendService.openBook(this.frontendService.activeBook.bookid, partlist[(Number(activePartKey))+1].partid);
            }
          }
        break;
        case 38:
          if(this.frontendService.activeBookState=="part"){
            if(partlist[(Number(activePartKey)-1)]){
              this.frontendService.openBook(this.frontendService.activeBook.bookid, partlist[(Number(activePartKey))-1].partid);
            }
          }
        break;
        case 39:
          if(this.frontendService.activeBookState=="unit"){
            this.animationstackClear();
            this.goUnitSlideLeft();
          }
        break;
        case 37:
          if(this.frontendService.activeBookState=="unit"){
            this.animationstackClear();
            this.goUnitSlideRight();
          }
        break;
      }
    }
  }

  scroll = (event): void => {
    if(!this.frontendService.mobileVersion&&this.frontendService.activeState=="book"&&!this.frontendService.showSearch){
      if(!this.frontendService.animationNavigate&&this.megamenuState!='show'){
        if(this.frontendService.activeBookState=='unit'&&!this.animationUnitToUnit){
          if(event.target.id.replace("unit","")==this.frontendService.activeUnit.unitid){
            var element = event.target;
            if(this.frontendService.activeUnitKey==0){
                if(element.scrollTop!=0){
                  this.booktitleState="fixed_1";
                  this.frontendService.headerState="hide";
                  this.frontendService.activePart.unitContainerState = "show";
                }else{
                  this.booktitleState="fixed_2";
                  this.frontendService.headerState="show";
                  this.frontendService.activePart.unitContainerState = "show_header";
                }
            }

            let elementPosition = element.scrollTop + element.offsetHeight;
            let elementHeight = element.scrollHeight;
            if(elementPosition >= elementHeight){
              var chapterkey = this.frontendService.activeChapterKey;
              var chapterweb;
              var exitloop = false;
              var part = this.frontendService.activeBook.partlist[this.frontendService.activePartKey];
              if(this.frontendService.activeUnitKey==part.chapterlist[chapterkey].unitlist.length-1){
                do{
                  if(part.chapterlist[Number(chapterkey)+1]){
                    chapterweb = part.chapterlist[Number(chapterkey)+1].chapterweb;
                  }else{exitloop=true}
                  chapterkey++;
                }while(!exitloop&&chapterweb==0)
              }

              if(!part.chapterlist[chapterkey]){
                this.showNextPart();
              }else{
                if(!this.unitBottom&&!this.unitBottomWait){
                  this.unitBottomWait = true;
                  this.timeoutUnitBottom = setTimeout(() => this.unitBottom = true, 1000);
                }
              }
            }
          }
        }
      }
      // Show booktitle if scrolled in book view //
      if(this.frontendService.activeBookState=="book"){
        var bookScrolltop = document.getElementById("book").scrollTop;
        if(bookScrolltop>90){
          if(this.booktitleState=="fixed_1"){
            this.booktitleState="fixed_2";
          }
        }else{
          if(this.booktitleState=="fixed_2"){
            this.booktitleState="fixed_1";
          }
        }
      }


      if(this.frontendService.mobileVersion&&this.frontendService.activeBookState=='unit'){
        if(this.frontendService.activeUnit.unitContainerState=="show_first"){
          var unitElement = document.getElementById("unit"+this.frontendService.activeUnit.activeUnitId);
          if(unitElement.scrollTop>0){
            this.frontendService.activeUnit.unitContainerState="show";
            this.frontendService.headerState="hide";
            this.mobileChapterheaderState="fixed";
          }
        }
        if(this.frontendService.activeChapterKey==0&&this.frontendService.activeUnitKey==0){
          var unitElement = document.getElementById("unit"+this.frontendService.activeUnit.activeUnitId);
          if(unitElement.scrollTop==0){
            this.frontendService.activeUnit.unitContainerState="show_first";
            this.frontendService.headerState="show";
            this.mobileChapterheaderState="show";
          }
        }
      }

    }
    
  };
  wheel = (event): void => {
    if(this.frontendService.activeState == 'book' && !this.frontendService.animationNavigate && this.megamenuState!='show'
      && !this.frontendService.mobileVersion && !this.frontendService.showSearch){
      if(this.frontendService.activeBookState=='unit'){
        if(event.deltaY>0){
          if(this.unitBottom){
            this.goUnitSlideLeft();
          }
        }else{
          clearTimeout(this.timeoutUnitBottom);
          this.unitBottom=false;
          this.unitBottomWait=false; 
          if(this.animationUnitToNextPart){
            this.unitHideNextPart();
          }
        }
      }else if(this.frontendService.activeBookState=='part'){
        if(!this.animationPartTile){
          if(event.deltaY>0){
            if(this.frontendService.activeBook.partlist[(Number(this.frontendService.activePartKey)+1)]){
              this.frontendService.openBook(this.frontendService.activeBook.bookid,this.frontendService.activeBook.partlist[(Number(this.frontendService.activePartKey)+1)].partid);
            }
          }else{
            if(this.frontendService.activeBook.partlist[(Number(this.frontendService.activePartKey)-1)]){
              this.frontendService.openBook(this.frontendService.activeBook.bookid,this.frontendService.activeBook.partlist[(Number(this.frontendService.activePartKey)-1)].partid);
            }
          }
        }
      }
    }
  };

  updateHeaderHeight() {
    const h = this.chapterheader?.nativeElement.offsetHeight ?? 0;
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  }

  resetBook(book){
    let bookinfoElement = document.getElementById("book_info");
    if(bookinfoElement){
      this.renderer.removeStyle(bookinfoElement, 'display');
    }

    this.frontendService.headerState = 'show';
    this.bodyheightState = 'auto';
    this.booktitleState = 'fixed_1';
    this.megamenuState = 'hide';
    setTimeout(() => {
      if(document.getElementById("book")){
        document.getElementById("book").scrollTop = 0}
      }
    , 100)
    this.activeBookStateOld = 'book'
    let partlist = book.partlist;
    if(book.partlist){
      for (let part of partlist) {

        part.image1 = part.images[0].imagelink;
        if(part.images[1]){
          part.image2 = part.images[1].imagelink;
        }
        part.actualimage = 0;
        if(!this.frontendService.mobileVersion){

          part.partregisterState = "show"
          part.partlistState = 'stay';
          part.partlistAnimationTop = 0;
          part.partimageState1 = 'show_na';
          part.partimageState2 = 'hide_na';
          part.partimagecontainerState = "slide_middle";
          if(part.partregisterchapterState){
            part.partregisterchapterState = 'hide';
          }

          for (let key2 in part.chapterlist) {
            part.chapterlist[key2].chapterlistTitleState = "hide";
          }
        }else{
          part.partimageState1 = 'show_na';
          part.partimageState2 = 'hide_na';
        }
      }
    }
  }

  navigateInBook(){
    if(this.megamenuState=='show'){
      this.megamenuClose();
    }
    this.animationstackClear();

    if(!this.frontendService.activeBook.activeBookOldId){
      this.resetBook(this.frontendService.activeBook)
    }

    let bookid = -1
    let partid = -1
    let chapterid = -1
    let unitid = -1
    if(this.frontendService.activeBook){
      bookid = this.frontendService.activeBook.bookid
      if(this.frontendService.activePart){
        partid = this.frontendService.activePart.partid
        if(this.frontendService.activeChapter){
          chapterid = this.frontendService.activeChapter.chapterid
          if(this.frontendService.activeUnit){
            unitid = this.frontendService.activeUnit.unitid
          }
        }
      }
    }
    

    let bookKey = this.frontendService.getBookArrayKey(bookid)
    let partKey = this.frontendService.getPartArrayKey(partid, bookid)
    let chapterKey = this.frontendService.getChapterArrayKey(bookid, chapterid, partKey)
    let unitKey = this.frontendService.getUnitArrayKey(bookid, unitid, partKey, chapterKey)
    //console.log("bookid", bookid, "partid", partid, "chapterid", chapterid, "unitid", unitid, "activeBookState", this.frontendService.activeBookState, "activeBookStateOld", this.activeBookStateOld)
    if(this.frontendService.activeUnit){
      if(this.frontendService.mobileVersion){
        this.mobileGoToUnit(bookid, partid, chapterid, unitid);
        this.frontendService.animationNavigate = false
      }else{
        if(this.book_openend_outside){
          this.animationstackAdd("goDirectChapter");
          this.animationstackAdd("goUnitToUnit", chapterKey, unitKey);
        }else{
        switch(this.activeBookStateOld){
          case 'unit':
            if(this.frontendService.activeBook.activePartOldId&&this.frontendService.activeBook.activePartOldId==this.frontendService.activePart.partid){
              this.animationstackAdd("goUnitToUnit", chapterKey, unitKey, false, (this.frontendService.activeElementId!=-1));
            }else{
              this.animationstackAdd("goUnitToUnitOtherPart", partKey, chapterKey);
              this.animationstackAdd("goUnitToUnit", chapterKey, unitKey);
            }
            break;
          case 'part': 
            if(this.frontendService.activeBook.activePartOldId&&this.frontendService.activeBook.activePartOldId!=this.frontendService.activePart.partid){
              this.animationstackAdd("goDirectChapter");
            }else{
              if(unitKey!=0){
                this.animationstackAdd("goDirectChapter");
              }else{
                this.animationstackAdd("goPartToUnit", chapterid);
                this.animationstackAdd("goUnitToUnit", chapterKey, unitKey, true, (this.frontendService.activeElementId!=-1));
              }
            }
            
            break;
          case "book":
            this.animationstackAdd("goPartoverviewToPart", partid);
            this.animationstackAdd("goPartToUnit", chapterid);
            this.animationstackAdd("goUnitToUnit", chapterKey, unitKey, true, (this.frontendService.activeElementId!=-1));
            break;
        }
          
      }
      } 

      if(this.frontendService.activeElementId!=-1){
        this.animationstackAdd("goUnitToElement", this.frontendService.activeElementId, unitid);
      }

    }else if(this.frontendService.activePart){
      if(this.frontendService.mobileVersion){
        this.mobileGoToPart(bookKey, partKey);
        this.frontendService.animationNavigate = false
      }else{
        switch(this.activeBookStateOld){
          case 'unit':
            if(this.animationUnitToNextPart){
              this.animationstackAdd("goUnitNextPart")
            }else{
              this.animationstackAdd("goUnitToPart");
            }
            break;
          case 'part':
            if(this.frontendService.activeBook.activePartOldId&&this.frontendService.activeBook.activePartOldId!=this.frontendService.activePart.partid){
              this.animationstackAdd("goPartToPart", partKey);
            }
            break;
          case "book":
            if(this.book_openend_outside){
              this.animationstackAdd("animationStackTimeout", 1000)
            }
            this.animationstackAdd("goPartoverviewToPart", partid);
            break;
        }
      }
    }else if(this.frontendService.activeBook){
      if(this.frontendService.mobileVersion){
        this.mobileGoToBook();
        this.frontendService.animationNavigate = false
      }else{
        switch(this.activeBookStateOld){
          case 'unit':
            this.animationstackAdd("goUnitToPart");
            this.animationstackAdd("goPartToPartoverview");
            break;
          case 'part':
            this.animationstackAdd("goPartToPartoverview");
            break;
        }
      }
    }
    this.frontendService.activeBook.open = true;
    if(!this.frontendService.mobileVersion){
      this.animationstackRun()
    }
  }



  /* ANIMATION STACK */
  animationstackAdd(functionName, value1=-1, value2=-1, value3=false, value4=false){
    var functionObject = {
      functionName : functionName,
      value1: value1,
      value2: value2,
      value3: value3,
      value4: value4
    }
    this.animationstack.push(functionObject);
  }
  animationstackAddFront(functionName, value1, value2){
    var functionObject = {
      functionName : functionName,
      value1: value1,
      value2: value2
    }
    this.animationstack.unshift(functionObject);
  }
  animationstackClear(){
    this.animationstack = [];
  }
  animationstackResetvar(){
    this.frontendService.animationNavigate = false;
    this.animationstackRun();
  }
  animationstackRun(){
    if(this.animationstack[0]){
      var firstFunction = this.animationstack[0];
      var functionName = firstFunction.functionName;
      if(this[functionName]) {
        let value1 = Number(firstFunction.value1);
        let value2 = Number(firstFunction.value2);
        let value3 = firstFunction.value3;
        let value4 = firstFunction.value4;
        this.animationstack.shift();
        if(value4){
          this[functionName](value1,value2,value3,value4);
        }else if(value3){
          this[functionName](value1,value2,value3);
        }else if(value2!=-1){
          this[functionName](value1,value2);
        }else if(value1!=-1){
          this[functionName](value1);
        }else{
          this[functionName]();
        }
      }
    }else{
      this.animationstackUpdateVars()
    }
  }

  animationstackUpdateVars(){
    this.book_openend_outside = false
      this.frontendService.animationNavigate = false;
      this.activeStateOld = this.frontendService.activeState
      this.activeBookStateOld = this.frontendService.activeBookState
      if(this.frontendService.activeBook){
        this.frontendService.activeBook.activeBookOldId = this.frontendService.activeBook.bookid
      }else{
        this.frontendService.activeBook.activeBookOldId = -1
      }
      if(this.frontendService.activePart){
        this.frontendService.activeBook.activePartOldId = this.frontendService.activePart.partid
      }else{
        this.frontendService.activeBook.activePartOldId = -1
      }
      if(this.frontendService.activeChapter){
        this.frontendService.activeBook.activeChapterOldId = this.frontendService.activeChapter.chapterid
      }else{
        this.frontendService.activeBook.activeChapterOldId = -1
      }
      if(this.frontendService.activeUnit){
        this.frontendService.activeBook.activeUnitOldId = this.frontendService.activeUnit.unitid
      }else{
        this.frontendService.activeBook.activeUnitOldId = -1
      }
  }

  animationStackTimeout(timeout){
    setTimeout(() =>  {
      this.animationstackRun()
    }, timeout);
  }

  /* MEGAMENU */
  megamenuOpen(){
    if(this.megamenuState=='show'){
      this.megamenuClose();
    }else{
      if(this.booktitleState=='fixed_1'){
        this.booktitleState='fixed_2';
        this.frontendService.headerState='show';
        this.megamenuState='show';
      }
      if(this.frontendService.mobileVersion){
        this.megamenuState='show_mobile';
        this.mobileChapterheaderState='show';
        this.frontendService.headerState='show';
      }
    }
  }
  megamenuClose(){
    if(this.frontendService.mobileVersion){
      this.mobileChapterheaderState='fixed';
      this.megamenuState='hide';
      this.frontendService.headerState='hide';
    }else{
      this.booktitleState='fixed_1';
      this.frontendService.headerState='hide';
      this.megamenuState='hide';
    }
  }
  megamenuClick(partid, chapterid=-1){
    this.megamenuClose();
    this.frontendService.openBook(this.frontendService.activeBook.bookid, partid, chapterid);
  }
    
  clickPartTitle(partid){
    if(this.frontendService.activeBookState=="part"){
      this.frontendService.openBook(this.frontendService.activeBook.bookid);
    }else{
      this.frontendService.openBook(this.frontendService.activeBook.bookid, partid);
    }
  }

  // Part Functions // 

  partlistImageDiashow(partKey){
    this.animationImageDiashow = setTimeout(() =>  {
      this.partlistImageDiashowLoop(partKey);
    }, 3000);
  }

  partlistImageDiashowLoop(partKey){
    if(this.frontendService.activePart && this.frontendService.activeBook.partlist[partKey] && this.frontendService.activePart.partid == this.frontendService.activeBook.partlist[partKey].partid){
      if(this.frontendService.activeBook.partlist[partKey].images.length>1){
          let part = this.frontendService.activePart
          part.actualimage++;
          if(part.images.length <= part.actualimage)part.actualimage=0;

          this.hiddenImageLoaded = false;
          this.hiddenImage = part.images[part.actualimage].imagelink;
          
          this.frontendService.waitFor(_ => this.hiddenImageLoaded === true).then(_ => {
            if(part.partimageState1!="slide_left"&&part.partimageState2!="slide_left"){
              if(part.partimageState1=='show'||part.partimageState1=='show_na'){
                part.partimageState1 = 'hide';
                part.partimageState2 = 'show';
                part.image2 = part.images[part.actualimage].imagelink;
              }else{
                part.partimageState1 = 'show';
                part.partimageState2 = 'hide';
                part.image1 = part.images[part.actualimage].imagelink;
              }
              this.animationImageDiashowLoop = setTimeout(() => this.partlistImageDiashowLoop(partKey), 5000);
            }
          }).catch(error => {
            console.error('Timeout exceeded:', error.message);
          });
      }
    }
  }

  goPartoverviewToPart(partid){
      var partKey = this.frontendService.getPartArrayKey(partid);
      window.clearTimeout(this.animationImageDiashow);
      window.clearTimeout(this.animationImageDiashowLoop);
      for (let key in this.frontendService.activeBook.partlist) {
        var part = this.frontendService.activeBook.partlist[key];
        part.partlistAnimationZIndex = key;
        if(Number(key) == partKey){

          part.partlistState = 'up';
          this.frontendService.waitFor(_ => document.getElementById("partlist"+this.frontendService.activePart.partid)).then(_ => {
            part.partlistAnimationTop = (-1)*(document.getElementById("partlist"+this.frontendService.activePart.partid).getBoundingClientRect().y-77);
          })
        }
        if(Number(key) < partKey){
          part.partlistState = 'stay';
        }
        if(Number(key) > partKey){
          part.partlistState = 'down';
        }
      }
      this.booktitleState="fixed_2";
  }
  goPartToPartoverview(){
    var partKey = this.frontendService.getPartArrayKey(this.frontendService.activeBook.activePartOldId);

    for (let key in this.frontendService.activeBook.partlist) {

      let bookinfoElement = document.getElementById("book_info");
      this.renderer.removeStyle(bookinfoElement, 'display');

      /* remove style-attributes for the tile-layout */
      let part = this.frontendService.activeBook.partlist[key]
      part.partlistAnimationZIndex = key;
      if(Number(key) == partKey){
        part.partlistState = 'stay';
      }
      if(Number(key) < partKey){
        part.partlistState = 'stay';
      }
      if(Number(key) > partKey){
        part.partlistState = 'down';
      }

      for (let key2 in this.frontendService.activeBook.partlist[key].chapterlist) {
        part.chapterlist[key2].chapterlistTitleState = "hide";
      }

      part.partregisterchapterState = 'hide';

    }
  }

  goPartToUnit(chapterid){
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
    let partlist = this.frontendService.activeBook.partlist
    for (let key in partlist) {
      var part = partlist[key];
      if(Number(key)!=this.frontendService.activePartKey){
        part.partlistState = 'hide';
      }else{
        part.partimagecontainerState = "slide_left";
        part.partregisterState = "hide";
        part.unitContainerState = "show_header_na";
        
        for (let chapter of partlist[key].chapterlist) {
          if(chapter.chapterid!=chapterid){
            chapter.chapterlistTitleState = "hide";
          }
        }
        this.animationstackRun();

      }
    }
  }
  goPartToPart(partkey){
    this.animationPartTile = true;
    let partlist = this.frontendService.activeBook.partlist
    if(partkey<=partlist.length-1&&partkey>=0){
      window.clearTimeout(this.animationImageDiashow);
      window.clearTimeout(this.animationImageDiashowLoop);
      let activePartKey = this.frontendService.getPartArrayKey(this.frontendService.activePart.partid);
      for (let key in partlist) {
        if(activePartKey>Number(key)){
          partlist[key].partlistState = 'tile_up';
        }else if(activePartKey<=Number(key)){
          partlist[key].partlistState = 'tile_down';
        }
      }
      this.partlistImageDiashow(activePartKey);
    }
  }

  partsToTile(){
    let partid = this.frontendService.activeBook.activePartOldId
    if(this.frontendService.activePart){
      partid = this.frontendService.activePart.partid
    }

    for (let key in this.frontendService.activeBook.partlist) {
      var part = this.frontendService.activeBook.partlist[key];
      let activePartKey = this.frontendService.getPartArrayKey(partid)
      part.partlistAnimationZIndex = this.frontendService.activeBook.partlist.length-Number(key)+1;
      if(Number(key)<activePartKey){
        part.partlistState = "tile_up";
      }else{
        part.partlistState = "tile_down";
      }
      if(Number(key)!=activePartKey){
        part.partimageState1 = "show_na";
        part.partimageState2 = "hide_na";
        part.partregisterchapterState = "show_na";
      }else{
        part.partregisterchapterState = "show";
        this.partlistImageDiashowLoop(key);
      }
    }
    this.animationstackRun();
  }
    
  partlistAnimationDone(partid, event){
    let partlist = this.frontendService.activeBook.partlist
    if(event.toState=="up"&&event.fromState=="stay"){
      this.renderer.setStyle(document.getElementById("book_info"), 'display', 'none');
      this.partsToTile();
    }
    if(event.toState=="tile_down"&&event.fromState=="up"){
      let part = document.getElementById("partlist"+partid);
      this.renderer.setStyle(part, 'transform', 'translateY(77px)');
      this.renderer.setStyle(part, 'position', 'absolute');
      this.renderer.setStyle(part, 'zIndex', this.frontendService.activePart.partlistAnimationZIndex);
      this.renderer.setStyle(part, 'height', 'calc(100% - 77px)');
      this.renderer.setStyle(part, 'overflow', 'hidden');
      this.partShowChapterlist();
    }
    if((event.toState=="tile_down"&&(event.fromState=="tile_up"||event.fromState=="tile_up_na"))||(event.toState=="tile_up"&&event.fromState=="tile_down")){

      if(event.totalTime>0){
        setTimeout(() =>  {
          this.animationstackRun();
        }, 50);
        setTimeout(() =>  {
          this.animationPartTile=false;
        }, 1000);
      }
    }
    if((event.toState=="stay"&&event.fromState=="tile_down")){
      for(let key in partlist){
        var part = partlist[key];
        if(part.partlistState=="down"){
          part.partlistState = "stay";
        }
      }
      if (typeof(document.getElementById("partlist"+this.frontendService.activeBook.activePartOldId)) != 'undefined' && document.getElementById("partlist"+this.frontendService.activeBook.activePartOldId) != null){
        var parslistTop = document.getElementById("partlist"+this.frontendService.activeBook.activePartOldId).getBoundingClientRect().y;
        if(parslistTop!=77.75){
          document.getElementById("book").scrollTop = parslistTop-77;
          window.clearTimeout(this.animationImageDiashow);
          window.clearTimeout(this.animationImageDiashowLoop);
          setTimeout(() => {
            this.animationstackRun();
          }, 500)
        }
      }
    }
  }

  partimagecontainerAnimationDone(event){
    if(event.toState=="slide_left"){
      this.animationstackRun();
    }
    if(event.toState=='slide_middle'&&(event.fromState=='slide_left'||event.fromState=='slide_left_na')&&this.activeBookStateOld!='book'){ 
      this.partsToTile();
      if(this.frontendService.activeBookState!="book"){
        this.partShowChapterlist();
      }
      var part = this.frontendService.activeBook.partlist[this.frontendService.getPartArrayKey(this.frontendService.activeBook.activePartOldId)]
      for(let key in part.chapterlist){
        for(let key2 in part.chapterlist[key].unitlist){
          part.chapterlist[key].unitlist[key2].unitState = "show_na";
        }
      }
    }
  }
  
  partShowChapterlist(){
    let partid = this.frontendService.activeBook.activePartOldId
    if(this.frontendService.activePart){
      partid = this.frontendService.activePart.partid
    }
    let partlist = this.frontendService.activeBook.partlist
    for (let key in this.frontendService.activeBook.partlist) {
      if(Number(key)==this.frontendService.getPartArrayKey(partid)&&this.animationstack.length==0){
        let i = 0;
        var part = this.frontendService.activeBook.partlist[this.frontendService.getPartArrayKey(partid)]
        let fadeInChapter = window.setInterval(() => {
          if(part.chapterlist[i].chapterlistTitleState&&this.frontendService.activeBookState != "unit"){
            part.chapterlist[i].chapterlistTitleState = "list";
          }else{
            window.clearInterval(fadeInChapter);
          }
          if(i>=part.chapterlist.length-1){
            window.clearInterval(fadeInChapter);
          }
          i++;
        }, 100);
      }else{
        for(let key2 in partlist[key].chapterlist){
          partlist[key].chapterlist[key2].chapterlistTitleState = "list";
        }
      }
    }
  }

  /* Unit Functions */


  unitClick(event){
    if(event.target.tagName=="SUP"){
      this.frontendService.showReference(event);
    }
    if(event.target.classList[0]=="address"||event.target.parentNode.classList[0]=="address"){
      var target;
      if(event.target.classList[0]=="address") target = event.target;
      if(event.target.parentNode.classList[0]=="address") target = event.target.parentNode;
      if(target.children[0].id.indexOf("address_kollektiv")!=-1){
        let bookKey = this.frontendService.getBookArrayKey(target.children[0].id.replace("address_kollektiv_",""));
        let bookname = this.frontendService.booklist[bookKey].book
        window.open("https://www.cache.ch/impressum/"+bookname+"/autorinnenkollektiv", "_blank");
      }else{
        var partid=-1;
        var chapterid=-1;
        var unitid=-1;
        var elementid=-1;
        if(target.children[0])partid = Number(target.children[0].id.replace("address_part_",""));
        if(target.children[1])chapterid = Number(target.children[1].id.replace("address_chapter_",""));
        if(target.children[2])unitid = Number(target.children[2].id.replace("address_unit_",""));
        if(target.children[3])elementid = Number(target.children[3].id.replace("address_element_",""));
        this.frontendService.openBook(this.frontendService.activeBook.bookid,partid,chapterid,unitid,elementid)
      }
    }
  }

  unitContainerAnimationDone(event){
    if(event.toState=="show"){
      this.animationstackRun();
    }
  }
  unitAnimationDone(event){
    this.animationUnitToUnit=false;
    if(event.toState=="slide_left"&&event.fromState=="show"){
      this.animationstackRun();
      this.unitBottom = false;
      window.clearTimeout(this.timeoutUnitBottom);
    }
    if(event.toState=="show_first"&&event.fromState=="show"){
      this.animationstackRun();
      this.unitBottom = false;
      window.clearTimeout(this.timeoutUnitBottom);
    }
    if(event.toState=="show"&&event.fromState=="slide_left"){
      this.animationstackRun();
      this.unitBottom = false;
      window.clearTimeout(this.timeoutUnitBottom);
    }
  }


  transitionNextElementAnimationDone(event){
    if(event.toState=="nextpart"&&event.fromState=="bottom"){
      this.transitionNextElementBackgroundState = 'hide';
    }
    if(event.toState=="nextpart_hide"&&event.fromState=="nextpart"){
      this.transitionNextElementBackgroundState='show';
      this.unitHideNextPart();
      this.animationstackRun();
    }
  }
  transitionNextElementBackgroundAnimationDone(event){
    if(event.toState=="hide"&&event.fromState=="show"){
      //hide transition and show next Part.
      this.animationUnitToNextPart = false
      this.transitionNextElementState='nextpart_hide';
      var part = this.frontendService.activeBook.partlist[this.frontendService.getPartArrayKey(this.frontendService.activeBook.activePartOldId)]
      part.unitContainerState="show";
      part.partimagecontainerState="slide_middle_na";
      part.partregisterState = "show";
      part.partlistState="tile_up_na"
      part.partimageState1 = "show_na";
      part.partimageState2 = "hide_na";
      for(let key in part.chapterlist){
        part.chapterlist[key].chapterlistTitleState = "list";
        for(let key2 in part.chapterlist[key].unitlist){
          part.chapterlist[key].unitlist[key2].unitState = "show_na";
        }
      }

      part = this.frontendService.activePart
      part.partregisterchapterState = "show";
      part.partlistState = "tile_down";
      //this.partlistImageDiashowLoop(this.frontendService.activePartKey);

      this.frontendService.animationNavigate=false;
      this.animationstackRun()
    }
  }
  transitionUnitToUnitAnimationDone(event){
    if(event.toState="slide_left"){
      this.transitionUnitToUnitState='show_state_fixedheader';
      var transitionPartent = document.getElementById("transition_unit_to_unit");
      this.renderer.setStyle(transitionPartent, 'display', 'none');
      transitionPartent.innerHTML = '';
      this.animationstackRun();
    }
  }


  goImagePreview(image){
    let imagePreview = {...image };
    if(imagePreview.imageState=='show'){
      let img = new Image();
      img.src = imagePreview.datalink;
      this.imagePreview = imagePreview;
      this.checkImagePreviewDimensionChecked = false;
      this.renderer.setStyle(document.getElementById("book"), 'filter', 'blur(30px)');
      this.renderer.setStyle(document.getElementById("book"), 'opacity', '0.5');
      this.renderer.setStyle(document.getElementById("header"), 'filter', 'blur(30px)');
      this.renderer.setStyle(document.getElementById("header"), 'opacity', '0.5');
    }
  }

  goImagePreviewClose(){
    this.imagePreview = false;
    this.renderer.removeStyle(document.getElementById("book"), 'filter');
    this.renderer.setStyle(document.getElementById("book"), 'opacity', '1');
    this.renderer.removeStyle(document.getElementById("header"), 'filter');
    this.renderer.setStyle(document.getElementById("header"), 'opacity', '1');
    window.clearTimeout(this.timeoutUnitBottom);
    this.unitBottom=false;
  }

  goUnitSlideLeft(){
    clearTimeout(this.timeoutUnitBottom);
    this.unitBottom=false;
    this.unitBottomWait=false;
    var chapterkey = this.frontendService.activeChapterKey;
    var part = this.frontendService.activePart
    let chapter = this.frontendService.activeChapter;
    
    if(this.animationUnitToNextPart){
      this.frontendService.openBook(this.frontendService.activeBook.bookid, this.frontendService.activeBook.partlist[Number(this.frontendService.activePartKey)+1].partid)
    }else{
      if(this.frontendService.activeUnitKey!=chapter.unitlist.length-1){
        this.animationUnitToUnit=true;
        this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid, chapter.chapterid, chapter.unitlist[Number(this.frontendService.activeUnitKey)+1].unitid);
      }else{
        var chapterweb;
        var exitloop;
          do{
            if(part.chapterlist[Number(chapterkey)+1]){
              chapterweb = part.chapterlist[Number(chapterkey)+1].chapterweb;
            }else{exitloop=true;}
            chapterkey++;
          }while(!exitloop&&chapterweb==0)
        
          if(part.chapterlist[chapterkey]){
            this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid, part.chapterlist[chapterkey].chapterid, part.chapterlist[chapterkey].unitlist[0].unitid);
          }else{
            if(this.frontendService.activeBook.partlist[Number(this.frontendService.activePartKey)+1]){
              /*scroll to bottom and show next part */
              var unit = document.getElementById("unit"+this.frontendService.activeUnit.unitid);
              var oldPos;
              unit.scrollTo({
                top: unit.scrollHeight,
                behavior: "smooth",
              });
            }else{
              this.frontendService.openBook(this.frontendService.activeBook.bookid);
            }
          }
        }
      }
  }
  goUnitSlideRight(){
    clearTimeout(this.timeoutUnitBottom);
    this.animationUnitToUnit=true;
    this.unitBottom=false;
    this.unitBottomWait = false;
    var chapterkey = this.frontendService.activeChapterKey;
    var part = this.frontendService.activePart
    let chapter = this.frontendService.activeChapter;
    if(this.frontendService.activeUnitKey!=0){
      this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid, chapter.chapterid, chapter.unitlist[Number(this.frontendService.activeUnitKey)-1].unitid);
    }else{
      if(this.frontendService.activeChapterKey==0){
        this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid);
      }else{
        var chapterweb;
        var exitloop = false;
        do{
          if(part.chapterlist[chapterkey-1]){
            chapterweb = part.chapterlist[chapterkey-1].chapterweb;
          }else{
            exitloop=true
          }
          chapterkey--;
        }while(!exitloop&&chapterweb==0)

        if(chapterkey==-1){
          this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid);
        }else{
          this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid, part.chapterlist[chapterkey].chapterid, part.chapterlist[chapterkey].unitlist.slice(-1)[0].unitid);
        }
      }
    }
  }

  goUnitToUnit(chapterkey, unitkey){
    if(this.frontendService.activeUnit.unitid == this.frontendService.activeBook.activeUnitOldId){
      setTimeout(() => {this.animationstackUpdateVars()}, 1000)
    }else{
      var part = this.frontendService.activePart
      if(this.frontendService.activeUnitKey
        &&(part.unitContainerState=="show_header"||part.unitContainerState=="show_header_na")
        &&this.frontendService.activeBookState=="unit"){
          this.frontendService.headerState="hide";
          this.booktitleState="fixed_1";
          part.unitContainerState="show";
          this.animationstackAdd("goUnitToUnit", chapterkey, unitkey);
      }else{
        if(this.animationUnitToNextPart){
          this.unitHideNextPart();
        }
  
        let unit = this.frontendService.activeUnit
        if(document.getElementById("unit"+unit.unitid)){
          document.getElementById("unit"+unit.unitid).scrollTop=0;
        }
        var childrenKey = 0;
        if(this.frontendService.activeUnitKey==0){
          childrenKey = 2;
        }
        this.frontendService.waitFor(_ => document.getElementById("unit"+unit.unitid)).then(_ => {
          if(document.getElementById("unit"+unit.unitid)){
            this.frontendService.waitFor(_ => document.getElementById("unit"+unit.unitid).children[childrenKey]).then(_ => {
              if(document.getElementById("unit"+unit.unitid).children[childrenKey]){
                var unitData = document.getElementById("unit"+unit.unitid).children[childrenKey].children;
                for (var i=0;i<unitData.length;i++){
                  if(unitData[i].children.length>0){
                    if(unitData[i].children[0].children[0]){
                      var elementPosition = Math.round((-1)*(unitData[i].children[0].getBoundingClientRect().left - unitData[i].children[0].children[0].children[0].getBoundingClientRect().left));
                      var className = unitData[i].children[0].children[0].children[0].classList[0];
                      if(elementPosition==484||(elementPosition==323&&className=="unit_element_50")){
                        unitData[i].children[0].children[0].children[0].setAttribute("style", "float:right");
                      }
                    }
                  }
                }
              }
              let data = unit.datalist;
              for(var j=0;j<data.length;j++){
                if(data[j].datalink&&data[j].datalink!=""){
                  if(data[j].datatype==2){
                    if(data[j].datalayout==0){
                      data[j].imagePlaceholderWidth=940;
                      data[j].imagePlaceholderHeight=(940/data[j].imagewidth)*data[j].imageheight;
                    }else if(data[j].datalayout==1){
                      data[j].imagePlaceholderWidth=455;
                      data[j].imagePlaceholderHeight=(455/data[j].imagewidth)*data[j].imageheight;
                    }
                  }
                }
              }
              unit.unitLoaded = true;
            }).catch(error => {
              console.error('Timeout exceeded:', error.message);
            });
          }
        }).catch(error => {
          console.error('Timeout exceeded:', error.message);
        });
        
        for(let key in part.chapterlist){
          for(let key2 in part.chapterlist[key].unitlist){
  
            if(key>chapterkey||(key==chapterkey&&key2>=this.frontendService.activeUnitKey)){
                part.chapterlist[key].unitlist[key2].unitState = 'show';
            }else{
              part.chapterlist[key].unitlist[key2].unitState = 'slide_left';
            }
          }
        }
      }
  
      // calculate chaptertitleheight
      if(unitkey==0){
        setTimeout(() => {
          this.calculateChapterTitleHeight()
        }, 200)
      }
    }
    this.frontendService.activeBook.activeUnitOldId = this.frontendService.activeUnit.unitid
  }

  goUnitToPart(){
    this.frontendService.headerState="show";
    this.unitBottom = false;
    this.booktitleState = 'fixed_2';
    let partKey = this.frontendService.getPartArrayKey(this.frontendService.activeBook.activePartOldId)
    this.frontendService.activeBook.partlist[partKey].partimagecontainerState = "slide_middle";
    this.frontendService.activeBook.partlist[partKey].partregisterState = "show";
  }

  goUnitToElement(elementid, unitid){
    this.animationstackRun();
    setTimeout(() => {
      this.frontendService.waitFor(_ => document.getElementById("data_element_"+elementid)).then(_ => {
        if(document.getElementById("data_element_"+elementid).children[0]){
          var element = document.getElementById("data_element_"+elementid).children[0].children[0].children[0];
          var unit = document.getElementById("unit"+unitid);
          unit.scrollTo({
            top: element.getBoundingClientRect().top-30,
            behavior: "smooth",
          });
        }
      }).catch(error => {
        console.error('Timeout exceeded:', error.message);
      });
    }, 600);

    
  }
  goUnitNextPart(){
    this.frontendService.activeBook.partlist[this.frontendService.getPartArrayKey(this.frontendService.activeBook.activePartOldId)].unitContainerState="nextpart";

    let part = this.frontendService.activePart
    part.partregisterchapterState = "show";
    part.partlistState = "tile_down";

    this.frontendService.headerState='show';
    this.booktitleState='fixed_2';
    for(let key in this.frontendService.activePart.chapterlist){
      this.frontendService.activePart.chapterlistTitleState = "list";
    }
    this.transitionNextElementState = 'nextpart';
  }

  goDirectChapter(){
    this.frontendService.waitFor(_ => document.getElementById("book_abstract")).then(_ => {
      this.renderer.setStyle(document.getElementById("book_info"), 'display', 'none');

      setTimeout(() => {
        this.calculateChapterTitleHeight()
      }, 200)

      this.booktitleState = 'fixed_1';
      this.frontendService.headerState = 'hide';
      this.partShowChapterlist();
      let partlist = this.frontendService.activeBook.partlist
      for(let key in partlist){
        /* global settings for all */
        var part = partlist[key];
        part.partregisterchapterState = "show_na";
        part.partlistAnimationZIndex = partlist.length-Number(key)+1;
        if(key!=this.frontendService.activePartKey){
          /* settings for other parts */
          part.partimageState1 = "show_na";
          part.partimageState2 = "hide_na";
          part.partimagecontainerState = "slide_middle_na";
          part.partlistLineRightState = "middle_na";
          part.partlistState = 'hide';
        }else{
          part.partimagecontainerState = "slide_left_na";
          part.partregisterState="hide";
          part.partlistState = "tile_down";
          part.unitContainerState = "show";
        }
      }
      this.animationstackRun();
    }).catch(error => {
      console.error('Timeout exceeded:', error.message);
    });
  }
  goUnitToUnitOtherPart(partKey, chapterKey){
    var partKeyOld = this.frontendService.getPartArrayKey(this.frontendService.activeBook.activePartOldId)
    var part_old = this.frontendService.activeBook.partlist[partKeyOld];
    var part_new = this.frontendService.activeBook.partlist[partKey];
    var chapterKeyOld = this.frontendService.getChapterArrayKey(this.frontendService.activeBook.bookid, this.frontendService.activeBook.activeChapterOldId, partKeyOld)
    var unitKeyOld = this.frontendService.getUnitArrayKey(this.frontendService.activeBook.bookid, this.frontendService.activeBook.activeUnitOldId, partKeyOld, chapterKeyOld)

    var actualUnit = document.getElementById("unit"+part_old.chapterlist[chapterKeyOld].unitlist[unitKeyOld].unitid);
    var transitionParent = document.getElementById("transition_unit_to_unit");
    transitionParent.appendChild(actualUnit.cloneNode(true));
    this.renderer.setStyle(transitionParent.children[0].children[0], 'transform', 'translateY(-'+(actualUnit.scrollTop-30)+'px)');
    this.transitionUnitToUnitState = "slide_left";
    this.renderer.setStyle(transitionParent, 'display', 'block');

    
    this.frontendService.activeBook.activeChapterOldId = this.frontendService.activeChapter.chapterid
    this.frontendService.activeBook.activePartOldId = this.frontendService.activePart.partid
    part_old.partimagecontainerState = "slide_middle_na";
    part_new.partimagecontainerState = "slide_left_na";
    part_old.partregisterState="show";
    part_new.partregisterState="hide";
    part_old.partlistState = "hide";
    part_new.partlistState = "tile_down";

    for(let key in part_new.chapterlist){
      if(key == chapterKey){
        part_new.chapterlist[key].chapterlistTitleState = "list";
      }else{
        part_new.chapterlist[key].chapterlistTitleState = "hide";
      }
    }
    this.animationstackRun();
  }

  unitHideHeader(){
    this.frontendService.headerState = "hide";
    this.animationstackRun();
  }
  unitHideNextPart(){
    this.animationUnitToNextPart = false;
    setTimeout(() => {
      this.transitionNextElementState = 'hide';
    }, 50);
  }
  showNextPart(){
    var partlist = this.frontendService.activeBook.partlist
    if(partlist[Number(this.frontendService.activePartKey)+1]){
      if(this.megamenuState!="show"){
        this.animationUnitToNextPart = true;
        this.transitionNextElementState = 'bottom';
        this.transitionNextElementPart = partlist[Number(this.frontendService.activePartKey)+1].partname;
        this.transitionNextElementImage = partlist[Number(this.frontendService.activePartKey)+1].image1;
      }
    }else{
      this.frontendService.openBook(this.frontendService.activeBook.bookid);
    }
  }

  /* Mobile Functions */


  mobileGoToUnit(bookid, partid, chapterid, unitid){
    this.megamenuState='hide';
    this.mobilePartoverviewState=false;
    this.mobilePartState=false;
    var part = this.frontendService.activePart
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
    let chapterKey = this.frontendService.getChapterArrayKey(bookid, chapterid)
    let unitKey = this.frontendService.getUnitArrayKey(bookid, unitid, this.frontendService.getPartArrayKey(partid, bookid), chapterKey)

    for(let key in part.chapterlist){
      for(let key2 in part.chapterlist[key].unitlist){
        if(Number(key)<chapterKey||(Number(key)==chapterKey&&Number(key2)<unitKey)){
          if(part.chapterlist[key].unitlist[key2].unitContainerState){
            part.chapterlist[key].unitlist[key2].unitContainerState = "slide_left";
          }else{
            part.chapterlist[key].unitlist[key2].unitContainerState = "slide_left_na";
          }
        }else{
          part.chapterlist[key].unitlist[key2].unitContainerState = "show";
        }
      }
    }

    var chapter = this.frontendService.activeChapter
    var unit = this.frontendService.activeUnit



    this.frontendService.waitFor(_ => document.getElementById("unit_mobile_register_chapter"+chapter.chapterid)).then(_ => {
      let elementHeight = document.getElementById("unit_mobile_register_chapter"+chapter.chapterid).offsetHeight
      let elementAuthorsHeight = document.getElementById("unit_mobile_register_chapter_authors"+chapter.chapterid).offsetHeight
      chapter.chaptertitleheight =  elementHeight + elementAuthorsHeight + "px"
    }).catch(error => {
      console.error('Timeout exceeded:', error.message);
    });
    if(this.frontendService.activeBookState!="unit"){
      this.frontendService.waitFor(_ => document.getElementById("unit"+unit.unitid)).then(_ => {
        document.getElementById("unit"+unit.unitid).scrollTop=0;
      }).catch(error => {
        console.error('Timeout exceeded:', error.message);
      });

      if(unitKey==0){
        part.chapterlist[chapterKey].unitlist[0].unitContainerState = "show_first";
      }else{
        setTimeout(() => {
          this.frontendService.headerState="hide";
          this.mobileChapterheaderState="fixed"
        }, 1000)
      }
    }else{
      setTimeout(() => {
        this.frontendService.headerState="hide";
        this.mobileChapterheaderState="fixed"
      }, 1000)
    }
    this.activeBookStateOld = 'unit'
  }

  mobileGoToPart(bookKey, partKey){
    this.mobilePartoverviewState=false;
    this.mobilePartState=true;
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
    this.frontendService.headerState="show";
    this.mobileChapterheaderState="show";
    this.partlistImageDiashow(partKey);
    let partlist = this.frontendService.activeBook.partlist
    for (let key in this.frontendService.activeBook.partlist) {
      if(partKey>key){
        if(this.activeBookStateOld!='part'){
          partlist[key].chapterContainerState = 'up_na';
        }else{
          partlist[key].chapterContainerState = 'up';
        }
      }else if(partKey<=key){
        if(this.activeBookStateOld!='part'){
          partlist[key].chapterContainerState = 'down_na';
        }else{
          partlist[key].chapterContainerState = 'down';
        }
      }
    }
    this.activeBookStateOld = 'part'
    //setTimeout(() => this.activePartKey=partKey, 1000);
  }
  mobileGoToBook(){
    this.mobilePartoverviewState=true;
    this.mobilePartState=true;
    this.frontendService.headerState="show";
    this.mobileChapterheaderState="show";
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
  }


  mobileClickArrow(chapterKey, unitKey, add){
    unitKey = Number(unitKey)+add;
    var part = this.frontendService.activePart
    if(unitKey<0){
      var exitloop = false;
      do{
        if(part.chapterlist[Number(chapterKey)-1]){
          var chapterweb = part.chapterlist[Number(chapterKey)-1].chapterweb;
        }else{
          exitloop=true
        }
        chapterKey--;
      }while(!exitloop&&chapterweb==0)

      if(chapterKey<0){
        this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid);
      }else{
        this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid,
          part.chapterlist[chapterKey].chapterid, part.chapterlist[chapterKey].unitlist[part.chapterlist[chapterKey].unitlist.length-1].unitid);
      }
    }else if(unitKey>part.chapterlist[chapterKey].unitlist.length-1){
      var exitloop = false;
      do{
        if(part.chapterlist[Number(chapterKey)+1]){
          var chapterweb = part.chapterlist[Number(chapterKey)+1].chapterweb;
        }else{
          exitloop=true
        }
        chapterKey++;
      }while(!exitloop&&chapterweb==0)
      let partlist = this.frontendService.activeBook.partlist
      if(chapterKey>this.frontendService.activePart.chapterlist.length-1){
        if((Number(this.frontendService.activePartKey)+1)>partlist.length-1){
          this.frontendService.openBook(this.frontendService.activeBook.bookid);
        }else{
          this.frontendService.openBook(this.frontendService.activeBook.bookid, partlist[Number(this.frontendService.activePartKey)+1].partid);
        }
      }else{
        this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid, part.chapterlist[chapterKey].chapterid, part.chapterlist[chapterKey].unitlist[0].unitid);
      }
    }else{
      this.frontendService.openBook(this.frontendService.activeBook.bookid, part.partid, part.chapterlist[chapterKey].chapterid, part.chapterlist[chapterKey].unitlist[unitKey].unitid);
    }
  }




  /* HELPERS */


  hiddenImageLoad(){
    this.hiddenImageLoaded = true;
  }

  checkImagePreviewDimension(){
    this.checkImagePreviewDimensionChecked = false;
    let containerMargin = 60;
    let sourceMarginTop = 25;
    let sourceLineHeight = 19;
    let sourceLines = 1;
    while(!this.checkImagePreviewDimensionChecked){
      var previewImage = document.getElementById("image_preview_image");
      var previewSource = document.getElementById("image_preview_source");
      this.renderer.removeStyle(previewImage,"width");
      this.renderer.setStyle(previewImage,"height",this.frontendService.windowHeight-containerMargin-sourceMarginTop-sourceLineHeight*sourceLines+"px");
      if(previewImage.getBoundingClientRect().width>this.frontendService.windowWidth-containerMargin){
        this.renderer.setStyle(previewImage,"width",this.frontendService.windowWidth-containerMargin+'px');
        this.renderer.removeStyle(previewImage,"height");
      }
      this.renderer.setStyle(previewSource,"width",previewImage.getBoundingClientRect().width+"px");
      if(previewSource.getBoundingClientRect().height/sourceLineHeight>sourceLines){
        sourceLines++;
      }else{
        this.imagePreview.datalink = this.replaceLinkDimensions(this.imagePreview.datalink, this.roundImageDimension(previewImage.clientWidth))
        this.checkImagePreviewDimensionChecked = true;
      }
    }
  }

  calculateChapterTitleHeight(){
    

    let chapterid = this.frontendService.activeChapter.chapterid
    let partid = this.frontendService.activePart.partid
    this.frontendService.waitFor(_ => document.getElementById("chapterlist_title_unit"+chapterid)).then(_ => {
      let elementPartHeight = document.getElementById("partlist_title"+partid).offsetHeight
      let elementHeight = document.getElementById("chapterlist_title_unit"+chapterid).offsetHeight
      let elementAuthorHeight = 0
      let height = 0 
      if(document.getElementById("chapterlist_title_unit_author"+chapterid)){
        elementAuthorHeight = document.getElementById("chapterlist_title_unit_author"+chapterid).offsetHeight
        if(elementAuthorHeight<15){}
        else if(elementAuthorHeight<35){
          height += 20
        }else if(elementAuthorHeight<55){
          height += 40
        }else{
          height += 60
        }
      }
      if(elementHeight<100){}
      else if(elementHeight<150){
        height += 50
      }else{
        height += 80
      }
      if(elementPartHeight > (elementHeight + elementAuthorHeight)){
        if(elementPartHeight<100){}
        else if(elementPartHeight<150){
          height = 50
        }else{
          height = 80
        }
      }
      this.frontendService.activeChapter.chaptertitleheight = height + "px"
    }).catch(error => {
      console.error('Timeout exceeded:', error.message);
    });
  }

  isLastChapter(chapterKey){
    var exitloop=false;
    do{
      if(this.frontendService.activePart.chapterlist[Number(chapterKey)+1]){
        var chapterweb = this.frontendService.activePart.chapterlist[Number(chapterKey)+1].chapterweb;
      }else{
        exitloop=true
      }
      chapterKey++;
    }while(!exitloop&&chapterweb==0)
    if(chapterKey>this.frontendService.activePart.chapterlist.length-1){
      return true
    }else{
      return false
    }
  }


  roundImageDimension(dimension){
    if(dimension <= 640){
      return 640
    }else if(dimension <= 1280){
      return 1280
    }else if(dimension <= 1920){
      return 1920
    }else{
      return 2560
    }
  }

  replaceLinkDimensions(link, new_dimension){
    link = link.replace("/w_640/", "/LINKTOREPLACE$/")
    link = link.replace("/w_1280/", "/LINKTOREPLACE$/")
    link = link.replace("/w_1920/", "/LINKTOREPLACE$/")
    link = link.replace("/w_2560/", "/LINKTOREPLACE$/")
    link = link.replace("/LINKTOREPLACE$/", "/w_"+new_dimension+"/")
    return link
  }
  trackByFn(index, item) {
    return index;
  }

  getNumber(number){
    return Number(number)
  }
  


}
