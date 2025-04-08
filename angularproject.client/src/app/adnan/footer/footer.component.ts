import { Component } from '@angular/core';
import { AdnanService } from '../service/adnan.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private _url: AdnanService) { }

  container: any;
  ngOnInit() {
    this._url.userObservable.subscribe((data) => {
      this.container = data;
    })
  }

  getData() {

  }
}
