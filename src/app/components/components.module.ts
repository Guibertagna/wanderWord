import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EbookshomeComponent } from './ebookshome/ebookshome.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';


@NgModule({
  declarations: [EbookshomeComponent, ProfileComponent, PdfViewerComponent],
  imports: [
    CommonModule, IonicModule, HttpClientModule, FormsModule, PdfViewerModule
  ],
  exports: [EbookshomeComponent, ProfileComponent, PdfViewerComponent]
})
export class ComponentsModule { }
