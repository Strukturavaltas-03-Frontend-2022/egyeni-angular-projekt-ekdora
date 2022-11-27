import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';
import { DataObject } from '../model/data-object.interface';
import { Movie } from '../model/movie.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit, OnDestroy {
  @Input() movies$: Observable<Movie[]> | undefined;

  public pagenatedList: Movie[] = [];
  public showFilter = new BehaviorSubject<boolean>(false);
  public movieListForm: FormGroup;
  public genres = this.movieHandlerSvc.genres;
  public releaseYearRanges = this.movieHandlerSvc.releaseYearRanges;
  private showFilterSubscription: Subscription | undefined;

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

  ngOnInit() {
    this.showFilterSubscription = this.showFilter.subscribe(
      showFilter => !showFilter && this.movieHandlerSvc.filterMovies({})
    );
  }

  ngOnDestroy() {
    this.showFilterSubscription?.unsubscribe();
  }

  handlePage(event: Movie[]) {
    this.pagenatedList = event;
  }

  switchFilter(event: MatSlideToggleChange) {
    this.showFilter.next(event.checked);
  }

  filterMovies() {
    const formEntries = this.movieListForm.value;
    let modifiedFormEntries: DataObject = {};
    Object.keys(formEntries).forEach(formItemName => {
      const formEntry = formEntries[formItemName];
      if(formEntry) {
        modifiedFormEntries[formItemName] = formEntry;
      }
    });

    this.movieHandlerSvc.filterMovies(modifiedFormEntries);
  }
}
