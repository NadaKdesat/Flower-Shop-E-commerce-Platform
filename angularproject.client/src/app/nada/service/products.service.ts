import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
export interface ICategory {
  Name: string;
  Img: string;
  Description: string;
  id: string;
}

export interface IRating {
  userName: string;
  score: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
  userImage?: string;
}

export interface IProduct {
  Categoryid: string;
  Name: string;
  Description: string;
  Discount: number;
  Price: number;
  Img: string;
  Available: boolean;
  Color: string;
  Rating: IRating[];
  Tag: string[];
  id: string;
}

export interface ICart {
  cartId: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    message: string;
    name: string;
    price: number;
    img: string;
  }[];
}


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private _http: HttpClient) { }

  getAllCategories(): Observable<ICategory[]> {
    return this._http.get<ICategory[]>("https://67d5f9cd286fdac89bc0e100.mockapi.io/Categories");
  }

  getAllProducts(): Observable<IProduct[]> {
    return this._http.get<IProduct[]>("https://67e2bc4a97fc65f535375ff8.mockapi.io/product");
  }

  getProductsByCategoryId(CategoryId: string): Observable<IProduct[]> {
    return this._http.get<IProduct[]>(`https://67e2bc4a97fc65f535375ff8.mockapi.io/product?Categoryid=${CategoryId}`);
  }

  getProductById(Id: string): Observable<IProduct> {
    return this._http.get<IProduct>(`https://67e2bc4a97fc65f535375ff8.mockapi.io/product/${Id}`);
  }

  addReview(productId: string, review: any): Observable<any> {
    return this._http.get(`https://67e2bc4a97fc65f535375ff8.mockapi.io/product/${productId}`).pipe(
      switchMap((product: any) => {
        const updatedRatings = [...product.Rating, review];
        return this._http.put(`https://67e2bc4a97fc65f535375ff8.mockapi.io/product/${productId}`, { ...product, Rating: updatedRatings });
      })
    );
  }

  getUniqueTags(): Observable<string[]> {
    return this.getAllProducts().pipe(
      map((products: IProduct[]) => {
        const allTags = products.flatMap(product => product.Tag || []);
        return [...new Set(allTags)];
      })
    );
  }

  getLoggedUser(): Observable<any> {
    return this._http.get("https://67e3fe882ae442db76d27d2c.mockapi.io/logged");
  }

  getCartByUserId(userId: string): Observable<ICart[]> {
    return this._http.get<ICart[]>(`https://67d6b64c286fdac89bc2c055.mockapi.io/carts?userId=${userId}`);
  }

  updateCart(cartId: string, cartData: any): Observable<any> {
    return this._http.put(`https://67d6b64c286fdac89bc2c055.mockapi.io/carts/${cartId}`, cartData);
  }

  createCart(cartData: any): Observable<any> {
    return this._http.post("https://67d6b64c286fdac89bc2c055.mockapi.io/carts", cartData);
  }

  getGuestCart(): Observable<any> {
    return this._http.get("https://67e5257f18194932a584bef7.mockapi.io/GuestCart");
  }

  addOrUpdateGuestCart(product: any): Observable<any> {
    return this.getGuestCart().pipe(
      switchMap((cart: any[]) => {
        let guestCart;

        if (cart.length > 0) {
          guestCart = cart[0];
        } else {
          guestCart = { id: "1", products: [] };
        }

        const existingProduct = guestCart.products.find((p: any) => p.productId === product.productId);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          guestCart.products.push(product);
        }

        if (cart.length > 0) {
          return this._http.put(`https://67e5257f18194932a584bef7.mockapi.io/GuestCart/${guestCart.id}`, guestCart);
        } else {
          return this._http.post("https://67e5257f18194932a584bef7.mockapi.io/GuestCart", guestCart);
        }
      })
    );
  }
}
