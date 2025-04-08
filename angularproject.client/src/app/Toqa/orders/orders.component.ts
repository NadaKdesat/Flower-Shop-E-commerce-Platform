import { Component } from '@angular/core';
import { AdminService } from '../../Admin Services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  constructor(private _admin: AdminService) { }

  orders: any[] = [];
  usersWithOrders: any[] = [];
  selectedOrder: any = null;

  ngOnInit() {
    this.ShowAllOrders();
  }

  ShowAllOrders() {
    this._admin.ShowAllOrders().subscribe((data: any[]) => {
      this.usersWithOrders = data;

      const allOrders: any[] = [];

      data.forEach(user => {
        // تأكد إنه في orderData
        if (user.orderData && Array.isArray(user.orderData)) {
          user.orderData.forEach((order: any) => {
            allOrders.push({
              ...order,
              userId: Number(user.userId || user.id),
              username: order.username            });
          });
        }
      });

      this.orders = allOrders;
      console.log("✅ All Orders Extracted:", this.orders);
    });
  }

  updateStatus(order: any) {
    console.log(`Order ${order.userId} status changed to:`, order.status);

    const updatedOrders = this.orders
      .filter(o => o.userId === order.userId)
      .map(o => {
        if (o.date === order.date) {
          return { ...o, status: order.status };
        }
        return o;
      });

    this._admin.UpdateOrder(order.userId, { orderData: updatedOrders }).subscribe(() => {
      console.log(`Updated all orders for user ${order.userId}`);
    });
  }

  // ✅ استخراج اسم الدفع فقط (للطباعة أو العرض البسيط)
  extractPaymentText(payment: string): string {
    if (payment.includes('http')) {
      return payment.split('\n')[0];
    }
    return payment;
  }

  // ✅ التأكد إن فيه صورة دفع مرفقة
  hasPaymentImage(order: any): boolean {
    return !!order.orangeMoneyImage;
  }

  // ✅ عرض صورة الدفع فقط في SweetAlert
  showPaymentDetails(order: any): void {
    if (!order.orangeMoneyImage) return;
    Swal.fire({
      title: 'Payment Receipt',
      html: `<img src="${order.orangeMoneyImage}" alt="Payment Screenshot" style="max-width:100%; border-radius:10px;" />`,
      showCloseButton: true,
      showConfirmButton: false,
      background: '#fff',
      width: 500
    });
  }

  // ✅ فتح تفاصيل الطلب بالكامل
  // ✅ لا داعي الآن لفصل صورة الدفع من طريقة الدفع، لأن الصورة موجودة في receiptImageUrl
  showOrderDetails(order: any): void {
    this.selectedOrder = order;
    const productsHtml = order.products.map((p: any) => `
    <div style="margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:10px">
      <img src="${p.img}" alt="${p.name}" style="width:70px; height:70px; object-fit:cover; border-radius:5px;" />
      <div><strong>${p.name}</strong> - Qty: ${p.quantity} - ${p.price} JD</div>
      <div><em>Message:</em> ${p.message || 'No message'}</div>
    </div>
  `).join('');

    const paymentImage = order.receiptImageUrl
      ? `<img src="${order.receiptImageUrl}" style="max-width:100%; border-radius:10px;" />`
      : '';

    Swal.fire({
      title: `Order Details - ${order.username}`,
      html: `
      <div style="text-align:left">
        <p><strong>Phone:</strong> ${order.phoneNumber}</p>
        <p><strong>Recipient:</strong> ${order.recipientName}</p>
        <p><strong>Location:</strong> ${order.location}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        ${paymentImage}
        <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
        <p><strong>Delivery Time:</strong> ${order.deliveryTime}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice} JD</p>
        <hr />
        <h5>Products:</h5>
        ${productsHtml}
      </div>
    `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 600,
      background: '#fff',
    });
  }

  getCleanPaymentMethod(method: string): string {
    return method.split('http')[0].trim();
  }
}
