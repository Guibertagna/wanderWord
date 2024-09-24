import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import Bookcase from 'src/app/model/entities/bookcase';
import Ebook from 'src/app/model/entities/ebook';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-bookcasecomponent',
  templateUrl: './bookcasecomponent.component.html',
  styleUrls: ['./bookcasecomponent.component.scss'],
})
export class BookcasecomponentComponent implements OnInit {
  bookcases: Bookcase[] = [];
  bookCovers: { [bookId: string]: string } = {};
  showAll: { [collectionName: string]: boolean } = {};
  ebooks: Ebook[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadBookcases();
  }

  toggleShowAll(collectionName: string) {
    this.showAll[collectionName] = !this.showAll[collectionName];
  }

  onEbookClicked(bookId: string) {
    const ebook = this.ebooks.find(e => e.docId === bookId);
    if (ebook) {
      console.log('Navigating to PDF Viewer with URL:', ebook.fileUrl);
      this.router.navigate(['/pdfviewer'], { queryParams: { pdfUrl: ebook.fileUrl } });
    } else {
      console.error('Ebook não encontrado para o ID:', bookId);
    }
  }

  loadBookcases() {
    this.firebaseService.getBookcases().subscribe(
      (bookcases) => {
        this.bookcases = bookcases;
        this.loadBookCovers();
        this.loadEbooks();
      },
      (error) => {
        console.error('Erro ao carregar estantes:', error);
      }
    );
  }

  loadBookCovers() {
    this.bookcases.forEach((bookcase) => {
      bookcase.books.forEach(bookId => {
        if (!this.bookCovers[bookId]) { // Verificar se a capa já foi carregada
          this.firebaseService.getBookCoverById(bookId).subscribe(
            (coverUrl) => {
              this.bookCovers[bookId] = coverUrl;
            },
            (error) => {
              console.error('Erro ao carregar capa do livro:', error);
            }
          );
        }
      });
    });
  }

  loadEbooks() {
    this.firebaseService.getAllEbooks().subscribe(
      (ebooks) => {
        this.ebooks = ebooks;
      },
      (error) => {
        console.error('Erro ao carregar e-books:', error);
      }
    );
  }

  async presentActionSheet(bookcase: Bookcase) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ações',
      buttons: [
        
        {
          text: 'Excluir',
          icon: 'trash',
          handler: () => {
            console.log('Excluir clicked', bookcase);
            this.deleteBookcase(bookcase);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  editBookcase(bookcase: Bookcase) {
    console.log('Editando estante:', bookcase);
  }

  async deleteBookcase(bookcase: Bookcase) {
    if (!bookcase.docId) {
      console.error('ID da estante indefinido:', bookcase);
      return;
    }

    const confirmDelete = await this.confirmDelete('Tem certeza de que deseja excluir esta estante?');

    if (confirmDelete) {
      this.firebaseService.deleteBookcase(bookcase.docId).subscribe(
        () => {
          console.log('Estante excluída com sucesso:', bookcase);
          this.bookcases = this.bookcases.filter(bc => bc.docId !== bookcase.docId);
        },
        (error) => {
          console.error('Erro ao excluir a estante:', error);
        }
      );
    }
  }

  async confirmDelete(message: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmação',
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: 'Excluir',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }

  createBookcase() {
    this.router.navigate(['/createbookcase']);
  }
  async confirmDeleteBook(bookId: string, bookcase: Bookcase) {
    const confirmDelete = await this.confirmDelete('Tem certeza de que deseja excluir este livro?');

    if (confirmDelete) {
      this.deleteBook(bookId, bookcase);
    }
  }

  deleteBook(bookId: string, bookcase: Bookcase) {
    const bookIndex = bookcase.books.indexOf(bookId);
    if (bookIndex > -1) {
      bookcase.books.splice(bookIndex, 1);
      this.firebaseService.updateBookcase(bookcase).subscribe(
        () => {
          console.log('Livro excluído com sucesso da estante:', bookcase);
        },
        (error) => {
          console.error('Erro ao excluir livro da estante:', error);
        }
      );
    }
  }
}
