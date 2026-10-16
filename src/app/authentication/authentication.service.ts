import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { user } from './user';
import { map } from  'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConstants } from '../config/constants'


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  _restURL : string;

  private currentUserSubject: BehaviorSubject<user>;
  public currentUser: Observable<user>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<user>(JSON.parse(localStorage.getItem('ACCESS_TOKEN')));
      this.currentUser = this.currentUserSubject.asObservable();
      this._restURL = AppConstants.restURL;
  }

  public get currentUserValue(): user {
      return this.currentUserSubject.value;
  }

  getcurrentUser(){
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
      return this.http.post<any>(this._restURL+'user/login.php', { username, password })
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('ACCESS_TOKEN', JSON.stringify(user));
                  this.currentUserSubject.next(user);
              }
              return user;
          }));
  }

  logout() {
      localStorage.removeItem('ACCESS_TOKEN');
      this.currentUserSubject.next(null);
  }
}
