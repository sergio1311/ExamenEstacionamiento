import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRegistroComponent } from './main-registro.component';

describe('MainRegistroComponent', () => {
  let component: MainRegistroComponent;
  let fixture: ComponentFixture<MainRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
