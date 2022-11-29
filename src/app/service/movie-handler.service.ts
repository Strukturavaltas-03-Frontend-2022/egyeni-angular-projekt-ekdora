import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { DataObject } from '../common/model/data-object.interface';
import { Movie } from '../common/model/movie.model';
import { SortType } from '../common/model/sortType.type';
import { MovieService } from './movie.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class MovieHandlerService {
  private _movies = new BehaviorSubject<Movie[]>([]);
  private _filteredMovies = new BehaviorSubject<Movie[]>([]);
  private _sortedProp = new BehaviorSubject<string>('');
  private _genres: string[] = [];
  private _posters: string[] = [];
  private _releaseYears: number[] = [];
  private _releaseYearRanges: string[] = [];

  get movies() {
    return this._movies as Observable<Movie[]>;
  }

  get filteredMovies() {
    return this._filteredMovies as Observable<Movie[]>;
  }

  get sortedProp() {
    return this._sortedProp as Observable<string>;
  }

  get genres() {
    return this._genres;
  }

  get posters() {
    return this._posters;
  }

  get releaseYearRanges() {
    return this._releaseYearRanges;
  }

  constructor(
    private movieSvc: MovieService,
    private uiService: UiService,
    private router: Router,
  ) {}

  getMovies() {
    this.movieSvc.getAll()
      .pipe(
        tap(
          (movies: Movie[]) => {
            this._movies.next(movies);
            this._filteredMovies.next(movies);
            movies.forEach(movie => {
              this._genres = [ ...this._genres, ...movie['genre'].split('|')];
              this._posters.push(movie['poster']);
              this._releaseYears.push(movie['releaseYear']);
            });
            this._genres = [ ...new Set(this._genres) ]
              .filter(cat => cat !== '(no genres listed)')
              .sort(Intl.Collator().compare);
            this._posters = [ ...new Set(this._posters) ];
            this._releaseYears = [ ...new Set(this._releaseYears) ].sort();
            this.setReleaseYearRanges();
            // console.log(this._genres, this._posters, this._releaseYears, this._releaseYearRanges);
            this.uiService.loading.next(false);
          }
        )
      ).subscribe();
  };

  getMovieById(movieId: number) {
    return this.movieSvc.get(movieId);
  };

  createMovie(movie: Movie) {
    this.uiService.loading.next(true);
    this.movieSvc.create(movie).pipe(
      tap((movie) => {
        this.getMovies();
        this.router.navigate(['movies']);
      }),
    ).subscribe();
  };

  modifyMovie(movie: Movie) {
    this.uiService.loading.next(true);
    this.movieSvc.update(movie).pipe(
      tap((movie) => {
        this.getMovies();
        this.router.navigate(['movies']);
      }),
    ).subscribe();
  };

  removeMovie(movieId: number) {
    this.uiService.loading.next(true);
    this.movieSvc.remove(movieId).pipe(
      tap((movie) => {
        this.getMovies();
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }),
    ).subscribe();
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

  sortMovies(propName: string, sortType: SortType) {
    if (sortType) {
      this._sortedProp.next(propName);
      this._filteredMovies.pipe(
        take(1),
        tap((filteredMovies) => {
          const sortTypeFns = {
            asc: (a: Movie, b: Movie) => a[propName] > b[propName] ? 1 : -1,
            desc: (a: Movie, b: Movie) => a[propName] < b[propName] ? 1 : -1,
          };

          this._filteredMovies.next(filteredMovies.sort(sortTypeFns[sortType]));
        }),
      ).subscribe();
    }
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
