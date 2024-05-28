import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, fromDocRef } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, throwError, of } from 'rxjs';
import { finalize, catchError, switchMap } from 'rxjs/operators';
import Ebook, { FileType } from '../entities/ebook';
import { PdfServiceService } from './pdf-service.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ebooksCollectionPath: string = 'ebooks';
  public documentId: string = ''

  constructor(
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
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
    const task: AngularFireUploadTask = this.storage.upload(filePath, ebook.file);

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
                    // Agora vamos salvar a imagem da capa antes de salvar o eBook
                    this.saveCoverImage(ebook).subscribe(
                      () => {
                        this.saveEbookToFirestore(ebook).subscribe(
                          (docId) => {  // Recebe o ID do documento
                            this.documentId = docId;  // Salva o ID do documento na variável 'documentId'
                            console.log('E-book e capa salvos com sucesso');
                            console.log('Document ID:', this.documentId);
                            observer.complete();
                          },
                          (error) => {
                            console.error('Erro ao salvar o e-book no Firestore:', error);
                            observer.error(error);
                          }
                        );
                      },
                      (error) => {
                        console.error('Erro ao salvar a imagem da capa:', error);
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
  
  replaceFileWithAnnotations(filePath: string, newBlob: Blob): Observable<string> {
    return new Observable<string>((observer) => {
      console.log("Caminho do arquivo:", filePath); 
      const fileRef = this.storage.refFromURL(filePath); // Usando refFromURL() para criar uma referência a partir do URL
      const uploadTask: AngularFireUploadTask = fileRef.put(newBlob);
    
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          observer.next(filePath);
          observer.complete();
        }),
        catchError((error) => {
          console.error('Erro durante a substituição do arquivo:', error);
          observer.error(error);
          return throwError(error);
        })
      ).subscribe();
    });
  }
  
  
  
  
  updateEbook(ebook: Ebook): Observable<void> {
    return new Observable<void>((observer) => {
      const ebookDocRef = this.angularFirestore.collection(this.ebooksCollectionPath).doc(ebook.docId);

  
  
      ebookDocRef.update({
        author: ebook.author,
        pageCount: ebook.pageCount,
        title: ebook.title
        // Adicione outros campos que deseja atualizar aqui
      }).then(() => {
        console.log('Ebook atualizado com sucesso');
        observer.next();
        observer.complete();
      }).catch((error) => {
        console.error('Erro ao atualizar o ebook:', error);
        observer.error(error);
      });
    });
  }
 

  private saveCoverImage(ebook: Ebook): Observable<void> {
    return new Observable<void>((observer) => {
      this.pdfService.extractCover(ebook.fileUrl).subscribe(
        (coverImageBlob: Blob) => {
          const coverFilePath = `covers/${new Date().getTime()}_cover.png`;
          const coverRef = this.storage.ref(coverFilePath);
          const uploadTask: AngularFireUploadTask = this.storage.upload(coverFilePath, coverImageBlob);

          uploadTask.snapshotChanges().pipe(
            finalize(() => {
              coverRef.getDownloadURL().subscribe(
                (coverImage: string) => {
                  ebook.coverImage = coverImage;
                  observer.next();
                  observer.complete();
                },
                (error) => {
                  console.error('Erro ao obter o URL da imagem da capa:', error);
                  observer.error(error);
                }
              );
            }),
            catchError((error) => {
              console.error('Erro durante o upload da imagem da capa:', error);
              observer.error(error);
              return throwError(error);
            })
          ).subscribe();
        },
        (error) => {
          console.error('Erro ao extrair a imagem da capa:', error);
          observer.error(error);
        }
      );
    });
  }

  private saveEbookToFirestore(ebook: Ebook): Observable<string> {
    return new Observable<string>((observer) => {
      this.angularFirestore.collection(this.ebooksCollectionPath).add({
        author: ebook.author,
        pageCount: ebook.pageCount,
        filePath: ebook.filePath,
        fileUrl: ebook.fileUrl,
        title: ebook.title,
        coverImage: ebook.coverImage,
        ownerId: ebook.ownerId 
      }).then((docRef) => {
        const docId = docRef.id;
        
        this.angularFirestore.collection(this.ebooksCollectionPath).doc(docId).update({ docId: docId }).then(() => {
          observer.next(docId);
          observer.complete();
        }).catch((error) => {
          console.error('Erro ao salvar o ID do documento no Firestore:', error);
          observer.error(error);
        });
      }).catch((error) => {
        console.error('Erro ao salvar o eBook no Firestore:', error);
        observer.error(error);
      });
    });
  }
  
  

  getAllEbooks(): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularFirestore.collection(this.ebooksCollectionPath, ref =>
            ref.where('ownerId', '==', user.uid)
          ).valueChanges();
        } else {
          return throwError('Usuário não está autenticado');
        }
      })
    );
  }
}
