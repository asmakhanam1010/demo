import { HostListener, Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HomeMenuService } from '../services/home-menu.service';
import { ProductsList } from '../services/productslist.service';
import { CartService } from '../services/cart.service';
import { SiteMetaService } from '../services/site-meta.service';
import { PasscodeService } from '../services/passcode.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  env: any = environment;
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
  activeCategory: any = 0;
  isLoading: boolean = true;
  passCodeValidMsg: any = false;
  passcode: boolean = false;
  deliveryType: any;
  userDetails: any;
  profileDropdown: boolean = false;

  constructor(private router: Router, private elem: ElementRef, private renderer: Renderer2, private __homeMenu: ProductsList, public __siteMeta: SiteMetaService, public CartService: CartService, private __passcodeService: PasscodeService) {

  }

  @HostListener('click', ['$event.target'])
  onClick(btn: any) {
    if (this.deliveryPopup || this.cartPopup || this.productPopup) {
      this.renderer.addClass(document.body, 'modal-open');
    } else {
      this.renderer.removeClass(document.body, 'modal-open');
    }
  }

  ngOnInit(): void {
    this.deliveryPopup = true;

    this.__siteMeta.siteDetails().subscribe(data => {
      this.siteDetails = data.data;
      this.isLoading = false;
      this.__siteMeta.updateDiscount(data.data.discount);
      this.CartService.cartTotal();
    },
      error => {
        alert("Server Under Maintainance");
        return;
      });

    this.cartItems = this.CartService.getCart();

    this.loginStatus = localStorage.getItem('userDetails') ? true : false;

    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));

    this.__homeMenu.productsList().subscribe(data => {
      if (data.success == true) {
        this.categories = data.data;
      }
    },
      error => {
        console.log(error);
      });
  }


  toggleCart() {
    if (this.cartPopup == false) {
      this.cartPopup = true;
    } else {
      this.cartPopup = false;
    }
  }

  scroll(el: any) {

    document.getElementById(el).scrollIntoView()
    // el.scrollIntoView({ behavior: 'smooth' });
  }

  refreshProduts(product: any) {
    this.CartService.cartItems.forEach((item: any) => {
      var el = document.getElementById(product._id) as HTMLInputElement;
      if (item._id != product._id) {
        el.checked = false;
      } else if (item._id == product._id) {
        el.checked = true;
      }
    });
  }

  productVariantsPopup(product: any) {
    // console.log(product.options);
    this.productPopup = this.productPopup ? false : true;

    if (this.CartService.cartItems.length == 0) {
      var el = document.getElementById(product._id) as HTMLInputElement;
      el.checked = false;
    }

    this.CartService.cartItems.forEach((item: any) => {
      var el = document.getElementById(product._id) as HTMLInputElement;
      if (item._id != product._id) {
        el.checked = false;
      } else if (item._id == product._id) {
        el.checked = true;
      }
    });

    if (!this.productPopup) return;
    this.popupVariants = product.options;
    this.product = product;
    this.selectedVariant
    return;
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

  selectProductVar(product: any, variant: any = []) {
    let selectedVariant = {};
    if (variant.length == 0) {
      selectedVariant = {
        _id: product._id,
        name: product.name,
        option: '',
        price: product.price,
        note: "",
        toppings: [],
      }
    } else {
      selectedVariant = {
        _id: product._id,
        name: product.name,
        option: variant.name,
        price: variant.price,
        note: "",
        toppings: [],
      }
    }
    return selectedVariant;
  }

  toppingsTotal(item: any){
    var toppingTotal = 0;
    item.toppings.forEach((topping: any) => toppingTotal += parseInt(topping.price));
    return toppingTotal;
  }

  itemTotal(itemsPrice:any, item:any, quantity:any){
    return ((parseInt(itemsPrice) + this.toppingsTotal(item)) * quantity); 
  }

  checkIfPassCodeValid() {
    var value = this.elem.nativeElement.querySelectorAll("#deliveryPassCode")[0].value;
    if (value == "") {
      this.passCodeValidMsg = "Please enter passcode";
      this.passcode = false;
      var radio = this.elem.nativeElement.querySelector('#delivery');
      radio.checked = false;
      var radio1 = this.elem.nativeElement.querySelector('#collection');
      radio1.checked = true;
      this.CartService.deliveryType = "PICKUP";
      return;
    }
    this.__passcodeService.checkPasscodes(value).subscribe(data => {
      if (data.data != "FOUND") {
        // console.log(data.data);
        this.passCodeValidMsg = "Sorry, currently we're not delivering to your area.";
      } else {
        this.CartService.deliveryType = "delivery";
        this.passcode = true;
        this.deliveryPopup = false;
        this.renderer.removeClass(document.body, 'modal-open');
      }
    },
      error => {
        console.log(error);
      });
    console.log(value);
  }

  updateCartNote(event: any) {
    this.CartService.updateNote(event.target.value);
  }

  redirectToRegister() {
    this.loginStatus == true ? this.router.navigate(['register'], { state: { lastUrl: 'home' } }) : this.router.navigate(['payment-method']);
  }

  addTopings(value: any) {
    // console.log(this.selectedVariant.toppings.indexOf(value));
    if(this.selectedVariant.toppings.includes(value)){
      this.selectedVariant.toppings.splice(this.selectedVariant.toppings.indexOf(value), 1);
      return;
    }
    this.selectedVariant.toppings.push(value);
  }
}
