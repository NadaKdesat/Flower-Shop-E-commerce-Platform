import { Component } from '@angular/core';
import { AdminService } from '../../Admin Services/admin.service';
import Swal from 'sweetalert2';
import { Snapshot } from 'jest-editor-support';
import { ActivatedRoute, Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {

  constructor(private _admin: AdminService, private _active: ActivatedRoute, private _router: Router) { }

  @Input() category: any;
  @Output() close = new EventEmitter<void>();

  

  CategoryID: any;
  CategoryContainer: any;
  ngOnInit() {
    this.CategoryID = this._active.snapshot.paramMap.get('id');
    this._admin.GetCategoryByID(this.CategoryID).subscribe((data) => {
      this.CategoryContainer = data;
    })

  }

  EditCategory(EditedCategory: any) {
    this._admin.editCategory(this.CategoryID, EditedCategory).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Category Edited Successfully!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this._router.navigate(['/AllCategories']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to edit category.',
        });
      }
    });
    this.closeModal();
  }
  closeModal() {
    this.close.emit();
  }

}
