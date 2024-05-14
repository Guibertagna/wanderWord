import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfviewerPage } from './pdfviewer.page';

describe('PdfviewerPage', () => {
  let component: PdfviewerPage;
  let fixture: ComponentFixture<PdfviewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PdfviewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
