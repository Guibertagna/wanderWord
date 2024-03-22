import { Component, Input, OnInit } from '@angular/core';
import Ebook from 'src/app/model/entities/ebook';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';

@Component({
  selector: 'app-ebookshome',
  templateUrl: './ebookshome.component.html',
  styleUrls: ['./ebookshome.component.scss'],
})
export class EbookshomeComponent implements OnInit {
  @Input() filter: any; // Se precisar de um parâmetro de filtro
  ebooks: Ebook[] = []; // Definindo a propriedade ebooks

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getAllEbooks();
  }

  getAllEbooks() {
    // Chame sua função do serviço FirebaseService para obter todos os ebooks
    this.firebaseService.getAllEbooks().subscribe(
      (ebooks: Ebook[]) => {
        // Atualize a propriedade ebooks com os ebooks recuperados
        this.ebooks = ebooks;
      },
      (error) => {
        console.error('Erro ao recuperar e-books:', error);
      }
    );
  }
}
