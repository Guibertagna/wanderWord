// Importações necessárias para a página inicial
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase-service.service'; // Importa o serviço Firebase
import Ebook, { FileType } from 'src/app/model/entities/ebook'; // Importa o modelo Ebook e o enum FileType

@Component({
  selector: 'app-home', // Define o seletor do componente
  templateUrl: './home.page.html', // Define o template HTML da página inicial
  styleUrls: ['./home.page.scss'], // Define os estilos da página inicial
})
export class HomePage implements OnInit {
  // Instância de Ebook para armazenar informações do eBook sendo carregado
  ebook: Ebook = new Ebook(
    0, // id
    '', // title
    '', // author
    '', // description
    '', // coverImage
    FileType.PDF, // fileType
    new File([], ''), // file
    0, // pageCount
    false, // favorite
    0, // progress
    0, // ownerId
    '', // filePath
    '' // fileUrl
  );
  // Porcentagem de conclusão do upload do eBook
  percentage: number = 0;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {}

  // Manipula o evento de upload de arquivo
  handleUpload(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      // Atribui o arquivo selecionado à propriedade 'file' do eBook
      this.ebook.file = file; 
    }
  }

  // Envia o eBook para ser carregado para o serviço Firebase
  uploadEbook() {
    if (this.ebook.file) {
      // Realiza o upload do eBook e monitora o progresso
      this.firebaseService.uploadEbook(this.ebook).subscribe({
        next: (progress) => {
          this.percentage = Math.round(progress);
        },
        error: (error) => {
          console.error('Erro durante o upload do eBook:', error);
        },
        complete: () => {
          console.log('Upload do eBook concluído');
        }
      });      
    } else {
      console.error('Nenhum arquivo selecionado');
    }
  }
}
