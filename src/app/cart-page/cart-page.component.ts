import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Product } from '../data-types';
import { ProductsService } from '../services/products.service';

export interface Summary {
  amount: number;
  taxes: string;
  discount: string;
  delivery: string;
  total: string;
}

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  userProducts: Product[];

  cartSummary: Summary = {
    amount: 0,
    taxes: '0',
    delivery: '0',
    discount: '0',
    total: '0',
  };

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCartItems();
  }

  onCheckout() {
    this.productsService.totalPrice.next(this.cartSummary.total);
    this.router.navigate(['/checkout']);
  }

  fetchCartItems() {
    let user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      this.router.navigate(['user-auth']);
      return;
    }

    let userId = user[0].id;

    this.productsService.getCartUser(userId).subscribe((data) => {
      if (data.length === 0) this.router.navigate(['/']);
      this.userProducts = data;
      this.userProducts.forEach((prod) => {
        this.cartSummary.amount += +prod.price * +prod.quanttity;
      });

      this.cartSummary.taxes = (0.14 * +this.cartSummary.amount).toFixed(0);
      this.cartSummary.discount = (0.1 * +this.cartSummary.amount).toFixed(0);
      this.cartSummary.delivery = '100';

      this.cartSummary.total = (
        this.cartSummary.amount +
        +this.cartSummary.taxes -
        +this.cartSummary.discount +
        +this.cartSummary.delivery
      ).toFixed(0);
    });
  }

  onRemoveFromCart(cartId: number) {
    this.productsService.removeFromCart(cartId).subscribe((res) => {
      this.cartSummary = {
        amount: 0,
        taxes: '0',
        delivery: '0',
        discount: '0',
        total: '0',
      };

      this.fetchCartItems();
    });
  }
}
