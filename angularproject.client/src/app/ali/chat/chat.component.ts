import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  selectedFile!: File;
  userId!: number;
  userAvatar: string = '';
  defaultAdminAvatar: string = 'https://cdn-icons-png.flaticon.com/512/147/147144.png';

  constructor(private chatService: ChatService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getLoggedUserId();
  }

  getLoggedUserId(): void {
    this.http.get<any[]>('https://67e3fe882ae442db76d27d2c.mockapi.io/logged').subscribe(
      res => {
        if (res.length > 0 && res[0].userId) {
          this.userId = Number(res[0].userId);
          this.getUserAvatar(this.userId);
          this.loadUserMessages();
        }
      },
      err => {
        console.error('❌ Failed to get logged user ID', err);
      }
    );
  }

  getUserAvatar(userId: number): void {
    this.http.get<any[]>('https://your-registration-api-url').subscribe(
      users => {
        const user = users.find(u => Number(u.userId) === userId);
        if (user && user.imageUrl) {
          this.userAvatar = user.imageUrl;
        } else {
          this.userAvatar = this.defaultAdminAvatar;
        }
      },
      err => {
        console.error('❌ Failed to get user avatar', err);
        this.userAvatar = this.defaultAdminAvatar;
      }
    );
  }

  loadUserMessages(): void {
    this.chatService.getMessages().subscribe((data) => {
      // عرض كل رسائل المستخدم الحالي ورسائل الأدمن بدون استثناء
      this.messages = data.filter(msg => msg.userId === this.userId || msg.sender === 'admin');
    });
  }

  sendMessage(): void {
    if (!this.newMessage && !this.selectedFile) return;

    const messageData: any = {
      sender: 'user',
      message: this.newMessage,
      image: '',
      timestamp: new Date().toISOString(),
      userId: this.userId
    };

    if (this.selectedFile) {
      this.chatService.sendMessageWithImage(messageData, this.selectedFile).subscribe(() => {
        this.loadUserMessages();
      });
    } else {
      this.chatService.sendTextMessage(messageData).subscribe(() => {
        this.loadUserMessages();
      });
    }

    this.newMessage = '';
    this.selectedFile = null as any;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
}
