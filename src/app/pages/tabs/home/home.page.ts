// home.page.ts
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import Ebook, { FileType } from 'src/app/model/entities/ebook';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
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
  percentage: number = 0;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {}

  handleUpload(event: any) {
    const file = event.target.files[0]; 
    if (file) {
      this.ebook.file = file; 
    }
  }

  uploadEbook() {
    if (this.ebook.file) {
      this.firebaseService.uploadEbook(this.ebook).subscribe(
        (progress) => {
          this.percentage = Math.round(progress)
        },
        (error) => {
          console.error('Erro durante o upload do eBook:', error);
        },
        () => {
          console.log('Upload do eBook concluído');
        }
      );
    } else {
      console.error('Nenhum arquivo selecionado');
    }
  }
}
