// pdf-viewer.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import { AlertController, LoadingController } from '@ionic/angular'; // Importar LoadingController

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
    private firebaseService: FirebaseService,
    private loadingController: LoadingController, // Injetar LoadingController
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onSaveAnnotations() {
    const loading = await this.loadingController.create({
      message: 'Atualizando arquivo...',
      spinner: 'crescent' // Ou 'bubbles', 'circles', 'lines', etc.
    });
    await loading.present(); // Mostrar carregamento

    const blobPromise = this.pdfService.getCurrentDocumentAsBlob();
    try {
      const blob = await blobPromise;
      if (blob) {
        this.firebaseService.replaceFileWithAnnotations(this.selectedPdfUrl, blob).subscribe(
          async (selectedPdfUrl) => {
            console.log('Arquivo substituído com sucesso:', selectedPdfUrl);
            await this.showAlert('Sucesso', 'Arquivo atualizado com sucesso!');
            await loading.dismiss(); // Ocultar carregamento
          },
          async (error) => {
            console.error('Erro ao substituir o arquivo:', error);
            await this.showAlert('Erro', 'Erro ao atualizar o arquivo.');
            await loading.dismiss(); // Ocultar carregamento
          }
        );
      } else {
        console.error('Erro ao obter o Blob com as anotações');
        await this.showAlert('Erro', 'Erro ao obter o Blob com as anotações.');
        await loading.dismiss(); // Ocultar carregamento
      }
    } catch (error) {
      console.error('Erro ao obter o Blob com as anotações:', error);
      await this.showAlert('Erro', 'Erro ao obter o Blob com as anotações.');
      await loading.dismiss(); // Ocultar carregamento
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
