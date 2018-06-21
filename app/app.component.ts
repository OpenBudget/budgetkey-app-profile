import {Component} from '@angular/core';
import {ListsService, SEARCHES_LIST, ListItem} from 'budgetkey-ng2-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'my-app',
  template: ` 
      <budgetkey-container [showHeader]="true" [showSearchBar]="true">
        <div>
          <img class='logo' src='/assets/img/update_stars.svg'/>
          <span class='title'>ההתראות השמורות שלי</span>
          <ng-container *ngFor='let item of (items | async)'>
            <single-item *ngIf='item.properties && item.properties.term'
                        [item]='item' 
                        (changed)='updateItems()'
            ></single-item>
          </ng-container>
        </div>
      </budgetkey-container>
  `,
  styles: [
`
div {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-bottom: 50px;
}

.logo {
  margin-top: 50px;
  width: 170px;
}

.title {
  color: #FF5A5F;	
  font-family: "Miriam Libre";
  font-size: 28px;
  font-weight: bold;
  padding: 25px 0;
}
`
  ]
})
export class AppComponent {

  private items = new BehaviorSubject<Array<ListItem>>([]);

  constructor(private lists: ListsService) {
    this.updateItems();
  }

  updateItems() {
    this.lists.get(SEARCHES_LIST)
              .subscribe((lc) => {
                this.items.next(lc.items);
              });
  }

}
