export class Movie {
  [key: string]: any;
  id?: number = 0;
  title: string = '';
  genre: string = '';
  director: string = '';
  releaseYear: number = 0;
  poster: string = '';
  studio: string = '';
  active: boolean = false;
}
