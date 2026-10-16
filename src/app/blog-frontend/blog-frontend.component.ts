import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';

@Component({
  selector: 'app-blog-frontend',
  templateUrl: './blog-frontend.component.html',
  styleUrls: ['./blog-frontend.component.css'],
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
    trigger('blogAnimation', [
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
    trigger('blogContentAnimation', [
      state('show', style({
        transform:'translateY(40px)'
      })),
      state('hide', style({
        transform:'translateY(calc(100% + 20px))'
      })),
      transition('* <=> *', [
        animate('1s ease-in-out')
      ])
    ]),
    trigger('blogContentCrossAnimation', [
      state('show', style({
        opacity:1
      })),
      state('hide', style({
        opacity:0
      })),
      transition('* => show', [
        animate('0.5s 0.8s ease-in-out')
      ]),
      transition('show => hide', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('blogContentCarouselAnimation', [
      state('*', style({
        transform:'translateX(-{{blogContentCarouselNumber}}%)'
      }),{params: {blogContentCarouselNumber: 0}}),
      state('stateone', style({
        transform:'translateX(-{{blogContentCarouselNumber}}%)'
      }),{params: {blogContentCarouselNumber: 0}}),
      state('statetwo', style({
        transform:'translateX(-{{blogContentCarouselNumber}}%)'
      }),{params: {blogContentCarouselNumber: 0}}),
      transition('* <=> *', [
        animate('0.5s ease-in-out')
      ])
    ]),
  ]
})
export class BlogFrontendComponent implements OnInit {

  constructor(
    public frontendService: FrontendService
  ) { }

  activeStateSubscription: any;
  activeBlogStateSubscription: any;
  ngOnInit() {
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
    this.activeBlogStateSubscription = this.frontendService.getActiveBlogState().subscribe((data) => {
      this.activeBlogStateChange(data);
    });
  }

  ngOnDestroy() {
    this.activeStateSubscription.unsubscribe();
    this.activeBlogStateSubscription.unsubscribe();
  }

  blogState:string = "hide";
  activeStateChange(state){
    if(state=="blog"){
      this.blogState = 'show'
    }else{
      this.blogState = 'hide'
    }
  }

  activeBlogStateChange(state){
    if(state==-1){
      this.closeBlogContent()
    }else{
      this.openBlogContent(state)
    }
  }

  blogAnimationDone(event){
    if(this.frontendService.activeBlogState!=-1){
      this.openBlogContent(this.frontendService.activeBlogState)
    }
    this.frontendService.animationNavigate = false
  }

  blogTagFilter: number = 1;
  blogContentState = "hide";

  filterBlogTag = (blog) => {
    if(this.blogTagFilter==1){
      return true;
    }
    if(this.blogTagFilter==2&&blog.blog_list[0].blog_listtype==10){
      return true;
    }

    for(let key in blog.blog_taglist){
      if(blog.blog_taglist[key].blog_tagid==this.blogTagFilter){
        return true;
      }
    }
    return false;
  }

  openBlogContent(blogid){
      var blogKey = this.frontendService.getBlogKey(blogid);

      this.blogContentState = "show";
      this.frontendService.activeBlog = this.frontendService.blog.bloglist[blogKey];
      if(this.frontendService.activeBlog.blog_heroimage!=''){
        var image = new Image();
        image.src = this.frontendService.activeBlog.blog_heroimage;
        if(!image.complete){
          this.frontendService.activeBlog.heroimageState = 'hide';
        }
      }
      
      if(this.frontendService.activeBlog.blog_list[0].blog_listtype==10){
        this.frontendService.activeBlog.replic = true;
        this.frontendService.activeBlog.refere
      }else{
        this.frontendService.activeBlog.replic = false;
      }
      if(document.getElementById("blog_content")){
        document.getElementById("blog_content").scrollTop = 0;
      }
  }

  closeBlogContent(){
    this.blogContentState = "hide";
    //this.hideReference(document.getElementById("blog_content").children[0]);
  }

  blogClick(event){
    if(event.target.tagName=="SUP"){
      this.frontendService.showReference(event, true);
    }
  }

  blogCarouselImage(listKey,blogContentCarouselNumber){
    if(isNaN(blogContentCarouselNumber)){
      blogContentCarouselNumber = 0;
    }
    var blog_list = this.frontendService.activeBlog.blog_list[listKey];
    if(blogContentCarouselNumber<0){
      blog_list.blogContentCarouselNumber = (blog_list.data.length-1);
    }else if(blogContentCarouselNumber>(blog_list.data.length-1)){
      blog_list.blogContentCarouselNumber = 0
    }else{
      blog_list.blogContentCarouselNumber = blogContentCarouselNumber;
    }
    if(!blog_list.blogContentCarouselState || blog_list.blogContentCarouselState == "statetwo"){
      blog_list.blogContentCarouselState = "stateone";
    }else{
      blog_list.blogContentCarouselState = "statetwo";
    }
  }

  blogCarouselImageCheckNumber(number){
    if(isNaN(number)){
      return 0;
    }else{
      return number;
    }
  }
  
  trackByFn(index, item) {
    return index;
  }

}
