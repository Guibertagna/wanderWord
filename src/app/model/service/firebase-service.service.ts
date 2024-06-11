import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, fromDocRef } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, throwError, of, from } from 'rxjs';
import { finalize, catchError, switchMap, map, tap } from 'rxjs/operators';
import Ebook, { FileType } from '../entities/ebook';
import { PdfServiceService } from './pdf-service.service';
import Bookcase from '../entities/bookcase'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ebooksCollectionPath: string = 'ebooks';
  public documentId: string = ''
  private bookcasesCollectionPath: string = 'bookcases';
  constructor(
    private angularFirestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private pdfService: PdfServiceService
  ) { }
  uploadEbook(ebook: Ebook): Observable<number> {
    const fileExtension = ebook.file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension) {
      return throwError('Tipo de arquivo não suportado');
    }
  
    const fileName = ebook.file.name.replace(/\.[^/.]+$/, '');
    ebook.title = fileName;
  
    const filePath = `ebooks/${new Date().getTime()}_${ebook.file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, ebook.file);
  
    return new Observable<number>((observer) => {
      task.percentageChanges().subscribe(
        (percentage) => observer.next(percentage || 0),
        (error) => observer.error(error),
        () => {
          fileRef.getDownloadURL().subscribe(
            (url: string) => {
              ebook.filePath = filePath;
              ebook.fileUrl = url;
              observer.complete();
            },
            (error) => observer.error(error)
          );
        }
      );
    });
  }
  
  processEbook(ebook: Ebook): Observable<number> {
    const fileExtension = ebook.file.name.split('.').pop()?.toLowerCase();
    const allowedFileTypes = [FileType.PDF, FileType.EPUB, FileType.MOBI];
  
    return new Observable<number>((observer) => {
      if (!fileExtension || !allowedFileTypes.includes(fileExtension as FileType)) {
        observer.complete();
        return;
      }
  
      let progress = 0;
      const updateProgress = (increment: number) => {
        progress += increment;
        observer.next(progress);
      };
  
      this.pdfService.getPdfInfo(ebook.fileUrl).subscribe(
        (pdfInfo) => {
          ebook.pageCount = pdfInfo.pages || 0;
          ebook.author = pdfInfo.author || 'Unknown';
          updateProgress(20);
  
          this.saveCoverImage(ebook).subscribe(
            () => {
              updateProgress(20);
  
              this.saveEbookToFirestore(ebook).subscribe(
                (docId) => {
                  this.documentId = docId;
                  console.log('E-book e capa salvos com sucesso');
                  console.log('Document ID:', this.documentId);
                  updateProgress(60);
                  observer.complete();
                },
                (error) => observer.error(error)
              );
            },
            (error) => observer.error(error)
          );
        },
        (error) => observer.error(error)
      );
    });
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
  deleteEbook(ebookId: string): Observable<void> {
    return new Observable<void>((observer) => {
      // Excluir o e-book do Firestore
      this.angularFirestore.collection(this.ebooksCollectionPath).doc(ebookId).delete()
        .then(() => {
          console.log('E-book excluído do Firestore');
          
          // Remover o e-book de todas as estantes
          this.angularFirestore.collection(this.bookcasesCollectionPath).get().subscribe((querySnapshot) => {
            const batch = this.angularFirestore.firestore.batch();

            querySnapshot.forEach((doc) => {
              const bookcase = doc.data() as Bookcase;
              if (bookcase.books.includes(ebookId)) {
                const updatedBooks = bookcase.books.filter(id => id !== ebookId);
                const bookcaseDocRef = this.angularFirestore.collection(this.bookcasesCollectionPath).doc(doc.id).ref;
                batch.update(bookcaseDocRef, { books: updatedBooks });
              }
            });

            batch.commit().then(() => {
              console.log('E-book removido de todas as estantes');
              observer.next();
              observer.complete();
            }).catch((error) => {
              console.error('Erro ao remover e-book das estantes:', error);
              observer.error(error);
            });
          });
        })
        .catch((error) => {
          console.error('Erro ao excluir o e-book:', error);
          observer.error(error);
        });
    });
  }
  createBookcase(bookcase: Bookcase): Observable<string> {
    return from(this.afAuth.currentUser).pipe(
      switchMap(user => {
        if (user) {
          bookcase.userId = user.uid;
          return from(this.angularFirestore.collection(this.bookcasesCollectionPath).add({ ...bookcase }));
        } else {
          return throwError('Usuário não está autenticado');
        }
      }),
      map(docRef => docRef.id),
      catchError(error => {
        console.error('Erro ao criar a estante:', error);
        return throwError(error);
      })
    );
  }
  getBookcases(): Observable<Bookcase[]> {
    return from(this.afAuth.currentUser).pipe(
      tap(user => console.log('Usuário atual:', user)),
      switchMap(user => {
        if (user) {
          console.log('Usuário autenticado, buscando estantes...');
          return this.angularFirestore.collection<Bookcase>(this.bookcasesCollectionPath, ref =>
            ref.where('userId', '==', user.uid)
          ).valueChanges({ idField: 'docId' }).pipe(
            tap(bookcases => console.log('Estantes recebidas do Firestore:', bookcases))
          );
        } else {
          console.error('Usuário não está autenticado');
          return throwError('Usuário não está autenticado');
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar estantes:', error);
        return throwError(error);
      })
    );
  }
  getEbookById(bookId: string): Observable<Ebook> {
    return this.angularFirestore.collection(this.ebooksCollectionPath).doc(bookId).get().pipe(
      map(doc => {
        if (doc.exists) {
          return doc.data() as Ebook;
        } else {
          throw new Error('Ebook não encontrado');
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar o ebook por ID:', error);
        return throwError(error);
      })
    );
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
  getBookCoverById(bookId: string): Observable<string> {
    return this.angularFirestore.collection(this.ebooksCollectionPath).doc(bookId).get().pipe(
      map(doc => {
        if (doc.exists) {
          const ebook = doc.data() as Ebook;
          return ebook.coverImage;
        } else {
          throw new Error('Livro não encontrado');
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar a capa do livro:', error);
        return throwError(error);
      })
    );
  }
  getBookcaseById(bookcaseId: string): Observable<Bookcase> {
    return this.angularFirestore.collection(this.bookcasesCollectionPath).doc(bookcaseId).valueChanges().pipe(
      map((doc: any) => {
        return { ...doc, docId: bookcaseId } as Bookcase;
      }),
      catchError(error => {
        console.error('Erro ao buscar estante por ID:', error);
        return throwError(error);
      })
    );
  }
  deleteBookcase(bookcaseId: string): Observable<void> {
    return new Observable<void>((observer) => {
      // Excluir a estante do Firestore
      this.angularFirestore.collection(this.bookcasesCollectionPath).doc(bookcaseId).delete()
        .then(() => {
          console.log('Estante excluída do Firestore');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Erro ao excluir a estante:', error);
          observer.error(error);
        });
    });
  }
  updateBookcase(bookcase: Bookcase): Observable<void> {
    return new Observable<void>((observer) => {
      const bookcaseDocRef = this.angularFirestore.collection(this.bookcasesCollectionPath).doc(bookcase.docId);
      bookcaseDocRef.update({
        books: bookcase.books
      }).then(() => {
        console.log('Estante atualizada com sucesso');
        observer.next();
        observer.complete();
      }).catch((error) => {
        console.error('Erro ao atualizar a estante:', error);
        observer.error(error);
      });
    });
  }
}
