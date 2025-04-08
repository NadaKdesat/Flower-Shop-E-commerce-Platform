import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewPasswordComponent } from '../new-password/new-password.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent {
  enteredCode: string = '';
  resetCode: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }
  id: string = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {// query params is the way to get the code from the email link 
      this.resetCode = params['code'];
      this.id = params['id'];
    });
  }
  verifyCode() {
    if (this.enteredCode === this.resetCode) {
      this.router.navigate([`/newpassword/${ this.id }`]);
      Swal.fire({
        title: 'Transformation Successful!',
        text: 'The transformation has been completed successfully.',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Great!',
        timer: 2000,
        timerProgressBar: true,
        backdrop: `
    rgba(0,0,123,0.4)
    url("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif")
    left top
    no-repeat
  `
      });    } else {
      alert('الكود غير صحيح!');
    }
  }
}
