import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfviewerPageRoutingModule } from './pdfviewer-routing.module';

import { PdfviewerPage } from './pdfviewer.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PdfviewerPageRoutingModule
  ],
  declarations: [PdfviewerPage]
})
export class PdfviewerPageModule {}
