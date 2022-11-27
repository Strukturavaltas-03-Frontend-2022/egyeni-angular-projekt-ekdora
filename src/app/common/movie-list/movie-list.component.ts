import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';
import { Movie } from '../model/movie.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];

  public pagenatedList: Movie[] = [];
  public showFilter = false;
  public movieListForm: FormGroup;
  public genres = this.movieHandlerSvc.genres;
  public releaseYearRanges = this.movieHandlerSvc.releaseYearRanges;

  constructor(
    private movieHandlerSvc: MovieHandlerService,
    private fb: FormBuilder,
  ) {
    this.movieListForm = this.fb.group({
      title: [undefined, [Validators.minLength]],
      genre: [undefined],
      director: [undefined, [Validators.minLength]],
      releaseYear: [undefined],
      studio: [undefined, [Validators.minLength]],
    });
  }

  handlePage(event: Movie[]) {
    this.pagenatedList = event;
  }

  switchFilter() {
    this.showFilter = !this.showFilter;
  }

  filterMovies() {
    console.log(this.movieListForm.value);
  }
}
