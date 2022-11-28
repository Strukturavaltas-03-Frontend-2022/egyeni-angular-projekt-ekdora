import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IMaskModule } from 'angular-imask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './common/navigation/navigation.component';
import { MovieCardComponent } from './common/movie-card/movie-card.component';
import { MovieListComponent } from './common/movie-list/movie-list.component';
import { HomeComponent } from './page/home/home.component';
import { MoviesComponent } from './page/movies/movies.component';
import { CarouselComponent } from './common/carousel/carousel.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { MovieEditorComponent } from './common/movie-editor/movie-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MovieCardComponent,
    MovieListComponent,
    HomeComponent,
    MoviesComponent,
    CarouselComponent,
    PaginationComponent,
    MovieEditorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IMaskModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
