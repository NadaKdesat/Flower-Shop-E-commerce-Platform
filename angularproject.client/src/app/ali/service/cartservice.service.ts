import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartserviceService {

  private loggedApiUrl = 'https://67e3fe882ae442db76d27d2c.mockapi.io/logged';
  private userCartApiUrl = 'https://67d6b64c286fdac89bc2c055.mockapi.io/carts';
  private guestCartApiUrl = 'https://67e5257f18194932a584bef7.mockapi.io/GuestCart';

  constructor(private http: HttpClient) { }

  // ✅ تحقق من حالة المستخدم إذا كان مسجل دخول أو ضيف
  checkLoggedStatus(): Observable<any> {
    return this.http.get<any>(this.loggedApiUrl);
  }

  // ✅ جلب الكارت بناءً على User ID
  getCartByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.userCartApiUrl}?userId=${userId}`);
  }

  // ✅ جلب الكارت الخاص بالضيف
  getGuestCart(): Observable<any> {
    return this.http.get<any>(this.guestCartApiUrl);
  }

  // ✅ إضافة منتج إلى الكارت الخاص بالمستخدم
  addProductToCart(cartId: string, products: any[]): Observable<any> {
    return this.http.put(`${this.userCartApiUrl}/${cartId}`, { products });
  }

  // ✅ تحديث الكارت للمستخدم
  updateCart(cartId: string, products: any[]): Observable<any> {
    return this.http.put(`${this.userCartApiUrl}/${cartId}`, { products });
  }

  // ✅ حذف منتج من الكارت
  deleteProductFromCart(cartId: string, updatedProducts: any[]): Observable<any> {
    return this.http.put(`${this.userCartApiUrl}/${cartId}`, { products: updatedProducts });
  }

  // ✅ حذف كارت المستخدم بالكامل بعد الشيك أوت
  clearCart(cartId: string): Observable<any> {
    return this.http.put(`${this.userCartApiUrl}/${cartId}`, { products: [] });
  }

  // ✅ جلب الكارت الخاص بالضيف وتحديثه 
  updateGuestCart(cartId: string, products: any[]): Observable<any> {
    return this.http.put(`${this.guestCartApiUrl}/${cartId}`, { products });
  }
}
