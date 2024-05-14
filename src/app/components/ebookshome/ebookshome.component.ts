import { Component, Input, Output, EventEmitter } from '@angular/core';
import Ebook from 'src/app/model/entities/ebook';
import { Router } from '@angular/router'; // Importe o Router
import { FirebaseService } from 'src/app/model/service/firebase-service.service';

@Component({
  selector: 'app-ebookshome',
  templateUrl: './ebookshome.component.html',
  styleUrls: ['./ebookshome.component.scss'],
})
export class EbookshomeComponent {
  @Input() filter: any;
  ebooks: Ebook[] = [];
  filteredEbooks: Ebook[] = [];
  searchTerm: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) {} // Injete o Router

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
      }
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

  onEbookClicked(pdfUrl: string) {
    console.log(pdfUrl)
    this.router.navigate(['/pdfviewer'], { queryParams: { pdfUrl: pdfUrl } });
  }
  
}
