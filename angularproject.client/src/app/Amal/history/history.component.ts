import { Component } from '@angular/core';
import { SaService } from '../sa.service';
import Swal from 'sweetalert2';
import { ProductsService } from '../../nada/service/products.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  stuff: any[] = [];
  userId: string = '';
  userName: string = '';      // ✅ اسم المستخدم
  userImage: string = '';     // ✅ صورة المستخدم

  selectedRating: number = 0;
  comment: string = '';
  selectedProduct: any;
  productId: string = '';
  showRatingPopup: boolean = false;

  constructor(
    private _h: SaService,
    private productService: ProductsService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getUserIdFromLoggedApi();
  }

  // ✅ جلب userId من Logged API ثم جلب بيانات المستخدم من Registration API
  getUserIdFromLoggedApi() {
    this._h.checkLoggedStatus().subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0 && response[0].userId) {
          this.userId = response[0].userId.toString();
          console.log('✅ User ID:', this.userId);
          this.getUserData(this.userId); // ⬅️ نجلب الاسم والصورة معًا
          this.showhistory();
        } else {
          console.error('❌ Failed to retrieve user ID from Logged API. Response:', response);
        }
      },
      (error) => console.error('❌ Error fetching user ID from Logged API:', error)
    );
  }

  // ✅ جلب اسم وصورة المستخدم
  getUserData(id: string) {
    this.http.get<any>(`https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration/${id}`).subscribe(
      (user) => {
        this.userName = user.Name || 'User';
        this.userImage = user.Img || '';
        console.log('👤 Name:', this.userName);
        console.log('🖼️ Image:', this.userImage);
      },
      (error) => console.error('❌ Error fetching user data:', error)
    );
  }

  showhistory() {
    if (this.userId) {
      this._h.gethistory(this.userId).subscribe(
        (data) => {
          this.stuff = data.orderData;
          console.log('✅ Order history loaded:', this.stuff);
        },
        (error) => console.error('❌ Error fetching order history:', error)
      );
    }
  }

  openRatingPopup(order: any, product: any) {
    if (order.status === 'Delivered') {
      this.selectedProduct = product;
      this.productId = product.productId;

      if (!this.productId) {
        Swal.fire('Error', 'Cannot identify the product to review.', 'error');
        return;
      }

      this.showRatingPopup = true;
    }
  }

  closePopup() {
    this.showRatingPopup = false;
    this.selectedRating = 0;
    this.comment = '';
  }

  setRating(star: number) {
    this.selectedRating = star;
  }

  // ✅ إرسال التقييم مع userId + userName + userImage
  submitReview(productId: string) {
    const reviewData = {
      userId: this.userId,
      userName: this.userName,
      userImage: this.userImage,
      score: this.selectedRating,
      comment: this.comment,
      date: new Date().toISOString()
    };

    this.productService.addReview(productId, reviewData).subscribe(
      () => {
        Swal.fire('✅ Success!', 'Your review has been submitted.', 'success');
        this.closePopup();
      },
      (error) => {
        console.error('❌ Error submitting review:', error);
        Swal.fire('❌ Error', 'Failed to submit review.', 'error');
      }
    );
  }
}
