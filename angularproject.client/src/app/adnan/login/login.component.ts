import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdnanService } from '../service/adnan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private _ser: AdnanService, private router: Router) { }

  ngOnInit() { }

  getData(enteredUser: any) {
    this._ser.getAllUsers().subscribe({
      next: (data: any[]) => {
        const user = data.find((p: any) => p.Email === enteredUser.Email && p.Password === enteredUser.password);

        if (user) {
          this._ser.userBehavior.next(user.Email);

          const userToLog = {
            userId: Number(user.id),
            Name: user.Name,
            Email: user.Email
          };

          this._ser.validateUser(userToLog).subscribe({
            next: () => {
              console.log("✅ User successfully added to LOGGED API.");
              this._ser.mergeGuestCartWithUserCart(Number(user.id)).subscribe({
                next: () => {
                  console.log("✅ GuestCart successfully merged with UserCart!");
                  Swal.fire('Success', 'Login successful!', 'success').then(() => {
                    this.router.navigate(['/home']);
                  });
                },
                error: () => console.error('Login successful, but cart merging failed.')
              });
            },
            error: () => console.error('Failed to add user to LOGGED API.')
          });

        } else if (enteredUser.Email === "Admin@gmail.com" && enteredUser.password === "123") {
          this._ser.userBehavior.next("Admin@gmail.com");
          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire('Error', 'Invalid Email or Password', 'error');
        }
      },
      error: () => console.error('Something went wrong during login.')
    });
  }
}
