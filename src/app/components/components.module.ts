import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EbookshomeComponent } from './ebookshome/ebookshome.component';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [EbookshomeComponent],
  imports: [
    CommonModule, IonicModule, HttpClientModule
  ],
  exports: [EbookshomeComponent]
})
export class ComponentsModule { }
