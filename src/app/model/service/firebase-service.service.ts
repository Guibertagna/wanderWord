import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, throwError } from 'rxjs'; // Importar throwError do RxJS
import Ebook from '../entities/ebook';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ebooksCollectionPath: string = 'ebooks'; // Caminho para a coleção de eBooks

  constructor(
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  registerEbook(eBook: Ebook): Promise<void> {
    return this.angularFirestore.collection(this.ebooksCollectionPath)
      .add({
        title: eBook.title,
        author: eBook.author,
        description: eBook.description,
        coverImage: eBook.coverImage,
        fileType: eBook.fileType,
        file: eBook.file,
        pageCount: eBook.pageCount,
        favorite: eBook.favorite,
        progress: eBook.progress,
        ownerId: eBook.ownerId,
        collectionId: eBook.collectionId
      })
      .then(() => {})
      .catch((error) => {
        console.error('Error registering eBook:', error);
        throw error;
      });
  }

  uploadAndSaveEbook(file: File, ebookData: any): Observable<string | null> {
    const allowedFileTypes = ['pdf', 'epub', 'mobi'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
      return throwError('Unsupported file type'); // Usar throwError em vez de Observable.throw
    }

    let filePath = `ebooks/${new Date().getTime()}_${file.name}`;
    // Remove a extensão adicional do nome do arquivo, se presente
    if (fileExtension === 'pdf' && filePath.endsWith('.pdf.pdf')) {
      filePath = filePath.replace('.pdf.pdf', '.pdf');
    }

    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string | null>((observer) => {
      task.snapshotChanges().subscribe(
        (snapshot) => {
          if (snapshot && snapshot.state === 'success') {
            fileRef.getDownloadURL().subscribe(
              (url: string) => {
                const ebook = { ...ebookData, filePath: filePath, fileUrl: url };
                this.saveEbookToFirestore(ebook).then(() => {
                  observer.next(url);
                  observer.complete();
                }).catch((error) => {
                  console.error('Error saving eBook data to Firestore:', error);
                  observer.error(error);
                });
              },
              (error: any) => {
                console.error('Error getting download URL:', error);
                observer.error(error);
              }
            );
          } else if (snapshot && snapshot.state === 'error') {
            const error = new Error('Upload failed');
            console.error('Error uploading eBook file:', error);
            observer.error(error);
          }
        },
        (error: any) => {
          console.error('Error uploading eBook file:', error);
          observer.error(error);
        }
      );
    });
  }

  private saveEbookToFirestore(ebook: any): Promise<void> {
    return this.angularFirestore.collection(this.ebooksCollectionPath).add(ebook)
      .then(() => {})
      .catch((error) => {
        console.error('Error saving eBook data to Firestore:', error);
        throw error;
      });
  }
}
