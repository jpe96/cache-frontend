import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants} from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class BookService {

  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }


  getBooklist(){
    return this.http.get<any>(this._restURL+'book/getBooklist.php');
  }  

  setState(bookstate){
    return this.http.post<any>(this._restURL+'book/setState.php',bookstate);
  }

  setStateShow(bookstate){
    return this.http.post<any>(this._restURL+'book/setStateShow.php',bookstate);
  }
  
  setLanguage(bookstate){
    return this.http.post<any>(this._restURL+'book/setLanguage.php',bookstate);
  }

    writeLog(data){
    return this.http.post<any>(this._restURL+'log/writeLog.php',data);
  }

  saveBook(book){
    return this.http.post<any>(this._restURL+'book/saveBook.php',book);
  }

  changePosition(bookobject){
    return this.http.post<any>(this._restURL+'book/changePosition.php',bookobject);
  }

  createBook(book){
    return this.http.post<any>(this._restURL+'book/createBook.php',book);
  }

  deleteBook(bookid){
    return this.http.post<any>(this._restURL+'book/deleteBook.php',bookid);
  }

}
