import { Component, OnInit } from '@angular/core';
import Ebook, { FileType } from 'src/app/model/entities/ebook';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/model/service/firebase-service.service';

@Component({
  selector: 'app-editbook',
  templateUrl: './editbook.component.html',
  styleUrls: ['./editbook.component.scss'],
})
export class EditbookComponent implements OnInit {
  ebook: Ebook = new Ebook(
    '', // id
    '', // title
    '', // author
    '', // description
    '', // coverImage
    FileType.PDF, // fileType
    new File([], ''), // file
    0, // pageCount
    false, // favorite
    0, // progress
    '', // ownerId
    '', // filePath
    '' // fileUrl
  );
  constructor(private router: ActivatedRoute, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.router.paramMap.subscribe(params => {
      this.ebook = history.state.ebook || this.ebook; // Atribuindo o valor do ebook, se estiver disponível
    });
  }
  saveChanges() {
    this.firebaseService.updateEbook(this.ebook).subscribe(() => {
      
    });
  }
  
}
