import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  userData: any = JSON.parse(localStorage.getItem('userDetails'));
  authToken: any = this.userData.token;
  constructor(private httpClient: HttpClient) { }

  ordersHistory():Observable<any>{
    var headers = new HttpHeaders({
      "Authorization": "Bearer "+ this.authToken
    });
    var httpOptions = {
      headers: headers
    }
    var result = this.httpClient.get(environment.apiBaseUrl + 'orderService/getOrders', httpOptions);
    return result;
  }

}
