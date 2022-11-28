import { Component, Input } from '@angular/core';
import { Movie } from '../model/movie.model';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie: Movie | undefined;
  @Input() hasButton = true;
  @Input() hasInfo = true;

  constructor() {}
}
