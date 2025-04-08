import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


interface Voucher {
  id?: string;
  Discount: number;
  openedDates?: { [userId: string]: string }

  Userid: string[];
}

@Injectable({
  providedIn: 'root'
})


export class VoucherService {



  private voucherApiUrl = 'https://67e2bc4a97fc65f535375ff8.mockapi.io/Voucher';
  private userApiUrl = 'https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration';
  private loggedApiUrl = 'https://67e3fe882ae442db76d27d2c.mockapi.io/logged';


  constructor(private http: HttpClient) { }

  checkLoggedStatus(): Observable<any> {
    return this.http.get<any>(this.loggedApiUrl);
  }

  getAllVouchers(): Observable<any[]> {
    return this.http.get<any[]>(this.voucherApiUrl);
  }

  getVouchersByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.voucherApiUrl}?Userid=${userId}`);
  }

  updateVoucher(voucherId: string, updatedData: Voucher, userId: string): Observable<any> {
    console.log('📤 Sending data to Voucher API:', updatedData);
    return this.http.put<any>(`${this.voucherApiUrl}/${voucherId}`, updatedData);
  }

  deleteVoucher(voucherId: string, userId: string): Observable<any> {
    const deleteVoucher$ = this.http.delete<any>(`${this.voucherApiUrl}/${voucherId}`);

    const updateUser$ = this.http.get<any>(`${this.userApiUrl}/${userId}`).pipe(
      map(user => {
        user.VoucherId = user.VoucherId.filter((id: string) => id !== voucherId);
        return this.http.put<any>(`${this.userApiUrl}/${userId}`, user).subscribe();
      })
    );

    return forkJoin([deleteVoucher$, updateUser$]);
  }


  createVoucher(newVoucher: Voucher): Observable<any> {
    console.log('📤 Creating new voucher (POST):', newVoucher);
    return this.http.post<any>(this.voucherApiUrl, newVoucher);
  }

  deleteUserVoucher(userId: string, voucherId: string): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/${userId}`).pipe(
      map(user => {
        user.VoucherId = user.VoucherId.filter((id: string) => id !== voucherId);
        return this.http.put<any>(`${this.userApiUrl}/${userId}`, user).subscribe();
      })
    );
  }
}
