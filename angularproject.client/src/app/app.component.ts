import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdnanService } from './adnan/service/adnan.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // لاحظ: كانت styleUrl والصح style**s**Urls
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];
  isAdmin: boolean = false; // ✅ تعريف المتغير

  constructor(private http: HttpClient, public adnanService: AdnanService) { }

  ngOnInit() {
    this.getForecasts();

    // ✅ متابعة قيمة المستخدم إذا كان أدمن
    this.adnanService.userObservable.subscribe(userType => {
      this.isAdmin = (userType === 'Admin@gmail.com');
    });

  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'angularproject.client';
}
