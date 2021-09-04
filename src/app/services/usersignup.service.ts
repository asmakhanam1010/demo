import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersignupService {

  constructor(private httpClient: HttpClient) { }

  userRegister(formData: any): Observable<any>{
      return this.httpClient.post(environment.apiBaseUrl + "userService/addUser", formData);
  }
}
