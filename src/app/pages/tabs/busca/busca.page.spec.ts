import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscaPage } from './busca.page';

describe('BuscaPage', () => {
  let component: BuscaPage;
  let fixture: ComponentFixture<BuscaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuscaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
