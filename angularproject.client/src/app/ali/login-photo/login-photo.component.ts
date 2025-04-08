import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdnanService } from '../../adnan/service/adnan.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-photo',
  templateUrl: './login-photo.component.html',
  styleUrls: ['./login-photo.component.css']
})
export class LoginPhotoComponent implements OnInit, AfterViewInit {
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  capturedImage: string = '';
  loading: boolean = false;
  showVideo: boolean = true;

  constructor(
    private _ser: AdnanService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initializeCamera();
  }

  initializeCamera(): void {
    this.video = document.getElementById('videoElement') as HTMLVideoElement;
    if (!this.video) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.srcObject = stream;
      this.video.play();
    }).catch((error) => {
      console.error('❌ Failed to access the camera:', error);
    });
  }

  captureImage(): void {
    if (!this.video || !this.video.videoWidth || !this.video.videoHeight) return;

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

  // ✅ الدالة الأساسية لتسجيل الدخول بالوجه
  loginWithFace(): void {
    if (!this.capturedImage) return;

    this.loading = true;
    const file = this.dataURLtoFile(this.capturedImage, 'face.png');

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const detectUrl = proxy + 'https://api-us.faceplusplus.com/facepp/v3/detect';
    const compareUrl = proxy + 'https://api-us.faceplusplus.com/facepp/v3/compare';

    const detectForm = new FormData();
    detectForm.append('api_key', 'xMYfu3JiuCGP5unhDl_ti59hvSlfldXR');
    detectForm.append('api_secret', 'sZXttixl5PZy5lxAZIRwU-jU4c2FNHBA');
    detectForm.append('image_file', file);

    this.http.post<any>(detectUrl, detectForm).subscribe(
      res => {
        const faceToken = res.faces?.[0]?.face_token;
        if (!faceToken) {
          Swal.fire('Error', 'No face detected in image.', 'error');
          this.loading = false;
          return;
        }

        this._ser.getAllUsers().subscribe(users => {
          let foundUser: any = null;

          const checkNext = (index: number) => {
            if (index >= users.length) {
              Swal.fire('Error', 'No matching face found.', 'error');
              this.loading = false;
              return;
            }

            const user = users[index];
            if (!user.Img || !user.Img.startsWith('http')) {
              checkNext(index + 1);
              return;
            }

            const compareForm = new FormData();
            compareForm.append('api_key', 'xMYfu3JiuCGP5unhDl_ti59hvSlfldXR');
            compareForm.append('api_secret', 'sZXttixl5PZy5lxAZIRwU-jU4c2FNHBA');
            compareForm.append('image_url1', user.Img);
            compareForm.append('face_token2', faceToken);

            this.http.post<any>(compareUrl, compareForm).subscribe(
              response => {
                if (response.confidence >= 75) {
                  foundUser = user;

                  const userToLog = {
                    userId: Number(user.id),
                    Name: user.Name,
                    Email: user.Email
                  };

                  // ✅ تخزين الإيميل في الـ BehaviorSubject
                  this._ser.userBehavior.next(user.Email);

                  this._ser.validateUser(userToLog).subscribe(() => {
                    Swal.fire('Success', 'Face verified and logged in successfully!', 'success');
                    this.router.navigate(['/home']);
                    this.loading = false;
                  });
                } else {
                  checkNext(index + 1);
                }
              },
              err => {
                console.warn('Error comparing face:', err);
                checkNext(index + 1);
              }
            );
          };

          checkNext(0);
        });
      },
      err => {
        console.error('Face detection error:', err);
        Swal.fire('Error', 'Face detection failed.', 'error');
        this.loading = false;
      }
    );
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
