import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdnanService } from '../service/adnan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private _ser: AdnanService, private router: Router) { }

  ngOnInit() { }

  postData(data: any, form: any) {
    // Check if form is valid
    if (!form.valid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all the required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check password match
    if (data.Password !== data.ConfirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // If all validations are passed, submit the form
    this._ser.postNewUser(data).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'New user added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add user.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error adding user:', err);
      }
    });
  }
}
