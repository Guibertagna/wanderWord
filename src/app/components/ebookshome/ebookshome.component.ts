import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Ebook from 'src/app/model/entities/ebook';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController
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

    const alert = await this.alertController.create({
      header: 'Opções',
      buttons: [
        {
          text: 'Adicionar a Estante',
          handler: () => {
            console.log('Ação 1 selecionada para', ebook.title);
            // Lógica para ação 1
          }
        },
        {
          text: 'Editar',
          handler: () => {
            this.goEdit(ebook)
            console.log('Ação 2 selecionada para', ebook.title);
            // Lógica para ação 2
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            console.log('Ação 2 selecionada para', ebook.title);
            // Lógica para ação 2
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Ação cancelada');
          }
        }
      ]
    });

    await alert.present();
  }
}
