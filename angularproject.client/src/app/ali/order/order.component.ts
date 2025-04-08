import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order/order.service';

interface Order {
  userId: number;
  products: any[];
  location: string;
  phoneNumber: string;
  recipientName: string;
  paymentMethod: string;
  date: string;
  totalPrice: number;
  status: string;
  id: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  userId: number = 0;
  orders: Order[] = [];
  isLoading: boolean = true;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getUserIdFromLoggedApi();
  }

  getUserIdFromLoggedApi(): void {
    this.orderService.checkLoggedStatus().subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0 && response[0].userId) {
          this.userId = Number(response[0].userId);
          console.log('✅ User ID Retrieved from Logged API:', this.userId);
          this.loadUserOrders();
        } else {
          console.error('❌ Failed to retrieve user ID from logged API. Response:', response);
        }
      },
      (error) => console.error('❌ Error fetching user ID from logged API:', error)
    );
  }

  loadUserOrders(): void {
    this.orderService.getUserOrders(this.userId.toString()).subscribe(
      (response) => {
        if (response && response.orderData) {
          this.orders = response.orderData;
          console.log('✅ User Orders Retrieved Successfully:', this.orders);
        } else {
          console.error('❌ No orders found for this user.');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('❌ Failed to load user orders:', error);
        this.isLoading = false;
      }
    );
  }
}
