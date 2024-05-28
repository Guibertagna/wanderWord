import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEbookPage } from './edit-ebook.page';

const routes: Routes = [
  {
    path: '',
    component: EditEbookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEbookPageRoutingModule {}
