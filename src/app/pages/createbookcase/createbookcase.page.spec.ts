import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatebookcasePage } from './createbookcase.page';

describe('CreatebookcasePage', () => {
  let component: CreatebookcasePage;
  let fixture: ComponentFixture<CreatebookcasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatebookcasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
