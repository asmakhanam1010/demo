import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasscodeService {

  constructor(private httpClient: HttpClient) { }

  checkPasscodes(passCode: any): Observable<any> {
    var params = new HttpParams().set("passcode", passCode);
    return this.httpClient.get(environment.apiBaseUrl + "userService/validatePassCode", { params });
  }
}
