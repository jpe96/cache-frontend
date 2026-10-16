import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }

  getInformation(){
    return this.http.get<any>(this._restURL+'information/getInformation.php');
  }  

  saveInformation(information){
    return this.http.post<any>(this._restURL+'information/saveInformation.php',information);
  }
}
