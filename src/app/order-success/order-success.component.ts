import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  cartItems: any;
  cartNote: any;
  cartSubtotal: any;

  constructor(public CartService: CartService) { }

  ngOnInit(): void {

    this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
    this.cartNote = localStorage.getItem('note');

    localStorage.removeItem('cartItems');
    localStorage.removeItem('note')
  }

  toppingsTotal(item: any){
    var toppingTotal = 0;
    item.toppings.forEach((topping: any) => toppingTotal += parseInt(topping.price));
    return toppingTotal;
  }
  
  itemTotal(itemsPrice:any, item:any, quantity:any){
    return ((parseInt(itemsPrice) + this.toppingsTotal(item)) * quantity); 
  }

}