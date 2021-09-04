import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserLoginService {

    constructor(private httpClient: HttpClient) { }

    userLogin(email: any, password: any): Observable<any>{
        return this.httpClient.post(environment.apiBaseUrl + "userService/login", {email: email, password: password});
    }
}
