import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://67d293bd90e0670699be2936.mockapi.io/Order';

  constructor(private http: HttpClient) { }

  // 1. Get Orders By User ID
  getUserOrders(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // 2. Add Order For Existing User
  addOrder(userId: string, orderData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, { orderData: orderData });
  }

  // 3. Create New User Order (إذا كان المستخدم غير موجود)
  createUserOrder(userId: string, orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { id: userId, orderData: [orderData] });
  }
}
