import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../config/constants'
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Observable, Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FrontendService {
  _restURL : string;
  activeStateSubjectSubscription:any;
  activeBookStateSubjectSubscription:any;
  activeBlogStateSubjectSubscription:any;
  activeImpressumStateSubjectSubscription:any;
  navigations:number = 0;

  constructor(
    public router: Router,
    public http: HttpClient,
    public location: Location,
    private titleService: Title
  ) {
    router.events.subscribe((val) => {
      this.checkRoute();
    });
    this._restURL = AppConstants.restURL;
    this.activeStateSubjectSubscription = this.getActiveState().subscribe((data) => {
      this.activeState = data;
      if(!this.mobileVersion){
        this.animationNavigate = true
      }
      setTimeout(() => {this.activeStateOld = this.activeState}, 500)
    });
    this.activeBookStateSubjectSubscription = this.getActiveBookState().subscribe((data) => {
      this.activeBookState = data;
      if(!this.mobileVersion){
        this.animationNavigate = true
      }
    });
    this.activeBlogStateSubjectSubscription = this.getActiveBlogState().subscribe((data) => {
      this.activeBlogState = data;
    });
    this.activeImpressumStateSubjectSubscription = this.getActiveImpressumState().subscribe((data) => {
      this.activeImpressumState = data;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
        this.navigations++;
    });
    
  }
  

  public activeStateSubject = new Subject<string>();
  public activeState:string = "doorman";
  public activeStateOld:string;
  public activeBookState = 'book'
  public activeBookStateSubject = new Subject<any>();
  public activeBlogState = -1
  public activeBlogStateSubject = new Subject<any>();
  public activeImpressumState:any = {bookid: -1, autorinnenkollektiv: false}
  public activeImpressumStateSubject = new Subject<any>();

  getActiveState(): Observable<any> {
    return this.activeStateSubject.asObservable();
  }
  getActiveBookState(): Observable<any> {
    return this.activeBookStateSubject.asObservable();
  }
  getActiveBlogState(): Observable<any> {
    return this.activeBlogStateSubject.asObservable();
  }
  getActiveImpressumState(): Observable<any> {
    return this.activeImpressumStateSubject.asObservable();
  }

  booklist:any;
  booklistLoaded:boolean = false;
  booklistLoadedNumber: number = 0;
  urllist:any;
  mobileVersion:boolean = false;
  animationNavigate:boolean = false;
  routerChange:boolean = false;
  directLink: Boolean = false;
  directLinkBook: String;

  windowHeight:number = 0
  windowWidth:number = 0

  language:string = 'de'

  blog:any;
  blogLoaded:boolean = false
  blogLoading:boolean = false

  impressumLoaded:boolean = false
  impressum: any;

  headerState:string='show'
  showSearch:boolean = false

  lastRouteBook:any = false
  lastRouteBookId:number = 0;
  lastRoutePartId:number = 0;
  lastRouteChapterId:number = 0;
  lastRouteUnitId:number = 0;

  checkRoute(){
    if(!this.changeRouteMobile&&!this.animationNavigate&&this.urllist&&this.booklistLoaded&&this.impressumLoaded&&this.blogLoaded){
      if(this.routerChange){
        this.routerChange=false;
      }else{
          var url = this.location.path().split("/");
          for (let key in url) {
            url[key] = url[key].split("?")[0];
          }
          let bookid = -1
          if(url.length==1){
            this.openDoorman();
          }else if(url.length==2){
            var tiny=url[1].split("");
            if(!isNaN(Number(url[1]))&&tiny.length>=4){
              this.solveTinyUrl(url[1]);
            }else{
              switch (url[1]){
                case 'blog':
                  this.openBlog()
                  break;
                case 'impressum':
                  this.openImpressum()
                  break;
                case 'about':
                  this.openAbout()
                  break;
                case 'browse':
                  this.openMaterialarchiv()
                  break;
                default:
                  if(isNaN(Number(url[1]))){
                    bookid = this.solveRoute(url[1], "book");
                  }else{
                    bookid = Number(url[1])
                  }
                  this.openBook(bookid)
                
              }
            }
          }else if(url.length==3){
            switch (url[1]){
              case 'blog':
                let blogId = -1
                if(isNaN(Number(url[2]))){
                  blogId = this.solveRoute(url[2], "blog")
                }
                this.openBlog(blogId)
                break;
              case 'impressum':
                if(isNaN(Number(url[2]))){
                  url[2] = this.solveRoute(url[2], "book");
                }
                this.openImpressum(Number(url[2]))
                break;
              default:
                if(isNaN(Number(url[1]))){
                  url[1] = this.solveRoute(url[1], "book");
                }
                if(isNaN(Number(url[2]))){
                  url[2] = this.solveRoute(url[2], "part")
                }
                this.openBook(Number(url[1]), Number(url[2]))              
            }
          }else if(url.length>3){
            let bookid = -1
            let partid = -1
            let chapterid = -1
            let unitid = -1
            let elementid = -1
            if(isNaN(Number(url[1]))){
              bookid = this.solveRoute(url[1], "book");
            }
            if(isNaN(Number(url[2]))){
              partid = this.solveRoute(url[2], "part")
            }
            if(isNaN(Number(url[3]))){
              chapterid = this.solveRoute(url[3], "chapter")
            }
            if(url?.[4]){
              if(isNaN(Number(url[4]))){
                unitid = this.solveRoute(url[4], "unit")
              }else{
                unitid = Number(url[4])
              }
            }
            if(url?.[5]){
              elementid = Number(url[5])
            }

            this.openBook(bookid, partid, chapterid, unitid, elementid)

          }

        }
    }
  }

  solveRoute(route, type){
    if(isNaN(route)){
    for(let key in this.urllist[type]){
      if(this.urllist[type][key][type+"name"]==route){
        return this.urllist[type][key][type+"id"];
      }
    }}else{
      return route;
    }
  }

  resolveRoute(id, type){
    for(let key in this.urllist[type]){
      if(this.urllist[type][key][type+"id"]==id){
        return this.urllist[type][key][type+"name"];
      }
    }
  }

  solveTinyUrl(url){
    let request = this.http.post<any>(this._restURL+'frontend/solveTinyUrl.php',url);
    request.subscribe((res)=>{
      if(!res.error){
        this.animationNavigate = false;
        if(!res.data){
          this.openDoorman();
        }else{
          this.openBook(res.data[0].bookid,res.data[0].partid,res.data[0].chapterid,res.data[0].unitid,res.data[0].dataid);
        }
      }
    });
  }

  getBooklist(){
    let request = this.http.get<any>(this._restURL+'frontend/getBooks.php');
      request.subscribe((res)=>{
        if(!res.error){
          this.booklist = res.data.booklist;
          this.urllist = res.data.urllist;
          for(let book of this.booklist){
            book.images = [];
            book.imagesTemp = [];
              book.partlist.forEach(function (item, index, object) {
                if(item==""){
                  object.splice(index, 1);
                }
              }); 
                for (let part of book.partlist) {
                    for (let image of part.images) {
                      if(this.mobileVersion){
                        image.imagelink = image.imagelink.replace("https://cache.ch/dataupload", "https://cache.ch/dataupload/web/w_1280");
                      }else{
                        image.imagelink = image.imagelink.replace("https://cache.ch/dataupload", "https://cache.ch/dataupload/web/w_1920");
                      }
                    }
                    if(part.images&&part.images[0])book.imagesTemp.push(part.images[0].imagelink);
                    for (let chapter of (part.chapterlist || [])) {
                      for(let unit of chapter.unitlist){
                        for(let data of unit.datalist){
                          if(data.datatype==2){
                            data.datalink = data.datalink.replace("https://cache.ch/dataupload", "https://cache.ch/dataupload/web/w_1280");
                          }
                        }
                      }
                    }

                }

              if(book.imagesTemp.length==0){
                book.imagesTemp.push('https://cache.ch/dataupload/web/w_1280/Nestl%C3%A9%20Swiss%20Milk.jpg');
                book.imagesTemp.push('https://cache.ch/dataupload/web/w_1280/Nestl%C3%A9%20Swiss%20Milk.jpg');
              }else if(book.imagesTemp.length==1){
                book.imagesTemp.push(book.imagesTemp[0]);
              }

              for (let imageTemp of book.imagesTemp) {
                var tempImg = new Image();
                tempImg.name = book.bookid;
                tempImg.onload = function (element) {
                  let bookid = element.srcElement.name;
                  let book = this.booklist[this.getBookArrayKey(bookid)]
                  book.images.push(element.srcElement.src);
                  if(book.images.length==2){
                    this.booklistLoadedNumber++;
                    if(this.booklistLoadedNumber==this.booklist.length){
                      this.booklistLoaded=true;
                    }
                    this.checkRoute();
                  }
                }.bind(this);  
                tempImg.src = imageTemp;
              }
              book.image1 = book.imagesTemp[0];
              book.image2 = book.imagesTemp[1];
              book.imageState1 = 'show';
              book.imageState2 = 'hide';
              book.actualimage = 0;
          }

        }
        this.getImpressum()
        this.getBlog()
      });
  }


  getBlog(){
    if(!this.blogLoaded&&!this.blogLoading){
      this.blogLoading = true;
      this.http.get<any>(this._restURL+'frontend/getBlog.php').subscribe((res)=>{
        if(!res.error){
          for(let key in res.data.bloglist){
            if(res.data.bloglist[key].empty){
              res.data.bloglist.splice(key,1);
            }
          }
          this.blog = res.data;
          this.blogLoaded = true;
          this.blogLoading = false;
          this.checkRoute();
        }
      });
    }
  }

  getImpressum(){
    if(!this.impressumLoaded){
      this.http.get<any>(this._restURL+'frontend/getImpressum.php').subscribe((res)=>{
        if(!res.error){
          this.impressumLoaded=true;
          this.impressum = res.data["impressum"][0];
          for (let key2 in this.booklist) {
            this.booklist[key2].author = [];
              for (let key in res.data["author"]) {
                if(this.booklist[key2].bookid==res.data["author"][key].bookid){
                  this.booklist[key2].author.push(res.data["author"][key]);
                }
            }
          }
          this.checkRoute();
        }
      });
    }
  }


  getBlogKey(blogid){
    for (let key in this.blog.bloglist) {
      if(this.blog.bloglist[key].blog_dataid == blogid){
        return key;
      }
    }
  }

  getBookArrayKey(bookid){
    for (let key in this.booklist) {
      if(this.booklist[key].bookid == bookid){
        return key;
      }
    }
  }
  
  getPartArrayKey(partid, bookid=-1){
    if(bookid==-1){
      if(!this.activeBook){
        return -1
      }
      bookid = this.activeBook.bookid
    }
      var bookKey = this.getBookArrayKey(bookid);
      var partlist = this.booklist[bookKey].partlist;
    for (let key in partlist) {
      if(partlist[key].partid == partid){
        return Number(key);
      }
    }
    return -1
  }

  getChapterArrayKey(bookid, chapterid, partKey=-1){
    var bookKey = this.getBookArrayKey(bookid);
    if(!this.booklist[bookKey]){
      return -1
    }
    if(this.activePart&&partKey==-1){
      var part = this.booklist[bookKey].partlist[this.getPartArrayKey(this.activePart.partid)];
    }else{
      var part = this.booklist[bookKey].partlist[partKey];
    }
    if(!part){
      return -1
    }
    for (let key in part.chapterlist) {
      if(part.chapterlist[key].chapterid == chapterid){
        return Number(key);
      }
    }
    return -1
  }

  getUnitArrayKey(bookid, unitid, partKey, chapterKey){
    if(partKey==-1||chapterKey==-1){
      return -1
    }
    let bookKey = this.getBookArrayKey(bookid);
    var unitlist = this.booklist[bookKey].partlist[partKey].chapterlist[chapterKey].unitlist;
    for (let key in unitlist) {
      if(unitlist[key].unitid == unitid){
        return Number(key);
      }
    }
    return -1
  }

  changeRouteMobile:boolean = false

  private setPageTitle(): void {
    let title = 'cache.ch';
    if (this.activeBook) {
      title = this.activeBook.bookname + ' – cache.ch';
      if (this.activeChapter) {
        title = this.activeBook.bookname + ' ▶ ' + this.activeChapter.chaptername + ' – cache.ch';
      } else if (this.activePart) {
        title = this.activeBook.bookname + ' ▶ ' + this.activePart.partname + ' – cache.ch';
      }
    }
    this.titleService.setTitle(title);
  }

  changeRoute(route){
    if(this.mobileVersion){
      this.changeRouteMobile = true
      setTimeout(() => {
        this.changeRouteMobile = false
      }, 200)
    }
    this.router.navigate([route])
  }

  activeBook:any;
  activeChapter:any;
  activePart:any;
  activeUnit:any;
  activeBlog:any;
  activeElementId:any;

  activeBookKey:any;
  activeChapterKey:any;
  activePartKey:any;
  activeUnitKey:any;

  openBook(bookid, partid=-1, chapterid=-1, unitid=-1, elementid=-1){
    if(!this.animationNavigate){
      var bookKey = this.getBookArrayKey(bookid)
      if(this.checkNavigateToElement(bookid,partid,chapterid)){
        this.activeBook = this.booklist[bookKey]
        this.activeBookKey = bookKey
        if(partid!=-1){
          let partKey = this.getPartArrayKey(partid)
          if(partKey!=-1){
            this.activePart = this.activeBook.partlist[partKey]
            this.activePartKey = partKey
            if(chapterid!=-1){
              let chapterKey = this.getChapterArrayKey(bookid, chapterid, partKey)
              if(chapterKey!=-1){
                this.activeChapter = this.activePart.chapterlist[chapterKey]
                this.activeChapterKey = chapterKey
                if(unitid==-1){
                  unitid = this.activeChapter.unitlist[0].unitid;
                }
                let unitKey = this.getUnitArrayKey(bookid, unitid, partKey, chapterKey)
                if(unitKey!=-1){
                  this.activeUnit = this.activeChapter.unitlist[unitKey]
                  this.activeElementId = elementid
                  this.activeUnitKey = unitKey
                }else{
                  this.activeUnit = false
                  this.activeUnitKey = -1
                }
              }else{
                this.activeChapter = false
                this.activeChapterKey = -1
                this.activeUnit = false
                this.activeUnitKey = -1
              }
            }else{
              this.activeChapter = false
              this.activeChapterKey = -1
              this.activeUnit = false
              this.activeUnitKey = -1
            }
          }else{
            this.activePart = false
            this.activePartKey = -1
            this.activeChapter = false
            this.activeChapterKey = -1
            this.activeUnit = false
            this.activeUnitKey = -1
          }
        }else{
          this.activePart = false
          this.activePartKey = -1
          this.activeChapter = false
          this.activeChapterKey = -1
          this.activeUnit = false
          this.activeUnitKey = -1
        }

        if(this.headerState=='mobile_open'){
          this.headerState="show";
        }

        let link = "/"+this.resolveRoute(bookid,"book")
        let newBookState = "book"
        if(partid!=-1){
          link += '/'+this.resolveRoute(partid,"part")
          newBookState = "part"
          if(chapterid!=-1){
            link += '/'+this.resolveRoute(chapterid,"chapter")
            newBookState = "unit"
            if(unitid!=-1){
              link += '/'+this.resolveRoute(unitid,"unit")
              newBookState = "unit"
              if(elementid!=-1){
                link += '/'+elementid
              }
            }
          }
        }
        this.activeStateSubject.next("book");
        this.activeBookStateSubject.next(newBookState);
        this.setPageTitle();
        if(!this.mobileVersion){
          this.animationNavigate = true
        }
        this.changeRoute(link)
      }
    }else{
      console.log("Still navigating. Can't open book.")
    }
  }

  openBookOutside(bookid, partid=-1, chapterid=-1, unitid=-1, elementid=-1){
    let bookKey = this.getBookArrayKey(bookid)
    let book = this.booklist[bookKey]
    if(partid==-1 && book.activePartOldId){
      partid = book.activePartOldId
    }
    if(chapterid==-1 && book.activeChapterOldId){
      chapterid = book.activeChapterOldId
    }
    if(unitid==-1 && book.activeUnitOldId){
      unitid = book.activeUnitOldId
    }
    this.openBook(bookid, partid, chapterid, unitid, elementid)
  }

  openDoorman(){
    if(!this.animationNavigate&&this.activeState!="doorman"){
      this.activeStateSubject.next("doorman");
      this.changeRoute('/');
    }
  }

  openImpressum(bookid=-1, autorinnenkollektiv=false){
    if(!this.animationNavigate&&this.activeState!="impressum"){
      this.checkLastRouteBook()
      var timeout = 1200
      if(this.activeState=='impressum'){
        timeout = 1
      }
      this.activeStateSubject.next("impressum");
      setTimeout(() => {
        this.activeImpressumStateSubject.next({bookid: bookid, autorinnenkollektiv: autorinnenkollektiv})
      },timeout)
      this.changeRoute('/impressum');
    }
  }

  openBlog(blogid=-1){
    if(!this.animationNavigate){
      this.checkLastRouteBook()
      let bloglink = "/blog"
      if(blogid!=-1){
        if(this.resolveRoute(blogid, "blog")){
          bloglink += "/" + this.resolveRoute(blogid, "blog")
        }
      }
      this.activeStateSubject.next("blog");
      this.changeRoute(bloglink);
      this.activeBlogStateSubject.next(blogid);
    }
    
  }
  openAbout(){
    if(!this.animationNavigate){
      this.checkLastRouteBook()
      if(!this.animationNavigate&&this.activeState!="about"){
        this.activeStateSubject.next("about");
        this.changeRoute('/about');
      }
    }
  }

  openMaterialarchiv(){
    if(!this.animationNavigate&&this.activeState!="materialarchiv"){
      this.activeStateSubject.next("materialarchiv");
      this.changeRoute('/browse');
    }
  }

  openLink(link){
    window.open(link, '_blank');
  }

  openSearch(){
    if(!this.animationNavigate){
      if(this.activeState=="search"){
        this.checkRoute()
      }else{
        this.activeStateSubject.next("search");
      }
    }
  }

  openLastRoute(){ 
    if (this.navigations > 1) {
        this.location.back();
    } else {
        this.router.navigateByUrl('/')
    }
  }

  goBackIntoBook(){
    this.openBook(this.lastRouteBookId, this.lastRoutePartId, this.lastRouteChapterId, this.lastRouteUnitId)
  }

  checkLastRouteBook(){
    if(this.activeState=="book"){
      this.lastRouteBook = this.activeBook.bookname.toUpperCase()
      this.lastRouteBookId = this.activeBook.bookid
      this.lastRoutePartId = this.activePart.partid
      this.lastRouteChapterId = this.activeChapter.chapterid
      this.lastRouteUnitId = this.activeUnit.unitid
    }
  }

  checkNavigateToElement(bookid,partid,chapterid){
    if(bookid!=-1&&bookid!='impressum'&&bookid!='blog'){
      var bookKey = this.getBookArrayKey(bookid);
      if(bookKey){
        if(this.booklist[bookKey].public==1){
          if(partid!=-1){
            var partKey = this.getPartArrayKey(partid, bookid);
            if(partKey!=-1){
              if(chapterid!=-1){
                var chapterKey = this.getChapterArrayKey(bookid,chapterid, Number(partKey));
                if(chapterKey!=-1){
                  return true
                }
              }else{
                return true;
              }
            }
          }else{
            return true;
          }
        }else{
          console.log("Diese Ausgabe ist noch nicht öffentlich.");
          return false;
        }
      }
    }else{
      return true;
    }
    console.log("Dieses Element existiert nicht:", bookid, partid, chapterid);
    return false;
  }

  

  // REFERENCES //

  showReference(event, blog=false){
    var lineHeight;
    var lines;
    var referenceNumber = event.target.innerHTML;
    var targetNode = event.target.parentNode;
    var adjustmentLines;
    var adjustmentHeight;
    var adjustmentHeightNewNode;
    var referenceMarginTop;
    var linesBias;
    var addedLines;
    /* if reference is clicked in referencebox */
    if(targetNode.className.indexOf('reference_inner')!='-1'){
      targetNode = targetNode.parentNode.parentNode.children;
      for(var i=0; i<targetNode.length;i++){
        if(targetNode[i].getAttribute("style")){
          targetNode = targetNode[i];
        }
      }
      
      if(targetNode.className.indexOf('unit_text_s')!='-1'){
        targetNode = targetNode.parentNode.children[1];
      }
    }

    /* check if refence is open and then close */
    if(targetNode.parentNode.querySelectorAll('.reference')&&targetNode.parentNode.querySelectorAll('.reference').length>0){
      var actualReference = targetNode.parentNode.querySelectorAll('.reference')[0].children[0].innerHTML;
      this.hideReference(targetNode);
    }

    var referenceNodes = targetNode.querySelectorAll("sup");
    
    for (let i = 0; i < referenceNodes.length; i++) {
      if(referenceNodes[i].innerHTML == referenceNumber){
        referenceMarginTop = referenceNodes[i].offsetTop - targetNode.offsetTop;
        if(blog)referenceMarginTop = referenceNodes[i].offsetTop
      }
    }

    if(actualReference!=referenceNumber){

      var newTextNode = document.createElement('div');
      addedLines = 0
      adjustmentHeightNewNode = 0
      if(!blog){
        if(targetNode.className.indexOf('unit_text_l')!=-1){
          if(this.mobileVersion){
            adjustmentHeight = 22;
            adjustmentHeightNewNode = -15;
            lineHeight = 22;
            adjustmentLines = 20;
            linesBias = 7
            addedLines = 1
          }else{
            adjustmentHeight = 9;
            adjustmentHeightNewNode = 14;
            lineHeight = 30;
            adjustmentLines = 20;
            linesBias = 11

          }
          lines = Math.floor(((referenceMarginTop)-linesBias)/lineHeight)+1;
          newTextNode.classList.add("unit_text_l");
        }else{
          lineHeight = 21;
          adjustmentLines = -8;
          adjustmentHeight = 29;
          lines = Math.floor((referenceMarginTop-16)/lineHeight)+1;
          newTextNode.classList.add("unit_text_m");
        }
      }else{
        adjustmentHeight = 30;
        lineHeight = 32;
        adjustmentLines = 2;
        adjustmentHeightNewNode = -5;
        lines = Math.floor(((referenceMarginTop)-16)/lineHeight)+1;
        newTextNode.classList.add("blog_content_text");
      }
        
      newTextNode.classList.add("reference_block");

      var newTextNodeChild = document.createElement('div');
      newTextNodeChild.innerHTML = event.target.parentNode.innerHTML;
      newTextNodeChild.classList.add("reference_inner");
      
      newTextNodeChild.style.top=-((lineHeight)*(lines+addedLines+1))+adjustmentLines+"px";
      if(blog&&targetNode.classList.length==0){
        newTextNodeChild.style.marginLeft="15pt";
      }

      newTextNode.appendChild(newTextNodeChild);
      targetNode.style.height = 'auto';
      newTextNode.style.height=(targetNode.offsetHeight-((lineHeight)*(lines+1))+adjustmentHeightNewNode)+"px";

      /* Reference */

      var newReference = document.createElement("div");
      var newReferenceNumber = document.createElement("div");
      var newReferenceText = document.createElement("div");
      var newReferenceClose = document.createElement("div");
      
      newReference.classList.add("reference");
      if(blog){
        newReference.classList.add("reference_blog");
      }
      newReferenceNumber.classList.add("reference_number");
      newReferenceNumber.innerHTML = referenceNumber;
      newReferenceText.classList.add("reference_text");

      newReferenceClose.classList.add("cross");
      newReferenceClose.classList.add("reference_close");
      newReferenceClose.addEventListener("click", (function(){this.hideReference(targetNode)}).bind(this));

      if(!blog){
        newReferenceText.innerHTML += this.activeChapter.referencelist[(referenceNumber-1)].referencetext;
      }else{
        newReferenceText.innerHTML += this.activeBlog.referencelist[(referenceNumber-1)].referencetext;
      }
      newReferenceText.insertBefore(newReferenceClose, newReferenceText.firstChild);

      newReference.appendChild(newReferenceNumber);
      newReference.appendChild(newReferenceText);

      /* ---- */

      if(newTextNode.style.height==adjustmentHeight+"px"){
        newTextNode.style.height="0px";
      }
      if(newTextNode.style.height){
        targetNode.after(newTextNode);
      }
      
      targetNode.after(newReference);
      targetNode.style.height=(lineHeight*(lines))+adjustmentHeight+"px";
      if(blog){
        targetNode.style.marginBottom=0;
        if(targetNode.classList.length==0){
          targetNode.style.overflow="hidden";
        }
      }
    }
  }
  hideReference(element){
    var parentChildren=element.parentNode.children;
    for(var i=0; i<parentChildren.length;i++){
      if(parentChildren[i].getAttribute("style")){
        parentChildren[i].removeAttribute("style")
      }
    }
    this.hideReferenceRef(element);
    this.hideReferenceText(element);
  }
  hideReferenceRef(element){
    element.parentNode.querySelectorAll('.reference').forEach(e => e.remove());
  }
  hideReferenceText(element){
    element.parentNode.querySelectorAll('.reference_block').forEach(e => e.remove());
  }

  // REST API //

  getPartData(partid){
    return this.http.post<any>(this._restURL+'frontend/getPartdata.php', partid);
  }


  search(search){
    return this.http.post<any>(this._restURL+'frontend/search.php',search);
  }

  // HELPERS // 

  waitFor(conditionFunction, timeout: number = 10000): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
  
      const checkCondition = () => {
        if (conditionFunction()) {
          resolve();
        } else {
          const currentTime = Date.now();
          if (currentTime - startTime >= timeout) {
            reject(new Error('Timeout exceeded'));
          } else {
            setTimeout(checkCondition, 500);
          }
        }
      };
  
      checkCondition();
    });
  }

  getNumber(number){
    return Number(number);
  }

  replaceYoutubeEmbed(s:string) {
    return s && s.replace('&feature=youtu.be','');
  }
  replaceYoutubeEmbedImage(s:string) {
    return s && s.replace('&feature=youtu.be','').replace('www','img').replace('embed','vi').replace('www','img')+'/hqdefault.jpg';
  }
  checkYoutube(s:string){
    return s.indexOf("youtube")!=-1
  }

}
