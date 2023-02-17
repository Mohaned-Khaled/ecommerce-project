import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface UserData {
  name: string;
  password: string;
  email: string;
  id?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  ErrorMsg = new BehaviorSubject<string>(null);
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  userSignup(name: string, password: string, email: string) {
    this.http
      .post<UserData>(
        'http://localhost:3000/seller',
        {
          name,
          password,
          email,
        },
        { observe: 'response' }
      )
      .subscribe((data) => {
        if (data) this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify([data.body]));
        this.router.navigate(['seller-home']);
      });
  }

  autoSign() {
    const myData = localStorage.getItem('seller');

    if (myData) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  login(email: string, password: string) {
    this.ErrorMsg.next(null);
    this.http
      .get<UserData[]>('http://localhost:3000/seller', {
        params: new HttpParams().set('email', email).set('password', password),
      })
      .subscribe((data) => {
        if (data.length > 0) {
          this.isSellerLoggedIn.next(true);
          localStorage.setItem('seller', JSON.stringify(data));
          this.router.navigate(['seller-home']);
        } else {
          this.ErrorMsg.next('Please check your email and password');
        }
      });
  }
}
