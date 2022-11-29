import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take, tap } from 'rxjs';
import { MovieHandlerService } from 'src/app/service/movie-handler.service';
import { SortType } from '../model/sortType.type';

@Component({
  selector: 'app-sorting-button',
  templateUrl: './sorting-button.component.html',
  styleUrls: ['./sorting-button.component.scss']
})
export class SortingButtonComponent implements OnInit, OnDestroy {
  @Input() label = '';
  @Input() sortingProp = '';
  @Input() sortedProp: Observable<string> | undefined;
  @Output() sortType: EventEmitter<'asc' | 'desc' | ''> = new EventEmitter();

  public currIcon = new BehaviorSubject<string>('arrow-up-down');
  private icons: string[] = ['arrow-up-down', 'arrow-up', 'arrow-down'];
  private sortTypes: SortType[] = ['', 'asc', 'desc'];
  private sortedPropSubscription: Subscription | undefined;

  constructor(private movieHandlerSvc: MovieHandlerService) {}

  ngOnInit() {
    this.sortedPropSubscription = this.movieHandlerSvc.sortedProp.pipe(
      tap((sortedProp) => {
        if(sortedProp !== this.sortingProp) {
          this.currIcon.next('arrow-up-down');
        }
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sortedPropSubscription?.unsubscribe();
  }

  sort() {
    this.currIcon.pipe(
      take(1),
      tap((currIcon: string) => {
        const currIconIdx = this.icons.findIndex(icon => icon === currIcon);
        const nextIdx = (currIconIdx + 1) === this.icons.length ? 0 : currIconIdx + 1;
        this.currIcon.next(this.icons[nextIdx]);
        this.sortType.emit(this.sortTypes[nextIdx]);
      }),
    ).subscribe();
  }
}
