import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdfviewer',
  templateUrl: './pdfviewer.page.html',
  styleUrls: ['./pdfviewer.page.scss'],
})
export class PdfviewerPage implements OnInit {
  selectedPdfUrl: string = ''; // Adicionando a propriedade selectedPdfUrl

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['pdfUrl']) {
        this.selectedPdfUrl = params['pdfUrl']; // Obtém a URL do PDF dos parâmetros de consulta da URL
      }
    });
  }
}
