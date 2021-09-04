import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsList } from '../services/productslist.service';
import { CartService } from '../services/cart.service';
import { SiteMetaService } from '../services/site-meta.service';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {

  productPopup: boolean = false;
  cartPopup: boolean = false;
  deliveryPopup: boolean = false;
  number: number = 0;
  number1: number = 0;
  number2: number = 0;
  loginStatus: boolean = false;
  categories: any;
  products: any;
  popupVariants: any;
  selectedVariant: any;
  cartItems: any;
  siteDetails: any;
  product: any;
  cartNote: any = localStorage.getItem('note');

  constructor(private router: Router, private elem: ElementRef, private renderer: Renderer2, private __homeMenu: ProductsList, public __siteMeta: SiteMetaService, public CartService: CartService) {

  }

  ngOnInit(): void {
    this.__siteMeta.siteDetails().subscribe(data => {
      this.siteDetails = data.data;
      console.log("disc", data.data.discount);
      this.__siteMeta.updateDiscount(data.data.discount);
      this.CartService.cartTotal();
    },
      error => {
        alert("Server Under Maintainance");
        return;
      });

    this.CartService.getCart();

    this.loginStatus = localStorage.getItem('userDetails') ? true : false;
    setTimeout(() => {
      this.router.navigate(['order-success']);
    }, 2000);
  }

  decreaseValue(variable: any, i: number) {
    var quantity = parseInt(this.elem.nativeElement.querySelectorAll(`.${variable}`)[0].value);
    if (quantity == 1) return;
    this.elem.nativeElement.querySelectorAll(`.${variable}`)[0].value = (quantity - 1);
    this.CartService.updateQuantity(i, quantity - 1);
  }

  increaseValue(variable: any, index: number) {
    var quantity = parseInt(this.elem.nativeElement.querySelectorAll(`.${variable}`)[0].value);
    this.elem.nativeElement.querySelectorAll(`.${variable}`)[0].value = quantity + 1;
    this.CartService.updateQuantity(index, quantity + 1);
  }

  toggleVariantProduct() {
    this.productPopup = this.productPopup == true ? false : true;
    this.selectedVariant = false;
  }

  ifItemExists(itemId: any) {
    return this.CartService.cartItems.find((item: any) => item._id === itemId ? true : false);
  }

  selectProductVar(variant: any, product: any) {
    var selectedVariant = {
      _id: product._id,
      name: product.name,
      option: variant.name,
      price: variant.price,
      note: ""
    }
    return selectedVariant;
  }

  redirect() {
    this.router.navigate(['order-process']);
  }
}
