import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteMetaService {
  cartDiscount: number;
  constructor(private httpClient: HttpClient) { }

  siteDetails(): Observable<any> {
    var result = this.httpClient.get(environment.apiBaseUrl + 'restaurantService/profile');
    return result;
  }

  updateDiscount(discount: number){
    this.cartDiscount = discount;
    // console.log("disc1", this.cartDiscount);
  }
}
