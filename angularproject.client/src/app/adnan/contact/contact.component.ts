import { Component } from '@angular/core';
import { AdnanService } from '../service/adnan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  constructor(private _serv: AdnanService) { }

  contact(data: any) {

    if (!data.Content || !data.Name || !data.Email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!'
      });
      return;
    }

    this._serv.contactfeedbck(data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User added successfully.'
      });
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong. Please try again.'
      });
    });
  }
}
