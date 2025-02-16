import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Error404Component } from './error404.component';

const routes: Routes = [
  { path : "", component: Error404Component }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Error404Component]
})
export class Error404Module { 
}
