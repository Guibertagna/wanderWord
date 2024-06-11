import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookcase',
  templateUrl: './bookcase.page.html',
  styleUrls: ['./bookcase.page.scss'],
})
export class BookcasePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  createBookcase() {
    this.router.navigate(['/createbookcase']);
  }
}
