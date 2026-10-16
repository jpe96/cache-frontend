import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../config/constants'
@Injectable({
  providedIn: 'root'
})
export class LogService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }
  
  getLogData(){
    return this.http.get<any>(this._restURL+'log/getLog.php');
  }

}
