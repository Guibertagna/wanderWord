import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEbookPage } from './edit-ebook.page';

describe('EditEbookPage', () => {
  let component: EditEbookPage;
  let fixture: ComponentFixture<EditEbookPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditEbookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
