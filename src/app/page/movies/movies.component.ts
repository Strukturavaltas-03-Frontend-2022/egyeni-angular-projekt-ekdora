import { Component, OnInit } from '@angular/core';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  public movies$ = this.movieHandlerSvc.movies;

  constructor(private movieHandlerSvc: MovieHandlerService) { }

  ngOnInit(): void {
  }

}
