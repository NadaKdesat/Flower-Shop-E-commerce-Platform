import { Component } from '@angular/core';
import { AdminService } from '../../Admin Services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-showallproducts',
  templateUrl: './showallproducts.component.html',
  styleUrls: ['./showallproducts.component.css']
})
export class ShowallproductsComponent {
  ProductContainer: any[] = [];
  CategoryContainer: any[] = [];

  newProduct = {
    Name: '',
    Description: '',
    Categoryid: '',
    Color: '',
    Price: 0,
    Img: '',
    Available: true,
    Tag: [] as string[],
    TagString: ''
  };

  editProduct: any = null;

  constructor(private _admin: AdminService) { }

  ngOnInit() {
    this.fetchCategoriesAndProducts();
  }

  fetchCategoriesAndProducts(): void {
    this._admin.ShowAllCategory().subscribe((categories: any) => {
      this.CategoryContainer = categories;

      this._admin.ShowAllProduct().subscribe((products: any) => {
        this.ProductContainer = products.map((product: any) => {
          const matchedCategory = this.CategoryContainer.find(
            (cat: any) => cat.id === product.Categoryid
          );
          return {
            ...product,
            CategoryName: matchedCategory ? matchedCategory.Name : 'Unknown'
          };
        });
      });
    });
  }

  openAddModal(): void {
    const modal = document.getElementById('addProductModal');

    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'product-backdrop';
      document.body.appendChild(backdrop);

      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  openEditModal(product: any): void {
    product.TagString = product.Tag?.join(', ') || '';
    this.editProduct = { ...product };

    const modal = document.getElementById('editProductModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');

      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'product-backdrop';
      document.body.appendChild(backdrop);

      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    ['addProductModal', 'editProductModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    const backdrop = document.getElementById('product-backdrop');
    if (backdrop) backdrop.remove();

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  createProduct(): void {
    this.newProduct.Tag = this.newProduct.TagString
      ? this.newProduct.TagString.split(',').map((tag: string) => tag.trim())
      : [];

    this._admin.AddProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = {
          Name: '',
          Description: '',
          Categoryid: '',
          Color: '',
          Price: 0,
          Img: '',
          Available: true,
          Tag: [],
          TagString: ''
        };
        this.fetchCategoriesAndProducts();
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'Product has been added.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while adding!'
        });
      }
    });
  }

  saveEditProduct(): void {
    this.editProduct.Tag = this.editProduct.TagString
      ? this.editProduct.TagString.split(',').map((tag: string) => tag.trim())
      : [];

    this._admin.UpdateProduct(this.editProduct.id, this.editProduct).subscribe({
      next: () => {
        this.editProduct = null;
        this.fetchCategoriesAndProducts();
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Product has been updated.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while updating!'
        });
      }
    });
  }

  DeleteProduct(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._admin.DeleteProduct(id).subscribe({
          next: () => {
            this.fetchCategoriesAndProducts();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The product has been deleted.',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong while deleting!'
            });
          }
        });
      }
    });
  }
}
