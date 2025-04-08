import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartserviceService } from '../service/cartservice.service';
import { OrderService } from '../service/order.service';
import { VoucherService } from '../service/voucher.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

interface CartProduct {
  productId: string;
  quantity: number;
  message: string;
  name?: string;
  price?: number;
  img?: string;
}

interface Cart {
  userId: number;
  products: CartProduct[];
  cartId: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  userId: number = 0;
  cart!: Cart;
  username: string = '';
  totalPrice: number = 0;
  location: string = '';
  phoneNumber: string = '';
  recipientName: string = '';
  paymentMethod: string = 'Orange Money';
  isLoading: boolean = true;
  discountedPrice: number = 0;
  deliveryDate: string = '';
  deliveryTime: string = '';
  orangeMoneyImageUrl: string = '';
  orangeMoneyScreenshotFile!: File;

  constructor(
    private cartService: CartserviceService,
    private orderService: OrderService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getUserIdFromLoggedApi();
  }

  getUserIdFromLoggedApi(): void {
    this.cartService.checkLoggedStatus().subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0 && response[0].userId) {
          this.userId = Number(response[0].userId);
          this.username = response[0].Name || 'Unknown User';
          console.log('✅ User ID Retrieved from Logged API (Array):', this.userId);
        } else {
          console.error('❌ Failed to retrieve user ID from logged API. Response:', response);
        }
        if (this.userId) {
          this.loadCart();
        }
      },
      (error) => console.error('❌ Error fetching user ID from logged API:', error)
    );
  }

  loadCart(): void {
    this.cartService.getCartByUserId(this.userId).subscribe(
      (cartData: Cart[]) => {
        if (cartData.length > 0) {
          this.cart = cartData[0];
          this.calculateTotalPrice();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to load cart:', error);
        this.isLoading = false;
      }
    );
  }

  calculateTotalPrice(): void {
    this.totalPrice = 0;
    if (this.cart && this.cart.products) {
      this.cart.products.forEach(product => {
        if (product.price && product.quantity) {
          this.totalPrice += product.price * product.quantity;
        }
      });
      this.discountedPrice = this.totalPrice;
    }
  }

  completeOrder(): void {
    if (!this.location || !this.phoneNumber || !this.recipientName || !this.deliveryDate || !this.deliveryTime) {
      alert('Please fill in all the required fields including delivery date and time.');
      return;
    }

    // ✅ تنبيه إن الصورة مطلوبة فقط في Orange Money
    if (this.paymentMethod === 'Orange Money' && !this.orangeMoneyImageUrl) {
      Swal.fire('⚠️ Required', 'Please upload a screenshot of your Orange Money payment.', 'warning');
      return;
    }

    const orderData = {
      userId: this.userId,
      username: this.username,
      products: this.cart.products,
      location: this.location,
      phoneNumber: this.phoneNumber,
      recipientName: this.recipientName,
      paymentMethod: this.paymentMethod,
      receiptImageUrl: this.paymentMethod === 'Orange Money' ? this.orangeMoneyImageUrl : '',
      deliveryDate: this.deliveryDate,
      deliveryTime: this.deliveryTime,
      date: new Date().toISOString(),
      totalPrice: this.discountedPrice,
      status: 'Placed'
    };

    this.orderService.getUserOrders(this.userId.toString()).subscribe(
      (response) => {
        if (response && response.orderData) {
          response.orderData.push(orderData);
          this.orderService.addOrder(this.userId.toString(), response.orderData).subscribe(
            () => {
              console.log('Order added successfully!');
              Swal.fire({
                title: 'Order Placed Successfully! 🎉',
                text: 'Your order has been added successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#E72463',
                background: '#fff',
                backdrop: `rgba(0,0,0,0.4)`
              });
              this.clearCart();
            },
            (error) => console.error('Failed to update order:', error)
          );
        }
      },
      (error) => {
        if (error.status === 404) {
          this.orderService.createUserOrder(this.userId.toString(), [orderData]).subscribe(
            () => {
              console.log('New order created successfully!');
              Swal.fire({
                title: 'New Order Created! 🎉',
                text: 'Your order has been created successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#E72463',
                background: '#fff',
                backdrop: `rgba(0,0,0,0.4)`
              });
              this.clearCart();
            },
            (error) => console.error('Failed to create order:', error)
          );
        } else {
          console.error('Failed to retrieve user orders:', error);
        }
      }
    );
  }

  clearCart(): void {
    if (!this.cart || !this.cart.cartId) return;

    this.cartService.clearCart(this.cart.cartId).subscribe(
      () => {
        console.log('Cart cleared successfully!');
        this.cart.products = [];
        this.totalPrice = 0;
        this.discountedPrice = 0;
      },
      (error) => console.error('Failed to clear cart:', error)
    );
  }

  onOrangeMoneyImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    this.http.post<any>('https://api.imgbb.com/1/upload?key=8c8ce81a714d22cb8e6e71c2dd4dd49d', formData)
      .subscribe({
        next: (res) => {
          this.orangeMoneyImageUrl = res.data.url;
          Swal.fire('✅ Uploaded', 'Payment screenshot uploaded successfully.', 'success');
        },
        error: () => {
          Swal.fire('❌ Error', 'Failed to upload screenshot. Try again.', 'error');
        }
      });
  }
}
