import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants} from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }


  getAddresses(){
    return this.http.get<any>(this._restURL+'newsletter/getAddresses.php');
  }  

  deleteAddresses(selectedAddresses){
    return this.http.post<any>(this._restURL+'newsletter/deleteAddresses.php',selectedAddresses);
  }


  getTemplate(){
    return this.http.get<any>(this._restURL+'newsletter/getTemplate.php');
  }  

  saveTemplate(templatetext){
    return this.http.post<any>(this._restURL+'newsletter/saveTemplate.php',templatetext);
  }

}
