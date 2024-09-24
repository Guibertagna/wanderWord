import { Component, OnInit } from '@angular/core';
import Bookcase from 'src/app/model/entities/bookcase';
import { FirebaseService } from 'src/app/model/service/firebase-service.service'; 
import Ebook from '../../model/entities/ebook';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-createbookcase',
  templateUrl: './createbookcase.page.html',
  styleUrls: ['./createbookcase.page.scss'],
})
export class CreatebookcasePage implements OnInit {
  bookcaseName: string = '';
  selectedBooks: string[] = [];
  books: Ebook[] = []; // Array para armazenar os livros disponíveis

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController
  ) { }

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

  async createBookcase() {
    const bookcase = new Bookcase(this.bookcaseName, ''); // O userId será atribuído no serviço Firebase
    bookcase.books = this.selectedBooks;

    this.firebaseService.createBookcase(bookcase).subscribe(
      async (docId) => {
        console.log('Estante criada com sucesso, ID:', docId);
        await this.showSuccessMessage();
        this.router.navigate(['/tabs/bookcase']);
      },
      (error) => {
        console.error('Erro ao criar estante:', error);
      }
    );
  }

  async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Estante criada com sucesso!',
      buttons: ['OK']
    });

    await alert.present();
  }
}
