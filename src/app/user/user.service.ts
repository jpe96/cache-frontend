import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants} from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }


  getUser(){
    return this.http.get<any>(this._restURL+'user/getUser.php');
  }  

  deleteAddresses(selectedAddresses){
    return this.http.post<any>(this._restURL+'user/deleteAddresses.php',selectedAddresses);
  }

  getBook(){
    return this.http.get<any>(this._restURL+'book/getBooklist.php');
  }

  createUser(userdata:any){
    return this.http.post<any>(this._restURL+'user/createUser.php',userdata);
  }

  deleteUser(userid){
    return this.http.post<any>(this._restURL+'user/deleteUser.php',userid);
  }

}
