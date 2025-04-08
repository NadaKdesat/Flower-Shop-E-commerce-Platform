import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../service/voucher.service';
import Swal from 'sweetalert2';

interface Voucher {
  id?: string;
  Discount: number;
  Userid: string[];
  openedDates?: { [userId: string]: string }; // ⬅️ إضافة سجل تواريخ الفتح لكل يوزر
}

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
  userId: string = '';
  boxOpened: boolean = false;
  isOpening: boolean = false;
  showResult: boolean = false;
  selectedDiscount: string = '';

  vouchers: Voucher[] = [
    { Discount: 5, Userid: [] },
    { Discount: 10, Userid: [] },
    { Discount: 15, Userid: [] },
    { Discount: 20, Userid: [] },
    { Discount: 25, Userid: [] },
    { Discount: 30, Userid: [] },
    { Discount: 35, Userid: [] },
    { Discount: 40, Userid: [] }
  ];

  constructor(private voucherService: VoucherService) { }

  ngOnInit(): void {
    this.voucherService.checkLoggedStatus().subscribe((res: any) => {
      if (res?.[0]?.userId) {
        this.userId = res[0].userId.toString();
        this.loadVouchers();
      }
    });
  }

  loadVouchers(): void {
    this.voucherService.getAllVouchers().subscribe((data: Voucher[]) => {
      this.vouchers = data;
    });
  }

  openBox(): void {
    if (this.isOpening || this.boxOpened) return;

    const lastOpenDate = this.getLastOpenDate();
    if (lastOpenDate && !this.canOpenThisMonth(lastOpenDate)) {
      this.showCooldownPopup(lastOpenDate);
      return;
    }

    this.isOpening = true;
    this.boxOpened = true;

    const randomIndex = Math.floor(Math.random() * this.vouchers.length);
    const selectedVoucher = this.vouchers[randomIndex];

    this.selectedDiscount = selectedVoucher.Discount + '%';
    this.showResult = true;

    setTimeout(() => {
      this.isOpening = false;
      this.saveVoucherToUser(selectedVoucher);
    }, 1000);
  }

  closePopup(): void {
    this.showResult = false;
  }

  private getLastOpenDate(): Date | null {
    for (let voucher of this.vouchers) {
      if (voucher.openedDates && voucher.openedDates[this.userId]) {
        return new Date(voucher.openedDates[this.userId]);
      }
    }
    return null;
  }

  private canOpenThisMonth(lastOpened: Date): boolean {
    const now = new Date();
    return now.getFullYear() > lastOpened.getFullYear() || now.getMonth() > lastOpened.getMonth();
  }

  private showCooldownPopup(lastOpened: Date): void {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diff = nextMonth.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    Swal.fire({
      icon: 'info',
      title: 'You can only open the box once per month!',
      html: `Try again in <strong>${days}d ${hours}h ${minutes}m</strong>`,
      confirmButtonColor: '#d32f2f'
    });
  }

  private saveVoucherToUser(voucher: Voucher): void {
    const today = new Date().toISOString();

    if (!voucher.Userid.includes(this.userId)) {
      voucher.Userid.push(this.userId);
    }

    if (!voucher.openedDates) voucher.openedDates = {};
    voucher.openedDates[this.userId] = today;

    if (voucher.id) {
      this.voucherService.updateVoucher(voucher.id, voucher, this.userId).subscribe({
        next: (res) => console.log('✅ Voucher updated', res),
        error: (err) => console.error('❌ Update error', err)
      });
    } else {
      this.voucherService.createVoucher(voucher).subscribe({
        next: (res) => voucher.id = res.id,
        error: (err) => console.error('❌ Create error', err)
      });
    }
  }
}
