import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfviewerPageRoutingModule } from './pdfviewer-routing.module';

import { PdfviewerPage } from './pdfviewer.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerComponent } from 'src/app/components/pdf-viewer/pdf-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PdfviewerPageRoutingModule,
    NgxExtendedPdfViewerModule,
  ],
  declarations: [PdfviewerPage],
  exports: [PdfViewerComponent]
})
export class PdfviewerPageModule {}
