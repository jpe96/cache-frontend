import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FrontendService } from '../frontend/frontend.service';
import { AuthenticationService } from  '../authentication/authentication.service';
@Component({
  selector: 'app-materialarchiv',
  templateUrl: './materialarchiv.component.html',
  styleUrls: ['./materialarchiv.component.css'],
  animations: [
    trigger('fade', [
      transition( ':enter', [
          style({ opacity: 0 }),
          animate('500ms ease-out', 
                  style({ opacity: 1 }))
        ]
      ),
      transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms ease-in', 
                  style({ opacity: 0 }))
        ]
      )
    ]),
    trigger('materialarchivAnimation', [
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
    trigger('fadeLoaded', [
      state('show', style({
        opacity: '1',
        width: 'auto'
      })),
      state('*', style({
        opacity: '0',
        width: '0'
      })),
      transition('* <=> show', [
        animate('0.3s')
      ]),
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
  ]
})
export class MaterialarchivComponent implements OnInit {
  constructor(
    public frontendService: FrontendService,
    private authenticationService: AuthenticationService,
  ) { }

  activeStateSubscription: any;
  touchstartX: any;
  touchstartY: any;
  touchendX: any;
  touchendY: any;

  currentUser: any;
  ngOnInit() {
    this.currentUser = this.authenticationService.getcurrentUser();
    this.activeStateSubscription = this.frontendService.getActiveState().subscribe((data) => {
      this.activeStateChange(data);
    });
    window.addEventListener('keydown', this.handleKeyboardEvent, true);
    if(this.frontendService.mobileVersion){
      this.carpetRows = 2
    }
    window.addEventListener('touchstart', this.handleTouchStart, true);
    window.addEventListener('touchend', this.handleTouchEnd, true);
  }


  


  ngOnDestroy() {
    this.activeStateSubscription.unsubscribe();
    window.removeEventListener('keydown', this.handleKeyboardEvent, true);
  }

  handleKeyboardEvent = (event): void => {
    if(this.showPreview){
      var key = event.which || event.keyCode;
      switch (key){
        case 39:
          this.changePreviewElement(+1)
        break;
        case 37:
          this.changePreviewElement(-1)
        break;
      }
    }
  }

  handleTouchStart = (event): void => {
    if(this.frontendService.mobileVersion){
      this.touchstartX = event.changedTouches[0].screenX;
      this.touchstartY = event.changedTouches[0].screenY;
    }
  }

  handleTouchEnd = (event): void => {
    if(this.frontendService.mobileVersion){
      this.touchendX = event.changedTouches[0].screenX;
      this.touchendY = event.changedTouches[0].screenY;
      var deltaX = this.touchendX - this.touchstartX;
      var deltaY = this.touchendY - this.touchstartY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 50) {
            if(this.showPreview){
              this.changePreviewElement(-1)
            }
          } else if (deltaX < -50) {
            if(this.showPreview){
              this.changePreviewElement(+1) 
            }
          }
      }
    }
  }



  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(document.getElementById("materialarchiv_carpet")){
      this.calculateLineHeight()
    }
    if(document.getElementById("materialarchiv_preview")){
      this.calculatePreviewElementHeight()
    }
  }

  carpetRows:number = 4;
  carpetAddElementsStop:boolean = false;
  carpetElementsPerColumnAdd: number = 3
  carpetElementsLength: number = 0;
  carpetTextNumberLines:number = 0
  carpetTextHeight:number = 0
  carpetLoadNewDataBlocked:boolean = false
  carpetLoadNewDataDistance:number = 500;
  carpetPreviewRoute:string = ""
  carpetPreviewRouteShow:boolean = false
  carpetIsZooming:boolean = false;
  elementPreviewData:any;
  elementPreviewRoute:string = ''
  filterShowImages:boolean = true;
  filterShowText:boolean = true;
  filterShowVideos:boolean = true;
  filterShowAudio:boolean = true;
  filterShowBookid:number = 0;
  materialarchivState:string = 'hide';
  materialarchivData:any;
  materialarchivDataSplit:any;
  materialarchivAlreadyShown:boolean = false;
  zoomStateIn:boolean = false
  closeMaterialarchivBlocker:boolean = false;
  reshuffle_first_time:boolean = true;
  showMaterialarchivMenu:boolean = true;

  activeStateChange(state){
    if(state=="materialarchiv"){
      this.materialarchivState = 'show'
      this.closeMaterialarchivBlocker = false
      if(!this.materialarchivAlreadyShown){
        this.materialarchivAlreadyShown = true
        this.frontendService.waitFor(_ => this.frontendService.booklistLoaded, 20000).then(_ => {
          this.frontendService.waitFor(_ => document.getElementById("materialarchiv_carpet"), 20000).then(_ => {
            this.getMaterialarchivData()
            this.calculateLineHeight()
          });
        }).catch(error => {
          console.error('Timeout exceeded:', error.message);
        });

      }
      this.frontendService.waitFor(_ => document.getElementById("materialarchiv")).then(_ => {
        document.getElementById("materialarchiv").scrollTo({ top: 0, behavior: 'smooth' });
      })
    }else{
      setTimeout(() => {
        this.materialarchivState = 'hide'
      }, 500)
    }
  }

  getMaterialarchivData(){
    let datatext_max_characters = 400
    this.materialarchivData = []
    let datanumber = 0
    for(let book of this.frontendService.booklist){
      if(this.filterShowBookid == 0 || this.filterShowBookid == book.bookid){
        for(let part of book.partlist){
          for(let chapter of part.chapterlist){
            if(chapter.chapterweb==1){
              for (let unit of chapter.unitlist){
                for(let data of unit.datalist){
                  // if(data.datatype==1&&data.datalayout!=0&&this.filterShowText ||
                  //    data.datatype==2&&this.filterShowImages ||
                  //    data.datatype==3&&this.filterShowAudio ||
                  //    (data.datatype==4||data.datatype==6)&&this.filterShowVideos){
                  if(data.datatype==1){
                    // let split_quote = data.datatext.split('«', 1)
                    // if(split_quote.length>1){
                    //   data.datatextpreview = split_quote[0] + "«"
                    // }else{
                    //   let splits = [data.datatext.split('. ', 1)[0]+".", data.datatext.split('? ', 1)[0]+"?", data.datatext.split('! ', 1)[0]+"!"]
                    //   let lgth = 0
                    //   for (var i = 0; i < splits.length; i++) {
                    //     if (splits[i].length > lgth) {
                    //       lgth = splits[i].length;
                    //       data.datatextpreview = splits[i];
                    //     }
                    //   }
                    // }
                    if(data.datalayout==0){
                      continue;
                    }
                    data.datatextpreview = data.datatext;
                    if (data.datatextpreview.length>datatext_max_characters){
                      data.datatextpreview = data.datatextpreview.substr(0, datatext_max_characters) + "\u2026";
                    }
                  }else if(data.datatype==2){
                    data.datalink = data.datalink.replace('w_1280', 'w_640')
                    datanumber++
                  }else{
                    continue;
                  }

                  // if(data.datatype==4||data.datatype==6){
                  //   break dataLoop
                  //   if(!data.datareplacement_image||data.datareplacement_image==""){
                  //     break dataLoop
                  //   }
                  //   data.datareplacement_image_small = data.datareplacement_image
                  //   let splited = data.datareplacement_image_small.split("/")
                  //   let popped = splited.pop();
                  //   data.datareplacement_image_small = splited.join("/") + "/web/w_640/" + popped
                  // }
                  data.bookid = book.bookid
                  data.partid = part.partid
                  data.chapterid = chapter.chapterid
                  data.unitid = unit.unitid
                  data.show = false
                  data.loaded = false
                  data.route = book.bookname.toUpperCase() + " / " + part.partname.toUpperCase() + " / " + chapter.chaptername.toUpperCase() + " / " +  unit.unitname
                  this.materialarchivData.push(data)
                }
              }
            }
          }
        }
      }
    }
    console.log(datanumber)
    this.reshuffle()
  }

  materialarchivAnimationDone(event){
    this.frontendService.animationNavigate = false
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array]; // Create a copy of the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  }

  createImageTextRatio(dataArray:any){
    let dataRatio = []
    let image_text_split = 5
    let image_count = 0
    let add_text = false

    for(let data of dataArray){
      if(data.datatype==1){
        if(add_text){
          dataRatio.push(data)
          add_text = false
        }
      }else{
        if(!add_text){
          dataRatio.push(data)
          image_count += 1
          if(image_count==image_text_split){
            image_count = 0
            add_text = true
          }
        }
      }
    }
    return dataRatio
  }

  reshuffle(){
    for(let data of this.materialarchivData){
      data.show = false
      data.loaded = false
    }
    this.materialarchivDataSplit = this.splitArrayIntoParts(this.createImageTextRatio(this.shuffleArray(this.materialarchivData)), this.carpetRows)
    for(let split of this.materialarchivDataSplit){
      split.carpetElementsPerColumn = 0
    }
    this.carpetElementsLength = this.materialarchivDataSplit[0].length
    this.carpetAddElementsStop = false
    if(!this.reshuffle_first_time){
      this.rotate_icon()
    }
    this.reshuffle_first_time = false
    //this.zoomOutNoTransition();
    setTimeout(() => {this.checkCarpetNumberOfElementsLoop()}, 200)
  }

  rotate_icon(){
    document.getElementById("materialarchiv_menu_rotate_icon").classList.add("materialarchiv_menu_rotate_animate");
    setTimeout(() => {
      document.getElementById("materialarchiv_menu_rotate_icon").classList.remove("materialarchiv_menu_rotate_animate")
    }, 1100)
  }

  splitArrayIntoParts<T>(array: T[], parts: number): T[][] {
    const partSize = Math.ceil(array.length / parts);
    const splitArray: T[][] = [];
  
    for (let i = 0; i < array.length; i += partSize) {
      splitArray.push(array.slice(i, i + partSize));
    }
  
    return splitArray;
  }

  calculateLineHeight(){
    let numberRows = 5
    let distanceRows = 12
    let lineHeight = 28
    let carpetHeight = document.getElementById("materialarchiv_carpet").offsetHeight
    let rowHeight = (carpetHeight - (numberRows-1)*distanceRows) / numberRows
    this.carpetTextNumberLines = Math.floor(rowHeight/lineHeight)
    this.carpetTextHeight = this.carpetTextNumberLines*lineHeight
  }
  
  checkCarpetNumberOfElements(){
    let carpet = document.getElementById("materialarchiv_carpet")
    let i = 0;
    if(!this.carpetAddElementsStop){
      carpet.querySelectorAll('.materialarchiv_carpet_column').forEach(row => {
        if (row instanceof HTMLElement) {
          if(carpet.scrollTop + carpet.offsetHeight + this.carpetLoadNewDataDistance > row.offsetHeight){
            if(!this.materialarchivDataSplit[i].addElementsBlocked){
              this.materialarchivDataSplit[i].carpetElementsPerColumn += this.carpetElementsPerColumnAdd
              this.checkCarpetElementsShow(this.materialarchivDataSplit[i], this.materialarchivDataSplit[i].carpetElementsPerColumn-this.carpetElementsPerColumnAdd)
              this.materialarchivDataSplit[i].addElementsBlocked = true
            }
            if(this.materialarchivDataSplit[i].carpetElementsPerColumn > this.carpetElementsLength){
              this.carpetAddElementsStop = true
            }
          };
        }
        i++;
      });
    }
  }

  checkCarpetNumberOfElementsLoop(){
    let carpet = document.getElementById("materialarchiv_carpet")
    if(carpet){
      let i = 0;
      let oneUpdated = false;
      carpet.querySelectorAll('.materialarchiv_carpet_column').forEach(row => {
        if (row instanceof HTMLElement) {
          if(carpet.offsetHeight + this.carpetLoadNewDataDistance > row.offsetHeight){
            if(!this.materialarchivDataSplit[i].addElementsBlocked){
              this.materialarchivDataSplit[i].carpetElementsPerColumn += this.carpetElementsPerColumnAdd
              this.checkCarpetElementsShow(this.materialarchivDataSplit[i], this.materialarchivDataSplit[i].carpetElementsPerColumn-this.carpetElementsPerColumnAdd)
              this.materialarchivDataSplit[i].addElementsBlocked = true
            }
            oneUpdated = true
          };
        }
        i++;
      });
      if(oneUpdated){
        setTimeout(() => {this.checkCarpetNumberOfElementsLoop()}, 500)
      }
    }
  }

  checkCarpetElementsShow(split, index){
    if(split?.[index]&&index<split.carpetElementsPerColumn){
      let data = split[index]
      if(!data.show){
        data.show=true
        this.checkCarpetElementsShowTimeout(split, index, 100)
      }else{
        if(data.datatype==2){
          if(!data.loaded){
            this.checkCarpetElementsShowTimeout(split, index, 100)
          }else{
            this.checkCarpetElementsShowTimeout(split, index+1, 100)
          }
        }else{
          this.checkCarpetElementsShow(split, index+1)
        }
      }
    }else{
      split.addElementsBlocked = false
    }
  }

  checkCarpetElementsShowTimeout(split, index, timeout){
    setTimeout(() => {this.checkCarpetElementsShow(split, index)}, timeout)
  }

  zoomFactor = 1.34
  zoomIn(){
    if(!this.zoomStateIn&&!this.carpetIsZooming&&!this.frontendService.mobileVersion){
      this.zoomDisableScroll()
      this.carpetIsZooming = true
      this.zoomStateIn = true
      let carpet = document.getElementById("materialarchiv_carpet")
      let carpet_inner = document.getElementById("materialarchiv_carpet_inner")

      carpet_inner.style.transformOrigin = carpet.scrollLeft+"px " +carpet.scrollTop+"px"
      carpet_inner.style.transform = "scale("+this.zoomFactor.toString()+")"
      let carpet_scroll_top = carpet.scrollTop
      setTimeout(() => {
        carpet_inner.style.transformOrigin = "0 0"
        carpet.scrollTop = carpet_scroll_top*(this.zoomFactor)
        this.carpetIsZooming = false
        this.zoomEnableScroll()
      },
      1500)
    }
  }
  zoomOut(){
    if(this.zoomStateIn&&!this.carpetIsZooming&&!this.frontendService.mobileVersion){
      this.zoomDisableScroll()
      this.zoomStateIn = false
      this.carpetIsZooming = true 
      let carpet = document.getElementById("materialarchiv_carpet")
      let carpet_inner = document.getElementById("materialarchiv_carpet_inner")
      let carpet_scroll_top = carpet.scrollTop
      carpet_inner.style.transformOrigin = carpet.scrollLeft+"px " + carpet_scroll_top/(this.zoomFactor-1)+"px"
      carpet.scrollTop = 0
      carpet_inner.style.transform = "translateY(-"+carpet_scroll_top/this.zoomFactor+"px) scale(1)"
    
      setTimeout(() => {
        carpet_inner.style.transition = "none"
        carpet.scrollTop = carpet_scroll_top/this.zoomFactor
        carpet_inner.style.transform = "translateY(0px) scale(1)"
        setTimeout(() => {
          carpet_inner.style.transition = "transform 1.5s"
          this.carpetIsZooming = false
          this.zoomEnableScroll()
        },
        100)
      },
      1500)
    
    }
  }

  zoomOutNoTransition(){
    let carpet_inner = document.getElementById("materialarchiv_carpet_inner")
    carpet_inner.style.transition = "none";
    carpet_inner.style.transform = "translateY(0px) scale(1)"
    document.getElementById("materialarchiv_carpet").scrollTop = 0
    setTimeout(() => {
      carpet_inner.style.transition = "transform 1.5s";
    }, 400)
  }

  zoomPreventScroll(e){
    e.preventDefault();
    e.stopPropagation();

    return false;
  }

  zoomDisableScroll(){
    document.getElementById("materialarchiv_carpet").addEventListener('wheel', this.zoomPreventScroll);
  }

  zoomEnableScroll(){
    document.getElementById("materialarchiv_carpet").removeEventListener('wheel', this.zoomPreventScroll);
  }

  showCarpetPreviewRoute(dataRoute){
    this.carpetPreviewRoute = '▶&nbsp;'+dataRoute
    this.carpetPreviewRouteShow = true
  }

  hideCarpetPreviewRoute(){
    this.carpetPreviewRouteShow = false
  }

  showPreview: boolean = false
  showPreviewLoader: boolean = false
  showPreviewLoaderIcon: boolean = false

  openPreview(data, i, i_parent){
    this.showPreview = true
    this.elementPreviewData = data
    this.elementPreviewData.i = i
    this.elementPreviewData.i_parent = i_parent
    this.elementPreviewData.route = data.route
    this.elementPreviewData.loaded = false
    if(data.datatype==2){
      this.elementPreviewData.datalink = this.elementPreviewData.datalink.replace('w_640', 'w_1920')
      setTimeout(() => {
        if(!this.elementPreviewData.loaded){
          this.showPreviewLoader = true
          setTimeout(() => {
            this.showPreviewLoaderIcon = true
          }, 100)
        }
      }, 800)
    }else{
      setTimeout(() => {
        this.elementPreviewData.loaded = true
      }, 100)
    }
    setTimeout(() => {
      this.calculatePreviewElementHeight()
    }, 100)
  }

  closePreview(){
    this.showPreview = false
    this.showPreviewLoader = false
    this.showPreviewLoaderIcon = false
  }

  changePreviewElement(index_change){
    let i = this.elementPreviewData.i
    let materialarchivDataSplit = this.materialarchivDataSplit[this.elementPreviewData.i_parent]

    let new_parent_id = this.elementPreviewData.i_parent + index_change
    let new_data_id = this.elementPreviewData.i
    let rows = 3 - Number(this.zoomStateIn)
    if(this.frontendService.mobileVersion){
      rows = 1
    }
    if (new_parent_id < 0){
      new_parent_id = rows
      new_data_id -= 1
    }else if(new_parent_id > rows){
      new_data_id += 1
      new_parent_id = 0
    }
    if(new_data_id<0 || new_data_id>materialarchivDataSplit.length){
      return
    }
    this.elementPreviewData.transitioning = true
    this.showPreviewLoaderIcon = false
    setTimeout(()=>{
      this.openPreview(this.materialarchivDataSplit[new_parent_id][new_data_id], new_data_id, new_parent_id)
      setTimeout(()=>{
        this.elementPreviewData.transitioning = false
      }, 500)
    }, 500)

  }


  calculatePreviewElementHeight(){
    this.frontendService.waitFor(_ => document.getElementById("materialarchiv_preview_element_container")&&document.getElementById("materialarchiv_preview_element")).then(_ => {
      let materialarchiv_preview_element = document.getElementById("materialarchiv_preview_element")

      let sourceHeight = 0
      if(document.getElementById("materialarchiv_preview_source")){
        sourceHeight = document.getElementById("materialarchiv_preview_source").offsetHeight + Number(document.getElementById("materialarchiv_preview_source").style.marginBottom.replace("px", ""))
      }
      let routeHeight = document.getElementById("materialarchiv_preview_route").offsetHeight + Number(document.getElementById("materialarchiv_preview_route").style.marginBottom.replace("px", ""))
      let elementMargin = 35
      let elementMaxHeight = document.getElementById("materialarchiv_preview_element_container").offsetHeight - routeHeight - elementMargin - sourceHeight
      

      if(this.elementPreviewData.datatype==1){
        let lineHeight = 48
        if(this.frontendService.mobileVersion){
          lineHeight = 26
        }
        materialarchiv_preview_element.style.height = "auto";
        materialarchiv_preview_element.style.webkitLineClamp = "1000"
        materialarchiv_preview_element.style.textAlign = "left"
        this.elementPreviewData.textLines = Math.floor(elementMaxHeight/lineHeight)
        if(materialarchiv_preview_element.offsetHeight>elementMaxHeight){
          materialarchiv_preview_element.style.webkitLineClamp = String(this.elementPreviewData.textLines)
          materialarchiv_preview_element.style.height = this.elementPreviewData.textLines*lineHeight+4 + "px"
        }else{
          this.elementPreviewData.textLines = Math.floor(document.getElementById("materialarchiv_preview_element").offsetHeight/lineHeight)
        }
        if(this.elementPreviewData.textLines==1){
          materialarchiv_preview_element.style.textAlign = "center"
        }
        materialarchiv_preview_element.style.marginTop = (elementMaxHeight-materialarchiv_preview_element.offsetHeight)/2 + "px"
      }else if(this.elementPreviewData.datatype==2){
        if(this.frontendService.mobileVersion){

          let materialarchiv_preview_image_hidden = document.getElementById("materialarchiv_preview_image_hidden")
          materialarchiv_preview_image_hidden.style.display = "block"
          materialarchiv_preview_image_hidden.style.width = "100%"
          materialarchiv_preview_element.style.height = "auto"
          materialarchiv_preview_image_hidden.style.marginTop = "0px"
          if (materialarchiv_preview_image_hidden.offsetHeight>elementMaxHeight){
            materialarchiv_preview_image_hidden.style.width = (elementMaxHeight/materialarchiv_preview_image_hidden.offsetHeight)*100 + "%"
          }else{
            materialarchiv_preview_image_hidden.style.marginTop = (elementMaxHeight - materialarchiv_preview_image_hidden.offsetHeight) / 2 + "px"
          }
        }else{
          materialarchiv_preview_element.style.height = elementMaxHeight + "px"
        }
      }

    })
  }

  getImageSize(backgroundUrl){
    var image = new Image();
    image.src = backgroundUrl;

    image.onload = function () {
      var width = image.width,
        height = image.height;
      alert('width =' + width + ', height = ' + height);
    };
  }

  openElementPreviewInBook(){
    this.frontendService.openBook(this.elementPreviewData.bookid, this.elementPreviewData.partid, this.elementPreviewData.chapterid,
      this.elementPreviewData.unitid, this.elementPreviewData.dataid)
  }

  closeMaterialarchiv(){
    if(!this.closeMaterialarchivBlocker){
      this.closeMaterialarchivBlocker = true
      this.frontendService.openLastRoute()
    }
  }

}
