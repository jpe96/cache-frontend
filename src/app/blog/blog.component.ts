import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { BlogService } from './blog.service';
import { AlertService } from "../alert/alert.service";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css','../app.component.css'],
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
export class BlogComponent implements OnInit {

  @ViewChild('iframe') iframe: ElementRef;

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

  extraButtonAddline = {
    name: 'addline',
    icon: 'addrow',
    exec: function (editor) {
      editor.selection.insertHTML("&#8676;");
    }
  }

  jodit_config = {
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

  jodit_config_reference = {
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    preset: 'inline',
    defaultActionOnPaste: "insert_only_text",
    disablePlugins: 'autofocus,backspace,imageProcessor,imageProperties,sticky,stat,xpath,tooltip',
    placeholder: 'Gib hier die Referenz ein...'
  };

  alert:any;

  previewElementShow:boolean = false;

  showEditBlog:boolean = true;
  showEditTag:boolean = true;
  bloglist:any;
  taglist:any;
  repliclist:any;
  loading:number=0;
  previewElementLastpage:number;
  imageupload_replace_imageid: number = 0;

  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  constructor(
    private blogService: BlogService,
    private alertService: AlertService,
    public datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.getBloglist();
    this.getTaglist();
    this.getRepliclist();
    this.alertService.currentAlert.subscribe(alert => this.alert = alert)
  }

  getBlogKey(blog_dataid){
    for (let key in this.bloglist) {
      if(this.bloglist[key].blog_dataid == blog_dataid){
        return key;
      }
    }
  }
  getBloglist(){
    var data = {};
    this.loading++;
    this.blogService.blogFunction(data, "getBloglist")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.bloglist=res.data;
        for(let key in this.bloglist){
          if(this.bloglist[key].blog_official==0)this.bloglist[key].blog_official=false;
          this.bloglist[key].blog_title = this.bloglist[key].blog_title.replace(/\&shy;/gi, "");
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }
  getRepliclist(){
    var data = {};
    this.loading++;
    this.blogService.blogFunction(data, "getRepliclist")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.repliclist=res.data;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addBlog(){
    var data = {};
    this.loading++;
    this.blogService.blogFunction(data, "addBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getBloglist();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteBlog(dataid){
    var data = {
      blog_dataid : dataid
    };
    this.loading++;
    this.blogService.blogFunction(data, "deleteBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getBloglist();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addTagBlogClick(tag,blogid){
    var blogKey = this.getBlogKey(blogid);
    var blog_tag = {
      blog_dataid : blogid,
      blog_tagid : tag.options[tag.selectedIndex].value,
      blog_tagname : tag.options[tag.selectedIndex].text
    }
    this.bloglist[blogKey].blog_taglist.push(blog_tag);
  }

  saveBlog(data){
    if(data.blog_official){
      data.blog_official = 1;
    }else{
      data.blog_official = 0;
    }
    data.blog_leadtext = this.textReplaceTagsRegex(data.blog_leadtext);
    this.loading++;
    data.blog_date = this.datepipe.transform(data.blog_date, 'yyyy-MM-dd');
    this.blogService.blogFunction(data, "saveBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
            for(let key in data.blog_taglist){
              this.addTagBlog(data.blog_taglist[key]);
            }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addTagBlog(data){
    this.loading++;
    this.blogService.blogFunction(data, "addTagBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
            
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteTagBlog(blogid, index){
    var blogKey = this.getBlogKey(blogid);
    this.bloglist[blogKey].blog_taglist.splice(index, 1);
  }

  uploadHeroImage(blog, image){
    var blogKey = this.getBlogKey(blog.blog_dataid);
    var blog = this.bloglist[blogKey];
    blog.uploadHeroImageError = false;
    if (image.length === 0){
      return;
    } 
      var mimeType = image[0].type;
      if(!mimeType.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG)$")){
        blog.uploadHeroImageRun = true;
          this.blogService.uploadFile(image[0])
          .subscribe((res)=>{
            blog.uploadHeroImageState = res;
            if(!res.status){
              if(!res.error){
                if(res.data){
                  blog.uploadHeroImageRun = false;
                  blog.blog_heroimage = res.data;
                  blog.uploadHeroImageState = false;
                  this.saveBlog(blog);
                }
              }else{
                this.sendAlert(res.data,1);
              }
            }
          });
      }else{
        blog.uploadHeroImageError = true;
        return;
      }
  }

  addListBlog(blog_listtype,blog){
    var blogKey = this.getBlogKey(blog.blog_dataid);
    var data = {
      blog_dataid : blog.blog_dataid,
      blog_listtype : blog_listtype
    }
    this.loading++;
    this.blogService.blogFunction(data, "addListBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        var listelement:any;

        listelement = {
          blog_dataid : blog.blog_dataid,
          blog_listtype : blog_listtype,
          blog_listposition : res.data.maxposition,
          blog_listelementid : res.data.lastid,
          data : []
        }

        if(blog_listtype==1){
          listelement.data[0] = {blog_texttext: "", referencelist: []};
        }
        if(blog_listtype==4){
          listelement.data[0] = {blog_medialink: "", blog_mediasource: ""};
        }
        if(blog_listtype==10){
          listelement.data[0] = {blog_replicid: 0};
        }
        this.bloglist[blogKey].blog_list.push(listelement);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteListBlog(blog_listelementid, blog_dataid, index){
    var blogKey = this.getBlogKey(blog_dataid);
    let blog_listposition = this.bloglist[blogKey].blog_list[index].blog_listposition;
    var data = {
      blog_listelementid : blog_listelementid,
      blog_listposition : blog_listposition,
      blog_dataid : blog_dataid
    }
    this.loading++;
    this.blogService.blogFunction(data, "deleteListBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.bloglist[blogKey].blog_list.splice(index, 1);
        for(let key in this.bloglist[blogKey].blog_list){
          if(this.bloglist[blogKey].blog_list[key].blog_listposition>blog_listposition){
            this.bloglist[blogKey].blog_list[key].blog_listposition--;
          }
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  changeListPosition(blogKey, listKey ,add){
    var blog = this.bloglist[blogKey];
    var list = this.bloglist[blogKey].blog_list[listKey];
    let blog_listposition_new = Number(list.blog_listposition)+Number(add);
    let blog_listposition_old = list.blog_listposition
    if(blog_listposition_new>=0&&blog_listposition_new<blog.blog_list.length){
      var data = {
        blog_dataid : blog.blog_dataid,
        blog_listposition_old : blog_listposition_old,
        blog_listposition_new : blog_listposition_new,
        blog_listelementid: list.blog_listelementid
      }
      this.loading++;
      this.blogService.blogFunction(data, "changeListPosition")
      .subscribe((res)=>{
        this.loading--;
        if(!res.error){
          var changedElement = [];
          var effectedElement = []; 
          for (let key in blog.blog_list){
            if(blog.blog_list[key].blog_listposition==blog_listposition_new){
              blog.blog_list[key].blog_listposition = blog_listposition_old;
              effectedElement = blog.blog_list[key];
            }
            if(blog.blog_list[key].blog_listelementid==list.blog_listelementid){
              blog.blog_list[key].blog_listposition = blog_listposition_new;
              changedElement = blog.blog_list[key];
            }
          }
          blog.blog_list[blog_listposition_new] = changedElement;
          blog.blog_list[blog_listposition_old] = effectedElement;
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }
  }

  /* BLOG LIST FUNCTIONS */

  saveReplicBlog(blog_replicid, blog_dataid){
    var data = {
      blog_replicid : blog_replicid,
      blog_dataid : blog_dataid,
    }
    this.loading++;
    this.blogService.blogFunction(data, "saveReplicBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveTextBlog(list){
    var data = {
      blog_listelementid : list.blog_listelementid,
      blog_texttext : list.data[0].blog_texttext,
      blog_numbersofreference : (list.data[0].numbersOfReference)
    }
    this.loading++;

    this.blogService.blogFunction(data, "saveTextBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        for (let key in list.data[0].referencelist){
          if(!list.data[0].referencelist[key].isDeleted){
            this.saveReferenceBlog(list.blog_listelementid, list.data[0].referencelist[key]);
          }else{

          }
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveReferenceBlog(blog_listelementid, reference){
    var data = {
      blog_listelementid : blog_listelementid,
      blog_referencetext : this.textReplaceTagsRegex(reference.blog_referencetext),
      blog_referenceposition : reference.blog_referenceposition,
    }
    this.loading++;
    this.blogService.blogFunction(data, "saveReferenceBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  changeImagetypeBlog(blogKey, listKey, blog_listtype){
    var data = {
      blog_listelementid : this.bloglist[blogKey].blog_list[listKey].blog_listelementid,
      blog_listtype : blog_listtype
    }
    this.loading++;
    this.blogService.blogFunction(data, "changeImagetypeBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.bloglist[blogKey].blog_list[listKey].blog_listtype = blog_listtype;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addImageBlogLink(blogKey, listKey){
    var data = {
      blog_listelementid : this.bloglist[blogKey].blog_list[listKey].blog_listelementid,
      blog_imagelink : this.bloglist[blogKey].blog_list[listKey].newimageLink
    }
    this.loading++;
    this.blogService.blogFunction(data, "addImageBlogLink")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){

        var imageelement = {
          blog_imagelink : this.bloglist[blogKey].blog_list[listKey].newimageLink,
          blog_imageposition : res.data.maxposition,
          blog_imageid : res.data.lastid
        }

        this.bloglist[blogKey].blog_list[listKey].newimageLink = "";
        this.bloglist[blogKey].blog_list[listKey].data.push(imageelement);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  uploadImageBlog(blogKey, listKey, image){

    var list = this.bloglist[blogKey].blog_list[listKey];
    list.uploadImageError = false;
    if (image.length === 0){
      return;
    } 
      var mimeType = image[0].type;
      if(!mimeType.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG)$")){
        list.uploadImageRun = true;
          this.blogService.uploadFile(image[0])
          .subscribe((res)=>{
            list.uploadImageState = res;
            if(!res.status){
              if(!res.error){
                if(res.data){
                  list.uploadImageState = false;
                  list.uploadImageRun = false;
                  if(this.imageupload_replace_imageid!=0){
                    for(var element of list.data){
                      if (element.blog_imageid && element.blog_imageid==this.imageupload_replace_imageid){
                        element.blog_imagelinkreplace = res.data
                        this.saveImageReplaceBlog(element)
                      }
                    }
                    this.imageupload_replace_imageid = 0
                  }else{
                    list.newimageLink = res.data;
                    this.addImageBlogLink(blogKey, listKey);
                  }
                }
              }else{
                this.sendAlert(res.data,1);
              }
            }
          });
      }else{
        list.uploadImageError = true;
        return;
      }
  }

  deleteImageBlog(blogKey, listKey, imageKey){
    let blog_imageposition = this.bloglist[blogKey].blog_list[listKey].data[imageKey].blog_imageposition;
    var data = {
      blog_listelementid : this.bloglist[blogKey].blog_list[listKey].blog_listelementid,
      blog_imageposition : blog_imageposition
    }
    this.loading++;
    this.blogService.blogFunction(data, "deleteImageBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.bloglist[blogKey].blog_list[listKey].data.splice(imageKey, 1);

        for(let key in this.bloglist[blogKey].blog_list[listKey].data){
          if(this.bloglist[blogKey].blog_list[listKey].data[key].blog_imageposition>blog_imageposition){
            this.bloglist[blogKey].blog_list[listKey].data[key].blog_imageposition--;
          }
        }
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  changeImagePosition(blogKey, listKey, imageKey ,add){
    var blog = this.bloglist[blogKey];
    var list = this.bloglist[blogKey].blog_list[listKey];
    var image = this.bloglist[blogKey].blog_list[listKey].data[imageKey];
    let blog_imageposition_new = Number(image.blog_imageposition)+Number(add);
    let blog_imageposition_old = image.blog_imageposition;
    let blog_imageid = image.blog_imageid;
    if(blog_imageposition_new>=0&&blog_imageposition_new<list.data.length){
      var data = {
        blog_listelementid : list.blog_listelementid,
        blog_imageposition_old : blog_imageposition_old,
        blog_imageposition_new : blog_imageposition_new,
        blog_imageid: blog_imageid
      }
      this.loading++;
      this.blogService.blogFunction(data, "changeImagePosition")
      .subscribe((res)=>{
        this.loading--;
        if(!res.error){
          var changedElement = [];
          var effectedElement = []; 
          for (let key in list.data){
            if(list.data[key].blog_imageposition==blog_imageposition_new){
              list.data[key].blog_imageposition = blog_imageposition_old;
              effectedElement = list.data[key];
            }
            if(this.bloglist[blogKey].blog_list[listKey].data[key].blog_imageid==blog_imageid){
              list.data[key].blog_imageposition = blog_imageposition_new;
              changedElement = list.data[key];
            }
          }
          this.bloglist[blogKey].blog_list[listKey].data[blog_imageposition_new] = changedElement;
          this.bloglist[blogKey].blog_list[listKey].data[blog_imageposition_old] = effectedElement;
        }else{
          this.sendAlert(res.data,1);
        }
      });
    }
  }

  saveImageReplaceBlog(image){
    var data = {
      blog_imageid : image.blog_imageid,
      blog_imagelinkreplace : image.blog_imagelinkreplace
    }
    console.log(data)
    this.loading++;
    this.blogService.blogFunction(data, "saveImageReplaceBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveImageBlog(image){
    var data = {
      blog_imageid : image.blog_imageid,
      blog_imagesource : image.blog_imagesource
    }
    this.loading++;
    this.blogService.blogFunction(data, "saveImageBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }


  saveMediaBlogCheck(blogKey, listKey){
    var list = this.bloglist[blogKey].blog_list[listKey];
    list.uploadMediaError = false;
    let blog_medialink = list.newmedialink;
    var blog_mediatype = 0;
    this.loading++;
    this.blogService.checkDataLink(blog_medialink)
    .subscribe((res)=>{
      if(!res.error){
        this.loading--;
        var answer = res.data;
        if(answer==0){
          list.uploadMediaError = true;
        }else{
          blog_mediatype = 0;
            if(!answer.search(".*\.(jpg|JPG|jpeg|JPEG|png|PNG)$")) blog_mediatype=2; //Datatype image
            if(!answer.search(".*\.(mp3|MP3|mpeg|MPEG)$")) blog_mediatype=3; //Datatype audio
            if(!answer.search(".*\.(mov|MOV|mp4|MP4)$")) blog_mediatype=4; //Datatype video
            if(!answer.search(".*\.(pdf|PDF)$")) blog_mediatype=5; //Datatype pdf
            if(answer=="youtube"){
              blog_mediatype=6;
              blog_medialink = blog_medialink.replace("watch?v=","embed/");
            }  
            if(answer=="vimeo"){
              blog_mediatype=6;
              blog_medialink = blog_medialink.replace("www.","").replace("vimeo.com/","player.vimeo.com/video/");
            }
          if(list.previewtype==0) {
            list.uploadMediaError = true;
          }
        }
        this.saveMediaBlog(blogKey,listKey,blog_mediatype, blog_medialink)
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  log(text){
    console.log(text)
  }

  saveMediaBlog(blogKey, listKey, blog_mediatype, blog_medialink, blog_mediasource = ''){
    var list = this.bloglist[blogKey].blog_list[listKey];
    list.uploadMediaError = false;

    if(list.uploadMediaError){
      return;
    }

    var data = {
      blog_listelementid : list.blog_listelementid,
      blog_medialink : blog_medialink,
      blog_mediatype : blog_mediatype,
      blog_mediasource : blog_mediasource
    }
    this.loading++;
    this.blogService.blogFunction(data, "saveMediaBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        list.data[0].blog_medialink = blog_medialink;
        list.data[0].blog_mediatype = blog_mediatype;
        list.newmedialink = "";
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }
  

  uploadMediaBlog(blogKey, listKey, file){
    var list = this.bloglist[blogKey].blog_list[listKey];
    list.uploadMediaError = false;
    if (file.length === 0){
      return;
    } 
      var mimeType = file[0].type;
      if(!mimeType.search(".*\.(mp4|MP4|mpeg|MPEG|mov|MOV|mp3|MP3)$")){
        list.uploadMediaRun = true;
          this.blogService.uploadFile(file[0])
          .subscribe((res)=>{
            list.uploadMediaState = res;
            if(!res.status){
              if(!res.error){
                if(res.data){
                  list.uploadMediaRun = false;
                  list.uploadMediaState = false;
                  list.newmedialink = res.data
                  this.saveMediaBlogCheck(blogKey, listKey);
                }
              }else{
                this.sendAlert(res.data,1);
              }
            }
          });
      }else{
        list.uploadMediaError = true;
        return;
      }
  }

  deleteMediaBlog(blogKey, listKey){
    var list = this.bloglist[blogKey].blog_list[listKey];
    var data = {
      blog_listelementid : list.blog_listelementid,
      blog_medialink : '',
      blog_mediasource : '',
      blog_mediatype : 0
    }
    this.loading++;
    this.blogService.blogFunction(data, "saveMediaBlog")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        list.data[0].blog_medialink = '';
        list.data[0].blog_mediatype = 0;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }
  /* REFRENCE FUNCTIONS */

  insertReferenceBlog(event, list, blogKey, listKey){
    if(list.data[0].insertReference){
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
      this.insertReferenceBlogAdd(caretOffset, blogKey, listKey);
    }
  }
 
  insertReferenceBlogAdd(caretPosition, blogKey, listKey, noinsert = false){
    var list = this.bloglist[blogKey].blog_list[listKey];
    var data = list.data[0];
    if(!Array.isArray(data.referencelist)){
      data.referencelist = [];
    }
    
    var newReference:any;

    if(!noinsert){
      var textBefore = data.blog_texttext.substring(0,caretPosition);
      var textAfter = data.blog_texttext.substring(caretPosition);

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

      data.blog_texttext = textBefore + '<sup>' + newPosition + '</sup>' + textAfterUpdated;

      for(let key3 in data.referencelist){
        if(!data.referencelist[key3].isDeleted){
          if(data.referencelist[key3].blog_referenceposition>=newPosition){
            data.referencelist[key3].blog_referenceposition = Number(data.referencelist[key3].blog_referenceposition)+1;
          }
        }
      }
      newReference={
        blog_referenceposition : newPosition,
        blog_referencetext : '',
        blog_listelementid : false
      }
    }else{
      newReference={
        blog_referenceposition : (data.referencelist.length)+1,
        blog_referencetext : '',
        blog_listelementid : false
      }
    }
    newReference.blog_listelementid = list.blog_listelementid;
    data.referencelist.push(newReference);
    data.numbersOfReference+=1;
    this.sortReferencePosition(blogKey, listKey);
  }

  removeReference(blogKey, listKey, referenceposition){
    var data = this.bloglist[blogKey].blog_list[listKey].data[0];
    this.getDataNumbersOfReference(blogKey, listKey);
      for(let key in data.referencelist){
        if(data.referencelist[key].blog_referenceposition > referenceposition){
          data.referencelist[key].blog_referenceposition -= 1;
        }
      }

    if(!((data.referencelist.length-data.removedReferences)>data.numbersOfReference)){

      var textSplit = data.blog_texttext.split('<sup>'+referenceposition+'</sup>');

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

      data.blog_texttext = textSplit[0] + textAfterUpdated;

    }
    data.removedReferences += 1;
    this.getDataNumbersOfReference(blogKey, listKey);
  }

  sortReferencePosition(blogKey, listKey){
    var data = this.bloglist[blogKey].blog_list[listKey].data[0];
    var referenceSorted = [];
        for(var i = 0;data.referencelist.length>=i;i++){ 
          for (let key2 in data.referencelist) {
            if(data.referencelist[key2].blog_referenceposition == i){
              referenceSorted.push(data.referencelist[key2]);
            }
          }
        }
    if(!data.removedReferences){
      data.removedReferences = 0;
    }
    data.numbersOfReference = referenceSorted.length;
    data.referencelist = referenceSorted;
  }

  getDataNumbersOfReference(blogKey, listKey){
    var data = this.bloglist[blogKey].blog_list[listKey].data[0];
    if(!data.removedReferences){
      data.removedReferences=0;
    }
    data.numbersOfReference = data.blog_texttext.split('<sup>').length-1;
    let j2 = data.numbersOfReference-(data.referencelist.length-data.removedReferences);
    for(var i2 = 0; i2 < j2; i2++) {
      this.insertReferenceBlogAdd(0, blogKey, listKey, true);
    }
  }

  /* TAG FUNCTIONS */
  getTaglist(){
    var data = {};
    this.loading++;
    this.blogService.blogFunction(data, "getTaglist")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.taglist=res.data;
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  addTag(){
    var data = {};
    this.loading++;
    this.blogService.blogFunction(data, "addTag")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getTaglist();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteTag(dataid){
    var data = {
      blog_tagid : dataid
    };
    this.loading++;
    this.blogService.blogFunction(data, "deleteTag")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
        this.getTaglist();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  saveTag(data){
    this.loading++;
    this.blogService.blogFunction(data, "saveTag")
    .subscribe((res)=>{
      this.loading--;
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  /* HELPERS */
  textReplaceTagsRegex(datatext){
    var datatext = datatext.replace(/<br>/g,"<br/>")
                      .replace(/<\/p>/g,"<br/>")
                      .replace(/(?=<!--)([\s\S]*?-->)/g,"")
                      .replace(/<i[^>]*>/g,"<i>")
                      .replace(/<em[^>]*>/g,"<i>")
                      .replace(/<\/em>/g,"</i>")
                      .replace(/<\/?(?!(?:i|a|sup|br)\b)[a-z](?:[^>"']|"[^"]*"|'[^']*')*>/g, "")
                      .replace(/(<sup([^>]*)>)+/g,"<sup>")
                      .replace(/(<\/sup>)+/g,"</sup>")
                      .replace(/&nbsp;/g," ")
                      .replace(/&amp;/g,"&")
                      .replace(/\r?\n|\r/g," ")
                      .replace(/\t/g,"")
                      .replace(/\s+/g,' ');
  return datatext;
  }

  // PDF-Functions

  loadPDFPreviewPages(blogid){
    blogid = "b"+blogid;
    var data = {
      bookid : blogid,
      type : "blog",
      id : 1
    }
    if(this.iframe)this.iframe.nativeElement.src = "";
    this.loading++;
    this.blogService.pdfPreviewCalculate(data).subscribe((res)=>{
      
        if(!res.error){
          this.blogService.pdfPreviewPages(data).subscribe((res)=>{
            if(!res.error){
              
              var url_code = this.generateRandomString()
              this.previewElementLastpage = res.data.lastpage;
              var data = {
                bookid: blogid,
                firstpage: 1,
                lastpage: this.previewElementLastpage,
                color: false,
                url_code: url_code
              }

              this.previewElementShow = true;
          
              this.blogService.generatePdf(data)
              .subscribe((res)=>{
                this.loading--;
                if(this.iframe)this.iframe.nativeElement.src = "https://cache.ch/backend/api/pdf/pdfs/cache-"+url_code+".pdf"
              });
            }else{
              this.sendAlert(res.data,1);
            }
        });
          
  
        }else{
          this.sendAlert(res.data,1);
        }
    });
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
