import { Component, OnInit } from '@angular/core';
import { Product } from '../data-types';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  popularProds: Product[];
  trendyProds: Product[];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.popularProducts().subscribe((popularProducts) => {
      this.popularProds = popularProducts;
    });

    this.productsService.trendyProducts().subscribe((trendyProds) => {
      this.trendyProds = trendyProds;
    });
  }
}
