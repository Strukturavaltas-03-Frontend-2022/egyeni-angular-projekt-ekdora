import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Movie } from '../common/movie.model';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class MovieHandlerService {
  private _movies = new BehaviorSubject<Movie[]>([]);

  get movies() {
    return this._movies as Observable<Movie[]>;
  }

  constructor(private movieSvc: MovieService) {}

  getMovies() {
    this.movieSvc.getAll()
      .pipe(
        tap((movies: Movie[]) => this._movies.next(movies.slice(0, 99)))
      ).subscribe();
  };

  getMovieById(movieId: number) {
    return this.movieSvc.get(movieId);
  };

  createProduct(movie: Movie) {
    this.movieSvc.create(movie).subscribe((movie) => this.getMovies());
  };

  modifyProduct(movie: Movie) {
    this.movieSvc.update(movie).subscribe((movie) => this.getMovies());
  };

  removeProduct(movieId: number) {
    this.movieSvc.remove(movieId).subscribe((movie) => this.getMovies());
  };
}
