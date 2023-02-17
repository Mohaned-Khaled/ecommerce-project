import { Component, OnInit } from '@angular/core';
import { OrderData } from '../data-types';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orderData: OrderData[];
  isLoading: boolean = false;
  isEmpty: boolean = false;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getOrders();
  }

  onRemoveOrder(orderId: number) {
    this.isLoading = true;
    this.productsService.cancelOrder(orderId).subscribe(() => {
      setTimeout(() => {
        this.getOrders();
      }, 1000);
    });
  }

  getOrders() {
    this.productsService.orderList().subscribe((data) => {
      this.isLoading = false;
      if (data.length) {
        this.orderData = data;
        this.isEmpty = false;
      } else this.isEmpty = true;
    });
  }
}
