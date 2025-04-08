import { Component } from '@angular/core';
import { AdminService } from '../../Admin Services/admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  constructor(private _admin: AdminService, private _router: Router) { }

  ngOnInit() { }

  @Output() close = new EventEmitter<void>();
  @Output() categoryAdded = new EventEmitter<boolean>();

  AddCategory(category: any) {
    this._admin.AddCategory(category).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Category Added Successfully!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.categoryAdded.emit(true); // 👈 trigger parent to reload
          this.closeModal();
        });
      }
    });
  }




  closeModal() {
    this.close.emit();
  }

}
