
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaService {

  private loggedApiUrl = 'https://67e3fe882ae442db76d27d2c.mockapi.io/logged';
  private registrationApiUrl = 'https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration';
  private orderApiUrl = 'https://67d293bd90e0670699be2936.mockapi.io/Order';

  constructor(private _http: HttpClient) { }

  // ✅ جلب بيانات المستخدمين من Logged API
  checkLoggedStatus(): Observable<any> {
    return this._http.get<any>(this.loggedApiUrl);
  }

  // ✅ جلب بيانات المستخدم من Registration API باستخدام userId
  getUserProfile(userId: string): Observable<any> {
    return this._http.get<any>(`${this.registrationApiUrl}/${userId}`);
  }

  // ✅ تحديث بيانات المستخدم
  postdata(userId: string, data: any): Observable<any> {
    return this._http.put<any>(`${this.registrationApiUrl}/${userId}`, data);
  }

  // ✅ جلب بيانات الطلبات بناءً على userId
  gethistory(userId: string): Observable<any> {
    return this._http.get<any>(`${this.orderApiUrl}/${userId}`);
  }

  
}
