import { Component } from '@angular/core';
import { IProduct, ProductsService } from '../service/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface CartProduct {
  productId: string;
  quantity: number;
  message: string;
  name: string;
  price: number;
  img: string;
}
export interface IRating {
  userName: string;
  comment: string;
  score: number;
  date: string;
  userImage?: string;  // ✅ هذا السطر هو الحل
}


@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  Products: IProduct[] = [];
  SingleProduct: IProduct = {} as IProduct;
  productId: string = "";
  productUrl: string = '';
  selectedRating: number = 0;
  userName: string = "";
  comment: string = "";
  userImg: string = '';



  constructor(
    private _service: ProductsService,
    private _route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.productId = this._route.snapshot.paramMap.get("id") || "";
    this.fetchProduct(this.productId);
    this.fetchAllProducts();

  }

  shareOnFacebook() {
    const productUrl = 'https://abcdefg.ngrok.io/';
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookShareUrl, '_blank');
  }

  fetchProduct(id: string) {
    this._service.getProductById(id).subscribe(
      (data: IProduct) => {
        // أضف صورة افتراضية إذا ما كانت موجودة
        if (data.Rating && Array.isArray(data.Rating)) {
          data.Rating = data.Rating.map((review: any) => {
            return {
              ...review,
              userImage: review.userImage || '/assets/images/review/default.jpg'
            };
          });
        }

        this.SingleProduct = data;
      },
      (error) => {
        console.error("Error fetching product", error);
      }
    );
  }

  fetchAllProducts() {
    this._service.getAllProducts().subscribe(
      (data: IProduct[]) => {
        this.Products = data
          .sort((a, b) => {
            const avgA = a.Rating.length > 0
              ? a.Rating.reduce((sum, r) => sum + r.score, 0) / a.Rating.length
              : 0;

            const avgB = b.Rating.length > 0
              ? b.Rating.reduce((sum, r) => sum + r.score, 0) / b.Rating.length
              : 0;

            return avgB - avgA;
          })
          .slice(0, 4);
        console.log('Products loaded:', this.Products);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  getStars(product: IProduct) {
    if (!product.Rating || product.Rating.length === 0) {
      return Array(5).fill({ type: 'empty' });
    }

    const totalScore = product.Rating.reduce((sum, rating) => sum + rating.score, 0);
    const averageScore = totalScore / product.Rating.length;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(averageScore)) {
        stars.push({ type: 'full' });
      } else if (i === Math.ceil(averageScore) && averageScore % 1 !== 0) {
        stars.push({ type: 'half' });
      } else {
        stars.push({ type: 'empty' });
      }
    }

    return stars;
  }


  setRating(star: number) {
    this.selectedRating = star;
  }

  submitReview() {
    if (!this.userName.trim() || !this.comment.trim() || this.selectedRating === 0) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    const newReview = {
      userName: this.userName,
      userImage: this.userImg,
      score: this.selectedRating,
      comment: this.comment,
      date: new Date().toISOString()
    };

    this._service.addReview(this.productId, newReview).subscribe(() => {
      Swal.fire({
        title: 'Success!',
        text: 'Review submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.comment = '';
      this.userName = '';
      this.selectedRating = 0;
      this.fetchProduct(this.productId);
    });
  }


  //Add to cart 
  selectedQuantity: number = 1;
  selectedProduct!: IProduct;

  increaseQuantity() {
    this.selectedQuantity++;
  }

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addToCart(product: any) {
    this._service.getLoggedUser().subscribe(users => {
      if (users.length > 0) {
        const userId = users[0].userId;

        this._service.getCartByUserId(userId).subscribe(
          carts => {
            let userCart = carts.length > 0 ? carts[0] : null;

            if (!userCart) {
              console.log("No cart found for user. Creating a new cart...");

              userCart = {
                cartId: '',
                userId,
                products: []
              };

              this._service.createCart(userCart).subscribe(response => {
                console.log("New cart created:", response);
                this.addProductToCart(response, product);
              }, err => {
                console.error("Error creating cart:", err);
              });
            } else {
              console.log("Existing cart found:", userCart);
              this.addProductToCart(userCart, product);
            }
          },
          err => {
            console.error("Error fetching cart by user ID:", err);
            this._service.createCart({
              cartId: '',
              userId,
              products: []
            }).subscribe(response => {
              console.log("New cart created after error:", response);
              this.addProductToCart(response, product);
            }, err => {
              console.error("Error creating cart:", err);
            });
          }
        );
      } else {
        this._service.getGuestCart().subscribe(guestCart => {
          const productData = {
            productId: product.id,
            quantity: this.selectedQuantity, // Use the selected quantity here
            message: '',
            name: product.Name,
            price: parseFloat((product.Price - (product.Price * product.Discount / 100)).toFixed(2)),
            img: product.Img
          };

          this._service.addOrUpdateGuestCart(productData).subscribe(
            (res) => {
              this.router.navigate(['/carts']);
            },
            (err) => {
              console.error("Error fetching guest cart:", err);
            }
          );
        });
      }
    });
  }

  addProductToCart(cart: any, product: any) {
    const existingProduct = cart.products.find((p: any) => p.productId === product.id);

    if (existingProduct) {
      existingProduct.quantity += this.selectedQuantity;  // Add selected quantity to the existing product
    } else {
      cart.products.push({
        productId: product.id,
        quantity: this.selectedQuantity,  // Use the selected quantity here
        message: '',
        name: product.Name,
        price: parseFloat((product.Price - (product.Price * product.Discount / 100)).toFixed(2)),
        img: product.Img
      });
    }

    if (cart.cartId) {
      this._service.updateCart(cart.cartId, cart).subscribe(response => {
        console.log("Cart updated successfully:", response);
        this.router.navigate(['/carts']);
      }, err => {
        console.error("Error updating cart:", err);
      });
    }
  }







}
