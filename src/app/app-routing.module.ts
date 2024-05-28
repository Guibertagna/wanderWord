import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'singup',
    loadChildren: () => import('./pages/user/singup/singup.module').then(m => m.SingupPageModule)
  },
  {
    path: 'pdfviewer',
    loadChildren: () => import('./pages/pdfviewer/pdfviewer.module').then(m => m.PdfviewerPageModule)
  },
  {
    path: 'editebook',
    loadChildren: () => import('./pages/edit-ebook/edit-ebook.module').then(m => m.EditEbookPageModule)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'edit-ebook',
    loadChildren: () => import('./pages/edit-ebook/edit-ebook.module').then( m => m.EditEbookPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
