import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, Product } from '../data-types';
import { ProductsService } from '../services/products.service';
import { LoginData, UserData } from '../services/seller.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  loginMode: boolean = false;
  errorMsg: string = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.userService.userAuth();
  }

  onChangeFormMode() {
    this.loginMode = !this.loginMode;
  }

  login(loginForm: NgForm) {
    const loginData: LoginData = loginForm.value;
    this.userService.userLogin(loginData).subscribe((data) => {
      if (data.length > 0) {
        this.errorMsg = null;
        localStorage.setItem('user', JSON.stringify(data));
        this.router.navigate(['/']);
        this.localCartToRemoteCart();
      } else {
        this.errorMsg = 'Please check your email and password';
      }
    });
  }

  signUp(userForm: NgForm) {
    const user: UserData = userForm.value;
    this.userService.userSignUp(user).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify([data]));
      this.localCartToRemoteCart();
      this.router.navigate(['/']);
    });
  }

  localCartToRemoteCart() {
    const localData = localStorage.getItem('localCart');
    const localDataList: Product[] = JSON.parse(localData);
    const userId = JSON.parse(localStorage.getItem('user'))[0].id;

    console.log(userId);

    if (localData) {
      localDataList.forEach((prod) => {
        const edittingProd: Cart = {
          ...prod,
          userId,
          productId: prod.id,
        };

        delete edittingProd.id;
        console.log(edittingProd);
        this.productsService.addToCart(edittingProd).subscribe(() => {
          localStorage.removeItem('localCart');
        });
      });
    }

    this.productsService.getCartListByUser(userId);
  }
}
