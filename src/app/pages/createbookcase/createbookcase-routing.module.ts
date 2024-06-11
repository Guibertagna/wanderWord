import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatebookcasePage } from './createbookcase.page';

const routes: Routes = [
  {
    path: '',
    component: CreatebookcasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatebookcasePageRoutingModule {}
