import { Component, Input, OnInit } from '@angular/core';
import Ebook from 'src/app/model/entities/ebook';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private firebaseService: FirebaseService) { }
                                  
  ngOnInit() {
    this.getAllEbooks();
  }

  getAllEbooks() {
    this.firebaseService.getAllEbooks().subscribe({
      next: (ebooks: Ebook[]) => {
        this.ebooks = ebooks;
        this.filterEbooks(); // Aplica a filtragem inicial ao obter todos os ebooks
      },
      error: (error) => {
        console.error('Erro ao recuperar e-books:', error);
      }
    });
  }

  filterEbooks() {
    if (!this.searchTerm.trim()) {
      // Se o campo de busca estiver vazio, exiba todos os ebooks
      this.filteredEbooks = this.ebooks;
    } else {
      // Caso contrário, filtre os ebooks com base no termo de busca
      this.filteredEbooks = this.ebooks.filter(ebook =>
        ebook.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ebook.author.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
