import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, switchMap, catchError, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdnanService {

  constructor(private _url: HttpClient) { }

  userBehavior = new BehaviorSubject<string>('');
  userObservable = this.userBehavior.asObservable();

  getProducts(): Observable<any> {
    return this._url.get('https://67e2bc4a97fc65f535375ff8.mockapi.io/product');
  }


  postNewUser(data: any): Observable<any> {
    return this._url.post("https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration", data)
      .pipe(catchError(error => this.handleError(error)));
  }

  getAllUsers(): Observable<any[]> {
    return this._url.get<any[]>("https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration")
      .pipe(catchError(error => this.handleError(error)));
  }

  validateUser(userCredentials: any): Observable<any> {
    return this._url.post('https://67e3fe882ae442db76d27d2c.mockapi.io/logged', userCredentials)
      .pipe(catchError(error => this.handleError(error)));
  }

  contactfeedbck(data: any) {
    return this._url.post('https://67e2c65297fc65f53537891e.mockapi.io/Feedback', data)
  }

  getAllLoggedUsers(): Observable<any[]> {
    return this._url.get<any[]>('https://67e3fe882ae442db76d27d2c.mockapi.io/logged')
      .pipe(catchError(error => this.handleError(error)));
  }

  removeUserFromLogged(userId: string): Observable<any> {
    return this._url.delete(`https://67e3fe882ae442db76d27d2c.mockapi.io/logged/${userId}`)
      .pipe(catchError(error => this.handleError(error)));
  }

  mergeGuestCartWithUserCart(userId: number): Observable<any> {
    return this._url.get<any>('https://67e5257f18194932a584bef7.mockapi.io/GuestCart/1').pipe(
      switchMap((guestCart: any) => {

        if (guestCart && guestCart.products && guestCart.products.length > 0) {
          const productsToAdd = guestCart.products;

          return this._url.get<any[]>('https://67d6b64c286fdac89bc2c055.mockapi.io/carts').pipe(
            switchMap((userCarts: any[]) => {

              const userCart = userCarts.find(cart => cart.userId.toString() === userId.toString());

              if (userCart && userCart.id) {  // ✅ المستخدم لديه كارت بالفعل
                const updatedProducts = this.mergeProducts(userCart.products, productsToAdd);

                return this._url.put(`https://67d6b64c286fdac89bc2c055.mockapi.io/carts/${userCart.id}`, {
                  userId: userId.toString(),
                  products: updatedProducts
                }).pipe(
                  switchMap(() => this.clearGuestCart()),
                  catchError(error => this.handleError(error))
                );

              } else {  // ❌ المستخدم ليس لديه كارت مسبقًا
                const newCart = { userId: userId.toString(), products: productsToAdd };

                return this._url.post('https://67d6b64c286fdac89bc2c055.mockapi.io/carts', newCart).pipe(
                  switchMap(() => this.clearGuestCart()),
                  catchError(error => this.handleError(error))
                );
              }
            }),
            catchError(error => this.handleError(error))
          );

        } else {
          console.log("⚠️ GuestCart is empty or doesn't exist. No merging required.");
          return of(null);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  private clearGuestCart(): Observable<any> {
    return this._url.put('https://67e5257f18194932a584bef7.mockapi.io/GuestCart/1', { products: [] })
      .pipe(catchError(error => this.handleError(error)));
  }

  private mergeProducts(existingProducts: any[], newProducts: any[]): any[] {
    const mergedProducts = [...existingProducts];

    newProducts.forEach(newProduct => {
      const existingProduct = mergedProducts.find(p => p.productId === newProduct.productId);

      if (existingProduct) {
        existingProduct.quantity += newProduct.quantity;
      } else {
        mergedProducts.push(newProduct);
      }
    });

    return mergedProducts;
  }

  private handleError(error: any): Observable<never> {
    console.error("❌ An error occurred:", error);
    return throwError(() => error);
  }
}
