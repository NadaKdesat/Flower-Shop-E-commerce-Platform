import { Component, OnInit } from '@angular/core';
import { SaService } from '../sa.service';
import { Router } from '@angular/router';
import { ImageUploadServiceService } from '../image-upload-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profileandedit',
  templateUrl: './profileandedit.component.html',
  styleUrls: ['./profileandedit.component.css']
})
export class ProfileandeditComponent implements OnInit {
  user: any;
  editableUser: any = {};
  userId: string = '';
  isLoading: boolean = true;

  selectedFile: File | null = null;
  uploadedImageUrl: string = '';
  loading: boolean = false;
  capturedImage: string = '';
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  showVideo: boolean = true;

  constructor(
    private _ser: SaService,
    private router: Router,
    private imageUploadService: ImageUploadServiceService
  ) { }

  ngOnInit() {
    this.getUserIdFromLoggedApi();
    // تم حذف initializeCamera() من هنا
  }

  // ✅ تشغيل الكاميرا عند فتح المودال فقط
  openCameraModal(): void {
    setTimeout(() => {
      this.video = document.getElementById('videoElement') as HTMLVideoElement;
      if (!this.video) {
        console.error('❌ Video element not found.');
        return;
      }

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
        this.showVideo = true;
      }).catch((error) => {
        console.error('❌ Failed to access the camera:', error);
      });
    }, 500);
  }

  captureImage(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    const context = this.canvas.getContext('2d');

    if (context) {
      context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      this.capturedImage = this.canvas.toDataURL('image/png');
      this.showVideo = false;
    }
  }

  deleteImage(): void {
    this.capturedImage = '';
    this.showVideo = true;
  }

  uploadCapturedImage(): void {
    if (this.capturedImage) {
      const file = this.dataURLtoFile(this.capturedImage, 'capturedImage.png');
      this.uploadImage(file);
    }
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    if (file) {
      this.loading = true;
      this.imageUploadService.uploadImageToImgBB(file).subscribe({
        next: (res: any) => {
          this.uploadedImageUrl = res.data.url;
          this.editableUser.Img = this.uploadedImageUrl;
          this.loading = false;
          Swal.fire('Success', 'Image uploaded to ImgBB successfully!', 'success');
        },
        error: (err: any) => {
          console.error('❌ Error uploading image:', err);
          this.loading = false;
          Swal.fire('Error', 'Failed to upload image. Please try again.', 'error');
        }
      });
    }
  }

  getUserIdFromLoggedApi(): void {
    this._ser.checkLoggedStatus().subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          const loggedUser = response.find((user: any) => user.userId);
          if (loggedUser && loggedUser.userId) {
            this.userId = loggedUser.userId;
            console.log('✅ Found User ID from Logged API:', this.userId);
            this.getUserProfile();
          } else {
            console.error('❌ No userId found. Redirecting to login.');
            this.router.navigate(['/login']);
          }
        } else {
          console.error('❌ No users found in the Logged API. Redirecting to login.');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('❌ Error fetching user from Logged API:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  getUserProfile(): void {
    this._ser.getUserProfile(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.editableUser = { ...this.user };
        console.log('✅ User profile loaded successfully:', this.user);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error fetching user profile:', error);
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    this._ser.postdata(this.userId, this.editableUser).subscribe({
      next: () => {
        this.user = { ...this.editableUser };
        Swal.fire('Success', 'Profile updated successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error updating profile:', error);
      }
    });
  }
}
