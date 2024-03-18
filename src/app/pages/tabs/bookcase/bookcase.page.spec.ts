import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookcasePage } from './bookcase.page';

describe('BookcasePage', () => {
  let component: BookcasePage;
  let fixture: ComponentFixture<BookcasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookcasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
