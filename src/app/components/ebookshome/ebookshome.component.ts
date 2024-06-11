import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Ebook from 'src/app/model/entities/ebook';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import { AlertController, AlertInput, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-ebookshome',
  templateUrl: './ebookshome.component.html',
  styleUrls: ['./ebookshome.component.scss'],
})
export class EbookshomeComponent implements OnInit {
  @Input() filter: any;
  ebooks: Ebook[] = [];
  filteredEbooks: Ebook[] = [];
  searchTerm: string = '';

  constructor(

    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private  actionSheetcontroller: ActionSheetController

  ) {}

  ngOnInit() {
   
    this.getAllEbooks();

  }

  getAllEbooks() {
    this.firebaseService.getAllEbooks().subscribe({
      next: (ebooks: Ebook[]) => {
        this.ebooks = ebooks;
        this.filterEbooks();
      },
      error: (error) => {
        console.error('Erro ao recuperar e-books:', error);
      },
    });
  }

  filterEbooks() {
    if (!this.searchTerm.trim()) {
      this.filteredEbooks = this.ebooks;
    } else {
      this.filteredEbooks = this.ebooks.filter(ebook =>
        ebook.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ebook.author.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onEbookClicked(ebook: Ebook) {
    console.log('Navigating to PDF Viewer with URL:', ebook.fileUrl);
    this.router.navigate(['/pdfviewer'], { queryParams: { pdfUrl: ebook.fileUrl } });
  }

  goEdit(ebook: Ebook) {
    this.router.navigate(['/editebook'], { state: { ebook: ebook } });
  }

  async onOptionsClicked(event: Event, ebook: Ebook) {
    event.stopPropagation();

    const alert = await this.actionSheetcontroller.create({
      header: 'Opções',
      buttons: [
        {
          text: 'Adicionar a Estante',
          icon: 'add',
          handler: async () => {
            console.log('Adicionar a Estante clicado');
            await alert.dismiss();
            await this.openAddToBookcaseDialog(ebook);
          }
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.goEdit(ebook);
          }
        },
        {
          text: 'Excluir',
          icon: 'trash',
          handler: () => {
            this.deleteEbook(ebook);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Ação cancelada');
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteEbook(ebook: Ebook) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: `Você tem certeza de que deseja excluir o e-book "${ebook.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: async () => {
            try {
              await firstValueFrom(this.firebaseService.deleteEbook(ebook.docId));
              this.ebooks = this.ebooks.filter(e => e.docId !== ebook.docId);
              this.filterEbooks();
              const toast = await this.toastController.create({
                message: 'E-book excluído com sucesso.',
                duration: 2000,
                position: 'top'
              });
              await toast.present();
            } catch (error) {
              const toast = await this.toastController.create({
                message: 'Erro ao excluir o e-book.',
                duration: 2000,
                position: 'top'
              });
              await toast.present();
              console.error('Erro ao excluir o e-book:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openAddToBookcaseDialog(ebook: Ebook) {
      console.log('Abrindo diálogo para adicionar a estante');
  
      try {
          const bookcases = await firstValueFrom(this.firebaseService.getBookcases());
          console.log('Estantes carregadas:', bookcases);
  
          let inputs: AlertInput[] = [];
          if (bookcases && bookcases.length > 0) {
              inputs = bookcases.map((bookcase) => ({
                  name: 'bookcase',
                  type: 'checkbox' as const,
                  label: bookcase.bookcasename,
                  value: bookcase.docId,
              }));
          } else {
              console.error('Nenhuma estante encontrada.');
              return;
          }
  
          console.log('Inputs do alerta:', inputs);
  
          const alert = await this.alertController.create({
              header: 'Selecione as estantes desejadas',
              inputs,
              buttons: [
                  {
                      text: 'Cancelar',
                      role: 'cancel',
                      handler: () => {
                          console.log('Adicionar a estante cancelado');
                      }
                  },
                  {
                      text: 'OK',
                      handler: (selectedBookcases: string[]) => {
                          console.log('Estantes selecionadas:', selectedBookcases);
                          if (bookcases.length > 0) {
                              this.addEbookToBookcases(ebook, selectedBookcases);
                          }
                      }
                  }
              ]
          });
  
          console.log('Alerta criado:', alert);
          await alert.present();
          console.log('Alerta apresentado');
      } catch (error) {
          console.error('Erro ao carregar estantes:', error);
      }
  }
  
  addEbookToBookcases(ebook: Ebook, selectedBookcases: string[]) {
      console.log('Adicionando ebook às estantes:', selectedBookcases);
      selectedBookcases.forEach((bookcaseId) => {
          this.firebaseService.getBookcaseById(bookcaseId).subscribe((bookcase) => {
              if (bookcase) {
                  if (!bookcase.books.includes(ebook.docId)) {
                      bookcase.books.push(ebook.docId);
                      this.firebaseService.updateBookcase(bookcase).subscribe(() => {
                          console.log(`Livro ${ebook.title} adicionado à estante ${bookcase.bookcasename}`);
                      });
                  } else {
                      console.log(`O livro ${ebook.title} já está na estante ${bookcase.bookcasename}`);
                  }
              }
          });
      });
  }
}  
