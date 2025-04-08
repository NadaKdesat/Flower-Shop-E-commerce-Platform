import { Component } from '@angular/core';
import { AdminService } from '../../Admin Services/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-show-all-category',
  templateUrl: './show-all-category.component.html',
  styleUrl: './show-all-category.component.css'
})
export class ShowAllCategoryComponent {

  newCategory = {
    Name: '',
    Description: '',
    Img: ''
  };
  editCategory: any = null;


  constructor(private _admin: AdminService) { }

  ngOnInit() {
    this.ShowAllCategories()
  }

  CategoryContainer: any;
  ShowAllCategories() {
    this._admin.ShowAllCategory().subscribe((data) => {
      this.CategoryContainer = data;


    });
  }



  DeleteCategory(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the category and all its products.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._admin.ShowAllProduct().subscribe((res: any) => {
          const relatedProducts = res.filter((p: any) => p.Categoryid == id);

          let index = 0;

          const deleteNext = () => {
            if (index < relatedProducts.length) {
              const productId = relatedProducts[index].id;

              this._admin.DeleteProduct(productId).subscribe({
                next: () => {
                  index++;
                  deleteNext(); // move to the next product
                },
                error: () => {
                  Swal.fire('Error', 'Failed to delete a product.', 'error');
                }
              });
            } else {
              // All products deleted, now delete the category
              this._admin.DeleteCategory(id).subscribe(() => {
                this.ShowAllCategories();
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'The category and its products have been deleted.',
                  timer: 1500,
                  showConfirmButton: false
                });
              });
            }
          };

          if (relatedProducts.length > 0) {
            deleteNext(); // Start the loop
          } else {
            // No products to delete, delete category directly
            this._admin.DeleteCategory(id).subscribe(() => {
              this.ShowAllCategories();
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The category has been deleted.',
                timer: 1500,
                showConfirmButton: false
              });
            });
          }
        });
      }
    });
  }


  openCreateModal(): void {
    const modal = document.getElementById('createCategoryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'custom-backdrop';
      document.body.appendChild(backdrop);
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }
  closeModal(): void {
    ['createCategoryModal', 'editCategoryModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('role');
      }
    });

    ['custom-backdrop', 'custom-backdrop-edit'].forEach(id => {
      const backdrop = document.getElementById(id);
      if (backdrop) backdrop.remove();
    });

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }


  createCategory(): void {
    if (this.newCategory.Name && this.newCategory.Description) {
      this._admin.AddCategory(this.newCategory).subscribe({
        next: () => {
          this.ShowAllCategories();
          this.newCategory = { Name: '', Description: '', Img: '' };
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'New category has been added.',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while creating the category!'
          });
        }
      });
    }
  }
  openEditModal(category: any): void {
    this.editCategory = { ...category };

    const modal = document.getElementById('editCategoryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'custom-backdrop-edit';
      document.body.appendChild(backdrop);
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  saveEditCategory(): void {
    if (this.editCategory && this.editCategory.Name && this.editCategory.Description) {
      this._admin.updateCategory(this.editCategory.id, this.editCategory).subscribe({
        next: () => {
          this.ShowAllCategories();
          this.editCategory = null;
          this.closeModal();

          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Category has been updated.',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while updating the category!'
          });
        }
      });
    }
  }

}
