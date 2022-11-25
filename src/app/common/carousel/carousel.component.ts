import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, fromEvent, Observable, Subscription, tap } from 'rxjs';
import { Movie } from '../movie.model';

let instanceCounter = 0;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() carouselItems: Observable<Movie[]> | undefined;

  public instance = ++instanceCounter;
  public maxPage = 0;
  public currPage = 0;
  private _carouselItems: Movie[] = []
  private carouselItemsSubscription: Subscription | undefined;
  private resizeSubscription: Subscription | undefined;
  private screen = {
    mobile: {
      buttonWidth: 10,
      cardsContainerWidth: 80,
      cardsWidth: 100,
      cardNum: 1,
      cardGap: 0,
      pageOffset: 100,
    },
    tablet: {
      buttonWidth: 5,
      cardsContainerWidth: 86,
      cardsWidth: 90,
      cardNum: 2,
      cardGap: 10,
      pageOffset: 110,
    },
    desktop: {
      buttonWidth: 4,
      cardsContainerWidth: 88,
      cardsWidth: 84,
      cardNum: 5,
      cardGap: 4,
      pageOffset: 104,
    },
  };
  private screenSize: 'mobile' | 'tablet' | 'desktop'  = 'desktop';
  private pageOffset = 0;
  private cardsWidth = 0;
  private buttonWidthVarName = '--carousel-button-width:';
  private buttonWidth = 0;
  private cardsContainerWidthVarName = '--carousel-cards-container-width:';
  private cardsContainerWidth = 0;
  private cardsWidthVarName = '--carousel-cards-width:';
  private cardNum = 0;
  private cardNumVarName = '--carousel-card-num:';
  private cardGap = 0;
  private cardGapVarName = '--carousel-card-gap:';
  private offset = 0;
  private offsetVarName = '--carousel-offset:';

  constructor() {
    this.screenSize = this.getScreenSize();
    this.init(this.screenSize);
  }

  ngOnInit(): void {
    this.carouselItemsSubscription = this.carouselItems?.subscribe((carouselItems) => {
      this._carouselItems = carouselItems;
      this.setMaxPage();
    })

    this.resizeSubscription = fromEvent(window, 'resize').pipe(
      debounceTime(100),
      tap(() => {
        const currScreenSize = this.getScreenSize();
        if (currScreenSize !== this.screenSize) {
          const nextCardNum = this.screen[currScreenSize].cardNum;
          const nextOffset = this.screen[currScreenSize].pageOffset;
          // order is important: the old value of cardNum used here
          this.currPage = Math.ceil((this.currPage * this.cardNum + 1) / nextCardNum - 1);
          // order is important: reassigning the value of cardNum
          this.init(currScreenSize);
          this.setMaxPage();
          // order is important: the calcPartialPageOffset function must use the new maxPage value
          this.offset = (nextOffset * (this.currPage - 1) + this.calcPartialPageOffset(nextOffset, true)) * -1;
          this.screenSize = currScreenSize;
          const carouselEl = this.getCarouselEl();
          carouselEl.style.cssText = this.getCssText();
        }
      }),
    ).subscribe();
  }

  ngAfterViewInit() {
    const carouselEl = this.getCarouselEl();
    carouselEl.style.cssText = this.getCssText();
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
    this.carouselItemsSubscription?.unsubscribe();
  }

  pager(next?: boolean) {
    if (next && (this.currPage !== this.maxPage)) {
      this.currPage++;
      this.turnPage(next);
    } else if (!next && this.currPage) {
      this.currPage--;
      this.turnPage(next);
    };
  }

  private turnPage(next?: boolean) {
    let partialPageOffset = this.calcPartialPageOffset(this.pageOffset, next);
    const carouselEl = this.getCarouselEl();
    const carouselCssVars = carouselEl.style.cssText.split(';');
    let carouselOffset = carouselCssVars[5].replace('--carousel-offset:', '');
    carouselOffset = carouselOffset.replace('%', '');
    this.offset = Number(carouselOffset) + Number(`${next ? '-' : ''}1`) * partialPageOffset;
    carouselEl.style.cssText = this.getCssText();
  }

  private calcPartialPageOffset(pageOffset: number, next?: boolean) {
    let partialPageOffset = pageOffset;
    const lastPageCards = this._carouselItems.length % this.cardNum

    if (lastPageCards > 0 && ((next && this.currPage === this.maxPage) || (!next && this.currPage === this.maxPage - 1))) {
      partialPageOffset = (partialPageOffset / this.cardNum) * (this._carouselItems.length % this.cardNum);
    }

    return partialPageOffset;
  }

  private getCarouselEl() {
    const carouselEl = document.querySelector(`#carousel-${this.instance}`);

    return (carouselEl as HTMLElement);
  }

  private getCssText() {
    const buttonWidth = `${this.buttonWidthVarName}${this.buttonWidth}%;`;
    const cardsContainerWidth = `${this.cardsContainerWidthVarName}${this.cardsContainerWidth}%;`;;
    const cardWidth = `${this.cardsWidthVarName}${this.cardsWidth}%;`;
    const cardNum = `${this.cardNumVarName}${this.cardNum};`;
    const cardGap = `${this.cardGapVarName}${this.cardGap}%;`;
    const offset = `${this.offsetVarName}${this.offset}%;`;

    return `${buttonWidth}${cardsContainerWidth}${cardWidth}${cardNum}${cardGap}${offset}`;
  }

  private getScreenSize() {
    const screenSize = window.innerWidth;

    return screenSize < 576 ? 'mobile' : screenSize < 992 ? 'tablet' : 'desktop';
  }

  private init(screenSize: 'mobile' | 'tablet' | 'desktop') {
    this.buttonWidth = this.screen[screenSize].buttonWidth;
    this.cardsContainerWidth = this.screen[screenSize].cardsContainerWidth;
    this.cardsWidth = this.screen[screenSize].cardsWidth;
    this.cardNum = this.screen[screenSize].cardNum;
    this.cardGap = this.screen[screenSize].cardGap;
    this.pageOffset = this.screen[screenSize].pageOffset;
  }

  private setMaxPage() {
    this.maxPage = Math.ceil(this._carouselItems.length / this.cardNum) - 1;
  }
}
