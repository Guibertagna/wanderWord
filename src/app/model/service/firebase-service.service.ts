import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ebooksCollectionPath: string = 'ebooks'; 

  constructor(
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  uploadfile(file: File): Observable<number> {
    const allowedFileTypes = ['pdf', 'epub', 'mobi'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
      console.error('Tipo de arquivo não suportado');
      return throwError('Tipo de arquivo não suportado');
    }

    const filePath = `ebooks/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<number>((observer) => {
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
              const ebookData = { filePath: filePath, fileUrl: url };
              this.saveEbookToFirestore(ebookData);
              observer.complete();
            },
            (error: any) => {
              console.error('Erro ao obter o URL de download:', error);
              observer.error(error);
            }
          );
        }
      );
    });
  }

  private saveEbookToFirestore(ebookData: any): void {
    this.angularFirestore.collection(this.ebooksCollectionPath).add(ebookData)
      .then(() => {
        console.log('E-book salvo com sucesso');
      })
      .catch((error) => {
        console.error('Erro ao salvar o e-book no Firestore:', error);
      });
  }
}
