import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';
import { AuthenticationService } from  '../authentication/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-frontend',
  templateUrl: './header-frontend.component.html',
  styleUrls: ['./header-frontend.component.css'],
  animations: [
    trigger('headerAnimation', [
      state('show', style({
        transform: 'translateY(0px)'
      })),
      state('show_na', style({
        transform: 'translateY(0px)'
      })),
      state('hide', style({
        transform: 'translateY(-45px)'
      })),
      state('mobile_open', style({
        maxHeight: '100%'
      })),
      transition('show <=> hide', [
        animate('0.2s')
      ]),
      transition('show <=> mobile_open', [
        animate('0.4s')
      ])
    ]),
    trigger('searchAnimation', [
      state('0', style({
        transform:'translateY(calc(-100vh - 60px))'
      })),
      state('1', style({
        transform:'translateY(0)'
      })),
      transition('* <=> *', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class HeaderFrontendComponent implements OnInit {

  private activeBookStateSubscription: Subscription;
  private activeStateSubscription: Subscription;

  constructor(
    public frontendService: FrontendService,
    private authenticationService: AuthenticationService,
  ) { }


  currentUser: any;
  ngOnInit() {
    this.currentUser = this.authenticationService.getcurrentUser();
    this.activeBookStateSubscription = this.frontendService.getActiveBookState().subscribe((data) => {
      this.activeBookStateChange(data);
    });
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
  }

  ngOnDestroy() {
    this.activeBookStateSubscription.unsubscribe();
    this.activeStateSubscription.unsubscribe();
  }
  

  activeBookStateChange(state){
    if(state=="partoverview"||state=="part"){
      this.frontendService.headerState=="show"
    }
  }
  activeStateChange(state){
    if(state=="search"){
      this.frontendService.showSearch = true
    }else{
      this.frontendService.showSearch = false
    }
  }

  /* SEARCH */
  searchText: String = '';
  searchTimer:any;
  searchResults:any;
  searchLoading:boolean = false;
  searchTextPassages:any;
  searchFilter:any = {
    searchAll: true,
    searchBook: []
  }

  clickMenuMobile(){
    if(this.frontendService.mobileVersion){
      if(this.frontendService.headerState=='show'){this.frontendService.headerState='mobile_open'}
      else if(this.frontendService.headerState=='mobile_open'){this.frontendService.headerState='show'};
    }
  }

  search(){
    if(this.searchText!=''){
      clearTimeout(this.searchTimer);
      this.searchResults = [];
      if(this.searchText.length>2){
        var searchObject = {
          searchText: this.searchText
        }
        this.searchLoading = true;
        this.searchTimer = setTimeout(() => {
          this.frontendService.search(searchObject).subscribe((res)=>{
            if(!res.error){
              this.searchLoading = false;
              this.searchResults = res.data;
            }
          });
        }, 300);
      }
    }
  }  

  searchFilterClick(option){
    if(option=="all"){
      this.searchFilter.searchAll = !this.searchFilter.searchAll;
      this.searchFilter.searchBook = [];
    }else{
      this.searchFilter.searchAll = false;
      var index = this.searchFilter.searchBook.indexOf(option);
      if(index>-1){
        this.searchFilter.searchBook.splice(index,1);
      }else{
        this.searchFilter.searchBook.push(option);
      }
    }
    return true;
  }


  searchNavigateToElement(searchRoute){
    switch(searchRoute.length){
      case 1:
        this.frontendService.openBook(searchRoute[0].id);
        break;
      case 2:
        if(searchRoute[0].id=="blog"){
          this.frontendService.openBlog(searchRoute[1].id)
        }else{
          this.frontendService.openBook(searchRoute[0].id,searchRoute[1].id);
        }
        break;
      case 3:
        this.frontendService.openBook(searchRoute[0].id,searchRoute[1].id,searchRoute[2].id);
        break;
      case 4:
        this.frontendService.openBook(searchRoute[0].id,searchRoute[1].id,searchRoute[2].id,searchRoute[3].id);
        break;
      case 5:
        this.frontendService.openBook(searchRoute[0].id,searchRoute[1].id,searchRoute[2].id,searchRoute[3].id,searchRoute[4].id);
        break;
    }
  }

  searchAnimationDone(event){
    this.frontendService.animationNavigate = false
  }

  trackByFn(index, item) {
    return index;
  }
}
