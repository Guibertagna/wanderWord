// pdf-viewer.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
  @Input() selectedPdfUrl: string = '';
  @Input() documentId: string = '';
  @Input() filePath: string = '';

  constructor(
    private pdfService: NgxExtendedPdfViewerService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {}

  async onSaveAnnotations() { // tornando a função async para usar 'await'
    console.log("aaaaa")
    const blobPromise = this.pdfService.getCurrentDocumentAsBlob(); // Obtendo a promessa do Blob
    try {
      const blob = await blobPromise; // Aguardando a resolução da promessa
      if (blob) {
        this.firebaseService.replaceFileWithAnnotations(this.selectedPdfUrl, blob).subscribe(
          (selectedPdfUrl) => {
            console.log('Arquivo substituído com sucesso:', selectedPdfUrl);
            // Aqui você pode lidar com o sucesso, como mostrar uma mensagem para o usuário
          },
          (error) => {
            console.error('Erro ao substituir o arquivo:', error);
            // Aqui você pode lidar com o erro, como mostrar uma mensagem de erro para o usuário
          }
        );
      } else {
        console.error('Erro ao obter o Blob com as anotações');
        // Aqui você pode lidar com o erro, como mostrar uma mensagem de erro para o usuário
      }
    } catch (error) {
      console.error('Erro ao obter o Blob com as anotações:', error);
      // Aqui você pode lidar com o erro, como mostrar uma mensagem de erro para o usuário
    }
  }
}
