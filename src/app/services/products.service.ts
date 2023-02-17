import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cart, OrderData, Product } from '../data-types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  cartProds = new Subject<Product[]>();
  totalPrice = new Subject<string>();

  constructor(private http: HttpClient) {}

  addProduct(myProduct: Product) {
    return this.http.post<Product>('http://localhost:3000/products', {
      ...myProduct,
    });
  }

  productList() {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(
      `http://localhost:3000/products/${product.id}`,
      product
    );
  }

  popularProducts() {
    return this.http.get<Product[]>('http://localhost:3000/products', {
      params: new HttpParams().set('_limit', 3),
    });
  }

  localAddToCart(data: Product) {
    let localData = [];
    const localCart = localStorage.getItem('localCart');
    if (localCart) {
      localData = JSON.parse(localCart);
      localData.push(data);
      localStorage.setItem('localCart', JSON.stringify(localData));
      this.cartProds.next(localData);
    } else {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartProds.next([data]);
    }
  }

  addToCart(cartItem: Cart) {
    return this.http.post('http://localhost:3000/cart', { ...cartItem });
  }

  removeItemFromCart(id: number) {
    let localCart = JSON.parse(localStorage.getItem('localCart'));
    let updatingItems = localCart.filter(
      (product: Product) => product.id !== id
    );
    localStorage.setItem('localCart', JSON.stringify(updatingItems));

    this.cartProds.next(updatingItems);
  }

  removeFromCart(cartId: number) {
    return this.http.delete(`http://localhost:3000/cart/${cartId}`);
  }

  trendyProducts() {
    return this.http.get<Product[]>('http://localhost:3000/products', {
      params: new HttpParams().set('_limit', 8),
    });
  }

  searchProducts(params: string) {
    return this.http.get<Product[]>('http://localhost:3000/products', {
      params: new HttpParams().set('q', params),
    });
  }

  getCartListByUser(userId: number) {
    return this.http
      .get<Cart[]>('http://localhost:3000/cart', {
        params: new HttpParams().set('userId', userId),
      })
      .subscribe((res) => {
        if (res) {
          this.cartProds.next(res);
        }
      });
  }

  getCartUser(userId: number) {
    return this.http.get<Cart[]>('http://localhost:3000/cart', {
      params: new HttpParams().set('userId', userId),
    });
  }

  orderData(data: OrderData) {
    return this.http.post('http://localhost:3000/orders', data);
  }

  orderList() {
    let userStoreId = JSON.parse(localStorage.getItem('user'))[0].id;

    // const userStoreId =
    //   JSON.parse(localStorage.getItem('user'))[0]?.id ||
    //   JSON.parse(localStorage.getItem('user')).id;

    return this.http.get<OrderData[]>('http://localhost:3000/orders', {
      params: new HttpParams().set('userId', userStoreId),
    });
  }

  deleteCartItems(cartId: number) {
    this.http
      .delete(`http://localhost:3000/cart/${cartId}`)
      .subscribe((data) => {
        this.cartProds.next([]);
      });
  }

  cancelOrder(orderId: number) {
    return this.http.delete(`http://localhost:3000/orders/${orderId}`);
  }
}
