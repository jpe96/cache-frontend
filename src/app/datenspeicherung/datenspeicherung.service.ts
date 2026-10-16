import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class DatenspeicherungService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }

  getCsvChapterlist(){ 
    return this.http.get<any>(this._restURL+'datenspeicherung/csvChapterlist.php');
  }  

  getCsvRepliclist(){ 
    return this.http.get<any>(this._restURL+'datenspeicherung/csvRepliclist.php');
  }  

  generateCSV(){ 
    return this.http.get<any>(this._restURL+'datenspeicherung/generateCSV.php');
  }  
}
