import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EbookshomeComponent } from './ebookshome/ebookshome.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EditbookComponent } from './editbook/editbook.component';

@NgModule({
  declarations: [EbookshomeComponent, ProfileComponent, PdfViewerComponent, EditbookComponent],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
  ],
  exports: [EbookshomeComponent, ProfileComponent, PdfViewerComponent, EditbookComponent],
})
export class ComponentsModule {}
