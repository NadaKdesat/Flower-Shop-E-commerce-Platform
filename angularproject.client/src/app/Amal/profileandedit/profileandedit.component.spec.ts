import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileandeditComponent } from './profileandedit.component';

describe('ProfileandeditComponent', () => {
  let component: ProfileandeditComponent;
  let fixture: ComponentFixture<ProfileandeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileandeditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileandeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
