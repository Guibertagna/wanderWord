import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Ebook, { FileType } from 'src/app/model/entities/ebook';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {
  ebook: Ebook = new Ebook(
    '', // id
    '', // title
    '', // author
    '', // description
    '', // coverImage
    FileType.PDF, // fileType
    new File([], ''), // file
    0, // pageCount
    false, // favorite
    0, // progress
    '', // ownerId
    '', // filePath
    '' // fileUrl
  );
  percentage: number = 0;
  isUploading: boolean = false;  // Propriedade para controlar o estado dos botões

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() { }

  handleUpload(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      this.ebook.file = file;
    }
  }

  uploadEbook() {
    if (this.ebook.file) {
      this.isUploading = true;  // Inicia o upload
      this.afAuth.currentUser.then(user => {
        if (user) {
          this.ebook.ownerId = user.uid;
          this.firebaseService.uploadEbook(this.ebook).subscribe({
            next: (progress) => {
              this.percentage = Math.round(progress * 0.5); // Reflete até 50% para upload do arquivo
            },
            error: (error) => {
              console.error('Erro durante o upload do eBook:', error);
              this.isUploading = false;  // Em caso de erro, reativa os botões
            },
            complete: () => {
              console.log('Upload do eBook concluído');
              this.firebaseService.processEbook(this.ebook).subscribe({
                next: (progress) => {
                  this.percentage = 50 + Math.round(progress * 0.5); // Reflete de 50% a 100% para processamento
                },
                error: (error) => {
                  console.error('Erro durante o processamento do eBook:', error);
                  this.isUploading = false;  // Em caso de erro, reativa os botões
                },
                complete: () => {
                  this.percentage = 100; // Define a porcentagem para 100% ao completar
                  this.isUploading = false;  // Finaliza o upload e reativa os botões
                  console.log('Processamento do eBook concluído');
                }
              });
            }
          });
        } else {
          console.error('Usuário não está autenticado');
          this.isUploading = false;  // Em caso de erro, reativa os botões
        }
      }).catch(error => {
        console.error('Erro ao obter usuário autenticado:', error);
        this.isUploading = false;  // Em caso de erro, reativa os botões
      });
    } else {
      console.error('Nenhum arquivo selecionado');
      this.isUploading = false;  // Em caso de erro, reativa os botões
    }
  }
}
