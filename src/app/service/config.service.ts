import { Injectable } from '@angular/core';

export interface IMenuItem {
  text: string;
  link: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  appName: string = 'My Movies';

  menuItems: IMenuItem[] = [
    { text: 'Home', link: '/', icon: 'home' },
    { text: 'Movie List', link: 'movies' },
    { text: 'Movie Editor', link: '' },
  ];

  constructor() { }
}
