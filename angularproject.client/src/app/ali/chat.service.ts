import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatApiUrl = 'https://67e5257f18194932a584bef7.mockapi.io/chat';
  private imgbbUploadUrl = 'https://api.imgbb.com/1/upload';
  private imgbbApiKey = '8c8ce81a714d22cb8e6e71c2dd4dd49d';
  private loggedApiUrl = 'https://67e3fe882ae442db76d27d2c.mockapi.io/logged';
  private cartApiUrl = 'https://67d6b64c286fdac89bc2c055.mockapi.io/carts';

  constructor(private http: HttpClient) { }

  // جلب الرسائل
  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.chatApiUrl);
  }

  // إرسال رسالة نصية
  sendTextMessage(messageData: any): Observable<any> {
    return this.http.post<any>(this.chatApiUrl, messageData);
  }

  // رفع صورة إلى ImgBB
  uploadImageToImgBB(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', this.imgbbApiKey);
    return this.http.post<any>(this.imgbbUploadUrl, formData);
  }

  // إرسال رسالة مع صورة
  sendMessageWithImage(messageData: any, imageFile: File): Observable<any> {
    return this.uploadImageToImgBB(imageFile).pipe(
      switchMap((imgbbResponse: any) => {
        const imageUrl = imgbbResponse.data.url;
        messageData.image = imageUrl;
        return this.sendTextMessage(messageData);
      })
    );
  }

  // ✅ جلب معرف المستخدم الحالي من Logged API
  getLoggedUserId(): Observable<number> {
    return this.http.get<any[]>(this.loggedApiUrl).pipe(
      switchMap((users: any[]) => {
        const user = users[0];  // أول مستخدم مسجل دخولًا
        const userId = Number(user?.userId);
        return new Observable<number>((observer) => {
          observer.next(userId);
          observer.complete();
        });
      })
    );
  }

  // ✅ إضافة منتج إلى سلة المستخدم
  addProductToUserCart(userId: number, product: any): Observable<any> {
    return this.http.get<any[]>(`${this.cartApiUrl}?userId=${userId}`).pipe(
      switchMap((carts) => {
        if (carts.length > 0) {
          const cart = carts[0];
          cart.products.push(product);
          return this.http.put(`${this.cartApiUrl}/${cart.cartId}`, cart);
        } else {
          // إذا لم يكن لدى المستخدم سلة، أنشئ له واحدة
          const newCart = {
            userId: userId,
            products: [product]
          };
          return this.http.post(this.cartApiUrl, newCart);
        }
      })
    );
  }
}
