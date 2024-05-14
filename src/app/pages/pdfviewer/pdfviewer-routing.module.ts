import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfviewerPage } from './pdfviewer.page';

const routes: Routes = [
  {
    path: '',
    component: PdfviewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfviewerPageRoutingModule {}
