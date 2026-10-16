import { Component, OnInit } from '@angular/core';
import { DatenspeicherungService } from './datenspeicherung.service';
import { AlertService } from "../alert/alert.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-migration',
  templateUrl: './datenspeicherung.component.html',
  styleUrls: ['./datenspeicherung.component.css','../app.component.css']
})
export class DatenspeicherungComponent implements OnInit {

  constructor(
    private datenspeicherungService: DatenspeicherungService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  showReplica: boolean = false;
  showChapter: boolean = false;

  showDatenspeicherung: boolean = false;
  csvLoading: boolean = false;
  csvHeaderChapter = ['kapitelname', 'autor', 'titel_des_buchs', 'autoren_des_buchs', 'datum_der_veroeffentlichung', 'link', 'verlag', 'pdf'];
  csvChapterlist:any;
  csvHeaderReplic = ['titel', 'autor', 'replik_auf', 'datum_der_veroeffentlichung', 'link', 'pdf'];
  csvRepliclist:any;
  csvVerlag = "https://intercomverlag.ch/";


  ngOnInit(): void {
    this.getCsvChapterlist();
    this.getCsvRepliclist();
  }

  getCsvChapterlist(){
    this.datenspeicherungService.getCsvChapterlist().subscribe((res)=>{
      this.csvChapterlist = res.data;
    });
  }

  getCsvRepliclist(){
    this.datenspeicherungService.getCsvRepliclist().subscribe((res)=>{
      this.csvRepliclist = res.data;
    });
  }

  generateCSV(type){
      var date = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

      let csvString = 'Nr.;';
      for (let key in this["csvHeader"+type]) {
        csvString += this["csvHeader"+type][key] + ';';
      }
      csvString = csvString.slice(0, -1); 
      csvString += '\r\n';
      var number = 0;
      for (let key in this["csv"+type+"list"]) {
        if(this["csv"+type+"list"][key].selected){
          number++;
          csvString += number+';';
          for (let key2 in this["csvHeader"+type]) {
            if(this["csvHeader"+type][key2]=="verlag"){
              csvString += this.csvVerlag + ";";
            }else{
              csvString += this["csv"+type+"list"][key][this["csvHeader"+type][key2]] + ";";
            }
          }
          csvString = csvString.slice(0, -1); 
          csvString += '\r\n';
        }
      }
      let blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });

      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "datenspeicherung_cache_"+date+"_"+type+".csv";
      link.click();
      link.remove();
  }

}
