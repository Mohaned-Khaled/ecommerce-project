import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../data-types';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  productForm: FormGroup;
  myProduct = new BehaviorSubject<Product>(null);

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId: string = this.route.snapshot.params['id'];

    this.productsService.getProduct(productId).subscribe((productData) => {
      this.myProduct.next(productData);
    });

    this.myProduct.subscribe((product) => {
      this.productForm = new FormGroup({
        name: new FormControl(product?.name, [Validators.required]),
        price: new FormControl(product?.price, [Validators.required]),
        category: new FormControl(product?.category, [Validators.required]),
        color: new FormControl(product?.color, [Validators.required]),
        description: new FormControl(product?.description, [
          Validators.required,
        ]),
        url: new FormControl(product?.url, [
          Validators.required,
          Validators.pattern(this.urlPattern),
        ]),
      });
    });
  }
  getUrlControl() {
    return this.productForm?.get('url');
  }

  onEditProduct() {
    console.log(this.productForm.value);

    const productFormWithId: Product = {
      id: this.myProduct.value.id,
      ...this.productForm.value,
    };

    this.productsService.updateProduct(productFormWithId).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/seller-home']);
    });
  }
}
