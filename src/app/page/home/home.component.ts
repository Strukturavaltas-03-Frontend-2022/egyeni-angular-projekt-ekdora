import { Component } from '@angular/core';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public last15YearsMovies$ = this.movieHandlerSvc.lastXYears(15);

  constructor(private movieHandlerSvc: MovieHandlerService) {}
}
