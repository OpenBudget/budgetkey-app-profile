import { Component, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListItem, ListsService, SEARCHES_LIST } from 'budgetkey-ng2-components';
import { AuthService } from 'budgetkey-ng2-auth';

declare const window: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  private items = new BehaviorSubject<Array<ListItem>>([]);
  private init = false;
  private hasItems = false;

  constructor(private lists: ListsService, private auth: AuthService) {
    this.updateItems();
  }

  updateItems() {
    this.auth.check(window.location.href)
             .subscribe((result) => {
               if (result) {
                if (!result.authenticated) {
                  this.init = true;
                  this.hasItems = false;
                  this.items.next([]);
                }
               }
             });
    this.lists.get(SEARCHES_LIST)
              .subscribe((lc) => {
                this.init = true;
                this.hasItems = lc.items && lc.items.length > 0;
                this.items.next(lc.items);
                this.refreshShareThis();
              });
  }

  ngAfterViewInit() {
    this.refreshShareThis();
  }

  refreshShareThis() {
    if (window.__sharethis__ && window.__sharethis__.initialize) {
      window.setTimeout(() => {
        window.__sharethis__.initialize();
      }, 1000);
    } else {
      console.log('Failed to find ShareThis buttons');
      window.setTimeout(() => {
        this.ngAfterViewInit();
      }, 3000);
    }
  }
}
