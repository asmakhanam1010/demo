import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsList {
  constructor(private httpClient: HttpClient) { }

  productsList(): Observable<any>{
    return this.httpClient.get(environment.apiBaseUrl + "/menuService/homeMenu");
  }
  
}
