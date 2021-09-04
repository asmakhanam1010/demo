import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SiteMetaService } from './site-meta.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: any = [];
  cartTotalAmount: any;
  deliveryType: any = 'PICKUP';
  userData: any = JSON.parse(localStorage.getItem('userDetails'));
  cartNote: any = localStorage.getItem('note');
  constructor(private _SiteMetaService: SiteMetaService, private httpClient: HttpClient) {
  }
  
  ngOnInit() {
    this.cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    console.log("service", this.cartItems);
  }

  comparer(otherArray: any){
    return function(current:any){
      return otherArray.filter(function(other:any){
        return other._id == current._id
      }).length == 0;
    }
  }

  updateCart(item: any) {
    var cart = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    if (cart.length == 0) {
      item.quantity = 1;
      cart[cart.length] = item;
    } else {
      var a = 0;
      var itemIs = 0;
      while (a < cart.length) {
        var checkToppings = item.toppings.filter(this.comparer(cart[a].toppings));
        console.log(checkToppings);
        if (cart[a]._id == item._id && cart[a].option == item.option && (cart[a].id == item.id && checkToppings.length == 0)) {
          cart[a].quantity += 1;
          localStorage.setItem('cartItems', JSON.stringify(cart));
          this.cartItems = cart;
          this.cartTotal();
          return;
        } else {
          itemIs = 0;
        }
        a++;
      }
      if (itemIs == 0) {
        item.quantity = 1;
        cart[cart.length] = item;
      }
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    this.cartItems = cart;
    this.cartTotal();
  }

  getCart() {
    var cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    this.cartItems = cartItems;
    this.cartTotal();
    return;
  }

  removeItem(itemIndex: any) {
    var cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    cartItems.splice(itemIndex, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.cartItems = cartItems;
    this.cartTotal();
  }

  updateQuantity(index: number, quantity: number) {
    var cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    cartItems[index].quantity = quantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.cartItems = cartItems;
    this.cartTotal();
    return;
  }

  addNote(note: any, index: number) {
    var cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    cartItems[index].note = note;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.cartItems = cartItems;
    this.cartTotal();
    return;
  }

  cartTotal() {
    let total = 0;
    var cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    cartItems.forEach((element: any) => {
      var toppingTotal = 0;
      if(element.toppings){
        element.toppings.forEach((topping: any) => toppingTotal += parseInt(topping.price));
      }

      total += ((parseInt(element.price) + toppingTotal) * element.quantity);
    });

    const discount = this._SiteMetaService.cartDiscount;
    var delivery = 10;

    this.cartTotalAmount = {
      subTotal: total,
      delivery: delivery,
      discount: (((discount * total) / 100)),
      total: ((total - (discount * total) / 100) + delivery).toFixed(2),
    }

    return this.cartTotalAmount;
  }

  proccessCart(paymentMethod: any): Observable<any> {
    this.userData = JSON.parse(localStorage.getItem('userDetails'));
    const authToken = this.userData.token;
    var headers = new HttpHeaders({
      "Authorization": "Bearer " + authToken
    });
    var httpOptions = {
      headers: headers
    }

    var cartPayments = this.cartTotal();
    var orderDetails = {
      deliveryType: this.deliveryType.toUpperCase(),
      itemDetails: this.cartItems,
      paymentMode: paymentMethod,
      deliveryAddress: this.userData.address,
      subTotal: cartPayments.subTotal,
      discount: cartPayments.discount,
      totalAmmount: cartPayments.total,
      deliveryDatetime: '2021-08-15T18:49:56.503Z',
      note: localStorage.getItem('note')
    }
    // console.log(orderDetails);

    return this.httpClient.post(environment.apiBaseUrl + 'orderService/addOrder', orderDetails, httpOptions);
  }

  updateNote(note: any) {
    localStorage.setItem('note', note);
  }
}
