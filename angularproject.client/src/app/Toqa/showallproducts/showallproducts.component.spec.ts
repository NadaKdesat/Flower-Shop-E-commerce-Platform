import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowallproductsComponent } from './showallproducts.component';

describe('ShowallproductsComponent', () => {
  let component: ShowallproductsComponent;
  let fixture: ComponentFixture<ShowallproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowallproductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowallproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
