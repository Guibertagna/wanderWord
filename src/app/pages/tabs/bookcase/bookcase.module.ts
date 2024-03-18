import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookcasePageRoutingModule } from './bookcase-routing.module';

import { BookcasePage } from './bookcase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookcasePageRoutingModule
  ],
  declarations: [BookcasePage]
})
export class BookcasePageModule {}
