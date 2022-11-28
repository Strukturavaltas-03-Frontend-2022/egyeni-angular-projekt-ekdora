import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieEditorComponent } from './common/movie-editor/movie-editor.component';
import { HomeComponent } from './page/home/home.component';
import { MoviesComponent } from './page/movies/movies.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'movies',
    component: MoviesComponent,
  },
  {
    path: 'movies/:id',
    component: MovieEditorComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
