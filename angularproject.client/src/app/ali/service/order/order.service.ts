import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersApiUrl = 'https://67d293bd90e0670699be2936.mockapi.io/Order';  // رابط API الطلبات
  private loggedApiUrl = 'https://67e3fe882ae442db76d27d2c.mockapi.io/logged';  // رابط API اللوقد

  constructor(private http: HttpClient) { }

  // ✅ التحقق من المستخدم وتحديد UserID من API اللوقد
  checkLoggedStatus(): Observable<any> {
    return this.http.get<any>(this.loggedApiUrl);
  }

  // ✅ جلب الطلبات الخاصة بالمستخدم باستخدام userId
  getUserOrders(userId: string): Observable<any> {
    return this.http.get<any>(`${this.ordersApiUrl}/${userId}`);
  }


  // ✅ تحديث حالة الطلب (مثلاً: pending, approved, shipped, delivered)
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.ordersApiUrl}/${orderId}`, { status });
  }
}
