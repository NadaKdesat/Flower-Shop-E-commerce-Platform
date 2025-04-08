declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { ActivatedRoute } from '@angular/router';

import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ICart, ICategory, IProduct, ProductsService } from '../service/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  viewMode: string = 'grid';
  Products: IProduct[] = [];
  AllProducts: IProduct[] = [];
  Categories: ICategory[] = [];
  selectedCategory: string = 'all';
  searchText: string = '';
  filteredProducts: IProduct[] = [];
  minPrice: number = 0;
  maxPrice: number = 100;
  maxLimit: number = 100;
  selectedColors: { [key: string]: boolean } = {};
  tags: string[] = [];
  selectedTag: string = '';

  @ViewChild('sliderMinHandle', { static: false }) sliderMinHandle!: ElementRef;
  @ViewChild('sliderMaxHandle', { static: false }) sliderMaxHandle!: ElementRef;

  constructor(private _service: ProductsService, private renderer: Renderer2, private router: Router, private route: ActivatedRoute) { }
  categoryIdFromUrl: string | null = null;

  ngOnInit() {
    this.fetchAllCategories();
    this.setupVoiceSearch();
    this.sortProducts("Sort by newness");
    this.getUniqueTags();

    this.route.queryParamMap.subscribe(params => {
      const categoryId = params.get('category');

      if (categoryId) {
        this.selectedCategory = categoryId;
        this._service.getAllProducts().subscribe((data: IProduct[]) => {
          this.Products = data;
          this.AllProducts = data;
          this.filterProducts(); // 🔥 فلترة حسب الكاتيجوري
          this.sortProducts("Sort by newness");
        });
      } else {
        this.fetchAllProducts(); // ✅ يرجع كل المنتجات
      }
    });
  }
  toggleView(mode: string) {
    this.viewMode = mode;
  }

  fetchAllProducts() {
    this.selectedCategory = 'all';
    this._service.getAllProducts().subscribe(
      (data: IProduct[]) => {
        this.Products = data;
        this.AllProducts = data;
        this.filteredProducts = this.Products;
        this.sortProducts("Sort by newness");
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }


  fetchAllCategories() {
    this._service.getAllCategories().subscribe(
      (data: ICategory[]) => {
        this.Categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  fetchProductsByCategoryId(CategoryId: string) {
    this.selectedCategory = CategoryId;
    this.filterProducts();
  }

  searchProducts() {
    const lowercasedSearchText = this.searchText.trim().toLowerCase();
    this.filteredProducts = this.Products.filter((product) =>
      product.Name.toLowerCase().includes(lowercasedSearchText)
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



  setupVoiceSearch(): void {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const voiceSearchBtn = document.getElementById('voiceSearchBtn') as HTMLButtonElement;
    const searchForm = document.getElementById('searchForm') as HTMLFormElement;

    voiceSearchBtn.onclick = () => recognition.start();

    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript.trim().replace(/.$/, "");
      searchInput.value = transcript;
      this.searchText = transcript;
      this.searchProducts();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
    };

    recognition.onend = () => {
      recognition.stop();
    };

    searchInput.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.searchProducts();
      }
    });
  }

  ngAfterViewInit() {
    this.setupSlider();

    this.renderer.setStyle(this.sliderMinHandle.nativeElement, 'left', '0%');
    this.renderer.setStyle(this.sliderMaxHandle.nativeElement, 'left', '100%');
  }

  setupSlider() {
    this.addDragEvent(this.sliderMinHandle, true);
    this.addDragEvent(this.sliderMaxHandle, false);
  }

  addDragEvent(handle: ElementRef, isMin: boolean) {
    this.renderer.listen(handle.nativeElement, 'mousedown', (event) => {
      event.preventDefault();
      this.dragHandle(event, isMin, handle.nativeElement);
    });
  }

  dragHandle(event: MouseEvent, isMin: boolean, handleElement: HTMLElement) {
    const slider = document.getElementById('slider-range');
    if (!slider) return;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const rect = slider.getBoundingClientRect();
      let newLeft = ((moveEvent.clientX - rect.left) / rect.width) * 100;

      newLeft = Math.max(0, Math.min(newLeft, 100));

      if (isMin) {
        this.minPrice = Math.min(Math.round((newLeft / 100) * this.maxLimit), this.maxPrice - 1);
        this.renderer.setStyle(handleElement, 'left', `${(this.minPrice / this.maxLimit) * 100}%`);
      } else {
        this.maxPrice = Math.max(Math.round((newLeft / 100) * this.maxLimit), this.minPrice + 1);
        this.renderer.setStyle(handleElement, 'left', `${(this.maxPrice / this.maxLimit) * 100}%`);
      }

      this.updateRangeBar();
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  updateRangeBar() {
    const slider = document.getElementById('slider-range');
    const rangeBar = slider?.querySelector('.ui-slider-range') as HTMLElement;
    if (!slider || !rangeBar) return;

    const minLeft = (this.minPrice / this.maxLimit) * 100;
    const maxLeft = (this.maxPrice / this.maxLimit) * 100;

    this.renderer.setStyle(rangeBar, 'left', `${minLeft}%`);
    this.renderer.setStyle(rangeBar, 'width', `${maxLeft - minLeft}%`);
  }

  filterProductsByPrice() {
    this.filterProducts();
  }

  uniqueColors(): string[] {
    const colors = this.AllProducts.map(product => product.Color);
    return [...new Set(colors)];
  }

  filterByColor() {
    this.filterProducts();
  }

  filterProducts() {
    let filtered = this.AllProducts;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.Categoryid === this.selectedCategory);
    }

    filtered = filtered.filter(product => {
      const discountedPrice = product.Price - (product.Price * product.Discount / 100);
      return discountedPrice >= this.minPrice && discountedPrice <= this.maxPrice;
    });

    const selectedColorKeys = Object.keys(this.selectedColors).filter(color => this.selectedColors[color]);
    if (selectedColorKeys.length > 0) {
      filtered = filtered.filter(product => selectedColorKeys.includes(product.Color));
    }

    if (this.selectedTag) {
      filtered = filtered.filter(product => product.Tag && product.Tag.includes(this.selectedTag));
    }

    this.filteredProducts = filtered;
    console.log("Filtered products:", this.filteredProducts);
  }



  sortProducts(criteria: string) {
    if (!this.filteredProducts || this.filteredProducts.length === 0) {
      return;
    }

    switch (criteria) {
      case "Alphabetically, A-Z":
        this.filteredProducts.sort((a, b) => a.Name.localeCompare(b.Name));
        break;

      case "Sort by newness":
        this.filteredProducts.sort((a, b) => Number(b.id) - Number(a.id));
        break;

      case "Sort by rating: high to low":
        this.filteredProducts.sort((a, b) => {
          const avgA = a.Rating.length > 0 ? a.Rating.reduce((sum, r) => sum + r.score, 0) / a.Rating.length : 0;
          const avgB = b.Rating.length > 0 ? b.Rating.reduce((sum, r) => sum + r.score, 0) / b.Rating.length : 0;
          return avgB - avgA;
        });
        break;

      case "Sort by price: low to high":
        this.filteredProducts.sort((a, b) =>
          (a.Price - (a.Price * a.Discount / 100)) - (b.Price - (b.Price * b.Discount / 100))
        );
        break;

      case "Sort by price: high to low":
        this.filteredProducts.sort((a, b) =>
          (b.Price - (b.Price * b.Discount / 100)) - (a.Price - (a.Price * a.Discount / 100))
        );
        break;

      default:
        break;
    }
  }

  isOpen = false;
  selectedOption = 'Sort by newness';
  options = [
    'Sort by newness',
    'Sort by rating: high to low',
    'Alphabetically, A-Z',
    'Sort by price: low to high',
    'Sort by price: high to low',
  ];

  selectOption(option: string) {
    this.selectedOption = option;
    this.isOpen = false;
    this.sortProducts(option);
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
            quantity: 1,
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
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        productId: product.id,
        quantity: 1,
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


  getUniqueTags() {

    this._service.getUniqueTags().subscribe(
      (tags: string[]) => {
        this.tags = tags;
      },
      (error) => {
        console.error("Error fetching tags:", error);
      }
    );
  }

  filterByTag(selectedTag: string) {
    this.selectedTag = selectedTag;
    this.filterProducts();
  }
}
