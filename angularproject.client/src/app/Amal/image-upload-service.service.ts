import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadServiceService {

  private imgbbApiKey = '8c8ce81a714d22cb8e6e71c2dd4dd49d';
  private uploadUrl = 'https://api.imgbb.com/1/upload';

  private faceppApiUrl = 'https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/compare';
  private faceppApiKey = 'xMYfu3JiuCGP5unhDl_ti59hvSlfldXR';
  private faceppApiSecret = 'sZXttixl5PZy5lxAZIRwU-jU4c2FNHBA';

  constructor(private http: HttpClient) { }

  // ✅ رفع صورة إلى ImgBB
  uploadImageToImgBB(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', this.imgbbApiKey);

    return this.http.post(this.uploadUrl, formData)
      .pipe(
        catchError((error) => {
          console.error('❌ Error uploading to ImgBB:', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ مقارنة صورتين باستخدام Face++ عبر CORS Proxy
  compareImages(imageUrl1: string, imageUrl2: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('api_key', this.faceppApiKey);
    body.set('api_secret', this.faceppApiSecret);
    body.set('image_url1', imageUrl1);
    body.set('image_url2', imageUrl2);

    return this.http.post(this.faceppApiUrl, body.toString(), { headers })
      .pipe(
        catchError((error) => {
          console.error('❌ Error comparing faces:', error);
          return throwError(() => error);
        })
      );
  }
}
