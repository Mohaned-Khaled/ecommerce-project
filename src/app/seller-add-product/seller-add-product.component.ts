import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  productForm: FormGroup;
  addProductMessage: string = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.urlPattern),
      ]),
    });
  }

  getUrlControl() {
    return this.productForm?.get('url');
  }

  onNewProduct() {
    console.log(this.productForm);
    this.productsService
      .addProduct(this.productForm.value)
      .subscribe((product) => {
        if (product) {
          this.addProductMessage = 'Product is added successfully';
        }
      });

    this.productForm.reset();
    setTimeout(() => {
      this.addProductMessage = null;
    }, 4000);
  }
}
