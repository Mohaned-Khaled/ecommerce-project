import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, OrderData } from '../data-types';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  totalPrice: string;
  cartData: Cart[];
  orderMsg: string;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let userId = JSON.parse(localStorage.getItem('user'))[0].id;

    this.productsService.getCartUser(userId).subscribe((data) => {
      let price = 0;
      this.cartData = data;

      data.forEach((item) => {
        price += +item.price * +item.quanttity;
      });

      console.log(price + +price * 0.14 - +price * 0.1 - 100);
      this.totalPrice = (price + +price * 0.14 - +price * 0.1 + 100).toString();
    });
  }

  onSubmit(myForm: NgForm) {
    let userId = JSON.parse(localStorage.getItem('user'))[0].id;

    if (this.totalPrice) {
      let orderData: OrderData = {
        ...myForm.value,
        userId,
        totalPrice: this.totalPrice,
      };

      myForm.reset();

      this.cartData?.forEach((data) => {
        setTimeout(() => {
          this.productsService.deleteCartItems(data.id);
        }, 1000);
      });

      this.productsService.orderData(orderData).subscribe((data) => {
        if (data) {
          this.orderMsg = 'Order has been placed successfully';
          setTimeout(() => {
            this.router.navigate(['my-orders']);
            this.orderMsg = '';
          }, 3000);
        }
      });
    }
  }
}
