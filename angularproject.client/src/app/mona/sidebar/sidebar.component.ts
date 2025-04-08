import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../Admin Services/admin.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(
    private router: Router,
    private _url: AdminService // or AuthService or whatever you named it
  ) { }

  logout() {
    this._url.userBehavior.next(''); // reset user observable or session

    Swal.fire({
      title: 'Logged Out',
      text: 'You have successfully logged out.',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }



}
