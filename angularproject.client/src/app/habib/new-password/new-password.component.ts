import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmailServiceService } from '../emailservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  constructor(private emailService: EmailServiceService, private _routee: ActivatedRoute, private _route: Router) { }
  ngOnInit() {

  }
  updatee(data: any) {
    debugger;
    let id = this._routee.snapshot.paramMap.get('id');
    this.emailService.putdata(data, id).subscribe(() => {
      Swal.fire({
        title: 'Password Updated!',
        text: 'Your password has been updated successfully.',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        backdrop: `
        rgba(0,0,123,0.4)
        url("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif")
        left top
        no-repeat
      `
      }).then(() => {
        this._route.navigate(['/login']);
      });
    });
  }
}
