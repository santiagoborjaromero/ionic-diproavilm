import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosEditPage } from './productos-edit.page';

describe('ProductosEditPage', () => {
  let component: ProductosEditPage;
  let fixture: ComponentFixture<ProductosEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
