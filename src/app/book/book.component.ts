import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from './book.service';
import { NgModel } from '@angular/forms';
import { AlertService } from "../alert/alert.service";
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css','../app.component.css'],
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
    ])
  ]
})
export class BookComponent implements OnInit {

  constructor(
    private formBuilder: UntypedFormBuilder,
    private bookService: BookService,
    private alertService: AlertService
  ) {};
  booknameUsed : boolean = false;
  isSubmitted : boolean = false;
  booklist : any;

  deleteBookId : number;
  deleteBookForm:boolean = false;
  deleteBookName:string;

  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  ngOnInit() {
    this.getBooklist();
    this.alertService.currentAlert.subscribe(alert => this.alert = alert);

  }


  savedContentSuccess(state, text, id){
    var data = {
      logstate : state,
      logtext : text,
      dataid : id
    }
    this.bookService.writeLog(data)
    .subscribe((res)=>{
      if(!res.error){
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  deleteBook(bookid){
    this.bookService.deleteBook(bookid)
    .subscribe((res)=>{
      if(!res.error){
        this.getBooklist();
        this.deleteBookForm = false;
        this.savedContentSuccess("deleted","book", bookid);
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getBooklist(){
    this.bookService.getBooklist()
    .subscribe((res)=>{
      if(!res.error){
        this.booklist = res.data;
      }
    });
  }


  saveBook(bookid){
    var i = 0;
    var bookKey = this.getbookId(bookid);
      this.bookService.saveBook(this.booklist[bookKey])
      .subscribe((res)=>{
        if(!res.error){
          this.booklist[bookKey].showEdit=false;
          this.savedContentSuccess("saved","book", bookid);
        }else{
          this.sendAlert(res.data,1);
        }
      });
  }

  createBook(){
    this.bookService.createBook("Neue Ausgabe").subscribe((res)=>{
        if(!res.error){
          this.getBooklist();
          this.savedContentSuccess("created","book", 0);
        }else{
          this.sendAlert(res.data,1);
        }
    });
  }

  bookTextReplaceTags(bookid){
    var dataKey = this.getbookId(bookid);
    this.booklist[dataKey].editorial = this.booklist[dataKey].editorial.replace(/<p[^>]*>/g, "").replace("</p>","<br/>").replace(/\r?\n|\r/g,"").replace(/\t/g,"");
  }

  getbookId(bookid){
    for (let key in this.booklist) {
      if(this.booklist[key].bookid == bookid){
        return key;
      }
    }
  }

  changeOrder(bookindex, action){
    let nextindex = 0
    if(action=="up"){
      if(this.booklist[bookindex].bookorder == 1) return
      nextindex = bookindex-1
    }else{
      if(this.booklist[bookindex].bookorder == this.booklist[bookindex].length) return
      nextindex = bookindex+1
    }
    let bookid1 = this.booklist[bookindex].bookid
    let bookorder1 = this.booklist[bookindex].bookorder
    let bookid2 = this.booklist[nextindex].bookid
    let bookorder2 = this.booklist[nextindex].bookorder
    var bookobject = {
      bookid1: bookid1,
      bookorder1: bookorder1,
      bookid2: bookid2,
      bookorder2: bookorder2
    }
    this.bookService.changePosition(bookobject)
      .subscribe((res)=>{
        if(!res.error){
          this.getBooklist();
          this.savedContentSuccess("changedOrder","book", 0);
        }
      });

  }

}
