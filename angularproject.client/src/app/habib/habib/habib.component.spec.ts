import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabibComponent } from './habib.component';

describe('HabibComponent', () => {
  let component: HabibComponent;
  let fixture: ComponentFixture<HabibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
