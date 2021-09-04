import { AssertNotNull } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ProductPopupComponent } from '../product-popup/product-popup.component';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  productPopup: boolean = false;
  passcodePopup: boolean = false;
  ordersList: any = [];
  
  constructor(private __ordersService: OrdersService) { }

  ngOnInit(): void {
    this.__ordersService.ordersHistory().subscribe(data => {
      if(data.success == true){
        this.ordersList = data.data;
      }
    },
    error => {
      console.log(error);
    })
  }



}
