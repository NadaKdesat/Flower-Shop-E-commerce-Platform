import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { MonaSerService } from '../mona-ser.service';

interface Voucher {
  Name: string;
  Discount: number;
  Userid: string[];
  id: string;
}
interface User {
  id: string;
  Email: string;
}

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.css'
})
export class VouchersComponent {

  vouchers: Voucher[] = [];
  users: User[] = [];
  newVoucher: Voucher = { Name: '', Discount: 0, Userid: [], id: '' };
  editVoucher: Voucher | null = null;

  constructor(private voucherService: MonaSerService, private userService: MonaSerService) { }

  ngOnInit(): void {
    this.getVouchers();
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getVouchers(): void {
    this.voucherService.getVouchers().subscribe(vouchers => {
      this.vouchers = vouchers;
    });
  }

  getUserEmailById(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.Email : 'Unknown Email';
  }

  selectAllUsers(): void {
    this.newVoucher.Userid = this.users.map(u => u.id);
  }

  selectAllUsersForEdit(): void {
    if (this.editVoucher) {
      this.editVoucher.Userid = this.users.map(u => u.id);
    }
  }

  openCreateModal(): void {
    const modal = document.getElementById('createVoucherModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'custom-backdrop';
      document.body.appendChild(backdrop);

      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  createVoucher(): void {
    if (this.newVoucher.Name && this.newVoucher.Discount >= 0) {
      this.voucherService.createVouchers(this.newVoucher).subscribe(voucher => {
        this.vouchers.push(voucher);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Voucher created successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        this.newVoucher = { Name: '', Discount: 0, Userid: [], id: '' };
        this.closeModal();
      });
    }
  }

  openEditModal(voucher: Voucher): void {
    this.editVoucher = { ...voucher };

    const modal = document.getElementById('editVoucherModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'custom-backdrop';
      document.body.appendChild(backdrop);

      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    ['editVoucherModal', 'createVoucherModal'].forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('role');
      }
    });

    const backdrop = document.getElementById('custom-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  saveEditVoucher(): void {
    if (this.editVoucher) {
      this.voucherService.updateVouchers(this.editVoucher).subscribe(updatedVoucher => {
        const index = this.vouchers.findIndex(v => v.id === updatedVoucher.id);
        if (index !== -1) {
          this.vouchers[index] = updatedVoucher;
        }
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Voucher updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        this.editVoucher = null;
        this.closeModal();
      });
    }
  }

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.deleteVouchers(id).subscribe(() => {
          this.vouchers = this.vouchers.filter(v => v.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Voucher deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }
}

