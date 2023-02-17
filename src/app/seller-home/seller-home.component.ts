import { Component, OnInit } from '@angular/core';
import { Product } from '../data-types';
import { ProductsService } from '../services/products.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  loadingProducts: boolean = false;
  productList: Product[] = [];
  trashIcon = faTrash;
  editIcon = faEdit;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.loadingProducts = true;
    this.productsService.productList().subscribe((products) => {
      this.loadingProducts = false;
      this.productList = products;
    });
  }

  onDeleteProduct(id: number) {
    console.log(id);
    this.productsService.deleteProduct(id).subscribe(() => {
      this.fetchProducts();
    });
  }
}
