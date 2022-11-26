import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../common/model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  apiUrl: string = 'https://nettuts.hu/jms/ekdora/cinema';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  get(movieId: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}${movieId}`);
  }

  create(movie: Movie): Observable<Movie[]>{
    return this.http.post<Movie[]>(this.apiUrl, movie);
  }

  update(movie: Movie): Observable<Movie>{
    return this.http.put<Movie>(`${this.apiUrl}/${movie.id}`, movie);
  }

  remove(id: number): Observable<Movie>{
    return this.http.delete<Movie>(`${this.apiUrl}/${id}`);
  }
}
