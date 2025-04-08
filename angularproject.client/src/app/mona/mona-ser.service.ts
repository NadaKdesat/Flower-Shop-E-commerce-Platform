import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


interface User {
  id: string;        
  Name: string;     
  Email: string;     
  Password: string;  
  Img: string;       
  PhoneNum: string;  
  Gender: string;    
  VoucherId: string[]; 
}

interface Voucher {
  Name: string;
  Discount: number;
  Userid: string[];
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonaSerService {

  constructor(private _http: HttpClient) { }


  //////////////////////////////////////users////////////////////////////////////

  getUsers(): Observable<User[]> {
    return this._http.get<User[]>("https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration");
  }

  ////////////////////////////////////vouchers////////////////////////////////

  private apiUrl = 'https://67e2bc4a97fc65f535375ff8.mockapi.io/Voucher';


  getVouchers(): Observable<Voucher[]> {
    return this._http.get<Voucher[]>(this.apiUrl);
  }

  createVouchers(voucher: Voucher): Observable<Voucher> {
    return this._http.post<Voucher>(this.apiUrl, voucher);
  }

  updateVouchers(voucher: Voucher): Observable<Voucher> {
    return this._http.put<Voucher>(`${this.apiUrl}/${voucher.id}`, voucher);
  }

  deleteVouchers(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
