import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatebookcasePageRoutingModule } from './createbookcase-routing.module';

import { CreatebookcasePage } from './createbookcase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatebookcasePageRoutingModule
  ],
  declarations: [CreatebookcasePage]
})
export class CreatebookcasePageModule {}
