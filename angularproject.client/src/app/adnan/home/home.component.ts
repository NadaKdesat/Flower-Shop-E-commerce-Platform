import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories: any[] = [];

  constructor(
    private renderer: Renderer2,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadScript('assets/js/main.js');
    this.loadScript('assets/js/plugins/swiper-bundle.min.js');
    this.loadScript('assets/js/plugins/jquery-ui.min.js');

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error("❌ Failed to load categories:", err);
      }
    });
  }

  loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }
}
