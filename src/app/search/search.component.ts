import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Product } from '../data-types';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  prods: Product[];
  loading: boolean = false;
  seachedParams: string;
  sub: Subscription;
  nothingMsg: string = null;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.loading = true;
      this.nothingMsg = null;
      this.seachedParams = data.query;
      this.sub = this.productsService
        .searchProducts(data.query)
        .pipe(
          tap((prods) => {
            if (prods.length === 0)
              this.nothingMsg = "Sorry, we couldn't find any results";
          })
        )
        .subscribe((prods) => {
          this.loading = false;
          console.log(prods);
          this.prods = prods;
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
