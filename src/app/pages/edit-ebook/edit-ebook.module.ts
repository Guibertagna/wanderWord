import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEbookPageRoutingModule } from './edit-ebook-routing.module';

import { EditEbookPage } from './edit-ebook.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    EditEbookPageRoutingModule
  ],
  declarations: [EditEbookPage]
})
export class EditEbookPageModule {}
