import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ContentService } from './content.service';
import { InfoService } from '../info/info.service';
import { Router } from '@angular/router';
import { AlertService } from "../alert/alert.service";
import { AuthenticationService } from '../authentication/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppConstants } from '../config/constants';
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css','../app.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ]),
    trigger('fadeNoOut', [      
      transition(':enter', [
        style({ opacity: '0' }),
        animate(300)
      ]),
      transition(':leave', [
        animate(1, style({ opacity: '0' }))
      ]),
      state('*', style({ opacity: '1' })),
    ]),
    trigger('toggle', [      
      transition(':enter', [
        style({ height: '0px' }),
        animate(200)
      ]),
      transition(':leave', [
        animate(200, style({ height: '0px' }))
      ]),
      state('*', style({ height: '*' })),
    ]),
  ]
})

export class ContentComponent implements OnInit {

  @ViewChild('iframe') iframe: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private ContentService: ContentService,
    private InfoService: InfoService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public datepipe: DatePipe
  ) {
    this.previewElementURL = AppConstants.restURL;
    
    };

    showEditAuthors = false;
  
    extraButtonParagraph = {
      name: 'icon_paragraph',
      icon: 'paragraph',
      exec: function (editor) {
        editor.selection.insertHTML("&#182;");
      }
    };

    extraButtonSilbbreak = {
      name: 'icon_silbbreak',
      icon: 'hr',
      exec: function (editor) {
        editor.selection.insertHTML("&#9476;");
      }
    };

    extraButtonIndent = {
      name: 'icon_indent',
      icon: 'indent',
      exec: function (editor) {
        editor.selection.insertHTML("<div style='margin-left:15pt'>"+editor.selection.getHTML()+"</div>");
      }
    }
    extraButtonOutdent = {
      name: 'icon_outdent',
      icon: 'outdent',
      exec: function (editor) {
        editor.selection.insertHTML(editor.selection.getHTML().replace(/<div style="margin-left:15pt">([^"]*)<\/div>/gm,'$1'));
      }
    }

    extraButtonAddline = {
      name: 'addline',
      icon: 'addrow',
      exec: function (editor) {
        editor.selection.insertHTML("&#8676;");
      }
    }

    jodit_config = {
      style: {
        fontFamily: 'Gerstner',
      },
      buttons: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      buttonsMD: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      buttonsSM: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      buttonsXS: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      enter: 'BR',
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_only_text",
      spellcheck: false,
      toolbarSticky: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      disablePlugins: 'autofocus,backspace,imageProcessor,imageProperties,sticky,stat,xpath,tooltip',
      extraButtons: [this.extraButtonParagraph, this.extraButtonSilbbreak, this.extraButtonAddline]
    };

    jodit_config_replic = {
      buttons: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      buttonsMD: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      buttonsSM: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      buttonsXS: 'source,fullsize,italic,link,superscript,|,undo,redo,eraser,|',
      enter: 'BR',
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_only_text",
      spellcheck: false,
      toolbarSticky: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      disablePlugins: 'autofocus,backspace,imageProcessor,imageProperties,sticky,stat,xpath,tooltip',
      extraButtons: [this.extraButtonParagraph, this.extraButtonSilbbreak, this.extraButtonIndent, this.extraButtonOutdent, this.extraButtonAddline]
    };

    jodit_config_reference = {
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      showPlaceholder: true,
      placeholder: 'Gib hier die Referenz ein.',
      preset: 'inline',
      enter: 'br',
      wrapNodes: false,
      popup: {
        "selection": ['italic', this.extraButtonParagraph, this.extraButtonSilbbreak]
      },
      disablePlugins: 'autofocus,backspace,imageProcessor,imageProperties,sticky,stat,xpath,tooltip',
    };

  previewElementURL : String;
  previewElementLink : String = '';
  previewElementFileLink: String = '';
  previewElementSettings: boolean = false;
  previewElementFirstpage: number;
  previewElementLastpage: number;

  previewListpart : any;
  previewListchapter : any;
  previewListunit : any;
  previewListreplic : any;
  previewListType: String;
  previewListList: any = Array();
  previewListFirstpage: number;
  previewListLastpage: number;
  previewListId: any;
  previewListReplacecontent: boolean;

  state = 'inital';
  depth : number = 0;
  bookPermission : number;
  currentUser : any;
  
  unsavedContent : boolean = false;
  deletepartForm : boolean = false;
  deleteunitForm : boolean = false;

  bookList : any;
  partList : any;
  chapterList : any;
  unitList : any;
  data : any = false;
  replic : any = false;
  dataSorted : any = [];
  replicSorted : any = [];
  dataLength : number = 0;
  replicLength : number = 0;
  book : any = false;
  activepart : any = false;
  activechapter : any = false;
  activeunit : any = false;

  replicSelectedBook: number = 0;

  authorList : any;
  activeauthor : any = false;
  authorlistchapter: any;

  showEditPart: boolean = true;
  showEditChapter: boolean = true;
  showEditUnit: boolean = true;
  showEditContent: boolean = true;
  showSelect: boolean = true;
  showEditEpilogfurtherreadings: boolean = true;
  deletechapterForm: boolean = false;
  showImagesPart: boolean = true;
  showAttachementsPart: boolean = true;
  showEditFurtherreadings: boolean = true;
  showEditEditorial: boolean = true;
  showEditAbstract: boolean = true;
  showBookPdf: boolean = false;
  showChapterPDF: boolean = true;
  deleteChapterPDFShow: boolean = false;
  deleteBookPDFShow:boolean = false;
  showEditorialInformation:boolean = false;
  deleteCoverShow:boolean = false;
  deleteTwitterShow:boolean = false;
  showAuthorEpilog:boolean = true;
  showAboutCacheText:boolean = true;
  information: any;

  previewElement: any;
  previewElementShow: boolean;
  previewElementId: number;
  datatypes = ["Neues Element","", "Bild", "Audio", "Video", "PDF", "Youtube / Vimeo Video", "Seitenumbruch", "Quelle auswählen"];

  createAddress: any;
  partListAddress : any;
  chapterListAddress : any;
  unitListAddress : any;
  dataListAddress : any;
  activepartAddress : any = false;
  activechapterAddress : any = false;
  activeunitAddress : any = false;
  activedataAddress : any = false;
  dataAddress: any;
  linkAddress: any;
  linkId: any;
  insertAddress: any;

  alert:any;

  pdfMode: boolean = false;
  pdfModeStyle: String = 'none';
  pdfModeBreak: boolean = false;
  pdfModeMinus: boolean = false;

  workMode: boolean = false;

  chapterPDFToUpload: File = null;

  moveObject: any = false;

  menuReplic: boolean = false;

  blogList: any;

  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  ngOnInit() {
    this.alertService.currentAlert.subscribe(alert => this.alert = alert);
    this.getInformation()
    if(this.router.url.indexOf("replic")!=-1){ //open replic page
      this.menuReplic = true;
    }
    this.currentUser = this.authenticationService.getcurrentUser();
    this.getBloglistOnlynames();
    if(this.currentUser.permission_book == 0){
      this.getBooklist();
    }else{
      this.selectBook(this.currentUser.permission_book,true);
      this.replicSelectedBook = this.currentUser.permission_book;
    }
  }

  saveInformation(){
    this.InfoService.saveInformation(this.information)
    .subscribe((res)=>{
      if(!res.error){
        this.getInformation();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getInformation(){
    this.InfoService.getInformation()
    .subscribe((res)=>{
      if(!res.error){
        this.information = res.data[0];
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getBooklist(){
    this.loading++;
    this.ContentService.getBooklist()
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.bookList = res.data;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  selectBook(bookid, setList:boolean){
    this.loading++;
    for (let key in this.bookList) {
      this.bookList[key].status = false;
      if(this.bookList[key].bookid == bookid){
        this.bookList[key].status = true;
      }
    }
    this.activepart = false;
    this.chapterList = false;
    this.unitList = false;
    this.activechapter = false;
    this.ContentService.getBook(bookid).subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.book = res.data;
        this.depth = 1;
        this.data = false;
        this.getElementList(this.book[0].bookid, "part")
        
        this.getDataNumbersOfReference("book");
        this.getAuthor(this.book[0].bookid);
        this.activeauthor = false;
        this.getReplic(this.book[0].bookid)
        this.previewListList = Array();

        if(this.workMode)this.getPDFPreviewList();

        if(setList){
          this.bookList = [{ 
            "bookid":res.data[0].bookid,
            "bookname":res.data[0].bookname
          }];
        }

      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  saveBook(bookdata, preview=false){
    this.loading++;
    this.ContentService.saveBook(bookdata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.updateReferences(bookdata.bookid, "book");
        this.loading--;
        if(preview){
          this.loadPDFPreviewPages('editorial', this.book[0].bookid);
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  uploadBookCover(book){
    this.book[0].uploadCoverError = false;
    if (book.length === 0){
      this.book[0].uploadCoverError = true;
      return;
    } 
      var mimeType = book[0].type;
      if(!mimeType.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG)$")){
        this.book[0].uploadCoverRun = true;
          this.ContentService.uploadBookCover(this.book[0].bookid, book[0])
          .subscribe((res)=>{
            this.book[0].uploadCoverState = res;
            if(!res.status){
              if(!res.error){
                if(res.data){
                  this.loading--;
                  this.book[0].uploadCoverRun = false;
                  this.book[0].bookcover = res.data;
                  this.savedContentSuccess("saved","bookcover", this.book[0].bookid);
                }
              }else{
                this.sendAlert(res.data,1);
              }
            }
          });
      }
  }

  uploadBookTwitterimage(book){
    this.book[0].uploadTwitterError = false;
    if (book.length === 0){
      this.book[0].uploadTwitterError = true;
      return;
    } 
      var mimeType = book[0].type;
      if(!mimeType.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG)$")){
        this.book[0].uploadTwitterRun = true;
          this.ContentService.uploadBookTwitterimage(this.book[0].bookid, book[0])
          .subscribe((res)=>{
            this.book[0].uploadTwitterState = res;
            if(!res.status){
              if(!res.error){
                if(res.data){
                  this.loading--;
                  this.book[0].uploadTwitterRun = false;
                  this.book[0].twitterimage = res.data;
                  this.savedContentSuccess("saved","twitterimage", this.book[0].bookid);
                }
              }else{
                this.sendAlert(res.data,1);
              }
            }
          });
      }
  }


  //functions part

  getElementList(elementid, type, address=false, editorial=false){
    if(!address)this.showEditorialInformation=false;
    if(editorial){
      //show editorial message.
      this.showEditorialInformation=true;
      this.chapterList = false;
      var element = {
        id : elementid,
        type : type
      }
      this.loading++;
      this.ContentService.getElementList(element).subscribe((res)=>{
        this.loading--;
        if(!res.error){
          this.selectChapter(res.data[0].chapterid);
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }else{
      this.loading++;
      var element = {
        id : elementid,
        type : type
      }
      this.ContentService.getElementList(element)
      .subscribe((res)=>{
        this.loading--;
        if(!res.error){
          if(type=="part"){
            this.partListAddress = res.data;
          }
          if(address==false){
            this[type+"List"] = res.data;
            if(this["active"+type]){
              for (let key in this[type+"List"]) {
                if(this[type+"List"][key][type+"id"] == this["active"+type][type+"id"]){
                  this[type+"List"][key].status = true;
                }
              }
            }
          }else{
            this[type+"ListAddress"] = res.data;
          }
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }
  }


  deleteElement(type){
    this.loading++;
    var element = {
      id : this["active"+type][type+"id"],
      type : type
    }
    this.ContentService.deleteElement(element)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("deleted",type,this["active"+type][type+"id"]);
        this["delete"+type+"Form"]=false;
        this["active"+type]=false;

        switch(type){
          case "part":
            var id = this.book[0].bookid;
            this.chapterList = false;
          break;
          case "chapter":
              var id = this.activepart.partid;
              this.unitList = false;
          break;
          case "unit":
              var id = this.activechapter.chapterid;
              this.data = false;
          break;
        }

        this.getElementList(id, type);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addPart(){
    this.loading++;
    this.ContentService.addPart(this.book[0].bookid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("added","part", this.book[0].bookid);
        this.getElementList(this.book[0].bookid, "part")
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  selectPart(partid){
    this.loading++;
    var editorial = false;
    for (let key in this.partList) {
      this.partList[key].status = false;
      if(this.partList[key].partid == partid){
        this.partList[key].status = true;
        if(this.partList[key].partname=="Editorial"){
          editorial = true;
        };
      }
    }
    this.activechapter = false;
    this.showEditPart = true;
    this.unitList = false;
    var partdata = {"bookid":this.book[0].bookid, "partid":partid};
    this.ContentService.getPart(partdata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.activepart = res.data[0];
        this.deletepartForm=false;
        this.depth = 2;
        this.data = false;
        if(this.activepart.part_showauthor==0)this.activepart.part_showauthor=false;
        if(this.activepart.part_showauthorweb==0)this.activepart.part_showauthorweb=false;
        if(this.activepart.part_showweb==0)this.activepart.part_showweb=false;
        this.getElementList(this.activepart.partid, "chapter", false, editorial);
        this.getImagePart();
        this.getAttachement(this.activepart.partid)
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  savePart(){
    this.loading++;
    if((this.activepart.partname=="")){
      this.activepart.editPartNameMissing=true;
      return;
    } 
    this.ContentService.savePart(this.activepart)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.contentCheckPartBg = false;
        this.savedContentSuccess("saved","part",this.activepart.partid);
        this.getElementList(this.book[0].bookid,"part");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  checkImagePart(files){
      this.activepart.imagePreview = false;
      this.activepart.imageNotValid = false;
      this.activepart.imageToUpload = false;
      if (files.length === 0) return;
  
        var mimeType = files[0].type;

        if(!mimeType.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG)$")){
          var reader = new FileReader();
          reader.readAsDataURL(files[0]); 
          reader.onload = (_event) => { 
            this.activepart.imagePreview = reader.result; 
            this.activepart.imageToUpload = files[0];
          }
        }else{
          this.activepart.imageNotValid = true;
        } 
  }

  getImagePart(){
    this.loading++;
    this.ContentService.getImagePart(this.activepart.partid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.activepart.images = res.data;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  uploadImagePart(){
    this.loading++;
    this.activepart.imagePreview = false;
    this.ContentService.uploadImagePart(this.activepart)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
      this.getImagePart();
      this.savedContentSuccess("saved","link", this.activepart.partid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteImagePart(imageid){
    var partdata = {
      imageid: imageid,
      partid: this.activepart.partid
    }
    this.loading++;
    this.ContentService.deleteImagePart(partdata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getImagePart();
        this.savedContentSuccess("deleted","partimage", imageid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  //functions authors


  getAuthor(bookid){
    this.loading++;
    this.ContentService.getAuthor(bookid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
          this.authorList = res.data;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }
  

  addAuthor(){
    this.loading++;
    this.ContentService.addAuthor(this.book[0].bookid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("added","author", this.book[0].bookid);
        this.getAuthor(this.book[0].bookid)
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveAuthor(authordata){
    this.loading++;
    this.ContentService.saveAuthor(authordata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.contentCheckPartBg = false;
        this.savedContentSuccess("saved","author",authordata.authorid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteAuthor(authordata){
    this.loading++;
    this.ContentService.deleteAuthor(authordata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("deleted","author",authordata.authorid);
        for (let key in this.authorList) {
          if(this.authorList[key].authorid == authordata.authorid){
            this.authorList.splice(key,1);
          }
        }
        this.activeauthor = false;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  selectAuthor(authorid){
    for (let key in this.authorList) {
      if(this.authorList[key].authorid == authorid){
        this.activeauthor = this.authorList[key];
      }
      this.authorList[key].status = (this.authorList[key].authorid == authorid);
    }
  }

  getAuthorChapter(chapterid){
    this.loading++;
    var authordata = {
      chapterid: chapterid
    }
    this.ContentService.getAuthorChapter(authordata).subscribe((res)=>{
      this.loading--;
      if(!res.error){
          this.authorlistchapter = JSON.parse(JSON.stringify(this.authorList));
          for (let key in this.authorlistchapter) {
            for (let key2 in res.data) {
              if(res.data[key2]&&this.authorlistchapter[key]){
                if(this.authorlistchapter[key].authorid == res.data[key2].authorid){
                  this.authorlistchapter[key]=false;
                }
              }
            }
          }
          this.activechapter.author = res.data;
          this.activechapter.authorlist = this.authorlistchapter.filter(Boolean);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }
  

  addAuthorChapter(authorid, chapterid){
    this.loading++;
    var authordata = {
      authorid: authorid,
      chapterid: chapterid
    }
    this.ContentService.addAuthorChapter(authordata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getAuthorChapter(chapterid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  deleteAuthorChapter(authorid, typeid){
    this.loading++;
    var authordata = {
      authorid: authorid,
      typeid: typeid
    }
    this.ContentService.deleteAuthorChapter(authordata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){

        this.savedContentSuccess("deleted","author",authordata.authorid);
        this.getAuthorChapter(typeid)
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  //functions replica
  addReplic(){
    this.loading++;
    this.ContentService.addReplic(this.book[0].bookid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getReplic(this.book[0].bookid, true)
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getReplic(bookid, add=false){
    this.loading++;
    this.ContentService.getReplic(bookid).subscribe((res)=>{
      this.loading--;
      console.log(this.loading);
      if(!res.error){
        if(add){
          this.replic.unshift(res.data[0]);
        }else{
          this.replic = res.data;
          for(let key in this.replic){
            this.getChapterReplic(this.replic[key].partid, this.replic[key].replicid)
          }
        }
        this.getDataNumbersOfReference("replic");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveReplic(replicdata, preview=false){
    this.loading++;
    this.ContentService.saveReplic(replicdata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.contentCheckPartBg = false;
        this.savedContentSuccess("saved","replic",replicdata.replicid);
        this.updateReferences(replicdata.replicid, "replic");
        if(preview){
          this.loadPDFPreviewPages('replic', replicdata.replicid);
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteReplic(replicdata){
    this.loading++;
    this.ContentService.deleteReplic(replicdata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("deleted","replic",replicdata.replicid);
        var dataKey = this.getreplicKey(this.book[0].bookid);
        this.replic.splice(dataKey,1);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  changeReplicPosition(replicposition,add){
    if((replicposition!=0||add==1)&&(replicposition!=this.replic.length-1||add==-1)){
      replicposition = Number(replicposition);
      add = Number(add);
      var key_main;
      var key_other;
      for (let key in this.replic) {
        this.replic[key].replicposition = Number(this.replic[key].replicposition);
        if(this.replic[key].replicposition == replicposition){
          key_main = key;
        }
        if(this.replic[key].replicposition == (replicposition+add)){
          key_other = key;
        }
      }

      this.replic[key_main].replicposition = Number(this.replic[key_main].replicposition) + add;
      this.replic[key_other].replicposition = Number(this.replic[key_other].replicposition) - add;
      this.sortDataPosition('replic');
      this.saveReplic(this.replic[key_main]);
      this.saveReplic(this.replic[key_other]);
    }
  }

  deleteReplicPDF(replicKey){
    this.loading++;
    this.replic[replicKey].deleteReplicPDFShow=false;
    this.ContentService.deleteReplicPDF(this.replic[replicKey].replicid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.replic[replicKey].replicpdf = false;
        this.savedContentSuccess("deleted pdf","replic",this.replic[replicKey].replicid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getChapterReplic(partid, replicid){
    var element = {
      id : partid,
      type : "chapter"
    }
    let replicKey = this.getreplicKey(replicid);
    if(!this.replic[replicKey]){
      return "No Replic found with key "+replicKey;
    }
    this.ContentService.getElementList(element).subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.replic[replicKey].chapterlist = res.data
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  //functions attachements
  addAttachement(attachementtype, elementid){

    if(elementid!=-1){
      this.activepart.addattachementblog = -1;
      this.activepart.addattachementreplic = -1;
      var partdata = {
        partid: this.activepart.partid,
        attachementtype: attachementtype,
        elementid: elementid
      }

      this.loading++;
      this.ContentService.addAttachement(partdata).subscribe((res)=>{
        this.loading--;
        if(!res.error){
          this.getAttachement(this.activepart.partid);
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }
  }

  getAttachement(partid){
    this.loading++;
    this.ContentService.getAttachement(partid).subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.activepart.attachement = res.data
        for(let key in this.activepart.attachement){
          this.activepart.attachement[key].attachementname = this.activepart.attachement[key].attachementname.replace(/\&shy;/gi, "");
        }
        this.activepart.addattachementblog = -1;
        this.activepart.addattachementreplic = -1;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteAttachement(attachementid){
    var partdata = {
      partid: this.activepart.partid,
      attachementid: attachementid
    }
    this.loading++;
    this.ContentService.deleteAttachement(partdata).subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getAttachement(this.activepart.partid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  changepositionAttachement(attachementid, positionchange){

    var partdata = {
      partid: this.activepart.partid,
      attachementid: attachementid,
      positionchange: positionchange,
    }

    this.loading++;
    this.ContentService.changepositionAttachement(partdata).subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getAttachement(this.activepart.partid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getBloglistOnlynames(){
    var data = {};
    this.loading++;
    this.ContentService.getBloglistOnlynames(data, "getBloglistOnlynames")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.blogList=res.data;
        for(let key in this.blogList){
          if(this.blogList[key].blog_official==0)this.blogList[key].blog_official=false;
          this.blogList[key].blog_title = this.blogList[key].blog_title.replace(/\&shy;/gi, "");
        }
      }else{
        console.log(res)
        this.sendAlert(res.data,1);
      }
    });
  }

  //functions chapter

  addChapter(){
    this.loading++;
    this.ContentService.addChapter(this.activepart.partid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("added","chapter",this.activepart.partid);
        this.getElementList(this.activepart.partid, "chapter");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  selectChapter(chapterid){
    this.loading++;
    for (let key in this.chapterList) {
      this.chapterList[key].status = false;
      if(this.chapterList[key].chapterid == chapterid){
        this.chapterList[key].status = true;
      }
    }
    this.showEditChapter = true;
    this.ContentService.getChapter(chapterid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.activeunit = false;
        this.activechapter = res.data[0];
        if(this.activechapter.chapterweb==0)this.activechapter.chapterweb=false;
        this.depth = 3;
        if(!this.showEditorialInformation){
          this.getElementList(this.activechapter.chapterid, "unit");
        }
        this.getAuthorChapter(this.activechapter.chapterid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveChapter(){
    this.loading++;
    this.activechapter.editChapterNameMissing=false;
    if((this.activechapter.chaptername=="")){
      this.activechapter.editChapterNameMissing=true;
      return;
    } 
    let data = this.activechapter;
    data.chapterreleasedate = this.datepipe.transform(this.activechapter.chapterreleasedate, 'yyyy-MM-dd');
    this.ContentService.saveChapter(data)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("saved","chapter",this.activechapter.chapterid);
        this.contentCheckChapterBg = false;
        this.getElementList(this.activepart.partid, "chapter");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  lockChapter(chapterid, chapterlocked){
    this.loading++;
    var lockChapter = {
      chapterid : chapterid,
      chapterlocked : chapterlocked
    }

    for (let key in this.chapterList) {
      if(this.chapterList[key].chapterid == chapterid){
        this.chapterList[key].chapterlocked = chapterlocked;
      }
    }

    this.ContentService.lockChapter(lockChapter)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("saved","chapter",chapterid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  uploadPDF(pdf, element, type){
    if (type=="chapter"){
      var elementid = element.chapterid;
    }else if(type=="replic"){
      var elementid = element.replicid;
    }else{
      var elementid = element.bookid;
    }

    element.uploadPDFError = false;
    if (pdf.length === 0){
      element.uploadPDFError = true;
      return;
    } 
      var mimeType = pdf[0].type;
      if(!mimeType.search(".*\.(pdf|PDF)$")){
        element.uploadPDFRun = true;
          this.ContentService.uploadPDF(elementid,pdf[0],type)
          .subscribe((res)=>{
            element.uploadPdfState = res;
            if(!res.status){
              if(!res.error){
                if(res.data){
                  this.loading--;
                  element.uploadPDFRun = false;
                  if (type=="chapter"){
                    element.chapterpdf = res.data;
                  }else if(type=="replic"){
                    element.replicpdf = res.data;
                  }else{
                    element.bookpdf = res.data;
                  }
                  this.savedContentSuccess("saved","pdf", elementid);
                }
              }else{
                this.sendAlert(res.data,1);
              }
            }
          });
      }else{
        element.uploadPDFError = true;
        return;
      }
  }

  deleteChapterPDF(){
    this.loading++;
    this.deleteChapterPDFShow=false;
    this.ContentService.deleteChapterPDF(this.activechapter.chapterid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.activechapter.chapterpdf = false;
        this.savedContentSuccess("deleted pdf","chapter",this.activechapter.chapterid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteBookPDF(){
    this.loading++;
    this.deleteBookPDFShow=false;
    this.ContentService.deleteBookPDF(this.book[0].bookid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.book[0].bookpdf = false;
        this.savedContentSuccess("deleted pdf","book",this.book[0].bookid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  

  // functions unit

  addUnit(){
    this.loading++;
    this.ContentService.addUnit(this.activechapter.chapterid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("added","unit",this.activechapter.chapterid);
        this.getElementList(this.activechapter.chapterid, "unit");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  selectUnit(unitid){
    for (let key in this.unitList) {
      this.unitList[key].status = false;
      if(this.unitList[key].unitid == unitid){
        this.unitList[key].status = true;
      }
    }
    if(this.activeunit.unitid==unitid){return;}
    this.loading++;
    this.showEditUnit = true;
    this.ContentService.getUnit(unitid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.activeunit = res.data[0];
        this.deleteunitForm=false;
        this.depth = 4;
        this.getData(this.activeunit.unitid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveUnit(){
    this.loading++;

    this.ContentService.saveUnit(this.activeunit)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("saved","part",this.activeunit.unitid);
        this.contentCheckUnitBg = false;
        this.getElementList(this.activechapter.chapterid, "unit");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  // functions unitdata

  addData(){
    this.loading++;
    this.ContentService.addData(this.activeunit.unitid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("added","unit",this.activeunit.unitid);
        this.getData(this.activeunit.unitid, true);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addPageBreak(){
    this.loading++;
    this.ContentService.addPageBreak(this.activeunit.unitid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("added","unit",this.activeunit.unitid);
        this.getData(this.activeunit.unitid, true);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  getData(unitid, add=false){
    this.loading++;
    this.ContentService.getData(unitid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        if(add){
          this.data.push(res.data[res.data.length-1]);
        }else{
          this.data = res.data;
        }

        for (let key in this.data) {
          if(!this.data[key].tinyurl&&(this.data[key].datatype==3||this.data[key].datatype==4||this.data[key].datatype==6)){
            this.getTinyurl(key);
          }
        }

        this.getDataNumbersOfReference("data");
        this.sortDataPosition("data");
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  getTinyurl(dataKey){
    this.loading++;
      var tinyurldata = {
        dataid : this.data[dataKey].dataid,
        unitid : this.data[dataKey].unitid,
        bookid : this.book[0].bookid
      }
    this.ContentService.getTinyurl(tinyurldata)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        if(res.data[0]){
          var key = this.getdataKey(res.data[0].dataid);
          this.data[key].tinyurl = res.data[0].urllink;
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  getDataNumbersOfReference(type){
    if(type=="book"){
      if(!this[type][0].removedReferences){this[type][0].removedReferences=0;}
      this[type][0].numbersOfReference = this[type][0].editorial.split('<sup>').length-1;
      for(var i = 0; i < (this[type][0].numbersOfReference-(this[type][0][type+"reference"].length-this[type][0].removedReferences)); i++) {
        this.addReference(this[type][0][type+"id"], 0, type, true);
      }
    }else{
      for (let key in this[type]) {
        if(!this[type][key].removedReferences)this[type][key].removedReferences=0;
        if(type=="data"){
            if(this.data[key].datatype==1&&this.data[key].datalayout==0){
              this.data[key].numbersOfReference = this.data[key].datatext.split('<sup>').length-1;
            }else{
              this.data[key].numbersOfReference = this.data[key].datacaption.split('<sup>').length-1;
            }
        }else{
          this[type][key].numbersOfReference = this[type][key].replictext.split('<sup>').length-1;
        }
        let j2 = (this[type][key].numbersOfReference-(this[type][key][type+"reference"].length-this[type][key].removedReferences))
        for(var i2 = 0; i2 < j2; i2++) {
          this.addReference(this[type][key][type+"id"], 0, type, true);
        }
      }
    }
  }

  sortDataPosition(type){
    for(var i = 0;this[type].length>i;i++){
      for (let key in this[type]) {
        if(this[type][key][type+"position"] == i){
          this.dataSorted.push(this[type][key]);
        }
      }
    }
  this[type+'Length'] = this[type].length;
  
  this[type] = this.dataSorted;
  this.dataSorted = [];
  }




  deleteData(datacontent){
    this.loading++;
    this.ContentService.deleteData(datacontent)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("deleted","unit",datacontent.dataid);
        var dataKey = this.getdataKey(datacontent.dataid);
        var oldPosition = this.data[dataKey].dataposition;
        this.data.splice(dataKey,1);
        for (let key in this.data) {
          if(this.data[key].dataposition > oldPosition){
            this.data[key].dataposition--;
          }
        }
        this.sortDataPosition('data');
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }  

  deleteDataText(datacontent){
    this.loading++;
    this.ContentService.deleteDataText(datacontent)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("deleted","text",datacontent.dataid);
        for (let key in this.data) {
          if(this.data[key].dataid == datacontent.dataid){
            this.data[key].datatext = '';
            this.data[key].datatype = 0;
            this.data[key].showDeleteText = false;
          }
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }  

  saveData(dataid){
    var dataKey = this.getdataKey(dataid);
    this.saveDataInfo(this.data[dataKey]);
    this.previewElementShow = false;
  }

  saveDataInfo(datacontent, preview=false){
    datacontent.datatext = this.textReplaceTagsRegex(datacontent.datatext);
    datacontent.datasource = this.textReplaceTagsRegex(datacontent.datasource);
    datacontent.datacaption = this.textReplaceTagsRegex(datacontent.datacaption);
    datacontent.datareplacement_text = this.textReplaceTagsRegex(datacontent.datareplacement_text);
    datacontent.datareplacement_source = this.textReplaceTagsRegex(datacontent.datareplacement_source);
    this.loading++;
    this.ContentService.saveDataInfo(datacontent)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("saved","datainfo", datacontent.dataid);
        this.updateReferences(datacontent.dataid, "data");
        this.updateComment(datacontent.dataid);
        var dataKey = this.getdataKey(datacontent.dataid);
        this.data[dataKey].contentCheckAnalysis=false;
        this.data[dataKey].contentCheckAnalysisBg=false;

        if(this.data[dataKey].datatype==1){
          this.saveDataText(datacontent, preview);
        }else{
          if(preview){
            this.loadPDFPreviewPages('element', datacontent.dataid);
          }
        }
        /* create tinyurl if not existing */
        if(!this.data[dataKey].tinyurl&&(this.data[dataKey].datatype==3||this.data[dataKey].datatype==4||this.data[dataKey].datatype==6)){

          var tinyurldata={
            unitid : this.data[dataKey].unitid,
            dataid : this.data[dataKey].dataid,
            bookid : this.book[0].bookid,
          }
          this.ContentService.addTinyurl(tinyurldata).subscribe((res)=>{
            this.getTinyurl(dataKey);
          });
        }

      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveDataText(datacontent,preview=false){
    this.loading++;
    this.ContentService.saveDataText(datacontent)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("saved","text", datacontent.dataid);
        var dataKey = this.getdataKey(datacontent.dataid);
        this.data[dataKey].contentCheckText=false;
        this.data[dataKey].contentCheckTextBg=false;
        if(preview){
          this.loadPDFPreviewPages('element', datacontent.dataid);
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  checkDataLink(datacontent){
    this.ContentService.checkDataLink(datacontent.datalink).subscribe((res)=>{
      if(!res.error){
        var answer = res.data;
        var dataKey = this.getdataKey(datacontent.dataid);
        this.data[dataKey].linknotvalid = false;
        this.data[dataKey].filetypenotvalid = false;
        this.data[dataKey].previewLink = false;
        this.data[dataKey].showPreview = false;
        this.data[dataKey].previewtype = false;
        this.data[dataKey].fileToUpload = false;
        if(answer=="not_valid"){
          this.data[dataKey].linknotvalid = true;
        }else{
          this.data[dataKey].previewtype = 0;
            if(!answer.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$")) this.data[dataKey].previewtype=2; //Datatype image
            if(!answer.search(".*\.(mp3|MP3|mpeg|MPEG)$")) this.data[dataKey].previewtype=3; //Datatype audio
            if(!answer.search(".*\.(mov|MOV|mp4|MP4)$")) this.data[dataKey].previewtype=4; //Datatype video
            if(!answer.search(".*\.(pdf|PDF)$")) this.data[dataKey].previewtype=5; //Datatype pdf
            if(answer=="youtube"){
              this.data[dataKey].previewtype=6;
              datacontent.datalink = datacontent.datalink.replace("watch?v=","embed/");
            }  
            if(answer=="vimeo"){
              this.data[dataKey].previewtype=6;
              datacontent.datalink = datacontent.datalink.replace("www.","").replace("vimeo.com/","player.vimeo.com/video/");
            }
          if(this.data[dataKey].previewtype==0) {
            this.data[dataKey].filetypenotvalid = true;
          }else{
            this.data[dataKey].showPreview = true;
            this.data[dataKey].previewLink = datacontent.datalink;
          }
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  checkDataFile(datacontent, files){

    var dataKey = this.getdataKey(datacontent.dataid);
      this.data[dataKey].linknotvalid = false;
      this.data[dataKey].filetypenotvalid = false;
      this.data[dataKey].previewLink = false;
      this.data[dataKey].showPreview = false;
      this.data[dataKey].previewtype = false;
      this.data[dataKey].fileToUpload = false;
      if (files.length === 0) return;
  
        var mimeType = files[0].type;

        this.data[dataKey].previewtype = 0;
        if(!mimeType.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$")) this.data[dataKey].previewtype=2; //Datatype image
        if(!mimeType.search(".*\.(mp3|MP3|mpeg|MPEG)$")) this.data[dataKey].previewtype=3; //Datatype audio
        if(!mimeType.search(".*\.(mov|MOV|mp4|MP4)$")) this.data[dataKey].previewtype=4; //Datatype video
        if(!mimeType.search(".*\.(pdf|PDF)$")) this.data[dataKey].previewtype=5; //Datatype pdf

        if(this.data[dataKey].previewtype==0) {
          this.data[dataKey].filetypenotvalid = true;
        }else{
          var reader = new FileReader();
          this.data[dataKey].loadPreview = true;
          reader.readAsDataURL(files[0]); 
          reader.onload = (_event) => { 
            this.data[dataKey].loadPreview = false;
            this.data[dataKey].showPreview = true;
            this.data[dataKey].previewLink = reader.result; 
            this.data[dataKey].fileToUpload = files[0];
          }
        }
  }

  saveDataFile(datacontent,replacement=false){
    this.loading++;
    if(!datacontent.fileToUpload){
      this.ContentService.saveDataLink(datacontent)
      .subscribe((res)=>{
        this.loading--;
        if(!res.error){
          this.savedContentSuccess("saved","link", datacontent.dataid);
          var dataKey = this.getdataKey(datacontent.dataid);
          this.data[dataKey].datalink = datacontent.previewLink;
          this.data[dataKey].previewLink = false;
          this.data[dataKey].showPreview = false;
          this.data[dataKey].previewType = false;
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }else{
      datacontent.previewLink = false;
      datacontent.showPreview = false;
      if(!replacement){
        datacontent.datareplacement_image = "";
      }
      var dataKey = this.getdataKey(datacontent.dataid);
      console.log(datacontent)
      this.ContentService.uploadDataFile(datacontent)
      .subscribe((res)=>{
        this.data[dataKey].uploadState = res;
        if(!res.status){
        this.loading--;
          if(!res.error){
            if(!replacement){
              this.data[dataKey].datalink = res.data;
            }else{
              this.data[dataKey].datareplacemenet_image = res.data;
            }
            this.data[dataKey].fileToUpload = false;
            this.savedContentSuccess("saved","link", datacontent.dataid);
          }else{
            this.sendAlert(res.data,1);
          }
        }
      });
    }
  }

  deleteDataFile(datacontent){
    this.loading++;
    this.ContentService.deleteDataFile(datacontent.dataid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.savedContentSuccess("deleted","file", datacontent.dataid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteReplacementImage(dataid){
    this.loading++;
    this.ContentService.deleteReplacementImage(dataid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        var dataKey = this.getdataKey(dataid);
        this.data[dataKey].datareplacement_image = false;
        this.savedContentSuccess("deleted","replacementfile", dataid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  changeDataLayout(data, layouttype){
    if(data.datalayout!=layouttype){
      data.datalayout = layouttype;
      this.saveDataInfo(data);
    }
  }

  changeDataPosition(data,positionchange){
    data.newdataposition = Number(data.dataposition)+positionchange;
    let olddataposition = data.dataposition
    if(data.newdataposition>=0&&data.newdataposition<this.data.length){
      this.ContentService.changeDataPosition(data)
      .subscribe((res)=>{
        if(!res.error){
          var key_main;
          var key_other;
          for (let key in this.data) {
            if(Number(this.data[key].dataid) == data.dataid){
              key_main = key;
            }
            if(Number(this.data[key].dataposition) == data.newdataposition){
              key_other = key;
            }
          }

          this.data[key_main].dataposition = data.newdataposition;
          this.data[key_other].dataposition = olddataposition;
          this.sortDataPosition("data")
        }else{
          this.sendAlert(res.data,1);
        }
      });

      // newposition = Number(newposition);
      // var key_main;
      // var key_other;
      // for (let key in this.data) {
      //   this.data[key].dataposition = Number(this.data[key].dataposition);
      //   if(this.data[key].dataposition == dataposition){
      //     key_main = key;
      //   }
      //   if(this.data[key].dataposition == (dataposition+add)){
      //     key_other = key;
      //   }
      // }

      // this.data[key_main].dataposition = Number(this.data[key_main].dataposition) + add;
      // this.data[key_other].dataposition = Number(this.data[key_other].dataposition) - add;
      // this.sortDataPosition('data');
      // this.saveDataInfo(this.data[key_main]);
      // this.saveDataInfo(this.data[key_other]);
    }
  }


  changePosition(type, position, add, dataid, authorchapter = false){
    var list = this[type+'List'];
    if(authorchapter)list = this.activechapter.author;
    if((position!=0||add==1)&&(position!=list.length-1||add==-1)){
      position = Number(position);
      add = Number(add);
      var key_main;
      var key_other;


      for (let key in list) {
        list[key][type+'position'] = Number(list[key][type+'position']);
        if(list[key][type+'position'] == position){
          key_main = key;
        }
        if(list[key][type+'position'] == (position+add)){
          key_other = key;
        }
      }

      var otherid = list[key_other][type+'id'];
      list[key_main][type+'position'] = position+add;
      list[key_other][type+'position'] = position;

      var saveKey = list[key_other];
      list[key_other] = list[key_main];
      list[key_main] = saveKey;
      //if(!authorchapter)this['active'+type][type+'position'] = position+add;


      //this.data[key_other].dataposition = Number(this.data[key_other].dataposition) - add;

      var positionobj: any = {};
      positionobj.type = type;
      positionobj.position = position;
      positionobj.dataid = dataid;
      positionobj.add = add;
      positionobj.otherid = otherid;
      if(authorchapter)positionobj.authorchapter = authorchapter;
      this.ContentService.savePosition(positionobj)
      .subscribe((res)=>{
        if(!res.error){
          this.savedContentSuccess("changed position","file", positionobj.dataid);
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }
  }

  // REFERENCE BLOCK

  insertReference(event, data, type, textelement=''){
    if(data.insertReference||this.insertAddress||this.pdfModeBreak||this.pdfModeMinus){
    var el = event.editor.editor;
    var caretOffset = 0, sel;
    if (typeof window.getSelection !== "undefined") {
      var range = window.getSelection().getRangeAt(0);
      var selected = range.toString().length;
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(el);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      
      var preChars = 0;
      var finishCheck = false;
      preCaretRange.startContainer.childNodes.forEach(
        function(currentValue) { 
          if(!finishCheck){
          var count = (currentValue.textContent.match(/&/g) || []).length;
          preChars += count*4;
          let currentContainer = <HTMLElement> currentValue;
          let preContainer = <HTMLElement> preCaretRange.endContainer;
          if(currentContainer.outerHTML){
            if(currentContainer.textContent == preContainer.textContent){
              preChars += (currentContainer.nodeName.length+2);
              finishCheck = true;
            }
            if(!finishCheck){
              preChars += currentContainer.outerHTML.length;
            }

          }else{
            if(currentContainer.textContent == preContainer.textContent){
              finishCheck = true;
            }
            if(!finishCheck){
              preChars += currentContainer.textContent.length;
            }
          }
          }
        }
      );
      caretOffset = preChars + preCaretRange.endOffset;
    }
    if(data.insertReference){
      this.addReference(data[type+'id'], caretOffset, type);
    }else{
      this.addAddress(data[type+'id'], caretOffset, type, textelement);
    }
    }
  }

  dataTextReplaceTags(dataid,type){
    var dataKey = this.getdataKey(dataid);
    this.data[dataKey]["data"+type] = this.textReplaceTagsRegex(this.data[dataKey]["data"+type]);
    if(type=="text"||type=="caption"){
      this.getDataNumbersOfReference("data");
    }
    if(type=="replic"){
      this.getDataNumbersOfReference("replic");
    }
  }

  textReplaceTagsRegex(datatext){
  if (!datatext) return '';
    if(this.book[0].language=="EN"){
      var datatext = datatext
      .replace(/\u201E/g,"\u2749")
      .replace(/\u201C/g,"\u2735")
      .replace(/\u201A/g,"\u273A")
      .replace(/\u2018/g,"\u2739")
    }else{
      var datatext = datatext
      .replace(/\u201E/g,"\u00BB")
      .replace(/\u201C/g,"\u00AB")
      .replace(/\u201A/g,"\u203A")
      .replace(/\u2018/g,"\u2039")
    }
    var datatext = datatext.replace(/<br>/g,"<br/>")
                      .replace(/…/g,"...")
                      .replace(/<\/p>\s*<p[^>]*>/g, "<br/>")  // </p><p> → ein Zeilenumbruch
                      .replace(/<\/?p[^>]*>/g, "")            // restliche <p> und </p> entfernen
                      .replace(/<i[^>]*>/g,"<i>")
                      .replace(/<em[^>]*>/g,"<i>")
                       .replace(/<\/em>/g,"</i>")
                       .replace(/(?=<!--)([\s\S]*?-->)/g,"")
                       .replace(/<div style="margin-left:15pt">([^"]*)<\/div>/gm,'MARKdiv style="margin-left:15pt"MARK$1MARK/divMARK')
                       .replace(/<div style="([^"]*)"([^c]*) class="address" id="([^"]*)">([^"]*)<\/div>/gm,'MARKdiv style="$1" class="address" id="$3"MARK$4MARK/divMARK')
                       .replace(/<div style="([^"]*)"([^c]*) class="address" id="([^"]*)">([^(<)]*)<(span|em|i|strong|sup)([^>]*)>/gm, 'MARKdiv style="$1" class="address" id="$3"MARK$4MARK/divMARK')
                       .replace(/<\/?(?!(?:i|sup|br)\b)[a-z](?:[^>"']|"[^"]*"|'[^']*')*>/g, "")
                       .replace(/MARKdiv style="([^"]*)" class="address" id="([^"]*)"MARK(.*?(?=MARK))MARK\/divMARK/gm,'<div style="$1" class="address" id="$2">$3</div>')
                       .replace(/MARKdiv style="margin-left:15pt"MARK([^"]*)MARK\/divMARK/gm,'<div style="margin-left:15pt">$1</div>')
                       .replace(/(<sup([^>]*)>)+/g,"<sup>")
                       .replace(/(<\/sup>)+/g,"</sup>")
                       .replace(/&nbsp;/g," ")
                       .replace(/&amp;/g,"&")
                       .replace(/\r?\n|\r/g," ")
                       .replace(/\t/g,"")
                       .replace(/\s+/g,' ');
    return datatext;
  }


  addAddress(elementid, caretPosition, type, textelement){
    console.log(elementid, caretPosition, type, textelement);
    var dataKey = this["get"+type+"Key"](elementid);
    console.log(dataKey);
    var textBefore = this[type][dataKey][textelement].substring(0,caretPosition);
    var textAfter = this[type][dataKey][textelement].substring(caretPosition);
    var address = '<div style="margin:10px 0;font-size:12px;padding-left:10px;" class="address" id="'+this.insertAddress.id+'">Verweis zu: '+this.insertAddress.text+'</div>';
    this[type][dataKey][textelement] = textBefore + address + textAfter;
    this.linkAddress = "";
    this.insertAddress = false;
    this.createAddress = false;
    this.activepartAddress = false;
    this.activechapterAddress = false;
    this.activeunitAddress = false;
    this.activedataAddress = false;
    this.chapterListAddress = false;
    this.unitListAddress = false;
    this.dataListAddress = false;
  }
  
  selectElementAddress(elementid, type){
    if(this.moveObject&&this.moveObject.moveTo==type){
      this.moveElement(elementid, type);
    }else{
      this.loading++;
      var elementdata = elementid;
      var nextElement; 
      this.dataAddress = false;
      if(type=="unit"){
        this.dataListAddress = false;
        nextElement = "data";
      }
      if(type=="chapter"){
        this.dataListAddress = false;
        this.unitListAddress = false;
        this.activeunitAddress = false;
        nextElement = "unit";
      }
      if(type=="part"){
        this.dataListAddress = false;
        this.chapterListAddress = false;
        this.unitListAddress = false;
        this.activechapterAddress = false;
        this.activeunitAddress = false;
        elementdata = {
          partid: elementid,
          bookid: this.book[0].bookid
        };
        nextElement = "chapter";
      }

      var functionname = type[0].toUpperCase() + type.slice(1);
      
      this.ContentService["get"+functionname](elementdata).subscribe((res)=>{
        this.loading--;
        if(!res.error){
          this["active"+type+"Address"] = res.data[0];
          if(type=="unit"){
            this.loading++;
            this.ContentService.getData(elementid)
            .subscribe((res)=>{
              this.loading--;
              if(!res.error){
                  this.dataListAddress = res.data;
              }else{
                this.sendAlert(res.data,1);
              }
            });
          }else{
          this.getElementList(this["active"+type+"Address"][type+"id"], nextElement, true);
          }
          this.generateAddress();
        }else{
          this.sendAlert(res.data,1);
        }
      });

    }
  }

  generateAddress(){
    if(this.activepartAddress){
      this.linkAddress = this.activepartAddress.partname;
      this.linkId = this.activepartAddress.partid;
    }
    if(this.activechapterAddress){
      this.linkAddress += " / " + this.activechapterAddress.chaptername;
      this.linkId += "/" +this.activechapterAddress.chapterid;
    }
    if(this.activeunitAddress){
      this.linkAddress += " / " + this.activeunitAddress.unitname;
      this.linkId += "/" +this.activeunitAddress.unitid;
    }
    if(this.activedataAddress){
      this.linkAddress += " / " + "Element Nr. " + this.activedataAddress.dataposition;
      this.linkId += "/" +this.activedataAddress.dataid;
    }
  }

  setAddressImpressum(){
    this.linkAddress = "Autor*innenkollektiv"
    this.linkId = "kollektiv/"+this.book[0].bookid
  }

  setAddress(){
    this.resetAddress();
    this.insertAddress = {
      text: this.linkAddress,
      id: this.linkId
    }
  }

  resetAddress(){
    this.createAddress = false;
    this.dataListAddress=false;
    this.unitListAddress=false;
    this.chapterListAddress=false;
  }

  openAddress(){
    this.createAddress = {};
  }


  openMoveElement(id, moveTo){
    this.moveObject = {
      id: id,
      moveTo: moveTo
    }
  }

  moveElement(elementid,type){
    var data = {
      elementid: elementid,
      id: this.moveObject.id
    }

    for (let key in this.partList) {
      if(this.partList[key].partid==this.activepartAddress.partid){
        this.partList[key].status = true;
      }else{
        this.partList[key].status = false;
      }
    }

    this.moveObject=false;

    if(type=="part"){
      if(elementid!=this.activepart.partid){
        this.loading++;
        this.ContentService.moveChapter(data)
        .subscribe((res)=>{
            if(!res.error){
              this.activepart.partid = this.activepartAddress.partid;
              this.selectPart(elementid);
              this.loading--;
            }else{
              this.sendAlert(res.data,1);
            }
        });
      }
    }else if(type=="chapter"){
      if(elementid!=this.activechapter.chapterid){
        this.loading++;
        this.ContentService.moveUnit(data)
        .subscribe((res)=>{
            if(!res.error){
              this.activepart.partid = this.activepartAddress.partid;
              this.activechapter.chapterid = elementid;
              this.getElementList(this.activepartAddress.partid, 'chapter');
              this.selectChapter(elementid);
              this.loading--;
            }else{
              this.sendAlert(res.data,1);
            }
        });
      }
    }else{
      if(elementid!=this.activeunit.unitid){
        this.loading++;
        this.ContentService.moveData(data)
        .subscribe((res)=>{
            if(!res.error){
              this.activepart.partid = this.activepartAddress.partid;
              this.activechapter.chapterid = this.activechapterAddress.chapterid;
              this.selectUnit(elementid);
              this.activeunit.unitid = elementid;
              this.getElementList(this.activepartAddress.partid, 'chapter');
              this.getElementList(this.activechapterAddress.chapterid, 'unit');
              this.loading--;
            }else{
              this.sendAlert(res.data,1);
            }
        });
      }
    }
  }

  addReference(elementid, caretPosition, type, noinsert=false){
      var dataKey = this["get"+type+"Key"](elementid);
      if(type=="data"){
        if(this.data[dataKey].datatype==1&&this.data[dataKey].datalayout==0){
          var textelement = "datatext";
        }else{
          var textelement = "datacaption";
        }
      }else if(type=="replic"){
        var textelement = "replictext";
      }else{
      var textelement = "editorial";
      }

    if(!Array.isArray(this[type][dataKey][type+"reference"])){
      this[type][dataKey][type+"reference"] = [];
    }
    
    if(!noinsert){
      var textBefore = this[type][dataKey][textelement].substring(0,caretPosition);
      var textAfter = this[type][dataKey][textelement].substring(caretPosition);

      var newPosition = textBefore.split('<sup>').length;
      textAfter = textAfter.split('<sup>');
      var textAfterUpdated = textAfter[0];
      var referenceLength = 1;
      for(let key2 in textAfter){
        if((Number(newPosition)+Number(key2))>10){
          referenceLength=2;
        }
        if(Number(key2)!=0){
          textAfterUpdated += '<sup>' + String((Number(textAfter[key2].substring(0,referenceLength))+1)) + textAfter[key2].substring(referenceLength);
        }
      }

      this[type][dataKey][textelement] = textBefore + '<sup>' + newPosition + '</sup>' + textAfterUpdated;

      for(let key3 in this[type][dataKey][type+"reference"]){
        if(this[type][dataKey][type+"reference"][key3].referenceposition>=newPosition){
          this[type][dataKey][type+"reference"][key3].referenceposition = Number(this[type][dataKey][type+"reference"][key3].referenceposition)+1;
        }
      }
      var newReference={
        referenceposition : newPosition,
        dataid : false,
        replicid : false
      }
    }else{
      newPosition = (this[type][dataKey][type+"reference"].length)+1;
      var newReference={
        referenceposition : newPosition,
        dataid : false,
        replicid : false
      }
    }
      newReference[type+"id"] = this[type][dataKey][type+"id"];
      
      this[type][dataKey][type+"reference"].push(newReference);
      this[type][dataKey].numbersOfReference+=1;
      this.sortReferencePosition(elementid, type);
  }

  removeReference(elementid, referenceposition, type){
    this.getDataNumbersOfReference(type);
    var dataKey = this["get"+type+"Key"](elementid);
      for(let key in this[type][dataKey][type+"reference"]){
        if(this[type][dataKey][type+"reference"][key].referenceposition > referenceposition){
          this[type][dataKey][type+"reference"][key].referenceposition -= 1;
        }
      }

    if(!((this[type][dataKey][type+"reference"].length-this[type][dataKey].removedReferences)>this[type][dataKey].numbersOfReference)){

      if(type=="data"){
        if(this.data[dataKey].datatype==1&&this.data[dataKey].datalayout==0){
          var textelement = "datatext";
        }else{
          var textelement = "datacaption";
        }
      }else if(type=="replic"){
        var textelement = "replictext";
      }else{
      var textelement = "editorial";
      }

      var textSplit = this[type][dataKey][textelement].split('<sup>'+referenceposition+'</sup>');

      if(textSplit.length==1){
        textAfterUpdated = "";
      }else{
        var textAfter = textSplit[1].split('<sup>');
        var textAfterUpdated = textAfter[0];
        var referenceLength = 1;
        for(let key2 in textAfter){
          if((Number(referenceposition)+Number(key2))>9){
            referenceLength=2;
          }
          if(Number(key2)!=0){
            textAfterUpdated += '<sup>' + String((Number(textAfter[key2].substring(0,referenceLength))-1)) + textAfter[key2].substring(referenceLength);
          }
        }
      }

      this[type][dataKey][textelement] = textSplit[0] + textAfterUpdated;

    }else{
      
    }
    this[type][dataKey].removedReferences += 1;
    this.getDataNumbersOfReference(type);
  }

  sortReferencePosition(elementid, type){
    var referenceSorted = [];
    var dataKey = this["get"+type+"Key"](elementid);
        for(var i = 0;this[type][dataKey][type+"reference"].length>=i;i++){ 
          for (let key2 in this[type][dataKey][type+"reference"]) {
            if(this[type][dataKey][type+"reference"][key2].referenceposition == i){
              referenceSorted.push(this[type][dataKey][type+"reference"][key2]);
            }
          }
        }
    if(!this[type][dataKey].removedReferences){
      this[type][dataKey].removedReferences = 0;
    }
    this[type][dataKey][type+"reference"] = referenceSorted;
  }

  updateReferences(elementid,type){
    var element = {
      id : elementid,
      type : type
    }
    this.ContentService.getReference(element)
    .subscribe((res)=>{
        if(!res.error){
            var dataKey = this["get"+type+"Key"](elementid);
            this[type][dataKey][type+"reference"] = res.data;
            this[type][dataKey].removedReferences = 0;
        }else{
          this.sendAlert(res.data,1);
        }
    });
  }

  checkReferenceTextBlur(referencetext){
    console.log(referencetext)
    return this.textReplaceTagsRegex(referencetext);
  }


  // REFRENCE BLOCK FINISH

  updateComment(dataid){
    var dataKey = this.getdataKey(dataid);
    for (let key in this.data[dataKey].datacomment) {
      if(this.data[dataKey].datacomment[key].isDeleted == true){
        this.data[dataKey].datacomment.splice(key,1);
      }
    }
  }

  addComment(dataid){
    var dataKey = this.getdataKey(dataid);
    var newComment= {
    dataid : this.data[dataKey].dataid,
    commenttext : ''
    }
    if(!Array.isArray(this.data[dataKey].datacomment)){
      this.data[dataKey].datacomment = [];
    }
    this.data[dataKey].datacomment.push(newComment);
  }

  getdataKey(dataid){
    for (let key in this.data) {
      if(this.data[key].dataid == dataid){
        return key;
      }
    }
  }

  getreplicKey(replicid){
    for (let key in this.replic) {
      if(this.replic[key].replicid == replicid){
        return key;
      }
    }
  }

  getbookKey(nothing){
    return 0;
  }


  showPreview(data){
    this.previewElement=data;
    this.previewElementShow=true;

  }


  /* CONTENTCHECK */

  saveAlertFunctionName : string;
  saveAlertFunctionParam1 : any = false;
  saveAlertFunctionParam2 : any = false;
  saveAlertDisplay : boolean = false;
  
  contentCheckPart : boolean = false;
  contentCheckChapter : boolean = false;
  contentCheckUnit : boolean = false;
  contentCheckData : boolean = false;
  contentCheckDisplay : boolean = false;

  contentCheckPartBg : boolean = false;
  contentCheckChapterBg : boolean = false;
  contentCheckUnitBg : boolean = false;

  savedContentCheck(functionName,functionParam1,functionParam2=''){
    this.saveAlertFunctionName = functionName;
    this.saveAlertFunctionParam1 = functionParam1;
    this.saveAlertFunctionParam2 = functionParam2;
    this.saveAlertDisplay = true;
    this.contentCheckData=false;

    this.contentCheckPartBg = this.contentCheckPart;
    this.contentCheckChapterBg = this.contentCheckChapter;
    this.contentCheckUnitBg = this.contentCheckUnit;
    
    if(this.data){
      for (let key in this.data) {
        this.data[key].contentCheckTextBg = false;
        if(this.data[key].contentCheckTextClicked){
          if(this.data[key].contentCheckAnalysis==true){
            this.contentCheckData=true;
            this.data[key].contentCheckTextBg = true;
          }else if(this.data[key].contentCheckText==true){
            this.contentCheckData=true;
            this.data[key].contentCheckTextBg = true;
          }
        }
      }
    }
    if(this.contentCheckPart || this.contentCheckChapter || this.contentCheckUnit || this.contentCheckData){
      this.contentCheckDisplay = true;
    }else{
      this.savedContentCheckYes();
    }
  }

  savedContentCheckYes(){
    this.contentCheckDisplay = false;
    this.contentCheckPart = false;
    this.contentCheckDisplay = false;
    this.contentCheckChapter = false;
    this.contentCheckUnit = false;
    this.contentCheckPartBg = false;
    this.contentCheckChapterBg = false;
    this.contentCheckUnitBg = false;
    if(this[this.saveAlertFunctionName]) {
      if(this.saveAlertFunctionParam2!=''){
      this[this.saveAlertFunctionName](this.saveAlertFunctionParam1,this.saveAlertFunctionParam2);
      }else{
        this[this.saveAlertFunctionName](this.saveAlertFunctionParam1,this.saveAlertFunctionParam2);
      }
    }
  }


  savedContentCheckNo(){
    this.contentCheckDisplay = false;
  }

  loading : number = 0;

  savedContentSuccess(state, text, id){
    var data = {
      logstate : state,
      logtext : text,
      dataid : id
    }
    this.ContentService.writeLog(data)
    .subscribe((res)=>{
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  log(text){
    console.log(text);
  }

  loadPDFPreviewPages(type, id){
    var data = {
      bookid : this.book[0].bookid,
      type : type,
      id : id
    }
    if(this.iframe)this.iframe.nativeElement.src = "";
    this.loading++;
    this.previewElementShow = true;
    this.ContentService.pdfPreviewCalculate(data).subscribe((res)=>{
        if(!res.error){
          this.ContentService.pdfPreviewPages(data).subscribe((res)=>{
              if(!res.error){
                this.loading--;
                this.showPDFPreview(res.data.firstpage, res.data.lastpage)
              }else{
                this.sendAlert(res.data,1);
              }
          });
        }else{
          this.sendAlert(res.data,1);
        }
    });
  }

  loadPDFPreviewList(){
    this.previewElementShow = true;

    if(this.iframe)this.iframe.nativeElement.src = "";
    if(this.previewListType=="page"){
      if(!this.previewListLastpage)this.previewListLastpage=this.previewListFirstpage;
      this.showPDFPreview(this.previewListFirstpage, this.previewListLastpage);
    }else{
      if(this.previewListType=="editorial")this.previewListId=this.book[0].bookid;
      this.loadPDFPreviewPages(this.previewListType, this.previewListId)
    }

  }

  showPDFPreview(firstpage, lastpage){
    this.previewElementFirstpage = firstpage;
    this.previewElementLastpage = lastpage;
    
    var color = true;
    if(this.previewListReplacecontent){
      color = false;
    }

    var url_code = this.generateRandomString()
    var data = {
      bookid: this.book[0].bookid,
      firstpage: firstpage,
      lastpage: lastpage,
      color: color,
      url_code: url_code
    }

    this.loading++;
    this.ContentService.generatePdf(data)
    .subscribe((res)=>{
      console.log(res)
      this.loading--;
      this.previewElementFileLink = AppConstants.restURL+"pdf/pdfs/cache-"+url_code+".pdf"
      if(this.iframe)this.iframe.nativeElement.src = this.previewElementFileLink
    });
  
  }

  workModeChange(){
    this.workMode=!this.workMode;
    this.previewListReplacecontent = false;
    if(!this.workMode){
      this.previewElementSettings=false;
      this.hidePDFPreview();
    }else{
      this.showPDFPreviewSettings();
    }
  }

  hidePDFPreview(){
    if(!this.previewElementShow){
      this.previewElementSettings=false;
      this.previewListList=false;
    }
    this.previewElementShow=false;
    this.previewElementLink='';
    this.previewElementFirstpage = 0;
    this.previewElementLastpage = 0;
  }

  showPDFPreviewSettings(){
    this.previewElementSettings = true;
    if(this.book){
      this.getPDFPreviewList();
    }
  }

  getPDFPreviewList(){
    this.previewListchapter = Array();
    this.previewListunit = Array();
    this.previewListreplic = Array();

    this.loading++;
    this.ContentService.getReplic(this.book[0].bookid)
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
          this.previewListreplic = res.data;
      }else{
        this.sendAlert(res.data,1);
      }
    });

    this.loading++;
    var element = {
      id : this.book[0].bookid,
      type : 'part'
    }
    this.ContentService.getElementList(element).subscribe((res)=>{
      if(!res.error){
        this.loading--;
        var partlistData = res.data;
        var partlistDataRemoved = [];

        for (let key in partlistData) {
          if(partlistData[key].partname!="Editorial"&&partlistData[key].partid!=0){
            partlistDataRemoved.push(partlistData[key]);
          }
        }

        this.previewListpart = partlistDataRemoved;

          for (let key in this.previewListpart) {
            this.loading++;

            var element = {
              id : this.previewListpart[key].partid,
              type : 'chapter'
            }
            this.ContentService.getElementList(element).subscribe((res)=>{
              if(!res.error){
                this.loading--;
                  for (let key in res.data) {
                    this.loading++;
                    this.previewListchapter.push(res.data[key]);
                    var element = {
                      id : res.data[key].chapterid,
                      type : 'unit'
                    }
                    this.ContentService.getElementList(element).subscribe((res)=>{
                      if(!res.error){
                        this.loading--;
                        for (let key in res.data) {
                          this.previewListunit.push(res.data[key]);
                        }
                      }else{
                        this.sendAlert(res.data,1);
                      }
                    });
                  }
              }else{
                this.sendAlert(res.data,1);
              }
            });
          }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  selectPDFPreviewList(type){
    this.previewListType=type;
    this.previewListList = Array();
    if(type!='page'&&type!='editorial'){
        if(type=="replic"){
          for (let key in this["previewList"+type]) {
            this.previewListList[key] = {
              name: this.previewListreplic[key].replicheadline,
              id: this.previewListreplic[key].replicid
            }
          }
        }else{
          for (let key in this["previewList"+type]) {
            this.previewListList[key] = {
              name: this["previewList"+type][key][type+"name"],
              id: this["previewList"+type][key][type+"id"]
            }
          }
        }
    }
  }

  generateRandomString():string{
      let outString: string = '';
      let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
      for (let i = 0; i < 12; i++) {
  
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
  
      }
  
      return outString;
  }
}




