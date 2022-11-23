import { Component } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { Movie } from './common/movie.model';
import { MovieHandlerService } from './service/movie-handler.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-movies';

  public movies: Observable<Movie[]> = this.movieHandlerSvc.movies;

  constructor(private movieHandlerSvc: MovieHandlerService) {
    this.movieHandlerSvc.getMovies();
  }
}
