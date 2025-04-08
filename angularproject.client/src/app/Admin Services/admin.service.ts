import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) { }

  private CategoryAPI = 'https://67d5f9cd286fdac89bc0e100.mockapi.io/Categories';
  private ProductAPI = 'https://67e2bc4a97fc65f535375ff8.mockapi.io/product';
  private OrderAPI = 'https://67d293bd90e0670699be2936.mockapi.io/Order';

  AddCategory(Category: any) {
    return this._http.post(this.CategoryAPI, Category);
  }

  ShowAllCategory() {
    return this._http.get(this.CategoryAPI);
  }

  editCategory(id: any, EditedCategory: any) {
    return this._http.put(`${this.CategoryAPI}/${id}`, EditedCategory);
  }

  GetCategoryByID(id: any) {
    return this._http.get(`${this.CategoryAPI}/${id}`);
  }

  DeleteCategory(id: any) {
    return this._http.delete(`${this.CategoryAPI}/${id}`)
  }

  AddProduct(Product: any) {
    return this._http.post(this.ProductAPI, Product)
  }
  updateCategory(id: any, data: any) {
    return this._http.put(`${this.CategoryAPI}/${id}`, data);
  }
 

  ShowAllProduct() {
    return this._http.get(this.ProductAPI)
  }

  DeleteProduct(id: any) {
    return this._http.delete(`${this.ProductAPI}/${id}`)
  }

  UpdateProduct(id: any, data: any) {
    return this._http.put(`${this.ProductAPI}/${id}`, data);
  }


  ShowAllOrders() {
    return this._http.get<any[]>(this.OrderAPI); 
  }


  UpdateOrder(userId: any, data: any) {
    return this._http.put(`${this.OrderAPI}/${userId}`, data);
  }


  
  userBehavior = new BehaviorSubject<string>('');  // تعريف الـ BehaviorSubject الذي يستخدم في النظام
  userObservable = this.userBehavior.asObservable();  // تحويله إلى Observable للاشتراك فيه
}




