import { Component, Input } from '@angular/core';
import { Movie } from '../model/movie.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];

  public pagenatedList: Movie[] = [];

  constructor() {}

  handlePage(event: Movie[]) {
    this.pagenatedList = event;
  }

}
