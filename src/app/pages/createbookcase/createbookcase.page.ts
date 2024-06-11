import { Component, OnInit } from '@angular/core';
import Bookcase from 'src/app/model/entities/bookcase';
import { FirebaseService } from 'src/app/model/service/firebase-service.service'; 
import Ebook from '../../model/entities/ebook';
@Component({
  selector: 'app-createbookcase',
  templateUrl: './createbookcase.page.html',
  styleUrls: ['./createbookcase.page.scss'],
})
export class CreatebookcasePage implements OnInit {
  bookcaseName: string = '';
  selectedBooks: string[] = [];
  books: Ebook[] = []; // Array para armazenar os livros disponíveis

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.firebaseService.getAllEbooks().subscribe(
      (books) => {
        this.books = books;
      },
      (error) => {
        console.error('Erro ao carregar livros:', error);
      }
    );
  }

  createBookcase() {
    const bookcase = new Bookcase(this.bookcaseName, ''); // O userId será atribuído no serviço Firebase
    bookcase.books = this.selectedBooks;
    
    this.firebaseService.createBookcase(bookcase).subscribe(
      (docId) => {
        console.log('Estante criada com sucesso, ID:', docId);
        
        // Redirecionar ou exibir mensagem de sucesso conforme necessário
      },
      (error) => {
        console.error('Erro ao criar estante:', error);
      }
    );
  }
}
