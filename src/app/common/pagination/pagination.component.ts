import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { chunk } from 'lodash-es';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() listItems: any[] | undefined;
  @Output() pageElements: EventEmitter<any[]> = new EventEmitter();

  public currPage = 1;
  public maxPage = 1;
  public pageSizes = [5, 10, 20, 50, 100]
  public pageSize = 20;
  private chunkedList: any[] = [];

  constructor() {}

  ngOnInit() {
    this.setPaginator();
  }

  pager(right: boolean) {
    if (right && (this.currPage !== this.maxPage)) {
      this.currPage++;
      this.pageElements.emit(this.chunkedList[this.currPage - 1]);
    } else if (!right && this.currPage !== 1) {
      this.currPage--;
      this.pageElements.emit(this.chunkedList[this.currPage - 1]);
    };
  }

  jumpTo(end: boolean) {
    if (end) {
      this.currPage = this.maxPage;
      this.pageElements.emit(this.chunkedList[this.currPage - 1]);
    } else {
      this.currPage = 1;
      this.pageElements.emit(this.chunkedList[this.currPage - 1]);
    };
  }

  changePageSize(event: any) {
    this.pageSize = event.target.value;
    this.setPaginator();
  }

  private setPaginator() {
    this.chunkedList = chunk(this.listItems, this.pageSize);
    this.currPage = 1;
    this.maxPage = this.chunkedList.length;
    this.pageElements.emit(this.chunkedList[0]);
  }
}
