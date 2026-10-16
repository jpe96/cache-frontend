import { HostListener, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FrontendService } from './frontend.service';
import { trigger, transition, style, animate, state, group, query, animateChild } from '@angular/animations';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.css','./frontend_mobile.component.css'],
})
export class FrontendComponent implements OnInit {


  constructor(
    public frontendService: FrontendService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    window.addEventListener('wheel', this.wheel, true);
    window.addEventListener('scroll', this.scroll, true);
    this.animationNavigate = false;
  }
  ngOnDestroy() {
    window.removeEventListener('wheel', this.scroll, true);
    window.removeEventListener('scroll', this.scroll, true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(!this.animationNavigate&&this.activeState!="impressum"&&this.activeState!="blog"&&this.searchText==''&&!this.frontendService.mobileVersion){
      var key = event.which || event.keyCode;
      switch (key){
        case 40:
          if(this.activeBookState=="part"){
            if(this.partlist[(Number(this.activePartKey)+1)]){
              this.navigateToElement(this.activeBook.bookid,this.partlist[(Number(this.activePartKey)+1)].partid);
            }
          }
        break;
        case 38:
          if(this.activeBookState=="part"){
            if(this.partlist[(Number(this.activePartKey)-1)]){
              this.navigateToElement(this.activeBook.bookid,this.partlist[(Number(this.activePartKey)-1)].partid);
            }
          }
        break;
        case 39:
          if(this.activeBookState=="unit"&&!this.animationNavigate){
            this.animationstackClear();
            this.goUnitSlideLeft();
          }
        break;
        case 37:
          if(this.activeBookState=="unit"&&!this.animationNavigate){
            this.animationstackClear();
            this.goUnitSlideRight();
          }
        break;
      }
    }
  }
  scroll = (event): void => {
    if(!this.frontendService.mobileVersion&&this.activeState!="impressum"&&this.activeState!="blog"){
      if(!this.animationNavigate&&this.megamenuState!='show'&&this.searchText==''){
        if(this.activeBookState=='unit'&&!this.animationUnitToUnit){
          if(event.target.id.replace("unit","")==this.activeUnitId){
            var element = event.target;
            if(this.activeUnitKey==0){
                if(element.scrollTop!=0){
                  this.booktitleState="fixed_1";
                  this.headerState="hide";
                  this.partlist[this.activePartKey].unitContainerState = "show";
                }else{
                  this.booktitleState="fixed_2";
                  this.headerState="show";
                  this.partlist[this.activePartKey].unitContainerState = "show_header";
                }
            }

            let elementPosition = element.scrollTop + element.offsetHeight;
            let elementHeight = element.scrollHeight;
            if(elementPosition == elementHeight){
              var chapterkey = this.activeChapterKey;
              var chapterweb;
              var exitloop = false;
              var part = this.partlist[this.activePartKey];
              if(this.activeUnitKey==part.chapterlist[chapterkey].unitlist.length-1){
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
      if(this.activeBookState=="book"){
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
    }
    if(this.frontendService.mobileVersion&&this.activeBookState=='unit'){
      var unit = this.partlist[this.activePartKey].chapterlist[this.activeChapterKey].unitlist[this.activeUnitKey];
      if(this.activeUnitId){
        if(unit.unitContainerState=="show_first"){
          var unitElement = document.getElementById("unit"+this.activeUnitId);
          if(unitElement.scrollTop>0){
            unit.unitContainerState="show";
            this.headerState="hide";
            this.mobileChapterheaderState="fixed";
          }
        }
        if(this.activeChapterKey==0&&this.activeUnitKey==0){
          var unitElement = document.getElementById("unit"+this.activeUnitId);
          if(unitElement.scrollTop==0){
            unit.unitContainerState="show_first";
            this.headerState="show";
            this.mobileChapterheaderState="show";
          }
        }
      }
    }
  };
  wheel = (event): void => {
    if(!this.animationNavigate&&this.megamenuState!='show'&&this.activeState!="impressum"&&this.activeState!="blog"&&this.searchText==''&&!this.frontendService.mobileVersion){
      if(this.activeBookState=='unit'){
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
      }else if(this.activeBookState=='part'&&this.activeState=="book"){
        if(!this.animationPartTile){
          if(event.deltaY>0){
            if(this.partlist[(Number(this.activePartKey)+1)]){
              this.navigateToElement(this.activeBook.bookid,this.partlist[(Number(this.activePartKey)+1)].partid);
            }
          }else{
            if(this.partlist[(Number(this.activePartKey)-1)]){
              this.navigateToElement(this.activeBook.bookid,this.partlist[(Number(this.activePartKey)-1)].partid);
            }
          }
        }
      }
    }
  };


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
  unitContainerAnimationDone(event){
    if(event.toState=="show"){
      this.animationstackRun();
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
      this.transitionNextElementState='nextpart_hide';
      this.activeBookState='part';

      var part = this.partlist[this.activePartKey];
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

      this.activePartKey = Number(this.activePartKey)+1;
      part = this.partlist[this.activePartKey];
      part.partregisterchapterState = "show";
      part.partlistState = "tile_down";
      this.partlistImageDiashowLoop(this.activePartKey);

      this.animationNavigate=false;
      this.animationUnitToNextPart = false;
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


  /* INTERACTIONS */
  // goDoorman(){
  //   this.doormanLogoState="show";
  //   this.animationImageDiashow = setTimeout(() =>  {
  //     this.doormanLogoReady=true;
  //   }, 2000);
  // }
  // goHideDoorman(bookKey){
  //   this.doormanState='hide';
  // }
  goDoormanToElement(partKey, chapterKey){
    this.waitFor(_ => document.getElementById("book_abstract")).then(_ => {
      this.activeBookState='unit';
      this.renderer.setStyle(document.getElementById("book_info"), 'display', 'none');

      this.booktitleState = 'fixed_1';
      this.headerState = 'hide';

      this.activePartKey = partKey;
      this.activeChapterKey = chapterKey;
      this.activePartId = this.partlist[this.activePartKey].partid;
      this.activeChapterId = this.partlist[this.activePartKey].chapterlist[chapterKey].chapterid;
      this.showChapterlist();
      for(let key in this.partlist){
        /* global settings for all */
        var part = this.partlist[key];
        part.partregisterchapterState = "show_na";
        part.partlistAnimationZIndex = this.partlist.length-Number(key)+1;
        if(key!=this.activePartKey){
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
      if(this.activeState=="impressum"||this.activeState=="blog"){
        this.animationstackAdd("goLoaderBook",this.activeBook.bookid);
        this.animationstackRun();
      }else{
        this.materialArchiveState='hide';
        this.doormanState='hide';
      }
    });
  }
  // goShowDoorman(){
  //     this.doormanState='show';
  //     this.showDoormanImages();
  // }
  goPartoverviewToPart(partid){
      var partKey = this.getPartArrayKey(partid);
      window.clearTimeout(this.animationImageDiashow);
      window.clearTimeout(this.animationImageDiashowLoop);
      for (let key in this.partlist) {
        var part = this.partlist[key];
        part.partlistAnimationZIndex = key;
        if(key == partKey){
          this.activePartKey = key;
          this.activePartId = part.partid;
          var partlistTop =

          part.partlistState = 'up';
          part.partlistAnimationTop = (-1)*(document.getElementById("partlist"+this.activePartId).getBoundingClientRect().y-77);
        }
        if(key < partKey){
          part.partlistState = 'stay';
        }
        if(key > partKey){
          part.partlistState = 'down';
        }
      }
      this.booktitleState="fixed_2";
  }
  goPartToPartoverview(){
    this.activeBookState="book";

    for (let key in this.partlist) {

      let bookinfoElement = document.getElementById("book_info");
      this.renderer.removeStyle(bookinfoElement, 'display');

      /* remove style-attributes for the tile-layout */

      var part = this.partlist[key];
      var partKey = this.activePartKey;
      part.partlistAnimationZIndex = key;
      if(key == partKey){
        part.partlistState = 'stay';
      }
      if(key < partKey){
        part.partlistState = 'stay';
      }
      if(key > partKey){
        part.partlistState = 'down';
      }

      for (let key2 in this.partlist[key].chapterlist) {
        part.chapterlist[key2].chapterlistTitleState = "hide";
      }

      part.partregisterchapterState = 'hide';

    }
  }
  goPartToUnit(chapterid){
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
    for (let key in this.partlist) {
      var part = this.partlist[key];
      if(key!=this.activePartKey){
        part.partlistState = 'hide';
      }else{
        part.partimagecontainerState = "slide_left";
        part.partregisterState = "hide";
        part.unitContainerState = "show_header_na";
        
        for (let key2 in this.partlist[key].chapterlist) {
          if(this.partlist[key].chapterlist[key2].chapterid!=chapterid){
            this.partlist[key].chapterlist[key2].chapterlistTitleState = "hide";
          }else{
            this.activeChapterKey = key2;
            this.animationstackRun();
          }
        }

      }
    }
  }
  goPartToPart(partkey){
    this.animationPartTile = true;
    if(partkey<=this.partlist.length-1&&partkey>=0){
      window.clearTimeout(this.animationImageDiashow);
      window.clearTimeout(this.animationImageDiashowLoop);
      this.activePartKey = partkey;
      this.activePartId = this.partlist[this.activePartKey].partid;
      for (let key in this.partlist) {
        if(this.activePartKey>key){
          this.partlist[key].partlistState = 'tile_up';
        }else if(this.activePartKey<=key){
          this.partlist[key].partlistState = 'tile_down';
        }
      }
      this.partlistImageDiashow(this.activePartKey);
    }
  }
  goUnitSlideLeft(){
    clearTimeout(this.timeoutUnitBottom);
    this.unitBottom=false;
    this.unitBottomWait=false;
    var chapterkey = this.activeChapterKey;
    var part = this.partlist[this.activePartKey];
    
    if(this.animationUnitToNextPart){
      this.goUnitNextPart();
    }else{
      if(this.activeUnitKey!=part.chapterlist[this.activeChapterKey].unitlist.length-1){
        this.animationUnitToUnit=true;
        this.navigateToElement(this.activeBook.bookid,part.partid, part.chapterlist[chapterkey].chapterid, part.chapterlist[chapterkey].unitlist[Number(this.activeUnitKey)+1].unitid);
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
            this.navigateToElement(this.activeBook.bookid,part.partid, part.chapterlist[chapterkey].chapterid, part.chapterlist[chapterkey].unitlist[0].unitid);
          }else{
            if(this.partlist[Number(this.activePartKey)+1]){
              /*scroll to bottom and show next part */
              var unit = document.getElementById("unit"+part.chapterlist[this.activeChapterKey].unitlist[this.activeUnitKey].unitid);
              var elementHeight = unit.scrollHeight;
              var oldPos;
                let scrollToTop = window.setInterval(() => {
                  var pos = unit.scrollTop;
                  if (pos<elementHeight&&oldPos!=pos) {
                    unit.scrollTop = (pos + elementHeight/250); 
                    oldPos = pos;
                  }else{
                    window.clearInterval(scrollToTop);
                  }
                }, 6);
            }else{
              this.navigateToElement(this.activeBook.bookid);
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
    var part = this.partlist[this.activePartKey];
    if(this.activeUnitKey!=0){
      this.navigateToElement(this.activeBook.bookid,part.partid, part.chapterlist[this.activeChapterKey].chapterid, part.chapterlist[this.activeChapterKey].unitlist[Number(this.activeUnitKey)-1].unitid);
    }else{
      if(this.activeChapterKey==0){
        this.navigateToElement(this.activeBook.bookid,part.partid);
      }else{
        var chapterkey = this.activeChapterKey;
        var chapterweb;
        var exitloop = false;
        do{
          if(this.partlist[this.activePartKey].chapterlist[chapterkey-1]){
            chapterweb = this.partlist[this.activePartKey].chapterlist[chapterkey-1].chapterweb;
          }else{exitloop=true}
          chapterkey--;
        }while(!exitloop&&chapterweb==0)

        if(chapterkey==-1){
          this.navigateToElement(this.activeBook.bookid,part.partid);
        }else{
          this.navigateToElement(this.activeBook.bookid,part.partid, part.chapterlist[chapterkey].chapterid,part.chapterlist[chapterkey].unitlist[part.chapterlist[chapterkey].unitlist.length-1].unitid);
        }
      }
    }
  }
  goUnitToUnit(chapterkey, unitkey, fromPart=false, toElement=false){
    var part = this.partlist[this.activePartKey];
    this.unitLoading=true;
    this.waitFor(_ => part.chapterlist[this.activeChapterKey].unitlist).then(_ => {
      if(this.activeUnitKey&&(part.unitContainerState=="show_header"||part.unitContainerState=="show_header_na")&&this.activeBookState=="unit"){
        this.headerState="hide";
        this.booktitleState="fixed_1";
        part.unitContainerState="show";
        this.animationstackAdd("goUnitToUnit", chapterkey, unitkey);
      }else{
      this.unitLoading=false;
      if(this.animationUnitToNextPart){
        this.unitHideNextPart();
      }

        this.activeChapterKey = chapterkey;
        this.activeUnitKey = unitkey;
        
        var unitid = this.partlist[this.activePartKey].chapterlist[this.activeChapterKey].unitlist[unitkey].unitid;
        this.activeUnitId = unitid;
        if(!this.activeUnitKey){
          this.activeUnitKey = 0;
        }

        this.activeChapterId = part.chapterlist[chapterkey].chapterid;
        if(document.getElementById("unit"+unitid)){
          document.getElementById("unit"+unitid).scrollTop=0;
        }
        if(!part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitLoaded){
          var childrenKey = 0;
          if(this.activeUnitKey==0){
            childrenKey=2;
          }
          this.waitFor(_ => document.getElementById("unit"+part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitid)).then(_ => {
            if(document.getElementById("unit"+part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitid)){
              this.waitFor(_ => document.getElementById("unit"+part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitid).children[childrenKey]).then(_ => {
                if(document.getElementById("unit"+part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitid).children[childrenKey]){
                  var unitData = document.getElementById("unit"+part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitid).children[childrenKey].children;
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
                var data = part.chapterlist[chapterkey].unitlist[this.activeUnitKey].datalist;
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
                part.chapterlist[chapterkey].unitlist[this.activeUnitKey].unitLoaded = true;
              });
            }
          });
        }
        
        for(let key in part.chapterlist){
          for(let key2 in part.chapterlist[key].unitlist){

            if(key>chapterkey||(key==chapterkey&&key2>=this.activeUnitKey)){
                part.chapterlist[key].unitlist[key2].unitState = 'show';
            }else{
              part.chapterlist[key].unitlist[key2].unitState = 'slide_left';
            }
          }
        }
      }
    });
  }
  goUnitToPart(){
    this.activeBookState="part";
    var part = this.partlist[this.activePartKey];
    this.unitBottom = false;
    this.booktitleState = 'fixed_2';
    part.partimagecontainerState = "slide_middle";
    part.partregisterState = "show";
  }
  goUnitToElement(elementid, unitid){
    var time = false;
    setTimeout(() => time=true, 600);
    this.waitFor(_ => document.getElementById("data_element_"+elementid)&&time).then(_ => {
      if(document.getElementById("data_element_"+elementid).children[0]){
        var element = document.getElementById("data_element_"+elementid).children[0].children[0].children[0];
        var unit = document.getElementById("unit"+unitid);
        var oldScrollPosition = unit.scrollTop;
        var newScrollPosition = unit.scrollTop+(element.getBoundingClientRect().top)-30;
        let scrollToElement = window.setInterval(() => {
          var actualPosition = unit.scrollTop;
          if (oldScrollPosition > newScrollPosition && actualPosition > newScrollPosition) {
              unit.scrollTop = (actualPosition - 8);
          }else if(oldScrollPosition < newScrollPosition && actualPosition < newScrollPosition) {
            unit.scrollTop = (actualPosition + 8);
            if(actualPosition==unit.scrollTop){
              window.clearInterval(scrollToElement);
              this.animationstackRun();
            }
          }else{
              window.clearInterval(scrollToElement);
              this.animationstackRun();
          }
        }, 1);
      }else{
        this.animationstackRun();
      }
    });
  }
  goUnitNextPart(){
    this.animationNavigate=true;
    var part = this.partlist[this.activePartKey];
    this.router.navigate(['/'+this.resolveRoute(this.activeBook.bookid,"book")+'/'+this.resolveRoute(this.partlist[Number(this.activePartKey)+1].partid,"part")]);
    this.headerState='show';
    this.booktitleState='fixed_2';
    part.unitContainerState="nextpart";

    for(let key in this.partlist[Number(this.activePartKey)+1].chapterlist){
      this.partlist[Number(this.activePartKey)+1].chapterlistTitleState = "list";
    }
    this.transitionNextElementState = 'nextpart';
  }
  goUnitToUnitOtherPart(partKey, chapterKey){
    var actualUnit = document.getElementById("unit"+this.partlist[this.activePartKey].chapterlist[this.activeChapterKey].unitlist[this.activeUnitKey].unitid);
    var transitionParent = document.getElementById("transition_unit_to_unit");
    transitionParent.appendChild(actualUnit.cloneNode(true));
    this.renderer.setStyle(transitionParent.children[0].children[0], 'transform', 'translateY(-'+(actualUnit.scrollTop-30)+'px)');
    this.transitionUnitToUnitState = "slide_left";
    this.renderer.setStyle(transitionParent, 'display', 'block');

    var part_old = this.partlist[this.activePartKey];
    var part_new = this.partlist[partKey];
    
    part_old.partimagecontainerState = "slide_middle_na";
    part_new.partimagecontainerState = "slide_left_na";
    part_old.partregisterState="show";
    part_new.partregisterState="hide";
    part_old.partlistState = "hide";
    part_new.partlistState = "tile_down";

    this.activePartKey = partKey;
    this.activePartId = this.partlist[this.activePartKey].partid;
    this.activeChapterKey = chapterKey;
    this.activeChapterId = part_new.chapterlist[chapterKey].chapterid;


    for(let key in part_new.chapterlist){
      if(key == chapterKey){
        part_new.chapterlist[key].chapterlistTitleState = "list";
      }else{
        part_new.chapterlist[key].chapterlistTitleState = "hide";
      }
    }

    this.animationstackRun();
  }

  /* IMAGE HANDLERS */
  // showDoormanImages(){
  //   this.doormanContainerState = true;
  // }
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
      this.renderer.setStyle(previewImage,"height",this.windowHeight-containerMargin-sourceMarginTop-sourceLineHeight*sourceLines+"px");
      if(previewImage.getBoundingClientRect().width>this.windowWidth-containerMargin){
        this.renderer.setStyle(previewImage,"width",this.windowWidth-containerMargin+'px');
        this.renderer.removeStyle(previewImage,"height");
      }
      this.renderer.setStyle(previewSource,"width",previewImage.getBoundingClientRect().width+"px");
      if(previewSource.getBoundingClientRect().height/sourceLineHeight>sourceLines){
        sourceLines++;
      }else{
        console.log(previewImage.clientHeight, previewImage.clientHeight)
        this.imagePreview.datalink = this.replaceLinkDimensions(this.imagePreview.datalink, this.roundImageDimension(Math.max(previewImage.clientHeight, previewImage.clientWidth)))
        this.checkImagePreviewDimensionChecked = true;
      }
    }
  }


  goImagePreview(image){
    let imagePreview = {...image };
    if(imagePreview.imageState=='show'){
      let img = new Image();
      img.src = imagePreview.datalink;
      this.imagePreview = imagePreview;
      this.checkImagePreviewDimensionChecked = false;
      this.renderer.setStyle(document.getElementById("body"), 'filter', 'blur(30px)');
      this.renderer.setStyle(document.getElementById("body"), 'opacity', '0.5');
    }
  }

  goImagePreviewClose(){
    this.imagePreview = false;
    this.renderer.removeStyle(document.getElementById("body"), 'filter');
    this.renderer.setStyle(document.getElementById("body"), 'opacity', '1');
    window.clearTimeout(this.timeoutUnitBottom);
    this.unitBottom=false;
  }

  booklistImageDiashow(bookKey){
    var book = this.frontendService.booklist[bookKey];
    book.booklistImageDiashowTimeout = setTimeout(() =>  {
      this.booklistImageDiashowLoop(bookKey);
    }, 2000);
  }

  booklistImageDiashowLoop(bookKey){
    var book = this.frontendService.booklist[bookKey];
    if(book.imageLoop){
      if(book.images.length>1){
        book.actualimage++;
          if(book.images.length <= book.actualimage)book.actualimage=0;
          if(book.imageState1=='show'){
            book.imageState1 = 'hide;'
            book.imageState2 = 'show';
            book.image2 = book.images[book.actualimage];
          }else{
            book.imageState1 = 'show';
            book.imageState2 = 'hide';
            book.image1 = book.images[book.actualimage];
          }
          book.booklistImageDiashowTimeout = setTimeout(() => this.booklistImageDiashowLoop(bookKey), 5000);
      }
    }
  }

  partsToTile(){
    for (let key in this.partlist) {
      var part = this.partlist[key];
      part.partlistAnimationZIndex = this.partlist.length-Number(key)+1;
      if(key<this.activePartKey){
        part.partlistState = "tile_up";
      }else{
        part.partlistState = "tile_down";
      }
      if(key!=this.activePartKey){
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
  
  showChapterlist(){
    for (let key in this.partlist) {
      if(key==this.activePartKey&&this.animationstack.length==0){
        let i = 0;
        let fadeInChapter = window.setInterval(() => {
          if(this.partlist[this.activePartKey].chapterlist[i].chapterlistTitleState&&this.activeBookState != "unit"){
            this.partlist[this.activePartKey].chapterlist[i].chapterlistTitleState = "list";
          }else{
            window.clearInterval(fadeInChapter);
          }
          if(i>=this.partlist[this.activePartKey].chapterlist.length-1){
            window.clearInterval(fadeInChapter);
          }
          i++;
        }, 100);
      }else{
        for(let key2 in this.partlist[key].chapterlist){
          this.partlist[key].chapterlist[key2].chapterlistTitleState = "list";
        }
      }
    }
  }
  /* REFERENCE */
  

  /* UNIT EVENTS */
  unitClick(event){
    if(event.target.tagName=="SUP"){
      this.frontendService.unitShowReference(event);
    }
    if(event.target.classList[0]=="address"||event.target.parentNode.classList[0]=="address"){
      var target;
      if(event.target.classList[0]=="address") target = event.target;
      if(event.target.parentNode.classList[0]=="address") target = event.target.parentNode;
      if(target.children[0].id.indexOf("address_kollektiv")!=-1){
        let bookKey = this.getBookArrayKey(target.children[0].id.replace("address_kollektiv_",""));
        let bookname = this.booklist[bookKey].book
        window.open("https://www.cache.ch/impressum/"+bookname+"/autorinnenkollektiv", "_blank");
      }else{
        var partid="-1";
        var chapterid="-1";
        var unitid="-1";
        var elementid="-1";
        if(target.children[0])partid = target.children[0].id.replace("address_part_","");
        if(target.children[1])chapterid = target.children[1].id.replace("address_chapter_","");
        if(target.children[2])unitid = target.children[2].id.replace("address_unit_","");
        if(target.children[3])elementid = target.children[3].id.replace("address_element_","");
        this.navigateToElement(this.activeBook.bookid,partid,chapterid,unitid,elementid)
      }
    }
  }
  unitHideHeader(){
    this.headerState = "hide";
    this.animationstackRun();
  }
  unitHideNextPart(){
    this.animationUnitToNextPart = false;
    this.transitionNextElementState = 'hide';
  }
  showNextPart(){
    var part = this.partlist[this.activePartKey];
    var chapter = part.chapterlist[this.activeChapterKey];
    if(this.partlist[Number(this.activePartKey)+1]){
      if(this.megamenuState!="show"){
        this.animationUnitToNextPart = true;
        this.transitionNextElementState = 'bottom';
        this.transitionNextElementPart = this.partlist[Number(this.activePartKey)+1].partname;
        this.transitionNextElementImage = this.partlist[Number(this.activePartKey)+1].image1;
      }
    }else{
      this.navigateToElement(this.activePartKey.bookid);
    }
  }


  closeBooks(){
    this.partsToTile()
    for(let book of this.frontendService.booklist){
      this.resetBook(book)
    }

    let bookinfoElement = document.getElementById("book_info");
    if(bookinfoElement){
      this.renderer.removeStyle(bookinfoElement, 'display');
    }

    this.activeBookState = "book"
    this.headerState = 'show';
    this.bodyheightState = 'auto';
    this.booktitleState = 'fixed_1';
    this.megamenuState = 'hide';
    setTimeout(() => {
      if(document.getElementById("book")){
        document.getElementById("book").scrollTop = 0}
      }
    , 100)
    this.animationstackRun()
  
  }

  resetBook(book){
    let partlist = book.partlist;
    if(book.partlist){
      for (let part of partlist) {
        if(!this.frontendService.mobileVersion){
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

  openBook(bookid){
    var bookKey = this.getBookArrayKey(bookid);
    var book = this.frontendService.booklist[bookKey];
    this.activeBook = book;
    this.partlist = book.partlist;
    book.loadingPartData = 0;
    for (let part of this.partlist) {
      if(!book.dataLoaded){
        part.image1 = part.images[0].imagelink;
        if(part.images[1])part.image2 = part.images[1].imagelink;
        book.loadingPartData++;
        this.getPartData(part.partid, bookKey);
        part.actualimage = 0;
      }
    }
    this.resetBook(book)
  }

  /* NAVIGATION TOOL */

  // blockNavigate(miliseconds){
  //   this.navigationBlocked = true
  //   setTimeout(() => {
  //     this.navigationBlocked = true
  //   }, miliseconds/3)
  //   setTimeout(() => {
  //     this.navigationBlocked = true
  //   }, miliseconds/4)
  //   setTimeout(() => {
  //     this.navigationBlocked = true
  //   }, miliseconds/2)
  //   setTimeout(() => {
  //     this.navigationBlocked = false
  //   }, miliseconds)
  // }


  /* Handles every navigation only with given id's */
  navigateToElement(bookid='-1', partid='-1',chapterid='-1',unitid='-1',elementid='-1'){
    console.log(this.animationNavigate)
    if(!this.animationNavigate&&!this.navigationBlocked){
      if(bookid == 'about'){
        this.loadAbout()
        return
      }

      this.animationNavigate = true;
      this.showSearch = false;

      if(this.megamenuState=='show'){
        this.megamenuClose();
      }

      if(this.headerState=='mobile_open'){
        this.headerState="show";
      }

      if(bookid=="impressum"){
        this.navigateToImpressum(partid, chapterid!='autorinnenkollektiv')
      }else if(bookid=="blog"){
        this.navigateToBlog(partid)
      }else if(bookid=="-1"){
        this.navigateToDoorman()
      }else if(bookid=='materialarchiv'){
        this.navigateToMaterialArchive()
      }else{
        /* resolve url's from string to number if book */
        if(isNaN(Number(bookid))){
          bookid = this.solveRoute(bookid, "book");
        }
        if(isNaN(Number(partid))){
          partid = this.solveRoute(partid, "part");
        }
        if(isNaN(Number(chapterid))){
          chapterid = this.solveRoute(chapterid, "chapter");
        }
        if(isNaN(Number(unitid))){
          unitid = this.solveRoute(unitid, "unit");
        }

        var bookKey = this.getBookArrayKey(bookid);
        if(!this.frontendService.booklist||!bookKey){
          return false
        }

        var book = this.frontendService.booklist[bookKey];
        if(this.frontendService.booklist&&bookid!='-1'){
          if(this.activeState!='book'&&book&&this.activeBook&&(this.activeBook.bookid==book.bookid)&&book.open&&partid=='-1'){
            if(this.activeUnitId&&this.activeUnitId!=-1){
              this.animationNavigate = false;
              this.navigateToElement(this.activeBook.bookid, this.activePartId, this.activeChapterId, this.activeUnitId.toString())
              return
            }else if(this.activePartId&&this.activePartId!=-1){
              this.animationNavigate = false;
              this.navigateToElement(this.activeBook.bookid, this.activePartId)
              return
            }
          }
        }

          if(!this.activeBook||bookid!=this.activeBook.bookid){
            this.openBook(bookid)
          }
          var partKey = this.getPartArrayKey(partid, Number(bookid));
          var chapterKey;
          var unitKey;
          var unitLoaded = true;

          // GET PartKey 
          if(partid!="-1" && this.frontendService.booklist[bookKey]){
            var partKey = this.getPartArrayKey(partid);
            // Check if Partname is Editorial
            if(book.partlist[partKey]&&book.partlist[partKey].partname=="Editorial"){
              if(book.partlist[partKey].chapterlist[0]&&(!(this.activeBookState=="unit"&&this.activeChapterId==book.partlist[partKey].chapterlist[0].chapterid)||this.activeState=="impressum"||this.activeState=="blog")){
                chapterid = book.partlist[partKey].chapterlist[0].chapterid;
              }
            }
          }

          if(chapterid!='-1'){
            chapterKey = this.getChapterArrayKey(bookid,chapterid,Number(partKey));
            if(!this.partlist[partKey].chapterlist[chapterKey].unitlist){
              unitLoaded = false;
              this.waitFor(_ => this.partlist[partKey].chapterlist[chapterKey].unitlist).then(_ => {
                this.navigateToElement(bookid,partid,chapterid,unitid,elementid);
                return
              });
            }else{
              if(unitid=='-1'){
                unitid = book.partlist[partKey].chapterlist[chapterKey].unitlist[0].unitid;
              }
              unitKey = this.getUnitArrayKey(bookid, unitid, partKey, chapterKey);
            }
          }
          if(this.checkNavigateToElement(bookid,partid,chapterid,unitid,elementid)&&unitLoaded){
            this.unitBottom=false;
            this.animationstackClear();

            switch(this.activeState){
              case 'doorman':
              case 'blog':
              case 'impressum':
              case 'materialarchiv':
                if(true){
                  if(unitid!='-1'){
                    if(this.frontendService.mobileVersion){
                      if(this.activeState!="doorman"){
                        this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                        this.animationstackAdd("goLoaderBook",this.frontendService.booklist[bookKey].bookid);
                      }
                      this.mobileGoToUnit(bookKey, partKey, chapterKey, unitKey);
                    }else{
                      if(this.activeState!="doorman"&&this.activeState!="materialarchiv"){
                        this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                      }
                      this.animationstackAdd("goDoormanToElement", partKey, chapterKey);
                      this.animationstackAdd("goUnitToUnit", chapterKey, unitKey);
                      this.activeBookState = "unit";
                      this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")+'/'+this.resolveRoute(chapterid,"chapter")+'/'+this.resolveRoute(unitid,"unit")]);
                      if(elementid!='-1'){
                        this.animationstackAdd("goUnitToElement", elementid, unitid);
                        this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")+'/'+this.resolveRoute(chapterid,"chapter")+'/'+this.resolveRoute(unitid,"unit")+'/'+elementid]);
                      }
                    }
                  }else if(partid!="-1"){
                    if(this.frontendService.mobileVersion){
                      this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                      this.animationstackAdd("goLoaderBook",this.frontendService.booklist[bookKey].bookid);
                      this.mobileGoToPart(bookKey, partKey);
                    }else{
                      if(this.activeState!="doorman"&&this.activeState!="materialarchiv"){
                          this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                          this.animationstackAdd("goLoaderBook",this.frontendService.booklist[bookKey].bookid);
                      }else if (this.activeState=="materialarchiv"){
                        this.animationstackAdd("goHideMaterialArchive");
                      }else{
                        this.animationstackAdd("goHideDoorman");
                      }
                      this.animationstackAdd("goPartoverviewToPart", partid);
                      this.activeBookState = "part";
                      this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")]);
                    }
                  }else{
                    if(this.frontendService.mobileVersion){
                      if(this.activeState!="doorman"){
                        this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                        this.animationstackAdd("goLoaderBook",this.frontendService.booklist[bookKey].bookid);
                      }
                      this.mobileGoToBook(bookKey);
                    }else{
                      if(this.activeState!="doorman"&&this.activeState!="materialarchiv"){
                        this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                        this.animationstackAdd("goLoaderBook",this.frontendService.booklist[bookKey].bookid);
                      }else if (this.activeState=="materialarchiv"){
                        this.animationstackAdd("goHideMaterialArchive");
                      }else{
                        this.animationstackAdd("goHideDoorman");
                      }
                      this.activeBookState = "book";
                      this.router.navigate(['/'+this.resolveRoute(bookid,"book")]);
                    }
                  }
                }else{
                  if(this.activeState!="doorman"){
                    this.animationstackAdd("goLoader",this.frontendService.booklist[bookKey].bookname);
                    if(this.activeUnitId){
                      this.animationstackAdd("unitHideHeader");
                    }
                    this.animationstackAdd("goLoaderBook",this.frontendService.booklist[bookKey].bookid);
                  }
                  if(unitid!="-1"){
                    this.animationstackAdd("goDoormanToElement", partKey, chapterKey);
                    this.animationstackAdd("goUnitToUnit", chapterKey, unitKey);
                    this.activeBookState = "unit";
                    this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")+'/'+this.resolveRoute(chapterid,"chapter")+'/'+this.resolveRoute(unitid,"unit")]);
                    if(elementid!='-1'){
                      this.animationstackAdd("goUnitToElement", elementid, unitid);
                      this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")+'/'+this.resolveRoute(chapterid,"chapter")+'/'+this.resolveRoute(unitid,"unit")+'/'+elementid]);
                    }
                  }else{
                    if(this.activeState=="doorman"){
                      this.animationstackAdd("goHideDoorman");
                    }
                    if(this.activeState=="materialarchiv"){
                      this.animationstackAdd("goHideMaterialArchive");
                    }

                    if(partid!="-1"){
                      this.animationstackAdd("goPartoverviewToPart", partid);
                      this.activeBookState = "part";
                      this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")]);
                    }
                  }
                }
                if(this.activeState=="doorman"||this.activeState=="materialarchiv"){
                  this.activeState="book";
                }
                break;
              case 'book':
                if(bookid!=this.activeBook.bookid){
                  this.animationstackAdd("goBookToDoorman");
                  this.animationstackAdd("goHideDoorman");
                }
                if(unitid!='-1'){
                    if(this.frontendService.mobileVersion){
                      this.mobileGoToUnit(bookKey, partKey, chapterKey, unitKey);
                    }else{
                      switch(this.activeBookState){
                        case 'unit':
                          if(this.activeChapterKey&&unitid==this.partlist[this.activePartKey].chapterlist[this.activeChapterKey].unitlist[this.activeUnitKey].unitid){
                          }else if(this.activePartKey&&partid==this.partlist[this.activePartKey].partid){
                            this.animationstackAdd("goUnitToUnit", chapterKey, unitKey, false, (elementid!='-1'));
                          }else{
                            this.animationstackAdd("goUnitToUnitOtherPart", partKey, chapterKey);
                            this.animationstackAdd("goUnitToUnit", chapterKey, unitKey);
                          }
                          break;
                        case 'part': 
                          if(partid!=this.partlist[this.activePartKey].partid){
                            this.animationstackAdd("goPartToPart", partKey);
                          }
                          this.animationstackAdd("goPartToUnit", chapterid);
                          this.animationstackAdd("goUnitToUnit", chapterKey, unitKey, true, (elementid!='-1'));
                          break;
                        case "book":
                          this.animationstackAdd("goPartoverviewToPart", partid);
                          this.animationstackAdd("goPartToUnit", chapterid);
                          this.animationstackAdd("goUnitToUnit", chapterKey, unitKey, true, (elementid!='-1'));
                          break;
                      }
                    } 
                  this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")+'/'+this.resolveRoute(chapterid,"chapter")+'/'+this.resolveRoute(unitid,"unit")]);
                  if(elementid!='-1'){
                    this.animationstackAdd("goUnitToElement", elementid, unitid);
                    this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")+'/'+this.resolveRoute(chapterid,"chapter")+'/'+this.resolveRoute(unitid,"unit")+'/'+elementid]);
                  }

                }else if(partid!='-1'){
                  if(this.frontendService.mobileVersion){
                    this.mobileGoToPart(bookKey, partKey);
                  }else{
                    switch(this.activeBookState){
                      case 'unit':
                        this.animationstackAdd("goUnitToPart");
                        if(partid!=this.partlist[this.activePartKey].partid){
                          this.animationstackAdd("goPartToPart", partKey);
                        }
                        break;
                      case 'part':
                        if(partid!=this.partlist[this.activePartKey].partid){
                          this.animationstackAdd("goPartToPart", partKey);
                        }
                        break;
                      case "book":
                        this.animationstackAdd("goPartoverviewToPart", partid);
                        break;
                    }
                  }
                  this.router.navigate(['/'+this.resolveRoute(bookid,"book")+'/'+this.resolveRoute(partid,"part")]);
                }else if(bookid!='-1'){
                  if(this.frontendService.mobileVersion){
                    this.mobileGoToBook(bookKey);
                  }else{
                    this.router.navigate(['/'+this.resolveRoute(bookid,"book")]);
                    switch(this.activeBookState){
                      case 'unit':
                        this.animationstackAdd("goUnitToPart");
                        this.animationstackAdd("goPartToPartoverview");
                        break;
                      case 'part':
                        this.animationstackAdd("goPartToPartoverview");
                        break;
                    }
                  }
                  this.router.navigate(['/'+this.resolveRoute(bookid,"book")]);
                }
                break;
            }
          this.frontendService.booklist[bookKey].open = true;
        }
      }
    }      
    this.animationstackRun();
  }
  /* checks if an Element exists and is public */
  
  /* checks a given route, is fired every time the route changes */

  // /* HEADER LINKS */
  // goLoader(loaderText){
  //   this.headerLoaderText = loaderText;
  //   this.headerLoaderState = true;
  // }
  // goLoaderImpressum(){
  //   var time = false;
  //   this.timeoutUnitBottom = setTimeout(() => time=true, 1500);
  //   this.waitFor(_ => (this.impressumLoaded&&time)).then(_ => {
  //     if(this.activeState=="doorman"){
  //       this.animationstackAdd("goHideDoorman");
  //       this.animationstackRun();
  //     }
  //     this.headerState = "show";
  //     this.headerLoaderState = false;
  //     this.activeState="impressum";
  //   });
  // }
  // goLoaderBlog(){
  //   var time = false;
  //   this.timeoutUnitBottom = setTimeout(() => time=true, 1500);
  //   this.waitFor(_ => (this.blogLoaded&&time)).then(_ => {
  //     if(this.activeState=="doorman"){
  //       this.animationstackAdd("goHideDoorman");
  //       this.animationstackRun();
  //     }
  //     this.headerState = "show";
  //     this.headerLoaderState = false;
  //     this.activeState="blog";
  //   });
  // }
  // goLoaderBook(){
  //   var time = false;
  //   this.timeoutUnitBottom = setTimeout(() => time=true, 1500);
  //   this.waitFor(_ => (this.frontendService.booklistLoaded&&time)).then(_ => {
  //     this.headerLoaderState = false;
  //     this.activeState="book";
  //   });
  // }

  /* ANIMATION STACK */
  animationstackAdd(functionName, value1='', value2='', value3=false, value4=false){
    var functionObject = {
      functionName : functionName,
      value1: value1,
      value2: value2,
      value3: value3,
      value4: value4
    }
    this.animationstack.push(functionObject);
  }
  animationstackAddFront(functionName, value1='', value2=''){
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
    this.animationNavigate = false;
    this.animationstackRun();
  }
  animationstackRun(){
    this.waitFor(_ => this.frontendService.booklistLoaded).then(_ => {
      if(this.animationstack[0]){
        var firstFunction = this.animationstack[0];
        var functionName = firstFunction.functionName;
        if(this[functionName]) {
          let value1 = String(firstFunction.value1);
          let value2 = String(firstFunction.value2);
          let value3 = firstFunction.value3;
          let value4 = firstFunction.value4;
          this.animationstack.shift();
          if(value4){
            this[functionName](value1,value2,value3,value4);
          }else if(value3){
            this[functionName](value1,value2,value3);
          }else if(value2!=''){
            this[functionName](value1,value2);
          }else if(value1!=''){
            this[functionName](value1);
          }else{
            this[functionName]();
          }
        }
      }else{
        this.animationNavigate = false;
      }
    });
  }

  /* INTERACTIONS */

  openImpressumBook(bookid, authors_collective=false){
    var bookKey = this.getBookArrayKey(bookid);
    if(!this.frontendService.booklist[bookKey].impressumShow){
      this.frontendService.booklist[bookKey].impressumShow = true;
      setTimeout(() => this.openImpressumBook(bookid, authors_collective), 500);
    }else{
      let impressum_book = document.getElementById("impressum_book_"+bookid)
      if(authors_collective){
        impressum_book = document.getElementById("impressum_book_kollektiv_"+bookid)
      }
      if (typeof(impressum_book) != 'undefined' && impressum_book != null){
        let impressum = document.getElementById("impressum")
        impressum.scrollTo({top: impressum_book.offsetTop, behavior: 'smooth'});
      }else{
        setTimeout(() => this.openImpressumBook(bookid, authors_collective), 500);
      }

    }
  }

  
  /* MOBILE FUNCTIONS */

  openMenuMobile(){
    if(this.headerState=='show'){this.headerState='mobile_open'}
    else if(this.headerState=='mobile_open'){this.headerState='show'};
  }
  mobileGoToDoorman(){
    this.showDoormanImages();
    this.doormanState="show";
  }
  mobileGoToPart(bookKey, partKey){
    if(this.activeState=='doorman'){
      this.goHideDoorman(bookKey);
    }
    this.mobilePartoverviewState=false;
    this.mobilePartState=true;
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
    this.headerState="show";
    this.mobileChapterheaderState="show";
    this.partlistImageDiashow(partKey);
    for (let key in this.partlist) {
      if(partKey>key){
        if(this.activeBookState!='part'){
          this.partlist[key].chapterContainerState = 'up_na';
        }else{
          this.partlist[key].chapterContainerState = 'up';
        }
      }else if(partKey<=key){
        if(this.activeBookState!='part'){
          this.partlist[key].chapterContainerState = 'down_na';
        }else{
          this.partlist[key].chapterContainerState = 'down';
        }
      }
    }
    this.activeBookState='part';
    setTimeout(() => this.activePartKey=partKey, 1000);
  }
  mobileGoToBook(bookKey){
    this.activeBookState='book'
    this.goHideDoorman(bookKey);
    this.mobilePartoverviewState=true;
    this.mobilePartState=true;
    this.headerState="show";
    this.mobileChapterheaderState="show";
    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);
  }
  mobileGoToUnit(bookKey, partKey, chapterKey, unitKey){
    if(this.directLink){
      this.timeoutUnitBottom = setTimeout(() => this.doormanState="hide", 1000);
    }
    this.megamenuState='hide';
    this.mobilePartoverviewState=false;
    this.mobilePartState=false;
    this.mobileUnitState=true;
    this.activePartKey=partKey;
    this.activeChapterKey = chapterKey;
    this.activeUnitKey = unitKey;
    var part = this.partlist[partKey];
    this.activeUnitId = part.chapterlist[this.activeChapterKey].unitlist[this.activeUnitKey].unitid;
    this.activeChapterId = part.chapterlist[this.activeChapterKey].chapterid;

    window.clearTimeout(this.animationImageDiashow);
    window.clearTimeout(this.animationImageDiashowLoop);

    this.waitFor(_ => part.chapterlist[chapterKey]).then(_ => {
      this.waitFor(_ => part.chapterlist[chapterKey].unitlist).then(_ => {
        this.animationNavigate=false;
        for(let key in part.chapterlist){
          for(let key2 in part.chapterlist[key].unitlist){
            if(key<chapterKey||(key==chapterKey&&key2<unitKey)){
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
        if(this.activeBookState!="unit"){
          var unit = this.partlist[this.activePartKey].chapterlist[this.activeChapterKey].unitlist[this.activeUnitKey];
          this.waitFor(_ => unit).then(_ => {
            this.waitFor(_ => document.getElementById("unit"+unit.unitid)).then(_ => {
              document.getElementById("unit"+unit.unitid).scrollTop=0;
            });
          });
          if(unitKey==0){
            part.chapterlist[chapterKey].unitlist[0].unitContainerState = "show_first";
          }else{
            this.headerState="hide";
            this.mobileChapterheaderState="fixed";
          }
        }else{
          this.headerState="hide";
          this.mobileChapterheaderState="fixed";
        }
        this.activeBookState='unit';
      });
    });
  }
  mobileClickArrow(chapterKey, unitKey, add){
    unitKey = Number(unitKey)+add;
    var part = this.partlist[this.activePartKey];
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
        this.navigateToElement(this.activeBook.bookid, part.partid);
      }else{
        this.navigateToElement(this.activeBook.bookid, part.partid, part.chapterlist[chapterKey].chapterid, part.chapterlist[chapterKey].unitlist[part.chapterlist[chapterKey].unitlist.length-1].unitid);
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

      if(chapterKey>this.partlist[this.activePartKey].chapterlist.length-1){
        if((Number(this.activePartKey)+1)>this.partlist.length-1){
          this.navigateToElement(this.activeBook.bookid);
        }else{
          this.navigateToElement(this.activeBook.bookid, String(this.partlist[Number(this.activePartKey)+1].partid));
        }
      }else{
        this.navigateToElement(this.activeBook.bookid, part.partid, part.chapterlist[chapterKey].chapterid, part.chapterlist[chapterKey].unitlist[0].unitid);
      }
    }else{
      this.navigateToElement(this.activeBook.bookid, part.partid, part.chapterlist[chapterKey].chapterid, part.chapterlist[chapterKey].unitlist[unitKey].unitid);
    }
  }



}
