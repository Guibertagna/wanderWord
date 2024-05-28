import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdfviewer',
  templateUrl: './pdfviewer.page.html',
  styleUrls: ['./pdfviewer.page.scss'],
})
export class PdfviewerPage implements OnInit {
  selectedPdfUrl: string = '';
  documentId: string = ''; // Adicionando a propriedade documentId

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedPdfUrl = params['pdfUrl'];

      if (!this.selectedPdfUrl) {
        console.error('URL do PDF não fornecida nos parâmetros da rota.');
      } else {
        console.log('Carregando PDF a partir da URL:', this.selectedPdfUrl);
      }
     
    });
  }

 
}
