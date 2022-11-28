import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';
import { validatorWithMessageValidator } from '../common';

@Component({
  selector: 'app-movie-editor',
  templateUrl: './movie-editor.component.html',
  styleUrls: ['./movie-editor.component.scss']
})
export class MovieEditorComponent implements OnInit, AfterViewInit {

  public movieEditorForm: FormGroup;
  public posters = this.movieHandlerSvc.posters;
  public genres = this.movieHandlerSvc.genres;
  public yearMask = {
    mask: '1000',
    definitions: {
      '1': /[1-2]/
    }
  };
  private movieId: number;

  constructor(
    private movieHandlerSvc: MovieHandlerService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.movieEditorForm = this.fb.group({
      title: [undefined, [Validators.required, Validators.minLength]],
      genre: [undefined, [Validators.required,]],
      director: [undefined, [Validators.required, Validators.minLength]],
      releaseYear: [undefined, [Validators.required, validatorWithMessageValidator(this.releaseYearValidator, 'releaseYearError')]],
      poster: [undefined, [Validators.required,]],
      studio: [undefined, [Validators.required, Validators.minLength]],
      active: [false],
    });
    this.movieId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.movieHandlerSvc.getMovieById(this.movieId).subscribe((movie) => {
      if(this.movieId) {
        const modifiedMovie = {
          ...movie,
          genre: movie.genre.split('|'),
          releaseYear: movie.releaseYear.toString(),
        };
        this.movieEditorForm.patchValue(modifiedMovie);
      }
    });
  }

  save() {
    let modifiedMovie = this.movieEditorForm.value;
    let modifiedGenre = '';
    modifiedMovie.genre.forEach((g: string, idx: number) => {
      if(idx === 0) {
        modifiedGenre = g;
      } else {
        modifiedGenre = `${modifiedGenre}|${g}`;
      }
    });
    modifiedMovie = {
      ...modifiedMovie,
      genre: modifiedGenre
    };

    if(this.movieId) {
      modifiedMovie = {
        ...modifiedMovie,
        id: this.movieId
      };
      this.movieHandlerSvc.modifyMovie(modifiedMovie);
    } else {
      this.movieHandlerSvc.createMovie(modifiedMovie);
    }
  }

  private releaseYearValidator(text: string) {
    return !text || Number(text) > 1888 && Number(text) <= (new Date).getFullYear();
  }
}
