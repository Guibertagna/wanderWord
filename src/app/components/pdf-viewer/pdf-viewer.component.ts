import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
  @Input() pdfUrl: string = '';
  safeSrc: SafeResourceUrl = ''; // Defina a propriedade safeSrc

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.updateSafeSrc();
  }

  private updateSafeSrc() {
    console.log(this.pdfUrl)
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }
}
