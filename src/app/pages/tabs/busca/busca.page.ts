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
      this.afAuth.currentUser.then(user => {
        if (user) {
          this.ebook.ownerId = user.uid;
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
          console.error('Usuário não está autenticado');
        }
      }).catch(error => {
        console.error('Erro ao obter usuário autenticado:', error);
      });
    } else {
      console.error('Nenhum arquivo selecionado');
    }
  }
}
