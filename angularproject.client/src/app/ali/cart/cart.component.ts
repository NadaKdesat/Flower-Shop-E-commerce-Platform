import { Component, OnInit } from '@angular/core';
import { CartserviceService } from '../service/cartservice.service';
import { VoucherService } from '../service/voucher.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  userId: number = 0;
  cart!: Cart;
  totalPrice: number = 0;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  vouchers: any[] = [];
  selectedVoucherId: string = '';
  discountedPrice: number = 0;

  constructor(
    private cartService: CartserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private voucherService: VoucherService
  ) { }

  ngOnInit(): void {
    this.checkUserStatus();
  }

  checkUserStatus(): void {
    this.cartService.checkLoggedStatus().subscribe(
      (response) => {
        console.log('🔍 Response from Logged API:', response);

        if (response && response.length > 0 && response[0].userId) {
          this.userId = Number(response[0].userId);
          console.log('✅ User ID Retrieved from Logged API:', this.userId);
          this.isLoggedIn = true;
          this.loadCart();
          this.loadUserVouchers();

        } else {
          console.log('🚫 No User ID Found. Loading Guest Cart...');
          this.loadGuestCart();
        }
      },
      (error) => {
        console.error('❌ Failed to check user status:', error);
        this.loadGuestCart();
      }
    );
  }

  loadCart(): void {
    this.cartService.getCartByUserId(this.userId).subscribe(
      (cartData: Cart[]) => {
        if (cartData.length > 0) {
          this.cart = cartData[0];
          console.log('✅ User Cart Loaded:', this.cart);
          this.calculateTotalPrice();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('❌ Failed to load user cart:', error);
        this.isLoading = false;
      }
    );
  }

  loadGuestCart(): void {
    this.cartService.getGuestCart().subscribe(
      (cartData: Cart[]) => {
        if (cartData.length > 0) {
          this.cart = cartData[0];
          console.log('✅ Guest Cart Loaded:', this.cart);
          this.calculateTotalPrice();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('❌ Failed to load guest cart:', error);
        this.isLoading = false;
      }
    );
  }

  calculateTotalPrice(): void {
    this.totalPrice = 0;
    this.cart.products.forEach(product => {
      if (product.price && product.quantity) {
        this.totalPrice += product.price * product.quantity;
      }
    });
  }

  increaseQuantity(product: CartProduct): void {
    product.quantity++;
    this.calculateTotalPrice();
  }

  decreaseQuantity(product: CartProduct): void {
    if (product.quantity > 1) {
      product.quantity--;
      this.calculateTotalPrice();
    }
  }

  loadUserVouchers(): void {
    this.voucherService.getVouchersByUserId(this.userId.toString()).subscribe(
      (vouchers: any[]) => this.vouchers = vouchers,
      (error) => console.error('Failed to load vouchers:', error)
    );
  }

  applyVoucher(): void {
    const selectedVoucher = this.vouchers.find(v => v.id === this.selectedVoucherId);
    if (selectedVoucher) {
      const discount = selectedVoucher.Discount;

      // ✅ تحديث السعر لكل منتج في الكارت
      this.cart.products.forEach(product => {
        if (product.price) {
          const discountedPrice = product.price - (product.price * (discount / 100));
          product.price = parseFloat(discountedPrice.toFixed(2));
        }
      });

      // ✅ إعادة حساب التوتال برايس بعد الخصم
      this.calculateTotalPrice();
      this.discountedPrice = this.totalPrice;

      // ✅ تحديث الكارت بالأسعار الجديدة
      this.cartService.updateCart(this.cart.cartId, this.cart.products).subscribe(
        () => console.log('✅ Cart updated with discounted product prices.'),
        (error) => console.error('❌ Failed to update cart after discount:', error)
      );

      // ✅ حذف الفاوتشر من عند اليوزر
      this.voucherService.deleteVoucher(this.selectedVoucherId, this.userId.toString()).subscribe(
        () => {
          console.log('✅ Voucher deleted successfully.');
          this.vouchers = this.vouchers.filter(v => v.id !== this.selectedVoucherId);
          this.selectedVoucherId = '';
        },
        (error) => console.error('❌ Failed to delete voucher:', error)
      );
    }
  }


  removeProduct(productId: string): void {
    const updatedProducts = this.cart.products.filter(p => p.productId !== productId);

    this.cartService.deleteProductFromCart(this.cart.cartId, updatedProducts).subscribe(
      (response) => {
        console.log('✅ Product removed successfully from API!', response);
        this.cart.products = updatedProducts;
        this.calculateTotalPrice();
      },
      (error) => console.error('❌ Failed to remove product from API:', error)
    );
  }

  saveCart(): void {
    this.cartService.updateCart(this.cart.cartId, this.cart.products).subscribe(
      (response) => console.log('✅ Cart saved successfully!', response),
      (error) => console.error('❌ Failed to save cart:', error)
    );
  }

  checkout(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/checkout'], {
        state: {
          cart: this.cart,
          totalPrice: this.totalPrice
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

}
