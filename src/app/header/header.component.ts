import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { clippingParents } from '@popperjs/core';
import { Subject } from 'rxjs';
import { Product } from '../data-types';
import { ProductsService } from '../services/products.service';
import { UserData } from '../services/seller.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  sellerName: string = null;
  userName: string = null;
  viewSearchBar: string = '0';
  cartItems: number = 0;
  searchingProds: Product[];
  id = new Subject<string>();

  constructor(
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((data: RoutesRecognized) => {
      if (!data.url) return;

      const sellerStore: UserData[] = JSON.parse(
        localStorage.getItem('seller')
      );
      if (sellerStore && data.url.includes('seller')) {
        this.sellerName = sellerStore[0]?.name;
        this.viewSearchBar = '0';
      } else {
        this.viewSearchBar = '1';
      }

      if (localStorage.getItem('user')) {
        const userStore: UserData = JSON.parse(localStorage.getItem('user'));
        this.userName = userStore.name || userStore[0].name;
        this.productsService.getCartListByUser(userStore[0].id);
      } else {
        this.userName = null;
      }
    });

    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }

    this.productsService.cartProds.subscribe((data) => {
      this.cartItems = data.length;
    });
  }

  onSearchProduct(e: KeyboardEvent) {
    const seachingVal: string = (<HTMLInputElement>e.target).value;

    if (!seachingVal) {
      this.onHideList();
      return;
    }

    this.productsService
      .searchProducts(seachingVal)
      .subscribe((searchProds) => {
        if (searchProds.length > 5) {
          searchProds.length = 5;
        }
        this.searchingProds = searchProds;
      });
  }

  onHideList() {
    this.searchingProds = [];
  }

  onSbumitSearch(inputVal: string) {
    this.router.navigate(['search', inputVal]);
  }

  redirectTo(id: string) {
    this.router.navigate(['product-details', id]);
  }

  logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }

  userLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['user-auth']);
    this.userName = null;
    this.productsService.cartProds.next([]);
  }
}
