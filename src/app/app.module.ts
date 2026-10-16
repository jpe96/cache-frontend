
// Modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from  '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JoditAngularModule } from 'jodit-angular';
import { MatSortModule } from '@angular/material/sort';
import { AutosizeModule } from 'ngx-autosize';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMasonryModule } from 'ngx-masonry';


// Components
import { NewsletterComponent } from './newsletter/newsletter.component';
import { UserComponent } from './user/user.component';
import { InfoComponent } from './info/info.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './alert/alert.component';
import { BookComponent } from './book/book.component';
import { ContentComponent } from './content/content.component';

// Interceptors

import { JwtInterceptor  } from './authentication/jwt.interceptor';
import { ErrorInterceptor  } from './authentication/error.interceptor';
import { LogComponent } from './log/log.component';
import { BlogComponent } from './blog/blog.component';

// Pipes

import { SafePipePipe } from './safe-pipe.pipe';
import { SafePipePipeHTML } from './safe-pipe-html.pipe';
import { CustomDatePipe } from './date.pipe';
import { CustomDateEnPipe } from './date_en.pipe';
import { DatePipe } from '@angular/common';    
import { FiterPipe } from './filter.pipe';
import { LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { DatenspeicherungComponent } from './datenspeicherung/datenspeicherung.component';
import { DoormanComponent } from './doorman/doorman.component';
import { MainComponent } from './main/main.component';
import { BookFrontendComponent } from './book-frontend/book-frontend.component';
import { HeaderFrontendComponent } from './header-frontend/header-frontend.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { BlogFrontendComponent } from './blog-frontend/blog-frontend.component';
import { MaterialarchivComponent } from './materialarchiv/materialarchiv.component';
import { AboutComponent } from './about/about.component';


registerLocaleData(localeDe);

// Routings

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatIconModule,
        MatTooltipModule,
        FormsModule,
        JoditAngularModule,
        MatSortModule,
        AutosizeModule,
        MatIconModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        NgxMasonryModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        AdminComponent,
        HeaderComponent,
        NewsletterComponent,
        UserComponent,
        InfoComponent,
        AlertComponent,
        BookComponent,
        ContentComponent,
        LogComponent,
        BlogComponent,
        SafePipePipe,
        SafePipePipeHTML,
        CustomDatePipe,
        CustomDateEnPipe,
        FiterPipe,
        DatenspeicherungComponent,
        DoormanComponent,
        MainComponent,
        BookFrontendComponent,
        HeaderFrontendComponent,
        ImpressumComponent,
        BlogFrontendComponent,
        MaterialarchivComponent,
        AboutComponent
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: "de" },
        DatePipe
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }