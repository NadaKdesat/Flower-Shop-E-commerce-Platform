import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css']
})
export class AdminChatComponent implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  selectedFile!: File;
  users: any[] = [];

  userAvatar = 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png';
  currentUserId = '63';

  // بيانات الطلب الخاص
  customProductName: string = '';
  customProductPrice: number = 0;
  customProductQuantity: number = 1;
  showCustomForm: boolean = false;
  customProductFile!: File;

  constructor(private chatService: ChatService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadMessages();
    this.loadUsers();
  }

  loadMessages(): void {
    this.chatService.getMessages().subscribe(data => {
      this.messages = data.filter(m => m.userId == this.currentUserId);
    });
  }

  loadUsers(): void {
    this.http.get<any[]>('https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration').subscribe(data => {
      this.users = data;
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id == userId);
    return user ? user.Name || user.Email : 'User';
  }

  getUserImage(userId: string): string {
    const user = this.users.find(u => u.id == userId);
    return user?.Img || this.userAvatar;
  }

  sendMessage(): void {
    if (!this.newMessage && !this.selectedFile) return;

    const messageData = {
      sender: 'admin',
      message: this.newMessage,
      image: '',
      timestamp: new Date().toISOString(),
      userId: this.currentUserId
    };

    if (this.selectedFile) {
      this.chatService.sendMessageWithImage(messageData, this.selectedFile).subscribe(() => {
        this.loadMessages();
      });
    } else {
      this.chatService.sendTextMessage(messageData).subscribe(() => {
        this.loadMessages();
      });
    }

    this.newMessage = '';
    this.selectedFile = null as any;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // ✅ إدخال صورة من الجهاز لمنتج مخصص
  onCustomProductImageSelected(event: any): void {
    this.customProductFile = event.target.files[0];
  }

  addCustomProductToCart(): void {
    if (!this.customProductName || !this.customProductPrice || !this.customProductFile) {
      Swal.fire('Oops!', 'Please fill all fields including image!', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.customProductFile);

    // ✅ رفع الصورة إلى ImgBB مثل الشات تماماً
    this.http.post<any>('https://api.imgbb.com/1/upload?key=8c8ce81a714d22cb8e6e71c2dd4dd49d', formData).subscribe({
      next: (res) => {
        const imageUrl = res.data.url;

        const product = {
          productId: Math.floor(Math.random() * 100000).toString(),
          name: this.customProductName,
          price: this.customProductPrice,
          img: imageUrl, // ✅ استخدام الصورة المرفوعة
          quantity: this.customProductQuantity,
          message: ''
        };

        this.http.get<any[]>('https://67d6b64c286fdac89bc2c055.mockapi.io/carts').subscribe((carts) => {
          const userCart = carts.find(c => c.userId == this.currentUserId);

          if (userCart) {
            userCart.products.push(product);
            this.http.put(`https://67d6b64c286fdac89bc2c055.mockapi.io/carts/${userCart.cartId}`, userCart).subscribe(() => {
              Swal.fire('✅ Added', 'Custom product added to user\'s cart!', 'success');
              this.showCustomForm = false;
            });
          } else {
            const newCart = {
              userId: this.currentUserId,
              cartId: Math.floor(Math.random() * 100000).toString(),
              products: [product]
            };
            this.http.post('https://67d6b64c286fdac89bc2c055.mockapi.io/carts', newCart).subscribe(() => {
              Swal.fire('✅ Created', 'New cart created and product added!', 'success');
              this.showCustomForm = false;
            });
          }
        });
      },
      error: () => {
        Swal.fire('❌ Error', 'Failed to upload image.', 'error');
      }
    });
  }

  openAddToCart(msg: any): void {
    this.customProductName = msg.message || '';
    this.customProductPrice = 0;
    this.customProductQuantity = 1;
    this.customProductFile = null as any;
    this.showCustomForm = true;
  }
}
