import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pdf!: File; // Adicionando o operador ! para indicar que a propriedade será inicializada

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  // Método para lidar com o upload do arquivo PDF
  handleUpload(event: any) {
    const file = event.target.files[0]; // Obtém o arquivo PDF do evento de upload
    if (file) {
      this.pdf = file; // Armazena o arquivo PDF na propriedade pdf
    }
  }

  // Método para chamar a função de upload do serviço FirebaseService
  uploadPDF() {
    if (this.pdf) {
      this.firebaseService.uploadAndSaveEbook(this.pdf, {})
        .subscribe(
          (url) => {
            if (url) {
              console.log('URL do arquivo PDF:', url);
              // Faça algo com a URL do arquivo PDF, se necessário
            } else {
              console.error('Erro ao fazer upload do arquivo PDF');
            }
          },
          (error) => {
            console.error('Erro ao fazer upload do arquivo PDF:', error);
          }
        );
    } else {
      console.error('Nenhum arquivo PDF selecionado');
    }
  }
}
