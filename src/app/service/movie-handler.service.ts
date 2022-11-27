import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { DataObject } from '../common/model/data-object.interface';
import { Movie } from '../common/model/movie.model';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class MovieHandlerService {
  private _movies = new BehaviorSubject<Movie[]>([]);
  private _filteredMovies = new BehaviorSubject<Movie[]>([]);
  private _genres: string[] = [];
  private _releaseYears: number[] = [];
  private _releaseYearRanges: string[] = [];

  get movies() {
    return this._movies as Observable<Movie[]>;
  }

  get filteredMovies() {
    return this._filteredMovies as Observable<Movie[]>;
  }

  get genres() {
    return this._genres;
  }

  get releaseYearRanges() {
    return this._releaseYearRanges;
  }

  constructor(private movieSvc: MovieService) {}

  getMovies() {
    this.movieSvc.getAll()
      .pipe(
        tap(
          (movies: Movie[]) => {
            const first100Movies = movies.slice(0, 100);
            this._movies.next(first100Movies);
            this._filteredMovies.next(first100Movies);
            first100Movies.forEach(movie => {
              this._genres = [ ...this._genres, ...movie['genre'].split('|')];
              this._releaseYears.push(movie['releaseYear']);
            });
            this._genres = [ ...new Set(this._genres) ]
              .filter(cat => cat !== '(no genres listed)')
              .sort(Intl.Collator().compare);
            this._releaseYears = [ ...new Set(this._releaseYears) ].sort();
            this.setReleaseYearRanges();
            // console.log(this._genres, this._releaseYears, this._releaseYearRanges);
          }
        )
      ).subscribe();
  };

  getMovieById(movieId: number) {
    return this.movieSvc.get(movieId);
  };

  createMovie(movie: Movie) {
    this.movieSvc.create(movie).subscribe((movie) => this.getMovies());
  };

  modifyMovie(movie: Movie) {
    this.movieSvc.update(movie).subscribe((movie) => this.getMovies());
  };

  removeMovie(movieId: number) {
    this.movieSvc.remove(movieId).subscribe((movie) => this.getMovies());
  };

  lastXYears(x: number) {
    return this._movies.pipe(
      map(movies => movies.filter(movie => movie.releaseYear > ((new Date()).getFullYear()) - x))
    ) as Observable<Movie[]>;
  }

  filterMovies(formEntries: DataObject) {
    this._movies.pipe(
      tap((movies) => {
        let filteredMovies = movies;

        Object.keys(formEntries).forEach(formEntrieName => {
          if(formEntrieName === 'releaseYear') {
            const releaseYearRanges = formEntries[formEntrieName].split(' - ');
            const releaseYearRangeStart = Number(releaseYearRanges[0]);
            const releaseYearRangeEnd = Number(releaseYearRanges[1]);

            filteredMovies = filteredMovies.filter(m => m[formEntrieName] >= releaseYearRangeStart && m[formEntrieName] <= releaseYearRangeEnd);
          } else {
            filteredMovies = filteredMovies.filter(m => m[formEntrieName].toLowerCase().includes(formEntries[formEntrieName].toLowerCase()));
          }
        });

        this._filteredMovies.next(filteredMovies);
      })
    ).subscribe();
  }

  private setReleaseYearRanges() {
    let releaseYear = 0;
    let releaseYearRangeStart = 0;
    let releaseYearRangeEnd = 0;

    this._releaseYears.forEach(rY => {
      if(Math.floor(rY / 10) !== Math.floor(releaseYear / 10)) {
        releaseYearRangeStart = rY - rY % 10;
        releaseYearRangeEnd = releaseYearRangeStart + 9;
        this._releaseYearRanges.push(`${releaseYearRangeStart} - ${releaseYearRangeEnd}`);
      }
      releaseYear = rY;
    });
  }
}
