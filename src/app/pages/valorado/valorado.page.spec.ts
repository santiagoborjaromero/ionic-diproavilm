import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValoradoPage } from './valorado.page';

describe('ValoradoPage', () => {
  let component: ValoradoPage;
  let fixture: ComponentFixture<ValoradoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
