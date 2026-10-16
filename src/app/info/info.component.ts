import { Component, OnInit } from '@angular/core';
import { InfoService } from './info.service';
import { AlertService } from "../alert/alert.service";
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css','../app.component.css'],
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
export class InfoComponent implements OnInit {
  jodit_config = {
    buttons: 'source,fullsize,italic,superscript,link,|,undo,redo,eraser,|',
    buttonsMD: 'source,fullsize,italic,superscript,link,|,undo,redo,eraser,|',
    buttonsSM: 'source,fullsize,italic,superscript,link,|,undo,redo,eraser,|',
    buttonsXS: 'source,fullsize,italic,superscript,link,|,undo,redo,eraser,|',
    enter: 'BR',
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    spellcheck: false,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'autofocus,backspace,paste, imageProcessor,imageProperties,sticky,stat,xpath,tooltip'
  };

  information:any;

  constructor(
    private infoService: InfoService,
    private alertService: AlertService
  ) {}
  
  showInformation: boolean = false;
  showInformationEn: boolean = false;
  alert:any;
  sendAlert(msg:String, typus:number) {
    this.alert = {message:msg,type:typus}; 
    this.alertService.changeMessage(this.alert)
  }

  ngOnInit() {
    this.getInformation();
    this.alertService.currentAlert.subscribe(alert => this.alert = alert)
  }

  saveInformation(){
    this.infoService.saveInformation(this.information)
    .subscribe((res)=>{
      if(!res.error){
        this.getInformation();
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  getInformation(){
    this.infoService.getInformation()
    .subscribe((res)=>{
      if(!res.error){
        this.information = res.data[0];
      }else{
        this.sendAlert(res.data,1);
      }
    });
  }

  textReplaceTags(){
    this.information.infotext = this.information.infotext.replace(/<p[^>]*>/g, "").replace("</p>","<br/>").replace(/\r?\n|\r/g,"").replace(/\t/g,"");
    this.information.events = this.information.events.replace(/<p[^>]*>/g, "").replace("</p>","<br/>").replace(/\r?\n|\r/g,"").replace(/\t/g,"");
  }

  textReplaceTagsRegex(datatext){
    var datatext = datatext.replace(/<br>/g,"<br/>")
                      .replace(/<i[^>]*>/g,"<i>")
                      .replace(/<em[^>]*>/g,"<i>")
                       .replace(/<\/em>/g,"</i>")
                       .replace(/<div style="margin-left:15pt">([^"]*)<\/div>/gm,'MARKdiv style="margin-left:15pt"MARK$1MARK/divMARK')
                       .replace(/<div style="([^"]*)"([^c]*) class="address" id="([^"]*)">([^"]*)<\/div>/gm,'MARKdiv style="$1" class="address" id="$3"MARK$4MARK/divMARK')
                       .replace(/<div style="([^"]*)"([^c]*) class="address" id="([^"]*)">([^(<)]*)<(span|em|i|strong|sup)([^>]*)>/gm, 'MARKdiv style="$1" class="address" id="$3"MARK$4MARK/divMARK')
                       .replace(/<\/?(?!(?:i|a|sup|br)\b)[a-z](?:[^>"']|"[^"]*"|'[^']*')*>/g, "")
                       .replace(/MARKdiv style="([^"]*)" class="address" id="([^"]*)"MARK(.*?(?=MARK))MARK\/divMARK/gm,'<div style="$1" class="address" id="$2">$3</div>')
                       .replace(/MARKdiv style="margin-left:15pt"MARK([^"]*)MARK\/divMARK/gm,'<div style="margin-left:15pt">$1</div>')
                       .replace(/(<sup([^>]*)>)+/g,"<sup>")
                       .replace(/(<\/sup>)+/g,"</sup>")
                       .replace(/&nbsp;/g," ")
                       .replace(/&amp;/g,"&")
                       .replace(/\r?\n|\r/g," ")
                       .replace(/\t/g,"")
                       .replace(/\s+/g,' ');
    return datatext;
  }
}
