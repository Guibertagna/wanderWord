  import { Component, OnInit } from '@angular/core';
  import { FirebaseService } from 'src/app/model/service/firebase-service.service';
  import { Observable } from 'rxjs';

  @Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
  })
  export class HomePage implements OnInit {
    file!: File; 
    percentage!: Observable<number>; 

    constructor(private firebaseService: FirebaseService) { }

    ngOnInit() {}

    handleUpload(event: any) {
      const file = event.target.files[0]; 
      if (file) {
        this.file = file; 
      }
    }

    uploadfile() {
      if (this.file) {
        this.percentage = this.firebaseService.uploadfile(this.file);
      } else {
        console.error('Nenhum arquivo file selecionado');
      }
    }
    
  }
