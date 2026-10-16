import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('loaderTitleAnimation', [
      state('show', style({
        transform: 'translate(20vw, calc(50vh - 5.25vw))',
        opacity:1
      })),
      state('hide', style({
        opacity:0
      })),
      state('pulse', style({
        transform: 'translate(20vw, calc(50vh - 5.25vw)) scale(1.1)',
        opacity:1
      })),
      transition('pulse <=> show', [
        animate('1.5s ease-in-out')
      ]),
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate(1000)
      ]),
      transition(':leave', [
        animate(1000, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ]),
    trigger('loaderTitleAnimation', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate(1000)
      ]),
      transition(':leave', [
        animate(1000, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ]),
  ]
})
export class MainComponent implements OnInit {

  constructor(
    public frontendService: FrontendService
  ) { }

  ngOnInit(): void {
    this.frontendService.getBooklist()
    this.checkWindowSize()
  }

  loaderTitleText:string = '';
  loaderTitleState:boolean = false;

  /* COOKIES */
  showCookie:boolean = false;


  /* LISTENERS */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWindowSize(true);
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    if (event.target.localName == "img" || event.target.classList.contains("doorman_container_book_image")){
      event.preventDefault();
    }
  }



  checkWindowSize(resize=false){
    this.frontendService.windowWidth = window.innerWidth;
    this.frontendService.windowHeight = window.innerHeight;
    // if(this.imagePreview){
    //   this.checkImagePreviewDimension();
    // }
    var mobileTemp = this.frontendService.mobileVersion;
    if(this.frontendService.windowWidth<1080){
      this.frontendService.mobileVersion = true;
    }else{
      this.frontendService.mobileVersion = false;
    }
    if(resize&&mobileTemp!=this.frontendService.mobileVersion){
      window.location.reload();
    }

    if(this.frontendService.mobileVersion){
      let vh = window.innerHeight * 0.01;
      document.body.style.height = `${window.innerHeight}px`;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    
  }

  loaderTitleAnimationDone(event){
  }

}
