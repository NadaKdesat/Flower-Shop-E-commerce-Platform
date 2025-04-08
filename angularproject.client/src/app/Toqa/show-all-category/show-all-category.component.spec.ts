import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllCategoryComponent } from './show-all-category.component';

describe('ShowAllCategoryComponent', () => {
  let component: ShowAllCategoryComponent;
  let fixture: ComponentFixture<ShowAllCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowAllCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAllCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
