import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ContentComponent } from './content/content.component';
import { BookComponent } from './book/book.component';
import { InfoComponent } from './info/info.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { UserComponent } from './user/user.component';
import { LogComponent } from './log/log.component';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { RoleGuard } from './authentication/role.guard';
import { BlogComponent } from './blog/blog.component';
import { DatenspeicherungComponent } from './datenspeicherung/datenspeicherung.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthenticationGuard],
    children: [
        {
            path: '',
            component: ContentComponent
        },
        {
            path: 'content',
            component: ContentComponent
        },
        {
            path: 'blog',
            component: BlogComponent
        },
        {
            path: 'content/replic',
            component: ContentComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'content/aboutcache',
            component: ContentComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'book',
            component: BookComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'info',
            component: InfoComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'newsletter',
            component: NewsletterComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'user',
            component: UserComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'datenspeicherung',
            component: DatenspeicherungComponent,
            canActivate: [RoleGuard]
        },
        {
            path: 'backup',
            component: LogComponent,
            canActivate: [RoleGuard]
        }
    ] },
    { 
        path: '**', pathMatch: 'full', component: MainComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
