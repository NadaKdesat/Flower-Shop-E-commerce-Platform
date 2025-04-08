import { Component } from '@angular/core';
import { AdminService } from '../../Admin Services/admin.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  constructor(private _admin: AdminService) { }

  ngOnInit() { }

  AddProduct(Product: any) {
    this._admin.AddProduct(Product).subscribe();
  }
}
