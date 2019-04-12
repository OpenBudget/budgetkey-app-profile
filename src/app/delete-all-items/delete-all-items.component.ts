import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ListsService, SEARCHES_LIST } from 'budgetkey-ng2-components';

@Component({
  selector: 'app-delete-all-items',
  templateUrl: './delete-all-items.component.html',
  styleUrls: ['./delete-all-items.component.less']
})
export class DeleteAllItemsComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  constructor(private lists: ListsService) {}

  ngOnInit() {
  }

  delete() {
    this.lists.delete(SEARCHES_LIST, null)
              .subscribe((_) => {
                this.changed.emit(null);
              });
  }
}
