import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  loginMode: boolean = false;
  error = null;
  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.sellerService.autoSign();
    this.sellerService.ErrorMsg.subscribe((res) => {
      this.error = res;
    });
  }

  onSignup(form: NgForm) {
    if (!form.valid) return;
    this.sellerService.userSignup(
      form.value.name,
      form.value.password,
      form.value.email
    );
  }

  onLogin(form: NgForm) {
    this.sellerService.login(form.value.email, form.value.password);
  }

  onFormMode() {
    this.loginMode = true;
  }

  onFormMode2() {
    this.loginMode = false;
  }
}
