import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { MonaSerService } from '../mona-ser.service';
import { HttpClient } from '@angular/common/http';

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


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  users: User[] = [];

  constructor(private userService: MonaSerService, private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  viewVouchers(userId: string): void {
    this.http.get<any[]>('https://67e2bc4a97fc65f535375ff8.mockapi.io/Voucher').subscribe(vouchers => {
      const userVouchers = vouchers.filter(v => v.Userid.includes(userId));

      if (userVouchers.length === 0) {
        Swal.fire('No Vouchers', 'This user has no vouchers.', 'info');
        return;
      }

      const html = userVouchers.map(v => `
      <div style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #ccc;">
        <strong style="color: #E72463;">${v.Name}</strong> - <span>${v.Discount}% Off</span>
      </div>
    `).join('');

      Swal.fire({
        title: 'User Vouchers',
        html,
        width: 500,
        scrollbarPadding: false,
        customClass: {
          htmlContainer: 'text-start'
        },
        confirmButtonText: 'Close',
        showCloseButton: true
      });
    });
  }


  viewOrders(userId: string): void {
    this.http.get<any[]>('https://67d293bd90e0670699be2936.mockapi.io/Order').subscribe(orders => {
      const userOrders = orders
        .map(order => order.orderData?.find((o: any) => o.userId?.toString() === userId))
        .filter(Boolean);

      if (userOrders.length === 0) {
        Swal.fire('No Orders', 'This user has no orders.', 'info');
        return;
      }

      const html = userOrders.map(order => `
      <div style="text-align:left; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ccc;">
        <p><strong>Recipient:</strong> ${order.recipientName}</p>
        <p><strong>Location:</strong> ${order.location}</p>
        <p><strong>Phone:</strong> ${order.phoneNumber}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        <p><strong>Total:</strong> $${order.totalPrice}</p>
        <div><strong>Products:</strong>
          <ul style="padding-left: 1.2rem;">
            ${order.products.map((p: any) => `
              <li style="margin-bottom:5px;">
                <img src="${p.img}" width="50" style="margin-right:10px; vertical-align:middle;" />
                <strong>${p.name}</strong> - ${p.quantity} pcs - $${p.price}
                <br><small>"${p.message}"</small>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `).join('');

      Swal.fire({
        title: 'User Orders',
        html,
        width: 700,
        scrollbarPadding: false,
        customClass: {
          htmlContainer: 'text-start'
        },
        showCloseButton: true,
        confirmButtonText: 'Close'
      });
    });
  }


}

