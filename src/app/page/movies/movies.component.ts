import { Component } from '@angular/core';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  public movies$ = this.movieHandlerSvc.filteredMovies;

  constructor(private movieHandlerSvc: MovieHandlerService) {}
}
