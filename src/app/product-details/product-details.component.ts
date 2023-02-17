import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart, Product } from '../data-types';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productData: Product;
  theAmount: number = 1;
  removeFromCart: boolean = false;
  cartData: Product;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let cartData = localStorage.getItem('localCart');
    this.route.params.subscribe((params: HttpParams) => {
      if (params['id']) {
        this.productsService.getProduct(params['id']).subscribe((prod) => {
          this.productData = prod;

          if (cartData) {
            let item = JSON.parse(cartData).filter(
              (item: Product) => params['id'] === item.id.toString()
            );
            item.length === 0
              ? (this.removeFromCart = false)
              : (this.removeFromCart = true);
          }

          const userData = localStorage.getItem('user');
          if (userData) {
            const userId = JSON.parse(userData)[0].id;
            this.productsService.getCartListByUser(userId);
            this.productsService.cartProds.subscribe((result) => {
              let item = result.filter(
                (item: Cart) => params['id'] === item.productId.toString()
              );

              if (item.length) {
                this.cartData = item[0];
                this.removeFromCart = true;
              }
            });
          }
        });
      }
    });
  }

  addToCart() {
    if (this.productData) {
      this.removeFromCart = true;
      this.productData.quanttity = this.theAmount;
      if (!localStorage.getItem('user')) {
        this.productsService.localAddToCart(this.productData);
      } else {
        const userData = localStorage.getItem('user');
        const userId = JSON.parse(userData)[0].id;
        const cartData: Cart = {
          ...this.productData,
          userId,
          productId: this.productData.id,
        };

        delete cartData.id;

        this.productsService.addToCart(cartData).subscribe((cartProd: Cart) => {
          if (cartProd) {
            this.productsService.getCartListByUser(userId);
            this.removeFromCart = true;
            alert('Item added successfully');
          }
        });
      }
    }
  }

  onRemoveFromCart() {
    if (localStorage.getItem('user')) {
      this.productsService
        .removeFromCart(this.cartData.id)
        .subscribe((result) => {
          const userData = localStorage.getItem('user');
          const userId = JSON.parse(userData)[0].id;

          this.productsService.getCartListByUser(userId);
        });
    } else {
      this.productsService.removeItemFromCart(this.productData.id);
    }

    this.removeFromCart = false;
  }

  onDecrease() {
    if (this.theAmount === 1) return;
    this.theAmount -= 1;
  }

  onIncrease() {
    if (this.theAmount === 20) return;
    this.theAmount += 1;
  }
}
