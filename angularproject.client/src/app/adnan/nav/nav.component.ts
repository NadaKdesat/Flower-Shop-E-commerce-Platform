import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdnanService } from '../service/adnan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  container: any;
  isScrolled = false;

  constructor(private _url: AdnanService, private router: Router) { }

  ngOnInit() {
    this._url.userObservable.subscribe((data) => {
      this.container = data;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50; // Change 50 if needed
  }

  logout() {
    this._url.getAllLoggedUsers().subscribe({
      next: (users: any[]) => {
        if (users.length > 0) {
          const deleteRequests = users.map(user =>
            this._url.removeUserFromLogged(user.id).toPromise()
          );
          Promise.all(deleteRequests).then(() => {
            console.log("✅ All users successfully removed from LOGGED API.");
            this.completeLogout('Logout Successful!', 'All logged users have been removed successfully.');
          }).catch((error) => {
            console.error("❌ Error while removing users from LOGGED API:", error);
            this.showError('Error', 'Something went wrong while logging out all users. Please try again later.');
          });
        } else {
          this.completeLogout('No Users Found', 'No users are currently logged in.');
        }
      },
      error: (error) => {
        console.error("❌ Error while fetching users from LOGGED API:", error);
        this.showError('Error', 'Something went wrong while fetching logged users. Please try again later.');
      }
    });
  }

  completeLogout(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#E72463'
    }).then((result) => {
      if (result.value) {
        this._url.userBehavior.next('');
        this.router.navigate(['/login']);
      }
    });
  }

  showError(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#E72463'
    });
  }
}
