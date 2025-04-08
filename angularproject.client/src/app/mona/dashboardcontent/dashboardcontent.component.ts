import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  DoughnutController,
  ArcElement
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, DoughnutController, ArcElement);


@Component({
  selector: 'app-dashboardcontent',
  templateUrl: './dashboardcontent.component.html',
  styleUrl: './dashboardcontent.component.css'
})
export class DashboardcontentComponent implements OnInit {
  topCategories: { Name: string; totalProducts: number }[] = [];
  feedbacks: any[] = [];


  dashboardStats = [
    { label: 'Users', count: 0, trend: 'up' },
    { label: 'Orders', count: 0, trend: 'down' },
    { label: 'Vouchers', count: 0, trend: 'up' },
    { label: 'Feedbacks', count: 0, trend: 'up' },
    { label: 'Categories', count: 0, trend: 'up' },
    { label: 'Products', count: 0, trend: 'down' }
  ];

  recentProducts: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadTopCategories();
    this.loadFeedbacks();
    this.loadRecentProducts();
    this.renderOrdersChart();
    //this.renderProfitChart();
  }

  loadStats(): void {
    const apis = [
      { label: 'Users', url: 'https://67d5f9cd286fdac89bc0e100.mockapi.io/Registration' },
      { label: 'Orders', url: 'https://67d293bd90e0670699be2936.mockapi.io/Order' },
      { label: 'Vouchers', url: 'https://67e2bc4a97fc65f535375ff8.mockapi.io/Voucher' },
      { label: 'Feedbacks', url: 'https://67e2c65297fc65f53537891e.mockapi.io/Feedback' },
      { label: 'Categories', url: 'https://67d5f9cd286fdac89bc0e100.mockapi.io/Categories' },
      { label: 'Products', url: 'https://67e2bc4a97fc65f535375ff8.mockapi.io/product' }
    ];

    apis.forEach(api => {
      this.http.get<any[]>(api.url).subscribe(data => {
        const stat = this.dashboardStats.find(s => s.label === api.label);
        if (stat) stat.count = data.length;
      });
    });
  }

  loadRecentProducts(): void {
    this.http.get<any[]>('https://67e2bc4a97fc65f535375ff8.mockapi.io/product')
      .subscribe(data => {
        this.recentProducts = data.slice(-5).reverse(); // latest 5
      });
  }

  renderOrdersChart(): void {
    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Orders',
          data: [12, 19, 14, 25, 23, 30, 28],
          backgroundColor: 'rgba(231, 36, 99, 0.2)',
          borderColor: '#E72463',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#E72463'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  loadTopCategories(): void {
    this.http.get<any[]>('https://67d5f9cd286fdac89bc0e100.mockapi.io/Categories')
      .subscribe(categories => {
        this.http.get<any[]>('https://67e2bc4a97fc65f535375ff8.mockapi.io/product')
          .subscribe(products => {
            const categoryCountMap: Record<string, number> = {};

            products.forEach(p => {
              categoryCountMap[p.Categoryid] = (categoryCountMap[p.Categoryid] || 0) + 1;
            });

            this.topCategories = categories.map(cat => ({
              Name: cat.Name,
              totalProducts: categoryCountMap[cat.id] || 0
            })).sort((a, b) => b.totalProducts - a.totalProducts).slice(0, 5);
          });
      });
  }

  loadFeedbacks(): void {
    this.http.get<any[]>('https://67e2c65297fc65f53537891e.mockapi.io/Feedback')
      .subscribe(data => {
        this.feedbacks = data.slice(-3).reverse(); // latest 3
      });
  }




}
