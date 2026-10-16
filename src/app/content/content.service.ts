import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AppConstants } from '../config/constants'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  _restURL : string;

  constructor(private http: HttpClient) {
    this._restURL = AppConstants.restURL;
  }

  getBooklist(){
    return this.http.get<any>(this._restURL+'book/getBooklist.php');
  }  

  getEpilog(){
    return this.http.get<any>(this._restURL+'epilog/getEpilog.php');
  }

  saveEpilog(epilog){
    return this.http.post<any>(this._restURL+'epilog/saveEpilog.php', epilog);
  }

  getEpilogElements(){
    return this.http.get<any>(this._restURL+'epilog/getEpilogElements.php');
  }

  addEpilog(){
    return this.http.get<any>(this._restURL+'epilog/createEpilog.php');
  }  

  getBook(bookid){
    return this.http.post<any>(this._restURL+'book/getBook.php', bookid);
  }

  saveBook(bookdata){
    return this.http.post<any>(this._restURL+'book/saveBook.php',bookdata);
  }


  uploadBookCover(bookid, bookcover) {
    const formData: FormData = new FormData();
    formData.append('file', bookcover);
    formData.append('bookid', bookid);
    
    return this.http.post<any>(this._restURL+'book/uploadBookCover.php', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData))
    );
  }
  uploadBookTwitterimage(bookid, bookcover) {
    const formData: FormData = new FormData();
    formData.append('file', bookcover);
    formData.append('bookid', bookid);
    
    return this.http.post<any>(this._restURL+'book/uploadBookTwitterimage.php', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData))
    );
  }

  // Basic functions

  getElementList(element){
    return this.http.post<any>(this._restURL+'basic/getElementList.php',element);
  }

  deleteElement(element){
    return this.http.post<any>(this._restURL+'basic/deleteElement.php',element);
  }

  // PART

  getPart(partdata){
    return this.http.post<any>(this._restURL+'part/getPart.php',partdata);
  }  

  addPart(bookid){
    return this.http.post<any>(this._restURL+'part/addPart.php',bookid);
  }

  savePart(partdata){
    return this.http.post<any>(this._restURL+'part/savePart.php',partdata);
  }

  getImagePart(partid){
    return this.http.post<any>(this._restURL+'part/getImagePart.php',partid);
  }  

  uploadImagePart(partdata){
    const formData: FormData = new FormData();
    formData.append('file',  partdata.imageToUpload);
    formData.append('partid', partdata.partid);
    return this.http.post<any>(this._restURL+'part/uploadImagePart.php',formData);
  }

  deleteImagePart(imageid){
    return this.http.post<any>(this._restURL+'part/deleteImagePart.php',imageid);
  }


  // AUTHOR

  getAuthor(bookid){
    return this.http.post<any>(this._restURL+'author/getAuthor.php',bookid);
  }  

  addAuthor(bookid){
    return this.http.post<any>(this._restURL+'author/addAuthor.php',bookid);
  }

  saveAuthor(authordata){
    return this.http.post<any>(this._restURL+'author/saveAuthor.php',authordata);
  }

  deleteAuthor(authordata){
    return this.http.post<any>(this._restURL+'author/deleteAuthor.php',authordata);
  }

  getAuthorChapter(authordata){
    return this.http.post<any>(this._restURL+'author/getAuthorChapter.php',authordata);
  }  
  addAuthorChapter(authordata){
    return this.http.post<any>(this._restURL+'author/addAuthorChapter.php',authordata);
  }
  deleteAuthorChapter(authordata){
    return this.http.post<any>(this._restURL+'author/deleteAuthorChapter.php',authordata);
  }

  
  // REPLICA

  getReplic(bookid){
    return this.http.post<any>(this._restURL+'replic/getReplic.php', bookid);
  }  

  addReplic(bookid){
    return this.http.post<any>(this._restURL+'replic/addReplic.php',bookid);
  }

  saveReplic(replicdata){
    return this.http.post<any>(this._restURL+'replic/saveReplic.php',replicdata);
  }

  deleteReplic(replicid){
    return this.http.post<any>(this._restURL+'replic/deleteReplic.php',replicid);
  }

  // ATTACHEMENT

  getAttachement(partid){
    return this.http.post<any>(this._restURL+'attachement/getAttachement.php', partid);
  }  

  addAttachement(partdata){
    return this.http.post<any>(this._restURL+'attachement/addAttachement.php',partdata);
  }
  deleteAttachement(partdata){
    return this.http.post<any>(this._restURL+'attachement/deleteAttachement.php',partdata);
  }

  changepositionAttachement(partdata){
    return this.http.post<any>(this._restURL+'attachement/changepositionAttachement.php',partdata);
  }

  getBloglistOnlynames(input, restname){
    var data = input;
    data.restname = restname;
    return this.http.post<any>(this._restURL+'blog/blogFunction.php',data);
  }  
  

  // CHAPTER
  

  getChapter(chapterdata){
    return this.http.post<any>(this._restURL+'chapter/getChapter.php',chapterdata);
  }  

  addChapter(chapterdata){
    return this.http.post<any>(this._restURL+'chapter/addChapter.php',chapterdata);
  }

  saveChapter(chapterdata){
    return this.http.post<any>(this._restURL+'chapter/saveChapter.php',chapterdata);
  }

  lockChapter(chapterdata){
    return this.http.post<any>(this._restURL+'chapter/lockChapter.php',chapterdata);
  }

  moveChapter(chapterdata){
    return this.http.post<any>(this._restURL+'chapter/moveChapter.php',chapterdata);
  }

  deleteChapterPDF(chapterid){
    return this.http.post<any>(this._restURL+'chapter/deleteChapterPDF.php',chapterid);
  }

  deleteReplicPDF(replicid){
    return this.http.post<any>(this._restURL+'replic/deleteReplicPDF.php',replicid);
  }

  deleteBookPDF(bookid){
    return this.http.post<any>(this._restURL+'book/deleteBookPDF.php',bookid);
  }

  uploadPDF(elementid, pdf, type) {
    const formData: FormData = new FormData();
    formData.append('pdf', pdf);
    formData.append('elementid', elementid);
    formData.append('type', type);
    
    return this.http.post<any>(this._restURL+'basic/uploadPDF.php', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, formData))
    );
  }

  // UNIT

  getUnit(unitdata){
    return this.http.post<any>(this._restURL+'unit/getUnit.php',unitdata);
  }  

  addUnit(unitdata){
    return this.http.post<any>(this._restURL+'unit/addUnit.php',unitdata);
  }

  saveUnit(unitdata){
    return this.http.post<any>(this._restURL+'unit/saveUnit.php',unitdata);
  }

  moveUnit(unitdata){
    return this.http.post<any>(this._restURL+'unit/moveUnit.php',unitdata);
  }

  // UNITDATA

  moveData(data){
    return this.http.post<any>(this._restURL+'data/moveData.php',data);
  }

  changeDataPosition(data){
    return this.http.post<any>(this._restURL+'data/changeDataPosition.php',data);
  }

  addData(unitid){
    return this.http.post<any>(this._restURL+'data/addData.php',unitid);
  }

  addPageBreak(unitid){
    return this.http.post<any>(this._restURL+'data/addPageBreak.php',unitid);
  }

  addTinyurl(tinyurldata){
    return this.http.post<any>(this._restURL+'tinyurl/addTinyurl.php',tinyurldata);
  }

  getData(chapterid){
    return this.http.post<any>(this._restURL+'data/getData.php',chapterid);
  }

  getTinyurl(tinyurldata){
    return this.http.post<any>(this._restURL+'tinyurl/getTinyurl.php',tinyurldata);
  }

  getReference(element){
    return this.http.post<any>(this._restURL+'data/getReferences.php',element);
  }

  deleteData(datacontent){
    return this.http.post<any>(this._restURL+'data/deleteData.php',datacontent);
  }

  deleteDataText(datacontent){
    return this.http.post<any>(this._restURL+'data/deleteDataText.php',datacontent);
  }

  deleteTinyurl(tinyurldata){
    return this.http.post<any>(this._restURL+'tinyurl/deleteTinyurl.php',tinyurldata);
  }

  saveDataInfo(datacontent){
    return this.http.post<any>(this._restURL+'data/saveDataInfo.php',datacontent);
  }

  saveDataText(datacontent){
    return this.http.post<any>(this._restURL+'data/saveDataText.php',datacontent);
  }

  checkDataLink(datalink){
    return this.http.post<any>(this._restURL+'data/checkDataLink.php',datalink);
  }

  saveDataLink(datacontent){
    return this.http.post<any>(this._restURL+'data/saveDataLink.php',datacontent);
  }

  savePosition(datacontent){
    return this.http.post<any>(this._restURL+'position/changePosition.php',datacontent);
  }
  
  deleteDataFile(datacontent){
    return this.http.post<any>(this._restURL+'data/deleteDataFile.php',datacontent);
  }

  deleteReplacementImage(dataid){
    return this.http.post<any>(this._restURL+'data/deleteReplacementImage.php',dataid);
  }

  writeLog(data){
    return this.http.post<any>(this._restURL+'log/writeLog.php',data);
  }

  // PDF PREVIEW

  pdfPreviewPages(data){
    return this.http.post<any>(this._restURL+'pdf/getPdfPages.php',data);
  }
  
  pdfPreviewCalculate(data){
    return this.http.post<any>(this._restURL+'pdf/calculatePdfPages.php',data);
  }

  generatePdf(data){
    return this.http.post<any>(this._restURL+'pdf/generatePdfPages.php',data);
  }
  

  /* FILEUPLOAD */
  uploadDataFile(datacontent) {
    const formData: FormData = new FormData();
    formData.append('file',  datacontent.fileToUpload);
    formData.append('dataid', datacontent.dataid);
    formData.append('datatype', datacontent.datatype);
    formData.append('unitid', datacontent.unitid);
    formData.append('datareplacement_image', datacontent.datareplacement_image);
    return this.http.post<any>(this._restURL+'data/uploadDataFile.php', formData, {
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
}
