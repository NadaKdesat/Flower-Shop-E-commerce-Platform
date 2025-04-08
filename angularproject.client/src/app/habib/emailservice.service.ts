import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as emailjs from 'emailjs-com';



@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

  constructor(private _http: HttpClient) { }

  sendEmail(email: string, resetCode: string, id: any) {
    return emailjs.send(
      'service_kwvtdxr',
      'template_0xh8hqu',
      {
        email: email,
        reset_code: resetCode,
        id: id
      },
      'ak8XwcvPwPsxFSSIU'
    );
  }
  getdata(): Observable<any> {
    return this._http.get<any>('https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration')
  }
  putdata(data: any, id: any) {
    return this._http.put(`https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration/${id}`, data)
  }
}
