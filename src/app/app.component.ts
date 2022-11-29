import { Component } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { Movie } from './common/model/movie.model';
import { MovieHandlerService } from './service/movie-handler.service';
import { UiService } from './service/ui.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-movies';

  public movies: Observable<Movie[]> = this.movieHandlerSvc.movies;

  constructor(
    private movieHandlerSvc: MovieHandlerService,
    private uiService: UiService,
  ) {
    this.uiService.loading.next(true);
    this.movieHandlerSvc.getMovies();
  }
}
