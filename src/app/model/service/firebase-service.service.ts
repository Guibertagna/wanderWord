import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, throwError } from 'rxjs';

import Ebook, { FileType } from '../entities/ebook';
import { PdfServiceService } from './pdf-service.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ebooksCollectionPath: string = 'ebooks';

  constructor(
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage,
    private pdfService: PdfServiceService
  ) { }

  uploadEbook(ebook: Ebook): Observable<number> {
    const allowedFileTypes = [FileType.PDF, FileType.EPUB, FileType.MOBI];
    const fileExtension = ebook.file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension) {
      const errorMessage = 'Tipo de arquivo não suportado';
      console.error(errorMessage);
      return throwError(errorMessage);
    }

    const fileName = ebook.file.name.replace(/\.[^/.]+$/, ''); // Remove a extensão do nome do arquivo
    ebook.title = fileName; // Atribui o nome do arquivo ao campo title

    const filePath = `ebooks/${new Date().getTime()}_${ebook.file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, ebook.file);

    const uploadObservable = new Observable<number>((observer) => {
      task.percentageChanges().subscribe(
        (percentage) => {
          observer.next(percentage || 0);
        },
        (error) => {
          console.error('Erro durante o upload do arquivo:', error);
          observer.error(error);
        },
        () => {
          fileRef.getDownloadURL().subscribe(
            (url: string) => {
              if (allowedFileTypes.includes(fileExtension as FileType)) {
                this.pdfService.getPdfInfo(url).subscribe(
                  (pdfInfo) => {
                    ebook.pageCount = pdfInfo.pages || 0;
                    ebook.author = pdfInfo.author || 'Unknown';
                    ebook.filePath = filePath;
                    ebook.fileUrl = url;
                    this.saveCoverAndEbookToFirestore(ebook).subscribe(
                      () => {
                        console.log('E-book e capa salvos com sucesso');
                        observer.complete();
                      },
                      (error) => {
                        console.error('Erro ao salvar o e-book e a capa no Firestore:', error);
                        observer.error(error);
                      }
                    );
                  },
                  (error) => {
                    console.error('Erro ao obter informações do PDF:', error);
                    observer.error(error);
                  }
                );
              } else {
                console.log('Extensão do arquivo:', fileExtension);
                observer.complete();
              }
            },
            (error: any) => {
              console.error('Erro ao obter o URL de download:', error);
              observer.error(error);
            }
          );
        }
      );
    });

    return uploadObservable;
  }

  private saveCoverAndEbookToFirestore(ebook: Ebook): Observable<void> {
    return new Observable<void>((observer) => {
      this.pdfService.extractCover(ebook.fileUrl).subscribe(
        (coverUrl: string) => {
          this.angularFirestore.collection(this.ebooksCollectionPath).add({
            author: ebook.author,
            pageCount: ebook.pageCount,
            filePath: ebook.filePath,
            fileUrl: ebook.fileUrl,
            title: ebook.title,
            coverImage: coverUrl
          }).then(() => {
            observer.next();
            observer.complete();
          }).catch((error) => {
            console.error('Erro ao salvar o eBook no Firestore:', error);
            observer.error(error);
          });
        },
        (error) => {
          console.error('Erro ao extrair a capa do eBook:', error);
          observer.error(error);
        }
      );
    });
  }

  getAllEbooks(): Observable<any[]> {
    return this.angularFirestore.collection(this.ebooksCollectionPath).valueChanges();
  }
}
