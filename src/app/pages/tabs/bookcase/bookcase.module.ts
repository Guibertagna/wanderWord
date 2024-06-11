import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookcasePageRoutingModule } from './bookcase-routing.module';

import { BookcasePage } from './bookcase.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookcasePageRoutingModule,
    ComponentsModule
  ],
  declarations: [BookcasePage]
})
export class BookcasePageModule {}
