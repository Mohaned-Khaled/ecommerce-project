import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData, UserData } from './seller.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(user: UserData) {
    return this.http.post('http://localhost:3000/users', { ...user });
  }

  userLogin(user: LoginData) {
    return this.http.get<UserData[]>('http://localhost:3000/users', {
      params: new HttpParams()
        .set('email', user.email)
        .set('password', user.password),
    });
  }

  userAuth() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }
}
