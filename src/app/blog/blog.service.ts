import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AppConstants } from '../config/constants'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }

  blogFunction(input, restname){
    var data = input;
    data.restname = restname;
    return this.http.post<any>(this._restURL+'blog/blogFunction.php',data);
  }

  checkDataLink(datalink){
    return this.http.post<any>(this._restURL+'data/checkDataLink.php',datalink);
  }

  uploadFile(file){
    const formData: FormData = new FormData();
    formData.append('file',  file);
    return this.http.post<any>(this._restURL+'blog/fileUpload.php',formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData))
    );
  }

  private getEventMessage(event: HttpEvent<any>, formData) {

    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
		break;
      case HttpEventType.Response:
        return this.apiResponse(event);
		break;
      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }

  private apiResponse(event) {
    return event.body;
  }

  pdfPreviewCalculate(data){
    return this.http.post<any>(this._restURL+'pdf/calculatePdfPages.php',data);
  }
  
  pdfPreviewPages(data){
    return this.http.post<any>(this._restURL+'pdf/getPdfPages.php',data);
  }


  generatePdf(data){
    return this.http.post<any>(this._restURL+'pdf/generatePdfPages.php',data);
  }
}