import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../emailservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  message: string = '';
  id: any = localStorage.getItem("idd");

  constructor(private emailService: EmailServiceService, private router: Router) { }
  dataa: any;
  sendResetCode() {
    //localStorage.setItem('id', "1");//بعث ايدي افتراضي للتجربه
    if (this.email) {
      this.emailService.getdata().subscribe((data) => {
        const user = data.find((s: any) => s.Email === this.email);
        if (user) {
          this.dataa = user;
          localStorage.setItem("idd",user.id)
        } else {
          console.log('User not found');
        }
      });
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); //بعمل انشاء لرقم عشوائي
      localStorage.setItem('resetCode', resetCode);
      this.emailService.sendEmail(this.email, resetCode, this.id)
        .then(() => {
          this.message = 'success sending email';
          setTimeout(() => {
            this.router.navigate(['/verify-code']);
          }, 1500);
        })
        .catch((error) => {
          console.error('Error:', error);
          this.message = 'error with sending email';
        });
    } else {
      this.message = 'Enter validation Email';
    }
  }
}
