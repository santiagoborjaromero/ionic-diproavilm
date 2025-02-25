import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovsEditPage } from './movs-edit.page';

describe('MovsEditPage', () => {
  let component: MovsEditPage;
  let fixture: ComponentFixture<MovsEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MovsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
